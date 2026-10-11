import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { fleetSummary } from '../../data/mockData'

const STATUS_DATA = [
  { name: 'On Trip',     value: fleetSummary.onTrip,     color: '#0ea5e9' },
  { name: 'Available',   value: fleetSummary.available,  color: '#10b981' },
  { name: 'Assigned',    value: fleetSummary.assigned,   color: '#f59e0b' },
  { name: 'Maintenance', value: fleetSummary.maintenance, color: '#f97316' },
  { name: 'Offline',     value: fleetSummary.offline,    color: '#94a3b8' },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload: { color: string } }[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  const pct = Math.round((d.value / fleetSummary.total) * 100)
  return (
    <div className="bg-white border border-outline-variant rounded-lg px-3 py-2 shadow-lg text-xs">
      <div className="flex items-center gap-2 font-semibold text-on-surface">
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: d.payload.color }} />
        {d.name}
      </div>
      <p className="text-on-surface-variant mt-0.5">{d.value} vehicles ({pct}%)</p>
    </div>
  )
}

export default function FleetStatusChart() {
  return (
    <div className="h-full flex items-center">
      <ResponsiveContainer width="60%" height="100%">
        <PieChart>
          <Pie
            data={STATUS_DATA}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
          >
            {STATUS_DATA.map(entry => (
              <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {/* Center label */}
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex-1 space-y-2 pl-2">
        {STATUS_DATA.map(d => {
          const pct = Math.round((d.value / fleetSummary.total) * 100)
          return (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-on-surface-variant truncate">{d.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-on-surface">{d.value}</span>
                <span className="text-[10px] text-on-surface-variant w-7 text-right">{pct}%</span>
              </div>
            </div>
          )
        })}
        <div className="pt-2 mt-2 border-t border-outline-variant/30">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-on-surface-variant">Total Fleet</span>
            <span className="font-bold text-on-surface">{fleetSummary.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Incident severity donut
const SEVERITY_DATA = [
  { name: 'Critical', value: 2, color: '#ef4444' },
  { name: 'High',     value: 3, color: '#f97316' },
  { name: 'Medium',   value: 2, color: '#f59e0b' },
  { name: 'Low',      value: 1, color: '#0ea5e9' },
]

export function IncidentSeverityChart() {
  const total = SEVERITY_DATA.reduce((s, d) => s + d.value, 0)
  return (
    <div className="h-full flex items-center">
      <ResponsiveContainer width="55%" height="100%">
        <PieChart>
          <Pie data={SEVERITY_DATA} cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={2} dataKey="value">
            {SEVERITY_DATA.map(e => <Cell key={e.name} fill={e.color} strokeWidth={0} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2 pl-2">
        {SEVERITY_DATA.map(d => (
          <div key={d.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-xs text-on-surface-variant">{d.name}</span>
            </div>
            <span className="text-xs font-bold text-on-surface">{d.value}</span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-outline-variant/30">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-on-surface-variant">Open</span>
            <span className="font-bold text-on-surface">{total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
