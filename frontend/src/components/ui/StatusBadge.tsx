import { cn } from '../../lib/utils'
import type { VehicleStatus, DriverStatus, JobStatus, IncidentSeverity, IncidentStatus, RecommendationStatus, JobPriority } from '../../types'

type BadgeVariant = VehicleStatus | DriverStatus | JobStatus | IncidentSeverity | IncidentStatus | RecommendationStatus | JobPriority | 'valid' | 'expiring-soon' | 'expired' | 'low' | 'medium' | 'high'

const variants: Record<string, string> = {
  // Vehicle status
  'available':    'bg-success/10 text-success border-success/20',
  'on-trip':      'bg-info/10 text-info border-info/20',
  'assigned':     'bg-warning/10 text-warning border-warning/20',
  'maintenance':  'bg-orange-100 text-orange-700 border-orange-200',
  'offline':      'bg-surface-container text-on-surface-variant border-outline-variant/50',
  // Driver status
  'off-duty':     'bg-surface-container text-on-surface-variant border-outline-variant/50',
  'on-leave':     'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed-dim/30',
  // Job status
  'unassigned':   'bg-warning/10 text-warning border-warning/20',
  'in-transit':   'bg-info/10 text-info border-info/20',
  'delivered':    'bg-success/10 text-success border-success/20',
  'cancelled':    'bg-surface-container text-on-surface-variant border-outline-variant/50',
  // Incident severity
  'critical':     'bg-danger/10 text-danger border-danger/20',
  'high':         'bg-orange-100 text-orange-700 border-orange-200',
  'medium':       'bg-warning/10 text-warning border-warning/20',
  'low':          'bg-info/10 text-info border-info/20',
  // Incident status
  'open':         'bg-danger/10 text-danger border-danger/20',
  'investigating':'bg-warning/10 text-warning border-warning/20',
  'resolved':     'bg-success/10 text-success border-success/20',
  'closed':       'bg-surface-container text-on-surface-variant border-outline-variant/50',
  // Recommendation status
  'pending':      'bg-accent-ai/10 text-accent-ai border-accent-ai/20',
  'approved':     'bg-success/10 text-success border-success/20',
  'rejected':     'bg-danger/10 text-danger border-danger/20',
  'overridden':   'bg-orange-100 text-orange-700 border-orange-200',
  // Priority
  // 'critical' already covered
  // 'high' already covered
  // 'medium' already covered
  // 'low' already covered
  // Compliance
  'valid':        'bg-success/10 text-success border-success/20',
  'expiring-soon':'bg-warning/10 text-warning border-warning/20',
  'expired':      'bg-danger/10 text-danger border-danger/20',
}

const labels: Record<string, string> = {
  'on-trip': 'On Trip',
  'off-duty': 'Off Duty',
  'on-leave': 'On Leave',
  'in-transit': 'In Transit',
  'expiring-soon': 'Expiring Soon',
}

interface StatusBadgeProps {
  status: BadgeVariant
  className?: string
  dot?: boolean
}

export default function StatusBadge({ status, className, dot = false }: StatusBadgeProps) {
  const style = variants[status] ?? 'bg-surface-container text-on-surface-variant border-outline-variant/50'
  const label = labels[status] ?? (status.charAt(0).toUpperCase() + status.slice(1))

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border',
      style,
      className
    )}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
      {label}
    </span>
  )
}
