import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { vehicles as fallbackVehicles, drivers as fallbackDrivers, jobs as fallbackJobs } from '../../data/mockData'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatINR, formatDistance, formatDuration } from '../../lib/utils'
import {
  Bot,
  Truck,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Check,
  X,
  ShieldCheck,
  DollarSign,
  Navigation,
} from 'lucide-react'

export default function AIDispatcherPage() {
  const { recommendations, jobs: storeJobs, vehicles: storeVehicles, drivers: storeDrivers, approveRecommendation, rejectRecommendation } = useAppStore()
  
  const allJobs = storeJobs && storeJobs.length > 0 ? storeJobs : fallbackJobs
  const allVehicles = storeVehicles && storeVehicles.length > 0 ? storeVehicles : fallbackVehicles
  const allDrivers = storeDrivers && storeDrivers.length > 0 ? storeDrivers : fallbackDrivers

  const [selected, setSelected] = useState<string | null>(
    recommendations.find(r => r.status === 'pending')?.id ?? recommendations[0]?.id ?? null
  )
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const rec = recommendations.find(r => r.id === selected)
  const job = rec ? allJobs.find(j => j.id === rec.jobId) : null
  const vehicle = rec ? allVehicles.find(v => v.id === rec.recommendedVehicleId) : null
  const driver = rec ? allDrivers.find(d => d.id === rec.recommendedDriverId) : null

  const pendingCount = recommendations.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* AI Dispatcher Command Strip */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent-ai/10 text-accent-ai rounded-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface flex items-center gap-2">
              Autonomous Dispatch Assistant
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-ai/10 text-accent-ai border border-accent-ai/20">
                AI Optimization Active
              </span>
            </h1>
            <p className="text-xs text-on-surface-variant">
              Multi-variable matching engine evaluating vehicle proximity, payload fit, driver HOS, and corridor economics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 text-xs font-semibold text-on-surface">
            {pendingCount} Pending Decisions
          </span>
        </div>
      </div>

      {/* Two-Pane Operational Decision Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 items-start">
        {/* Left Column: List of AI Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Recommendation Queue ({recommendations.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto">
            {recommendations.map(r => {
              const j = allJobs.find(x => x.id === r.jobId)
              const v = allVehicles.find(x => x.id === r.recommendedVehicleId)
              const isActive = selected === r.id

              let borderClass = 'border-l-4 border-l-accent-ai'
              if (r.status === 'approved') borderClass = 'border-l-4 border-l-success'
              if (r.status === 'rejected') borderClass = 'border-l-4 border-l-danger'
              if (r.status === 'overridden') borderClass = 'border-l-4 border-l-warning'

              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  className={`w-full text-left p-3.5 rounded-xl border border-outline-variant/50 transition-all ${borderClass} ${
                    isActive
                      ? 'shadow-md bg-surface-container-low ring-1 ring-primary/20'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-on-surface">{j?.jobNumber}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-accent-ai">Score {r.score}</span>
                      <StatusBadge status={r.status} dot />
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-on-surface truncate">{j?.customer}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {j?.origin.split(',')[0]} → {j?.destination.split(',')[0]}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30 text-[11px]">
                    <span className="font-mono text-on-surface font-medium">{v?.regNumber}</span>
                    <span className="text-on-surface-variant font-mono">{formatDistance(r.estimatedDistanceKm)}</span>
                    <span className="font-mono font-bold text-primary">{formatINR(r.estimatedCostINR)}</span>
                  </div>

                  {r.warnings.length > 0 && (
                    <div className="mt-1.5 text-[10px] text-warning flex items-center gap-1 truncate">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{r.warnings[0]}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Decision Audit & Approval Panel */}
        {rec && job && vehicle && driver ? (
          <div className="space-y-4">
            {/* Top Detail Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-outline-variant/40">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 bg-accent-ai/10 text-accent-ai rounded-md">
                      <Bot className="w-4 h-4" />
                    </span>
                    <h2 className="text-base font-bold text-on-surface">{job.jobNumber}</h2>
                    <StatusBadge status={job.priority} />
                    <StatusBadge status={rec.status} dot />
                  </div>
                  <p className="text-xs font-semibold text-on-surface">{job.customer}</p>
                  <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-info" /> {job.origin} <span className="text-on-surface">→</span> {job.destination}
                  </p>
                </div>

                {/* Score & KPI Callout */}
                <div className="text-right shrink-0">
                  <div className="inline-flex flex-col items-end">
                    <span className="text-2xl font-bold font-mono text-accent-ai leading-tight">
                      {rec.score}
                      <span className="text-xs text-on-surface-variant font-normal">/100</span>
                    </span>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                      Optimization Confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Metric Ribbon */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-surface-container-low rounded-xl p-3 text-center border border-outline-variant/40">
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Total Corridor</p>
                  <p className="text-base font-bold text-on-surface font-mono mt-0.5">{formatDistance(rec.estimatedDistanceKm)}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-3 text-center border border-outline-variant/40">
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Estimated Transit</p>
                  <p className="text-base font-bold text-on-surface font-mono mt-0.5">{formatDuration(rec.estimatedTimeMin)}</p>
                </div>
                <div className="bg-surface-container-low rounded-xl p-3 text-center border border-outline-variant/40">
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Projected Cost</p>
                  <p className="text-base font-bold text-primary font-mono mt-0.5">{formatINR(rec.estimatedCostINR)}</p>
                </div>
              </div>
            </div>

            {/* Vehicle & Driver Pairing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Recommended Vehicle */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-4 shadow-sm text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-info" /> Recommended Asset
                  </span>
                  <StatusBadge status={vehicle.status} dot />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Registration:</span>
                    <span className="font-mono font-bold text-on-surface">{vehicle.regNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Type & Model:</span>
                    <span className="font-semibold text-on-surface">{vehicle.make} · {vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Capacity Fill:</span>
                    <span className="font-semibold text-on-surface">
                      {(vehicle.capacityKg / 1000).toFixed(0)}t capacity ({Math.round((job.requiredCapacityKg / vehicle.capacityKg) * 100)}% payload fill)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Regulatory Compliance:</span>
                    <StatusBadge status={vehicle.complianceStatus} />
                  </div>
                </div>
              </div>

              {/* Recommended Driver */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-4 shadow-sm text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-success" /> Assigned Driver
                  </span>
                  <StatusBadge status={driver.riskScore} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Driver Name:</span>
                    <span className="font-bold text-on-surface">{driver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Safety Rating:</span>
                    <span className="font-semibold text-on-surface">⭐ {driver.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Weekly Hours (HOS):</span>
                    <span className={`font-semibold ${driver.hoursThisWeek > 40 ? 'text-danger' : 'text-on-surface'}`}>
                      {driver.hoursThisWeek}h logged (max 50h)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Home Base Depot:</span>
                    <span className="font-semibold text-on-surface">{driver.depot}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Rationale & Safety Checks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-success/5 border border-success/20 rounded-xl p-4 space-y-2">
                <span className="font-bold text-success flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Optimization Rationale
                </span>
                <ul className="space-y-1.5 text-[11px] text-on-surface-variant">
                  {rec.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`border rounded-xl p-4 space-y-2 ${rec.warnings.length ? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20'}`}>
                <span className={`font-bold flex items-center gap-1.5 ${rec.warnings.length ? 'text-warning' : 'text-success'}`}>
                  {rec.warnings.length ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  {rec.warnings.length ? `Constraints & Warnings (${rec.warnings.length})` : 'All Constraints Satisfied'}
                </span>
                {rec.warnings.length > 0 ? (
                  <ul className="space-y-1.5 text-[11px] text-warning">
                    {rec.warnings.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-on-surface-variant">
                    Zero route or vehicle constraints detected. Safe to dispatch.
                  </p>
                )}
              </div>
            </div>

            {/* Decision Actions Bar */}
            {rec.status === 'pending' && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => approveRecommendation(rec.id, 'Priya Sharma')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-success text-white rounded-xl text-xs font-semibold hover:bg-success/90 transition-opacity shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Approve & Dispatch Assignment
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-danger/40 text-danger rounded-xl text-xs font-semibold hover:bg-danger/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reject Recommendation
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-on-surface-variant text-xs">
            Select a recommendation from the queue
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl p-6 w-full max-w-md animate-fade-in space-y-4">
            <h3 className="text-base font-bold text-on-surface">Reject Dispatch Recommendation</h3>
            <p className="text-xs text-on-surface-variant">
              Provide an operational rationale so the optimization model learns dispatcher preferences.
            </p>
            <textarea
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-xs outline-none focus:border-primary resize-none"
              rows={3}
              placeholder="e.g., driver on scheduled medical leave, customer requested refrigerated reefer instead..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!rejectReason.trim()}
                onClick={() => {
                  rejectRecommendation(rec!.id, rejectReason)
                  setShowRejectModal(false)
                  setRejectReason('')
                }}
                className="px-4 py-2 text-xs font-semibold bg-danger text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
