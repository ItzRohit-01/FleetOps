from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import datetime
from src.supabase_client import db

router = APIRouter(prefix="/trips", tags=["Trips"])

class TripProgressUpdate(BaseModel):
    progress_pct: float
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    status: Optional[str] = "in-transit"

@router.get("")
def list_trips(status: Optional[str] = None):
    try:
        query = db.table("trips").select("*, jobs(*), vehicles(*), drivers(*)")
        if status:
            query = query.eq("status", status)
        res = query.order("started_at", desc=True).execute()
        return {"data": res.data, "count": len(res.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{trip_id}/progress")
def update_trip_progress(trip_id: str, body: TripProgressUpdate):
    try:
        payload = {"progress_pct": min(100.0, max(0.0, body.progress_pct))}
        if body.current_lat is not None:
            payload["current_lat"] = body.current_lat
        if body.current_lng is not None:
            payload["current_lng"] = body.current_lng
        if body.status:
            payload["status"] = body.status

        res = db.table("trips").update(payload).eq("id", trip_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Trip not found")

        # If trip reached 100%, trigger completion automatically
        if payload["progress_pct"] >= 100.0:
            trip = res.data[0]
            # Update trip
            db.table("trips").update({
                "status": "completed",
                "completed_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
            }).eq("id", trip_id).execute()

            # Update job to delivered
            if trip.get("job_id"):
                db.table("jobs").update({
                    "status": "delivered",
                    "actual_delivery": datetime.datetime.now(datetime.timezone.utc).isoformat()
                }).eq("id", trip["job_id"]).execute()

            # Free vehicle to available
            if trip.get("vehicle_id"):
                db.table("vehicles").update({
                    "status": "available",
                    "current_job_id": None
                }).eq("id", trip["vehicle_id"]).execute()

            # Free driver to available
            if trip.get("driver_id"):
                db.table("drivers").update({
                    "status": "available",
                    "current_job_id": None
                }).eq("id", trip["driver_id"]).execute()

        return {"data": res.data[0], "message": f"Trip {trip_id} progress updated to {body.progress_pct}%"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{trip_id}/complete")
def complete_trip(trip_id: str):
    try:
        t_res = db.table("trips").select("*").eq("id", trip_id).execute()
        if not t_res.data:
            raise HTTPException(status_code=404, detail="Trip not found")
        trip = t_res.data[0]

        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # 1. Update trip
        db.table("trips").update({
            "status": "completed",
            "progress_pct": 100,
            "completed_at": now
        }).eq("id", trip_id).execute()

        # 2. Update job
        if trip.get("job_id"):
            db.table("jobs").update({
                "status": "delivered",
                "actual_delivery": now
            }).eq("id", trip["job_id"]).execute()

        # 3. Update vehicle
        if trip.get("vehicle_id"):
            db.table("vehicles").update({
                "status": "available",
                "current_job_id": None
            }).eq("id", trip["vehicle_id"]).execute()

        # 4. Update driver
        if trip.get("driver_id"):
            db.table("drivers").update({
                "status": "available",
                "current_job_id": None
            }).eq("id", trip["driver_id"]).execute()

        # 5. Log audit event
        db.table("operational_events").insert({
            "event_type": "TRIP_COMPLETED",
            "actor": "System Dispatcher",
            "entity_type": "trip",
            "entity_id": trip_id,
            "details": {"job_id": trip.get("job_id"), "vehicle_id": trip.get("vehicle_id")}
        }).execute()

        return {"message": f"Trip {trip_id} completed successfully and assets returned to available"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
