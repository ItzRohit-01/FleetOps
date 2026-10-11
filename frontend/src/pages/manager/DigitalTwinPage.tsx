import { vehicles, drivers, fleetSummary, driverSummary } from '../../data/mockData'
import { SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import StatusBadge from '../../components/ui/StatusBadge'
import DataTable, { type Column } from '../../components/ui/DataTable'
import type { Vehicle } from '../../types'

const vehicleColumns: Column<Vehicle>[] = [
  { key: 'regNumber', header: 'Reg. No', sortable: true },
  { key: 'type', header: 'Type', render: v => <span className="capitalize text-xs">{v.type.replace(/-/g,' ')}</span> },
  { key: 'status', header: 'Status', render: v => <StatusBadge status={v.status} dot /> },
  { key: 'depot', header: 'Depot' },
  { key: 'capacityKg', header: 'Capacity', render: v => `${(v.capacityKg/1000).toFixed(0)}t`, align: 'right' },
  { key: 'complianceStatus', header: 'Compliance', render: v => <StatusBadge status={v.complianceStatus} /> },
]

const depotData = [
  { depot: 'Mumbai North', total: 6, available: 3, onTrip: 3 },
  { depot: 'Mumbai South', total: 4, available: 2, onTrip: 2 },
  { depot: 'Pune', total: 5, available: 1, onTrip: 3, maintenance: 1 },
  { depot: 'Ahmedabad', total: 6, available: 2, onTrip: 3, maintenance: 1 },
  { depot: 'Delhi', total: 7, available: 3, onTrip: 4 },
  { depot: 'Bengaluru', total: 5, available: 2, onTrip: 2, maintenance: 1 },
  { depot: 'Chennai', total: 5, available: 1, onTrip: 3, maintenance: 1 },
  { depot: 'Hyderabad', total: 4, available: 2, onTrip: 2 },
  { depot: 'Others', total: 6, available: 1 },
]

export default function DigitalTwinPage() {
  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center gap-3 bg-accent-ai/10 border border-accent-ai/20 rounded-xl px-4 py-2.5 mb-5 text-xs text-accent-ai font-medium">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>hub</span>
        Digital Twin — Simulated operational state. Live GPS integration planned for Phase 2.
      </div>

      <KpiGrid cols={4}>
        <KpiCard label="Total Fleet" value={fleetSummary.total} icon="directions_car" iconColor="text-info" iconBg="bg-info/10" />
        <KpiCard label="On Trip" value={fleetSummary.onTrip} icon="local_shipping" iconColor="text-success" iconBg="bg-success/10" progress={Math.round(fleetSummary.onTrip/fleetSummary.total*100)} />
        <KpiCard label="In Maintenance" value={fleetSummary.maintenance} icon="engineering" iconColor="text-warning" iconBg="bg-warning/10" />
        <KpiCard label="Drivers On Duty" value={driverSummary.onTrip} icon="person" iconColor="text-accent-ai" iconBg="bg-accent-ai/10" subValue={`${driverSummary.available} available`} />
      </KpiGrid>

      <PageGrid className="mb-4">
        {/* Fleet state visual */}
        <SectionCard title="Fleet Operational State" subtitle="Current status of all 48 vehicles">
          <div className="space-y-2">
            {[
              { label: 'On Trip', count: fleetSummary.onTrip, color: 'bg-info', pct: Math.round(fleetSummary.onTrip/fleetSummary.total*100) },
              { label: 'Available', count: fleetSummary.available, color: 'bg-success', pct: Math.round(fleetSummary.available/fleetSummary.total*100) },
              { label: 'Assigned (departing)', count: fleetSummary.assigned, color: 'bg-warning', pct: Math.round(fleetSummary.assigned/fleetSummary.total*100) },
              { label: 'In Maintenance', count: fleetSummary.maintenance, color: 'bg-orange-500', pct: Math.round(fleetSummary.maintenance/fleetSummary.total*100) },
              { label: 'Offline', count: fleetSummary.offline, color: 'bg-on-surface-variant', pct: Math.round(fleetSummary.offline/fleetSummary.total*100) },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">{s.label}</span>
                  <span className="font-bold text-on-surface">{s.count} <span className="text-on-surface-variant font-normal">({s.pct}%)</span></span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Depot breakdown */}
        <SectionCard title="Fleet by Depot" subtitle="Vehicle distribution across locations" noPad>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-4 py-2.5 text-left font-semibold text-on-surface-variant">Depot</th>
                <th className="px-3 py-2.5 text-right font-semibold text-on-surface-variant">Total</th>
                <th className="px-3 py-2.5 text-right font-semibold text-success">Avail</th>
                <th className="px-3 py-2.5 text-right font-semibold text-info">On Trip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {depotData.map(d => (
                <tr key={d.depot} className="hover:bg-surface-container-low">
                  <td className="px-4 py-2.5 font-medium text-on-surface">{d.depot}</td>
                  <td className="px-3 py-2.5 text-right text-on-surface">{d.total}</td>
                  <td className="px-3 py-2.5 text-right text-success font-semibold">{d.available ?? 0}</td>
                  <td className="px-3 py-2.5 text-right text-info font-semibold">{d.onTrip ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </PageGrid>

      {/* Vehicle table */}
      <SectionCard title="All Vehicles" subtitle="Full fleet registry — click a row to inspect" noPad>
        <div className="p-4">
          <DataTable
            columns={vehicleColumns}
            data={vehicles}
            rowKey={r => r.id}
            maxRows={20}
            compact
          />
        </div>
      </SectionCard>
    </div>
  )
}
