import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRepository } from '../data/repository'
import { keyFor } from '../data/adapters/localAdapter'

/**
 * Hydrates one entity from the repository and exposes CRUD + lifecycle actions.
 * Every action is async, mirroring the repository, so a future HTTP adapter
 * needs no change here or in any context that uses this hook.
 */
export function usePersistedCollection(entity) {
  const repo = useMemo(() => createRepository(entity), [entity])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState({ available: true })
  const [lastError, setLastError] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const hydrate = useCallback(async () => {
    const { records: loaded, meta: loadedMeta } = await repo.list()
    if (!mounted.current) return
    setRecords(loaded)
    setMeta(loadedMeta)
    setLoading(false)
  }, [repo])

  useEffect(() => {
    hydrate()
  }, [hydrate])

  // Another tab writing this entity's key refreshes this one.
  useEffect(() => {
    const key = keyFor(entity)
    const onStorage = (event) => {
      if (event.key === key || event.key === null) hydrate()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [entity, hydrate])

  /** Applies a repository result: commits records, surfaces a failure reason. */
  const commit = useCallback((result) => {
    if (!mounted.current) return result
    if (Array.isArray(result?.records)) setRecords(result.records)
    setLastError(result?.ok === false ? (result.reason ?? 'write-failed') : null)
    return result
  }, [])

  const create = useCallback((values) => repo.create(values).then(commit), [repo, commit])
  const update = useCallback((id, values) => repo.update(id, values).then(commit), [repo, commit])
  const archive = useCallback((id) => repo.archive(id).then(commit), [repo, commit])
  const restore = useCallback((id) => repo.restore(id).then(commit), [repo, commit])
  const purge = useCallback(
    (id, options) => repo.purge(id, options).then(commit),
    [repo, commit],
  )
  const replaceAll = useCallback(
    (next, options) => repo.replaceAll(next, options).then(commit),
    [repo, commit],
  )
  const clear = useCallback((options) => repo.clear(options).then((r) => {
    if (r.ok && mounted.current) setRecords([])
    return r
  }), [repo])

  return {
    records,
    loading,
    meta,
    lastError,
    create,
    update,
    archive,
    restore,
    purge,
    replaceAll,
    clear,
    refresh: hydrate,
  }
}
