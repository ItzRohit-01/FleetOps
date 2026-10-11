import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  'overview':        { title: 'Overview', subtitle: 'Real-time fleet status and operational summary' },
  'digital-twin':    { title: 'Digital Twin', subtitle: 'Live operational state of your entire fleet' },
  'ai-decisions':    { title: 'AI Decisions', subtitle: 'Recommendations, approvals, and override history' },
  'operations':      { title: 'Operations', subtitle: 'Active trips, assignments, and fleet activity' },
  'safety':          { title: 'Safety Overview', subtitle: 'Fleet safety status from the manager perspective' },
  'intelligence':    { title: 'Business Intelligence', subtitle: 'Fleet efficiency, costs, and performance metrics' },
  'settings':        { title: 'Settings', subtitle: 'Platform configuration and preferences' },
  'ai-dispatcher':   { title: 'AI Dispatcher', subtitle: 'Review and act on dispatch recommendations' },
  'map':             { title: 'Live Fleet Map', subtitle: 'Simulated vehicle locations and active routes' },
  'jobs':            { title: 'Jobs & Trips', subtitle: 'All jobs, assignments, and active trips' },
  'fleet':           { title: 'Fleet Availability', subtitle: 'Available vehicles and driver readiness' },
  'return-load':     { title: 'Return Load Matching', subtitle: 'Opportunities to reduce empty return trips' },
  'history':         { title: 'Dispatch History', subtitle: 'Past assignments and decision log' },
  'incidents':       { title: 'Incidents', subtitle: 'Open incidents, investigation status, and history' },
  'drivers':         { title: 'Driver Safety', subtitle: 'Risk scores, violations, and hours monitoring' },
  'compliance':      { title: 'Vehicle Compliance', subtitle: 'Permits, registrations, and inspection status' },
  'risk':            { title: 'Risk Monitoring', subtitle: 'Active risk flags and driver behaviour alerts' },
  'trends':          { title: 'Risk Trends', subtitle: 'Incident and risk patterns over time' },
  'reports':         { title: 'Reports', subtitle: 'Scheduled and on-demand operational reports' },
  'fleet-performance': { title: 'Fleet Performance', subtitle: 'Utilization, efficiency, and availability trends' },
  'costs':           { title: 'Cost & Profitability', subtitle: 'Operating costs, fuel, and per-trip economics' },
  'delivery':        { title: 'Delivery Analysis', subtitle: 'On-time performance and delay analysis' },
  'empty-return':    { title: 'Empty Return Analysis', subtitle: 'Return trip efficiency and matching rates' },
  'ai-effectiveness':{ title: 'AI Effectiveness', subtitle: 'Recommendation acceptance and outcome analysis' },
}

const roleColors: Record<UserRole, string> = {
  manager:    'bg-primary-fixed text-on-primary-fixed',
  dispatcher: 'bg-secondary-container text-on-secondary-container',
  safety:     'bg-error-container text-on-error-container',
  analyst:    'bg-tertiary-fixed text-on-tertiary-fixed',
}

export default function TopBar() {
  const role = useAppStore(s => s.currentRole)!
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)

  const segments = location.pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1] || 'overview'
  const pageInfo = pageTitles[lastSegment] ?? { title: 'FleetOps AI', subtitle: '' }

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-6 h-14">
      {/* Left: Page title */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-on-surface leading-tight truncate">{pageInfo.title}</h2>
          <p className="text-[11px] text-on-surface-variant leading-tight hidden sm:block truncate">{pageInfo.subtitle}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Date */}
        <span className="text-[11px] text-on-surface-variant hidden lg:block px-2.5 py-1 bg-surface-container rounded-lg border border-outline-variant/50">
          {dateStr}
        </span>

        {/* Search toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          title="Search"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
        </button>

        {/* Notifications */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications</span>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-error" />
        </button>

        {/* Alerts */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg text-danger hover:bg-error-container/50 transition-colors"
          title="Active alerts"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
        </button>

        {/* Role badge */}
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${roleColors[role]}`}>
          <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>circle</span>
          {role}
        </span>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute top-14 left-0 right-0 px-6 py-3 bg-surface-container-lowest border-b border-outline-variant shadow-lg animate-fade-in">
          <div className="relative max-w-2xl mx-auto">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
            <input
              autoFocus
              type="text"
              placeholder="Search vehicles, drivers, jobs, incidents..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
            />
            <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
