import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ImportsContext = createContext(null)

/**
 * In-memory store for CSV import records.
 * Starts EMPTY — records are created through the import UI.
 * Replace this state with a real data source later; consumers stay unchanged.
 */
export function ImportsProvider({ children }) {
  const [imports, setImports] = useState([])

  const addImport = useCallback((record) => {
    const entry = {
      ...record,
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `import-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      importedAt: new Date().toISOString(),
    }
    setImports((prev) => [entry, ...prev])
    return entry
  }, [])

  const updateImport = useCallback((id, data) => {
    setImports((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)))
  }, [])

  const removeImport = useCallback((id) => {
    setImports((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const stats = useMemo(() => {
    const total = imports.length
    const successful = imports.filter((item) => item.status === 'completed').length
    const failed = imports.filter((item) => item.status === 'failed').length
    const rows = imports.reduce((sum, item) => sum + (item.validRows || 0), 0)
    return { total, successful, failed, rows }
  }, [imports])

  const value = useMemo(
    () => ({ imports, stats, addImport, updateImport, removeImport }),
    [imports, stats, addImport, updateImport, removeImport],
  )

  return <ImportsContext.Provider value={value}>{children}</ImportsContext.Provider>
}

export function useImports() {
  const context = useContext(ImportsContext)
  if (!context) throw new Error('useImports must be used within an ImportsProvider')
  return context
}
