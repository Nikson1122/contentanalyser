/**
 * Versioned migrations, run on read.
 *
 * Rules, in order of importance:
 *  1. Valid user data is never discarded. A migration transforms, it never resets.
 *  2. A backup of the pre-migration payload is written BEFORE any transform.
 *  3. An unknown FUTURE version is never downgraded — the data is left alone and
 *     reported, so a newer build's data survives being opened by an older one.
 *  4. A migration that throws leaves the stored payload untouched.
 */

/**
 * migrations[entity] = { [fromVersion]: (data) => nextData }
 * Each step moves data up exactly one version.
 *
 * v1 is the first released schema, so there is nothing to migrate from yet.
 * The map is wired up and tested so later versions are a data-only change.
 */
export const MIGRATIONS = {
  pages: {
    // Example of the shape a future step takes:
    // 1: (records) => records.map((r) => ({ ...r, newField: '' })),
  },
}

export const MIGRATION_RESULT = {
  CURRENT: 'current',
  MIGRATED: 'migrated',
  FUTURE: 'future',
  FAILED: 'failed',
  NO_PATH: 'no-path',
}

/**
 * Bring `data` from `fromVersion` up to `targetVersion`.
 * Returns { status, data, from, to, steps } and never throws.
 */
export function migrate(entity, data, fromVersion, targetVersion) {
  const steps = []

  if (typeof fromVersion !== 'number' || Number.isNaN(fromVersion)) {
    return { status: MIGRATION_RESULT.FAILED, data, from: fromVersion, to: targetVersion, steps }
  }
  if (fromVersion === targetVersion) {
    return { status: MIGRATION_RESULT.CURRENT, data, from: fromVersion, to: targetVersion, steps }
  }
  if (fromVersion > targetVersion) {
    // Newer data than this build understands: leave it exactly as it is.
    return { status: MIGRATION_RESULT.FUTURE, data, from: fromVersion, to: targetVersion, steps }
  }

  const table = MIGRATIONS[entity] ?? {}
  let current = data
  for (let version = fromVersion; version < targetVersion; version += 1) {
    const step = table[version]
    if (typeof step !== 'function') {
      return { status: MIGRATION_RESULT.NO_PATH, data, from: fromVersion, to: version, steps }
    }
    try {
      current = step(current)
      steps.push(`${version}->${version + 1}`)
    } catch {
      // Abort on the first failure and hand back the ORIGINAL payload.
      return { status: MIGRATION_RESULT.FAILED, data, from: fromVersion, to: version, steps }
    }
  }
  return { status: MIGRATION_RESULT.MIGRATED, data: current, from: fromVersion, to: targetVersion, steps }
}
