const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'
const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  // Some Overpass instances are picky; a UA reduces 406/blocked responses.
  'User-Agent': 'CafeFinder/1.0 (educational project; contact: none)',
}

function normalizeWikimediaCommonsFile(value) {
  if (!value || typeof value !== 'string') return null
  const v = value.trim()
  if (!v) return null

  // Common OSM formats: "File:Example.jpg" or just "Example.jpg"
  if (v.startsWith('File:')) return v.slice('File:'.length).trim() || null
  if (v.startsWith('Category:')) return null
  if (v.includes('/')) return null
  return v
}

function buildCommonsFileUrl(filename, { width = 800 } = {}) {
  const safeName = encodeURIComponent(filename.replace(/ /g, '_'))
  // Uses a redirect to the actual image CDN path.
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${safeName}?width=${width}`
}

function buildDaneCountyCafeQuery() {
  return `
[out:json][timeout:25];
area["name"="Dane County"]["boundary"="administrative"]["admin_level"="6"]->.searchArea;

(
  node["amenity"="cafe"](area.searchArea);
  way["amenity"="cafe"](area.searchArea);
  relation["amenity"="cafe"](area.searchArea);
);

out center tags;
`
}

function getElementLatLon(el) {
  if (typeof el.lat === 'number' && typeof el.lon === 'number') {
    return { lat: el.lat, lon: el.lon }
  }
  if (el.center && typeof el.center.lat === 'number' && typeof el.center.lon === 'number') {
    return { lat: el.center.lat, lon: el.center.lon }
  }
  return { lat: null, lon: null }
}

function buildLocation(tags) {
  const parts = []
  if (tags['addr:housenumber'] && tags['addr:street']) {
    parts.push(`${tags['addr:housenumber']} ${tags['addr:street']}`)
  } else if (tags['addr:street']) {
    parts.push(tags['addr:street'])
  }

  const city = tags['addr:city']
  const state = tags['addr:state']
  if (city && state) parts.push(`${city}, ${state}`)
  else if (city) parts.push(city)

  return parts.join(' • ') || 'Dane County, WI'
}

function normalizeCafeElement(el) {
  const tags = el.tags ?? {}
  const name = tags.name || 'Unnamed cafe'
  const { lat, lon } = getElementLatLon(el)

  const wikimediaCommonsRaw = tags.wikimedia_commons || null
  const wikimediaCommonsFile = normalizeWikimediaCommonsFile(wikimediaCommonsRaw)
  const wikidata = tags.wikidata || null

  const commonsImageUrl = wikimediaCommonsFile
    ? buildCommonsFileUrl(wikimediaCommonsFile, { width: 800 })
    : null

  return {
    id: `${el.type}/${el.id}`,
    osmType: el.type,
    osmId: String(el.id),
    name,
    location: buildLocation(tags),
    lat,
    lon,
    website: tags.website || tags['contact:website'] || null,
    phone: tags.phone || tags['contact:phone'] || null,
    wheelchair: tags.wheelchair || null,
    outdoorSeating: tags.outdoor_seating || null,
    takeaway: tags.takeaway || null,
    openingHours: tags.opening_hours || null,
    wikidata,
    wikimediaCommons: wikimediaCommonsRaw,
    image: tags.image || commonsImageUrl || null,
    description: tags.description || null,
    tags,
  }
}

async function fetchWikidataP18ImageFilename({ wikidataId, signal } = {}) {
  if (!wikidataId) return null
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(wikidataId)}.json`
  const res = await fetch(url, { signal })
  if (!res.ok) return null
  const data = await res.json()
  const entity = data?.entities?.[wikidataId]
  const claim = entity?.claims?.P18?.[0]
  const filename = claim?.mainsnak?.datavalue?.value
  return typeof filename === 'string' && filename.trim() ? filename.trim() : null
}

export async function fetchDaneCountyCafes({ signal } = {}) {
  const query = buildDaneCountyCafeQuery()

  const res = await fetch(OVERPASS_ENDPOINT, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: 'data=' + encodeURIComponent(query),
    signal,
  })

  if (!res.ok) {
    throw new Error(`Overpass request failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const elements = Array.isArray(data?.elements) ? data.elements : []

  return elements
    .filter(el => el?.tags?.amenity === 'cafe')
    .map(normalizeCafeElement)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchCafeByOsmId({ osmType, osmId, signal } = {}) {
  if (!osmType || !osmId) return null

  const query = `
[out:json][timeout:25];
${osmType}(${osmId});
out center tags;
`

  const res = await fetch(OVERPASS_ENDPOINT, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: 'data=' + encodeURIComponent(query),
    signal,
  })

  if (!res.ok) {
    throw new Error(`Overpass request failed: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const el = Array.isArray(data?.elements) ? data.elements[0] : null
  if (!el) return null

  const cafe = normalizeCafeElement(el)

  // If OSM doesn't provide a direct image/commons image, try Wikidata P18 for the detail page.
  if (!cafe.image && cafe.wikidata) {
    try {
      const filename = await fetchWikidataP18ImageFilename({ wikidataId: cafe.wikidata, signal })
      if (filename) {
        cafe.image = buildCommonsFileUrl(filename, { width: 1200 })
      }
    } catch {
      // ignore
    }
  }

  return cafe
}

