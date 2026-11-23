import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'
import Button from '../ui/Button'
import { Select } from '../ui/Field'
import { CALENDAR_VIEWS, CONTENT_FORMATS, STATUSES } from '../../constants/calendar'

export const ALL = '__all__'

export default function CalendarToolbar({
  view,
  onViewChange,
  label,
  onPrev,
  onNext,
  onToday,
  pages,
  categories,
  filters,
  onFilterChange,
  onClearFilters,
  filtersActive,
  includePast,
  onIncludePastChange,
}) {
  return (
    <div className="space-y-3">
      {/* Navigation + view switcher */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          {view !== 'list' ? (
            <>
              <button
                type="button"
                onClick={onPrev}
                aria-label={view === 'month' ? 'Previous month' : 'Previous week'}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label={view === 'month' ? 'Next month' : 'Next week'}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
              <Button variant="secondary" size="sm" onClick={onToday}>
                Today
              </Button>
            </>
          ) : (
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={includePast}
                onChange={(event) => onIncludePastChange(event.target.checked)}
                className="size-4 rounded border-white/20 bg-black/30 accent-accent-500"
              />
              Include past items
            </label>
          )}
          <p className="ml-1 text-sm font-semibold text-white">{label}</p>
        </div>

        <div
          role="group"
          aria-label="Calendar view"
          className="inline-flex self-start rounded-xl border border-white/10 bg-white/[0.03] p-1"
        >
          {CALENDAR_VIEWS.map(({ key, label: viewLabel }) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => onViewChange(key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                view === key
                  ? 'bg-accent-500/20 text-accent-200 ring-1 ring-accent-500/30'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {viewLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-2.5 sm:flex-row sm:items-center">
        <span className="flex shrink-0 items-center gap-1.5 px-1 text-xs font-medium text-slate-500">
          <Filter className="size-3.5" aria-hidden="true" />
          Filters
        </span>

        <div className="grid flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <Select
            aria-label="Filter by page"
            value={filters.pageId}
            onChange={(event) => onFilterChange('pageId', event.target.value)}
            options={[
              { value: ALL, label: 'All pages' },
              ...pages.map((page) => ({ value: page.id, label: page.name })),
            ]}
          />
          <Select
            aria-label="Filter by category"
            value={filters.category}
            onChange={(event) => onFilterChange('category', event.target.value)}
            options={[
              { value: ALL, label: 'All categories' },
              ...categories.map((item) => ({ value: item, label: item })),
            ]}
          />
          <Select
            aria-label="Filter by format"
            value={filters.format}
            onChange={(event) => onFilterChange('format', event.target.value)}
            options={[
              { value: ALL, label: 'All formats' },
              ...CONTENT_FORMATS.map((item) => ({ value: item, label: item })),
            ]}
          />
          <Select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(event) => onFilterChange('status', event.target.value)}
            options={[
              { value: ALL, label: 'All statuses' },
              ...STATUSES.map(({ key }) => ({ value: key, label: key })),
            ]}
          />
        </div>

        {filtersActive ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        ) : null}
      </div>
    </div>
  )
}
