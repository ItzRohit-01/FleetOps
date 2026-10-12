from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from src.supabase_client import db

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

class VehicleUpdateStatus(BaseModel):
    status: str # available, assigned, on-trip, maintenance, offline
    reason: Optional[str] = None

class VehicleCreate(BaseModel):
    id: str
    reg_number: str
    type: str
    make: str
    model: str
    year: int = 2022
    capacity_kg: float
    fuel_type: str = "diesel"
    status: str = "available"
    depot: str
    mileage_km: float = 0

@router.get("")
def list_vehicles(status: Optional[str] = None, depot: Optional[str] = None):
    try:
        query = db.table("vehicles").select("*")
        if status:
            query = query.eq("status", status)
        if depot:
            query = query.eq("depot", depot)
        res = query.order("id").execute()
        return {"data": res.data, "count": len(res.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: str):
    try:
        res = db.table("vehicles").select("*").eq("id", vehicle_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        return {"data": res.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{vehicle_id}/status")
def update_vehicle_status(vehicle_id: str, body: VehicleUpdateStatus):
    valid_statuses = ["available", "assigned", "on-trip", "maintenance", "offline"]
    if body.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    try:
        # Check current vehicle
        v_res = db.table("vehicles").select("*").eq("id", vehicle_id).execute()
        if not v_res.data:
            raise HTTPException(status_code=404, detail="Vehicle not found")

        update_payload = {"status": body.status}
        if body.status == "maintenance":
            update_payload["current_job_id"] = None

        res = db.table("vehicles").update(update_payload).eq("id", vehicle_id).execute()

        # Log operational event
        db.table("operational_events").insert({
            "event_type": "VEHICLE_STATUS_CHANGED",
            "actor": "Fleet Operations",
            "entity_type": "vehicle",
            "entity_id": vehicle_id,
            "details": {"new_status": body.status, "reason": body.reason or "Dispatcher status update"}
        }).execute()

        return {"data": res.data[0], "message": f"Vehicle {vehicle_id} updated to {body.status}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
