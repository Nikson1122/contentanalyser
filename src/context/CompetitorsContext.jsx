import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CompetitorsContext = createContext(null)

const makeId = (prefix) =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

/**
 * In-memory store for tracked creators and their research posts.
 * Starts EMPTY — everything is entered by hand through the UI.
 * Research posts are keyed by creator id: { [creatorId]: Post[] }.
 */
export function CompetitorsProvider({ children }) {
  const [creators, setCreators] = useState([])
  const [postsByCreator, setPostsByCreator] = useState({})

  const addCreator = useCallback((data) => {
    const creator = { ...data, id: makeId('creator'), addedAt: new Date().toISOString() }
    setCreators((prev) => [creator, ...prev])
    return creator
  }, [])

  const updateCreator = useCallback((id, data) => {
    setCreators((prev) =>
      prev.map((creator) =>
        creator.id === id ? { ...creator, ...data, updatedAt: new Date().toISOString() } : creator,
      ),
    )
  }, [])

  const removeCreator = useCallback((id) => {
    setCreators((prev) => prev.filter((creator) => creator.id !== id))
    setPostsByCreator((prev) => {
      const { [id]: _removed, ...rest } = prev
      return rest
    })
  }, [])

  const addPost = useCallback((creatorId, data) => {
    const post = { ...data, id: makeId('post'), createdAt: new Date().toISOString() }
    setPostsByCreator((prev) => ({ ...prev, [creatorId]: [post, ...(prev[creatorId] ?? [])] }))
    return post
  }, [])

  const updatePost = useCallback((creatorId, postId, data) => {
    setPostsByCreator((prev) => ({
      ...prev,
      [creatorId]: (prev[creatorId] ?? []).map((post) =>
        post.id === postId ? { ...post, ...data, updatedAt: new Date().toISOString() } : post,
      ),
    }))
  }, [])

  const removePost = useCallback((creatorId, postId) => {
    setPostsByCreator((prev) => ({
      ...prev,
      [creatorId]: (prev[creatorId] ?? []).filter((post) => post.id !== postId),
    }))
  }, [])

  const getPosts = useCallback(
    (creatorId) => postsByCreator[creatorId] ?? [],
    [postsByCreator],
  )

  const postCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(postsByCreator).map(([creatorId, posts]) => [creatorId, posts.length]),
      ),
    [postsByCreator],
  )

  /** Niche filter options come from what the user has actually entered. */
  const niches = useMemo(
    () =>
      [...new Set(creators.map((creator) => creator.niche).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [creators],
  )

  const value = useMemo(
    () => ({
      creators,
      niches,
      postCounts,
      getPosts,
      addCreator,
      updateCreator,
      removeCreator,
      addPost,
      updatePost,
      removePost,
    }),
    [
      creators,
      niches,
      postCounts,
      getPosts,
      addCreator,
      updateCreator,
      removeCreator,
      addPost,
      updatePost,
      removePost,
    ],
  )

  return <CompetitorsContext.Provider value={value}>{children}</CompetitorsContext.Provider>
}

export function useCompetitors() {
  const context = useContext(CompetitorsContext)
  if (!context) throw new Error('useCompetitors must be used within a CompetitorsProvider')
  return context
}
