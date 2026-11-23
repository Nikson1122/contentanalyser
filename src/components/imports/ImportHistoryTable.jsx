import { useEffect, useRef, useState } from 'react'
import { Eye, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge'
import { IMPORT_STATUS, formatFileSize } from '../../constants/csvImport'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

function formatPeriod(start, end) {
  if (!start && !end) return '—'
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`
  return formatDate(start || end)
}

function ActionMenu({ record, onView, onReprocess, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocumentClick = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocumentClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocumentClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const items = [
    { label: 'View details', icon: Eye, onClick: () => onView?.(record) },
    { label: 'Reprocess', icon: RefreshCw, onClick: () => onReprocess?.(record) },
    { label: 'Delete', icon: Trash2, onClick: () => onDelete?.(record), danger: true },
  ]

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Actions for ${record.filename}`}
        aria-expanded={open}
        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-white/12 bg-surface-850/95 p-1 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          {items.map(({ label, icon: Icon, onClick, danger }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onClick()
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                danger
                  ? 'text-red-300 hover:bg-red-500/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

const COLUMNS = [
  'Filename',
  'Page',
  'Import date',
  'Report period',
  'Total rows',
  'Valid',
  'Invalid',
  'Status',
  '',
]

export default function ImportHistoryTable({ records, onView, onReprocess, onDelete }) {
  return (
    <div className="card sheen overflow-visible">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              {COLUMNS.map((column, index) => (
                <th
                  key={column || `actions-${index}`}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3.5 font-semibold ${
                    index > 3 && index < 8 ? 'text-right' : ''
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {records.map((record) => {
              const status = IMPORT_STATUS[record.status] ?? IMPORT_STATUS.processing
              return (
                <tr key={record.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3.5">
                    <p className="max-w-[18rem] truncate font-medium text-white" title={record.filename}>
                      {record.filename}
                    </p>
                    <p className="text-xs text-slate-500">{formatFileSize(record.fileSize)}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="max-w-[14rem] truncate text-slate-200">{record.pageName}</p>
                    {record.platform ? (
                      <p className="text-xs text-slate-500">{record.platform}</p>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-300">
                    {formatDate(record.importedAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-300">
                    {formatPeriod(record.periodStart, record.periodEnd)}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-slate-200">
                    {record.totalRows?.toLocaleString() ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-accent-300">
                    {record.validRows?.toLocaleString() ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    <span className={record.invalidRows > 0 ? 'text-amber-300' : 'text-slate-500'}>
                      {record.invalidRows?.toLocaleString() ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Badge tone={status.tone} dot>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <ActionMenu
                      record={record}
                      onView={onView}
                      onReprocess={onReprocess}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
