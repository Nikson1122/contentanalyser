/**
 * Content calendar constants and pure date helpers — UI only.
 *
 * Item shape, kept deliberately flat so it maps straight onto a future API:
 *   { id, title, pageId, pageName, category, format, date: 'YYYY-MM-DD',
 *     time: 'HH:mm', status, notes, createdAt }
 */

export const CALENDAR_VIEWS = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'list', label: 'List' },
]

export const CONTENT_FORMATS = ['Reel', 'Video', 'Image', 'Text']

/** Workflow states, in order. Each carries its own subtle indicator tone. */
export const STATUSES = [
  { key: 'Idea', tone: 'neutral' },
  { key: 'Draft', tone: 'warning' },
  { key: 'Ready', tone: 'violet' },
  { key: 'Scheduled', tone: 'info' },
  { key: 'Published', tone: 'success' },
]

export const STATUS_TONES = Object.fromEntries(STATUSES.map(({ key, tone }) => [key, tone]))

/** Left accent bar per status, used on chips and cards. */
export const STATUS_BARS = {
  Idea: 'bg-slate-400',
  Draft: 'bg-amber-400',
  Ready: 'bg-violet-400',
  Scheduled: 'bg-glow-400',
  Published: 'bg-accent-400',
}

/** Monday. Change to 0 for a Sunday-first week. */
export const WEEK_STARTS_ON = 1

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const EMPTY_CALENDAR_FORM = {
  title: '',
  pageId: '',
  category: '',
  format: '',
  date: '',
  time: '09:00',
  status: 'Idea',
  notes: '',
}

/* ---------------- pure date helpers (no dependencies) ---------------- */

export const toISODate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Parse 'YYYY-MM-DD' as a local date, avoiding UTC drift. */
export const fromISODate = (iso) => {
  const [year, month, day] = (iso ?? '').split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export const addMonths = (date, months) => {
  const next = new Date(date.getFullYear(), date.getMonth() + months, 1)
  // Clamp the day so e.g. 31 Jan + 1 month lands on the last day of February.
  const day = Math.min(date.getDate(), new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate())
  next.setDate(day)
  return next
}

export const startOfWeek = (date) => {
  const start = startOfDay(date)
  const offset = (start.getDay() - WEEK_STARTS_ON + 7) % 7
  return addDays(start, -offset)
}

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

/**
 * Weeks covering the given month, each a list of 7 day descriptors.
 * Leading and trailing days from adjacent months are marked `inMonth: false`.
 */
export function buildMonthGrid(cursor, today = new Date()) {
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
  const gridStart = startOfWeek(monthStart)

  const weeks = []
  let day = gridStart
  while (day <= monthEnd || weeks.length === 0 || day.getDay() !== WEEK_STARTS_ON) {
    const week = Array.from({ length: 7 }, (_, index) => {
      const current = addDays(day, index)
      return {
        date: current,
        iso: toISODate(current),
        dayNumber: current.getDate(),
        inMonth: current.getMonth() === cursor.getMonth(),
        isToday: isSameDay(current, today),
        isWeekend: current.getDay() === 0 || current.getDay() === 6,
      }
    })
    weeks.push(week)
    day = addDays(day, 7)
    if (weeks.length >= 6) break
  }
  return weeks
}

/** Seven day descriptors for the week containing `cursor`. */
export function buildWeek(cursor, today = new Date()) {
  const start = startOfWeek(cursor)
  return Array.from({ length: 7 }, (_, index) => {
    const current = addDays(start, index)
    return {
      date: current,
      iso: toISODate(current),
      dayNumber: current.getDate(),
      isToday: isSameDay(current, today),
      isWeekend: current.getDay() === 0 || current.getDay() === 6,
    }
  })
}

const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
const dayLabel = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric' })
const fullDayLabel = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const shortDate = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })

export const formatMonthLabel = (date) => monthLabel.format(date)
export const formatDayLabel = (date) => dayLabel.format(date)
export const formatFullDate = (iso) => {
  const date = fromISODate(iso)
  return date ? fullDayLabel.format(date) : '—'
}

export function formatWeekLabel(cursor) {
  const start = startOfWeek(cursor)
  const end = addDays(start, 6)
  const sameMonth = start.getMonth() === end.getMonth()
  return sameMonth
    ? `${start.getDate()} – ${end.getDate()} ${monthLabel.format(start)}`
    : `${shortDate.format(start)} – ${shortDate.format(end)}, ${end.getFullYear()}`
}

/** 'HH:mm' to a localized time; invalid input passes through. */
export function formatTime(time) {
  if (!time) return ''
  const [hours, minutes] = time.split(':').map(Number)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return time
  const date = new Date(2000, 0, 1, hours, minutes)
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date)
}

/** Group items by their ISO date, each group sorted by time. */
export function groupByDate(items) {
  return items.reduce((groups, item) => {
    const list = groups[item.date] ?? (groups[item.date] = [])
    list.push(item)
    list.sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))
    return groups
  }, {})
}

export const sortChronologically = (items) =>
  [...items].sort(
    (a, b) => `${a.date}T${a.time ?? '00:00'}`.localeCompare(`${b.date}T${b.time ?? '00:00'}`),
  )

/**
 * Demonstration items spread across the current month.
 * Built against the user's own pages — no page names are invented. Returns an
 * empty list when there are no pages to attach items to.
 */
export function buildDemoItems(pages, categories = []) {
  if (!pages.length) return []
  const today = new Date()
  const plan = [
    { offset: -8, time: '09:00', format: 'Reel', status: 'Published' },
    { offset: -3, time: '18:30', format: 'Image', status: 'Published' },
    { offset: 0, time: '12:00', format: 'Video', status: 'Ready' },
    { offset: 1, time: '10:15', format: 'Reel', status: 'Scheduled' },
    { offset: 3, time: '20:00', format: 'Text', status: 'Draft' },
    { offset: 6, time: '08:45', format: 'Reel', status: 'Scheduled' },
    { offset: 9, time: '17:00', format: 'Video', status: 'Idea' },
    { offset: 12, time: '11:30', format: 'Image', status: 'Idea' },
  ]

  return plan.map((entry, index) => {
    const page = pages[index % pages.length]
    const date = addDays(today, entry.offset)
    return {
      id: `demo-item-${index + 1}`,
      title: `Demonstration item ${index + 1}`,
      pageId: page.id,
      pageName: page.name,
      category: page.niche || categories[index % Math.max(1, categories.length)] || '',
      format: entry.format,
      date: toISODate(date),
      time: entry.time,
      status: entry.status,
      notes: 'Placeholder planning note — demonstration data.',
      demo: true,
      createdAt: new Date().toISOString(),
    }
  })
}
