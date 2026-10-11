import { useState } from 'react'
import { incidents as initialIncidents, vehicleById, driverById } from '../../data/mockData'
import DataTable, { type Column } from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import { SectionCard } from '../../components/ui/ChartContainer'
import { useAppStore } from '../../store/useAppStore'
import type { Incident, IncidentSeverity, IncidentStatus } from '../../types'

export default function IncidentsPage() {
  const [incidentsList, setIncidentsList] = useState<Incident[]>(initialIncidents)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [resolutionInput, setResolutionInput] = useState('')
  const showToast = useAppStore(s => s.showToast)

  const filteredIncidents = incidentsList.filter(inc => {
    const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter
    const vehicle = vehicleById(inc.vehicleId)
    const driver = driverById(inc.driverId)
    const matchesSearch =
      inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle?.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (driver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    return matchesSeverity && matchesStatus && matchesSearch
  })

  function handleResolve(incidentId: string) {
    if (!resolutionInput.trim()) return
    setIncidentsList(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'resolved' as IncidentStatus,
          resolution: resolutionInput,
          actionHistory: [
            ...inc.actionHistory,
            { timestamp: new Date().toISOString(), action: `Incident resolved: ${resolutionInput}`, by: 'Arjun Mehta' },
          ],
        }
      }
      return inc
    }))
    setSelectedIncident(prev => prev ? {
      ...prev,
      status: 'resolved',
      resolution: resolutionInput,
      actionHistory: [
        ...prev.actionHistory,
        { timestamp: new Date().toISOString(), action: `Incident resolved: ${resolutionInput}`, by: 'Arjun Mehta' },
      ],
    } : null)
    setResolutionInput('')
    showToast(`Incident #${incidentId} marked as resolved`, 'success')
  }

  function handleMarkInvestigating(incidentId: string) {
    setIncidentsList(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'investigating' as IncidentStatus,
          actionHistory: [
            ...inc.actionHistory,
            { timestamp: new Date().toISOString(), action: 'Investigation initiated by safety officer', by: 'Arjun Mehta' },
          ],
        }
      }
      return inc
    }))
    setSelectedIncident(prev => prev ? {
      ...prev,
      status: 'investigating',
      actionHistory: [
        ...prev.actionHistory,
        { timestamp: new Date().toISOString(), action: 'Investigation initiated by safety officer', by: 'Arjun Mehta' },
      ],
    } : null)
    showToast(`Incident #${incidentId} updated to Investigating`, 'info')
  }

  const columns: Column<Incident>[] = [
    {
      key: 'id',
      header: 'ID / Time',
      render: (i) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-primary">{i.id}</span>
          <p className="text-[11px] text-on-surface-variant">{i.timestamp.replace('T', ' ').slice(0, 16)}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type & Severity',
      render: (i) => (
        <div>
          <span className="font-semibold text-xs capitalize text-on-surface block mb-1">{i.type}</span>
          <StatusBadge status={i.severity} />
        </div>
      ),
    },
    {
      key: 'vehicleDriver',
      header: 'Vehicle & Driver',
      render: (i) => {
        const vehicle = vehicleById(i.vehicleId)
        const driver = driverById(i.driverId)
        return (
          <div className="text-xs">
            <p className="font-mono font-medium text-on-surface">{vehicle ? vehicle.regNumber : i.vehicleId}</p>
            <p className="text-on-surface-variant text-[11px]">{driver ? driver.name : i.driverId}</p>
          </div>
        )
      },
    },
    {
      key: 'description',
      header: 'Incident Details',
      render: (i) => (
        <div className="text-xs max-w-[340px]">
          <p className="text-on-surface line-clamp-2 leading-relaxed">{i.description}</p>
          <p className="text-[10px] text-on-surface-variant truncate mt-0.5">📍 {i.location}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (i) => <StatusBadge status={i.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (i) => (
        <button
          onClick={() => setSelectedIncident(i)}
          className="px-2.5 py-1 text-xs font-semibold rounded bg-surface-container-low hover:bg-surface-container-high text-primary border border-outline-variant/60 transition-colors"
        >
          Inspect
        </button>
      ),
      align: 'right',
    },
  ]

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-on-surface">Incident Log & Investigation</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Manage accident reports, roadside breakdowns, HOS fatigue warnings, and disciplinary workflows
        </p>
      </div>

      <SectionCard
        title="Fleet Incidents Master Record"
        subtitle={`${filteredIncidents.length} incident records indexed`}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs bg-surface-container-low border border-outline-variant/60 rounded-lg px-2.5 py-1.5 text-on-surface focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-surface-container-low border border-outline-variant/60 rounded-lg px-2.5 py-1.5 text-on-surface focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                placeholder="Search incidents..."
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
          data={filteredIncidents}
          keyExtractor={(i) => i.id}
          onRowClick={(i) => setSelectedIncident(i)}
          emptyMessage="No incidents found for current filters"
        />
      </SectionCard>

      {/* Detail Modal / Drawer */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 animate-fade-in space-y-5">
            <div className="flex items-start justify-between border-b border-outline-variant/50 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-primary">#{selectedIncident.id}</span>
                  <StatusBadge status={selectedIncident.severity} />
                  <StatusBadge status={selectedIncident.status} />
                </div>
                <h2 className="text-base font-bold text-on-surface capitalize">
                  {selectedIncident.type} Incident Report
                </h2>
                <p className="text-xs text-on-surface-variant">{selectedIncident.timestamp.replace('T', ' ')} · {selectedIncident.location}</p>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined sz-sm">close</span>
              </button>
            </div>

            {/* In-depth details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
              <div>
                <p className="text-on-surface-variant text-[11px]">Involved Vehicle</p>
                <p className="font-mono font-bold text-on-surface">
                  {vehicleById(selectedIncident.vehicleId)?.regNumber} ({vehicleById(selectedIncident.vehicleId)?.make} {vehicleById(selectedIncident.vehicleId)?.model})
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[11px]">Assigned Driver</p>
                <p className="font-semibold text-on-surface">
                  {driverById(selectedIncident.driverId)?.name} (ID: {selectedIncident.driverId})
                </p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[11px]">Safety Officer In Charge</p>
                <p className="font-medium text-on-surface">{selectedIncident.assignedTo || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-on-surface-variant text-[11px]">Current Status</p>
                <p className="font-semibold text-on-surface capitalize">{selectedIncident.status}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">Official Summary</h3>
              <p className="text-xs text-on-surface bg-surface-container-low p-3 rounded-lg leading-relaxed border border-outline-variant/40">
                {selectedIncident.description}
              </p>
            </div>

            {selectedIncident.resolution && (
              <div>
                <h3 className="text-xs font-bold text-success uppercase tracking-wider mb-1.5">Resolution Notes</h3>
                <p className="text-xs text-on-surface bg-success/5 border border-success/20 p-3 rounded-lg leading-relaxed">
                  {selectedIncident.resolution}
                </p>
              </div>
            )}

            {/* Audit / Action History */}
            <div>
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Audit & Investigation Trail</h3>
              <div className="space-y-2 border-l-2 border-outline-variant/80 pl-3 ml-1 text-xs">
                {selectedIncident.actionHistory.map((act, idx) => (
                  <div key={idx} className="relative pb-2">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white" />
                    <p className="font-medium text-on-surface">{act.action}</p>
                    <p className="text-[10px] text-on-surface-variant">
                      By {act.by} · {act.timestamp.replace('T', ' ').slice(0, 16)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Form if unresolved */}
            {selectedIncident.status !== 'resolved' && selectedIncident.status !== 'closed' && (
              <div className="pt-3 border-t border-outline-variant/50 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Add Resolution Action / Findings:
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    placeholder="Enter corrective action, repair completion notes, or disciplinary resolution..."
                    className="w-full text-xs p-2.5 bg-surface-container-low border border-outline-variant/60 rounded-lg text-on-surface focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  {selectedIncident.status === 'open' && (
                    <button
                      onClick={() => handleMarkInvestigating(selectedIncident.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
                    >
                      Start Investigation
                    </button>
                  )}
                  <button
                    disabled={!resolutionInput.trim()}
                    onClick={() => handleResolve(selectedIncident.id)}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-success text-white hover:bg-success/90 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
