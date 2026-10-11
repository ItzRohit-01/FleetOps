import { useState } from 'react'
import { drivers as allDrivers, incidents } from '../../data/mockData'
import DataTable, { type Column } from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import KpiCard, { KpiGrid } from '../../components/ui/KpiCard'
import { SectionCard } from '../../components/ui/ChartContainer'
import type { Driver } from '../../types'

export default function DriverSafetyPage() {
  const [filterTab, setFilterTab] = useState<'all' | 'high-risk' | 'fatigue-watch' | 'violations'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  const filteredDrivers = allDrivers.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.depot.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (filterTab === 'high-risk') return d.riskScore === 'high' || d.riskScore === 'medium'
    if (filterTab === 'fatigue-watch') return d.hoursThisWeek >= 38
    if (filterTab === 'violations') return d.violations > 0
    return true
  })

  const highRiskCount = allDrivers.filter(d => d.riskScore === 'high').length
  const mediumRiskCount = allDrivers.filter(d => d.riskScore === 'medium').length
  const fatigueAlerts = allDrivers.filter(d => d.hoursThisWeek >= 40).length
  const totalViolations = allDrivers.reduce((acc, d) => acc + d.violations, 0)

  const columns: Column<Driver>[] = [
    {
      key: 'name',
      header: 'Driver Name & Depot',
      render: (d) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-on-surface">
            {d.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-xs text-on-surface">{d.name}</p>
            <p className="text-[11px] text-on-surface-variant">{d.depot}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'license',
      header: 'License & Validity',
      render: (d) => {
        const isExpiringSoon = new Date(d.licenseExpiry) < new Date('2026-12-31')
        return (
          <div className="text-xs">
            <p className="font-mono text-[11px] text-on-surface">{d.licenseNumber}</p>
            <p className={`text-[10px] ${isExpiringSoon ? 'text-amber-600 font-semibold' : 'text-on-surface-variant'}`}>
              Exp: {d.licenseExpiry} {isExpiringSoon && '⚠️'}
            </p>
          </div>
        )
      },
    },
    {
      key: 'riskScore',
      header: 'Risk Score',
      render: (d) => <StatusBadge status={d.riskScore} />,
    },
    {
      key: 'hoursThisWeek',
      header: 'HOS Hours (Week)',
      render: (d) => (
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-semibold ${d.hoursThisWeek >= 44 ? 'text-danger' : d.hoursThisWeek >= 38 ? 'text-warning' : 'text-on-surface'}`}>
              {d.hoursThisWeek}h / 48h
            </span>
            <span className="text-[10px] text-on-surface-variant">
              {Math.round((d.hoursThisWeek / 48) * 100)}%
            </span>
          </div>
          <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                d.hoursThisWeek >= 44 ? 'bg-danger' : d.hoursThisWeek >= 38 ? 'bg-warning' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(100, (d.hoursThisWeek / 48) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'violations',
      header: 'Safety Violations',
      render: (d) => (
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
          d.violations > 2 ? 'bg-danger/10 text-danger' : d.violations > 0 ? 'bg-warning/10 text-warning' : 'bg-surface-container-low text-on-surface-variant'
        }`}>
          {d.violations} {d.violations === 1 ? 'strike' : 'strikes'}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'Safety Rating',
      render: (d) => (
        <div className="text-xs">
          <span className="font-bold text-amber-500">★ {d.rating.toFixed(1)}</span>
          <p className="text-[10px] text-on-surface-variant">5.0 benchmark</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Scorecard',
      render: (d) => (
        <button
          onClick={() => setSelectedDriver(d)}
          className="px-2.5 py-1 text-xs font-semibold rounded bg-surface-container-low hover:bg-surface-container-high text-primary border border-outline-variant/60 transition-colors"
        >
          View Profile
        </button>
      ),
      align: 'right',
    },
  ]

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Driver Safety & HOS Governance</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Driver performance telematics, Hours of Service (HOS) fatigue monitoring, and license compliance audits
        </p>
      </div>

      <KpiGrid cols={4}>
        <KpiCard
          label="Elevated Risk Drivers"
          value={highRiskCount + mediumRiskCount}
          icon="shield_with_heart"
          iconColor="#ef4444"
          subtext={`${highRiskCount} High risk · ${mediumRiskCount} Medium risk`}
        />
        <KpiCard
          label="Fatigue Warnings (HOS > 40h)"
          value={fatigueAlerts}
          icon="alarm"
          iconColor="#f59e0b"
          subtext="Approaching 48-hour statutory weekly cap"
        />
        <KpiCard
          label="Cumulative Safety Strikes"
          value={totalViolations}
          icon="gavel"
          iconColor="#dc2626"
          subtext="Speeding, signal jumping, and overloading"
        />
        <KpiCard
          label="Fleet Avg Driver Rating"
          value="4.6 ★"
          icon="star"
          iconColor="#10b981"
          subtext="Based on telematics & delivery feedback"
        />
      </KpiGrid>

      <SectionCard
        title="Driver Safety Directory"
        subtitle="35 active professional drivers monitored"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-surface-container-low rounded-lg p-0.5 text-xs">
              {(['all', 'high-risk', 'fatigue-watch', 'violations'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                    filterTab === tab
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                placeholder="Search driver / depot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-surface-container-low border border-outline-variant/60 rounded-lg text-on-surface focus:outline-none focus:border-primary w-48"
              />
            </div>
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={filteredDrivers}
          keyExtractor={(d) => d.id}
          onRowClick={(d) => setSelectedDriver(d)}
          emptyMessage="No drivers match the selected safety filter"
        />
      </SectionCard>

      {/* Driver Scorecard Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-fade-in">
            <div className="flex items-start justify-between border-b border-outline-variant/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                  {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">{selectedDriver.name}</h2>
                  <p className="text-xs text-on-surface-variant">{selectedDriver.depot} Depot · Joined {selectedDriver.joinDate}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined sz-sm">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/40">
                <p className="text-[10px] text-on-surface-variant">Risk Score</p>
                <div className="mt-1 flex justify-center"><StatusBadge status={selectedDriver.riskScore} /></div>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/40">
                <p className="text-[10px] text-on-surface-variant">Hours (Week)</p>
                <p className="text-sm font-bold text-on-surface mt-1">{selectedDriver.hoursThisWeek} hrs</p>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/40">
                <p className="text-[10px] text-on-surface-variant">Violations</p>
                <p className="text-sm font-bold text-danger mt-1">{selectedDriver.violations}</p>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/40">
                <p className="text-[10px] text-on-surface-variant">Rating</p>
                <p className="text-sm font-bold text-amber-500 mt-1">★ {selectedDriver.rating}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">License Number:</span>
                <span className="font-mono font-medium text-on-surface">{selectedDriver.licenseNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">License Validity:</span>
                <span className="font-medium text-on-surface">{selectedDriver.licenseExpiry}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Phone Contact:</span>
                <span className="font-mono text-on-surface">{selectedDriver.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Current Duty Status:</span>
                <StatusBadge status={selectedDriver.status} />
              </div>
            </div>

            {/* Incident history linked to this driver */}
            <div>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Recorded Incidents ({incidents.filter(i => i.driverId === selectedDriver.id).length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {incidents.filter(i => i.driverId === selectedDriver.id).length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic">No safety violations or accidents recorded for this driver.</p>
                ) : (
                  incidents.filter(i => i.driverId === selectedDriver.id).map(inc => (
                    <div key={inc.id} className="p-2.5 bg-surface-container-low rounded-lg text-xs border border-outline-variant/40 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={inc.severity} />
                          <span className="font-medium text-on-surface capitalize">{inc.type}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">{inc.description}</p>
                      </div>
                      <span className="text-[10px] text-on-surface-variant shrink-0">{inc.timestamp.split('T')[0]}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
