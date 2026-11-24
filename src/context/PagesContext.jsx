import { createContext, useCallback, useContext, useMemo } from 'react'
import { usePersistedCollection } from '../hooks/usePersistedCollection'
import { activeOnly, archivedOnly, indexById, resolvePage } from '../data/selectors'
import { describePageReferences } from '../data/relations'

const PagesContext = createContext(null)

/**
 * Pages store, persisted through the repository layer.
 *
 * `pages` deliberately exposes ACTIVE pages only, so every existing consumer
 * (Dashboard, Analytics, Studio, Calendar, Video Lab, import wizard) keeps the
 * behaviour it had before archiving existed. Screens that need the full set
 * read `allPages` / `archivedPages`, and anything resolving a reference uses
 * `getPage` or `resolvePageRef`, which also find archived pages.
 */
export function PagesProvider({ children }) {
  const {
    records,
    loading,
    meta,
    lastError,
    create,
    update,
    archive,
    restore,
    purge,
    refresh,
  } = usePersistedCollection('pages')

  const pages = useMemo(() => activeOnly(records), [records])
  const archivedPages = useMemo(() => archivedOnly(records), [records])
  const pageIndex = useMemo(() => indexById(records), [records])

  const getPage = useCallback((id) => pageIndex.get(id) ?? null, [pageIndex])

  /** Display-safe reference: resolves archived and purged pages too. */
  const resolvePageRef = useCallback((id) => resolvePage(id, pageIndex), [pageIndex])

  const addPage = useCallback((data) => create(data).then((r) => r.record), [create])
  const updatePage = useCallback((id, data) => update(id, data), [update])

  /** Soft delete. Kept under the original name so existing callers still work. */
  const removePage = useCallback((id) => archive(id), [archive])
  const archivePage = removePage
  const restorePage = useCallback((id) => restore(id), [restore])

  /**
   * Hard delete. Requires an archived page and an explicit confirmation, and
   * returns a raw backup of the pre-purge payload.
   */
  const purgePage = useCallback((id) => purge(id, { confirm: true }), [purge])

  /** What references a page — for the purge warning. Later phases pass data in. */
  const describeReferences = useCallback(
    (id, collections) => describePageReferences(id, collections),
    [],
  )

  const value = useMemo(
    () => ({
      pages,
      allPages: records,
      archivedPages,
      pageIndex,
      loading,
      storageAvailable: meta.available !== false,
      storageMeta: meta,
      lastError,
      getPage,
      resolvePageRef,
      addPage,
      updatePage,
      removePage,
      archivePage,
      restorePage,
      purgePage,
      describeReferences,
      refresh,
    }),
    [
      pages, records, archivedPages, pageIndex, loading, meta, lastError, getPage,
      resolvePageRef, addPage, updatePage, removePage, archivePage, restorePage,
      purgePage, describeReferences, refresh,
    ],
  )

  return <PagesContext.Provider value={value}>{children}</PagesContext.Provider>
}

export function usePages() {
  const context = useContext(PagesContext)
  if (!context) throw new Error('usePages must be used within a PagesProvider')
  return context
}
