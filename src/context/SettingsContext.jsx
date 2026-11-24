import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_SETTINGS } from '../constants/settings'
import {
  SETTINGS_STORAGE_KEY,
  clearSettings,
  loadSettings,
  saveSettings,
} from '../lib/settingsStorage'

const SettingsContext = createContext(null)

/**
 * Settings store, persisted to one localStorage key.
 * Hydrates once on mount; every committed change is written straight back.
 * Only Settings data is stored here — other modules keep their own state.
 */
export function SettingsProvider({ children }) {
  // Lazy initialiser: storage is read once, before the first paint.
  const [settings, setSettings] = useState(() => loadSettings())
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [savedAt, setSavedAt] = useState(null)

  const persist = useCallback((next) => {
    setSettings(next)
    const ok = saveSettings(next)
    setStorageAvailable(ok)
    if (ok) setSavedAt(new Date().toISOString())
    return ok
  }, [])

  /** Commit a whole values object (used by the Settings page's Save action). */
  const updateSettings = useCallback((values) => persist({ ...DEFAULT_SETTINGS, ...values }), [persist])

  /** Commit a single preference immediately. */
  const setSetting = useCallback(
    (key, value) => persist({ ...settings, [key]: value }),
    [persist, settings],
  )

  /** Restore defaults and drop ONLY the settings key from storage. */
  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS })
    const ok = clearSettings()
    setStorageAvailable(ok)
    setSavedAt(null)
    return ok
  }, [])

  // Keep tabs in sync: another tab writing our key updates this one.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== SETTINGS_STORAGE_KEY && event.key !== null) return
      setSettings(loadSettings())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(
    () => ({
      settings,
      savedAt,
      storageAvailable,
      updateSettings,
      setSetting,
      resetSettings,
    }),
    [settings, savedAt, storageAvailable, updateSettings, setSetting, resetSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within a SettingsProvider')
  return context
}
