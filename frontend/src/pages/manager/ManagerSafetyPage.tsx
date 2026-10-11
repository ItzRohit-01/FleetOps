import { Link } from 'react-router-dom'
import { incidents, drivers, complianceRecords, vehicleById, driverById } from '../../data/mockData'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import StatusBadge from '../../components/ui/StatusBadge'

export function ManagerSafetyPage() {
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating')
  const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'closed' && i.status !== 'resolved').length
  const highRiskDrivers = drivers.filter(d => d.riskScore === 'high' || d.riskScore === 'medium')
  const nonCompliantRecords = complianceRecords.filter(c => c.status === 'expired')

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Fleet Safety & Risk Executive Summary</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          High-level compliance posture, active critical incidents, and insurance risk exposure for executive leadership
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Open Incidents"
          value={openIncidents.length}
          icon="warning"
          iconColor="#ef4444"
          subtext={`${criticalCount} Critical active events`}
        />
        <KpiCard
          label="Non-Compliant Vehicles"
          value={nonCompliantRecords.length}
          icon="event_busy"
          iconColor="#dc2626"
          subtext="Expired permits or fitness tests"
        />
        <KpiCard
          label="Elevated Risk Drivers"
          value={highRiskDrivers.length}
          icon="person_alert"
          iconColor="#f59e0b"
          subtext="Flagged for HOS or speeding"
        />
        <KpiCard
          label="Safety Compliance Rating"
          value="91.4%"
          icon="verified_user"
          iconColor="#10b981"
          subtext="Statutory benchmark achieved"
        />
      </KpiGrid>

      <PageGrid cols={2}>
        <SectionCard
          title="Active Critical Incidents"
          subtitle="Accidents and high severity safety escalations"
        >
          <div className="space-y-3">
            {openIncidents.slice(0, 4).map(incident => {
              const vehicle = vehicleById(incident.vehicleId)
              const driver = driverById(incident.driverId)
              return (
                <div
                  key={incident.id}
                  className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={incident.severity} />
                      <span className="font-bold uppercase tracking-wider text-[11px] text-on-surface">{incident.type}</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant font-mono">
                      {incident.timestamp.split('T')[1]?.slice(0, 5)} hrs
                    </span>
                  </div>
                  <p className="text-on-surface line-clamp-2 leading-relaxed">{incident.description}</p>
                  <div className="flex justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/30">
                    <span>{vehicle?.regNumber} · {driver?.name}</span>
                    <span className="truncate max-w-[180px]">📍 {incident.location}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Statutory Documentation Status"
          subtitle="Audit compliance across registration, fitness, and insurance"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span>RTO Fitness Certificates</span>
                <span className="text-success font-bold">44 / 48 Valid</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">4 vehicles pending scheduled fitness test inspection</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span>Commercial Vehicle Insurance</span>
                <span className="text-success font-bold">46 / 48 Covered</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">2 offline vehicles in renewal grace window</p>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1">
              <div className="flex justify-between font-semibold text-on-surface">
                <span>National Interstate Freight Permits</span>
                <span className="text-success font-bold">48 / 48 Complete</span>
              </div>
              <p className="text-on-surface-variant text-[11px]">All commercial trucks authorized for inter-state transit</p>
            </div>
          </div>
        </SectionCard>
      </PageGrid>
    </div>
  )
}

export default ManagerSafetyPage
