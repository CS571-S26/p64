import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ReviewsContext = createContext(null)
const STORAGE_KEY = 'cafefinder.reviews.v1'

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

function readInitialReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === 'object') {
      const normalized = {}
      for (const [cafeId, value] of Object.entries(parsed)) {
        if (!value || typeof value !== 'object') continue
        const cafeSummary = normalizeCafeSummary(value.cafeSummary || { id: cafeId })
        if (!cafeSummary?.id) continue
        const rating = Number(value.rating)
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) continue
        normalized[cafeSummary.id] = {
          cafeSummary,
          rating,
          text: typeof value.text === 'string' ? value.text : '',
          updatedAt: value.updatedAt || new Date().toISOString(),
        }
      }
      return normalized
    }
  } catch {
    // ignore parse/storage errors
  }
  return {}
}

export function ReviewsProvider({ children }) {
  const [reviewsByCafeId, setReviewsByCafeId] = useState(readInitialReviews)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsByCafeId))
  }, [reviewsByCafeId])

  const value = useMemo(() => {
    const reviewedCafeIds = Object.keys(reviewsByCafeId)

    const getReview = (cafeId) => (cafeId ? reviewsByCafeId[cafeId] || null : null)

    const upsertReview = ({ cafe, rating, text }) => {
      const cafeSummary = normalizeCafeSummary(cafe)
      if (!cafeSummary?.id) return
      const safeRating = Number(rating)
      if (!Number.isFinite(safeRating) || safeRating < 1 || safeRating > 5) return

      const trimmedText = (text || '').trim()
      setReviewsByCafeId(prev => ({
        ...prev,
        [cafeSummary.id]: {
          cafeSummary,
          rating: safeRating,
          text: trimmedText,
          updatedAt: new Date().toISOString(),
        },
      }))
    }

    const removeReview = (cafeId) => {
      if (!cafeId) return
      setReviewsByCafeId(prev => {
        const next = { ...prev }
        delete next[cafeId]
        return next
      })
    }

    const reviewedCafes = reviewedCafeIds
      .map(id => reviewsByCafeId[id])
      .filter(Boolean)
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))

    return {
      reviewsByCafeId,
      reviewedCafeIds,
      reviewCount: reviewedCafeIds.length,
      reviewedCafes,
      getReview,
      upsertReview,
      removeReview,
    }
  }, [reviewsByCafeId])

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider')
  return ctx
}

