import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const PagesContext = createContext(null)

/**
 * In-memory store for managed pages.
 * Intentionally starts EMPTY — pages are created by the user at runtime.
 * Swap the state here for a real data source later; the UI stays unchanged.
 */
export function PagesProvider({ children }) {
  const [pages, setPages] = useState([])

  const addPage = useCallback((data) => {
    const page = {
      ...data,
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `page-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
    }
    setPages((prev) => [...prev, page])
    return page
  }, [])

  const updatePage = useCallback((id, data) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id ? { ...page, ...data, updatedAt: new Date().toISOString() } : page,
      ),
    )
  }, [])

  const removePage = useCallback((id) => {
    setPages((prev) => prev.filter((page) => page.id !== id))
  }, [])

  const value = useMemo(
    () => ({ pages, addPage, updatePage, removePage }),
    [pages, addPage, updatePage, removePage],
  )

  return <PagesContext.Provider value={value}>{children}</PagesContext.Provider>
}

export function usePages() {
  const context = useContext(PagesContext)
  if (!context) throw new Error('usePages must be used within a PagesProvider')
  return context
}
