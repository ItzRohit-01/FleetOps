import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import DataTable, { type Column } from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatINR, formatDistance, formatDateTime } from '../../lib/utils'
import { drivers, vehicles } from '../../data/mockData'
import type { Job } from '../../types'

type FilterStatus = 'all' | 'unassigned' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled'
type FilterPriority = 'all' | 'critical' | 'high' | 'medium' | 'low'

const jobCols: Column<Job>[] = [
  { key: 'jobNumber', header: 'Job ID', sortable: true, render: j => <span className="font-mono text-xs font-bold text-primary">{j.jobNumber}</span> },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'status', header: 'Status', render: j => <StatusBadge status={j.status} dot /> },
  { key: 'priority', header: 'Priority', render: j => <StatusBadge status={j.priority} /> },
  { key: 'origin', header: 'Origin', render: j => <span className="text-xs">{(j.origin as string).split(',')[0]}</span> },
  { key: 'destination', header: 'Destination', render: j => <span className="text-xs">{(j.destination as string).split(',')[0]}</span> },
  { key: 'scheduledDelivery', header: 'Deadline', render: j => <span className="text-xs">{formatDateTime(j.scheduledDelivery as string)}</span> },
  { key: 'estimatedCostINR', header: 'Cost', render: j => formatINR(j.estimatedCostINR as number), align: 'right' },
  {
    key: 'assignedVehicleId', header: 'Vehicle',
    render: j => {
      const v = vehicles.find(x => x.id === j.assignedVehicleId)
      return v ? <span className="text-xs font-mono">{v.regNumber}</span> : <span className="text-on-surface-variant text-xs">—</span>
    }
  },
  {
    key: 'delayMinutes', header: 'Delay',
    render: j => {
      const d = j.delayMinutes as number | undefined
      if (!d) return <span className="text-success text-xs">On Time</span>
      return <span className="text-danger text-xs font-semibold">+{d}m</span>
    },
    align: 'right'
  },
]

export default function JobsTripsPage() {
  const storeJobs = useAppStore(s => s.jobs)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all')
  const [search, setSearch] = useState('')

  const filtered = storeJobs.filter(j => {
    if (statusFilter !== 'all' && j.status !== statusFilter) return false
    if (priorityFilter !== 'all' && j.priority !== priorityFilter) return false
    if (search && !j.jobNumber.toLowerCase().includes(search.toLowerCase()) && !j.customer.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const statusTabs: FilterStatus[] = ['all', 'unassigned', 'assigned', 'in-transit', 'delivered', 'cancelled']
  const priorityTabs: FilterPriority[] = ['all', 'critical', 'high', 'medium', 'low']

  return (
    <div className="max-w-[1400px]">
      {/* Stats row */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {[
          { label: 'All', count: storeJobs.length, status: 'all', color: 'text-on-surface' },
          { label: 'Unassigned', count: storeJobs.filter(j => j.status === 'unassigned').length, status: 'unassigned', color: 'text-warning' },
          { label: 'In Transit', count: storeJobs.filter(j => j.status === 'in-transit').length, status: 'in-transit', color: 'text-info' },
          { label: 'Delivered', count: storeJobs.filter(j => j.status === 'delivered').length, status: 'delivered', color: 'text-success' },
          { label: 'Cancelled', count: storeJobs.filter(j => j.status === 'cancelled').length, status: 'cancelled', color: 'text-on-surface-variant' },
        ].map(s => (
          <button
            key={s.status}
            onClick={() => setStatusFilter(s.status as FilterStatus)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${statusFilter === s.status ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest border-outline-variant/50 hover:border-outline-variant text-on-surface'}`}
          >
            {s.label}
            <span className={`text-xs font-bold ${statusFilter === s.status ? 'text-white' : s.color}`}>{s.count}</span>
          </button>
        ))}
      </div>

      {/* Priority + Search filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex gap-1">
          {priorityTabs.map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${priorityFilter === p ? 'bg-surface-container text-on-surface border-outline-variant' : 'border-transparent text-on-surface-variant hover:border-outline-variant/50'}`}
            >
              {p === 'all' ? 'All Priorities' : p}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 16 }}>search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search job / customer..."
            className="pl-8 pr-4 py-1.5 text-xs border border-outline-variant rounded-lg bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none w-52"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between">
          <p className="text-sm font-bold text-on-surface">
            {filtered.length} Job{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="p-4">
          <DataTable
            columns={jobCols}
            data={filtered}
            rowKey={r => r.id}
            compact
          />
        </div>
      </div>
    </div>
  )
}
