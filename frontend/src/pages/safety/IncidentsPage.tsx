import { useState } from 'react'
import { vehicleById, driverById } from '../../data/mockData'
import DataTable, { type Column } from '../../components/ui/DataTable'
import StatusBadge from '../../components/ui/StatusBadge'
import DetailDrawer from '../../components/ui/DetailDrawer'
import { useAppStore } from '../../store/useAppStore'
import { api } from '../../lib/api'
import type { Incident, IncidentSeverity, IncidentStatus } from '../../types'
import {
  AlertTriangle,
  ShieldAlert,
  Wrench,
  Clock,
  User,
  CheckCircle2,
  MapPin,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Activity,
  Truck,
} from 'lucide-react'

export default function IncidentsPage() {
  // Use live store incidents; fall back to store initial data
  const storeIncidents = useAppStore(s => s.incidents)
  const updateIncidentStatus = useAppStore(s => s.updateIncidentStatus)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [resolutionInput, setResolutionInput] = useState('')
  const showToast = useAppStore(s => s.showToast)

  const incidentsList = storeIncidents

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

  async function handleResolve(incidentId: string) {
    if (!resolutionInput.trim()) return
    const note = `Incident resolved: ${resolutionInput}`
    await updateIncidentStatus(incidentId, 'resolved', note)
    // Sync selected incident UI state
    setSelectedIncident(prev =>
      prev && prev.id === incidentId
        ? { ...prev, status: 'resolved', resolution: resolutionInput,
            actionHistory: [...prev.actionHistory, { timestamp: new Date().toISOString(), action: note, by: 'Safety Officer' }] }
        : prev
    )
    setResolutionInput('')
  }

  async function handleMarkInvestigating(incidentId: string) {
    const note = 'Safety officer initiated on-site investigation'
    await updateIncidentStatus(incidentId, 'investigating', note)
    setSelectedIncident(prev =>
      prev && prev.id === incidentId
        ? { ...prev,
            status: 'investigating',
            actionHistory: [
              ...prev.actionHistory,
              {
                timestamp: new Date().toISOString(),
                action: 'Safety officer initiated on-site investigation',
                by: 'Arjun Mehta',
              },
            ],
          }
        : null
    )
    showToast(`Incident #${incidentId} updated to Investigating`, 'info')
  }

  const columns: Column<Incident>[] = [
    {
      key: 'id',
      header: 'Incident ID / Logged',
      render: i => (
        <div>
          <span className="font-mono text-xs font-bold text-primary">{i.id}</span>
          <p className="text-[10px] text-on-surface-variant font-mono">
            {i.timestamp.replace('T', ' ').slice(0, 16)}
          </p>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      render: i => <StatusBadge status={i.severity} dot />,
    },
    {
      key: 'status',
      header: 'Triage Status',
      render: i => <StatusBadge status={i.status} />,
    },
    {
      key: 'type',
      header: 'Classification',
      render: i => (
        <span className="text-xs font-semibold capitalize text-on-surface">
          {i.type.replace('-', ' ')}
        </span>
      ),
    },
    {
      key: 'location',
      header: 'Corridor Location',
      render: i => (
        <span className="text-xs text-on-surface truncate max-w-[200px] flex items-center gap-1">
          <MapPin className="w-3 h-3 text-info shrink-0" />
          <span className="truncate">{i.location}</span>
        </span>
      ),
    },
    {
      key: 'vehicleId',
      header: 'Involved Vehicle & Driver',
      render: i => {
        const v = vehicleById(i.vehicleId)
        const d = driverById(i.driverId)
        return (
          <div className="text-xs">
            <span className="font-mono font-bold text-on-surface">{v?.regNumber ?? i.vehicleId}</span>
            <p className="text-[10px] text-on-surface-variant">{d?.name ?? i.driverId}</p>
          </div>
        )
      },
    },
  ]

  const criticalCount = incidentsList.filter(i => i.severity === 'critical' && i.status !== 'resolved').length
  const investigatingCount = incidentsList.filter(i => i.status === 'investigating').length

  const vehicle = selectedIncident ? vehicleById(selectedIncident.vehicleId) : null
  const driver = selectedIncident ? driverById(selectedIncident.driverId) : null

  return (
    <div className="space-y-4 max-w-[1440px]">
      {/* Safety Incident Command Strip */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-danger/10 text-danger rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface flex items-center gap-2">
              Safety Triage & Incident Resolution Board
              {criticalCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 animate-pulse">
                  {criticalCount} Critical Active
                </span>
              )}
            </h1>
            <p className="text-xs text-on-surface-variant">
              Telemetry violations, highway collisions, and mechanical breakdown investigations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/40 font-semibold text-on-surface">
            {investigatingCount} Under Investigation
          </span>
        </div>
      </div>

      {/* Main Board Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4">
        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-outline-variant/30">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Filter by description, location, vehicle, driver..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-on-surface-variant font-semibold mr-1">Severity:</span>
              {['all', 'critical', 'high', 'medium', 'low'].map(s => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase transition-colors ${
                    severityFilter === s
                      ? s === 'critical'
                        ? 'bg-danger text-white'
                        : 'bg-surface-container-high text-on-surface font-bold border border-outline-variant'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Incidents Data Table */}
        <DataTable
          columns={columns}
          data={filteredIncidents}
          rowKey={r => r.id}
          onRowClick={r => setSelectedIncident(r)}
          maxRows={15}
          compact
        />
      </div>

      {/* Slide-out Incident Triage & Resolution Drawer */}
      <DetailDrawer
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        title={selectedIncident ? `Incident #${selectedIncident.id} · ${selectedIncident.type.toUpperCase()}` : ''}
        subtitle={selectedIncident ? selectedIncident.location : ''}
        width="max-w-lg"
      >
        {selectedIncident && (
          <div className="space-y-4">
            {/* Status & Severity Pill */}
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedIncident.severity} dot />
                <StatusBadge status={selectedIncident.status} />
              </div>
              <span className="text-[10px] font-mono text-on-surface-variant">
                Logged: {selectedIncident.timestamp.replace('T', ' ').slice(0, 16)}
              </span>
            </div>

            {/* Description Summary */}
            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-1 text-xs">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Event Description & Telemetry Flag
              </span>
              <p className="text-on-surface leading-relaxed pt-1">{selectedIncident.description}</p>
            </div>

            {/* Involved Assets */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-surface-container-low p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <Truck className="w-3 h-3 text-info" /> Vehicle
                </span>
                {vehicle ? (
                  <div>
                    <p className="font-bold text-on-surface">{vehicle.regNumber}</p>
                    <p className="text-[11px] text-on-surface-variant">{vehicle.make} ({vehicle.depot})</p>
                  </div>
                ) : (
                  <p className="text-on-surface-variant">{selectedIncident.vehicleId}</p>
                )}
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3 text-success" /> Driver
                </span>
                {driver ? (
                  <div>
                    <p className="font-bold text-on-surface">{driver.name}</p>
                    <p className="text-[11px] text-on-surface-variant">Rating ⭐ {driver.rating} · Violations: {driver.violations}</p>
                  </div>
                ) : (
                  <p className="text-on-surface-variant">{selectedIncident.driverId}</p>
                )}
              </div>
            </div>

            {/* Action History Timeline */}
            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-on-surface-variant" /> Investigation Timeline
              </span>
              <div className="space-y-2 pt-1 border-l-2 border-outline-variant/60 ml-2 pl-3">
                {selectedIncident.actionHistory.map((act, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                    <p className="text-[10px] font-mono text-on-surface-variant">
                      {act.timestamp.replace('T', ' ').slice(11, 16)} · by {act.by}
                    </p>
                    <p className="text-xs font-medium text-on-surface mt-0.5">{act.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Actions / Input */}
            {selectedIncident.status !== 'resolved' && selectedIncident.status !== 'closed' ? (
              <div className="p-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl space-y-3">
                <span className="text-xs font-bold text-on-surface block">
                  Resolve or Update Incident
                </span>

                <textarea
                  value={resolutionInput}
                  onChange={e => setResolutionInput(e.target.value)}
                  placeholder="Document resolution notes, root cause, and remediation steps..."
                  rows={2}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary resize-none"
                />

                <div className="flex items-center gap-2 justify-end">
                  {selectedIncident.status === 'open' && (
                    <button
                      onClick={() => handleMarkInvestigating(selectedIncident.id)}
                      className="px-3 py-1.5 border border-outline-variant text-on-surface hover:bg-surface-container rounded-lg text-xs font-semibold transition-colors"
                    >
                      Mark Investigating
                    </button>
                  )}
                  <button
                    disabled={!resolutionInput.trim()}
                    onClick={() => handleResolve(selectedIncident.id)}
                    className="px-3.5 py-1.5 bg-success text-white rounded-lg text-xs font-semibold hover:bg-success/90 transition-opacity disabled:opacity-50 flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Resolved
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-xs text-success font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> This incident has been resolved and logged in compliance audits.
              </div>
            )}
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
