import { useMemo, useState } from 'react'
import { Layers, Plus, Search } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import PageCard from '../components/ui/PageCard'
import PageFormModal from '../components/ui/PageFormModal'
import Modal from '../components/ui/Modal'
import { usePages } from '../context/PagesContext'

export default function MyPages() {
  const { pages, addPage, updatePage, removePage } = usePages()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return pages
    return pages.filter((page) =>
      [page.name, page.platform, page.niche, page.language, page.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    )
  }, [pages, query])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (page) => {
    setEditing(page)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const handleSubmit = (values) => {
    if (editing) updatePage(editing.id, values)
    else addPage(values)
    closeForm()
  }

  const confirmDelete = () => {
    if (pendingDelete) removePage(pendingDelete.id)
    setPendingDelete(null)
  }

  const hasPages = pages.length > 0

  return (
    <>
      <PageHeader
        eyebrow="My Pages"
        title="Pages you manage"
        description="Every page you add becomes a workspace for research, analytics and content generation."
        actions={
          <Button onClick={openCreate} icon={Plus}>
            Add new page
          </Button>
        }
      />

      {hasPages ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter pages"
                aria-label="Filter pages"
                className="h-10 w-full rounded-lg border border-white/10 bg-surface-900 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 transition-colors focus:border-accent-500/60"
              />
            </div>
            <p className="text-xs text-slate-500">
              {filtered.length} of {pages.length} {pages.length === 1 ? 'page' : 'pages'}
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((page) => (
                <PageCard
                  key={page.id}
                  page={page}
                  onEdit={openEdit}
                  onDelete={setPendingDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No matches"
              description="No pages match that filter. Try a different term."
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={Layers}
          title="No pages yet"
          description="Add the social pages you manage. Each one can have its own platform, niche and language — add as many as you need."
          action={
            <Button onClick={openCreate} icon={Plus}>
              Add new page
            </Button>
          }
        />
      )}

      <PageFormModal
        open={formOpen}
        page={editing}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        size="sm"
        title="Remove page"
        description="This removes the page from your workspace."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Remove <span className="font-semibold text-white">{pendingDelete?.name}</span>? You can
          add it again at any time.
        </p>
      </Modal>
    </>
  )
}
