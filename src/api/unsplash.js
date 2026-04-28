const UNSPLASH_API = 'https://api.unsplash.com'

const SEARCH_TERMS = ['cafe', 'coffee', 'lattes', 'coffee art', 'latte art', 'coffee shop']

function sleep(ms, { signal } = {}) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms)

    if (!signal) return

    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(t)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true }
    )
  })
}

export async function fetchUnsplashCafePhotos({
  accessKey,
  perPage = 30,
  pages = 3,
  minDelayMs = 250,
  signal,
} = {}) {
  if (!accessKey) {
    throw new Error('Missing Unsplash access key (VITE_UNSPLASH_ACCESS_KEY).')
  }

  const photos = []
  const seen = new Set()

  for (const term of SEARCH_TERMS) {
    for (let page = 1; page <= pages; page += 1) {
      if (photos.length > 0) {
        await sleep(minDelayMs, { signal })
      }

      const url = new URL(`${UNSPLASH_API}/search/photos`)
      url.searchParams.set('query', term)
      url.searchParams.set('orientation', 'landscape')
      url.searchParams.set('per_page', String(perPage))
      url.searchParams.set('page', String(page))

      const res = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        signal,
      })

      if (!res.ok) {
        throw new Error(`Unsplash request failed: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      const results = Array.isArray(data?.results) ? data.results : []

      for (const r of results) {
        const id = r?.id
        const regular = r?.urls?.regular

        if (!id || !regular) continue
        if (seen.has(id)) continue

        seen.add(id)
        photos.push({
          id,
          url: regular,
          user: r?.user?.name || null,
          link: r?.links?.html || null,
          searchTerm: term,
        })
      }
    }
  }

  return photos
}

