import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { drivers as allDrivers } from '../../data/mockData'
import StatusBadge from '../../components/ui/StatusBadge'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { fleetSummary, driverSummary } from '../../data/mockData'

export default function FleetAvailabilityPage() {
  const storeVehicles = useAppStore(s => s.vehicles)
  const [search, setSearch] = useState('')

  const available = storeVehicles.filter(v => v.status === 'available')
  const filtered = available.filter(v =>
    !search || v.regNumber.toLowerCase().includes(search.toLowerCase()) || v.depot.toLowerCase().includes(search.toLowerCase())
  )

  const availableDrivers = allDrivers.filter(d => d.status === 'available')

  return (
    <div className="max-w-[1400px]">
      <KpiGrid cols={4}>
        <KpiCard label="Available Vehicles" value={fleetSummary.available} icon="directions_car" iconColor="text-success" iconBg="bg-success/10" subValue="Ready for dispatch" progress={Math.round(fleetSummary.available/fleetSummary.total*100)} />
        <KpiCard label="Available Drivers" value={driverSummary.available} icon="person" iconColor="text-info" iconBg="bg-info/10" subValue="Fully rested" />
        <KpiCard label="In Maintenance" value={fleetSummary.maintenance} icon="engineering" iconColor="text-warning" iconBg="bg-warning/10" subValue="Expected back soon" />
        <KpiCard label="Offline Fleet" value={fleetSummary.offline} icon="error" iconColor="text-danger" iconBg="bg-danger/10" subValue="Compliance/breakdown" />
      </KpiGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Available Vehicles */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant/30">
            <h3 className="text-sm font-bold text-on-surface">Available Vehicles</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 14 }}>search</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter..." className="pl-7 pr-3 py-1 text-xs border border-outline-variant rounded-lg bg-surface-container-low focus:border-primary outline-none w-36" />
            </div>
          </div>
          <div className="divide-y divide-outline-variant/20 max-h-[480px] overflow-y-auto">
            {filtered.map(v => (
              <div key={v.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="w-9 h-9 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: 18 }}>directions_car</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface">{v.regNumber}</p>
                  <p className="text-[11px] text-on-surface-variant">{v.make} {v.model} · {v.type.replace('-',' ')}</p>
                  <p className="text-[10px] text-on-surface-variant">{v.depot}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-on-surface">{(v.capacityKg/1000).toFixed(0)}t</p>
                  <StatusBadge status={v.complianceStatus} className="mt-1" />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center text-xs text-on-surface-variant">No vehicles match</p>
            )}
          </div>
        </div>

        {/* Available Drivers */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-outline-variant/30">
            <h3 className="text-sm font-bold text-on-surface">Available Drivers</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{availableDrivers.length} drivers available for assignment</p>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {availableDrivers.map(d => (
              <div key={d.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-xs font-bold text-on-primary-fixed">
                  {d.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface">{d.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{d.depot}</p>
                  <p className="text-[10px] text-on-surface-variant">{d.hoursThisWeek}h this week · {d.violations} violations</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <StatusBadge status={d.riskScore} />
                  <p className="text-[10px] text-on-surface-variant">⭐ {d.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
