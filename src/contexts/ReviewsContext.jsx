import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ReviewsContext = createContext(null)
const STORAGE_KEY = 'cafefinder.reviews.v1'

function readInitialReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed === 'object') return parsed
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
      if (!cafe?.id) return
      const safeRating = Number(rating)
      if (!Number.isFinite(safeRating) || safeRating < 1 || safeRating > 5) return

      const trimmedText = (text || '').trim()
      setReviewsByCafeId(prev => ({
        ...prev,
        [cafe.id]: {
          cafeSummary: {
            id: cafe.id,
            osmType: cafe.osmType,
            osmId: cafe.osmId,
            name: cafe.name,
            location: cafe.location,
            image: cafe.image || null,
          },
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

