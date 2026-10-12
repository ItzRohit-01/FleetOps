import { useState } from 'react'
import { vehicles, jobs, drivers } from '../../data/mockData'
import type { Vehicle } from '../../types'
import FleetMap from '../../components/ui/FleetMap'
import StatusBadge from '../../components/ui/StatusBadge'
import DetailDrawer from '../../components/ui/DetailDrawer'
import {
  Truck,
  MapPin,
  Clock,
  User,
  Package,
  AlertTriangle,
  Search,
  Filter,
  Navigation,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react'

export default function LiveMapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [searchFilter, setSearchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const activeVehicles = vehicles.map(v => {
    const job = jobs.find(j => j.id === v.currentJobId)
    const driver = drivers.find(d => d.id === v.currentDriverId)
    const isDelayed = (job?.delayMinutes ?? 0) > 0
    return {
      ...v,
      job,
      driver,
      isDelayed,
    }
  })

  const filteredVehicles = activeVehicles.filter(v => {
    const matchesSearch =
      v.regNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (v.driver?.name.toLowerCase().includes(searchFilter.toLowerCase()) ?? false) ||
      (v.location?.city.toLowerCase().includes(searchFilter.toLowerCase()) ?? false)

    if (!matchesSearch) return false
    if (statusFilter === 'on-trip') return v.status === 'on-trip'
    if (statusFilter === 'available') return v.status === 'available'
    if (statusFilter === 'delayed') return v.isDelayed
    if (statusFilter === 'maintenance') return v.status === 'maintenance'
    return true
  })

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Top Map Display */}
      <FleetMap
        selectedVehicleId={selectedVehicle?.id}
        onSelectVehicle={v => setSelectedVehicle(v)}
      />

      {/* Fleet Telemetry & Active Trips Manifest */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm overflow-hidden">
        {/* Header with Search and Status Filter */}
        <div className="p-4 border-b border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-4 h-4 text-info" /> Fleet Telemetry & Active Corridors
            </h3>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Live status across 48 vehicles, GPS coordinates, and real-time trip manifests
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search vehicle or driver..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/60 rounded-lg pl-8 pr-3 py-1 text-xs text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All (48)' },
                { id: 'on-trip', label: 'On Trip (18)' },
                { id: 'delayed', label: 'Delayed (3)' },
                { id: 'available', label: 'Available (15)' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    statusFilter === f.id
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Structured Operational Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant font-semibold">
                <th className="py-2.5 px-4">Vehicle / Reg</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Current Hub / City</th>
                <th className="py-2.5 px-3">Assigned Driver</th>
                <th className="py-2.5 px-3">Active Manifest / Route</th>
                <th className="py-2.5 px-3">Schedule Delta</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredVehicles.map(v => (
                <tr
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`hover:bg-surface-container-low/60 transition-colors cursor-pointer ${
                    selectedVehicle?.id === v.id ? 'bg-surface-container-low font-medium' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">{v.id}</span>
                      <span className="text-[11px] text-on-surface-variant">({v.regNumber})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={v.status} dot />
                  </td>
                  <td className="py-3 px-3 text-on-surface">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-on-surface-variant" />
                      {v.location?.city || v.depot}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-on-surface">
                    {v.driver ? (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-on-surface-variant" />
                        {v.driver.name}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-on-surface max-w-[240px]">
                    {v.job ? (
                      <div className="truncate">
                        <span className="font-semibold">{v.job.origin.split(',')[0]} → {v.job.destination.split(',')[0]}</span>
                        <p className="text-[10px] text-on-surface-variant truncate">{v.job.cargoType}</p>
                      </div>
                    ) : (
                      <span className="text-on-surface-variant italic">No active dispatch</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {v.isDelayed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-danger bg-danger/10 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> +{v.job?.delayMinutes}m delay
                      </span>
                    ) : v.status === 'on-trip' ? (
                      <span className="text-success font-semibold text-[11px]">On Time</span>
                    ) : (
                      <span className="text-on-surface-variant text-[11px]">Standby</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Vehicle Inspection Drawer */}
      <DetailDrawer
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title={selectedVehicle ? `${selectedVehicle.id} · ${selectedVehicle.regNumber}` : ''}
        subtitle={selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})` : ''}
      >
        {selectedVehicle && (
          <div className="space-y-4">
            {/* Quick Status Pill */}
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
              <span className="text-xs text-on-surface-variant">Current Vehicle Status</span>
              <StatusBadge status={selectedVehicle.status} dot />
            </div>

            {/* Specifications */}
            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Asset Specifications
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-[10px] text-on-surface-variant">Body Type</p>
                  <p className="font-semibold text-on-surface capitalize">{selectedVehicle.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Capacity</p>
                  <p className="font-semibold text-on-surface">{(selectedVehicle.capacityKg / 1000).toFixed(0)} Tonnes</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Fuel System</p>
                  <p className="font-semibold text-on-surface uppercase">{selectedVehicle.fuelType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Odometer</p>
                  <p className="font-semibold text-on-surface font-mono">{selectedVehicle.mileageKm.toLocaleString()} km</p>
                </div>
              </div>
            </div>

            {/* Active Driver */}
            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Assigned Driver Profile
              </span>
              {selectedVehicle.currentDriverId ? (
                (() => {
                  const d = drivers.find(x => x.id === selectedVehicle.currentDriverId)
                  return d ? (
                    <div className="pt-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-on-surface text-sm">{d.name}</span>
                        <span className="text-xs text-on-surface-variant">⭐ {d.rating}</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant">License: {d.licenseNumber} (Exp: {d.licenseExpiry})</p>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span>Hours this week: <strong>{d.hoursThisWeek}h / 50h</strong></span>
                        <StatusBadge status={d.riskScore} />
                      </div>
                    </div>
                  ) : null
                })()
              ) : (
                <p className="text-on-surface-variant italic pt-1">No driver assigned.</p>
              )}
            </div>

            {/* Current Job Manifest if assigned */}
            {selectedVehicle.currentJobId && (
              (() => {
                const j = jobs.find(x => x.id === selectedVehicle.currentJobId)
                return j ? (
                  <div className="bg-info/10 border border-info/20 p-3.5 rounded-xl space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-info uppercase tracking-wider flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> Active Job Manifest
                    </span>
                    <div className="space-y-1">
                      <p className="font-bold text-on-surface">{j.jobNumber} · {j.customer}</p>
                      <p className="text-on-surface-variant">{j.cargoType} ({(j.requiredCapacityKg / 1000).toFixed(1)}t)</p>
                      <p className="text-[11px] font-semibold text-on-surface pt-1">
                        {j.origin} → {j.destination}
                      </p>
                    </div>
                    {j.delayMinutes && (
                      <div className="pt-1 text-danger font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3 h-3" /> Delay logged: +{j.delayMinutes} minutes
                      </div>
                    )}
                  </div>
                ) : null
              })()
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
