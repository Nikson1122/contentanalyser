/**
 * Referential integrity helpers.
 *
 * Archiving a page affects NOTHING else — that is the point of soft deletion.
 * Purging a page is the only destructive act, and the caller must be able to
 * tell the user exactly what references it first.
 */
import { ENTITIES } from './schema'

/**
 * Count records in other entities that reference `pageId`.
 * `collections` is a plain map of already-loaded data, e.g.
 *   { imports: [...], calendar: [...], videos: [...], studio: [...] }
 * Phase 1 only has Pages wired up, so this returns zeroes until later phases
 * hand it their collections — the shape is fixed now so they just pass data in.
 */
export function countPageReferences(pageId, collections = {}) {
  const counts = {}
  let total = 0
  for (const entity of ENTITIES.pages.dependents) {
    const items = Array.isArray(collections[entity]) ? collections[entity] : []
    const n = items.filter((item) => item?.pageId === pageId).length
    counts[entity] = n
    total += n
  }
  return { counts, total, known: Object.keys(collections).length > 0 }
}

/** Explicit plurals — naive 's' suffixing mangles words like "entry". */
const LABELS = {
  imports: ['CSV import record', 'CSV import records'],
  calendar: ['calendar entry', 'calendar entries'],
  videos: ['analyzed video', 'analyzed videos'],
  studio: ['generated script', 'generated scripts'],
}

/** Human-readable warning lines for a purge confirmation dialog. */
export function describePageReferences(pageId, collections = {}) {
  const { counts, total, known } = countPageReferences(pageId, collections)
  const lines = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([entity, n]) => {
      const [one, many] = LABELS[entity] ?? [entity, entity]
      return `${n} ${n === 1 ? one : many}`
    })
  return { lines, total, known }
}
