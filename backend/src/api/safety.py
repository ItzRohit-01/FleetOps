from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import datetime
from src.supabase_client import db

router = APIRouter(prefix="/safety", tags=["Safety & Compliance"])

class IncidentUpdateStatus(BaseModel):
    status: str
    resolution_note: Optional[str] = None
    by: str = "Safety Officer"

@router.get("/incidents")
def list_incidents(status: Optional[str] = None, severity: Optional[str] = None):
    try:
        query = db.table("incidents").select("*, vehicles(*), drivers(*)")
        if status:
            query = query.eq("status", status)
        if severity:
            query = query.eq("severity", severity)
        res = query.order("timestamp", desc=True).execute()
        return {"data": res.data, "count": len(res.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/incidents/{incident_id}/status")
def update_incident_status(incident_id: str, body: IncidentUpdateStatus):
    try:
        inc_res = db.table("incidents").select("*").eq("id", incident_id).execute()
        if not inc_res.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        inc = inc_res.data[0]

        history = inc.get("action_history") or []
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        if body.resolution_note:
            history.append({
                "timestamp": now,
                "action": body.resolution_note,
                "by": body.by
            })

        update_payload = {
            "status": body.status,
            "action_history": history
        }
        if body.status == "resolved" and body.resolution_note:
            update_payload["resolution"] = body.resolution_note

        res = db.table("incidents").update(update_payload).eq("id", incident_id).execute()

        # Audit event
        db.table("operational_events").insert({
            "event_type": "INCIDENT_STATUS_UPDATED",
            "actor": body.by,
            "entity_type": "incident",
            "entity_id": incident_id,
            "details": {"new_status": body.status, "notes": body.resolution_note}
        }).execute()

        return {"data": res.data[0], "message": f"Incident {incident_id} updated to {body.status}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
