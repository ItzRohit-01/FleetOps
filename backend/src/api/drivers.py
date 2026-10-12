from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from src.supabase_client import db

router = APIRouter(prefix="/drivers", tags=["Drivers"])

class DriverUpdateStatus(BaseModel):
    status: str
    hours_this_week: Optional[float] = None

@router.get("")
def list_drivers(status: Optional[str] = None):
    try:
        query = db.table("drivers").select("*")
        if status:
            query = query.eq("status", status)
        res = query.order("id").execute()
        return {"data": res.data, "count": len(res.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{driver_id}")
def get_driver(driver_id: str):
    try:
        res = db.table("drivers").select("*").eq("id", driver_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Driver not found")
        return {"data": res.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{driver_id}/status")
def update_driver_status(driver_id: str, body: DriverUpdateStatus):
    valid = ["available", "assigned", "on-trip", "off-duty", "on-leave"]
    if body.status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid}")

    try:
        payload = {"status": body.status}
        if body.hours_this_week is not None:
            payload["hours_this_week"] = body.hours_this_week

        res = db.table("drivers").update(payload).eq("id", driver_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Driver not found")

        return {"data": res.data[0], "message": f"Driver {driver_id} status updated to {body.status}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
