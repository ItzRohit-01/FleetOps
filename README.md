# FleetOps AI — Autonomous AI Logistics Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

FleetOps AI is an enterprise-grade autonomous logistics operating system and fleet command center designed around an operational **Digital Twin** and an **Autonomous AI Dispatcher**.

---

## Repository Structure

```
FleetOps/
├── frontend/             # Autonomous AI Logistics Operating System UI
│   ├── src/
│   │   ├── components/   # UI components, layout shell, charts, badges, tables
│   │   ├── data/         # Mock data generator (48 vehicles, 35 drivers, 42 jobs, 12 incidents)
│   │   ├── lib/          # Utilities, formatters, and style helpers
│   │   ├── pages/        # Workspaces for Manager, Dispatcher, Safety, Analyst
│   │   ├── store/        # Zustand application state management
│   │   └── types.ts      # TypeScript domain entities and definitions
│   ├── public/           # Static assets, branding, and icons
│   ├── index.html        # HTML entry point
│   ├── vite.config.ts    # Vite bundler configuration
│   └── package.json      # Frontend dependencies & scripts
│
├── backend/              # AI Optimization Engine, Dispatcher Service & APIs
│   ├── src/              # Backend source code and algorithm services
│   └── README.md         # Backend architecture and roadmap
│
├── stitch/               # Reference design specifications & screen mocks
└── README.md             # Project documentation
```

---

## Workspaces & Role-Based Access

The platform includes four distinct, role-guarded operational workspaces:

1. **Fleet Director / Manager (`/manager`)**
   - **Overview**: High-level KPIs, 14-day SLA performance, active exceptions, AI recommendations feed.
   - **Digital Twin**: Simulated fleet state, depot breakdown, complete asset registry.
   - **AI Decisions**: Autonomous dispatch proposals, confidence scores, rationale, approve/override workflows.
   - **Operations**: In-transit fleet monitoring, delayed trip alerts, active delivery queue.
   - **Safety Summary**: Executive compliance posture, statutory certifications.
   - **Business Intelligence**: Asset productivity, fuel economy, unit economics.

2. **Senior Dispatcher (`/dispatcher`)**
   - **Dispatch Overview**: Queue tracking, available vehicles/drivers, urgent exceptions.
   - **AI Dispatcher**: Real-time automated pairing workbench with algorithmic constraint solver.
   - **Jobs & Trips**: Filterable job board with priority tags and status filters.
   - **Fleet Availability**: Ready-to-dispatch vehicles and driver duty rosters.
   - **Return Load Matching**: Backhaul freight pairing to minimize deadhead miles.
   - **Dispatch History**: Historical delivery ledger, delay analyses, and audit logs.

3. **Safety & Compliance Officer (`/safety`)**
   - **Safety Command Center**: Active accidents, breakdown escalations, risk watchlist.
   - **Incident Log**: Interactive incident investigation drawer with audit trails and resolution notes.
   - **Driver Safety**: Hours of Service (HOS) fatigue monitoring, safety ratings, violation strikes.
   - **Vehicle Compliance**: RTO fitness certificate, National Permit, and insurance validity registry.
   - **Risk Monitoring**: Live corridor risk assessment and telematics sensor feeds.
   - **Safety Reports**: Statutory compliance dossiers and audit package exports.

4. **Operations Analyst (`/analyst`)**
   - **Analytics Overview**: SLA attainment, fleet utilization, unit cost variance.
   - **Fleet Performance**: Tonnage-class efficiency, fuel consumption benchmarks.
   - **Cost & Profitability**: Operating expense breakdown and enterprise client margins.
   - **Delivery Analysis**: Delay root cause classification and hub dock dwell times.
   - **Empty Return Analysis**: Deadhead mileage tracking and backhaul ROI economics.
   - **AI Effectiveness**: Algorithmic accuracy metrics and operator override analysis.
   - **Analyst Reports**: Custom BI dossiers, CSV datasets, and ESG sustainability packs.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Select any of the four demo role profiles on the login page to enter the respective workspace.

### Building for Production

```bash
cd frontend
npm run build
```

---

## License

This project is licensed under the ISC License.
