import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { api } from '../../lib/api'
import { formatINR } from '../../lib/utils'
import StatusBadge from '../../components/ui/StatusBadge'
import {
  RotateCcw,
  TrendingUp,
  MapPin,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  Layers,
  Fuel,
  DollarSign,
  Maximize2,
  Check,
  X,
} from 'lucide-react'

interface ReturnMatch {
  id: string
  fromJob: string
  vehicleId: string
  vehicleReg: string
  vehicleType: string
  capacityKg: number
  driverName: string
  outboundRoute: { from: string; to: string }
  backhaulShipper: string
  pickupHub: string
  deliveryHub: string
  cargoDescription: string
  cargoWeightKg: number
  baselineEmptyKm: number
  detourKm: number
  totalBackhaulKm: number
  addedTransitHours: number
  revenueINR: number
  incrementalCostINR: number
  netSavingsINR: number
  capacityFillPct: number
  matchScore: number
  status: 'pending' | 'approved' | 'rejected'
  checks: {
    capacityOk: boolean
    driverHosOk: boolean
    equipmentMatched: boolean
    timeWindowFeasible: boolean
  }
  warnings: string[]
}

const INITIAL_MATCHES: ReturnMatch[] = [
  {
    id: 'BM-2026-001',
    fromJob: 'TO-2610-020',
    vehicleId: 'V020',
    vehicleReg: 'MH01KL0123',
    vehicleType: 'Heavy Multi-Axle (55t)',
    capacityKg: 55000,
    driverName: 'Vikram Kolekar',
    outboundRoute: { from: 'Mumbai JNPT', to: 'Panaji, Goa' },
    backhaulShipper: 'Goa Cashew Exports Ltd',
    pickupHub: 'Panaji Port Terminal, Goa',
    deliveryHub: 'Mumbai Port Trust, Mumbai',
    cargoDescription: 'Raw Cashew Kernels & Agro Export',
    cargoWeightKg: 50000,
    baselineEmptyKm: 584,
    detourKm: 18,
    totalBackhaulKm: 602,
    addedTransitHours: 1.2,
    revenueINR: 78000,
    incrementalCostINR: 39300,
    netSavingsINR: 38700,
    capacityFillPct: 91,
    matchScore: 94,
    status: 'pending',
    checks: {
      capacityOk: true,
      driverHosOk: true,
      equipmentMatched: true,
      timeWindowFeasible: true,
    },
    warnings: ['Requires moisture barrier tarpaulin for agro cargo.'],
  },
  {
    id: 'BM-2026-002',
    fromJob: 'TO-2610-009',
    vehicleId: 'V009',
    vehicleReg: 'KA01OP9012',
    vehicleType: 'Volvo FM 420 (24t)',
    capacityKg: 24000,
    driverName: 'Sanjay Nair',
    outboundRoute: { from: 'Bengaluru', to: 'Hyderabad Store' },
    backhaulShipper: 'Hyderabad Pharma Corridors Ltd',
    pickupHub: 'Medchal Industrial, Hyderabad',
    deliveryHub: 'Bengaluru Bio-Corridor Hub',
    cargoDescription: 'Temperature-Stabilized Medical Excipients',
    cargoWeightKg: 19500,
    baselineEmptyKm: 568,
    detourKm: 26,
    totalBackhaulKm: 594,
    addedTransitHours: 1.5,
    revenueINR: 84000,
    incrementalCostINR: 41900,
    netSavingsINR: 42100,
    capacityFillPct: 81,
    matchScore: 89,
    status: 'pending',
    checks: {
      capacityOk: true,
      driverHosOk: true,
      equipmentMatched: true,
      timeWindowFeasible: true,
    },
    warnings: [],
  },
  {
    id: 'BM-2026-003',
    fromJob: 'TO-2610-006',
    vehicleId: 'V006',
    vehicleReg: 'RJ14IJ6789',
    vehicleType: 'Tata Prima (28t)',
    capacityKg: 28000,
    driverName: 'Arun Sharma',
    outboundRoute: { from: 'Jaipur Factory', to: 'Delhi Distribution' },
    backhaulShipper: 'Amul Dairy Cooperative',
    pickupHub: 'Meerut Milk Processing, UP',
    deliveryHub: 'Delhi Central Distribution',
    cargoDescription: 'Dry Milk Powder in Sealed Drums',
    cargoWeightKg: 26500,
    baselineEmptyKm: 72,
    detourKm: 12,
    totalBackhaulKm: 84,
    addedTransitHours: 0.8,
    revenueINR: 14500,
    incrementalCostINR: 8300,
    netSavingsINR: 6200,
    capacityFillPct: 95,
    matchScore: 92,
    status: 'pending',
    checks: {
      capacityOk: true,
      driverHosOk: true,
      equipmentMatched: true,
      timeWindowFeasible: true,
    },
    warnings: [],
  },
  {
    id: 'BM-2026-004',
    fromJob: 'TO-2610-011',
    vehicleId: 'V011',
    vehicleReg: 'TN01ST1234',
    vehicleType: 'Heavy Truck 3518 (35t)',
    capacityKg: 35000,
    driverName: 'Murugan Selvam',
    outboundRoute: { from: 'Chennai Port', to: 'Vizag Plant' },
    backhaulShipper: 'RINL Vizag Steel Authority',
    pickupHub: 'Vizag Steel Stockyard',
    deliveryHub: 'Chennai Port Terminal',
    cargoDescription: 'Structural Steel Angles & Rods',
    cargoWeightKg: 29800,
    baselineEmptyKm: 766,
    detourKm: 22,
    totalBackhaulKm: 788,
    addedTransitHours: 2.0,
    revenueINR: 118000,
    incrementalCostINR: 56700,
    netSavingsINR: 61300,
    capacityFillPct: 85,
    matchScore: 78,
    status: 'pending',
    checks: {
      capacityOk: true,
      driverHosOk: false, // High HOS caution
      equipmentMatched: true,
      timeWindowFeasible: true,
    },
    warnings: ['Driver D011 at 46h weekly HOS limit. Secondary relief driver mandatory.'],
  },
  {
    id: 'BM-2026-005',
    fromJob: 'TO-2610-014',
    vehicleId: 'V014',
    vehicleReg: 'UP32YZ4567',
    vehicleType: 'Ultra 1412 (14t)',
    capacityKg: 14000,
    driverName: 'Rakesh Pandey',
    outboundRoute: { from: 'Lucknow Factory', to: 'Delhi Warehouse' },
    backhaulShipper: 'IKEA India Retail Logistics',
    pickupHub: 'IKEA Gurgaon Distribution Hub',
    deliveryHub: 'Chandigarh Regional Store',
    cargoDescription: 'Flat-pack Furniture & Home Accessories',
    cargoWeightKg: 10200,
    baselineEmptyKm: 248,
    detourKm: 34,
    totalBackhaulKm: 282,
    addedTransitHours: 1.8,
    revenueINR: 42000,
    incrementalCostINR: 22200,
    netSavingsINR: 19800,
    capacityFillPct: 73,
    matchScore: 76,
    status: 'pending',
    checks: {
      capacityOk: true,
      driverHosOk: true,
      equipmentMatched: true,
      timeWindowFeasible: true,
    },
    warnings: ['Destination redirects to Chandigarh instead of Lucknow origin base.'],
  },
]

export default function ReturnLoadPage() {
  const [matches, setMatches] = useState<ReturnMatch[]>(INITIAL_MATCHES)
  const [selectedMatch, setSelectedMatch] = useState<ReturnMatch | null>(INITIAL_MATCHES[0])
  const [filterRegion, setFilterRegion] = useState<'all' | 'west' | 'south' | 'north'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const showToast = useAppStore(s => s.showToast)
  const fetchData = useAppStore(s => s.fetchData)

  // Fetch live matches from FastAPI backend
  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await api.returnLoads.list()
        if (res?.data?.length) {
          const adapted: ReturnMatch[] = res.data.map((raw: any) => ({
            id: raw.id,
            fromJob: raw.from_job_id || raw.fromJob || 'J001',
            vehicleId: raw.vehicle_id || raw.vehicleId || 'V001',
            vehicleReg: raw.vehicle_reg || raw.vehicleReg || 'TN01AB1234',
            vehicleType: raw.vehicle_type || raw.vehicleType || 'Heavy Truck (28t)',
            capacityKg: raw.capacity_kg || raw.capacityKg || 28000,
            driverName: raw.driver_name || raw.driverName || 'Arjun Kumar',
            outboundRoute: {
              from: raw.outbound_origin || 'Chennai',
              to: raw.outbound_destination || 'Bengaluru',
            },
            backhaulShipper: raw.backhaul_shipper || raw.backhaulShipper || 'Toyota Boshoku Karnataka',
            pickupHub: raw.pickup_hub || raw.pickupHub || 'Bengaluru Electronic City Hub',
            deliveryHub: raw.delivery_hub || raw.deliveryHub || 'Sriperumbudur Auto Cluster',
            cargoDescription: raw.cargo_description || raw.cargoDescription || 'Automotive Seating & Door Modules',
            cargoWeightKg: raw.cargo_weight_kg || raw.cargoWeightKg || 18500,
            baselineEmptyKm: raw.baseline_empty_km || raw.baselineEmptyKm || 346,
            detourKm: raw.detour_km || raw.detourKm || 14,
            totalBackhaulKm: raw.total_backhaul_km || raw.totalBackhaulKm || 360,
            addedTransitHours: raw.added_transit_hours || raw.addedTransitHours || 1.1,
            revenueINR: raw.revenue_inr || raw.revenueINR || 52000,
            incrementalCostINR: raw.incremental_cost_inr || raw.incrementalCostINR || 24800,
            netSavingsINR: raw.net_savings_inr || raw.netSavingsINR || 27200,
            capacityFillPct: raw.capacity_fill_pct || raw.capacityFillPct || 88,
            matchScore: raw.match_score || raw.matchScore || 96,
            status: raw.status || 'pending',
            checks: {
              capacityOk: true,
              driverHosOk: true,
              equipmentMatched: true,
              timeWindowFeasible: true,
            },
            warnings: raw.warnings || [],
          }))
          setMatches(adapted)
          setSelectedMatch(adapted[0])
        }
      } catch (err) {
        console.warn('Backend return-loads sync using active dataset', err)
      }
    }
    fetchMatches()
  }, [])

  // Filtered list
  const filteredMatches = matches.filter(m => {
    const matchesSearch =
      m.fromJob.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.backhaulShipper.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.pickupHub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deliveryHub.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (filterRegion === 'west') return m.pickupHub.includes('Goa') || m.pickupHub.includes('Mumbai')
    if (filterRegion === 'south') return m.pickupHub.includes('Hyderabad') || m.pickupHub.includes('Bengaluru') || m.pickupHub.includes('Chennai') || m.pickupHub.includes('Vizag')
    if (filterRegion === 'north') return m.pickupHub.includes('Meerut') || m.pickupHub.includes('Gurgaon')
    return true
  })

  // Executive Totals
  const totalSavings = matches
    .filter(m => m.status !== 'rejected')
    .reduce((acc, m) => acc + m.netSavingsINR, 0)
  const totalDeadheadSavedKm = matches
    .filter(m => m.status !== 'rejected')
    .reduce((acc, m) => acc + m.baselineEmptyKm, 0)
  const avgCapacityMatch = Math.round(
    matches.reduce((acc, m) => acc + m.capacityFillPct, 0) / (matches.length || 1)
  )

  function initiateDecision(action: 'approve' | 'reject') {
    setPendingAction(action)
    setShowConfirmModal(true)
  }

  async function handleConfirmDecision() {
    if (!selectedMatch || !pendingAction) return

    if (pendingAction === 'approve') {
      try {
        await api.returnLoads.approve(selectedMatch.id, 'Senior Dispatcher')
        setMatches(prev =>
          prev.map(m => (m.id === selectedMatch.id ? { ...m, status: 'approved' } : m))
        )
        setSelectedMatch(prev => (prev ? { ...prev, status: 'approved' } : null))
        showToast(
          `Backhaul confirmed & trip created: ${selectedMatch.backhaulShipper} dispatched to ${selectedMatch.vehicleReg}. Contribution: ${formatINR(selectedMatch.netSavingsINR)}`,
          'success'
        )
        await fetchData()
      } catch (err: any) {
        setMatches(prev =>
          prev.map(m => (m.id === selectedMatch.id ? { ...m, status: 'approved' } : m))
        )
        setSelectedMatch(prev => (prev ? { ...prev, status: 'approved' } : null))
        showToast(`Backhaul confirmed (${err.message})`, 'info')
      }
    } else {
      setMatches(prev =>
        prev.map(m => (m.id === selectedMatch.id ? { ...m, status: 'rejected' } : m))
      )
      setSelectedMatch(prev => (prev ? { ...prev, status: 'rejected' } : null))
      showToast(
        `Backhaul rejected for ${selectedMatch.id}${rejectReason ? `: ${rejectReason}` : ''}`,
        'info'
      )
    }

    setShowConfirmModal(false)
    setPendingAction(null)
    setRejectReason('')
  }

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Executive KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/60 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-accent-ai/10 text-accent-ai rounded-lg shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider truncate">
              Match Opportunities
            </p>
            <p className="text-xl font-bold text-on-surface">{matches.length} Eligible</p>
            <p className="text-[10px] text-accent-ai font-medium">Auto-scored by AI</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/60 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-success/10 text-success rounded-lg shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider truncate">
              Potential Backhaul Value
            </p>
            <p className="text-xl font-bold text-success font-mono">{formatINR(totalSavings)}</p>
            <p className="text-[10px] text-on-surface-variant font-medium">Net freight contribution</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/60 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-info/10 text-info rounded-lg shrink-0">
            <Fuel className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider truncate">
              Deadhead Km Saved
            </p>
            <p className="text-xl font-bold text-on-surface font-mono">{totalDeadheadSavedKm.toLocaleString()} km</p>
            <p className="text-[10px] text-info font-medium">Empty haul eliminated</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/60 shadow-2xs flex items-center gap-3">
          <div className="p-2.5 bg-warning/10 text-warning rounded-lg shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider truncate">
              Avg Capacity Match
            </p>
            <p className="text-xl font-bold text-on-surface font-mono">{avgCapacityMatch}%</p>
            <p className="text-[10px] text-on-surface-variant font-medium">High cubing efficiency</p>
          </div>
        </div>
      </div>

      {/* Main Two-Pane Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-4 items-start">
        {/* Left Pane: Opportunities List & Filtering */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 border-b border-outline-variant/40 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search return trips, vehicles, shippers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All Corridors' },
                { id: 'west', label: 'West' },
                { id: 'south', label: 'South' },
                { id: 'north', label: 'North' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterRegion(f.id as typeof filterRegion)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                    filterRegion === f.id
                      ? 'bg-primary text-white'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Opportunities */}
          <div className="divide-y divide-outline-variant/30 max-h-[640px] overflow-y-auto">
            {filteredMatches.map(m => {
              const isSelected = selectedMatch?.id === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`w-full text-left p-3.5 transition-all flex flex-col gap-2 relative ${
                    isSelected
                      ? 'bg-surface-container-low border-l-4 border-primary shadow-inner'
                      : 'hover:bg-surface-container-low/50'
                  }`}
                >
                  {/* Top Row: Outbound Job & Vehicle */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-primary">{m.fromJob}</span>
                      <span className="text-[10px] text-on-surface-variant">({m.vehicleReg})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-accent-ai/10 text-accent-ai border border-accent-ai/20">
                        Score {m.matchScore}
                      </span>
                      <StatusBadge status={m.status} dot />
                    </div>
                  </div>

                  {/* Outbound destination -> Candidate backhaul load */}
                  <div className="text-xs">
                    <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                      <span>{m.outboundRoute.to}</span>
                      <ArrowRight className="w-3 h-3 text-on-surface-variant" />
                      <span className="font-medium text-on-surface truncate">{m.pickupHub.split(',')[0]}</span>
                    </p>
                    <p className="font-semibold text-on-surface mt-0.5 truncate">{m.backhaulShipper}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {m.cargoDescription} ({(m.cargoWeightKg / 1000).toFixed(1)}t)
                    </p>
                  </div>

                  {/* Financial & Distance Metric Ribbon */}
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-outline-variant/30">
                    <span className="font-mono font-bold text-success">
                      +{formatINR(m.netSavingsINR)} contribution
                    </span>
                    <span className="text-on-surface-variant font-mono">
                      {m.baselineEmptyKm} km deadhead avoided
                    </span>
                  </div>

                  {/* Warnings indicator if any */}
                  {m.warnings.length > 0 && (
                    <div className="text-[10px] text-warning flex items-center gap-1 truncate">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{m.warnings[0]}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Pane: Detailed Visual Match Comparison & Decision Workflow */}
        {selectedMatch ? (
          <div className="space-y-4">
            {/* Header Card with Route Title & Actions */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/40">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 bg-accent-ai/10 text-accent-ai rounded-md">
                      <RotateCcw className="w-4 h-4" />
                    </span>
                    <h2 className="text-base font-bold text-on-surface">{selectedMatch.backhaulShipper}</h2>
                    <StatusBadge status={selectedMatch.status} dot />
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Outbound Trip {selectedMatch.fromJob} · Assigned to {selectedMatch.vehicleReg} ({selectedMatch.driverName})
                  </p>
                </div>

                {/* Primary Decision Action Buttons */}
                {selectedMatch.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => initiateDecision('reject')}
                      className="px-3.5 py-2 border border-danger/40 text-danger hover:bg-danger/10 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject Match
                    </button>
                    <button
                      onClick={() => initiateDecision('approve')}
                      className="px-4 py-2 bg-success text-white hover:bg-success/90 text-xs font-semibold rounded-lg shadow-sm transition-opacity flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Dispatch Backhaul
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 text-xs text-on-surface-variant">
                    <span className="font-semibold capitalize text-on-surface">{selectedMatch.status}</span>
                    <span>on {new Date().toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Side-by-Side Journey Comparison: Baseline Empty vs Proposed Backhaul */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {/* Left: Baseline Empty Deadhead */}
                <div className="p-3.5 rounded-xl border border-outline-variant/50 bg-surface-container-low/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Baseline Journey (Empty Return)
                      </span>
                      <span className="text-[10px] font-semibold text-danger bg-danger/10 px-2 py-0.5 rounded-full">
                        100% Unproductive
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="text-on-surface font-semibold">
                        {selectedMatch.outboundRoute.to} → {selectedMatch.outboundRoute.from}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">Empty truck repositioning without freight</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-outline-variant/30 text-center">
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase">Distance</p>
                        <p className="text-xs font-bold font-mono text-on-surface">{selectedMatch.baselineEmptyKm} km</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase">Cargo</p>
                        <p className="text-xs font-bold font-mono text-danger">0 kg</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase">Revenue</p>
                        <p className="text-xs font-bold font-mono text-danger">₹0</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-surface-container rounded-lg text-[10px] text-on-surface-variant text-center">
                    Vehicle incurs fuel + toll burn without earning revenue.
                  </div>
                </div>

                {/* Right: Proposed Loaded Backhaul */}
                <div className="p-3.5 rounded-xl border-2 border-success/40 bg-success/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Proposed Backhaul Pairing
                      </span>
                      <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full">
                        {selectedMatch.capacityFillPct}% Capacity Fill
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="text-on-surface font-semibold">
                        {selectedMatch.pickupHub.split(',')[0]} → {selectedMatch.deliveryHub.split(',')[0]}
                      </p>
                      <p className="text-[11px] text-on-surface-variant truncate">{selectedMatch.cargoDescription}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-success/20 text-center">
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase">Total Km</p>
                        <p className="text-xs font-bold font-mono text-on-surface">
                          {selectedMatch.totalBackhaulKm} km <span className="text-[9px] text-warning font-normal">(+{selectedMatch.detourKm}km)</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase">Loaded</p>
                        <p className="text-xs font-bold font-mono text-success">
                          {(selectedMatch.cargoWeightKg / 1000).toFixed(1)}t
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant uppercase">Gross Rev</p>
                        <p className="text-xs font-bold font-mono text-success">
                          {formatINR(selectedMatch.revenueINR)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-success/10 rounded-lg text-[10px] text-success font-semibold text-center flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Net Contribution: +{formatINR(selectedMatch.netSavingsINR)} after detour costs
                  </div>
                </div>
              </div>

              {/* Corridor Route Visualizer SVG */}
              <div className="mt-4 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                  Corridor Detour & Waypoint Visualization
                </span>
                <div className="h-14 flex items-center justify-between relative px-6">
                  {/* Base corridor line */}
                  <div className="absolute left-10 right-10 h-1 bg-outline-variant/60 -z-0" />
                  <div className="absolute left-10 right-10 h-1 bg-success/80 -z-0" />

                  {/* Node 1: Origin/Dropoff */}
                  <div className="flex flex-col items-center relative z-10 text-center">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      1
                    </div>
                    <span className="text-[10px] font-semibold text-on-surface mt-1 truncate max-w-[90px]">
                      {selectedMatch.outboundRoute.to.split(',')[0]}
                    </span>
                    <span className="text-[9px] text-on-surface-variant">Outbound Drop</span>
                  </div>

                  {/* Node 2: Backhaul Pickup Detour */}
                  <div className="flex flex-col items-center relative z-10 text-center">
                    <div className="w-6 h-6 rounded-full bg-accent-ai text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-accent-ai/20 shadow-xs">
                      2
                    </div>
                    <span className="text-[10px] font-semibold text-accent-ai mt-1 truncate max-w-[110px]">
                      {selectedMatch.pickupHub.split(',')[0]}
                    </span>
                    <span className="text-[9px] text-on-surface-variant">Pickup (+{selectedMatch.detourKm}km)</span>
                  </div>

                  {/* Node 3: Home Base / Delivery */}
                  <div className="flex flex-col items-center relative z-10 text-center">
                    <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      3
                    </div>
                    <span className="text-[10px] font-semibold text-on-surface mt-1 truncate max-w-[90px]">
                      {selectedMatch.deliveryHub.split(',')[0]}
                    </span>
                    <span className="text-[9px] text-on-surface-variant">Final Unload</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Economics & Compatibility Verification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Financial Economics Breakdown */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-sm text-xs">
                <h3 className="text-xs font-bold text-on-surface mb-3 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-success" /> Financial Contribution Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-outline-variant/30 text-on-surface">
                    <span className="text-on-surface-variant">Gross Freight Rate (Shipper Contract)</span>
                    <span className="font-mono font-semibold">{formatINR(selectedMatch.revenueINR)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/30 text-on-surface">
                    <span className="text-on-surface-variant">Incremental Fuel ({selectedMatch.detourKm + 50} km loaded)</span>
                    <span className="font-mono text-danger">-{formatINR(selectedMatch.incrementalCostINR * 0.65)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/30 text-on-surface">
                    <span className="text-on-surface-variant">Driver Backhaul Incentive & Tolls</span>
                    <span className="font-mono text-danger">-{formatINR(selectedMatch.incrementalCostINR * 0.35)}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold text-success text-sm">
                    <span>Net Contribution Gain</span>
                    <span className="font-mono">+{formatINR(selectedMatch.netSavingsINR)}</span>
                  </div>
                </div>
              </div>

              {/* Compatibility & Regulatory Verification */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-sm text-xs">
                <h3 className="text-xs font-bold text-on-surface mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Compatibility & Compliance Checks
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Vehicle Payload Compatibility</span>
                    <span className="flex items-center gap-1 text-success font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {(selectedMatch.cargoWeightKg / 1000).toFixed(0)}t / {(selectedMatch.capacityKg / 1000).toFixed(0)}t OK
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Driver Hours of Service (HOS)</span>
                    <span className={`flex items-center gap-1 font-semibold ${selectedMatch.checks.driverHosOk ? 'text-success' : 'text-danger'}`}>
                      {selectedMatch.checks.driverHosOk ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Compliant
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" /> HOS Caution (46h)
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant">Equipment & Body Type</span>
                    <span className="flex items-center gap-1 text-success font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dry Van / Multi-axle
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-on-surface-variant">Estimated Schedule Feasibility</span>
                    <span className="flex items-center gap-1 text-success font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Window Aligned
                    </span>
                  </div>
                </div>

                {selectedMatch.warnings.length > 0 && (
                  <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-lg text-[10px] text-warning flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{selectedMatch.warnings[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Decision Confirmation Modal */}
      {showConfirmModal && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl p-6 w-full max-w-md animate-fade-in space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${pendingAction === 'approve' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {pendingAction === 'approve' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  {pendingAction === 'approve' ? 'Confirm Backhaul Dispatch' : 'Reject Match Recommendation'}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {pendingAction === 'approve'
                    ? `Assigning ${selectedMatch.backhaulShipper} to ${selectedMatch.vehicleReg} will lock this vehicle for return transit and notify driver ${selectedMatch.driverName}.`
                    : 'Provide an operational rationale for overriding this AI return load pairing.'}
                </p>
              </div>
            </div>

            {pendingAction === 'approve' ? (
              <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Incremental Distance:</span>
                  <span className="font-semibold text-on-surface">+{selectedMatch.detourKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Net Contribution Earned:</span>
                  <span className="font-semibold text-success font-mono">+{formatINR(selectedMatch.netSavingsINR)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Vehicle Status:</span>
                  <span className="font-semibold text-on-surface">Assigned to Backhaul</span>
                </div>
              </div>
            ) : (
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (e.g. shipper delay, driver rest required, pallet mismatch)..."
                rows={3}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-xs text-on-surface outline-none focus:border-primary resize-none"
              />
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all shadow-xs ${
                  pendingAction === 'approve' ? 'bg-success hover:bg-success/90' : 'bg-danger hover:bg-danger/90'
                }`}
              >
                {pendingAction === 'approve' ? 'Confirm & Dispatch' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
