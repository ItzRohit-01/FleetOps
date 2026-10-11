import { useState } from 'react'
import { jobs as allJobs, vehicleById, driverById } from '../../data/mockData'
import DataTable, { type Column } from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard } from '../../components/ui/ChartContainer'
import { formatINR, formatDistance } from '../../lib/utils'
import type { Job } from '../../types'

export default function DispatchHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'delivered' | 'cancelled'>('all')

  const historyJobs = allJobs.filter(j => j.status === 'delivered' || j.status === 'cancelled')

  const filteredJobs = historyJobs.filter(j => {
    const matchesSearch = 
      j.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.destination.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || j.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const deliveredCount = historyJobs.filter(j => j.status === 'delivered').length
  const delayedCount = historyJobs.filter(j => (j.delayMinutes ?? 0) > 0).length
  const onTimeRate = deliveredCount > 0 ? Math.round(((deliveredCount - delayedCount) / deliveredCount) * 100) : 100
  const totalCost = historyJobs.reduce((acc, j) => acc + (j.estimatedCostINR || 0), 0)

  const columns: Column<Job>[] = [
    {
      key: 'jobNumber',
      header: 'Job ID',
      render: (j) => (
        <div>
          <span className="font-mono font-bold text-xs text-primary">{j.jobNumber}</span>
          <p className="text-[11px] text-on-surface-variant truncate max-w-[140px]">{j.customer}</p>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Route',
      render: (j) => (
        <div className="text-xs">
          <p className="font-medium text-on-surface truncate max-w-[180px]">{j.origin}</p>
          <p className="text-on-surface-variant truncate max-w-[180px]">→ {j.destination}</p>
        </div>
      ),
    },
    {
      key: 'vehicle',
      header: 'Vehicle / Driver',
      render: (j) => {
        const vehicle = j.assignedVehicleId ? vehicleById(j.assignedVehicleId) : null
        const driver = j.assignedDriverId ? driverById(j.assignedDriverId) : null
        return (
          <div className="text-xs">
            <p className="font-mono font-medium text-on-surface">{vehicle ? vehicle.regNumber : '—'}</p>
            <p className="text-on-surface-variant text-[11px]">{driver ? driver.name : '—'}</p>
          </div>
        )
      },
    },
    {
      key: 'distance',
      header: 'Distance / Cost',
      render: (j) => (
        <div className="text-xs text-right">
          <p className="font-medium">{formatDistance(j.estimatedDistanceKm)}</p>
          <p className="text-[11px] text-on-surface-variant">{formatINR(j.estimatedCostINR)}</p>
        </div>
      ),
      align: 'right',
    },
    {
      key: 'status',
      header: 'Status',
      render: (j) => (
        <div>
          <StatusBadge status={j.status} />
          {j.delayMinutes ? (
            <p className="text-[10px] text-amber-600 font-medium mt-0.5">+{j.delayMinutes}m delay</p>
          ) : j.status === 'delivered' ? (
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">On time</p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'completion',
      header: 'Completion Date',
      render: (j) => (
        <div className="text-xs text-on-surface-variant">
          <p>{j.actualDelivery ? j.actualDelivery.split('T')[0] : (j.scheduledDelivery ? j.scheduledDelivery.split('T')[0] : '—')}</p>
          <p className="text-[10px]">{j.actualDelivery ? j.actualDelivery.split('T')[1]?.slice(0, 5) : '—'}</p>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Dispatch History & Audit</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Archived log of completed, delayed, and cancelled trips with operational performance audits
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Total Completed"
          value={deliveredCount}
          icon="task_alt"
          iconColor="#10b981"
          subtext="Successfully delivered"
        />
        <KpiCard
          label="Historical On-Time"
          value={`${onTimeRate}%`}
          icon="schedule"
          iconColor="#0ea5e9"
          subtext={`${deliveredCount - delayedCount} of ${deliveredCount} on schedule`}
        />
        <KpiCard
          label="Exceptions / Delays"
          value={delayedCount}
          icon="warning"
          iconColor="#f59e0b"
          subtext="Trips flagged with delays"
        />
        <KpiCard
          label="Total Historical Spend"
          value={formatINR(totalCost)}
          icon="account_balance_wallet"
          iconColor="#8b5cf6"
          subtext="Settled transit expenses"
        />
      </KpiGrid>

      <SectionCard
        title="Archived Trip Records"
        subtitle="Review past deliveries and audit trails"
        action={
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-low rounded-lg p-0.5 text-xs">
              {(['all', 'delivered', 'cancelled'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                    statusFilter === tab
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-surface-container-low border border-outline-variant/60 rounded-lg text-on-surface focus:outline-none focus:border-primary w-48"
              />
            </div>
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={filteredJobs}
          keyExtractor={(j) => j.id}
          emptyMessage="No historical records found matching filter"
        />
      </SectionCard>
    </div>
  )
}
