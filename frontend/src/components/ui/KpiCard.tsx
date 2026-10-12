import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

export interface KpiCardProps {
  label: string
  value: string | number
  icon: ReactNode | string
  iconColor?: string
  iconBg?: string
  trend?: { value: string; positive?: boolean }
  subValue?: string
  subtext?: string
  progress?: number
  className?: string
  onClick?: () => void
}

export default function KpiCard({
  label, value, icon, iconColor = 'text-info', iconBg = 'bg-info/10',
  trend, subValue, subtext, progress, className, onClick
}: KpiCardProps) {
  const displaySub = subtext || subValue
  const isHexOrRgb = iconColor.startsWith('#') || iconColor.startsWith('rgb')

  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-xl p-4.5 border border-outline-variant/60 shadow-sm transition-all duration-200 hover:shadow-md hover:border-outline-variant',
        onClick && 'cursor-pointer hover:bg-surface-container-low/40',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className={cn('p-2 rounded-lg flex items-center justify-center', !isHexOrRgb && iconBg)} style={isHexOrRgb ? { backgroundColor: `${iconColor}15` } : undefined}>
          {typeof icon === 'string' ? (
            <span
              className={cn('material-symbols-outlined', !isHexOrRgb && iconColor)}
              style={{ fontSize: 20, color: isHexOrRgb ? iconColor : undefined }}
            >
              {icon}
            </span>
          ) : (
            <span className={cn('flex items-center justify-center', !isHexOrRgb && iconColor)} style={isHexOrRgb ? { color: iconColor } : undefined}>
              {icon}
            </span>
          )}
        </div>
        {trend && (
          <span className={cn('text-[11px] font-bold', trend.positive ? 'text-success' : 'text-danger')}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
      {displaySub && <p className="text-xs text-on-surface-variant mt-1">{displaySub}</p>}
      {typeof progress === 'number' && (
        <div className="mt-3 h-1 w-full bg-surface-container rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', !isHexOrRgb && iconColor.replace('text-', 'bg-'))}
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: isHexOrRgb ? iconColor : undefined,
            }}
          />
        </div>
      )}
    </div>
  )
}

// Grid wrapper
export function KpiGrid({ children, cols = 4 }: { children: ReactNode; cols?: 2 | 3 | 4 | 6 }) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }
  return <div className={cn('grid gap-4 mb-6', colClasses[cols])}>{children}</div>
}
