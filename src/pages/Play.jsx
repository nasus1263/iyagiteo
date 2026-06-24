import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { placeById } from '../data/places.js'
import { interestById } from '../data/interests.js'
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
    return <div className="page"><p>여행을 찾을 수 없습니다.</p></div>
  }

  const point = trip.routePoints[active]
  const place = point ? placeById(point.placeId) : null
  const interest = interestById(trip.interestId)
  const near = current && place && distanceM(current, place) <= STAMP_RADIUS_M

  function onPlay() {
    if (!point?.story) return
    if (!ttsSupported()) {
      setMsg('이 브라우저는 음성 합성을 지원하지 않습니다.')
      return
    }
    setPlaying(true)
    setMsg('')
    speak(point.story.text, {
      onEnd: () => {
        setPlaying(false)
        if (near) {
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
        <button className="pl-back over" onClick={() => navigate('/trips')}>←</button>
        {near && <span className="arrived-tag over-r">도착</span>}
        <KakaoMap points={mapPoints} current={current} activeIndex={active} height="100%" />
      </div>

      <div className="play-bottom">
        <div className="pl-hero">
          <div className="where">{interest?.emoji} {interest?.label}의 관점</div>
          <h2 className="serif">{place?.name}{stamped && ' 🏅'}</h2>
        </div>

        <div className="pl-tabs">
          {trip.routePoints.map((p, i) => {
            const pl = placeById(p.placeId)
            return (
              <button
                key={p.id}
                className={`ptab ${i === active ? 'on' : ''}`}
                onClick={() => { onStop(); setActive(i); setMsg('') }}
              >
                {i + 1}. {pl.name}
                {state.stamps[p.placeId]?.storyPlayed && ' 🏅'}
              </button>
            )
          })}
        </div>

        <div className="player-scroll">
          {place && (
            <div className="player-card">
              {point.story && (
                <span className="verified">
                  ✓ {point.story.generatedByAI ? 'AI 생성 · 사료 기반' : '사료 기반'}
                </span>
              )}
              <img
                src={point.story?.visuals?.[0] || place.image}
                alt={place.name}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div className="script">{point.story?.text || '아직 이야기가 없습니다.'}</div>

              <div className="pctrl">
                <button className="sm" onClick={simHere}>📍</button>
                {!playing ? (
                  <button className="playbtn" onClick={onPlay} disabled={!point.story}>▶</button>
                ) : (
                  <button className="playbtn" onClick={onStop}>⏹</button>
                )}
                <span className="sm dist-t">
                  {current && place ? `${Math.round(distanceM(current, place))}m` : '…'}
                </span>
              </div>
              <div className="tts-hint">▶ 재생을 누르면 기기 음성으로 이야기를 읽어드려요</div>
              {msg && <p className="note center">{msg}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
