import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const VideoLabContext = createContext(null)

const makeId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `video-${Date.now()}-${Math.random().toString(16).slice(2)}`

/**
 * In-memory store for analyzed video records.
 * Starts EMPTY; demonstration records can be loaded on demand. No file or URL
 * is ever uploaded or fetched — only the metadata below is kept.
 */
export function VideoLabProvider({ children }) {
  const [videos, setVideos] = useState([])

  const addVideo = useCallback((data) => {
    const video = { ...data, id: makeId(), addedAt: new Date().toISOString() }
    setVideos((prev) => [video, ...prev])
    return video
  }, [])

  const updateVideo = useCallback((id, data) => {
    setVideos((prev) => prev.map((video) => (video.id === id ? { ...video, ...data } : video)))
  }, [])

  /** Records own their preview object URL, so release it with the record. */
  const releasePreview = (video) => {
    if (video?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(video.previewUrl)
  }

  const removeVideo = useCallback((id) => {
    setVideos((prev) => {
      prev.filter((video) => video.id === id).forEach(releasePreview)
      return prev.filter((video) => video.id !== id)
    })
  }, [])

  const replaceVideos = useCallback((next) => {
    setVideos((prev) => {
      prev.forEach(releasePreview)
      return next
    })
  }, [])

  const clearVideos = useCallback(() => {
    setVideos((prev) => {
      prev.forEach(releasePreview)
      return []
    })
  }, [])

  const value = useMemo(
    () => ({ videos, addVideo, updateVideo, removeVideo, replaceVideos, clearVideos }),
    [videos, addVideo, updateVideo, removeVideo, replaceVideos, clearVideos],
  )

  return <VideoLabContext.Provider value={value}>{children}</VideoLabContext.Provider>
}

export function useVideoLab() {
  const context = useContext(VideoLabContext)
  if (!context) throw new Error('useVideoLab must be used within a VideoLabProvider')
  return context
}
