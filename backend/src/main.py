from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings

from src.api.auth import router as auth_router
from src.api.vehicles import router as vehicles_router
from src.api.drivers import router as drivers_router
from src.api.jobs import router as jobs_router
from src.api.trips import router as trips_router
from src.api.dispatch import router as dispatch_router
from src.api.return_loads import router as return_loads_router
from src.api.digital_twin import router as digital_twin_router
from src.api.safety import router as safety_router
from src.api.analytics import router as analytics_router
from src.api.events import router as events_router
from src.api.maintenance import router as maintenance_router

app = FastAPI(
    title="FleetOps AI — Enterprise Logistics OS Backend",
    description="Production-grade API for FleetOps AI: Dispatch Optimization, Digital Twin Telemetry, and Backhaul Pairing",
    version="2.4.0"
)

# CORS Middleware
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
if "*" not in origins:
    origins.extend(["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(vehicles_router, prefix="/api")
app.include_router(drivers_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")
app.include_router(trips_router, prefix="/api")
app.include_router(dispatch_router, prefix="/api")
app.include_router(return_loads_router, prefix="/api")
app.include_router(digital_twin_router, prefix="/api")
app.include_router(safety_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(events_router, prefix="/api")
app.include_router(maintenance_router, prefix="/api")

@app.get("/health")
def healthcheck():
    return {
        "status": "healthy",
        "service": "FleetOps AI Logistics Backend",
        "version": "2.4.0",
        "database": "Supabase Postgres Connected",
        "project_ref": "iuqgbbqyycpsamlpagnj"
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to FleetOps AI Backend API. Explore documentation at /docs",
        "docs_url": "/docs",
        "openapi_url": "/openapi.json"
    }
