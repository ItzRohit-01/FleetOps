# FleetOps AI — Backend Services & Dispatch Optimization Engine

This directory contains the backend services and architecture for **FleetOps AI — Autonomous AI Logistics Operating System**.

## Architecture Overview

The backend will power the operational digital twin, neural dispatch pairing, real-time telematics ingestion, and statutory compliance workflows:

```
backend/
├── src/
│   ├── api/            # REST and WebSocket API endpoints
│   ├── services/       # Core business logic (Dispatch, Telematics, Safety, BI)
│   ├── engine/         # AI & Operations Research Dispatch Optimization algorithms
│   ├── models/         # Database models & schemas
│   └── utils/          # Shared utilities and helpers
├── config/             # Environment and server configuration
└── tests/              # Unit and integration test suites
```

## Planned Service Modules

1. **AI Dispatch & Optimization Engine**
   - Mixed-Integer Linear Programming (MILP) & Heuristic dispatch pairing
   - Backhaul matching & empty-return minimization
   - Hours of Service (HOS) fatigue constraints enforcement

2. **Digital Twin & Telematics Ingestion**
   - High-throughput IoT GPS stream processing
   - Speeding, harsh braking, and geo-fencing anomaly detection
   - Vehicle health & maintenance predictive analytics

3. **Statutory Compliance & Safety**
   - Automated RTO fitness certificate tracking
   - National permit renewal reminders
   - Incident investigation lifecycle management

4. **Database & Persistence**
   - PostgreSQL / Supabase with row-level security (RLS)
   - Real-time subscriptions for fleet dispatch dispatchers
