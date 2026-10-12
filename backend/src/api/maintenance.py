from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import datetime
import uuid
from src.supabase_client import db

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


class MaintenanceCreate(BaseModel):
    vehicle_id: str
    issue: str
    estimated_return: Optional[str] = None  # ISO date
    cost_inr: Optional[float] = 0


class MaintenanceStatusUpdate(BaseModel):
    status: str  # open | in-progress | completed
    notes: Optional[str] = None
    by: str = "Fleet Manager"


@router.get("")
def list_maintenance(status: Optional[str] = None, vehicle_id: Optional[str] = None):
    """List all maintenance records, optionally filtered by status or vehicle."""
    try:
        query = db.table("maintenance_records").select("*, vehicles(*)")
        if status:
            query = query.eq("status", status)
        if vehicle_id:
            query = query.eq("vehicle_id", vehicle_id)
        res = query.order("created_at", desc=True).execute()
        return {"data": res.data, "count": len(res.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("")
def create_maintenance(body: MaintenanceCreate):
    """
    Create a maintenance record and mark the vehicle as 'maintenance'.
    A vehicle under maintenance is immediately excluded from dispatch.
    """
    try:
        # Validate vehicle exists
        v_res = db.table("vehicles").select("id, status, reg_number").eq("id", body.vehicle_id).execute()
        if not v_res.data:
            raise HTTPException(status_code=404, detail=f"Vehicle {body.vehicle_id} not found")

        vehicle = v_res.data[0]

        rec_id = f"MAINT-{uuid.uuid4().hex[:6].upper()}"
        payload = {
            "id": rec_id,
            "vehicle_id": body.vehicle_id,
            "issue": body.issue,
            "status": "open",
            "service_date": datetime.date.today().isoformat(),
            "cost_inr": body.cost_inr or 0,
        }
        if body.estimated_return:
            payload["estimated_return"] = body.estimated_return

        rec_res = db.table("maintenance_records").insert(payload).execute()

        # Mark vehicle as maintenance — excludes from dispatch
        db.table("vehicles").update({
            "status": "maintenance",
            "current_job_id": None
        }).eq("id", body.vehicle_id).execute()

        # Audit event
        db.table("operational_events").insert({
            "event_type": "MAINTENANCE_OPENED",
            "actor": "Fleet Manager",
            "entity_type": "maintenance_record",
            "entity_id": rec_id,
            "details": {
                "vehicle_id": body.vehicle_id,
                "reg_number": vehicle.get("reg_number"),
                "issue": body.issue,
                "estimated_return": body.estimated_return
            }
        }).execute()

        return {
            "data": rec_res.data[0],
            "message": f"Maintenance record {rec_id} created. Vehicle {body.vehicle_id} marked as maintenance."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{record_id}/status")
def update_maintenance_status(record_id: str, body: MaintenanceStatusUpdate):
    """
    Update maintenance status. When completed, return vehicle to 'available'.
    Valid transitions: open → in-progress → completed
    """
    valid_statuses = ["open", "in-progress", "completed"]
    if body.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")

    try:
        rec_res = db.table("maintenance_records").select("*").eq("id", record_id).execute()
        if not rec_res.data:
            raise HTTPException(status_code=404, detail="Maintenance record not found")
        rec = rec_res.data[0]

        update_payload = {"status": body.status}

        db.table("maintenance_records").update(update_payload).eq("id", record_id).execute()

        # When maintenance is completed, return vehicle to available
        if body.status == "completed" and rec.get("vehicle_id"):
            db.table("vehicles").update({
                "status": "available",
                "last_service_date": datetime.date.today().isoformat()
            }).eq("id", rec["vehicle_id"]).execute()

            db.table("operational_events").insert({
                "event_type": "MAINTENANCE_COMPLETED",
                "actor": body.by,
                "entity_type": "maintenance_record",
                "entity_id": record_id,
                "details": {
                    "vehicle_id": rec["vehicle_id"],
                    "notes": body.notes or "Service completed"
                }
            }).execute()

        return {
            "data": rec,
            "message": f"Maintenance record {record_id} updated to {body.status}",
            "vehicle_returned_to_available": body.status == "completed"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
