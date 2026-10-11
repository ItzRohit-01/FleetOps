import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { dailyMetrics } from '../../data/mockData'
import { format, parseISO } from 'date-fns'

const fmtDate = (d: string) => format(parseISO(d), 'dd MMM')

interface ChartTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  unit?: string
}

function ChartTooltip({ active, payload, label, unit = '' }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-outline-variant rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-on-surface mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-on-surface-variant">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-bold text-on-surface">{p.value}{unit}</span>
        </div>
      ))}
    </div>
  )
}

// ── On-Time Performance Line Chart ─────────────────────────────────────────
export function PerformanceTrendChart() {
  const data = dailyMetrics.map(m => ({
    date: fmtDate(m.date),
    'On-Time Rate': Math.round(m.onTimeRate),
    'Deliveries': m.totalDeliveries,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#c6c6cd" strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} interval={1} />
        <YAxis tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} domain={[75, 100]} unit="%" />
        <Tooltip content={<ChartTooltip unit="%" />} />
        <ReferenceLine y={89} stroke="#0ea5e9" strokeDasharray="4 4" strokeOpacity={0.5} />
        <Line
          type="monotone" dataKey="On-Time Rate" stroke="#0ea5e9" strokeWidth={2}
          dot={{ r: 2, fill: '#0ea5e9', strokeWidth: 0 }}
          activeDot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Fleet Utilization Trend ─────────────────────────────────────────────────
export function UtilizationTrendChart() {
  const data = dailyMetrics.map(m => ({
    date: fmtDate(m.date),
    'Utilization': m.utilization,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#c6c6cd" strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} interval={1} />
        <YAxis tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} domain={[60, 100]} unit="%" />
        <Tooltip content={<ChartTooltip unit="%" />} />
        <Line
          type="monotone" dataKey="Utilization" stroke="#10b981" strokeWidth={2}
          dot={{ r: 2, fill: '#10b981', strokeWidth: 0 }}
          activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Incident Trend Bar Chart ────────────────────────────────────────────────
export function IncidentTrendChart() {
  const data = dailyMetrics.map(m => ({
    date: fmtDate(m.date),
    'Incidents': m.incidentCount,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#c6c6cd" strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} interval={1} />
        <YAxis tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="Incidents" fill="#ef4444" fillOpacity={0.8} radius={[3, 3, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Cost Per Trip Bar Chart ──────────────────────────────────────────────────
export function CostTrendChart() {
  const data = dailyMetrics.map(m => ({
    date: fmtDate(m.date),
    'Cost (₹K)': Math.round(m.costPerTripINR / 1000),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#c6c6cd" strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} interval={1} />
        <YAxis tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} unit="K" />
        <Tooltip content={<ChartTooltip unit="K" />} />
        <Bar dataKey="Cost (₹K)" fill="#8b5cf6" fillOpacity={0.8} radius={[3, 3, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Empty Return Rate Trend ─────────────────────────────────────────────────
export function EmptyReturnTrendChart() {
  const data = dailyMetrics.map(m => ({
    date: fmtDate(m.date),
    'Empty Return': m.emptyReturnRate,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#c6c6cd" strokeOpacity={0.4} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} interval={1} />
        <YAxis tick={{ fontSize: 10, fill: '#45464d' }} tickLine={false} axisLine={false} domain={[10, 35]} unit="%" />
        <Tooltip content={<ChartTooltip unit="%" />} />
        <Line
          type="monotone" dataKey="Empty Return" stroke="#f59e0b" strokeWidth={2}
          dot={{ r: 2, fill: '#f59e0b', strokeWidth: 0 }}
          activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
