// 두 좌표 사이 거리(m). 스탬프/도착 판정에 사용.
export function distanceM(a, b) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// 현위치 1회 조회 (Promise). 실패 시 reject.
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('이 브라우저는 위치 기능을 지원하지 않습니다.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

// 현위치 지속 추적. 콜백에 {lat,lng} 전달. 반환값으로 해제 함수.
export function watchPosition(onUpdate, onError) {
  if (!('geolocation' in navigator)) {
    onError && onError(new Error('위치 기능 미지원'))
    return () => {}
  }
  const id = navigator.geolocation.watchPosition(
    (pos) => onUpdate({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    (err) => onError && onError(err),
    { enableHighAccuracy: true, maximumAge: 5000 }
  )
  return () => navigator.geolocation.clearWatch(id)
}
