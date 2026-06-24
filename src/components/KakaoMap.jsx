// Kakao Map (기획 결정값). 동선 마커 + 경로선 + 현위치 표시.
// JS 키가 없으면 안내 메시지를 보여준다.
import { useEffect, useRef, useState } from 'react'
import { getKakaoKey, JEONJU_CENTER } from '../config.js'

let sdkPromise = null
function loadSdk(key) {
  if (window.kakao && window.kakao.maps) return Promise.resolve()
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
    s.onload = () => window.kakao.maps.load(resolve)
    s.onerror = () => reject(new Error('Kakao SDK 로드 실패'))
    document.head.appendChild(s)
  })
  return sdkPromise
}

export default function KakaoMap({ points = [], current = null, activeIndex = -1, height = '100%' }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const overlaysRef = useRef([])
  const [error, setError] = useState('')

  const key = getKakaoKey()

  useEffect(() => {
    if (!key) {
      setError('Kakao 지도 키가 없습니다. 설정에서 입력하세요.')
      return
    }
    let cancelled = false
    loadSdk(key)
      .then(() => {
        if (cancelled || !ref.current) return
        const kakao = window.kakao
        mapRef.current = new kakao.maps.Map(ref.current, {
          center: new kakao.maps.LatLng(JEONJU_CENTER.lat, JEONJU_CENTER.lng),
          level: 4,
        })
        draw()
      })
      .catch((e) => setError(e.message))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // points/current 변경 시 다시 그림
  useEffect(() => {
    if (mapRef.current) draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points), JSON.stringify(current), activeIndex])

  function draw() {
    const kakao = window.kakao
    const map = mapRef.current
    if (!kakao || !map) return

    // 기존 오버레이 제거
    overlaysRef.current.forEach((o) => o.setMap(null))
    overlaysRef.current = []

    const bounds = new kakao.maps.LatLngBounds()
    const path = []

    points.forEach((p, i) => {
      const pos = new kakao.maps.LatLng(p.lat, p.lng)
      path.push(pos)
      bounds.extend(pos)
      const marker = new kakao.maps.Marker({ position: pos, map })
      overlaysRef.current.push(marker)
      const label = new kakao.maps.CustomOverlay({
        position: pos,
        yAnchor: 2.2,
        content: `<div class="map-pin ${i === activeIndex ? 'active' : ''}">${i + 1}. ${p.name}</div>`,
      })
      label.setMap(map)
      overlaysRef.current.push(label)
    })

    if (path.length > 1) {
      const line = new kakao.maps.Polyline({
        path,
        strokeWeight: 4,
        strokeColor: '#c2603f',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
        map,
      })
      overlaysRef.current.push(line)
    }

    if (current) {
      const cpos = new kakao.maps.LatLng(current.lat, current.lng)
      bounds.extend(cpos)
      const dot = new kakao.maps.CustomOverlay({
        position: cpos,
        content: '<div class="map-me">현위치</div>',
      })
      dot.setMap(map)
      overlaysRef.current.push(dot)
    }

    if (points.length > 0 || current) map.setBounds(bounds)
  }

  if (error) {
    return (
      <div className="map-fallback" style={{ height }}>
        🗺️ {error}
      </div>
    )
  }
  return <div ref={ref} style={{ width: '100%', height }} />
}
