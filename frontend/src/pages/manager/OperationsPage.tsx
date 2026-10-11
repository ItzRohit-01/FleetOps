import { useAppStore } from '../../store/useAppStore'
import DataTable, { type Column } from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard } from '../../components/ui/ChartContainer'
import { formatINR, formatDistance } from '../../lib/utils'
import { drivers, vehicles } from '../../data/mockData'
import type { Job } from '../../types'

const jobCols: Column<Job>[] = [
  { key: 'jobNumber', header: 'Job ID', sortable: true, render: j => <span className="font-mono text-xs">{j.jobNumber}</span> },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'status', header: 'Status', render: j => <StatusBadge status={j.status} dot /> },
  { key: 'priority', header: 'Priority', render: j => <StatusBadge status={j.priority} /> },
  { key: 'origin', header: 'Origin', render: j => <span className="text-xs">{j.origin.split(',')[0]}</span> },
  { key: 'destination', header: 'Destination', render: j => <span className="text-xs">{j.destination.split(',')[0]}</span> },
  { key: 'estimatedDistanceKm', header: 'Distance', render: j => formatDistance(j.estimatedDistanceKm as number), align: 'right' },
  { key: 'estimatedCostINR', header: 'Est. Cost', render: j => formatINR(j.estimatedCostINR as number), align: 'right' },
]

export default function OperationsPage() {
  const storeJobs = useAppStore(s => s.jobs)
  const inTransit = storeJobs.filter(j => j.status === 'in-transit')
  const assigned = storeJobs.filter(j => j.status === 'assigned')
  const delayed = storeJobs.filter(j => j.status === 'in-transit' && (j.delayMinutes ?? 0) > 0)

  return (
    <div className="max-w-[1400px]">
      <KpiGrid cols={4}>
        <KpiCard label="In Transit" value={inTransit.length} icon="local_shipping" iconColor="text-info" iconBg="bg-info/10" />
        <KpiCard label="Assigned (Pending Departure)" value={assigned.length} icon="schedule" iconColor="text-warning" iconBg="bg-warning/10" />
        <KpiCard label="Delayed Trips" value={delayed.length} icon="warning" iconColor="text-danger" iconBg="bg-danger/10" />
        <KpiCard label="Deliveries Today" value={7} icon="check_circle" iconColor="text-success" iconBg="bg-success/10" subValue="6 on-time" />
      </KpiGrid>

      {delayed.length > 0 && (
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-danger mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
            Delayed Trips ({delayed.length})
          </h3>
          <div className="space-y-2">
            {delayed.map(j => (
              <div key={j.id} className="flex items-center gap-4 bg-white rounded-lg px-4 py-2.5 text-xs border border-danger/20">
                <span className="font-mono font-bold text-on-surface">{j.jobNumber}</span>
                <span className="text-on-surface-variant flex-1 truncate">{j.customer}</span>
                <span className="text-on-surface-variant truncate">{j.destination.split(',')[0]}</span>
                <span className="text-danger font-bold shrink-0">+{j.delayMinutes} min</span>
                <StatusBadge status={j.priority} />
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionCard title="All Active Jobs" subtitle="Live job status — in-transit, assigned, and unassigned" noPad>
        <div className="p-4">
          <DataTable
            columns={jobCols}
            data={storeJobs.filter(j => j.status !== 'delivered' && j.status !== 'cancelled')}
            rowKey={r => r.id}
            compact
          />
        </div>
      </SectionCard>
    </div>
  )
}
