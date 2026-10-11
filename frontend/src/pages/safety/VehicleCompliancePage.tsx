import { useState } from 'react'
import { complianceRecords as initialCompliance, vehicles, vehicleById, driverById } from '../../data/mockData'
import DataTable, { type Column } from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard } from '../../components/ui/ChartContainer'
import { useAppStore } from '../../store/useAppStore'
import type { ComplianceRecord } from '../../types'

export default function VehicleCompliancePage() {
  const [records, setRecords] = useState<ComplianceRecord[]>(initialCompliance)
  const [statusFilter, setStatusFilter] = useState<'all' | 'expired' | 'expiring-soon'>('all')
  const [renewingRecord, setRenewingRecord] = useState<ComplianceRecord | null>(null)
  const [newExpiry, setNewExpiry] = useState('2027-10-31')
  const showToast = useAppStore(s => s.showToast)

  const filteredRecords = records.filter(r => {
    if (statusFilter === 'all') return true
    return r.status === statusFilter
  })

  const expiredCount = records.filter(r => r.status === 'expired').length
  const expiringSoonCount = records.filter(r => r.status === 'expiring-soon').length
  const compliantVehicles = vehicles.filter(v => v.complianceStatus === 'valid').length

  function handleCompleteRenewal() {
    if (!renewingRecord) return
    setRecords(prev => prev.map(r => {
      if (r.id === renewingRecord.id) {
        return { ...r, expiryDate: newExpiry, status: 'valid' }
      }
      return r
    }))
    showToast(`Compliance record ${renewingRecord.id} successfully renewed until ${newExpiry}`, 'success')
    setRenewingRecord(null)
  }

  const columns: Column<ComplianceRecord>[] = [
    {
      key: 'id',
      header: 'Record ID',
      render: (r) => <span className="font-mono font-bold text-xs text-primary">{r.id}</span>,
    },
    {
      key: 'entity',
      header: 'Entity / Subject',
      render: (r) => {
        if (r.entityType === 'vehicle') {
          const v = vehicleById(r.entityId)
          return (
            <div className="text-xs">
              <p className="font-mono font-semibold text-on-surface">{v?.regNumber || r.entityId}</p>
              <p className="text-[11px] text-on-surface-variant">{v?.make} {v?.model} ({v?.depot})</p>
            </div>
          )
        }
        const d = driverById(r.entityId)
        return (
          <div className="text-xs">
            <p className="font-semibold text-on-surface">{d?.name || r.entityId}</p>
            <p className="text-[11px] text-on-surface-variant">Driver License · {d?.depot}</p>
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Document Type',
      render: (r) => (
        <span className="capitalize font-medium text-xs text-on-surface px-2 py-0.5 bg-surface-container-low rounded border border-outline-variant/40">
          {r.type.replace('-', ' ')}
        </span>
      ),
    },
    {
      key: 'expiryDate',
      header: 'Expiration Date',
      render: (r) => (
        <span className="font-mono text-xs text-on-surface font-medium">
          {r.expiryDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Compliance Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (r) => (
        <button
          onClick={() => setRenewingRecord(r)}
          className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
            r.status === 'expired'
              ? 'bg-danger text-white hover:bg-danger/90'
              : 'bg-surface-container-low hover:bg-surface-container-high text-primary border border-outline-variant/60'
          }`}
        >
          {r.status === 'expired' ? 'Renew Now' : 'Update'}
        </button>
      ),
      align: 'right',
    },
  ]

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Vehicle & Statutory Compliance</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Government fitness certificates, National Permits, PUC emission, and insurance expiry tracking
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Compliant Fleet"
          value={`${Math.round((compliantVehicles / vehicles.length) * 100)}%`}
          icon="verified"
          iconColor="#10b981"
          subtext={`${compliantVehicles} of ${vehicles.length} vehicles fully certified`}
        />
        <KpiCard
          label="Expired Certificates"
          value={expiredCount}
          icon="event_busy"
          iconColor="#ef4444"
          subtext="Immediate grounding required by law"
        />
        <KpiCard
          label="Expiring < 30 Days"
          value={expiringSoonCount}
          icon="notification_important"
          iconColor="#f59e0b"
          subtext="Scheduled for RTO inspection & renewal"
        />
        <KpiCard
          label="Audit Readiness"
          value="High (94%)"
          icon="policy"
          iconColor="#8b5cf6"
          subtext="Digital twin RTO parity confirmed"
        />
      </KpiGrid>

      <SectionCard
        title="Statutory Documentation Audit Register"
        subtitle="Tracking fitness, insurance, road permits, and environmental clearances"
        action={
          <div className="flex bg-surface-container-low rounded-lg p-0.5 text-xs">
            {(['all', 'expired', 'expiring-soon'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                  statusFilter === tab
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={filteredRecords}
          keyExtractor={(r) => r.id}
          emptyMessage="No compliance records matching filter criteria"
        />
      </SectionCard>

      {/* Renewal Dialog */}
      {renewingRecord && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-start justify-between border-b border-outline-variant/50 pb-3">
              <div>
                <h3 className="text-base font-bold text-on-surface">Renew Statutory Record</h3>
                <p className="text-xs text-on-surface-variant">Update validity date for {renewingRecord.id}</p>
              </div>
              <button
                onClick={() => setRenewingRecord(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined sz-sm">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/40 space-y-1.5">
                <p><strong className="text-on-surface">Subject:</strong> {renewingRecord.entityId}</p>
                <p className="capitalize"><strong className="text-on-surface">Document:</strong> {renewingRecord.type.replace('-', ' ')}</p>
                <p><strong className="text-on-surface">Previous Expiry:</strong> {renewingRecord.expiryDate}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">New Certificate Expiry Date:</label>
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full text-xs p-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Upload Inspection Copy (PDF/JPG):</label>
                <div className="border border-dashed border-outline-variant rounded-lg p-3 text-center text-on-surface-variant hover:bg-surface-container-low cursor-pointer">
                  <span className="material-symbols-outlined text-primary text-xl">upload_file</span>
                  <p className="text-[11px] font-medium mt-0.5">Click to simulate RTO certificate upload</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/50">
              <button
                onClick={() => setRenewingRecord(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-on-surface-variant hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteRenewal}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 shadow-xs"
              >
                Save & Validate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
