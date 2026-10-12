import { useState } from 'react'
import { vehicles as fallbackVehicles, jobs as fallbackJobs, drivers as fallbackDrivers } from '../../data/mockData'
import { useAppStore } from '../../store/useAppStore'
import { api } from '../../lib/api'
import type { Vehicle } from '../../types'
import StatusBadge from './StatusBadge'
import {
  Truck,
  MapPin,
  Navigation,
  Clock,
  User,
  Package,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Compass,
  Play,
  RotateCw,
  FastForward,
} from 'lucide-react'

// Hub coordinates mapped onto a 860x540 SVG coordinate grid for India major logistics corridors
export interface GeoHub {
  name: string
  code: string
  x: number
  y: number
  region: 'North' | 'West' | 'South' | 'East' | 'Central'
}

export const LOGISTICS_HUBS: Record<string, GeoHub> = {
  Delhi: { name: 'Delhi NCR Hub', code: 'DEL', x: 410, y: 120, region: 'North' },
  Gurgaon: { name: 'Gurgaon Sortation', code: 'GGN', x: 400, y: 135, region: 'North' },
  Jaipur: { name: 'Jaipur Depot', code: 'JAI', x: 330, y: 175, region: 'North' },
  Lucknow: { name: 'Lucknow Hub', code: 'LKO', x: 530, y: 175, region: 'North' },
  Ahmedabad: { name: 'Ahmedabad Industrial', code: 'AMD', x: 265, y: 245, region: 'West' },
  Rajkot: { name: 'Rajkot Terminal', code: 'RAJ', x: 215, y: 260, region: 'West' },
  Vadodara: { name: 'Vadodara Hub', code: 'BDQ', x: 285, y: 268, region: 'West' },
  Surat: { name: 'Surat Cargo', code: 'ST', x: 280, y: 295, region: 'West' },
  Mumbai: { name: 'Mumbai JNPT Port', code: 'BOM', x: 275, y: 345, region: 'West' },
  Pune: { name: 'Pune Chakan Hub', code: 'PNQ', x: 305, y: 365, region: 'West' },
  Nashik: { name: 'Nashik Depot', code: 'NSK', x: 310, y: 330, region: 'West' },
  Panaji: { name: 'Goa Coastal Hub', code: 'GOA', x: 300, y: 440, region: 'West' },
  Hyderabad: { name: 'Hyderabad Central', code: 'HYD', x: 460, y: 365, region: 'South' },
  Bengaluru: { name: 'Bengaluru Tech Logistics', code: 'BLR', x: 430, y: 450, region: 'South' },
  Chennai: { name: 'Chennai Port Hub', code: 'MAA', x: 510, y: 450, region: 'South' },
  Visakhapatnam: { name: 'Vizag Port Depot', code: 'VTZ', x: 620, y: 360, region: 'South' },
  Kolkata: { name: 'Kolkata Port Terminal', code: 'CCU', x: 690, y: 265, region: 'East' },
}

// Major freight corridors connecting hubs
const CORRIDOR_PATHS = [
  // Western Golden Quadrilateral (Delhi - Jaipur - Ahmedabad - Mumbai - Pune)
  { from: 'Delhi', to: 'Jaipur' },
  { from: 'Jaipur', to: 'Ahmedabad' },
  { from: 'Ahmedabad', to: 'Vadodara' },
  { from: 'Vadodara', to: 'Surat' },
  { from: 'Surat', to: 'Mumbai' },
  { from: 'Mumbai', to: 'Pune' },
  { from: 'Pune', to: 'Panaji' },

  // Southern Corridors
  { from: 'Pune', to: 'Hyderabad' },
  { from: 'Hyderabad', to: 'Bengaluru' },
  { from: 'Bengaluru', to: 'Chennai' },
  { from: 'Hyderabad', to: 'Visakhapatnam' },
  { from: 'Chennai', to: 'Visakhapatnam' },

  // Central & Northern Corridors
  { from: 'Delhi', to: 'Lucknow' },
  { from: 'Delhi', to: 'Gurgaon' },
  { from: 'Ahmedabad', to: 'Rajkot' },
  { from: 'Mumbai', to: 'Nashik' },
  { from: 'Lucknow', to: 'Kolkata' },
  { from: 'Visakhapatnam', to: 'Kolkata' },
]

interface FleetMapProps {
  selectedVehicleId?: string | null
  onSelectVehicle?: (v: Vehicle) => void
  highlightTripId?: string | null
  compact?: boolean
  className?: string
}

export default function FleetMap({
  selectedVehicleId,
  onSelectVehicle,
  compact = false,
  className = '',
}: FleetMapProps) {
  const storeVehicles = useAppStore(s => s.vehicles)
  const storeJobs = useAppStore(s => s.jobs)
  const storeDrivers = useAppStore(s => s.drivers)
  const showToast = useAppStore(s => s.showToast)
  const fetchData = useAppStore(s => s.fetchData)

  const [activeFilter, setActiveFilter] = useState<'all' | 'on-trip' | 'available' | 'delayed'>('all')
  const [activeHub, setActiveHub] = useState<string | null>(null)
  const [inspectVehicle, setInspectVehicle] = useState<Vehicle | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [isSimulating, setIsSimulating] = useState(false)

  const activeVehicles = storeVehicles && storeVehicles.length > 0 ? storeVehicles : fallbackVehicles
  const activeJobs = storeJobs && storeJobs.length > 0 ? storeJobs : fallbackJobs
  const activeDrivers = storeDrivers && storeDrivers.length > 0 ? storeDrivers : fallbackDrivers

  async function handleStepSimulation() {
    setIsSimulating(true)
    try {
      const res = await api.digitalTwin.stepSimulation()
      showToast(`Simulation step complete: ${res.updates?.length || 0} trips advanced (+10% progress)`, 'info')
      await fetchData()
    } catch (err: any) {
      showToast(`Simulation step: ${err.message}`, 'info')
    } finally {
      setIsSimulating(false)
    }
  }

  // Map vehicles to approximate hub coordinates with jitter so they don't overlap
  const mappedVehicles = activeVehicles.map((v, index) => {
    const hub = LOGISTICS_HUBS[v.location?.city || ''] || LOGISTICS_HUBS['Chennai'] || LOGISTICS_HUBS['Mumbai']
    // Deterministic offset to separate vehicles around hub
    const angle = (index * 47) % 360
    const radius = 14 + (index % 3) * 6
    const rad = (angle * Math.PI) / 180
    const x = Math.round(hub.x + Math.cos(rad) * radius)
    const y = Math.round(hub.y + Math.sin(rad) * radius)

    const job = activeJobs.find(j => j.id === v.currentJobId)
    const isDelayed = (job?.delayMinutes ?? 0) > 0

    return {
      ...v,
      mapX: x,
      mapY: y,
      hubName: hub.name,
      job,
      isDelayed,
    }
  })

  const filteredVehicles = mappedVehicles.filter(v => {
    if (activeFilter === 'on-trip') return v.status === 'on-trip'
    if (activeFilter === 'available') return v.status === 'available'
    if (activeFilter === 'delayed') return v.isDelayed
    return true
  })

  const currentInspected = inspectVehicle || (selectedVehicleId ? mappedVehicles.find(v => v.id === selectedVehicleId) : null)
  const inspectedJob = currentInspected ? activeJobs.find(j => j.id === currentInspected.currentJobId) : null
  const inspectedDriver = currentInspected ? activeDrivers.find(d => d.id === currentInspected.currentDriverId) : null

  function handleVehicleClick(v: typeof mappedVehicles[0]) {
    setInspectVehicle(v)
    if (onSelectVehicle) {
      onSelectVehicle(v)
    }
  }

  return (
    <div className={`relative bg-surface-container-low rounded-2xl border border-outline-variant/60 overflow-hidden shadow-sm ${className}`}>
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Status Filters & Simulation Trigger */}
        <div className="flex items-center gap-1.5 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-outline-variant/50 shadow-sm pointer-events-auto">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mr-1.5 hidden sm:inline">
            Status:
          </span>
          {[
            { id: 'all', label: `All (${mappedVehicles.length})` },
            { id: 'on-trip', label: `On Trip (${mappedVehicles.filter(v => v.status === 'on-trip').length})` },
            { id: 'available', label: `Available (${mappedVehicles.filter(v => v.status === 'available').length})` },
            { id: 'delayed', label: 'Delayed' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as typeof activeFilter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {f.label}
            </button>
          ))}

          {/* Real Backend Simulation Step Control */}
          <div className="h-4 w-[1px] bg-outline-variant/60 mx-1 hidden sm:block" />
          <button
            onClick={handleStepSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent-ai/10 text-accent-ai border border-accent-ai/30 hover:bg-accent-ai/20 transition-all disabled:opacity-60"
            title="Step simulated vehicle progress along corridor via FastAPI backend"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Advancing...' : 'Step Sim (+10%)'}</span>
          </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5 bg-surface-container-lowest/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-outline-variant/50 shadow-sm pointer-events-auto">
          <button
            onClick={() => setZoomLevel(z => Math.min(z + 0.15, 1.45))}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(z => Math.max(z - 0.15, 0.85))}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className={`w-full overflow-hidden flex items-center justify-center ${compact ? 'h-[360px]' : 'h-[520px]'}`}>
        <svg
          viewBox="140 70 600 420"
          className="w-full h-full select-none cursor-grab active:cursor-grabbing transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="fleet-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#dcd9db" strokeWidth="0.5" opacity="0.6" />
            </pattern>
            {/* Gradients */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect x="0" y="0" width="860" height="540" fill="url(#fleet-grid)" />

          {/* Subdued Geographic Backdrop Geometry for India */}
          <path
            d="M 390 90 L 460 130 L 590 180 L 690 240 L 720 270 L 660 320 L 600 370 L 540 460 L 470 480 L 410 470 L 330 420 L 270 340 L 230 270 L 260 210 L 310 150 Z"
            fill="#f6f3f5"
            stroke="#e4e2e4"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* Freight Corridors (Static Base Lines) */}
          {CORRIDOR_PATHS.map((c, i) => {
            const h1 = LOGISTICS_HUBS[c.from]
            const h2 = LOGISTICS_HUBS[c.to]
            if (!h1 || !h2) return null
            return (
              <line
                key={`base-corridor-${i}`}
                x1={h1.x}
                y1={h1.y}
                x2={h2.x}
                y2={h2.y}
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeDasharray="3 3"
                opacity="0.8"
              />
            )
          })}

          {/* Active Live Routes (Animated Moving Dash) */}
          {CORRIDOR_PATHS.slice(0, 8).map((c, i) => {
            const h1 = LOGISTICS_HUBS[c.from]
            const h2 = LOGISTICS_HUBS[c.to]
            if (!h1 || !h2) return null
            return (
              <line
                key={`active-corridor-${i}`}
                x1={h1.x}
                y1={h1.y}
                x2={h2.x}
                y2={h2.y}
                stroke="#0ea5e9"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                className="animate-dash-flow"
                opacity="0.85"
              />
            )
          })}

          {/* Logistics Hub Points */}
          {Object.entries(LOGISTICS_HUBS).map(([cityName, hub]) => {
            const isHovered = activeHub === cityName
            return (
              <g
                key={cityName}
                onMouseEnter={() => setActiveHub(cityName)}
                onMouseLeave={() => setActiveHub(null)}
                className="cursor-pointer group"
              >
                {/* Hub Outer Ring */}
                <circle
                  cx={hub.x}
                  y={hub.y}
                  r={isHovered ? 8 : 5}
                  fill="#ffffff"
                  stroke="#475569"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                {/* Hub Center Dot */}
                <circle cx={hub.x} y={hub.y} r="2.5" fill="#0f172a" />

                {/* Hub Label */}
                <text
                  x={hub.x + 9}
                  y={hub.y + 3}
                  fontSize="8.5"
                  fontWeight="600"
                  fill="#475569"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none select-none transition-all"
                >
                  {hub.code}
                </text>
              </g>
            )
          })}

          {/* Vehicle Markers */}
          {filteredVehicles.map(v => {
            const isSelected = currentInspected?.id === v.id
            let markerColor = '#10b981' // emerald available
            let ringColor = 'rgba(16, 185, 129, 0.25)'

            if (v.status === 'on-trip') {
              if (v.isDelayed) {
                markerColor = '#ef4444' // red delayed
                ringColor = 'rgba(239, 68, 68, 0.3)'
              } else {
                markerColor = '#0ea5e9' // sky blue on-trip
                ringColor = 'rgba(14, 165, 233, 0.3)'
              }
            } else if (v.status === 'assigned') {
              markerColor = '#f59e0b'
              ringColor = 'rgba(245, 158, 11, 0.3)'
            } else if (v.status === 'maintenance') {
              markerColor = '#ea580c'
              ringColor = 'rgba(234, 88, 12, 0.3)'
            }

            return (
              <g
                key={v.id}
                onClick={() => handleVehicleClick(v)}
                className="cursor-pointer group"
              >
                {/* Radar pulse for on-trip or delayed vehicles */}
                {v.status === 'on-trip' && (
                  <circle
                    cx={v.mapX}
                    cy={v.mapY}
                    r="12"
                    fill={ringColor}
                    className="animate-radar"
                  />
                )}

                {/* Vehicle Marker Pin */}
                <circle
                  cx={v.mapX}
                  cy={v.mapY}
                  r={isSelected ? 7 : 4.5}
                  fill={markerColor}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="transition-all duration-150 drop-shadow-sm group-hover:scale-125"
                />

                {/* Quick Vehicle Callout on Selected */}
                {isSelected && (
                  <g className="animate-fade-in pointer-events-none">
                    <rect
                      x={v.mapX - 32}
                      y={v.mapY - 24}
                      width="64"
                      height="16"
                      rx="4"
                      fill="#0f172a"
                      opacity="0.92"
                    />
                    <text
                      x={v.mapX}
                      y={v.mapY - 13}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="700"
                      fontFamily="monospace"
                    >
                      {v.id}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected Vehicle Floating Inspection Card */}
      {currentInspected && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-[380px] bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded-xl p-4 shadow-xl animate-fade-in z-30">
          <div className="flex items-start justify-between pb-2 mb-2 border-b border-outline-variant/40">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary text-white rounded-lg">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-on-surface">{currentInspected.id}</span>
                  <span className="text-[11px] text-on-surface-variant font-medium">({currentInspected.regNumber})</span>
                </div>
                <p className="text-[10px] text-on-surface-variant capitalize">{currentInspected.make} · {currentInspected.type.replace('-', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={currentInspected.status} dot />
              <button
                onClick={() => setInspectVehicle(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Operational Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-surface-container-low p-2 rounded-lg">
              <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-info" /> Current Depot
              </span>
              <p className="font-semibold text-on-surface mt-0.5">{currentInspected.location?.city || currentInspected.depot}</p>
            </div>
            <div className="bg-surface-container-low p-2 rounded-lg">
              <span className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
                <User className="w-3 h-3 text-success" /> Assigned Driver
              </span>
              <p className="font-semibold text-on-surface mt-0.5 truncate">{inspectedDriver ? inspectedDriver.name : 'Unassigned'}</p>
            </div>
          </div>

          {/* Current Job Ribbon if active */}
          {inspectedJob ? (
            <div className="bg-info/10 border border-info/20 rounded-lg p-2.5 text-xs mb-3">
              <div className="flex items-center justify-between font-semibold text-info mb-1">
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" /> {inspectedJob.jobNumber}
                </span>
                {inspectedJob.delayMinutes ? (
                  <span className="text-danger font-bold flex items-center gap-0.5">
                    <Clock className="w-3 h-3" /> +{inspectedJob.delayMinutes}m delay
                  </span>
                ) : (
                  <span className="text-success font-semibold">On Schedule</span>
                )}
              </div>
              <p className="text-[11px] text-on-surface truncate">{inspectedJob.customer} · {inspectedJob.cargoType}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">
                {inspectedJob.origin.split(',')[0]} → {inspectedJob.destination.split(',')[0]} ({inspectedJob.estimatedDistanceKm} km)
              </p>
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-lg p-2 text-center text-[11px] text-on-surface-variant mb-3">
              Vehicle ready for dispatch. Next service: {currentInspected.nextServiceDate}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] pt-1 text-on-surface-variant border-t border-outline-variant/30">
            <span>Capacity: {(currentInspected.capacityKg / 1000).toFixed(0)} Tonnes</span>
            <span>Odometer: {currentInspected.mileageKm.toLocaleString()} km</span>
          </div>
        </div>
      )}

      {/* Bottom Telemetry Strip */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-outline-variant/50 text-[11px] text-on-surface-variant shadow-sm pointer-events-none">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Live Telemetry
        </span>
        <span>•</span>
        <span>18 Corridors Active</span>
        <span>•</span>
        <span>Avg Speed: 58 km/h</span>
      </div>
    </div>
  )
}
