import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface ChartContainerProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  height?: number
  action?: ReactNode
  badge?: string
}

export function ChartContainer({ title, subtitle, children, className, height = 260, action, badge }: ChartContainerProps) {
  return (
    <div className={cn('bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden', className)}>
      <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-on-surface">{title}</h3>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-ai/10 text-accent-ai">{badge}</span>
            )}
          </div>
          {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={{ height }} className="px-4 py-3">
        {children}
      </div>
    </div>
  )
}

interface SectionCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  action?: ReactNode
  noPad?: boolean
}

export function SectionCard({ title, subtitle, children, className, action, noPad }: SectionCardProps) {
  return (
    <div className={cn('bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden', className)}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-outline-variant/30">
        <div>
          <h3 className="text-sm font-bold text-on-surface">{title}</h3>
          {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className={noPad ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  )
}

export function PageGrid({ children, className, cols = 2 }: { children: ReactNode; className?: string; cols?: 1 | 2 | 3 | 4 }) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }
  return (
    <div className={cn('grid gap-4 mb-4', colClasses[cols], className)}>
      {children}
    </div>
  )
}

export function FullWidthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden mb-4', className)}>
      {children}
    </div>
  )
}
