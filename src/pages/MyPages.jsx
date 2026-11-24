import { useMemo, useState } from 'react'
import { Archive, Download, Layers, Plus, Search } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import PageCard from '../components/ui/PageCard'
import PageFormModal from '../components/ui/PageFormModal'
import Modal from '../components/ui/Modal'
import ArchivedPageRow from '../components/pages/ArchivedPageRow'
import PurgePageModal from '../components/pages/PurgePageModal'
import { usePages } from '../context/PagesContext'
import { downloadEntityBackup } from '../data/backup'

export default function MyPages() {
  const {
    pages,
    archivedPages,
    loading,
    storageAvailable,
    addPage,
    updatePage,
    archivePage,
    restorePage,
    purgePage,
    describeReferences,
  } = usePages()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pendingArchive, setPendingArchive] = useState(null)
  const [pendingPurge, setPendingPurge] = useState(null)
  const [showArchived, setShowArchived] = useState(false)
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

  // Phase 1 has only Pages persisted, so no dependent collections exist yet to
  // count. The modal explains that related records are kept regardless.
  const purgeReferences = useMemo(
    () => (pendingPurge ? describeReferences(pendingPurge.id, {}) : { lines: [], total: 0, known: false }),
    [pendingPurge, describeReferences],
  )

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

  const confirmArchive = () => {
    if (pendingArchive) archivePage(pendingArchive.id)
    setPendingArchive(null)
  }

  const confirmPurge = (page) => {
    if (page) purgePage(page.id)
    setPendingPurge(null)
  }

  const hasPages = pages.length > 0
  const hasArchived = archivedPages.length > 0

  return (
    <>
      <PageHeader
        eyebrow="My Pages"
        title="Pages you manage"
        description="Every page you add becomes a workspace for research, analytics and content generation."
        actions={
          <>
            {!storageAvailable ? (
              <Badge tone="danger" dot className="self-center">
                Storage unavailable
              </Badge>
            ) : null}
            {hasArchived ? (
              <Button variant="ghost" icon={Archive} onClick={() => setShowArchived((v) => !v)}>
                {showArchived ? 'Hide archived' : `Archived (${archivedPages.length})`}
              </Button>
            ) : null}
            <Button onClick={openCreate} icon={Plus}>
              Add new page
            </Button>
          </>
        }
      />

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Loading your pages…</p>
      ) : (
        <>
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
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 transition-colors hover:border-white/20 focus:border-accent-500/60 focus:bg-white/[0.07]"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {filtered.length} of {pages.length} active {pages.length === 1 ? 'page' : 'pages'}
                </p>
              </div>

              {filtered.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((page) => (
                    <PageCard
                      key={page.id}
                      page={page}
                      onEdit={openEdit}
                      onDelete={setPendingArchive}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="No matches"
                  description="No pages match that filter. Try a different term."
                  className="mt-4"
                />
              )}
            </>
          ) : (
            <EmptyState
              icon={Layers}
              title={hasArchived ? 'No active pages' : 'No pages yet'}
              description={
                hasArchived
                  ? 'Every page you had is archived. Restore one, or add a new page.'
                  : 'Add the social pages you manage. Each one can have its own platform, niche and language — add as many as you need.'
              }
              action={
                <Button onClick={openCreate} icon={Plus}>
                  Add new page
                </Button>
              }
            />
          )}

          {hasArchived && showArchived ? (
            <section className="card sheen mt-6 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-white">Archived pages</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Archived pages keep their name, their ID and everything attached to them —
                    imports, calendar entries, analyzed videos and generated scripts are never
                    deleted. Restore a page to use it again.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  onClick={() => downloadEntityBackup('pages')}
                  className="shrink-0"
                >
                  Back up pages
                </Button>
              </div>
              <ul className="mt-5 flex flex-col gap-3">
                {archivedPages.map((page) => (
                  <ArchivedPageRow
                    key={page.id}
                    page={page}
                    onRestore={(target) => restorePage(target.id)}
                    onPurge={setPendingPurge}
                  />
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <PageFormModal open={formOpen} page={editing} onClose={closeForm} onSubmit={handleSubmit} />

      <Modal
        open={Boolean(pendingArchive)}
        onClose={() => setPendingArchive(null)}
        size="sm"
        title="Archive page"
        description="Nothing is deleted."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingArchive(null)}>
              Cancel
            </Button>
            <Button variant="danger" icon={Archive} onClick={confirmArchive}>
              Archive
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-slate-300">
          Archive <span className="font-semibold text-white">{pendingArchive?.name}</span>? It
          leaves your active list but keeps its record and ID, so its imports, calendar entries,
          analyzed videos and generated content stay linked and intact. You can restore it at any
          time.
        </p>
      </Modal>

      <PurgePageModal
        page={pendingPurge}
        references={purgeReferences}
        onClose={() => setPendingPurge(null)}
        onConfirm={confirmPurge}
        onBackup={() => downloadEntityBackup('pages')}
      />
    </>
  )
}
