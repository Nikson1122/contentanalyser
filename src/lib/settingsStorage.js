import { DEFAULT_SETTINGS } from '../constants/settings'

/**
 * localStorage access for the Settings module ONLY.
 *
 * This module owns exactly one key and never touches anything else in storage,
 * so clearing settings can never remove pages, imports, calendar content,
 * competitor records or any other application data.
 */
export const SETTINGS_STORAGE_KEY = 'creatorpulse.settings.v1'

/** Schema version, stored alongside the values so future migrations are possible. */
export const SETTINGS_SCHEMA_VERSION = 1

/** Keys that may be persisted, derived from the defaults so the two cannot drift. */
const ALLOWED_KEYS = Object.keys(DEFAULT_SETTINGS)

function isStorageAvailable() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    // Accessing localStorage throws in some privacy modes.
    return false
  }
}

/**
 * Merges stored values over the defaults, keeping only known keys whose type
 * matches the default. Anything unknown, misshapen or of the wrong type is
 * dropped rather than trusted, so corrupted data degrades to the default.
 */
export function sanitizeSettings(raw) {
  const result = { ...DEFAULT_SETTINGS }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result

  for (const key of ALLOWED_KEYS) {
    const value = raw[key]
    if (value === undefined || value === null) continue
    if (typeof value !== typeof DEFAULT_SETTINGS[key]) continue
    if (typeof value === 'string' && value.length > 200) continue
    result[key] = value
  }
  return result
}

/** Reads settings. Returns the defaults when absent, unreadable or corrupted. */
export function loadSettings() {
  if (!isStorageAvailable()) return { ...DEFAULT_SETTINGS }

  let stored = null
  try {
    stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
  if (!stored) return { ...DEFAULT_SETTINGS }

  try {
    const parsed = JSON.parse(stored)
    // Accepts both the wrapped shape and a bare values object.
    const values = parsed && typeof parsed === 'object' ? (parsed.values ?? parsed) : null
    return sanitizeSettings(values)
  } catch {
    // Unparseable payload: drop the bad entry so it cannot keep failing.
    clearSettings()
    return { ...DEFAULT_SETTINGS }
  }
}

/** Writes settings. Returns true when the write succeeded. */
export function saveSettings(values) {
  if (!isStorageAvailable()) return false
  try {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        version: SETTINGS_SCHEMA_VERSION,
        savedAt: new Date().toISOString(),
        values: sanitizeSettings(values),
      }),
    )
    return true
  } catch {
    // Quota exceeded or storage blocked — the in-memory state still applies.
    return false
  }
}

/**
 * Removes the settings entry and nothing else.
 * Deliberately `removeItem` on one key — never `localStorage.clear()`.
 */
export function clearSettings() {
  if (!isStorageAvailable()) return false
  try {
    window.localStorage.removeItem(SETTINGS_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

/* ------------------------------------------------------------------ *
 * Export / import
 * Plain JSON over a Blob download and a file input — no dependencies,
 * no network. Only Settings data is ever read or written.
 * ------------------------------------------------------------------ */

/** Marker that identifies a file as a CreatorPulse settings export. */
export const EXPORT_KIND = 'creatorpulse.settings'

/** The exact object written to disk. */
export function buildExportPayload(values) {
  return {
    kind: EXPORT_KIND,
    version: SETTINGS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    values: sanitizeSettings(values),
  }
}

/** e.g. creatorpulse-settings-2026-11-24.json */
export function buildExportFilename(date = new Date()) {
  const stamp = Number.isNaN(date.getTime())
    ? 'export'
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')}`
  return `creatorpulse-settings-${stamp}.json`
}

/**
 * Validates raw file text.
 * Returns { ok: true, values, applied, ignored, meta } or { ok: false, error }.
 * Never throws, and never trusts a field it cannot verify.
 */
export function parseImportPayload(text) {
  if (typeof text !== 'string' || !text.trim()) {
    return { ok: false, error: 'The file is empty.' }
  }
  if (text.length > 100_000) {
    return { ok: false, error: 'The file is too large to be a settings export.' }
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'This is not valid JSON.' }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'The file must contain a JSON object.' }
  }

  // A bare values object is accepted, but a wrong `kind` is not: that would
  // mean importing some other product's or module's data.
  if (parsed.kind !== undefined && parsed.kind !== EXPORT_KIND) {
    return { ok: false, error: 'This file is not a CreatorPulse settings export.' }
  }
  if (
    parsed.version !== undefined &&
    (typeof parsed.version !== 'number' || parsed.version > SETTINGS_SCHEMA_VERSION)
  ) {
    return {
      ok: false,
      error: `Unsupported settings version. This build reads version ${SETTINGS_SCHEMA_VERSION}.`,
    }
  }

  const raw = parsed.values !== undefined ? parsed.values : parsed
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'The file has no settings values.' }
  }

  const values = sanitizeSettings(raw)
  const applied = ALLOWED_KEYS.filter(
    (key) => Object.prototype.hasOwnProperty.call(raw, key) && values[key] === raw[key],
  )
  const ignored = Object.keys(raw).filter((key) => !applied.includes(key))

  if (applied.length === 0) {
    return { ok: false, error: 'No recognisable settings were found in this file.' }
  }

  return {
    ok: true,
    values,
    applied,
    ignored,
    meta: { version: parsed.version ?? null, exportedAt: parsed.exportedAt ?? null },
  }
}

/** Triggers a browser download of the given settings. Returns true on success. */
export function downloadSettings(values) {
  try {
    const payload = buildExportPayload(values)
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = buildExportFilename()
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Revoke on the next tick so the download has claimed the blob.
    setTimeout(() => URL.revokeObjectURL(url), 0)
    return true
  } catch {
    return false
  }
}

/** Reads a File as text without pulling in a dependency. */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('The file could not be read.'))
    reader.readAsText(file)
  })
}
