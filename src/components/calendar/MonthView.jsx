import { Plus } from 'lucide-react'
import { ItemChip } from './CalendarItem'
import { WEEKDAY_LABELS, buildMonthGrid, groupByDate } from '../../constants/calendar'

const MAX_VISIBLE = 3

export default function MonthView({ cursor, items, onItemClick, onDayClick }) {
  const weeks = buildMonthGrid(cursor)
  const grouped = groupByDate(items)

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[44rem]">
        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-px rounded-t-xl border border-white/10 bg-white/5">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-xl border border-t-0 border-white/10 bg-white/10">
          {weeks.flat().map((day) => {
            const dayItems = grouped[day.iso] ?? []
            const overflow = dayItems.length - MAX_VISIBLE

            return (
              <div
                key={day.iso}
                className={`group/day relative flex min-h-[7rem] flex-col gap-1 p-1.5 transition-colors ${
                  day.inMonth ? 'bg-surface-900' : 'bg-surface-950/60'
                } ${day.isWeekend && day.inMonth ? 'bg-surface-900/70' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-6 items-center justify-center rounded-md text-xs tabular-nums ${
                      day.isToday
                        ? 'bg-accent-500/25 font-bold text-accent-200 ring-1 ring-accent-500/40'
                        : day.inMonth
                          ? 'font-medium text-slate-300'
                          : 'text-slate-600'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDayClick(day.iso)}
                    aria-label={`Add content on ${day.iso}`}
                    className="rounded-md p-0.5 text-slate-500 opacity-0 transition-opacity hover:bg-white/10 hover:text-white focus-visible:opacity-100 group-hover/day:opacity-100"
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {dayItems.slice(0, MAX_VISIBLE).map((item) => (
                    <ItemChip key={item.id} item={item} onClick={onItemClick} />
                  ))}
                  {overflow > 0 ? (
                    <button
                      type="button"
                      onClick={() => onDayClick(day.iso, dayItems)}
                      className="px-1 text-left text-[10px] font-medium text-slate-500 transition-colors hover:text-accent-300"
                    >
                      +{overflow} more
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
