import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { placeById } from '../data/places.js'
import { STAMP_RADIUS_M } from '../config.js'
import { distanceM, watchPosition } from '../services/geo.js'
import { speak, stopSpeak, ttsSupported } from '../services/tts.js'
import KakaoMap from '../components/KakaoMap.jsx'

export default function Play() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { state, acquireStamp } = useStore()
  const trip = state.trips.find((t) => t.id === tripId)

  const [active, setActive] = useState(0)
  const [current, setCurrent] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [msg, setMsg] = useState('')
  const stopRef = useRef(null)

  useEffect(() => {
    const stop = watchPosition(
      (pos) => setCurrent(pos),
      () => setMsg('위치 권한이 없어 스탬프 거리 판정이 제한됩니다.')
    )
    return () => {
      stop()
      stopSpeak()
    }
  }, [])

  if (!trip) {
    return (
      <div className="play">
        <p style={{ padding: 20 }}>여행을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const point = trip.routePoints[active]
  const place = point ? placeById(point.placeId) : null

  function nearActive() {
    if (!current || !place) return false
    return distanceM(current, place) <= STAMP_RADIUS_M
  }

  function onPlay() {
    if (!point?.story) return
    if (!ttsSupported()) {
      setMsg('이 브라우저는 음성 합성을 지원하지 않습니다.')
      return
    }
    setPlaying(true)
    setMsg('')
    stopRef.current = speak(point.story.text, {
      onEnd: () => {
        setPlaying(false)
        // 스탬프 획득 조건: 해당 지역(100m)에서 TTS 재생 완료
        if (nearActive()) {
          acquireStamp(place.id, { storyPlayed: true })
          setMsg(`🏅 ${place.name} 스탬프 획득!`)
        } else {
          setMsg('재생 완료. (스탬프는 해당 지역 100m 안에서 들어야 획득돼요)')
        }
      },
      onError: () => {
        setPlaying(false)
        setMsg('재생 중 오류가 발생했습니다.')
      },
    })
  }

  function onStop() {
    stopSpeak()
    setPlaying(false)
  }

  // 데모용: 현위치를 활성 지점으로 이동(시뮬레이션)
  function simHere() {
    if (place) {
      setCurrent({ lat: place.lat, lng: place.lng })
      setMsg('현위치를 이 지점으로 설정(시뮬레이션).')
    }
  }

  const mapPoints = trip.routePoints.map((p) => {
    const pl = placeById(p.placeId)
    return { lat: pl.lat, lng: pl.lng, name: pl.name }
  })

  const stamped = state.stamps[place?.id]?.storyPlayed

  return (
    <div className="play">
      <div className="play-top">
        <button className="btn-back over" onClick={() => navigate('/trips')}>← 종료</button>
        <KakaoMap points={mapPoints} current={current} activeIndex={active} height="100%" />
      </div>

      <div className="play-bottom">
        <div className="play-tabs">
          {trip.routePoints.map((p, i) => {
            const pl = placeById(p.placeId)
            return (
              <button
                key={p.id}
                className={`play-tab ${i === active ? 'sel' : ''}`}
                onClick={() => {
                  onStop()
                  setActive(i)
                  setMsg('')
                }}
              >
                {i + 1}. {pl.name}
                {state.stamps[p.placeId]?.storyPlayed && ' 🏅'}
              </button>
            )
          })}
        </div>

        {place && (
          <div className="play-story">
            <img
              src={point.story?.visuals?.[0] || place.image}
              alt={place.name}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <h3>
              {place.name} {stamped && <span className="badge">획득</span>}
            </h3>
            <p className="story-text">{point.story?.text || '아직 이야기가 없습니다.'}</p>

            <div className="play-controls">
              {!playing ? (
                <button className="btn-primary" onClick={onPlay} disabled={!point.story}>
                  ▶ 음성 재생
                </button>
              ) : (
                <button className="btn-outline" onClick={onStop}>⏹ 정지</button>
              )}
              <button className="btn-ghost" onClick={simHere}>📍 여기로(시뮬)</button>
              <span className="dist">
                {current && place ? `${Math.round(distanceM(current, place))}m` : '위치 확인 중'}
              </span>
            </div>
            {msg && <p className="note">{msg}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
