import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard, PageGrid } from '../../components/ui/ChartContainer'
import StatusBadge from '../../components/ui/StatusBadge'
import DataTable, { type Column } from '../../components/ui/DataTable'
import { vehicles, drivers, recommendations, jobs as allJobs } from '../../data/mockData'
import { formatINR, formatDistance, formatDateTime } from '../../lib/utils'
import type { Job } from '../../types'

const jobCols: Column<Job>[] = [
  { key: 'jobNumber', header: 'Job ID', render: j => <span className="font-mono text-xs font-bold">{j.jobNumber}</span> },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'priority', header: 'Priority', render: j => <StatusBadge status={j.priority} /> },
  { key: 'status', header: 'Status', render: j => <StatusBadge status={j.status} dot /> },
  { key: 'destination', header: 'Destination', render: j => <span className="text-xs">{j.destination.split(',')[0]}</span> },
  { key: 'scheduledDelivery', header: 'Deadline', render: j => <span className="text-xs">{formatDateTime(j.scheduledDelivery as string)}</span> },
  { key: 'requiredCapacityKg', header: 'Capacity', render: j => `${(j.requiredCapacityKg as number/1000).toFixed(0)}t`, align: 'right' },
]

export default function DispatchOverviewPage() {
  const storeJobs = useAppStore(s => s.jobs)
  const [search, setSearch] = useState('')

  const unassigned = storeJobs.filter(j => j.status === 'unassigned')
  const available = vehicles.filter(v => v.status === 'available')
  const inTransit = storeJobs.filter(j => j.status === 'in-transit')
  const pendingRecs = recommendations.filter(r => r.status === 'pending')

  const critical = storeJobs.filter(j => j.status === 'unassigned' && j.priority === 'critical')
  const atRisk = storeJobs.filter(j => j.status === 'in-transit' && (j.delayMinutes ?? 0) > 30)

  const filtered = storeJobs
    .filter(j => j.status !== 'delivered' && j.status !== 'cancelled')
    .filter(j =>
      !search ||
      j.jobNumber.toLowerCase().includes(search.toLowerCase()) ||
      j.customer.toLowerCase().includes(search.toLowerCase()) ||
      j.destination.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="max-w-[1400px]">
      <KpiGrid cols={4}>
        <KpiCard label="Unassigned Jobs" value={unassigned.length} icon="inbox" iconColor="text-warning" iconBg="bg-warning/10" subValue={`${critical.length} critical priority`} trend={{ value: '', positive: false }} />
        <KpiCard label="Available Vehicles" value={available.length} icon="directions_car" iconColor="text-success" iconBg="bg-success/10" subValue="Ready for dispatch" />
        <KpiCard label="Active Trips" value={inTransit.length} icon="local_shipping" iconColor="text-info" iconBg="bg-info/10" subValue={`${atRisk.length} delayed >30min`} />
        <KpiCard label="Pending AI Recommendations" value={pendingRecs.length} icon="smart_toy" iconColor="text-accent-ai" iconBg="bg-accent-ai/10" subValue="Awaiting approval" />
      </KpiGrid>

      {/* Exceptions */}
      {(critical.length > 0 || atRisk.length > 0) && (
        <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-bold text-danger mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>priority_high</span>
            Dispatch Exceptions
          </h3>
          <div className="space-y-1.5">
            {critical.map(j => (
              <div key={j.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 text-xs border border-danger/20">
                <StatusBadge status="critical" />
                <span className="font-mono font-bold">{j.jobNumber}</span>
                <span className="flex-1 truncate text-on-surface-variant">{j.customer} → {j.destination.split(',')[0]}</span>
                <span className="text-danger font-semibold">UNASSIGNED</span>
              </div>
            ))}
            {atRisk.map(j => (
              <div key={j.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 text-xs border border-warning/20">
                <StatusBadge status="high" />
                <span className="font-mono font-bold">{j.jobNumber}</span>
                <span className="flex-1 truncate text-on-surface-variant">{j.customer}</span>
                <span className="text-warning font-semibold">+{j.delayMinutes}min delay</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <PageGrid className="mb-4">
        {/* Available Fleet */}
        <SectionCard title="Available Fleet" subtitle={`${available.length} vehicles ready for dispatch`} noPad>
          <div className="divide-y divide-outline-variant/30">
            {available.slice(0, 8).map(v => (
              <div key={v.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-success" style={{ fontSize: 18 }}>directions_car</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface">{v.regNumber}</p>
                  <p className="text-[11px] text-on-surface-variant">{v.make} {v.model} · {v.depot}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-on-surface">{(v.capacityKg/1000).toFixed(0)}t</p>
                  <StatusBadge status={v.complianceStatus} className="mt-0.5" />
                </div>
              </div>
            ))}
            {available.length > 8 && (
              <p className="px-4 py-2 text-xs text-on-surface-variant text-center">+{available.length - 8} more vehicles available</p>
            )}
          </div>
        </SectionCard>

        {/* Pending AI Recommendations */}
        <SectionCard title="AI Recommendations" subtitle="Pending dispatch assignments from AI Dispatcher" noPad
          action={<span className="text-[10px] font-bold bg-accent-ai/10 text-accent-ai px-2 py-0.5 rounded-full">DEMO</span>}
        >
          <div className="divide-y divide-outline-variant/30">
            {pendingRecs.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-on-surface-variant">No pending recommendations</p>
            ) : pendingRecs.map(rec => {
              const job = allJobs.find(j => j.id === rec.jobId)
              const vehicle = vehicles.find(v => v.id === rec.recommendedVehicleId)
              return (
                <div key={rec.id} className="px-4 py-3 hover:bg-surface-container-low cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface">{job?.jobNumber}</span>
                    <span className="text-[10px] font-bold text-accent-ai">Score {rec.score}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mb-1.5 truncate">{job?.customer} → {job?.destination.split(',')[0]}</p>
                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>directions_car</span>
                    <span>{vehicle?.regNumber}</span>
                    <span>·</span>
                    <span>{formatDistance(rec.estimatedDistanceKm)}</span>
                    <span>·</span>
                    <span>{formatINR(rec.estimatedCostINR)}</span>
                  </div>
                  {rec.warnings.length > 0 && (
                    <p className="text-[10px] text-warning mt-1">⚠ {rec.warnings[0]}</p>
                  )}
                </div>
              )
            })}
          </div>
        </SectionCard>
      </PageGrid>

      {/* Dispatch Queue */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant/30">
          <div>
            <h3 className="text-sm font-bold text-on-surface">Dispatch Queue</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{filtered.length} active jobs</p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 16 }}>search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="pl-8 pr-4 py-1.5 text-xs border border-outline-variant rounded-lg bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
        <div className="p-4">
          <DataTable
            columns={jobCols}
            data={filtered}
            rowKey={r => r.id}
            compact
            maxRows={15}
          />
        </div>
      </div>
    </div>
  )
}
