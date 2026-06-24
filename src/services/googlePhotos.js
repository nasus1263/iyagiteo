// 장소 사진: Google Maps JavaScript API의 Places 라이브러리(신버전 Place.searchByText) 사용.
// REST(places.googleapis.com)는 브라우저에서 CORS로 막히므로 JS SDK로 조회한다.
// 키워드(장소명) + 좌표 locationBias로 검색 → 첫 결과의 photos[0].getURI() URL을 캐시.
import { getGoogleKey } from '../config.js'

const LS_KEY = 'iyagiteo.photoUrlCache.v1'
const PX = 800

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

let sdkPromise = null
function loadPlacesLib(key) {
  if (window.google?.maps?.importLibrary) return window.google.maps.importLibrary('places')
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&v=weekly&loading=async`
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Google Maps JS 로드 실패'))
    document.head.appendChild(s)
  }).then(() => window.google.maps.importLibrary('places'))
  return sdkPromise
}

async function searchPhotoUrl(place, key) {
  const { Place } = await loadPlacesLib(key)
  const req = {
    textQuery: `${place.name} 전주`,
    fields: ['photos'],
    language: 'ko',
    region: 'KR',
    maxResultCount: 1,
  }
  if (place.lat && place.lng) {
    req.locationBias = { center: { lat: place.lat, lng: place.lng }, radius: 600 }
  }
  const { places } = await Place.searchByText(req)
  const photo = places?.[0]?.photos?.[0]
  return photo ? photo.getURI({ maxWidth: PX, maxHeight: PX }) : null
}

// 장소 사진 URL 반환(없으면 null). 캐시/inflight 디듀프.
export async function resolvePhotoUrl(place) {
  if (!place) return null
  if (place.id in cache) return cache[place.id] === 'none' ? null : cache[place.id]
  if (inflight[place.id]) return inflight[place.id]
  const key = getGoogleKey()
  if (!key) return null
  inflight[place.id] = (async () => {
    try {
      const url = await searchPhotoUrl(place, key)
      cache[place.id] = url || 'none'
      persist()
      return url
    } catch {
      return null // 일시 오류는 캐시하지 않음(다음에 재시도)
    } finally {
      delete inflight[place.id]
    }
  })()
  return inflight[place.id]
}
