import { Link } from 'react-router-dom'
import { incidents, drivers, complianceRecords, vehicleById, driverById } from '../../data/mockData'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { ChartContainer, SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import { IncidentSeverityChart } from '../../components/charts/FleetStatusChart'
import { IncidentTrendChart } from '../../components/charts/TrendCharts'
import StatusBadge from '../../components/ui/StatusBadge'
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  FileWarning,
  ShieldCheck,
  ChevronRight,
  Activity,
  Clock,
  MapPin,
} from 'lucide-react'

export default function SafetyOverviewPage() {
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating')
  const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'closed' && i.status !== 'resolved').length
  const highRiskDrivers = drivers.filter(d => d.riskScore === 'high' || d.riskScore === 'medium')
  const nonCompliantRecords = complianceRecords.filter(c => c.status === 'expired' || c.status === 'expiring-soon')

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Safety Command Strip */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-danger/10 text-danger rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface flex items-center gap-2">
              Safety & Regulatory Risk Command
              {criticalCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 animate-pulse">
                  {criticalCount} Critical Active
                </span>
              )}
            </h1>
            <p className="text-xs text-on-surface-variant">
              Telemetry violations, collision investigations, HOS driver fatigue, and statutory certificate audits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/safety/incidents"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-danger text-white rounded-lg text-xs font-semibold hover:bg-danger/90 transition-colors shadow-2xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Triage {openIncidents.length} Open Incidents
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiGrid cols={4}>
        <KpiCard
          label="Open Incidents"
          value={openIncidents.length}
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          iconColor="text-danger"
          iconBg="bg-danger/10"
          subtext={`${criticalCount} Critical requiring intervention`}
          trend={{ value: '+2 today', positive: false }}
        />
        <KpiCard
          label="Drivers on Watchlist"
          value={highRiskDrivers.length}
          icon={<Users className="w-5 h-5 text-warning" />}
          iconColor="text-warning"
          iconBg="bg-warning/10"
          subtext="1 High risk · 4 Medium risk fatigue"
        />
        <KpiCard
          label="Compliance Deficits"
          value={nonCompliantRecords.length}
          icon={<FileWarning className="w-5 h-5 text-red-600" />}
          iconColor="text-red-600"
          iconBg="bg-red-500/10"
          subtext="5 expired fitness/permits, 8 expiring soon"
        />
        <KpiCard
          label="Fleet Safety Rating"
          value="88.4 / 100"
          icon={<ShieldCheck className="w-5 h-5 text-success" />}
          iconColor="text-success"
          iconBg="bg-success/10"
          subtext="Top quartile logistics benchmark"
          trend={{ value: '+1.2% vs last month', positive: true }}
          progress={88}
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

      {/* Two Panels: Critical Incidents Queue + High-Risk Drivers */}
      <PageGrid cols={2}>
        <SectionCard
          title="Critical & High Priority Incidents"
          subtitle="Immediate action items requiring safety supervisor review"
          action={
            <Link to="/safety/incidents" className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5">
              All Incidents <ChevronRight className="w-3 h-3" />
            </Link>
          }
        >
          <div className="space-y-2.5">
            {openIncidents.slice(0, 4).map(incident => {
              const vehicle = vehicleById(incident.vehicleId)
              const driver = driverById(incident.driverId)
              return (
                <div
                  key={incident.id}
                  className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50 hover:border-danger/40 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={incident.severity} dot />
                      <span className="font-bold text-on-surface uppercase tracking-wider text-[11px]">{incident.type}</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {incident.timestamp.split('T')[1]?.slice(0, 5)} hrs
                    </span>
                  </div>
                  <p className="text-on-surface line-clamp-1 mb-2 leading-relaxed text-[11px]">{incident.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
                    <span>
                      <strong className="text-on-surface">{vehicle?.regNumber}</strong> · {driver?.name}
                    </span>
                    <span className="truncate max-w-[180px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-info" /> {incident.location}
                    </span>
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
            <Link to="/safety/drivers" className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5">
              Driver Details <ChevronRight className="w-3 h-3" />
            </Link>
          }
        >
          <div className="space-y-2.5">
            {highRiskDrivers.map(d => (
              <div
                key={d.id}
                className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
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
                      {d.depot} · {d.hoursThisWeek}h logged · {d.violations} strikes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-on-surface">⭐ {d.rating}</span>
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
