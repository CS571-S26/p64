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
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === 'object' && parsed.byCafeId && typeof parsed.byCafeId === 'object') {
      return parsed.byCafeId
    }
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveCache(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ byCafeId: value }))
  } catch {
    // ignore
  }
}

export function useCafeImages(cafes) {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

  const cafeIds = useMemo(() => cafes.map(c => c.id).filter(Boolean), [cafes])
  const [allImagesByCafeId, setAllImagesByCafeId] = useState(() => loadCache())

  useEffect(() => {
    if (cafeIds.length === 0) return
    if (!accessKey) return

    const missingCafeIds = cafeIds.filter(id => !allImagesByCafeId[id])
    if (missingCafeIds.length === 0) {
      return
    }

    const controller = new AbortController()

    fetchUnsplashCafePhotos({
      accessKey,
      perPage: 30,
      pages: Math.ceil(missingCafeIds.length / 30) + 1,
      signal: controller.signal,
    })
      .then(photos => {
        if (photos.length < missingCafeIds.length) {
          throw new Error('Not enough unique Unsplash photos to assign one per cafe.')
        }

        const shuffled = stableShuffle(photos, missingCafeIds.join('|'))
        const next = { ...allImagesByCafeId }
        for (let i = 0; i < missingCafeIds.length; i += 1) {
          next[missingCafeIds[i]] = shuffled[i].url
        }

        setAllImagesByCafeId(next)
        saveCache(next)
      })
      .catch(() => {
        // If Unsplash fails, keep empty map and let UI fall back.
      })

    return () => controller.abort()
  }, [accessKey, cafeIds, allImagesByCafeId])

  const imageByCafeId = useMemo(() => {
    const scoped = {}
    for (const id of cafeIds) {
      if (allImagesByCafeId[id]) scoped[id] = allImagesByCafeId[id]
    }
    return scoped
  }, [cafeIds, allImagesByCafeId])

  return { imageByCafeId, hasUniqueImages: Object.keys(imageByCafeId).length === cafeIds.length }
}

