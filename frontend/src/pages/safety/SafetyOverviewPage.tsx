import { Link } from 'react-router-dom'
import { incidents, drivers, complianceRecords, vehicleById, driverById } from '../../data/mockData'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { ChartContainer, SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import { IncidentSeverityChart } from '../../components/charts/FleetStatusChart'
import { IncidentTrendChart } from '../../components/charts/TrendCharts'
import StatusBadge from '../../components/ui/StatusBadge'

export default function SafetyOverviewPage() {
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating')
  const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'closed' && i.status !== 'resolved').length
  const highRiskDrivers = drivers.filter(d => d.riskScore === 'high' || d.riskScore === 'medium')
  const nonCompliantRecords = complianceRecords.filter(c => c.status === 'expired' || c.status === 'expiring-soon')

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Safety & Compliance Command</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time monitoring of fleet accidents, driver risk scores, safety violations, and statutory compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/safety/incidents"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-danger text-white rounded-lg text-xs font-semibold hover:bg-danger/90 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined sz-sm" style={{ fontSize: 16 }}>report</span>
            View {openIncidents.length} Open Incidents
          </Link>
        </div>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Open Incidents"
          value={openIncidents.length}
          icon="warning"
          iconColor="#ef4444"
          subtext={`${criticalCount} Critical incidents requiring intervention`}
          trend={{ value: '+2 today', positive: false }}
        />
        <KpiCard
          label="Drivers Monitored at Risk"
          value={highRiskDrivers.length}
          icon="person_alert"
          iconColor="#f59e0b"
          subtext="1 High risk · 4 Medium risk fatigue/violations"
        />
        <KpiCard
          label="Compliance Deficits"
          value={nonCompliantRecords.length}
          icon="assignment_late"
          iconColor="#dc2626"
          subtext="5 expired fitness/permits, 8 expiring soon"
        />
        <KpiCard
          label="Fleet Safety Score"
          value="88.4 / 100"
          icon="verified_user"
          iconColor="#10b981"
          subtext="Top quartile logistics safety benchmark"
          trend={{ value: '+1.2% vs last month', positive: true }}
        />
      </KpiGrid>

      {/* Charts Grid */}
      <PageGrid cols={2}>
        <ChartContainer
          title="Active Incidents by Severity"
          subtitle="Breakdown of currently unresolved safety flags"
          height={220}
        >
          <IncidentSeverityChart />
        </ChartContainer>

        <ChartContainer
          title="14-Day Incident Frequency"
          subtitle="Daily reported safety incidents and near-misses"
          height={220}
        >
          <IncidentTrendChart />
        </ChartContainer>
      </PageGrid>

      {/* Two panels: Critical Incidents Queue + High-Risk Drivers */}
      <PageGrid cols={2}>
        <SectionCard
          title="Critical & High Priority Incidents"
          subtitle="Immediate action items requiring safety supervisor review"
          action={
            <Link to="/safety/incidents" className="text-xs text-primary font-semibold hover:underline">
              All Incidents →
            </Link>
          }
        >
          <div className="space-y-3">
            {openIncidents.slice(0, 4).map(incident => {
              const vehicle = vehicleById(incident.vehicleId)
              const driver = driverById(incident.driverId)
              return (
                <div
                  key={incident.id}
                  className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50 hover:border-danger/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={incident.severity} />
                      <span className="font-semibold text-on-surface uppercase tracking-wider text-[11px]">{incident.type}</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      {incident.timestamp.split('T')[1]?.slice(0, 5)} hrs
                    </span>
                  </div>
                  <p className="text-on-surface line-clamp-2 mb-2 leading-relaxed">{incident.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
                    <span>
                      <strong className="text-on-surface">{vehicle?.regNumber}</strong> · {driver?.name}
                    </span>
                    <span className="truncate max-w-[180px]">{incident.location}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Driver Risk Watchlist"
          subtitle="Drivers with elevated HOS hours, speeding events, or safety strikes"
          action={
            <Link to="/safety/drivers" className="text-xs text-primary font-semibold hover:underline">
              Driver Details →
            </Link>
          }
        >
          <div className="space-y-3">
            {highRiskDrivers.map(d => (
              <div
                key={d.id}
                className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                    d.riskScore === 'high' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                  }`}>
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-on-surface">{d.name}</p>
                      <StatusBadge status={d.riskScore} />
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      {d.depot} · {d.hoursThisWeek} hrs this week · {d.violations} strikes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-on-surface">★ {d.rating}</span>
                  <p className="text-[10px] text-on-surface-variant">Safety Rating</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageGrid>
    </div>
  )
}
