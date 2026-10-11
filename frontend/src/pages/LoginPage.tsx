import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import type { UserRole } from '../types'

const features = [
  { icon: 'hub', label: 'Fleet Operations', sub: 'Unified visibility', color: 'bg-primary-fixed/50', iconColor: 'text-on-primary-fixed' },
  { icon: 'schedule', label: 'Real-Time Dispatch', sub: 'Dynamic routing', color: 'bg-secondary-container/50', iconColor: 'text-on-secondary-container' },
  { icon: 'psychology', label: 'Predictive AI', sub: 'Maintenance insights', color: 'bg-tertiary-fixed/50', iconColor: 'text-on-tertiary-container' },
  { icon: 'query_stats', label: 'Financial Intel', sub: 'ROI & cost tracking', color: 'bg-surface-variant', iconColor: 'text-on-surface-variant' },
]

const roles: { role: UserRole; icon: string; label: string; sub: string; path: string }[] = [
  { role: 'manager', icon: 'admin_panel_settings', label: 'Manager', sub: 'Full Oversight', path: '/manager/overview' },
  { role: 'dispatcher', icon: 'route', label: 'Dispatcher', sub: 'Trip Planning', path: '/dispatcher/overview' },
  { role: 'safety', icon: 'verified_user', label: 'Safety', sub: 'Compliance', path: '/safety/overview' },
  { role: 'analyst', icon: 'account_balance', label: 'Analyst', sub: 'ROI & Revenue', path: '/analyst/overview' },
]

export default function LoginPage() {
  const login = useAppStore(s => s.login)
  const navigate = useNavigate()

  function handleRole(role: UserRole, path: string) {
    login(role)
    navigate(path)
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    login('manager')
    navigate('/manager/overview')
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-grow flex flex-col md:flex-row">
        {/* ── LEFT: Brand Panel (60%) ────────────────────────────── */}
        <section className="hidden md:flex md:w-[60%] bg-surface-container-low relative overflow-hidden flex-col p-8">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-secondary-container/30 rounded-full blur-[120px] pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-lg">
              <span className="material-symbols-outlined text-white fill" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            </div>
            <h1 className="text-xl font-bold text-on-surface tracking-tight">TransitOps</h1>
          </div>

          {/* Headline */}
          <div className="relative z-10 max-w-2xl mt-6">
            <h2 className="text-4xl font-bold text-on-background mb-4 leading-[1.1] tracking-tight">
              Fleet Operations<br />
              <span className="text-primary-container">Command Center</span>
            </h2>
            <p className="text-base text-on-surface-variant max-w-xl mb-8 leading-relaxed">
              Manage vehicles, drivers, dispatch, maintenance, safety, and financial operations from a single intelligent platform.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map(f => (
                <div key={f.label} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className={`p-1.5 ${f.color} rounded-lg`}>
                    <span className={`material-symbols-outlined ${f.iconColor}`} style={{ fontSize: 20 }}>{f.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface tracking-wide">{f.label}</p>
                    <p className="text-[11px] text-secondary mt-0.5">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Data visual */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-sm border border-outline-variant/20 bg-gradient-to-br from-primary-container/10 to-secondary-container/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full px-6">
                  <div className="bg-surface/90 backdrop-blur-sm p-3 rounded-xl border border-outline-variant/30 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Live</span>
                    </div>
                    <p className="text-2xl font-bold text-on-surface">18</p>
                    <p className="text-[10px] text-secondary mt-0.5">Active Trips</p>
                  </div>
                  <div className="bg-primary text-white p-3 rounded-xl text-center">
                    <p className="text-[10px] font-semibold opacity-70 uppercase tracking-wider mb-1">Fleet Health</p>
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-[10px] opacity-70 mt-0.5">48 Vehicles</p>
                  </div>
                  <div className="bg-surface/90 backdrop-blur-sm p-3 rounded-xl border border-outline-variant/30 text-center">
                    <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Drivers</p>
                    <p className="text-2xl font-bold text-on-surface">35</p>
                    <p className="text-[10px] text-secondary mt-0.5">26 On Duty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="mt-auto flex gap-8 relative z-10 pt-6 border-t border-outline-variant/20">
            {[
              { label: 'Total Fleet', value: '48', unit: 'Vehicles' },
              { label: 'Active Drivers', value: '26', unit: 'On Duty' },
              { label: 'Trips Today', value: '42', unit: 'Jobs' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest">{s.label}</p>
                <p className="text-lg font-bold text-on-background mt-0.5">
                  {s.value} <span className="text-xs font-normal text-secondary">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RIGHT: Login Form (40%) ───────────────────────────── */}
        <section className="flex-grow md:w-[40%] flex items-center justify-center p-6 md:p-10 bg-surface relative">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="flex md:hidden items-center gap-3 mb-8 justify-center">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              </div>
              <h1 className="text-xl font-bold">TransitOps</h1>
            </div>

            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-on-background tracking-tight">Welcome Back</h2>
              <p className="text-sm text-secondary mt-1.5">Sign in to access TransitOps Fleet Command Center</p>
            </div>

            <form className="space-y-5 mb-8" onSubmit={handleSignIn}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@transitops.global"
                  defaultValue="manager@transitops.global"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-on-surface placeholder:text-outline"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <a className="text-xs text-secondary hover:text-primary transition-colors" href="#">Forgot Password?</a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="demo1234"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" defaultChecked className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-black" />
                <label htmlFor="remember" className="text-xs text-on-surface-variant">Remember this device</label>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
              >
                Sign In
                <span className="material-symbols-outlined sz-sm">arrow_forward</span>
              </button>
            </form>

            {/* Demo role accounts */}
            <div className="pt-6 border-t border-outline-variant/30">
              <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest text-center mb-4">
                Quick Access — Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => handleRole(r.role, r.path)}
                    className="flex flex-col items-center p-3 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-primary-fixed/20 hover:border-primary/20 transition-all group"
                  >
                    <span className="material-symbols-outlined text-primary mb-1 group-hover:scale-110 transition-transform" style={{ fontSize: 22 }}>{r.icon}</span>
                    <span className="text-xs font-semibold text-on-surface">{r.label}</span>
                    <span className="text-[10px] text-secondary mt-0.5">{r.sub}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-outline text-center mt-4 leading-relaxed">
                Demo environment — no real authentication. Click any role card to enter that workspace.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-4 px-8 bg-surface-container-lowest border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-[11px] text-secondary">TransitOps © 2026 | Fleet Operations Intelligence Platform</p>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Service', 'Support'].map(l => (
            <a key={l} className="text-[11px] text-secondary hover:text-primary transition-colors" href="#">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
