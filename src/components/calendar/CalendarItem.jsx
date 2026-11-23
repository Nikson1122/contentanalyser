import { Clock, FileText, Layers, Tag } from 'lucide-react'
import Badge from '../ui/Badge'
import { STATUS_BARS, STATUS_TONES, formatTime } from '../../constants/calendar'

/** Compact chip for dense month cells. */
export function ItemChip({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      title={`${item.title} · ${item.status}`}
      className="flex w-full items-center gap-1.5 overflow-hidden rounded-md border border-white/10 bg-white/5 py-1 pl-1 pr-1.5 text-left transition-colors hover:border-white/25 hover:bg-white/10"
    >
      <span
        className={`h-3.5 w-0.5 shrink-0 rounded-full ${STATUS_BARS[item.status] ?? 'bg-slate-400'}`}
        aria-hidden="true"
      />
      {item.time ? (
        <span className="shrink-0 text-[10px] tabular-nums text-slate-500">
          {formatTime(item.time)}
        </span>
      ) : null}
      <span className="truncate text-[11px] font-medium text-slate-200">{item.title}</span>
    </button>
  )
}

/** Fuller card for week and list views. */
export function ItemCard({ item, onClick, showDate = false, dateLabel }) {
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group relative flex w-full flex-col gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3 pl-4 text-left transition-colors hover:border-accent-500/30 hover:bg-white/[0.05]"
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${STATUS_BARS[item.status] ?? 'bg-slate-400'}`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-white">
          {item.title}
        </p>
        <Badge tone={STATUS_TONES[item.status] ?? 'neutral'} dot className="shrink-0">
          {item.status}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
        {showDate && dateLabel ? (
          <span className="inline-flex items-center gap-1 font-medium text-slate-300">
            {dateLabel}
          </span>
        ) : null}
        {item.time ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {formatTime(item.time)}
          </span>
        ) : null}
        {item.pageName ? (
          <span className="inline-flex min-w-0 items-center gap-1">
            <Layers className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.pageName}</span>
          </span>
        ) : null}
        {item.category ? (
          <span className="inline-flex min-w-0 items-center gap-1">
            <Tag className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.category}</span>
          </span>
        ) : null}
        {item.format ? (
          <span className="inline-flex items-center gap-1">
            <FileText className="size-3" aria-hidden="true" />
            {item.format}
          </span>
        ) : null}
      </div>
    </button>
  )
}
