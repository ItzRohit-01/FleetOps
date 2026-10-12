import { useState } from 'react'
import { fleetSummary, driverSummary } from '../../data/mockData'
import { SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import StatusBadge from '../../components/ui/StatusBadge'
import DataTable, { type Column } from '../../components/ui/DataTable'
import FleetMap from '../../components/ui/FleetMap'
import DetailDrawer from '../../components/ui/DetailDrawer'
import type { Vehicle } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { api } from '../../lib/api'
import {
  Boxes,
  Truck,
  Wrench,
  Users,
  Activity,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Calendar,
  FastForward,
  Loader2,
} from 'lucide-react'

export default function DigitalTwinPage() {
  const storeVehicles = useAppStore(s => s.vehicles)
  const storeDrivers = useAppStore(s => s.drivers)
  const showToast = useAppStore(s => s.showToast)
  const fetchData = useAppStore(s => s.fetchData)

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [activeTab, setActiveTab] = useState<'map' | 'telemetry'>('map')
  const [isSimulating, setIsSimulating] = useState(false)

  const totalV = storeVehicles.length || fleetSummary.total
  const onTripV = storeVehicles.filter(v => v.status === 'on-trip').length || fleetSummary.onTrip
  const availV = storeVehicles.filter(v => v.status === 'available').length || fleetSummary.available
  const maintV = storeVehicles.filter(v => v.status === 'maintenance').length || fleetSummary.maintenance
  const assignedV = storeVehicles.filter(v => v.status === 'assigned').length || fleetSummary.assigned
  const offlineV = storeVehicles.filter(v => v.status === 'offline').length || fleetSummary.offline

  const totalDrivers = storeDrivers.length || 38
  const driversOnTrip = storeDrivers.filter(d => d.status === 'on-trip').length || driverSummary.onTrip
  const driversAvail = storeDrivers.filter(d => d.status === 'available').length || driverSummary.available

  // Group vehicles by depot dynamically
  const depotGroups = storeVehicles.reduce((acc, v) => {
    const d = v.depot || 'Regional Pool'
    if (!acc[d]) acc[d] = { total: 0, available: 0, onTrip: 0, maintenance: 0 }
    acc[d].total += 1
    if (v.status === 'available') acc[d].available += 1
    if (v.status === 'on-trip') acc[d].onTrip += 1
    if (v.status === 'maintenance') acc[d].maintenance += 1
    return acc
  }, {} as Record<string, { total: number; available: number; onTrip: number; maintenance: number }>)

  const dynamicDepotData = Object.entries(depotGroups).map(([depot, stats]) => ({
    depot,
    total: stats.total,
    available: stats.available,
    onTrip: stats.onTrip,
    capacityPct: stats.total > 0 ? Math.round(((stats.available + stats.onTrip) / stats.total) * 100) : 100,
  }))

  async function handleStepSimulation() {
    setIsSimulating(true)
    try {
      const res = await api.digitalTwin.stepSimulation()
      showToast(`Simulation step complete: ${res.updates?.length || 0} active corridor trips updated`, 'success')
      await fetchData()
    } catch (err: any) {
      showToast(`Simulation error: ${err.message}`, 'error')
    } finally {
      setIsSimulating(false)
    }
  }

  const vehicleColumns: Column<Vehicle>[] = [
    { key: 'regNumber', header: 'Reg. No / ID', sortable: true, render: v => <span className="font-mono font-bold text-primary">{v.regNumber}</span> },
    { key: 'type', header: 'Asset Type', render: v => <span className="capitalize text-xs text-on-surface">{v.type.replace(/-/g, ' ')}</span> },
    { key: 'status', header: 'Status', render: v => <StatusBadge status={v.status} dot /> },
    { key: 'depot', header: 'Home Depot', render: v => <span className="text-xs text-on-surface flex items-center gap-1"><MapPin className="w-3 h-3 text-info" />{v.depot}</span> },
    { key: 'capacityKg', header: 'Capacity', render: v => <span className="font-mono text-xs font-semibold">{(v.capacityKg / 1000).toFixed(0)}t</span>, align: 'right' },
    { key: 'complianceStatus', header: 'Compliance', render: v => <StatusBadge status={v.complianceStatus} /> },
  ]

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Digital Twin Command Header */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary text-white rounded-lg shadow-sm">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface flex items-center gap-2">
              Fleet Digital Twin Telemetry
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                Live State Synced
              </span>
            </h1>
            <p className="text-xs text-on-surface-variant">
              Full synchronized twin representation: {totalV} active assets, {Object.keys(depotGroups).length || 9} regional hubs, and maintenance bays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulation Trigger */}
          <button
            onClick={handleStepSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent-ai/10 text-accent-ai border border-accent-ai/30 hover:bg-accent-ai/20 transition-all disabled:opacity-50"
            title="Advance simulated vehicle telemetry along corridor via FastAPI backend"
          >
            {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FastForward className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Advancing Twin...' : 'Step Sim (+10%)'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-lg border border-outline-variant/50">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'map' ? 'bg-primary text-white shadow-2xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Corridor Twin
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'telemetry' ? 'bg-primary text-white shadow-2xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Hub Summary
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiGrid cols={4}>
        <KpiCard
          label="Total Fleet"
          value={totalV}
          icon={<Truck className="w-5 h-5 text-info" />}
          iconColor="text-info"
          iconBg="bg-info/10"
        />
        <KpiCard
          label="On Trip"
          value={onTripV}
          icon={<Activity className="w-5 h-5 text-success" />}
          iconColor="text-success"
          iconBg="bg-success/10"
          progress={totalV > 0 ? Math.round((onTripV / totalV) * 100) : 0}
          subValue={`${totalV > 0 ? Math.round((onTripV / totalV) * 100) : 0}% network utilization`}
        />
        <KpiCard
          label="In Maintenance"
          value={maintV}
          icon={<Wrench className="w-5 h-5 text-warning" />}
          iconColor="text-warning"
          iconBg="bg-warning/10"
          subValue={`${maintV} vehicles in service bay`}
        />
        <KpiCard
          label="Drivers On Duty"
          value={driversOnTrip}
          icon={<Users className="w-5 h-5 text-accent-ai" />}
          iconColor="text-accent-ai"
          iconBg="bg-accent-ai/10"
          subValue={`${driversAvail} standby on call`}
        />
      </KpiGrid>

      {/* Interactive Corridor Map or Hub Distribution */}
      {activeTab === 'map' ? (
        <FleetMap
          selectedVehicleId={selectedVehicle?.id}
          onSelectVehicle={v => setSelectedVehicle(v)}
          compact
        />
      ) : (
        <PageGrid className="mb-2">
          {/* Fleet State Distribution */}
          <SectionCard title="Fleet Status Telemetry" subtitle="Current status of all assets">
            <div className="space-y-3 pt-1">
              {[
                { label: 'On Trip (Active Corridor)', count: onTripV, color: 'bg-info', pct: totalV > 0 ? Math.round((onTripV / totalV) * 100) : 0 },
                { label: 'Available (Standby)', count: availV, color: 'bg-success', pct: totalV > 0 ? Math.round((availV / totalV) * 100) : 0 },
                { label: 'Assigned (Pre-departure)', count: assignedV, color: 'bg-warning', pct: totalV > 0 ? Math.round((assignedV / totalV) * 100) : 0 },
                { label: 'In Maintenance', count: maintV, color: 'bg-orange-500', pct: totalV > 0 ? Math.round((maintV / totalV) * 100) : 0 },
                { label: 'Offline / Decommissioned', count: offlineV, color: 'bg-outline', pct: totalV > 0 ? Math.round((offlineV / totalV) * 100) : 0 },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-on-surface-variant font-medium">{s.label}</span>
                    <span className="font-bold text-on-surface font-mono">
                      {s.count} <span className="text-on-surface-variant font-normal">({s.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Regional Hub Distribution */}
          <SectionCard title="Regional Hub Capacity" subtitle="Vehicle positioning across depots" noPad>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-on-surface-variant">
                  <th className="px-4 py-2.5 text-left font-semibold">Hub</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-success">Avail</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-info">On Trip</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {dynamicDepotData.map(d => (
                  <tr key={d.depot} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-on-surface">{d.depot}</td>
                    <td className="px-3 py-2.5 text-right text-on-surface font-mono">{d.total}</td>
                    <td className="px-3 py-2.5 text-right text-success font-semibold font-mono">{d.available ?? 0}</td>
                    <td className="px-3 py-2.5 text-right text-info font-semibold font-mono">{d.onTrip ?? 0}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-on-surface">
                      {d.capacityPct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </PageGrid>
      )}

      {/* Asset Registry Table */}
      <SectionCard title="Digital Twin Asset Registry" subtitle="Click any vehicle row to inspect specifications and telemetry" noPad>
        <div className="p-4">
          <DataTable
            columns={vehicleColumns}
            data={storeVehicles}
            rowKey={r => r.id}
            onRowClick={v => setSelectedVehicle(v)}
            maxRows={15}
            compact
          />
        </div>
      </SectionCard>

      {/* Vehicle Inspection Drawer */}
      <DetailDrawer
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title={selectedVehicle ? `${selectedVehicle.id} · ${selectedVehicle.regNumber}` : ''}
        subtitle={selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : ''}
      >
        {selectedVehicle && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl">
              <span className="text-xs text-on-surface-variant">Twin Operational Status</span>
              <StatusBadge status={selectedVehicle.status} dot />
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Telemetry & Asset Metrics
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-[10px] text-on-surface-variant">Home Hub</p>
                  <p className="font-semibold text-on-surface">{selectedVehicle.depot}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Capacity</p>
                  <p className="font-semibold text-on-surface">{(selectedVehicle.capacityKg / 1000).toFixed(0)} Tonnes</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Total Mileage</p>
                  <p className="font-semibold text-on-surface font-mono">{selectedVehicle.mileageKm.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Next Maintenance</p>
                  <p className="font-semibold text-on-surface">{selectedVehicle.nextServiceDate}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-1 text-xs">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-success" /> Compliance Health
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-on-surface-variant">Certificates & Fitness Status:</span>
                <StatusBadge status={selectedVehicle.complianceStatus} />
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
