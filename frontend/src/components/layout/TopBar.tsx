import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'
import { Search, Bell, AlertTriangle, Calendar, X, ChevronRight, Activity } from 'lucide-react'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  'overview':          { title: 'Overview', subtitle: 'Real-time fleet operations and exceptions' },
  'digital-twin':      { title: 'Digital Twin', subtitle: 'Operational state of all 48 vehicles' },
  'ai-decisions':      { title: 'AI Decisions', subtitle: 'Dispatch recommendations and approval history' },
  'operations':        { title: 'Operations', subtitle: 'Active trips, assignments, and fleet dispatch' },
  'safety':            { title: 'Safety Overview', subtitle: 'Fleet safety risk profile & open incidents' },
  'intelligence':      { title: 'Business Intelligence', subtitle: 'Fleet efficiency, cost per km & economics' },
  'settings':          { title: 'Settings', subtitle: 'Configuration & threshold preferences' },
  'ai-dispatcher':     { title: 'AI Dispatcher', subtitle: 'Automated job-to-vehicle pairing review' },
  'map':               { title: 'Live Fleet Map', subtitle: 'Active transit corridors & vehicle telemetry' },
  'jobs':              { title: 'Jobs & Trips', subtitle: 'Operational transport manifest & progress' },
  'fleet':             { title: 'Fleet Availability', subtitle: 'Depot vehicle readiness & capacity status' },
  'return-load':       { title: 'Return Load Matching', subtitle: 'Autonomous backhaul freight pairing' },
  'history':           { title: 'Dispatch History', subtitle: 'Audit log of dispatch decisions' },
  'incidents':         { title: 'Incidents', subtitle: 'Triage board and safety investigations' },
  'drivers':           { title: 'Driver Safety', subtitle: 'Risk scores, HOS compliance & violations' },
  'compliance':        { title: 'Vehicle Compliance', subtitle: 'Permits, fitness certificates & insurance' },
  'risk':              { title: 'Risk Monitoring', subtitle: 'High-risk driver alerts & telemetry events' },
  'trends':            { title: 'Risk Trends', subtitle: 'Historical incident trajectory over time' },
  'reports':           { title: 'Reports', subtitle: 'Scheduled compliance & operational audits' },
  'fleet-performance': { title: 'Fleet Performance', subtitle: 'Utilization rates & asset efficiency' },
  'costs':             { title: 'Cost & Profitability', subtitle: 'Revenue, fuel burn & margin analysis' },
  'delivery':          { title: 'Delivery Analysis', subtitle: 'On-time delivery rates & delay root causes' },
  'empty-return':      { title: 'Empty Return Analysis', subtitle: 'Deadhead mileage & reverse logistics savings' },
  'ai-effectiveness':  { title: 'AI Effectiveness', subtitle: 'Autonomous acceptance rate & accuracy' },
}

const roleColors: Record<UserRole, string> = {
  manager:    'bg-primary-fixed/80 text-on-primary-fixed border-primary/20',
  dispatcher: 'bg-secondary-container text-on-secondary-container border-secondary/20',
  safety:     'bg-error-container text-on-error-container border-error/20',
  analyst:    'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/20',
}

export default function TopBar() {
  const role = useAppStore(s => s.currentRole)!
  const jobs = useAppStore(s => s.jobs)
  const incidents = useAppStore(s => s.incidents)
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const activeTripsCount = jobs.filter(j => j.status === 'in-transit').length
  const openIncidentsCount = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length

  const segments = location.pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1] || 'overview'
  const pageInfo = pageTitles[lastSegment] ?? { title: 'FleetOps AI', subtitle: '' }

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/60 flex items-center justify-between px-5 h-14">
      {/* Left: Breadcrumbs & Page title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
            <span className="capitalize">{role}</span>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-on-surface truncate">{pageInfo.title}</span>
          </div>
          <h2 className="text-sm font-bold text-on-surface leading-tight truncate">{pageInfo.title}</h2>
        </div>
      </div>

      {/* Right: Operational Health Badges & Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Live Trip Tracker Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-lg border border-outline-variant/50 text-xs">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-semibold text-on-surface">{activeTripsCount} Trips</span>
          <span className="text-[10px] text-on-surface-variant font-medium">on Road</span>
        </div>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-lg border border-outline-variant/50 text-xs text-on-surface-variant">
          <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
          <span>{dateStr}</span>
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Search assets, jobs, drivers (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors relative"
          title="Operational Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* Critical Alerts Trigger */}
        <button
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-danger bg-danger/10 hover:bg-danger/15 transition-colors border border-danger/20"
          title="Active Open Exceptions"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{openIncidentsCount}</span>
        </button>

        {/* Active Role Badge */}
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleColors[role]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {role}
        </span>
      </div>

      {/* Global Search Overlay */}
      {searchOpen && (
        <div className="absolute top-14 left-0 right-0 px-6 py-3 bg-surface-container-lowest border-b border-outline-variant shadow-xl animate-fade-in z-50">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              autoFocus
              type="text"
              placeholder="Search by registration (e.g. MH12AB1234), job # (TO-2610-001), driver, or cargo..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-10 py-2.5 text-xs text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
              onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
            />
            <button
              onClick={() => { setSearchOpen(false); setQuery('') }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
