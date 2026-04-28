import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const FavoritesContext = createContext(null)
const STORAGE_KEY = 'cafefinder.favorites.v1'

function readInitialFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === 'object') return parsed
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
      if (!cafe?.id) return
      const summary = {
        id: cafe.id,
        osmType: cafe.osmType,
        osmId: cafe.osmId,
        name: cafe.name,
        location: cafe.location,
        image: cafe.image || null,
      }
      setFavoritesById(prev => ({ ...prev, [cafe.id]: summary }))
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
      if (!cafe?.id) return
      setFavoritesById(prev => {
        if (prev[cafe.id]) {
          const next = { ...prev }
          delete next[cafe.id]
          return next
        }
        const summary = {
          id: cafe.id,
          osmType: cafe.osmType,
          osmId: cafe.osmId,
          name: cafe.name,
          location: cafe.location,
          image: cafe.image || null,
        }
        return { ...prev, [cafe.id]: summary }
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

