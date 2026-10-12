import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import DataTable, { type Column } from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import JourneyTimeline from '../../components/ui/JourneyTimeline'
import DetailDrawer from '../../components/ui/DetailDrawer'
import { formatINR, formatDistance, formatDateTime } from '../../lib/utils'
import { drivers, vehicles } from '../../data/mockData'
import type { Job } from '../../types'
import {
  Route,
  Search,
  Filter,
  Truck,
  User,
  Clock,
  MapPin,
  Package,
  AlertTriangle,
  ChevronRight,
  Calendar,
} from 'lucide-react'

type FilterStatus = 'all' | 'unassigned' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled'
type FilterPriority = 'all' | 'critical' | 'high' | 'medium' | 'low'

export default function JobsTripsPage() {
  const storeJobs = useAppStore(s => s.jobs)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all')
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const filtered = storeJobs.filter(j => {
    if (statusFilter !== 'all' && j.status !== statusFilter) return false
    if (priorityFilter !== 'all' && j.priority !== priorityFilter) return false
    if (
      search &&
      !j.jobNumber.toLowerCase().includes(search.toLowerCase()) &&
      !j.customer.toLowerCase().includes(search.toLowerCase()) &&
      !j.cargoType.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  const jobCols: Column<Job>[] = [
    {
      key: 'jobNumber',
      header: 'Job ID / Customer',
      sortable: true,
      render: j => (
        <div>
          <span className="font-mono text-xs font-bold text-primary">{j.jobNumber}</span>
          <p className="text-[11px] font-semibold text-on-surface truncate max-w-[140px]">{j.customer}</p>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: j => <StatusBadge status={j.status} dot /> },
    { key: 'priority', header: 'Priority', render: j => <StatusBadge status={j.priority} /> },
    {
      key: 'origin',
      header: 'Route Corridor',
      render: j => (
        <div className="text-xs max-w-[200px]">
          <span className="font-medium text-on-surface">
            {j.origin.split(',')[0]} → {j.destination.split(',')[0]}
          </span>
          <p className="text-[10px] text-on-surface-variant font-mono">{j.estimatedDistanceKm} km</p>
        </div>
      ),
    },
    {
      key: 'cargoType',
      header: 'Cargo Manifest',
      render: j => (
        <div className="text-xs">
          <span className="text-on-surface">{j.cargoType}</span>
          <p className="text-[10px] text-on-surface-variant font-mono">{(j.requiredCapacityKg / 1000).toFixed(1)}t</p>
        </div>
      ),
    },
    {
      key: 'scheduledDelivery',
      header: 'Deadline ETA',
      render: j => (
        <span className="text-xs font-mono text-on-surface-variant">
          {formatDateTime(j.scheduledDelivery)}
        </span>
      ),
    },
    {
      key: 'assignedVehicleId',
      header: 'Assigned Vehicle',
      render: j => {
        const v = vehicles.find(x => x.id === j.assignedVehicleId)
        return v ? (
          <span className="text-xs font-mono font-medium text-on-surface">{v.regNumber}</span>
        ) : (
          <span className="text-on-surface-variant text-xs italic">Unassigned</span>
        )
      },
    },
    {
      key: 'delayMinutes',
      header: 'Schedule Delta',
      render: j => {
        const d = j.delayMinutes
        if (!d) return <span className="text-success text-xs font-medium">On Time</span>
        return (
          <span className="text-danger text-xs font-bold bg-danger/10 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
            <AlertTriangle className="w-3 h-3" /> +{d}m
          </span>
        )
      },
      align: 'right',
    },
  ]

  const assignedVehicle = selectedJob?.assignedVehicleId
    ? vehicles.find(v => v.id === selectedJob.assignedVehicleId)
    : null
  const assignedDriver = selectedJob?.assignedDriverId
    ? drivers.find(d => d.id === selectedJob.assignedDriverId)
    : null

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Top Status Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {[
          { label: 'All Jobs', count: storeJobs.length, status: 'all' },
          { label: 'Unassigned', count: storeJobs.filter(j => j.status === 'unassigned').length, status: 'unassigned' },
          { label: 'In Transit', count: storeJobs.filter(j => j.status === 'in-transit').length, status: 'in-transit' },
          { label: 'Delivered', count: storeJobs.filter(j => j.status === 'delivered').length, status: 'delivered' },
          { label: 'Cancelled', count: storeJobs.filter(j => j.status === 'cancelled').length, status: 'cancelled' },
        ].map(s => (
          <button
            key={s.status}
            onClick={() => setStatusFilter(s.status as FilterStatus)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
              statusFilter === s.status
                ? 'bg-primary text-white border-primary shadow-2xs'
                : 'bg-surface-container-lowest border-outline-variant/60 hover:border-outline-variant text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>{s.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === s.status ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
        {/* Search & Priority Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-outline-variant/30">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Filter by job ID, customer, cargo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-on-surface-variant font-semibold mr-1">Priority:</span>
            {['all', 'critical', 'high', 'medium', 'low'].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p as FilterPriority)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase transition-colors ${
                  priorityFilter === p
                    ? 'bg-surface-container-high text-on-surface font-bold border border-outline-variant'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={jobCols}
          data={filtered}
          rowKey={r => r.id}
          onRowClick={r => setSelectedJob(r)}
          maxRows={15}
          compact
        />
      </div>

      {/* Slide-out Job Details & Journey Timeline Drawer */}
      <DetailDrawer
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? `${selectedJob.jobNumber} · ${selectedJob.customer}` : ''}
        subtitle={selectedJob ? `${selectedJob.cargoType}` : ''}
        width="max-w-lg"
      >
        {selectedJob && (
          <div className="space-y-4">
            {/* Visual Journey Timeline */}
            <JourneyTimeline job={selectedJob} />

            {/* Cargo & Requirements Specification */}
            <div className="bg-surface-container-low p-3.5 rounded-xl text-xs space-y-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Freight & Shipment Specifications
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-[10px] text-on-surface-variant">Required Capacity</p>
                  <p className="font-semibold text-on-surface">{(selectedJob.requiredCapacityKg / 1000).toFixed(1)} Tonnes</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Scheduled Transit Cost</p>
                  <p className="font-semibold text-primary font-mono">{formatINR(selectedJob.estimatedCostINR)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Scheduled Pickup</p>
                  <p className="font-semibold text-on-surface">{formatDateTime(selectedJob.scheduledPickup)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Delivery Deadline</p>
                  <p className="font-semibold text-on-surface">{formatDateTime(selectedJob.scheduledDelivery)}</p>
                </div>
              </div>
            </div>

            {/* Assigned Vehicle & Driver */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Truck className="w-3 h-3 text-info" /> Vehicle
                </span>
                {assignedVehicle ? (
                  <div>
                    <p className="font-bold text-on-surface">{assignedVehicle.regNumber}</p>
                    <p className="text-[11px] text-on-surface-variant">{assignedVehicle.make} ({assignedVehicle.capacityKg / 1000}t)</p>
                  </div>
                ) : (
                  <p className="text-on-surface-variant italic">Unassigned</p>
                )}
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1 mb-1">
                  <User className="w-3 h-3 text-success" /> Driver
                </span>
                {assignedDriver ? (
                  <div>
                    <p className="font-bold text-on-surface">{assignedDriver.name}</p>
                    <p className="text-[11px] text-on-surface-variant">⭐ {assignedDriver.rating} · {assignedDriver.phone}</p>
                  </div>
                ) : (
                  <p className="text-on-surface-variant italic">Unassigned</p>
                )}
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
