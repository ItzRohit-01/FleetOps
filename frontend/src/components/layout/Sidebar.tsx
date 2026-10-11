import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { ROLE_CONFIGS } from '../../types'
import type { UserRole } from '../../types'

interface NavItem {
  icon: string
  label: string
  path: string
}

const navMap: Record<UserRole, NavItem[]> = {
  manager: [
    { icon: 'dashboard', label: 'Overview', path: 'overview' },
    { icon: 'hub', label: 'Digital Twin', path: 'digital-twin' },
    { icon: 'psychology', label: 'AI Decisions', path: 'ai-decisions' },
    { icon: 'local_shipping', label: 'Operations', path: 'operations' },
    { icon: 'security', label: 'Safety', path: 'safety' },
    { icon: 'bar_chart', label: 'Business Intelligence', path: 'intelligence' },
    { icon: 'settings', label: 'Settings', path: 'settings' },
  ],
  dispatcher: [
    { icon: 'dashboard', label: 'Dispatch Overview', path: 'overview' },
    { icon: 'smart_toy', label: 'AI Dispatcher', path: 'ai-dispatcher' },
    { icon: 'map', label: 'Live Fleet Map', path: 'map' },
    { icon: 'route', label: 'Jobs & Trips', path: 'jobs' },
    { icon: 'directions_car', label: 'Fleet Availability', path: 'fleet' },
    { icon: 'sync_alt', label: 'Return Load Matching', path: 'return-load' },
    { icon: 'history', label: 'Dispatch History', path: 'history' },
  ],
  safety: [
    { icon: 'shield', label: 'Safety Overview', path: 'overview' },
    { icon: 'warning', label: 'Incidents', path: 'incidents' },
    { icon: 'person_check', label: 'Driver Safety', path: 'drivers' },
    { icon: 'assignment_turned_in', label: 'Vehicle Compliance', path: 'compliance' },
    { icon: 'radar', label: 'Risk Monitoring', path: 'risk' },
    { icon: 'trending_up', label: 'Risk Trends', path: 'trends' },
    { icon: 'description', label: 'Reports', path: 'reports' },
  ],
  analyst: [
    { icon: 'bar_chart', label: 'Analytics Overview', path: 'overview' },
    { icon: 'speed', label: 'Fleet Performance', path: 'fleet-performance' },
    { icon: 'payments', label: 'Cost & Profitability', path: 'costs' },
    { icon: 'local_shipping', label: 'Delivery Analysis', path: 'delivery' },
    { icon: 'sync_alt', label: 'Empty Return Analysis', path: 'empty-return' },
    { icon: 'smart_toy', label: 'AI Effectiveness', path: 'ai-effectiveness' },
    { icon: 'description', label: 'Reports', path: 'reports' },
  ],
}

const roleBadgeColors: Record<UserRole, string> = {
  manager: 'bg-primary-fixed/50 text-on-primary-fixed',
  dispatcher: 'bg-secondary-container text-on-secondary-container',
  safety: 'bg-error-container text-on-error-container',
  analyst: 'bg-tertiary-fixed text-on-tertiary-fixed',
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const role = useAppStore(s => s.currentRole)!
  const logout = useAppStore(s => s.logout)
  const navigate = useNavigate()
  const location = useLocation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const config = ROLE_CONFIGS[role]
  const navItems = navMap[role]

  function handleLogout() {
    logout()
    navigate('/')
  }

  const basePath = `/${role}`

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col bg-surface-container-lowest border-r border-outline-variant z-50 transition-all duration-300"
      style={{ width: collapsed ? 64 : 260 }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-outline-variant/50">
        <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-lg shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-white sz-sm" style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}>dataset</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-on-surface leading-tight whitespace-nowrap">TransitOps</p>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Fleet Command Center</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low p-1 rounded-lg transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined sz-sm" style={{ fontSize: 18 }}>
            {collapsed ? 'menu' : 'menu_open'}
          </span>
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${roleBadgeColors[role]}`}>
            {role}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const fullPath = `${basePath}/${item.path}`
          const isActive = location.pathname === fullPath
          return (
            <NavLink
              key={item.path}
              to={fullPath}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? 'text-primary font-semibold bg-surface-container-high border-r-2 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined shrink-0 transition-none"
                style={{
                  fontSize: 20,
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  color: item.label === 'AI Decisions' || item.label === 'AI Dispatcher' || item.label === 'AI Effectiveness'
                    ? (isActive ? '#8b5cf6' : '#8b5cf6')
                    : undefined,
                }}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User profile */}
      <div className="p-3 border-t border-outline-variant/50 relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors"
          title={collapsed ? config.displayName : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 text-xs font-bold text-on-primary-fixed">
            {config.displayName.split(' ').map(n => n[0]).join('')}
          </div>
          {!collapsed && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-xs font-semibold text-on-surface truncate">{config.displayName}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{config.title}</p>
            </div>
          )}
          {!collapsed && (
            <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: 16 }}>
              {showProfileMenu ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </span>
          )}
        </button>

        {showProfileMenu && !collapsed && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden animate-fade-in z-10">
            <div className="px-3 py-2.5 border-b border-outline-variant/30">
              <p className="text-xs font-semibold text-on-surface">{config.displayName}</p>
              <p className="text-[10px] text-on-surface-variant">{config.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error-container/30 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
              Exit Demo
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
