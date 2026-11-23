import { RefreshCw } from 'lucide-react'
import Button from '../ui/Button'
import { Select, TextInput } from '../ui/Field'
import { DATE_RANGES } from '../../constants/analytics'

/**
 * Filter row: page selector (from live page state), date range and refresh.
 * Kept in one row above the charts.
 */
export default function AnalyticsToolbar({
  pages,
  pageId,
  onPageChange,
  range,
  onRangeChange,
  customRange,
  onCustomRangeChange,
  onRefresh,
  refreshing,
}) {
  const pageOptions = pages.map((page) => ({
    value: page.id,
    label: page.platform ? `${page.name} · ${page.platform}` : page.name,
  }))

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          aria-label="Select a page"
          value={pageId}
          onChange={(event) => onPageChange(event.target.value)}
          placeholder={pages.length ? 'Select a page' : 'No pages available'}
          options={pageOptions}
          disabled={!pages.length}
          className="sm:w-60"
        />

        {/* Segmented range control */}
        <div
          role="group"
          aria-label="Date range"
          className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1"
        >
          {DATE_RANGES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={range === key}
              onClick={() => onRangeChange(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                range === key
                  ? 'bg-accent-500/20 text-accent-200 ring-1 ring-accent-500/30'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {range === 'custom' ? (
          <div className="flex items-center gap-2">
            <TextInput
              type="date"
              aria-label="Custom range start"
              value={customRange.start}
              onChange={(event) => onCustomRangeChange({ ...customRange, start: event.target.value })}
              className="w-auto"
            />
            <span className="text-xs text-slate-500">to</span>
            <TextInput
              type="date"
              aria-label="Custom range end"
              value={customRange.end}
              onChange={(event) => onCustomRangeChange({ ...customRange, end: event.target.value })}
              className="w-auto"
            />
          </div>
        ) : null}
      </div>

      <Button variant="secondary" onClick={onRefresh} disabled={refreshing}>
        <RefreshCw
          className={`size-4 shrink-0 ${refreshing ? 'animate-spin' : ''}`}
          aria-hidden="true"
        />
        {refreshing ? 'Refreshing…' : 'Refresh'}
      </Button>
    </div>
  )
}
