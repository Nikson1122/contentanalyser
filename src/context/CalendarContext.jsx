import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CalendarContext = createContext(null)

const makeId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.random().toString(16).slice(2)}`

/**
 * In-memory store for calendar items.
 * Starts EMPTY; demonstration items can be loaded on demand, built against the
 * user's own pages. Swap this state for a real data source later — consumers
 * only use the item shape documented in constants/calendar.js.
 */
export function CalendarProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = useCallback((data) => {
    const item = { ...data, id: makeId(), createdAt: new Date().toISOString() }
    setItems((prev) => [...prev, item])
    return item
  }, [])

  const updateItem = useCallback((id, data) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item,
      ),
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const replaceItems = useCallback((next) => setItems(next), [])

  const clearItems = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({ items, addItem, updateItem, removeItem, replaceItems, clearItems }),
    [items, addItem, updateItem, removeItem, replaceItems, clearItems],
  )

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider')
  return context
}
