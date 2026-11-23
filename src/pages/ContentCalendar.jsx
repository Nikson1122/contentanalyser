import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, FlaskConical, Layers, Plus, Trash2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import CalendarToolbar, { ALL } from '../components/calendar/CalendarToolbar'
import MonthView from '../components/calendar/MonthView'
import WeekView from '../components/calendar/WeekView'
import ListView from '../components/calendar/ListView'
import ContentFormModal from '../components/calendar/ContentFormModal'
import ItemDetailModal from '../components/calendar/ItemDetailModal'
import { usePages } from '../context/PagesContext'
import { useCalendar } from '../context/CalendarContext'
import {
  addDays,
  addMonths,
  buildDemoItems,
  formatMonthLabel,
  formatWeekLabel,
  toISODate,
} from '../constants/calendar'

const NO_FILTERS = { pageId: ALL, category: ALL, format: ALL, status: ALL }

export default function ContentCalendar() {
  const { pages } = usePages()
  const { items, addItem, updateItem, removeItem, replaceItems, clearItems } = useCalendar()

  const [view, setView] = useState('month')
  const [cursor, setCursor] = useState(() => new Date())
  const [filters, setFilters] = useState(NO_FILTERS)
  const [includePast, setIncludePast] = useState(false)

  const [form, setForm] = useState({ open: false, item: null, date: '' })
  const [detail, setDetail] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  /** Categories offered by the filter and form come from the user's pages. */
  const categories = useMemo(() => {
    const fromPages = pages.map((page) => page.niche).filter(Boolean)
    const fromItems = items.map((item) => item.category).filter(Boolean)
    return [...new Set([...fromPages, ...fromItems])].sort((a, b) => a.localeCompare(b))
  }, [pages, items])

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (filters.pageId !== ALL && item.pageId !== filters.pageId) return false
        if (filters.category !== ALL && item.category !== filters.category) return false
        if (filters.format !== ALL && item.format !== filters.format) return false
        if (filters.status !== ALL && item.status !== filters.status) return false
        return true
      }),
    [items, filters],
  )

  const filtersActive = Object.entries(filters).some(([, value]) => value !== ALL)

  const label =
    view === 'month'
      ? formatMonthLabel(cursor)
      : view === 'week'
        ? formatWeekLabel(cursor)
        : includePast
          ? 'All planned content'
          : 'Upcoming content'

  const step = (direction) =>
    setCursor((prev) => (view === 'month' ? addMonths(prev, direction) : addDays(prev, direction * 7)))

  const openAdd = (date = '') => setForm({ open: true, item: null, date })
  const openEdit = (item) => {
    setDetail(null)
    setForm({ open: true, item, date: '' })
  }

  const handleSubmit = (values) => {
    if (form.item) updateItem(form.item.id, values)
    else addItem(values)
    setForm({ open: false, item: null, date: '' })
  }

  const confirmDelete = () => {
    if (pendingDelete) removeItem(pendingDelete.id)
    setPendingDelete(null)
    setDetail(null)
  }

  const loadDemo = () => {
    replaceItems(buildDemoItems(pages, categories))
    setCursor(new Date())
    setFilters(NO_FILTERS)
  }

  const hasItems = items.length > 0
  const hasDemoItems = items.some((item) => item.demo)

  return (
    <>
      <PageHeader
        eyebrow="Content Calendar"
        title="Content Calendar"
        description="Organize your content ideas and plan your publishing schedule."
        actions={
          <>
            {hasDemoItems ? (
              <Badge tone="warning" icon={FlaskConical}>
                Demonstration data
              </Badge>
            ) : null}
            <Button icon={Plus} onClick={() => openAdd()} disabled={!pages.length}>
              Add Content
            </Button>
          </>
        }
      />

      {!pages.length ? (
        <EmptyState
          icon={Layers}
          title="No pages to plan for"
          description="Calendar items are attached to a page. Create a page first, then come back to plan content for it."
          action={
            <Button as={Link} to="/pages">
              Go to My Pages
            </Button>
          }
        />
      ) : (
        <>
          <CalendarToolbar
            view={view}
            onViewChange={setView}
            label={label}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onToday={() => setCursor(new Date())}
            pages={pages}
            categories={categories}
            filters={filters}
            onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
            onClearFilters={() => setFilters(NO_FILTERS)}
            filtersActive={filtersActive}
            includePast={includePast}
            onIncludePastChange={setIncludePast}
          />

          {!hasItems ? (
            <EmptyState
              icon={CalendarDays}
              title="Nothing planned yet"
              description="Add your first piece of content, or load a set of demonstration items to see how the calendar works."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button icon={Plus} onClick={() => openAdd()}>
                    Add Content
                  </Button>
                  <Button variant="secondary" icon={FlaskConical} onClick={loadDemo}>
                    Load demonstration data
                  </Button>
                </div>
              }
            />
          ) : (
            <>
              <div className="card sheen p-3 sm:p-4">
                {view === 'month' ? (
                  <MonthView
                    cursor={cursor}
                    items={filtered}
                    onItemClick={setDetail}
                    onDayClick={openAdd}
                  />
                ) : null}
                {view === 'week' ? (
                  <WeekView
                    cursor={cursor}
                    items={filtered}
                    onItemClick={setDetail}
                    onDayClick={openAdd}
                  />
                ) : null}
                {view === 'list' ? (
                  <ListView
                    items={filtered}
                    onItemClick={setDetail}
                    includePast={includePast}
                  />
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <p className="text-xs text-slate-500">
                  {filtered.length} of {items.length} {items.length === 1 ? 'item' : 'items'}
                  {filtersActive ? ' matching filters' : ''} · nothing is published automatically
                </p>
                {hasDemoItems ? (
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={clearItems}>
                    Clear demonstration data
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </>
      )}

      <ContentFormModal
        open={form.open}
        item={form.item}
        defaultDate={form.date}
        pages={pages}
        categories={categories}
        onClose={() => setForm({ open: false, item: null, date: '' })}
        onSubmit={handleSubmit}
      />

      <ItemDetailModal
        open={Boolean(detail)}
        item={detail}
        onClose={() => setDetail(null)}
        onEdit={openEdit}
        onDelete={setPendingDelete}
      />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        size="sm"
        title="Delete planned content"
        description="This removes the item from your calendar."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Delete <span className="font-semibold text-white">{pendingDelete?.title}</span>?
        </p>
      </Modal>
    </>
  )
}
