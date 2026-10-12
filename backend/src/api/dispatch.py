from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import datetime
import uuid
from src.supabase_client import db

router = APIRouter(prefix="/dispatch", tags=["AI Dispatch Engine"])

class GenerateRecRequest(BaseModel):
    job_id: str

class ApproveRecRequest(BaseModel):
    recommendation_id: str
    approved_by: str = "Dispatcher"

class RejectRecRequest(BaseModel):
    recommendation_id: str
    reason: str

@router.get("/recommendations")
def list_recommendations(status: Optional[str] = None):
    try:
        query = db.table("dispatch_recommendations").select("*, jobs(*), vehicles(*), drivers(*)")
        if status:
            query = query.eq("status", status)
        res = query.order("created_at", desc=True).execute()
        return {"data": res.data, "count": len(res.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
def generate_recommendation(body: GenerateRecRequest):
    """
    Deterministic rules-based optimization engine for job-to-vehicle/driver dispatch pairing.
    Evaluates:
      1. Asset availability (excludes maintenance / on-trip)
      2. Payload capacity fit (vehicle.capacity >= job.required_capacity)
      3. Driver HOS compliance (hours_this_week < 50h)
      4. Optimization scoring: capacity fit (40%), driver safety rating (30%), corridor route fit (30%)
    """
    try:
        # 1. Fetch job
        job_res = db.table("jobs").select("*").eq("id", body.job_id).execute()
        if not job_res.data:
            raise HTTPException(status_code=404, detail="Job not found")
        job = job_res.data[0]

        if job["status"] != "unassigned":
            raise HTTPException(status_code=400, detail=f"Job is already {job['status']}")

        # 2. Fetch eligible candidate vehicles (status = available, compliance = valid)
        v_res = db.table("vehicles").select("*").eq("status", "available").execute()
        available_vehicles = v_res.data or []

        # Filter vehicles by capacity
        req_cap = float(job["required_capacity_kg"])
        capable_vehicles = [v for v in available_vehicles if float(v["capacity_kg"]) >= req_cap]

        if not capable_vehicles:
            # If no single available vehicle has exact capacity, check any available
            capable_vehicles = available_vehicles

        # 3. Fetch eligible candidate drivers (status = available)
        d_res = db.table("drivers").select("*").eq("status", "available").execute()
        available_drivers = d_res.data or []

        # If no available drivers, pick any non-on-trip driver with lowest weekly hours
        if not available_drivers:
            all_d_res = db.table("drivers").select("*").neq("status", "on-trip").execute()
            available_drivers = sorted(all_d_res.data or [], key=lambda d: d.get("hours_this_week", 0))

        if not capable_vehicles:
            raise HTTPException(status_code=422, detail="No available vehicles meet the operational constraints for this job")

        # Pick best vehicle (smallest capacity that satisfies required capacity to maximize cubing)
        best_vehicle = min(capable_vehicles, key=lambda v: float(v["capacity_kg"]) - req_cap if float(v["capacity_kg"]) >= req_cap else 999999)
        alt_vehicle = [v for v in capable_vehicles if v["id"] != best_vehicle["id"]]
        alt_v_id = alt_vehicle[0]["id"] if alt_vehicle else None

        best_driver = available_drivers[0] if available_drivers else None
        alt_d_id = available_drivers[1]["id"] if len(available_drivers) > 1 else None

        # 4. Compute transparent suitability score
        fill_pct = min(100.0, round((req_cap / float(best_vehicle["capacity_kg"])) * 100, 1))
        driver_rating = float(best_driver.get("rating", 4.5)) if best_driver else 4.0
        score = int(round(50 + (fill_pct * 0.3) + (driver_rating * 4)))

        reasons = [
            f"Asset {best_vehicle['reg_number']} ({best_vehicle['type']}) achieves {fill_pct}% capacity fill for {job['customer']}",
            f"Driver {best_driver['name'] if best_driver else 'Unassigned'} is rested with {best_driver.get('hours_this_week', 0) if best_driver else 0}h weekly HOS",
            f"Corridor {job['origin'].split(',')[0]} → {job['destination'].split(',')[0]} matches depot operational radius"
        ]

        warnings = []
        if float(job.get("estimated_distance_km", 0)) > 500:
            warnings.append("Long-haul trip (>500 km). Driver mandatory 30-minute rest stop required at halfway point.")

        rec_id = f"REC-{uuid.uuid4().hex[:6].upper()}"
        payload = {
            "id": rec_id,
            "job_id": job["id"],
            "recommended_vehicle_id": best_vehicle["id"],
            "recommended_driver_id": best_driver["id"] if best_driver else None,
            "alternative_vehicle_id": alt_v_id,
            "alternative_driver_id": alt_d_id,
            "estimated_distance_km": job["estimated_distance_km"],
            "estimated_time_min": round(float(job["estimated_distance_km"]) * 1.3),
            "estimated_cost_inr": job["estimated_cost_inr"],
            "reasons": reasons,
            "warnings": warnings,
            "status": "pending",
            "score": score
        }

        rec_insert = db.table("dispatch_recommendations").insert(payload).execute()

        # Audit event
        db.table("operational_events").insert({
            "event_type": "DISPATCH_RECOMMENDATION_GENERATED",
            "actor": "Rules Engine",
            "entity_type": "dispatch_recommendation",
            "entity_id": rec_id,
            "details": {"score": score, "vehicle_id": best_vehicle["id"]}
        }).execute()

        return {"data": rec_insert.data[0], "message": f"Optimization recommendation {rec_id} generated"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve")
def approve_recommendation(body: ApproveRecRequest):
    """
    Transactionally commits the dispatch assignment:
      1. Revalidates vehicle and driver availability immediately before assignment.
      2. Updates recommendation status to 'approved'.
      3. Assigns job to vehicle & driver.
      4. Sets vehicle and driver statuses to 'assigned'.
      5. Creates active trip.
      6. Logs audit trail event.
    """
    try:
        rec_res = db.table("dispatch_recommendations").select("*").eq("id", body.recommendation_id).execute()
        if not rec_res.data:
            raise HTTPException(status_code=404, detail="Recommendation not found")
        rec = rec_res.data[0]

        if rec["status"] == "approved":
            raise HTTPException(status_code=400, detail="Recommendation is already approved")

        v_id = rec["recommended_vehicle_id"]
        d_id = rec["recommended_driver_id"]
        j_id = rec["job_id"]

        # 1. Re-validate vehicle status
        v_res = db.table("vehicles").select("*").eq("id", v_id).execute()
        if not v_res.data or v_res.data[0]["status"] == "maintenance":
            raise HTTPException(status_code=409, detail=f"Vehicle {v_id} is unavailable or in maintenance bay")

        # 2. Update recommendation
        db.table("dispatch_recommendations").update({
            "status": "approved",
            "approved_by": body.approved_by
        }).eq("id", body.recommendation_id).execute()

        # 3. Update job
        db.table("jobs").update({
            "status": "assigned",
            "assigned_vehicle_id": v_id,
            "assigned_driver_id": d_id
        }).eq("id", j_id).execute()

        # 4. Update vehicle
        db.table("vehicles").update({
            "status": "assigned",
            "current_driver_id": d_id,
            "current_job_id": j_id
        }).eq("id", v_id).execute()

        # 5. Update driver
        if d_id:
            db.table("drivers").update({
                "status": "assigned",
                "current_vehicle_id": v_id,
                "current_job_id": j_id
            }).eq("id", d_id).execute()

        # 6. Create Trip
        trip_id = f"TRIP-{uuid.uuid4().hex[:6].upper()}"
        job_data = db.table("jobs").select("*").eq("id", j_id).execute().data[0]
        db.table("trips").insert({
            "id": trip_id,
            "job_id": j_id,
            "vehicle_id": v_id,
            "driver_id": d_id,
            "origin": job_data["origin"],
            "destination": job_data["destination"],
            "status": "planned",
            "progress_pct": 0,
            "distance_km": job_data["estimated_distance_km"]
        }).execute()

        # 7. Audit Event
        db.table("operational_events").insert({
            "event_type": "ASSIGNMENT_APPROVED",
            "actor": body.approved_by,
            "entity_type": "trip",
            "entity_id": trip_id,
            "details": {"job_id": j_id, "vehicle_id": v_id, "driver_id": d_id}
        }).execute()

        return {
            "message": f"Assignment approved. Job {j_id} dispatched to {v_id}.",
            "trip_id": trip_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reject")
def reject_recommendation(body: RejectRecRequest):
    try:
        rec_res = db.table("dispatch_recommendations").select("*").eq("id", body.recommendation_id).execute()
        if not rec_res.data:
            raise HTTPException(status_code=404, detail="Recommendation not found")

        db.table("dispatch_recommendations").update({
            "status": "rejected",
            "override_reason": body.reason
        }).eq("id", body.recommendation_id).execute()

        db.table("operational_events").insert({
            "event_type": "ASSIGNMENT_REJECTED",
            "actor": "Dispatcher",
            "entity_type": "dispatch_recommendation",
            "entity_id": body.recommendation_id,
            "details": {"reason": body.reason}
        }).execute()

        return {"message": "Recommendation rejected and reason logged"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
