/**
 * The single ID generator for every entity.
 * Previously duplicated across four contexts with four different fallbacks.
 */
export function makeId(prefix = 'rec') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback keeps a prefix so a non-UUID id is still traceable to its entity.
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 10)}`
}

/** True for anything that looks like an id we could have issued. */
export const isId = (value) => typeof value === 'string' && value.length > 0
