import { useMemo, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

export type Column<T> = {
  key: string
  header: ReactNode
  render: (row: T) => ReactNode
  className?: string
  hideOnMobile?: boolean
}

export function DataTable<T>({ rows, columns, rowKey, pageSize = 10, onRowClick, empty }: { rows: T[]; columns: Column<T>[]; rowKey: (row: T) => string; pageSize?: number; onRowClick?: (row: T) => void; empty?: ReactNode }) {
  const { tr, fmtNumber } = useI18n()
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pages - 1)
  const slice = useMemo(() => rows.slice(current * pageSize, current * pageSize + pageSize), [rows, current, pageSize])

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 ${c.hideOnMobile ? 'hidden md:table-cell' : ''} ${c.className ?? ''}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {slice.map((row) => (
              <tr key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer hover:bg-surface-2/60' : ''}>
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 align-middle ${c.hideOnMobile ? 'hidden md:table-cell' : ''} ${c.className ?? ''}`}>{c.render(row)}</td>
                ))}
              </tr>
            ))}
            {slice.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted">{empty ?? tr('ไม่พบข้อมูล', 'No data')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 text-sm text-muted">
        <span>
          {tr('ทั้งหมด', 'Total')} {fmtNumber(rows.length)} {tr('รายการ', 'rows')}
        </span>
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-1.5 hover:bg-surface-2 disabled:opacity-40" disabled={current === 0} onClick={() => setPage(current - 1)} aria-label="Previous page">
            <ChevronLeft size={18} />
          </button>
          <span className="tabular-nums">{current + 1} / {pages}</span>
          <button className="rounded-lg p-1.5 hover:bg-surface-2 disabled:opacity-40" disabled={current >= pages - 1} onClick={() => setPage(current + 1)} aria-label="Next page">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
