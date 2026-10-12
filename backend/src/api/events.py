from fastapi import APIRouter, HTTPException
from src.supabase_client import db

router = APIRouter(prefix="/events", tags=["Operational Audit Events"])

@router.get("")
def list_events(limit: int = 20):
    try:
        res = db.table("operational_events").select("*").order("created_at", desc=True).limit(limit).execute()
        return {"data": res.data or [], "count": len(res.data or [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
