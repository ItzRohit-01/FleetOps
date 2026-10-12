from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import datetime
from src.supabase_client import db

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin & Telemetry"])

class SimStepRequest(BaseModel):
    step_pct_increment: float = 5.0 # increments progress by 5% per step

@router.get("/state")
def get_digital_twin_state():
    """
    Returns full unified operational digital twin representation reading from real database records:
      - All vehicles with status, live coordinate and telemetry
      - Active trips with progress
      - Drivers and jobs
      - Regional hub summaries
    """
    try:
        vehicles_res = db.table("vehicles").select("*").execute()
        drivers_res = db.table("drivers").select("*").execute()
        jobs_res = db.table("jobs").select("*").execute()
        trips_res = db.table("trips").select("*").eq("status", "in-transit").execute()

        vehicles = vehicles_res.data or []
        drivers = drivers_res.data or []
        jobs = jobs_res.data or []
        active_trips = trips_res.data or []

        # Correlate active positions for vehicles on trip
        twin_assets = []
        for v in vehicles:
            trip = next((t for t in active_trips if t.get("vehicle_id") == v["id"]), None)
            driver = next((d for d in drivers if d["id"] == v.get("current_driver_id")), None)
            job = next((j for j in jobs if j["id"] == v.get("current_job_id")), None)

            # Location from trip or vehicle default
            lat = trip.get("current_lat") if trip and trip.get("current_lat") else v.get("location", {}).get("lat", 13.08)
            lng = trip.get("current_lng") if trip and trip.get("current_lng") else v.get("location", {}).get("lng", 80.27)

            twin_assets.append({
                "vehicle": v,
                "driver": driver,
                "job": job,
                "trip": trip,
                "telemetry": {
                    "lat": lat,
                    "lng": lng,
                    "speed_kmh": 58 if v["status"] == "on-trip" else 0,
                    "engine_status": "RUNNING" if v["status"] == "on-trip" else "IDLE",
                    "progress_pct": trip.get("progress_pct", 0) if trip else 0
                }
            })

        # Hub distribution
        depot_counts = {}
        for v in vehicles:
            d = v.get("depot", "Chennai Port Hub")
            depot_counts[d] = depot_counts.get(d, 0) + 1

        return {
            "assets": twin_assets,
            "total_assets": len(vehicles),
            "on_trip_count": len([v for v in vehicles if v["status"] == "on-trip"]),
            "available_count": len([v for v in vehicles if v["status"] == "available"]),
            "maintenance_count": len([v for v in vehicles if v["status"] == "maintenance"]),
            "depot_distribution": depot_counts,
            "simulation_mode": "DEMO_CORRIDOR_SIMULATION"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/step-simulation")
def step_simulation(body: SimStepRequest):
    """
    Advances simulated movement for all active trips along Indian corridors.
    When a trip reaches 100%, safely completes the trip, marks the job delivered, and frees the vehicle.
    """
    try:
        active_trips_res = db.table("trips").select("*").eq("status", "in-transit").execute()
        trips = active_trips_res.data or []

        advanced = []
        for trip in trips:
            curr_prog = float(trip.get("progress_pct", 0))
            new_prog = min(100.0, curr_prog + body.step_pct_increment)

            # Interpolate coordinates between Sriperumbudur (12.97, 79.94) and Bengaluru (12.97, 77.59)
            origin_lat, origin_lng = 12.97, 79.94
            dest_lat, dest_lng = 12.97, 77.59
            frac = new_prog / 100.0
            new_lat = round(origin_lat + (dest_lat - origin_lat) * frac, 4)
            new_lng = round(origin_lng + (dest_lng - origin_lng) * frac, 4)

            update_data = {
                "progress_pct": new_prog,
                "current_lat": new_lat,
                "current_lng": new_lng
            }

            # Check for completion
            if new_prog >= 100.0:
                update_data["status"] = "completed"
                update_data["completed_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()

                # Update job
                if trip.get("job_id"):
                    db.table("jobs").update({
                        "status": "delivered",
                        "actual_delivery": datetime.datetime.now(datetime.timezone.utc).isoformat()
                    }).eq("id", trip["job_id"]).execute()

                # Free vehicle
                if trip.get("vehicle_id"):
                    db.table("vehicles").update({
                        "status": "available",
                        "current_job_id": None
                    }).eq("id", trip["vehicle_id"]).execute()

                # Free driver
                if trip.get("driver_id"):
                    db.table("drivers").update({
                        "status": "available",
                        "current_job_id": None
                    }).eq("id", trip["driver_id"]).execute()

            db.table("trips").update(update_data).eq("id", trip["id"]).execute()
            advanced.append({
                "trip_id": trip["id"],
                "new_progress_pct": new_prog,
                "completed": new_prog >= 100.0
            })

        return {
            "message": f"Simulation stepped forward. Advanced {len(advanced)} active trip(s).",
            "trips": advanced
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
