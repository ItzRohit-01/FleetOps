import { SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'

const CORRIDOR_RISKS = [
  { corridor: 'NH-48 (Mumbai – Pune – Bengaluru)', status: 'Elevated Risk', riskFactor: 'Monsoon Ghat section road slippery & heavy freight volume', incidents30d: 8, severity: 'high' },
  { corridor: 'NH-16 (Chennai – Visakhapatnam – Kolkata)', status: 'Moderate Risk', riskFactor: 'Highway widening work near Nellore & night illumination gap', incidents30d: 5, severity: 'medium' },
  { corridor: 'NH-44 (Delhi – Agra – Nagpur – Hyderabad)', status: 'Low Risk', riskFactor: 'Clear multi-lane expressway, normal seasonal traffic', incidents30d: 2, severity: 'low' },
  { corridor: 'NH-8 (Delhi – Jaipur – Ahmedabad)', status: 'Elevated Risk', riskFactor: 'Dense commercial truck traffic & high average cruising speed', incidents30d: 6, severity: 'high' },
]

const TELEMATICS_FEEDS = [
  { time: '10:42 AM', vehicle: 'GJ09EF7890', driver: 'Harish Patel', event: 'Excessive Speed (104 km/h)', risk: 'high', location: 'Surat bypass' },
  { time: '10:28 AM', vehicle: 'DL08MN8901', driver: 'Rohit Verma', event: 'Continuous driving without rest (6.2h)', risk: 'high', location: 'Delhi–Gurgaon' },
  { time: '09:55 AM', vehicle: 'MH12AB2345', driver: 'Suresh Patil', event: 'Harsh Braking Event (-4.2 m/s²)', risk: 'medium', location: 'Uruli Kanchan' },
  { time: '09:12 AM', vehicle: 'WB01AB5678', driver: 'Subir Das', event: 'Axle load sensor warning (+8.8%)', risk: 'medium', location: 'Durgapur Toll' },
  { time: '08:40 AM', vehicle: 'TN01ST1234', driver: 'Murugan Selvam', event: 'Sudden temperature spike in engine block', risk: 'high', location: 'Nellore Bypass' },
]

export default function RiskMonitoringPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Predictive Risk & Telematics Monitoring</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Real-time AI telemetry screening for driver fatigue, harsh maneuvers, route hazards, and weather risk
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Corridors Under Watch"
          value="4 Freight Corridors"
          icon="alt_route"
          iconColor="#0ea5e9"
          subtext="2 corridors in elevated risk status"
        />
        <KpiCard
          label="Active Telematics Alerts"
          value="5 Today"
          icon="sensors"
          iconColor="#ef4444"
          subtext="Speeding, HOS fatigue & axle overload"
        />
        <KpiCard
          label="AI Prevented Accidents"
          value="14 This Month"
          icon="health_and_safety"
          iconColor="#10b981"
          subtext="Early warning fatigue stops enforced"
        />
        <KpiCard
          label="Harsh Event Index"
          value="1.8 per 1,000 km"
          icon="speed"
          iconColor="#8b5cf6"
          subtext="Below national industry threshold of 3.2"
        />
      </KpiGrid>

      <PageGrid cols={2}>
        <SectionCard
          title="Freight Corridor Risk Assessment"
          subtitle="Real-time hazardous segment intelligence and route warnings"
        >
          <div className="space-y-3">
            {CORRIDOR_RISKS.map((c, i) => (
              <div
                key={i}
                className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">{c.corridor}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    c.severity === 'high' ? 'bg-danger/10 text-danger' : c.severity === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-on-surface-variant">{c.riskFactor}</p>
                <div className="flex justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
                  <span>30-Day Incident Frequency: <strong className="text-on-surface">{c.incidents30d}</strong></span>
                  <span>Safety Escort: {c.severity === 'high' ? 'Recommended' : 'Standard'}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Live Telemetry Event Stream"
          subtitle="Direct sensor alerts from onboard IoT & electronic logging devices"
        >
          <div className="space-y-2.5">
            {TELEMATICS_FEEDS.map((t, i) => (
              <div
                key={i}
                className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-on-surface-variant">{t.time}</span>
                    <span className="font-semibold text-on-surface">{t.event}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    <strong className="text-on-surface">{t.vehicle}</strong> · {t.driver} · 📍 {t.location}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  t.risk === 'high' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                }`}>
                  {t.risk}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageGrid>
    </div>
  )
}
