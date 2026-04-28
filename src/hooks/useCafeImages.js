import { useEffect, useMemo, useState } from 'react'
import { fetchUnsplashCafePhotos } from '../api/unsplash'

const STORAGE_KEY = 'cafefinder.cafeImages.unsplash.v1'

function hashStringToPositiveInt(input) {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function stableShuffle(array, seed) {
  const a = array.slice()
  let x = hashStringToPositiveInt(seed) || 1
  for (let i = a.length - 1; i > 0; i -= 1) {
    x = (x * 1664525 + 1013904223) % 4294967296
    const j = x % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCache(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function useCafeImages(cafes) {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

  const cafeIds = useMemo(() => cafes.map(c => c.id).filter(Boolean), [cafes])
  const cacheKey = useMemo(() => cafeIds.join('|'), [cafeIds])

  const [imageByCafeId, setImageByCafeId] = useState(() => {
    const cached = loadCache()
    if (!cached || cached.cacheKey !== cacheKey) return {}
    return cached.imageByCafeId || {}
  })

  useEffect(() => {
    if (cafeIds.length === 0) return
    if (!accessKey) return

    const cached = loadCache()
    if (cached && cached.cacheKey === cacheKey && cached.imageByCafeId) {
      setImageByCafeId(cached.imageByCafeId)
      return
    }

    const controller = new AbortController()

    fetchUnsplashCafePhotos({
      accessKey,
      perPage: 30,
      pages: Math.ceil(cafeIds.length / 30) + 1,
      signal: controller.signal,
    })
      .then(photos => {
        if (photos.length < cafeIds.length) {
          throw new Error('Not enough unique Unsplash photos to assign one per cafe.')
        }

        const shuffled = stableShuffle(photos, cacheKey)
        const next = {}
        for (let i = 0; i < cafeIds.length; i += 1) {
          next[cafeIds[i]] = shuffled[i].url
        }

        setImageByCafeId(next)
        saveCache({ cacheKey, imageByCafeId: next })
      })
      .catch(() => {
        // If Unsplash fails, keep empty map and let UI fall back.
      })

    return () => controller.abort()
  }, [accessKey, cafeIds, cacheKey])

  return { imageByCafeId, hasUniqueImages: Object.keys(imageByCafeId).length === cafeIds.length }
}

