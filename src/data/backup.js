/**
 * Backup export for the data layer.
 * Plain JSON over a Blob download — no dependency, no network.
 * Offered before any destructive action so valid data is never lost outright.
 */
import { ENTITIES } from './schema'
import { createRepository } from './repository'

export const BACKUP_KIND = 'creatorpulse.backup'

export function buildBackupFilename(entity, date = new Date()) {
  const stamp = Number.isNaN(date.getTime())
    ? 'export'
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')}`
  return `creatorpulse-${entity}-backup-${stamp}.json`
}

export function buildBackupPayload(entity, records) {
  return {
    kind: BACKUP_KIND,
    entity,
    version: ENTITIES[entity]?.version ?? 1,
    exportedAt: new Date().toISOString(),
    count: Array.isArray(records) ? records.length : 0,
    data: records ?? [],
  }
}

function triggerDownload(filename, text) {
  try {
    const blob = new Blob([text], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
    return true
  } catch {
    return false
  }
}

/** Download every record of one entity, archived included. */
export async function downloadEntityBackup(entity) {
  if (!ENTITIES[entity]) return false
  const { records } = await createRepository(entity).list()
  const payload = buildBackupPayload(entity, records)
  return triggerDownload(buildBackupFilename(entity), JSON.stringify(payload, null, 2))
}
