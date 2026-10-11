export default function LiveMapPage() {
  const activeTrips = [
    { id: 'J001', reg: 'MH12AB1234', driver: 'Ramesh Kumar', from: 'Mumbai', to: 'Pune', status: 'On schedule' },
    { id: 'J005', reg: 'GJ01GH5678', driver: 'Mahesh Patel', from: 'Kandla', to: 'Vadodara', status: 'On schedule' },
    { id: 'J002', reg: 'MH12AB2345', driver: 'Suresh Patil', from: 'Pune', to: 'Nashik', status: '+22 min delay' },
    { id: 'J006', reg: 'RJ14IJ6789', driver: 'Arun Sharma', from: 'Jaipur', to: 'Delhi', status: 'On schedule' },
    { id: 'J009', reg: 'KA01OP9012', driver: 'Sanjay Nair', from: 'Bengaluru', to: 'Hyderabad', status: 'On schedule' },
    { id: 'J011', reg: 'TN01ST1234', driver: 'Murugan Selvam', from: 'Chennai', to: 'Vizag', status: '+58 min delay' },
  ]

  return (
    <div className="max-w-[1400px]">
      <div className="bg-accent-ai/10 border border-accent-ai/20 rounded-xl px-4 py-2.5 mb-5 text-xs text-accent-ai font-medium flex items-center gap-2">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
        Live Fleet Map — Phase 2 feature. Real GPS tracking with map visualization will be integrated here.
        For now, simulated trip locations are shown below.
      </div>

      {/* Map placeholder */}
      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/50 h-64 flex flex-col items-center justify-center mb-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #0ea5e9 0%, transparent 60%)' }} />
        <span className="material-symbols-outlined text-on-surface-variant mb-2" style={{ fontSize: 48 }}>map</span>
        <p className="text-sm font-semibold text-on-surface-variant">Interactive Map — Phase 2</p>
        <p className="text-xs text-on-surface-variant mt-1">Will show real-time vehicle locations, routes, and traffic overlays</p>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {[{ label: 'On Trip', color: 'bg-info' }, { label: 'Available', color: 'bg-success' }, { label: 'Alert', color: 'bg-danger' }].map(l => (
            <span key={l.label} className={`flex items-center gap-1 text-[10px] font-semibold text-white ${l.color} px-2 py-1 rounded-full`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />{l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Active trips list */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-outline-variant/30">
          <h3 className="text-sm font-bold text-on-surface">Active Trips — Simulated Locations</h3>
        </div>
        <div className="divide-y divide-outline-variant/20">
          {activeTrips.map(t => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${t.status.includes('delay') ? 'bg-warning' : 'bg-success'} animate-pulse`} />
              <span className="font-mono text-xs font-bold text-primary w-28 shrink-0">{t.id}</span>
              <span className="text-xs text-on-surface">{t.reg}</span>
              <span className="text-xs text-on-surface-variant">{t.driver}</span>
              <span className="text-xs text-on-surface-variant ml-auto">{t.from} → {t.to}</span>
              <span className={`text-xs font-semibold shrink-0 ${t.status.includes('delay') ? 'text-warning' : 'text-success'}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
