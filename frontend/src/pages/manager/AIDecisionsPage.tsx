import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { jobs as allJobs, vehicles as allVehicles, drivers as allDrivers } from '../../data/mockData'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatINR, formatDistance, formatDuration } from '../../lib/utils'
import { SectionCard } from '../../components/ui/ChartContainer'

export default function AIDecisionsPage() {
  const { recommendations, approveRecommendation, rejectRecommendation, overrideRecommendation } = useAppStore()
  const [activeRec, setActiveRec] = useState<string | null>(recommendations.find(r => r.status === 'pending')?.id ?? null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [showOverrideModal, setShowOverrideModal] = useState(false)

  const selected = recommendations.find(r => r.id === activeRec)
  const job = selected ? allJobs.find(j => j.id === selected.jobId) : null
  const vehicle = selected ? allVehicles.find(v => v.id === selected.recommendedVehicleId) : null
  const driver = selected ? allDrivers.find(d => d.id === selected.recommendedDriverId) : null
  const altVehicle = selected?.alternativeVehicleId ? allVehicles.find(v => v.id === selected.alternativeVehicleId) : null
  const altDriver = selected?.alternativeDriverId ? allDrivers.find(d => d.id === selected.alternativeDriverId) : null

  const statusColor = (s: string) => {
    if (s === 'pending') return 'border-l-accent-ai bg-accent-ai/5'
    if (s === 'approved') return 'border-l-success bg-success/5'
    if (s === 'rejected') return 'border-l-danger bg-danger/5'
    return 'border-l-warning bg-warning/5'
  }

  return (
    <div className="max-w-[1400px]">
      <div className="flex items-center gap-3 bg-accent-ai/10 border border-accent-ai/20 rounded-xl px-4 py-2.5 mb-5 text-xs text-accent-ai font-medium">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
        These are simulated recommendations — no real optimization engine is connected. Demo data only.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        {/* Left: Recommendation list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-on-surface">Recommendations</h3>
            <span className="text-[11px] text-on-surface-variant">{recommendations.filter(r=>r.status==='pending').length} pending</span>
          </div>
          {recommendations.map(rec => {
            const j = allJobs.find(x => x.id === rec.jobId)
            const isActive = activeRec === rec.id
            return (
              <button
                key={rec.id}
                onClick={() => setActiveRec(rec.id)}
                className={`w-full text-left p-4 rounded-xl border-l-4 border border-outline-variant/50 transition-all ${statusColor(rec.status)} ${isActive ? 'shadow-md ring-1 ring-primary/20' : 'hover:shadow-sm'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">{j?.jobNumber}</p>
                    <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{j?.customer}</p>
                    <p className="text-[10px] text-on-surface-variant mt-1 truncate">{j?.origin} → {j?.destination}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={rec.status} />
                    <p className="text-[10px] text-on-surface-variant mt-1">Score: <span className="font-bold text-on-surface">{rec.score}</span></p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right: Detail panel */}
        {selected && job && vehicle && driver ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold text-on-surface">{job.jobNumber}</h2>
                    <StatusBadge status={job.priority} />
                    <StatusBadge status={selected.status} />
                  </div>
                  <p className="text-sm text-on-surface-variant">{job.customer}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{job.origin} → {job.destination}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant">Score</p>
                  <p className="text-3xl font-bold text-accent-ai">{selected.score}</p>
                  <p className="text-[10px] text-on-surface-variant">/100</p>
                </div>
              </div>

              {/* Core metrics */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-outline-variant/30">
                {[
                  { label: 'Distance', value: formatDistance(selected.estimatedDistanceKm) },
                  { label: 'Duration', value: formatDuration(selected.estimatedTimeMin) },
                  { label: 'Est. Cost', value: formatINR(selected.estimatedCostINR) },
                ].map(m => (
                  <div key={m.label} className="bg-surface-container-low rounded-lg p-3 text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-semibold tracking-wider">{m.label}</p>
                    <p className="text-base font-bold text-on-surface mt-1">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Vehicle */}
              <SectionCard title="Recommended Vehicle">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Registration</span>
                    <span className="font-semibold">{vehicle.regNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Type</span>
                    <span className="font-semibold capitalize">{vehicle.type.replace('-',' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Capacity</span>
                    <span className="font-semibold">{(vehicle.capacityKg/1000).toFixed(0)}t</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Fill Rate</span>
                    <span className="font-semibold text-success">{Math.round(job.requiredCapacityKg/vehicle.capacityKg*100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Compliance</span>
                    <StatusBadge status={vehicle.complianceStatus} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Depot</span>
                    <span className="font-semibold">{vehicle.depot}</span>
                  </div>
                </div>
              </SectionCard>

              {/* Driver */}
              <SectionCard title="Recommended Driver">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Name</span>
                    <span className="font-semibold">{driver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Hours This Week</span>
                    <span className={`font-semibold ${driver.hoursThisWeek > 40 ? 'text-danger' : 'text-on-surface'}`}>
                      {driver.hoursThisWeek}h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Risk Score</span>
                    <StatusBadge status={driver.riskScore} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Rating</span>
                    <span className="font-semibold">⭐ {driver.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Violations</span>
                    <span className={`font-semibold ${driver.violations > 2 ? 'text-danger' : 'text-on-surface'}`}>{driver.violations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">License Exp.</span>
                    <span className="font-semibold">{driver.licenseExpiry}</span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Reasons + Warnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SectionCard title="Recommendation Reasons">
                <ul className="space-y-1.5">
                  {selected.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-success shrink-0 mt-0.5" style={{ fontSize: 14 }}>check</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </SectionCard>
              <SectionCard title="Warnings">
                {selected.warnings.length > 0 ? (
                  <ul className="space-y-1.5">
                    {selected.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-warning">
                        <span className="material-symbols-outlined shrink-0 mt-0.5" style={{ fontSize: 14 }}>warning</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-success flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                    No warnings for this recommendation.
                  </p>
                )}
              </SectionCard>
            </div>

            {/* Alt assignment */}
            {altVehicle && (
              <SectionCard title="Alternative Assignment" subtitle="Lower-scored option if primary is unavailable">
                <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>directions_car</span>
                  <span>{altVehicle.regNumber} ({altVehicle.type})</span>
                  {altDriver && <><span>·</span><span>{altDriver.name}</span></>}
                </div>
              </SectionCard>
            )}

            {/* Override note */}
            {selected.overrideReason && (
              <div className="bg-danger/5 border border-danger/20 rounded-xl px-4 py-3 text-xs text-danger">
                <span className="font-bold">Override/Rejection reason: </span>{selected.overrideReason}
              </div>
            )}

            {/* Action buttons */}
            {selected.status === 'pending' && (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => approveRecommendation(selected.id, 'Priya Sharma')}
                  className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined sz-sm">check_circle</span>
                  Approve Assignment
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined sz-sm">cancel</span>
                  Reject
                </button>
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined sz-sm">swap_horiz</span>
                  Manual Override
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-surface-container-lowest rounded-xl border border-outline-variant/50 text-on-surface-variant text-sm">
            Select a recommendation to view details
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-base font-bold text-on-surface mb-1">Reject Recommendation</h3>
            <p className="text-xs text-on-surface-variant mb-4">Provide a reason for rejecting this dispatch recommendation.</p>
            <textarea
              className="w-full border border-outline-variant rounded-lg p-3 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              rows={3}
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg">Cancel</button>
              <button
                disabled={!rejectReason.trim()}
                onClick={() => { rejectRecommendation(selected!.id, rejectReason); setShowRejectModal(false); setRejectReason('') }}
                className="px-4 py-2 text-sm bg-danger text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-base font-bold text-on-surface mb-1">Manual Override</h3>
            <p className="text-xs text-on-surface-variant mb-4">You are overriding the AI recommendation. State your reason so it can be tracked.</p>
            <textarea
              className="w-full border border-outline-variant rounded-lg p-3 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              rows={3}
              placeholder="Override reason..."
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setShowOverrideModal(false)} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg">Cancel</button>
              <button
                disabled={!overrideReason.trim()}
                onClick={() => { overrideRecommendation(selected!.id, overrideReason); setShowOverrideModal(false); setOverrideReason('') }}
                className="px-4 py-2 text-sm bg-warning text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Record Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
