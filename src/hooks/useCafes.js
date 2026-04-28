import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchDaneCountyCafes } from '../api/overpass'

const SESSION_CACHE_KEY = 'cafefinder.overpass.danecounty.v1'

export function useCafes() {
  const [cafes, setCafes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) {
          setCafes(parsed)
          setLoading(false)
          return
        }
      } catch {
        // ignore cache parse issues
      }
    }

    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    fetchDaneCountyCafes({ signal: controller.signal })
      .then(list => {
        setCafes(list)
        sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(list))
      })
      .catch(err => {
        if (err?.name === 'AbortError') return
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const byId = useMemo(() => {
    const map = new Map()
    for (const cafe of cafes) map.set(cafe.id, cafe)
    return map
  }, [cafes])

  return { cafes, byId, loading, error }
}

