import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { api } from '../lib/api'
import type { UserRole } from '../types'
import {
  Layers,
  Truck,
  Route,
  Bot,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  UserCheck,
  Activity,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const features = [
  { icon: Layers, label: 'Fleet Operations Twin', sub: 'Unified telemetry across 48 assets' },
  { icon: Route, label: 'Dynamic Corridors', sub: 'Active GPS routing & backhaul capture' },
  { icon: Bot, label: 'Autonomous Dispatch', sub: 'Constraint-optimized job pairings' },
  { icon: BarChart3, label: 'Operational Intelligence', sub: 'Real-time margins & cost per km' },
]

const roles: { role: UserRole; icon: LucideIcon; label: string; sub: string; path: string; email: string }[] = [
  { role: 'manager', icon: UserCheck, label: 'Manager Workspace', sub: 'Executive Command & Twin', path: '/manager/overview', email: 'manager@fleetops.ai' },
  { role: 'dispatcher', icon: Route, label: 'Dispatcher Workspace', sub: 'Daily Execution & Backhaul', path: '/dispatcher/overview', email: 'dispatcher@fleetops.ai' },
  { role: 'safety', icon: ShieldCheck, label: 'Safety Officer', sub: 'Risk Triage & Compliance', path: '/safety/overview', email: 'safety@fleetops.ai' },
  { role: 'analyst', icon: BarChart3, label: 'Business Analyst', sub: 'BI & Freight Economics', path: '/analyst/overview', email: 'analyst@fleetops.ai' },
]

export default function LoginPage() {
  const login = useAppStore(s => s.login)
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('manager@fleetops.ai')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRole(role: UserRole, path: string, email: string) {
    setLoading(true)
    setError(null)
    try {
      await api.auth.login(email, 'demo1234')
      login(role)
      navigate(path)
    } catch {
      // Fallback
      login(role)
      navigate(path)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!identifier || !password) {
      setError('Please provide your operator email/username and password.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await api.auth.login(identifier, password)
      const role = (res.role as UserRole) || 'manager'
      login(role)
      navigate(`/${role}/overview`)
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-grow flex flex-col md:flex-row">
        {/* LEFT: Enterprise Command Brand Panel (55%) */}
        <section className="hidden md:flex md:w-[55%] bg-surface-container-low relative overflow-hidden flex-col p-10 justify-between border-r border-outline-variant/60">
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#c6c6cd 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Logo & Platform Name */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-9 h-9 bg-primary text-white flex items-center justify-center rounded-xl shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-on-surface tracking-tight leading-none">FleetOps AI</h1>
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mt-0.5">
                Autonomous Logistics Operating OS
              </p>
            </div>
          </div>

          {/* Headline & Value Proposition */}
          <div className="relative z-10 max-w-xl my-auto py-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/60 text-xs font-semibold text-on-surface mb-4 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>Production Logistics Command Platform</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-on-background tracking-tight leading-tight mb-3">
              Precision Freight Operations & Autonomous Fleet Intelligence
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Empowering fleet managers, dispatchers, safety directors, and analysts to coordinate multi-hub operations with predictive vehicle allocation, real-time telemetry, and backhaul optimization.
            </p>

            {/* Feature Modules Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <div
                    key={i}
                    className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/50 flex items-start gap-3 shadow-2xs"
                  >
                    <div className="p-2 bg-surface-container rounded-lg text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">{f.label}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">{f.sub}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Operational Metrics Callout Strip */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-2xs">
              <div className="grid grid-cols-3 gap-3 text-center divide-x divide-outline-variant/30">
                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Live Assets</p>
                  <p className="text-xl font-bold font-mono text-on-surface mt-0.5">48 Trucks</p>
                  <p className="text-[10px] text-success font-medium">92% In-Service</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Active Corridors</p>
                  <p className="text-xl font-bold font-mono text-on-surface mt-0.5">18 Routes</p>
                  <p className="text-[10px] text-info font-medium">Real-time GPS</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Empty Return Capture</p>
                  <p className="text-xl font-bold font-mono text-on-surface mt-0.5">68.4%</p>
                  <p className="text-[10px] text-accent-ai font-medium">Autonomous Match</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 text-[11px] text-on-surface-variant border-t border-outline-variant/30 pt-3 flex items-center justify-between">
            <span>FleetOps Enterprise v2.4</span>
            <span className="flex items-center gap-1 text-success">
              <CheckCircle2 className="w-3.5 h-3.5" /> High-Availability Cluster Online
            </span>
          </div>
        </section>

        {/* RIGHT: Login & Role Selection Workspace (45%) */}
        <section className="flex-grow md:w-[45%] flex items-center justify-center p-6 sm:p-10 bg-surface">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="flex md:hidden items-center gap-2.5 mb-6 justify-center">
              <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-lg">
                <Layers className="w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold">FleetOps AI</h1>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-on-background tracking-tight">Enterprise Sign In</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Enter your credentials or choose a role below to access the operational workspaces.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-error-container/20 border border-error/30 flex items-start gap-2.5 text-xs text-error">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Authentication Error</p>
                  <p className="text-[11px] opacity-90 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form className="space-y-4 mb-6" onSubmit={handleSignIn}>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="email">
                  Operator Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    id="email"
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="e.g. manager@fleetops.ai or manager"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    Demo: demo1234
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-9 py-2 text-xs text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary accent-black"
                />
                <label htmlFor="remember" className="text-xs text-on-surface-variant">
                  Remember this workstation session
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Authenticating against Supabase...
                  </>
                ) : (
                  <>
                    Sign In to Command Center
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Access Demo Roles */}
            <div className="pt-5 border-t border-outline-variant/40">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center mb-3">
                Quick Role-Based Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r => {
                  const Icon = r.icon
                  return (
                    <button
                      key={r.role}
                      disabled={loading}
                      onClick={() => handleRole(r.role, r.path, r.email)}
                      className="flex flex-col items-start p-3 rounded-xl border border-outline-variant/50 bg-surface-container-low hover:bg-surface-container hover:border-primary/40 transition-all text-left group disabled:opacity-60"
                    >
                      <Icon className="w-4 h-4 text-primary mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-on-surface">{r.label}</span>
                      <span className="text-[10px] text-on-surface-variant mt-0.5">{r.sub}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
