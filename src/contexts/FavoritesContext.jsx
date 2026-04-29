import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const FavoritesContext = createContext(null)
const STORAGE_KEY = 'cafefinder.favorites.v1'

function normalizeCafeSummary(cafe) {
  if (!cafe || typeof cafe !== 'object') return null
  const id = cafe.id ? String(cafe.id) : null
  if (!id) return null

  let osmType = cafe.osmType || null
  let osmId = cafe.osmId || null

  if ((!osmType || !osmId) && id.includes('/')) {
    const [typeFromId, idFromValue] = id.split('/')
    osmType = osmType || typeFromId || null
    osmId = osmId || idFromValue || null
  }

  return {
    id,
    osmType,
    osmId: osmId ? String(osmId) : null,
    name: cafe.name || 'Unnamed cafe',
    location: cafe.location || 'Dane County, WI',
    image: cafe.image || null,
  }
}

function readInitialFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === 'object') {
      const normalized = {}
      for (const [key, value] of Object.entries(parsed)) {
        const summary = normalizeCafeSummary(value)
        if (summary?.id) {
          normalized[summary.id] = summary
        } else if (key && typeof key === 'string' && value && typeof value === 'object') {
          const fallback = normalizeCafeSummary({ ...value, id: key })
          if (fallback?.id) normalized[fallback.id] = fallback
        }
      }
      return normalized
    }
  } catch {
    // ignore
  }
  return {}
}

export function FavoritesProvider({ children }) {
  const [favoritesById, setFavoritesById] = useState(readInitialFavorites)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesById))
  }, [favoritesById])

  const value = useMemo(() => {
    const ids = Object.keys(favoritesById)

    const isFavorited = (id) => Boolean(id && favoritesById[id])

    const addFavorite = (cafe) => {
      const summary = normalizeCafeSummary(cafe)
      if (!summary?.id) return
      setFavoritesById(prev => ({ ...prev, [summary.id]: summary }))
    }

    const removeFavorite = (id) => {
      if (!id) return
      setFavoritesById(prev => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }

    const toggleFavorite = (cafe) => {
      const summary = normalizeCafeSummary(cafe)
      if (!summary?.id) return
      setFavoritesById(prev => {
        if (prev[summary.id]) {
          const next = { ...prev }
          delete next[summary.id]
          return next
        }
        return { ...prev, [summary.id]: summary }
      })
    }

    const favorites = ids.map(id => favoritesById[id])

    return {
      favoritesById,
      favorites,
      favoriteCount: ids.length,
      isFavorited,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    }
  }, [favoritesById])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

