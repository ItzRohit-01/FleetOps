// Return Load Matching
const matches = [
  { fromJob: 'TO-2610-020', fromDest: 'Goa', toLoad: 'Goa Cashew Exports Ltd', toOrigin: 'Panaji, Goa', toDest: 'Mumbai Port Trust', distance: 584, capacityMatch: '91%', savings: '₹38,700', score: 87 },
  { fromJob: 'TO-2610-009', fromDest: 'Hyderabad', toLoad: 'Hyderabad Pharma Hub', toOrigin: 'Medchal, Hyderabad', toDest: 'Bengaluru Bio-Corridor', distance: 568, capacityMatch: '78%', savings: '₹42,100', score: 82 },
  { fromJob: 'TO-2610-006', fromDest: 'Delhi', toLoad: 'Amul Dairy Products', toOrigin: 'Meerut Coop, UP', toDest: 'Delhi Distribution', distance: 72, capacityMatch: '95%', savings: '₹6,200', score: 91 },
  { fromJob: 'TO-2610-011', fromDest: 'Vizag', toLoad: 'RINL Vizag Steel', toOrigin: 'Vizag Steel Plant', toDest: 'Chennai Port', distance: 766, capacityMatch: '84%', savings: '₹61,300', score: 79 },
  { fromJob: 'TO-2610-014', fromDest: 'Delhi', toLoad: 'IKEA India Returns', toOrigin: 'IKEA Delivery Hub, Delhi', toDest: 'Chandigarh Depot', distance: 248, capacityMatch: '68%', savings: '₹19,800', score: 73 },
]

export default function ReturnLoadPage() {
  return (
    <div className="max-w-[1400px]">
      <div className="bg-accent-ai/10 border border-accent-ai/20 rounded-xl px-4 py-2.5 mb-5 text-xs text-accent-ai font-medium flex items-center gap-2">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>smart_toy</span>
        AI Return Load Matching — simulated opportunities. Phase 2 will connect to real freight marketplace APIs.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Match Opportunities', value: matches.length, icon: 'sync_alt', color: 'text-info' },
          { label: 'Avg Capacity Match', value: '84%', icon: 'compress', color: 'text-success' },
          { label: 'Potential Savings', value: '₹1.68L', icon: 'savings', color: 'text-warning' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-4 flex items-center gap-3">
            <div className="p-2 bg-surface-container rounded-lg">
              <span className={`material-symbols-outlined ${s.color}`} style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">{s.label}</p>
              <p className="text-xl font-bold text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {matches.map((m, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-4 flex items-start gap-4">
            <div className="p-2.5 bg-accent-ai/10 rounded-xl shrink-0">
              <span className="material-symbols-outlined text-accent-ai" style={{ fontSize: 22 }}>sync_alt</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-primary">{m.fromJob}</span>
                <span className="text-xs text-on-surface-variant">→ {m.fromDest} (outbound)</span>
                <span className="text-[10px] font-bold bg-accent-ai/10 text-accent-ai px-2 py-0.5 rounded-full">Score {m.score}</span>
              </div>
              <p className="text-sm font-semibold text-on-surface">{m.toLoad}</p>
              <p className="text-xs text-on-surface-variant">{m.toOrigin} → {m.toDest} · {m.distance} km</p>
            </div>
            <div className="text-right shrink-0 space-y-1.5">
              <p className="text-sm font-bold text-success">{m.savings} saved</p>
              <p className="text-xs text-on-surface-variant">Fill: {m.capacityMatch}</p>
              <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Accept Match
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
