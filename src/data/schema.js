/**
 * Field specifications per entity.
 *
 * One source of truth for: runtime validation, storage sanitizing, JSON import
 * validation, and — later — the API payload contract. A field not listed here
 * is never persisted, so an unknown or injected key cannot reach storage.
 *
 * spec: { type, default, maxLength?, enum?, nullable? }
 */

export const LIFECYCLE = { ACTIVE: 'active', ARCHIVED: 'archived' }

/** Lifecycle + audit fields every entity carries. */
const BASE_FIELDS = {
  id: { type: 'string', default: '', maxLength: 120 },
  status: { type: 'string', default: LIFECYCLE.ACTIVE, enum: Object.values(LIFECYCLE) },
  createdAt: { type: 'string', default: '', maxLength: 40 },
  updatedAt: { type: 'string', default: '', maxLength: 40, nullable: true },
  archivedAt: { type: 'string', default: null, maxLength: 40, nullable: true },
}

export const ENTITIES = {
  pages: {
    key: 'pages',
    version: 1,
    idPrefix: 'page',
    label: 'Pages',
    fields: {
      ...BASE_FIELDS,
      name: { type: 'string', default: '', maxLength: 200 },
      platform: { type: 'string', default: '', maxLength: 80 },
      niche: { type: 'string', default: '', maxLength: 120 },
      description: { type: 'string', default: '', maxLength: 2000 },
      language: { type: 'string', default: '', maxLength: 80 },
    },
    /** Entities that reference a page by id — used for purge warnings. */
    dependents: ['imports', 'calendar', 'videos', 'studio'],
  },
}

/** Fields that must never be written to storage, whatever the spec says. */
export const NEVER_PERSIST = ['previewUrl', 'file', 'blob']

/**
 * Coerce one record against an entity spec.
 * Unknown keys are dropped; wrong types, over-long strings and values outside
 * an enum fall back to the field default. Never throws.
 */
export function sanitizeRecord(entity, raw) {
  const spec = ENTITIES[entity]
  if (!spec) return null
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const out = {}
  for (const [field, rule] of Object.entries(spec.fields)) {
    const value = raw[field]

    if (value === undefined || value === null) {
      out[field] = rule.nullable ? (value === null ? null : rule.default) : rule.default
      continue
    }
    if (typeof value !== rule.type) {
      out[field] = rule.default
      continue
    }
    if (rule.type === 'string') {
      if (rule.maxLength && value.length > rule.maxLength) {
        out[field] = rule.default
        continue
      }
      if (rule.enum && !rule.enum.includes(value)) {
        out[field] = rule.default
        continue
      }
    }
    out[field] = value
  }

  // A record with no usable id is unusable: the caller decides to drop it.
  return out.id ? out : null
}

/** Sanitize a whole collection, dropping unusable records rather than failing. */
export function sanitizeCollection(entity, raw) {
  if (!Array.isArray(raw)) return { records: [], dropped: 0 }
  const records = []
  let dropped = 0
  const seen = new Set()
  for (const item of raw) {
    const record = sanitizeRecord(entity, item)
    if (!record || seen.has(record.id)) {
      dropped += 1
      continue
    }
    seen.add(record.id)
    records.push(record)
  }
  return { records, dropped }
}

/** Validation for user-submitted values, before a write. */
export function validateRecord(entity, values) {
  const spec = ENTITIES[entity]
  const errors = {}
  if (!spec) return { valid: false, errors: { _entity: 'Unknown entity.' } }

  for (const [field, rule] of Object.entries(spec.fields)) {
    const value = values[field]
    if (value === undefined || value === null) continue
    if (typeof value !== rule.type) {
      errors[field] = `Expected ${rule.type}.`
    } else if (rule.type === 'string' && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `Must be ${rule.maxLength} characters or fewer.`
    } else if (rule.enum && !rule.enum.includes(value)) {
      errors[field] = `Must be one of: ${rule.enum.join(', ')}.`
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}
