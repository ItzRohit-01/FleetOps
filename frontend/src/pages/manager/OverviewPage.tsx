import { useState } from 'react'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { ChartContainer, SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import FleetStatusChart from '../../components/charts/FleetStatusChart'
import { PerformanceTrendChart } from '../../components/charts/TrendCharts'
import StatusBadge from '../../components/ui/StatusBadge'
import { todayKpis, jobs, vehicles, recommendations } from '../../data/mockData'
import { formatINR, relativeTime } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'
import {
  Truck,
  Clock,
  AlertTriangle,
  TrendingUp,
  Bot,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const activityFeed = [
  { icon: CheckCircle2, color: 'text-success', text: 'J034 (Nestlé India) delivered on time to Delhi Warehouse', time: '2026-10-11T06:55:00', tag: 'Delivery' },
  { icon: Bot, color: 'text-accent-ai', text: 'AI Dispatcher generated 4 new recommendations for evening shift', time: '2026-10-11T05:00:00', tag: 'AI Dispatch' },
  { icon: AlertTriangle, color: 'text-danger', text: 'V011 engine failure on NH-16 Nellore bypass — mechanic team on site', time: '2026-10-11T07:50:00', tag: 'Breakdown' },
  { icon: Truck, color: 'text-info', text: 'V001 (Ramesh Kumar) departed Mumbai for Pune — J001 in transit', time: '2026-10-11T06:20:00', tag: 'Departure' },
  { icon: Activity, color: 'text-warning', text: 'V042 entered maintenance bay — estimated release Oct 14', time: '2026-10-09T16:00:00', tag: 'Maintenance' },
  { icon: ShieldAlert, color: 'text-danger', text: 'D004 (Vijay Yadav) collision reported at Nadiad — investigation open', time: '2026-10-11T09:22:00', tag: 'Incident' },
]

export default function OverviewPage() {
  const storeJobs = useAppStore(s => s.jobs)
  const storeVehicles = useAppStore(s => s.vehicles)
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high'>('all')

  const unassigned = storeJobs.filter(j => j.status === 'unassigned').length
  const delayed = storeJobs.filter(j => j.status === 'in-transit' && (j.delayMinutes ?? 0) > 0).length
  const openIncidents = 8
  const exceptions = unassigned + delayed + openIncidents

  const availableV = storeVehicles.filter(v => v.status === 'available').length
  const onTripV = storeVehicles.filter(v => v.status === 'on-trip').length

  const rawExceptions = [
    { icon: AlertTriangle, color: 'text-danger', label: 'V011 Engine Failure — NH-16, Nellore', severity: 'critical', detail: 'Mechanic team dispatched | ETA 25m', time: '07:45' },
    { icon: ShieldAlert, color: 'text-danger', label: 'V004 Collision at Nadiad Crossing', severity: 'critical', detail: 'Police FIR filed | Driver safe | Investigation open', time: '09:14' },
    { icon: Clock, color: 'text-warning', label: 'J011 (Dalmia Cement) — 58 min delay', severity: 'high', detail: 'Long haul Chennai → Vizag (766 km)', time: 'In transit' },
    { icon: Clock, color: 'text-warning', label: 'J002 (Tata Steel) — 22 min delay', severity: 'high', detail: 'Pune → Nashik corridor | Traffic at Chakan', time: 'In transit' },
    { icon: Bot, color: 'text-accent-ai', label: '7 Unassigned Jobs — Evening Shift', severity: 'high', detail: 'Awaiting dispatcher review & vehicle pairing', time: 'Pending' },
    { icon: AlertTriangle, color: 'text-warning', label: 'D017 (Harish Patel) — 3rd Speed Event', severity: 'high', detail: '104 km/h in 80 km/h zone on NH-48', time: '08:30' },
  ]

  const filteredExceptions = rawExceptions.filter(e => {
    if (filterSeverity === 'critical') return e.severity === 'critical'
    if (filterSeverity === 'high') return e.severity === 'high'
    return true
  })

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Executive Command Strip / Overview Headline */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary text-white rounded-lg shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface">Fleet Operational Command Center</h1>
            <p className="text-xs text-on-surface-variant">
              Live oversight: 48 vehicles · 18 active routes · 92% network telemetry health
            </p>
          </div>
        </div>

        {/* Quick Operational Telemetry Summary */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-semibold text-on-surface">{onTripV} Active Trips</span>
          </div>
          <div className="px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="font-semibold text-on-surface">{delayed} Delayed</span>
          </div>
          <Link
            to="/manager/digital-twin"
            className="px-3 py-1.5 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-1 shadow-2xs"
          >
            Digital Twin <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiGrid cols={4}>
        <KpiCard
          label="Total Fleet"
          value={48}
          icon={<Truck className="w-5 h-5 text-info" />}
          iconColor="text-info"
          iconBg="bg-info/10"
          subValue={`${availableV} available on standby`}
          progress={Math.round((availableV / 48) * 100)}
        />
        <KpiCard
          label="Active Trips"
          value={onTripV}
          icon={<Activity className="w-5 h-5 text-success" />}
          iconColor="text-success"
          iconBg="bg-success/10"
          subValue={`${onTripV} vehicles currently rolling`}
          progress={Math.round((onTripV / 48) * 100)}
          trend={{ value: '3 vs yesterday', positive: true }}
        />
        <KpiCard
          label="On-Time Rate"
          value={`${todayKpis.onTimeRate}%`}
          icon={<Clock className="w-5 h-5 text-warning" />}
          iconColor="text-warning"
          iconBg="bg-warning/10"
          subValue="7-day rolling performance"
          progress={todayKpis.onTimeRate}
        />
        <KpiCard
          label="Exceptions Requiring Action"
          value={exceptions}
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          iconColor="text-danger"
          iconBg="bg-danger/10"
          subValue={`${exceptions} active flags`}
          trend={{ value: '2 critical', positive: false }}
        />
      </KpiGrid>

      {/* Charts Row */}
      <PageGrid className="mb-2">
        <ChartContainer title="Fleet Status Breakdown" height={220}>
          <FleetStatusChart />
        </ChartContainer>

        <ChartContainer title="14-Day On-Time Delivery Trajectory" height={220}>
          <PerformanceTrendChart />
        </ChartContainer>
      </PageGrid>

      {/* Exceptions + Recent AI Decisions Row */}
      <PageGrid className="mb-2">
        {/* Operational Exceptions Card */}
        <SectionCard
          title="Operational Exceptions"
          subtitle="Real-time mechanical, safety, and delay alerts"
          noPad
          action={
            <div className="flex items-center gap-1">
              {['all', 'critical', 'high'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev as typeof filterSeverity)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    filterSeverity === sev
                      ? 'bg-danger text-white'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          }
        >
          <div className="divide-y divide-outline-variant/30">
            {filteredExceptions.map((ex, i) => {
              const Icon = ex.icon
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer group"
                >
                  <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${ex.color} ${ex.severity === 'critical' ? 'bg-danger/10' : 'bg-warning/10'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      {ex.label}
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">{ex.detail}</p>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant shrink-0">{ex.time}</span>
                </div>
              )
            })}
          </div>
        </SectionCard>

        {/* Recent AI Decisions Card */}
        <SectionCard
          title="Recent AI Dispatch Decisions"
          subtitle="Automated vehicle-job optimization pairings"
          noPad
          action={
            <Link
              to="/manager/ai-decisions"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          }
        >
          <div className="divide-y divide-outline-variant/30">
            {recommendations.slice(0, 5).map(rec => {
              const job = jobs.find(j => j.id === rec.jobId)
              const vehicle = vehicles.find(v => v.id === rec.recommendedVehicleId)
              return (
                <div key={rec.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low/40 transition-colors">
                  <span
                    className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      rec.status === 'approved'
                        ? 'text-success bg-success/10'
                        : rec.status === 'rejected'
                        ? 'text-danger bg-danger/10'
                        : 'text-accent-ai bg-accent-ai/10'
                    }`}
                  >
                    {rec.status === 'approved' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : rec.status === 'rejected' ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface truncate">
                        {job?.jobNumber} → {vehicle?.regNumber}
                      </span>
                      <span className="text-[10px] font-bold text-accent-ai font-mono">
                        Score {rec.score}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                      {job?.destination.split(',')[0]} · {job?.cargoType}
                    </p>
                    {rec.overrideReason && (
                      <p className="text-[10px] text-danger mt-0.5 italic truncate">{rec.overrideReason}</p>
                    )}
                  </div>
                  <StatusBadge status={rec.status} className="shrink-0" />
                </div>
              )
            })}
          </div>
        </SectionCard>
      </PageGrid>

      {/* Operational Activity Stream */}
      <SectionCard
        title="Live Fleet Operational Stream"
        subtitle="Chronological log of departures, arrivals, alerts, and system events"
        noPad
      >
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
          {[activityFeed.slice(0, 3), activityFeed.slice(3)].map((col, ci) => (
            <div key={ci} className="divide-y divide-outline-variant/30">
              {col.map((a, i) => {
                const Icon = a.icon
                return (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors">
                    <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 bg-surface-container ${a.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-surface-container text-on-surface-variant rounded">
                          {a.tag}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">{relativeTime(a.time)}</span>
                      </div>
                      <p className="text-xs text-on-surface leading-snug">{a.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
