import { useState, useEffect, useCallback } from "react"
import { getScrapRepos, subscribeScrap, unsubscribeScrap } from "@/lib/api"
import { readApiUrl, readToken } from "@/lib/store"
import type { ScrapRepository } from "@/types"

interface UseScrapState {
  repos: ScrapRepository[]
  loading: boolean
  error: string | null
}

interface UseScrap extends UseScrapState {
  refresh: () => void
  subscribe: (repoId: number) => Promise<void>
  unsubscribe: (repoId: number) => Promise<void>
}

export function useScrap(): UseScrap {
  const [state, setState] = useState<UseScrapState>({
    repos: [],
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const [token, apiUrl] = await Promise.all([readToken(), readApiUrl()])
      if (!token) throw new Error("Token manquant")
      const repos = await getScrapRepos(token, apiUrl)
      setState({ repos, loading: false, error: null })
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Erreur de chargement.",
      }))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function subscribe(repoId: number) {
    const [token, apiUrl] = await Promise.all([readToken(), readApiUrl()])
    if (!token) return
    await subscribeScrap(repoId, token, apiUrl)
    setState((s) => ({
      ...s,
      repos: s.repos.map((r) => (r.id === repoId ? { ...r, is_subscribed: true } : r)),
    }))
  }

  async function unsubscribe(repoId: number) {
    const [token, apiUrl] = await Promise.all([readToken(), readApiUrl()])
    if (!token) return
    await unsubscribeScrap(repoId, token, apiUrl)
    setState((s) => ({
      ...s,
      repos: s.repos.map((r) => (r.id === repoId ? { ...r, is_subscribed: false } : r)),
    }))
  }

  return { ...state, refresh: load, subscribe, unsubscribe }
}
