import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { ROLE_CONFIGS } from '../../types'
import type { UserRole } from '../../types'
import {
  LayoutDashboard,
  Boxes,
  Bot,
  Truck,
  ShieldCheck,
  BarChart3,
  Settings,
  Map,
  Route,
  RotateCcw,
  History,
  AlertTriangle,
  Users,
  FileCheck2,
  Activity,
  TrendingUp,
  FileText,
  Gauge,
  CircleDollarSign,
  PanelLeftClose,
  PanelLeft,
  ChevronUp,
  ChevronDown,
  LogOut,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  icon: LucideIcon
  label: string
  path: string
  badge?: string
}

const navMap: Record<UserRole, NavItem[]> = {
  manager: [
    { icon: LayoutDashboard, label: 'Overview', path: 'overview' },
    { icon: Boxes, label: 'Digital Twin', path: 'digital-twin' },
    { icon: Bot, label: 'AI Decisions', path: 'ai-decisions', badge: 'AI' },
    { icon: Truck, label: 'Operations', path: 'operations' },
    { icon: ShieldCheck, label: 'Safety', path: 'safety' },
    { icon: BarChart3, label: 'Business Intelligence', path: 'intelligence' },
    { icon: Settings, label: 'Settings', path: 'settings' },
  ],
  dispatcher: [
    { icon: LayoutDashboard, label: 'Dispatch Overview', path: 'overview' },
    { icon: Bot, label: 'AI Dispatcher', path: 'ai-dispatcher', badge: 'AI' },
    { icon: Map, label: 'Live Fleet Map', path: 'map' },
    { icon: Route, label: 'Jobs & Trips', path: 'jobs' },
    { icon: Truck, label: 'Fleet Availability', path: 'fleet' },
    { icon: RotateCcw, label: 'Return Load Matching', path: 'return-load', badge: 'Opt' },
    { icon: History, label: 'Dispatch History', path: 'history' },
  ],
  safety: [
    { icon: ShieldCheck, label: 'Safety Overview', path: 'overview' },
    { icon: AlertTriangle, label: 'Incidents', path: 'incidents', badge: '8' },
    { icon: Users, label: 'Driver Safety', path: 'drivers' },
    { icon: FileCheck2, label: 'Vehicle Compliance', path: 'compliance' },
    { icon: Activity, label: 'Risk Monitoring', path: 'risk' },
    { icon: TrendingUp, label: 'Risk Trends', path: 'trends' },
    { icon: FileText, label: 'Reports', path: 'reports' },
  ],
  analyst: [
    { icon: BarChart3, label: 'Analytics Overview', path: 'overview' },
    { icon: Gauge, label: 'Fleet Performance', path: 'fleet-performance' },
    { icon: CircleDollarSign, label: 'Cost & Profitability', path: 'costs' },
    { icon: Truck, label: 'Delivery Analysis', path: 'delivery' },
    { icon: RotateCcw, label: 'Empty Return Analysis', path: 'empty-return', badge: '22%' },
    { icon: Bot, label: 'AI Effectiveness', path: 'ai-effectiveness' },
    { icon: FileText, label: 'Reports', path: 'reports' },
  ],
}

const roleBadgeColors: Record<UserRole, string> = {
  manager: 'bg-primary-fixed/60 text-on-primary-fixed border-primary/20',
  dispatcher: 'bg-secondary-container text-on-secondary-container border-secondary/20',
  safety: 'bg-error-container text-on-error-container border-error/20',
  analyst: 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/20',
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
      className="fixed left-0 top-0 h-screen flex flex-col bg-surface-container-lowest border-r border-outline-variant/60 z-50 transition-all duration-300"
      style={{ width: collapsed ? 64 : 260 }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3.5 py-4 border-b border-outline-variant/40">
        <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-lg shrink-0 shadow-sm">
          <Layers className="w-4 h-4" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden min-w-0">
            <p className="text-sm font-bold text-on-surface leading-tight truncate">FleetOps AI</p>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider truncate">Logistics Operating OS</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-1.5 rounded-lg transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Indicator */}
      {!collapsed && (
        <div className="px-3.5 pt-3 pb-1">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleBadgeColors[role]}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {role} Workspace
            </span>
            <span className="text-[10px] text-on-surface-variant font-mono">v2.4</span>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const fullPath = `${basePath}/${item.path}`
          const isActive = location.pathname === fullPath
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={fullPath}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'text-on-surface font-semibold bg-surface-container-high border-l-2 border-primary shadow-2xs'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant group-hover:text-on-surface'
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                        item.badge === 'AI'
                          ? 'bg-accent-ai/10 text-accent-ai border-accent-ai/20'
                          : 'bg-surface-container text-on-surface-variant border-outline-variant/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Profile and Session */}
      <div className="p-2.5 border-t border-outline-variant/40 relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-container transition-colors"
          title={collapsed ? config.displayName : undefined}
        >
          <div className="w-7 h-7 rounded-full bg-primary-fixed border border-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-on-primary-fixed">
            {config.displayName.split(' ').map(n => n[0]).join('')}
          </div>
          {!collapsed && (
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-xs font-semibold text-on-surface truncate leading-tight">{config.displayName}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{config.title}</p>
            </div>
          )}
          {!collapsed && (
            <span className="text-on-surface-variant shrink-0">
              {showProfileMenu ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          )}
        </button>

        {showProfileMenu && !collapsed && (
          <div className="absolute bottom-full left-2.5 right-2.5 mb-1.5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden animate-fade-in z-20">
            <div className="px-3 py-2 border-b border-outline-variant/30">
              <p className="text-xs font-semibold text-on-surface">{config.displayName}</p>
              <p className="text-[10px] text-on-surface-variant truncate">{config.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Role / Exit
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
