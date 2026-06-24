// Google Places API (New)로 장소 사진 조회.
// 키워드(장소명) Text Search + 좌표 locationBias → photos[0].name → media URL.
// photoName을 localStorage에 캐시해 재조회를 막는다(이미지 자체는 브라우저 HTTP 캐시).
import { getGoogleKey } from '../config.js'

const LS_KEY = 'iyagiteo.photoCache.v1'

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {}
  } catch {
    return {}
  }
}
let cache = loadCache()
const inflight = {} // placeId -> Promise

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cache))
  } catch {
    /* quota 무시 */
  }
}

export function photoUrlFromName(name, px = 480) {
  const key = getGoogleKey()
  if (!key || !name) return null
  return `https://places.googleapis.com/v1/${name}/media?maxHeightPx=${px}&maxWidthPx=${px}&key=${key}`
}

async function searchPhotoName(place, key) {
  const body = {
    textQuery: `${place.name} 전주`,
    languageCode: 'ko',
    regionCode: 'KR',
    maxResultCount: 1,
  }
  if (place.lat && place.lng) {
    body.locationBias = {
      circle: { center: { latitude: place.lat, longitude: place.lng }, radius: 500 },
    }
  }
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.photos',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`searchText ${res.status}`)
  const data = await res.json()
  return data.places?.[0]?.photos?.[0]?.name || null
}

// 장소의 photoName 반환(없으면 null). 캐시/inflight 디듀프.
export async function resolvePhotoName(place) {
  if (!place) return null
  if (place.id in cache) return cache[place.id] === 'none' ? null : cache[place.id]
  if (inflight[place.id]) return inflight[place.id]
  const key = getGoogleKey()
  if (!key) return null
  inflight[place.id] = (async () => {
    try {
      const name = await searchPhotoName(place, key)
      cache[place.id] = name || 'none'
      persist()
      return name
    } catch {
      return null // 일시 오류는 캐시하지 않음(다음에 재시도)
    } finally {
      delete inflight[place.id]
    }
  })()
  return inflight[place.id]
}
