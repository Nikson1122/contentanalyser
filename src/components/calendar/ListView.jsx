import { CalendarDays } from 'lucide-react'
import { ItemCard } from './CalendarItem'
import EmptyState from '../ui/EmptyState'
import {
  formatFullDate,
  fromISODate,
  sortChronologically,
  startOfDay,
} from '../../constants/calendar'

/** Upcoming content in chronological order, grouped by day. */
export default function ListView({ items, onItemClick, includePast }) {
  const today = startOfDay(new Date())

  const relevant = sortChronologically(
    includePast
      ? items
      : items.filter((item) => {
          const date = fromISODate(item.date)
          return !date || date >= today
        }),
  )

  if (relevant.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title={includePast ? 'Nothing planned' : 'Nothing upcoming'}
        description={
          includePast
            ? 'No content matches the current filters.'
            : 'No upcoming content matches the current filters. Switch on "Include past" to see earlier items.'
        }
      />
    )
  }

  // Group consecutive items that share a date.
  const groups = relevant.reduce((acc, item) => {
    const last = acc[acc.length - 1]
    if (last && last.date === item.date) last.items.push(item)
    else acc.push({ date: item.date, items: [item] })
    return acc
  }, [])

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.date}>
          <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <CalendarDays className="size-3.5 text-slate-500" aria-hidden="true" />
            {formatFullDate(group.date)}
            <span className="font-normal normal-case tracking-normal text-slate-600">
              · {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
            </span>
          </h3>
          <div className="grid gap-2.5 lg:grid-cols-2">
            {group.items.map((item) => (
              <ItemCard key={item.id} item={item} onClick={onItemClick} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
