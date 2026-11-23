import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { usePages } from './PagesContext'

const StudioContext = createContext(null)

/**
 * Content Studio state: user-managed content categories and generated results.
 * Categories are seeded from the niches on the user's own pages and can be
 * extended at runtime — nothing is hardcoded.
 */
export function StudioProvider({ children }) {
  const { pages } = usePages()
  const [customCategories, setCustomCategories] = useState([])
  const [results, setResults] = useState([])

  const categories = useMemo(() => {
    const fromPages = pages.map((page) => page.niche).filter(Boolean)
    return [...new Set([...fromPages, ...customCategories])].sort((a, b) => a.localeCompare(b))
  }, [pages, customCategories])

  const addCategory = useCallback((name) => {
    const trimmed = name.trim()
    if (!trimmed) return null
    setCustomCategories((prev) =>
      prev.some((item) => item.toLowerCase() === trimmed.toLowerCase()) ? prev : [...prev, trimmed],
    )
    return trimmed
  }, [])

  const removeCategory = useCallback((name) => {
    setCustomCategories((prev) => prev.filter((item) => item !== name))
  }, [])

  const addResult = useCallback((result) => {
    setResults((prev) => [result, ...prev])
    return result
  }, [])

  const clearResults = useCallback(() => setResults([]), [])

  const value = useMemo(
    () => ({ categories, addCategory, removeCategory, results, addResult, clearResults }),
    [categories, addCategory, removeCategory, results, addResult, clearResults],
  )

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}

export function useStudio() {
  const context = useContext(StudioContext)
  if (!context) throw new Error('useStudio must be used within a StudioProvider')
  return context
}
