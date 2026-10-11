import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { vehicles as allVehicles, drivers as allDrivers, jobs as allJobs, recommendations as initRecs } from '../../data/mockData'
import StatusBadge from '../../components/ui/StatusBadge'
import { SectionCard } from '../../components/ui/ChartContainer'
import { formatINR, formatDistance, formatDuration } from '../../lib/utils'

export default function AIDispatcherPage() {
  const { recommendations, approveRecommendation, rejectRecommendation } = useAppStore()
  const [selected, setSelected] = useState<string | null>(recommendations.find(r => r.status === 'pending')?.id ?? null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const rec = recommendations.find(r => r.id === selected)
  const job = rec ? allJobs.find(j => j.id === rec.jobId) : null
  const vehicle = rec ? allVehicles.find(v => v.id === rec.recommendedVehicleId) : null
  const driver = rec ? allDrivers.find(d => d.id === rec.recommendedDriverId) : null

  return (
    <div className="max-w-[1400px]">
      {/* AI Banner */}
      <div className="bg-gradient-to-r from-accent-ai/10 to-primary-fixed/10 border border-accent-ai/20 rounded-xl px-5 py-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-ai/20 rounded-lg">
            <span className="material-symbols-outlined text-accent-ai" style={{ fontSize: 24 }}>smart_toy</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface">AI Dispatcher — Demo Mode</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {recommendations.filter(r => r.status === 'pending').length} pending recommendations · No real optimization engine — data is simulated for demonstration
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent-ai animate-pulse" />
            <span className="text-xs font-semibold text-accent-ai">AI Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
        {/* Left panel */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">
            All Recommendations ({recommendations.length})
          </p>
          {recommendations.map(r => {
            const j = allJobs.find(x => x.id === r.jobId)
            const v = allVehicles.find(x => x.id === r.recommendedVehicleId)
            const isActive = selected === r.id
            const borderColor = r.status === 'pending' ? 'border-l-accent-ai' : r.status === 'approved' ? 'border-l-success' : r.status === 'rejected' ? 'border-l-danger' : 'border-l-warning'
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`w-full text-left p-3.5 rounded-xl border-l-4 border border-outline-variant/50 transition-all ${borderColor} ${isActive ? 'shadow-md ring-1 ring-primary/10 bg-surface-container-low' : 'bg-surface-container-lowest hover:bg-surface-container-low/50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-on-surface">{j?.jobNumber}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-accent-ai">Score {r.score}</span>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
                <p className="text-[11px] text-on-surface-variant truncate">{j?.customer}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-on-surface-variant">
                  <span>{v?.regNumber}</span>
                  <span>·</span>
                  <span>{formatDistance(r.estimatedDistanceKm)}</span>
                  <span>·</span>
                  <span>{formatINR(r.estimatedCostINR)}</span>
                </div>
                {r.warnings.length > 0 && (
                  <p className="text-[10px] text-warning mt-1 truncate">⚠ {r.warnings[0]}</p>
                )}
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        {rec && job && vehicle && driver ? (
          <div className="space-y-4">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-accent-ai" style={{ fontSize: 20 }}>smart_toy</span>
                    <h2 className="text-base font-bold text-on-surface">{job.jobNumber}</h2>
                    <StatusBadge status={job.priority} />
                  </div>
                  <p className="text-sm text-on-surface-variant">{job.customer}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{job.origin} → {job.destination}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-accent-ai">{rec.score}<span className="text-sm text-on-surface-variant">/100</span></p>
                  <StatusBadge status={rec.status} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-outline-variant/30">
                {[
                  { label: 'Distance', value: formatDistance(rec.estimatedDistanceKm) },
                  { label: 'Duration', value: formatDuration(rec.estimatedTimeMin) },
                  { label: 'Cost', value: formatINR(rec.estimatedCostINR) },
                ].map(m => (
                  <div key={m.label} className="bg-surface-container rounded-lg p-3 text-center">
                    <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">{m.label}</p>
                    <p className="text-base font-bold text-on-surface mt-1">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-info" style={{ fontSize: 18 }}>directions_car</span>
                  <h3 className="text-xs font-bold text-on-surface">Vehicle</h3>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-on-surface-variant">Registration</span><span className="font-semibold">{vehicle.regNumber}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Type</span><span className="font-semibold capitalize">{vehicle.type.replace('-',' ')}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Capacity</span><span className="font-semibold">{(vehicle.capacityKg/1000).toFixed(0)}t ({Math.round(job.requiredCapacityKg/vehicle.capacityKg*100)}% fill)</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Status</span><StatusBadge status={vehicle.status} /></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Compliance</span><StatusBadge status={vehicle.complianceStatus} /></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-success" style={{ fontSize: 18 }}>person</span>
                  <h3 className="text-xs font-bold text-on-surface">Driver</h3>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-on-surface-variant">Name</span><span className="font-semibold">{driver.name}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Rating</span><span className="font-semibold">⭐ {driver.rating}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Hours / Week</span><span className={`font-semibold ${driver.hoursThisWeek > 40 ? 'text-danger' : 'text-on-surface'}`}>{driver.hoursThisWeek}h</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Risk</span><StatusBadge status={driver.riskScore} /></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Depot</span><span className="font-semibold">{driver.depot}</span></div>
                </div>
              </div>
            </div>

            {/* Reasons / warnings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                <h3 className="text-xs font-bold text-success mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>thumb_up</span>Why this assignment
                </h3>
                <ul className="space-y-1.5">
                  {rec.reasons.map((r, i) => (
                    <li key={i} className="text-[11px] text-on-surface-variant flex gap-1.5">
                      <span className="text-success shrink-0">✓</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${rec.warnings.length ? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20'} border rounded-xl p-4`}>
                <h3 className={`text-xs font-bold mb-2 flex items-center gap-1.5 ${rec.warnings.length ? 'text-warning' : 'text-success'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{rec.warnings.length ? 'warning' : 'check_circle'}</span>
                  {rec.warnings.length ? `Warnings (${rec.warnings.length})` : 'No Warnings'}
                </h3>
                {rec.warnings.length > 0 ? (
                  <ul className="space-y-1.5">
                    {rec.warnings.map((w, i) => (
                      <li key={i} className="text-[11px] text-warning flex gap-1.5"><span className="shrink-0">⚠</span>{w}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-on-surface-variant">No constraints or warnings for this dispatch.</p>
                )}
              </div>
            </div>

            {/* Override note */}
            {rec.overrideReason && (
              <div className="bg-danger/5 border border-danger/20 rounded-xl p-3 text-xs text-danger">
                <span className="font-bold">Decision note: </span>{rec.overrideReason}
              </div>
            )}

            {/* Actions */}
            {rec.status === 'pending' && (
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => approveRecommendation(rec.id, 'Priya Sharma')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-success text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                >
                  <span className="material-symbols-outlined sz-sm">check</span>
                  Approve & Dispatch
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-danger text-danger rounded-xl text-sm font-semibold hover:bg-danger/10 transition-colors"
                >
                  <span className="material-symbols-outlined sz-sm">close</span>
                  Reject
                </button>
              </div>
            )}
            {rec.status !== 'pending' && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/30">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
                This recommendation has been <strong className="text-on-surface">{rec.status}</strong>
                {rec.approvedBy && ` by ${rec.approvedBy}`}.
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 bg-surface-container-lowest rounded-xl border border-outline-variant/50 text-on-surface-variant text-sm">
            Select a recommendation
          </div>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-base font-bold text-on-surface mb-3">Reject Recommendation</h3>
            <textarea className="w-full border border-outline-variant rounded-lg p-3 text-sm resize-none outline-none focus:border-primary focus:ring-1 focus:ring-primary" rows={3} placeholder="Reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low rounded-lg">Cancel</button>
              <button disabled={!rejectReason.trim()} onClick={() => { rejectRecommendation(rec!.id, rejectReason); setShowRejectModal(false); setRejectReason('') }} className="px-4 py-2 text-sm bg-danger text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
