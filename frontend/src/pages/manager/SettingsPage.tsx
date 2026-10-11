export default function SettingsPage() {
  const settings = [
    { group: 'General', items: ['Organization Name', 'Default Depot', 'Timezone', 'Currency'] },
    { group: 'Notifications', items: ['Email Alerts', 'SMS Alerts', 'Incident Notifications', 'Daily Summary Report'] },
    { group: 'AI & Dispatch', items: ['Optimization Algorithm', 'Recommendation Threshold', 'Auto-Approval Rules', 'Override Logging'] },
    { group: 'Compliance', items: ['Document Expiry Alerts (days)', 'HOS Limit (hours/week)', 'Speeding Threshold (km/h)', 'Overload Tolerance (%)'] },
  ]

  return (
    <div className="max-w-[1400px]">
      <div className="bg-accent-ai/10 border border-accent-ai/20 rounded-xl px-4 py-2.5 mb-5 text-xs text-accent-ai font-medium flex items-center gap-2">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
        Settings are read-only in the demo environment. Configuration will be editable in Phase 2.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.map(g => (
          <div key={g.group} className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-surface-container-low">
              <h3 className="text-sm font-bold text-on-surface">{g.group}</h3>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {g.items.map(item => (
                <div key={item} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-on-surface">{item}</span>
                  <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Demo mode</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
