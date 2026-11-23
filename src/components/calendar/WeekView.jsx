import { Plus } from 'lucide-react'
import { ItemCard } from './CalendarItem'
import { buildWeek, formatDayLabel, groupByDate } from '../../constants/calendar'

export default function WeekView({ cursor, items, onItemClick, onDayClick }) {
  const days = buildWeek(cursor)
  const grouped = groupByDate(items)

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {days.map((day) => {
        const dayItems = grouped[day.iso] ?? []
        return (
          <div
            key={day.iso}
            className={`group/day flex min-h-[12rem] flex-col rounded-xl border p-2.5 ${
              day.isToday
                ? 'border-accent-500/35 bg-accent-500/[0.05]'
                : day.isWeekend
                  ? 'border-white/10 bg-white/[0.01]'
                  : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <header className="mb-2.5 flex items-center justify-between gap-2 border-b border-white/5 pb-2">
              <span
                className={`text-xs font-semibold ${
                  day.isToday ? 'text-accent-200' : 'text-slate-300'
                }`}
              >
                {formatDayLabel(day.date)}
              </span>
              <div className="flex items-center gap-1">
                {dayItems.length > 0 ? (
                  <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] tabular-nums text-slate-500">
                    {dayItems.length}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onDayClick(day.iso)}
                  aria-label={`Add content on ${day.iso}`}
                  className="rounded-md p-0.5 text-slate-500 opacity-0 transition-opacity hover:bg-white/10 hover:text-white focus-visible:opacity-100 group-hover/day:opacity-100"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </header>

            {dayItems.length > 0 ? (
              <div className="flex flex-col gap-2">
                {dayItems.map((item) => (
                  <ItemCard key={item.id} item={item} onClick={onItemClick} />
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onDayClick(day.iso)}
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 text-[11px] text-slate-600 transition-colors hover:border-accent-500/30 hover:text-accent-400"
              >
                Nothing planned
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
