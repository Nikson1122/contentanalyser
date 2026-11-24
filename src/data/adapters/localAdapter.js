/**
 * localStorage adapter.
 *
 * The ONLY module in the data layer that knows about browser storage.
 * Swapping this for an httpAdapter with the same three methods is the whole
 * backend migration — nothing above it changes.
 *
 * Interface (all async, deliberately, so a network hop later changes nothing):
 *   read(entity)            -> { records, meta }
 *   write(entity, records)  -> { ok, meta }
 *   remove(entity)          -> { ok }
 */
import { ENTITIES, sanitizeCollection } from '../schema'
import { MIGRATION_RESULT, migrate } from '../migrations'

export const NAMESPACE = 'creatorpulse'

export const keyFor = (entity) => `${NAMESPACE}.${entity}.v${ENTITIES[entity]?.version ?? 1}`
export const backupKeyFor = (entity, fromVersion) =>
  `${NAMESPACE}.${entity}.backup.v${fromVersion}`

function available() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    // Accessing localStorage itself throws in some privacy modes.
    return false
  }
}

const getRaw = (key) => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const setRaw = (key, value) => {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/** Write a verbatim copy of a payload before it is transformed. */
function backup(entity, fromVersion, rawPayload) {
  return setRaw(
    backupKeyFor(entity, fromVersion),
    JSON.stringify({
      kind: `${NAMESPACE}.backup`,
      entity,
      fromVersion,
      backedUpAt: new Date().toISOString(),
      payload: rawPayload,
    }),
  )
}

export async function read(entity) {
  const spec = ENTITIES[entity]
  const meta = {
    available: available(),
    present: false,
    version: spec?.version ?? null,
    migration: MIGRATION_RESULT.CURRENT,
    backedUp: false,
    dropped: 0,
    corrupted: false,
  }
  if (!spec || !meta.available) return { records: [], meta }

  // A versioned key is read first; older versions are picked up for migration.
  let stored = getRaw(keyFor(entity))
  let storedVersion = spec.version
  if (!stored) {
    for (let v = spec.version - 1; v >= 1; v -= 1) {
      const older = getRaw(`${NAMESPACE}.${entity}.v${v}`)
      if (older) {
        stored = older
        storedVersion = v
        break
      }
    }
  }
  if (!stored) return { records: [], meta }
  meta.present = true

  let parsed
  try {
    parsed = JSON.parse(stored)
  } catch {
    // Corrupted payload: keep a backup of the bad text rather than destroying it.
    meta.corrupted = true
    meta.backedUp = backup(entity, storedVersion, stored)
    return { records: [], meta }
  }

  const envelopeVersion =
    parsed && typeof parsed === 'object' && typeof parsed.version === 'number'
      ? parsed.version
      : storedVersion
  const payload = parsed && typeof parsed === 'object' && 'data' in parsed ? parsed.data : parsed

  let data = payload
  if (envelopeVersion !== spec.version) {
    // Back up BEFORE transforming, always.
    meta.backedUp = backup(entity, envelopeVersion, stored)
    const result = migrate(entity, payload, envelopeVersion, spec.version)
    meta.migration = result.status
    if (result.status === MIGRATION_RESULT.MIGRATED) {
      data = result.data
    } else if (result.status === MIGRATION_RESULT.FUTURE) {
      // Newer than this build: read what we can, never write it back down.
      data = payload
    } else {
      // FAILED / NO_PATH: sanitize the original rather than drop everything.
      data = payload
    }
  }

  const { records, dropped } = sanitizeCollection(entity, data)
  meta.dropped = dropped

  // Persist the migrated shape only when a migration actually succeeded.
  if (meta.migration === MIGRATION_RESULT.MIGRATED) {
    await write(entity, records)
  }
  return { records, meta }
}

export async function write(entity, records) {
  const spec = ENTITIES[entity]
  if (!spec) return { ok: false, meta: { reason: 'unknown-entity' } }
  if (!available()) return { ok: false, meta: { reason: 'unavailable' } }

  const { records: clean } = sanitizeCollection(entity, records)
  const ok = setRaw(
    keyFor(entity),
    JSON.stringify({
      kind: `${NAMESPACE}.${entity}`,
      version: spec.version,
      savedAt: new Date().toISOString(),
      data: clean,
    }),
  )
  return { ok, meta: { reason: ok ? null : 'quota-or-blocked', count: clean.length } }
}

/** Removes ONE entity's key. Never touches another entity, ever. */
export async function remove(entity) {
  if (!ENTITIES[entity] || !available()) return { ok: false }
  try {
    window.localStorage.removeItem(keyFor(entity))
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

/** Raw snapshot of one entity's stored text — used for pre-destructive backups. */
export async function snapshot(entity) {
  if (!available()) return null
  return getRaw(keyFor(entity))
}
