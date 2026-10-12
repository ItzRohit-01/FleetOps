from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import datetime
from src.supabase_client import db

router = APIRouter(prefix="/jobs", tags=["Jobs"])

class JobCreate(BaseModel):
    customer: str
    origin: str
    destination: str
    cargo_type: str
    required_capacity_kg: float
    estimated_distance_km: float
    estimated_cost_inr: float
    priority: str = "medium"
    notes: Optional[str] = None

class JobUpdateStatus(BaseModel):
    status: str
    delay_minutes: Optional[int] = 0

@router.get("")
def list_jobs(status: Optional[str] = None):
    try:
        query = db.table("jobs").select("*")
        if status:
            query = query.eq("status", status)
        res = query.order("created_at", desc=True).execute()
        return {"data": res.data, "count": len(res.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
def create_job(body: JobCreate):
    try:
        # Generate new job number
        count_res = db.table("jobs").select("id", count="exact").execute()
        next_num = (count_res.count or 0) + 1
        job_id = f"J{str(next_num).zfill(3)}"
        job_number = f"TO-2610-{str(next_num).zfill(3)}"

        payload = {
            "id": job_id,
            "job_number": job_number,
            "customer": body.customer,
            "origin": body.origin,
            "destination": body.destination,
            "cargo_type": body.cargo_type,
            "required_capacity_kg": body.required_capacity_kg,
            "estimated_distance_km": body.estimated_distance_km,
            "estimated_cost_inr": body.estimated_cost_inr,
            "priority": body.priority,
            "status": "unassigned",
            "notes": body.notes,
            "scheduled_pickup": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "scheduled_delivery": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=6)).isoformat()
        }

        res = db.table("jobs").insert(payload).execute()

        # Audit event
        db.table("operational_events").insert({
            "event_type": "JOB_CREATED",
            "actor": "Dispatcher",
            "entity_type": "job",
            "entity_id": job_id,
            "details": {"job_number": job_number, "customer": body.customer}
        }).execute()

        return {"data": res.data[0], "message": f"Job {job_number} created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{job_id}/status")
def update_job_status(job_id: str, body: JobUpdateStatus):
    valid = ["unassigned", "assigned", "in-transit", "delivered", "cancelled"]
    if body.status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid job status. Must be one of {valid}")

    try:
        payload = {"status": body.status}
        if body.delay_minutes is not None:
            payload["delay_minutes"] = body.delay_minutes

        if body.status == "delivered":
            payload["actual_delivery"] = datetime.datetime.now(datetime.timezone.utc).isoformat()

        res = db.table("jobs").update(payload).eq("id", job_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Job not found")

        return {"data": res.data[0], "message": f"Job {job_id} updated to {body.status}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
