/**
 * Entity-agnostic repository.
 *
 * Every method is async on purpose: the localStorage adapter resolves
 * immediately, but call sites are already written for a network round trip, so
 * swapping in an HTTP adapter later needs no changes above this layer.
 *
 * Deletion policy:
 *   archive()  — soft, reversible, keeps the id so relationships stay valid
 *   restore()  — undo an archive
 *   purge()    — hard delete, caller must pass { confirm: true }
 */
import * as localAdapter from './adapters/localAdapter'
import { ENTITIES, LIFECYCLE, NEVER_PERSIST, sanitizeRecord } from './schema'
import { makeId } from './id'

let adapter = localAdapter

/** Swap the storage backend. The future HTTP adapter arrives through here. */
export function setAdapter(next) {
  adapter = next
}
export const getAdapter = () => adapter

const now = () => new Date().toISOString()

/** Strip session-only fields (blob URLs, File handles) before any write. */
function stripTransient(values) {
  const out = { ...values }
  for (const field of NEVER_PERSIST) delete out[field]
  return out
}

export function createRepository(entity) {
  const spec = ENTITIES[entity]
  if (!spec) throw new Error(`Unknown entity: ${entity}`)

  /** Full collection, archived included. Callers filter. */
  async function list() {
    const { records, meta } = await adapter.read(entity)
    return { records, meta }
  }

  async function get(id) {
    const { records } = await adapter.read(entity)
    return records.find((record) => record.id === id) ?? null
  }

  async function create(values) {
    const { records } = await adapter.read(entity)
    const record = sanitizeRecord(entity, {
      ...stripTransient(values),
      id: makeId(spec.idPrefix),
      status: LIFECYCLE.ACTIVE,
      createdAt: now(),
      updatedAt: null,
      archivedAt: null,
    })
    if (!record) return { ok: false, reason: 'invalid', record: null, records }
    const next = [...records, record]
    const { ok } = await adapter.write(entity, next)
    return { ok, record, records: next }
  }

  async function update(id, values) {
    const { records } = await adapter.read(entity)
    const index = records.findIndex((record) => record.id === id)
    if (index === -1) return { ok: false, reason: 'not-found', record: null, records }

    // id, createdAt and lifecycle fields are not caller-writable here.
    const { id: _i, createdAt: _c, status: _s, archivedAt: _a, ...patch } = stripTransient(values)
    const merged = sanitizeRecord(entity, { ...records[index], ...patch, updatedAt: now() })
    if (!merged) return { ok: false, reason: 'invalid', record: null, records }

    const next = [...records]
    next[index] = merged
    const { ok } = await adapter.write(entity, next)
    return { ok, record: merged, records: next }
  }

  /** Soft delete. The record and its id survive, so references stay valid. */
  async function archive(id) {
    const { records } = await adapter.read(entity)
    const index = records.findIndex((record) => record.id === id)
    if (index === -1) return { ok: false, reason: 'not-found', records }
    const next = [...records]
    next[index] = {
      ...records[index],
      status: LIFECYCLE.ARCHIVED,
      archivedAt: now(),
      updatedAt: now(),
    }
    const { ok } = await adapter.write(entity, next)
    return { ok, record: next[index], records: next }
  }

  async function restore(id) {
    const { records } = await adapter.read(entity)
    const index = records.findIndex((record) => record.id === id)
    if (index === -1) return { ok: false, reason: 'not-found', records }
    const next = [...records]
    next[index] = {
      ...records[index],
      status: LIFECYCLE.ACTIVE,
      archivedAt: null,
      updatedAt: now(),
    }
    const { ok } = await adapter.write(entity, next)
    return { ok, record: next[index], records: next }
  }

  /**
   * Hard delete. Refuses without an explicit confirm flag, and refuses to purge
   * a record that is not archived first — so nothing is destroyed in one step.
   * Returns a raw backup of the pre-purge payload for the caller to keep.
   */
  async function purge(id, { confirm = false, allowActive = false } = {}) {
    if (!confirm) return { ok: false, reason: 'confirmation-required', records: null }
    const { records } = await adapter.read(entity)
    const record = records.find((item) => item.id === id)
    if (!record) return { ok: false, reason: 'not-found', records }
    if (record.status !== LIFECYCLE.ARCHIVED && !allowActive) {
      return { ok: false, reason: 'archive-first', records }
    }
    const backup = await adapter.snapshot(entity)
    const next = records.filter((item) => item.id !== id)
    const { ok } = await adapter.write(entity, next)
    return { ok, records: next, backup, purged: record }
  }

  /**
   * Wholesale replace — used by demo loaders.
   * Refuses to overwrite real (non-demo) records unless explicitly allowed, so
   * demo data can never silently destroy a user's work.
   */
  async function replaceAll(nextRecords, { allowOverwrite = false } = {}) {
    const { records } = await adapter.read(entity)
    const hasRealData = records.some((record) => !record.demo)
    if (hasRealData && !allowOverwrite) {
      return { ok: false, reason: 'would-overwrite-user-data', records }
    }
    const { ok } = await adapter.write(entity, nextRecords)
    return { ok, records: nextRecords }
  }

  /** Clears this entity's storage key only. */
  async function clear({ confirm = false } = {}) {
    if (!confirm) return { ok: false, reason: 'confirmation-required' }
    const backup = await adapter.snapshot(entity)
    const { ok } = await adapter.remove(entity)
    return { ok, backup }
  }

  return { entity, spec, list, get, create, update, archive, restore, purge, replaceAll, clear }
}
