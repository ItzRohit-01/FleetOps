import { useState, useMemo, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey?: (row: T) => string
  keyExtractor?: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: string
  loading?: boolean
  searchValue?: string
  maxRows?: number
  compact?: boolean
}

export default function DataTable<T>({
  columns, data, rowKey, keyExtractor, onRowClick, emptyMessage = 'No records found.',
  loading, maxRows, compact = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const getKey = (row: T, idx: number) => {
    if (keyExtractor) return keyExtractor(row)
    if (rowKey) return rowKey(row)
    return String((row as Record<string, unknown>).id ?? idx)
  }

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey]
      const bv = (b as Record<string, unknown>)[sortKey]
      const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const visible = maxRows ? sorted.slice(0, maxRows) : sorted

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const py = compact ? 'py-2' : 'py-3'

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant/50">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-outline-variant/50 bg-surface-container-low">
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-2.5 text-left text-[11px] font-bold text-on-surface-variant uppercase tracking-wider select-none',
                  col.sortable && 'cursor-pointer hover:text-on-surface transition-colors',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.width
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="material-symbols-outlined opacity-50" style={{ fontSize: 13 }}>
                      {sortKey === col.key ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/30">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.key} className={`px-4 ${py}`}>
                    <div className="skeleton h-4 rounded" style={{ width: '70%' }} />
                  </td>
                ))}
              </tr>
            ))
          ) : visible.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-on-surface-variant">
                <span className="material-symbols-outlined block mx-auto mb-2 text-outline" style={{ fontSize: 32 }}>inbox</span>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            visible.map((row, idx) => (
              <tr
                key={getKey(row, idx)}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-surface-container-low'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 text-sm text-on-surface',
                      py,
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center'
                    )}
                  >
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {maxRows && data.length > maxRows && (
        <div className="px-4 py-2.5 border-t border-outline-variant/30 bg-surface-container-low text-center">
          <p className="text-xs text-on-surface-variant">
            Showing {maxRows} of {data.length} records
          </p>
        </div>
      )}
    </div>
  )
}
