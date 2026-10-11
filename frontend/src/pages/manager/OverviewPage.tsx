import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { ChartContainer, SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import FleetStatusChart from '../../components/charts/FleetStatusChart'
import { PerformanceTrendChart } from '../../components/charts/TrendCharts'
import StatusBadge from '../../components/ui/StatusBadge'
import { todayKpis, jobs, vehicles, recommendations, drivers } from '../../data/mockData'
import { formatINR, formatDateTime, relativeTime } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

const activityFeed = [
  { icon: 'check_circle', color: 'text-success', text: 'J034 (Nestlé India) delivered on time to Delhi Warehouse', time: '2026-10-11T06:55:00' },
  { icon: 'smart_toy', color: 'text-accent-ai', text: 'AI Dispatcher generated 4 new recommendations for evening shift', time: '2026-10-11T05:00:00' },
  { icon: 'warning', color: 'text-danger', text: 'V011 engine failure reported on NH-16 Nellore bypass — mechanic dispatched', time: '2026-10-11T07:50:00' },
  { icon: 'local_shipping', color: 'text-info', text: 'V001 (Ramesh Kumar) departed Mumbai for Pune — J001 in transit', time: '2026-10-11T06:20:00' },
  { icon: 'engineering', color: 'text-warning', text: 'V042 entered maintenance bay — estimated return Oct 14', time: '2026-10-09T16:00:00' },
  { icon: 'verified_user', color: 'text-success', text: 'Safety audit completed for Bengaluru depot — 0 findings', time: '2026-10-10T14:00:00' },
  { icon: 'route', color: 'text-info', text: 'J020 (JK Cement – 52t) assigned to V020 + Vikram Kolekar', time: '2026-10-11T08:30:00' },
  { icon: 'report', color: 'text-danger', text: 'D004 (Vijay Yadav) collision incident at Nadiad — investigation open', time: '2026-10-11T09:22:00' },
]

export default function OverviewPage() {
  const storeJobs = useAppStore(s => s.jobs)
  const storeVehicles = useAppStore(s => s.vehicles)

  const unassigned = storeJobs.filter(j => j.status === 'unassigned').length
  const delayed = storeJobs.filter(j => j.status === 'in-transit' && (j.delayMinutes ?? 0) > 0).length
  const openIncidents = 8
  const exceptions = unassigned + delayed + openIncidents

  const availableV = storeVehicles.filter(v => v.status === 'available').length

  return (
    <div className="max-w-[1400px]">
      {/* Demo banner */}
      <div className="flex items-center gap-3 bg-accent-ai/10 border border-accent-ai/20 rounded-xl px-4 py-2.5 mb-5 text-xs text-accent-ai font-medium">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
        Demo environment — displaying simulated fleet data for Oct 11, 2026. No live backend connected.
      </div>

      {/* KPI cards */}
      <KpiGrid cols={4}>
        <KpiCard
          label="Total Fleet"
          value={48}
          icon="directions_car"
          iconColor="text-info"
          iconBg="bg-info/10"
          subValue={`${availableV} available now`}
          progress={Math.round((availableV / 48) * 100)}
        />
        <KpiCard
          label="Active Trips"
          value={18}
          icon="local_shipping"
          iconColor="text-success"
          iconBg="bg-success/10"
          subValue="18 vehicles on road"
          progress={Math.round((18/48)*100)}
          trend={{ value: '3 vs yesterday', positive: true }}
        />
        <KpiCard
          label="On-Time Rate"
          value={`${todayKpis.onTimeRate}%`}
          icon="schedule"
          iconColor="text-warning"
          iconBg="bg-warning/10"
          subValue="7-day rolling avg"
          progress={todayKpis.onTimeRate}
        />
        <KpiCard
          label="Open Exceptions"
          value={exceptions}
          icon="report_problem"
          iconColor="text-danger"
          iconBg="bg-danger/10"
          subValue={`${unassigned} unassigned, ${openIncidents} incidents`}
          trend={{ value: '2 new', positive: false }}
        />
      </KpiGrid>

      {/* Charts row */}
      <PageGrid className="mb-4">
        <ChartContainer
          title="Fleet Status"
          subtitle="Vehicle distribution by operational status"
          height={220}
        >
          <FleetStatusChart />
        </ChartContainer>

        <ChartContainer
          title="On-Time Delivery Rate"
          subtitle="14-day rolling performance — 89% target line shown"
          height={220}
        >
          <PerformanceTrendChart />
        </ChartContainer>
      </PageGrid>

      {/* Exceptions + AI Decisions */}
      <PageGrid className="mb-4">
        <SectionCard
          title="Operational Exceptions"
          subtitle={`${exceptions} items requiring attention`}
          noPad
          action={
            <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-full">{exceptions}</span>
          }
        >
          <div className="divide-y divide-outline-variant/30">
            {[
              { icon: 'warning', color: 'text-danger', label: 'V011 engine failure — NH-16, Nellore', detail: 'Critical | Mechanic dispatched', time: '07:45' },
              { icon: 'report', color: 'text-danger', label: 'V004 collision at Nadiad crossing', detail: 'Critical | Police FIR initiated', time: '09:14' },
              { icon: 'schedule', color: 'text-warning', label: 'J002 (Tata Steel) — 22 min delay', detail: 'High | ETA revised to 14:08', time: 'In transit' },
              { icon: 'schedule', color: 'text-warning', label: 'J011 (Dalmia Cement) — 58 min delay', detail: 'High | Long haul Chennai→Vizag', time: 'In transit' },
              { icon: 'inbox', color: 'text-on-surface-variant', label: '7 jobs unassigned — evening dispatch', detail: 'Medium | Awaiting AI recommendations', time: 'Pending' },
              { icon: 'speed', color: 'text-orange-600', label: 'D017 (Harish Patel) — 3rd speed violation', detail: 'Medium | Counselling scheduled', time: '08:30' },
              { icon: 'assignment_late', color: 'text-warning', label: 'V004, V011, V017 — compliance review due', detail: 'Low | Documents expiring soon', time: 'This week' },
            ].map((ex, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                <span className={`material-symbols-outlined shrink-0 mt-0.5 ${ex.color}`} style={{ fontSize: 18 }}>
                  {ex.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-on-surface truncate">{ex.label}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{ex.detail}</p>
                </div>
                <span className="text-[10px] text-on-surface-variant shrink-0">{ex.time}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent AI Decisions"
          subtitle="Dispatch recommendations from the AI engine"
          noPad
          action={
            <span className="text-[10px] font-bold bg-accent-ai/10 text-accent-ai px-2 py-0.5 rounded-full">DEMO</span>
          }
        >
          <div className="divide-y divide-outline-variant/30">
            {recommendations.map(rec => {
              const job = jobs.find(j => j.id === rec.jobId)
              const vehicle = vehicles.find(v => v.id === rec.recommendedVehicleId)
              return (
                <div key={rec.id} className="flex items-start gap-3 px-4 py-3">
                  <span
                    className={`material-symbols-outlined shrink-0 mt-0.5 ${
                      rec.status === 'approved' ? 'text-success' :
                      rec.status === 'rejected' ? 'text-danger' :
                      rec.status === 'pending' ? 'text-accent-ai' : 'text-warning'
                    }`}
                    style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
                  >
                    {rec.status === 'approved' ? 'check_circle' :
                     rec.status === 'rejected' ? 'cancel' :
                     rec.status === 'pending' ? 'pending' : 'swap_horiz'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">
                      {job?.jobNumber} → {vehicle?.regNumber}
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
                      {job?.destination} · Score {rec.score}/100
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

      {/* Activity Feed */}
      <SectionCard
        title="Operational Activity"
        subtitle="Recent events across the fleet"
        noPad
      >
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
          {[activityFeed.slice(0, 4), activityFeed.slice(4)].map((col, ci) => (
            <div key={ci} className="divide-y divide-outline-variant/30">
              {col.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors">
                  <span className={`material-symbols-outlined shrink-0 mt-0.5 ${a.color}`} style={{ fontSize: 18 }}>
                    {a.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-on-surface leading-snug">{a.text}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{relativeTime(a.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
