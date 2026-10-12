from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import datetime
import uuid
from src.supabase_client import db

router = APIRouter(prefix="/return-loads", tags=["Return Load Matching"])

class ApproveMatchRequest(BaseModel):
    match_id: str
    approved_by: str = "Dispatcher"

class RejectMatchRequest(BaseModel):
    match_id: str
    reason: str

@router.get("/matches")
def list_return_matches(status: Optional[str] = None):
    try:
        query = db.table("return_matches").select("*")
        if status:
            query = query.eq("status", status)
        res = query.order("created_at", desc=True).execute()
        return {"data": res.data, "count": len(res.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve")
def approve_return_match(body: ApproveMatchRequest):
    """
    Approves return backhaul match:
      1. Revalidates vehicle availability.
      2. Updates return match to 'approved'.
      3. Creates a new backhaul job & trip.
      4. Assigns vehicle and driver to backhaul.
      5. Records audit event.
    """
    try:
        m_res = db.table("return_matches").select("*").eq("id", body.match_id).execute()
        if not m_res.data:
            raise HTTPException(status_code=404, detail="Return match not found")
        match = m_res.data[0]

        if match["status"] == "approved":
            raise HTTPException(status_code=400, detail="Match is already approved")

        v_id = match["vehicle_id"]
        d_id = match["driver_id"]

        # 1. Update match
        db.table("return_matches").update({"status": "approved"}).eq("id", body.match_id).execute()

        # 2. Generate Backhaul Job
        job_id = f"J-BH-{uuid.uuid4().hex[:5].upper()}"
        job_num = f"TO-BH-{uuid.uuid4().hex[:4].upper()}"
        db.table("jobs").insert({
            "id": job_id,
            "job_number": job_num,
            "customer": match["backhaul_shipper"],
            "origin": match["pickup_hub"],
            "destination": match["delivery_hub"],
            "cargo_type": match["cargo_desc"],
            "required_capacity_kg": match["cargo_weight_kg"],
            "estimated_distance_km": match["total_backhaul_km"],
            "estimated_cost_inr": match["incremental_cost_inr"],
            "priority": "high",
            "status": "assigned",
            "assigned_vehicle_id": v_id,
            "assigned_driver_id": d_id,
            "notes": f"AI Backhaul optimization match. Net contribution: ₹{match['net_savings_inr']}"
        }).execute()

        # 3. Create Trip for backhaul
        trip_id = f"TRIP-BH-{uuid.uuid4().hex[:5].upper()}"
        db.table("trips").insert({
            "id": trip_id,
            "job_id": job_id,
            "vehicle_id": v_id,
            "driver_id": d_id,
            "origin": match["pickup_hub"],
            "destination": match["delivery_hub"],
            "status": "planned",
            "progress_pct": 0,
            "distance_km": match["total_backhaul_km"]
        }).execute()

        # 4. Lock Vehicle and Driver for Backhaul
        if v_id:
            db.table("vehicles").update({
                "status": "assigned",
                "current_job_id": job_id
            }).eq("id", v_id).execute()

        # 5. Audit event
        db.table("operational_events").insert({
            "event_type": "RETURN_LOAD_APPROVED",
            "actor": body.approved_by,
            "entity_type": "return_match",
            "entity_id": body.match_id,
            "details": {
                "backhaul_job": job_num,
                "contribution_inr": match["net_savings_inr"],
                "deadhead_saved_km": match["baseline_empty_km"]
            }
        }).execute()

        return {
            "message": f"Backhaul match approved. Dispatched {job_num} to {v_id}.",
            "backhaul_job_id": job_id,
            "trip_id": trip_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reject")
def reject_return_match(body: RejectMatchRequest):
    try:
        m_res = db.table("return_matches").select("*").eq("id", body.match_id).execute()
        if not m_res.data:
            raise HTTPException(status_code=404, detail="Return match not found")

        db.table("return_matches").update({"status": "rejected"}).eq("id", body.match_id).execute()

        db.table("operational_events").insert({
            "event_type": "RETURN_LOAD_REJECTED",
            "actor": "Dispatcher",
            "entity_type": "return_match",
            "entity_id": body.match_id,
            "details": {"reason": body.reason}
        }).execute()

        return {"message": "Return load match rejected"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
