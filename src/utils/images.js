function hashStringToPositiveInt(input) {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

const CAFE_FALLBACK_UNSPLASH_PHOTOS = [
  // Public Unsplash image URLs (no API key required).
  'photo-1501339847302-ac426a4a7cbb',
  'photo-1495474472287-4d71bcdd2085',
  'photo-1554118811-1e0d58224f24',
  'photo-1521017432531-fbd92d768814',
  'photo-1529070538774-1843cb3265df',
  'photo-1511920170033-f8396924c348',
  'photo-1481833761820-0509d3217039',
  'photo-1509042239860-f550ce710b93',
  'photo-1442512595331-e89e73853f31',
  'photo-1514933651103-005eec06c04b',
  'photo-1504754524776-8f4f37790ca0',
  'photo-1453614512568-c4024d13c247',
]

function buildUnsplashImageUrl(photoId, { width, height } = {}) {
  const w = width || 800
  const h = height || 600
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`
}

export function getCafeFallbackImageUrl(cafe, { variant = 'card' } = {}) {
  const seed = cafe?.id || cafe?.name || 'cafe'
  const idx = hashStringToPositiveInt(String(seed)) % CAFE_FALLBACK_UNSPLASH_PHOTOS.length
  const photoId = CAFE_FALLBACK_UNSPLASH_PHOTOS[idx]
  if (variant === 'hero') {
    return buildUnsplashImageUrl(photoId, { width: 1600, height: 900 })
  }

  return buildUnsplashImageUrl(photoId, { width: 800, height: 600 })
}

