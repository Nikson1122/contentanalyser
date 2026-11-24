/**
 * Read-side helpers. Child records store only `pageId`; the page's name is
 * resolved here at render time, so renaming a page updates every reference.
 */
import { LIFECYCLE } from './schema'

export const isActive = (record) => record?.status !== LIFECYCLE.ARCHIVED
export const isArchived = (record) => record?.status === LIFECYCLE.ARCHIVED

export const activeOnly = (records = []) => records.filter(isActive)
export const archivedOnly = (records = []) => records.filter(isArchived)

/** id -> record map for O(1) resolution. */
export const indexById = (records = []) => new Map(records.map((record) => [record.id, record]))

/**
 * Resolve a page reference for display. Always returns something renderable:
 *  - active page   -> { name, archived: false, missing: false }
 *  - archived page -> original name preserved, archived: true
 *  - purged page   -> { name: 'Deleted page', missing: true }
 *  - no reference  -> { name: 'No page', unassigned: true }
 */
export function resolvePage(pageId, index) {
  if (!pageId) {
    return { id: null, name: 'No page', archived: false, missing: false, unassigned: true }
  }
  const page = index instanceof Map ? index.get(pageId) : null
  if (!page) {
    return { id: pageId, name: 'Deleted page', archived: false, missing: true, unassigned: false }
  }
  return {
    id: page.id,
    name: page.name,
    platform: page.platform,
    niche: page.niche,
    language: page.language,
    archived: isArchived(page),
    missing: false,
    unassigned: false,
  }
}
