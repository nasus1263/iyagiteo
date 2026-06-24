import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { placeById } from '../data/places.js'
import { interestById } from '../data/interests.js'
import { STAMP_RADIUS_M } from '../config.js'
import { distanceM, watchPosition } from '../services/geo.js'
import { speak, stopSpeak, ttsSupported } from '../services/tts.js'
import KakaoMap from '../components/KakaoMap.jsx'
import PlacePhoto from '../components/PlacePhoto.jsx'

const WAVE_BARS = 28
const fmt = (sec) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
const estSec = (text) => Math.max(8, Math.round((text?.length || 0) * 0.18))
const clamp = (v) => Math.max(0, Math.min(100, v))

export default function Play() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { state, acquireStamp } = useStore()
  const trip = state.trips.find((t) => t.id === tripId)

  const [active, setActive] = useState(0)
  const [current, setCurrent] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0~100
  const [msg, setMsg] = useState('')
  const timerRef = useRef(null)
  const waveRef = useRef(null)
  const seekingRef = useRef(false)
  const wasPlayingRef = useRef(false)

  useEffect(() => {
    const stop = watchPosition(
      (pos) => setCurrent(pos),
      () => setMsg('위치 권한이 없어 스탬프 거리 판정이 제한됩니다.')
    )
    return () => {
      stop()
      stopSpeak()
      clearInterval(timerRef.current)
    }
  }, [])

  if (!trip) {
    return <div className="page"><p>여행을 찾을 수 없습니다.</p></div>
  }

  const point = trip.routePoints[active]
  const place = point ? placeById(point.placeId) : null
  const interest = interestById(trip.interestId)
  const near = current && place && distanceM(current, place) <= STAMP_RADIUS_M
  const text = point?.story?.text || ''
  const totalSec = estSec(text)
  const stamped = state.stamps[place?.id]?.storyPlayed

  function clearTimer() {
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  function finish() {
    clearTimer()
    setPlaying(false)
    setProgress(100)
    if (near) {
      acquireStamp(place.id, { storyPlayed: true })
      setMsg(`🏅 ${place.name} 스탬프 획득!`)
    } else {
      setMsg('재생 완료. (스탬프는 해당 지역 100m 안에서 들어야 획득돼요)')
    }
  }

  // fromPct 지점부터 재생 (TTS는 해당 지점 이후 텍스트를 다시 읽음)
  function play(fromPct) {
    if (!point?.story) return
    const start = clamp(fromPct)
    setMsg('')
    setPlaying(true)
    setProgress(start)

    const useTTS = ttsSupported()
    const durMs = useTTS ? Math.max(6000, text.length * 180) : Math.max(3500, text.length * 120)
    const cap = useTTS ? 96 : 100
    const step = 90
    const inc = 100 / (durMs / step)

    clearTimer()
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + inc, cap)
        if (next >= cap && !useTTS) {
          clearTimer()
          finish()
        }
        return next
      })
    }, step)

    if (useTTS) {
      const offset = Math.floor((start / 100) * text.length)
      speak(text.slice(offset), {
        onEnd: () => finish(),
        onError: () => { clearTimer(); setPlaying(false); setMsg('재생 중 오류가 발생했습니다.') },
      })
    }
  }

  function pause() {
    stopSpeak()
    clearTimer()
    setPlaying(false)
  }

  function toggle() {
    if (playing) pause()
    else play(progress >= 100 ? 0 : progress)
  }

  function goPoint(i) {
    if (i < 0 || i >= trip.routePoints.length) return
    pause()
    setActive(i)
    setProgress(0)
    setMsg('')
  }

  // ---- seek (클릭/드래그) ----
  function pctFromEvent(e) {
    const el = waveRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return clamp(((e.clientX - rect.left) / rect.width) * 100)
  }
  function onSeekDown(e) {
    if (!point?.story) return
    e.currentTarget.setPointerCapture(e.pointerId)
    seekingRef.current = true
    wasPlayingRef.current = playing
    pause()
    setProgress(pctFromEvent(e))
  }
  function onSeekMove(e) {
    if (seekingRef.current) setProgress(pctFromEvent(e))
  }
  function onSeekUp(e) {
    if (!seekingRef.current) return
    seekingRef.current = false
    const p = pctFromEvent(e)
    setProgress(p)
    if (wasPlayingRef.current && p < 100) play(p)
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

  return (
    <div className="play">
      <div className="play-top">
        <button className="pl-back over" onClick={() => navigate('/trips')}>‹</button>
        {near && <span className="arrived-tag over-r">도착했어요</span>}
        <KakaoMap points={mapPoints} current={current} activeIndex={active} height="100%" />
      </div>

      <div className="play-bottom">
        <div className="player-scroll">
          <div className="pl-hero">
            <div className="where">{interest?.emoji} {interest?.label}의 관점 · 전주 한옥마을</div>
            <h2 className="serif">{place?.name}{stamped && ' 🏅'}</h2>
          </div>

          <div className="pl-tabs">
            {trip.routePoints.map((p, i) => {
              const pl = placeById(p.placeId)
              return (
                <button
                  key={p.id}
                  className={`ptab ${i === active ? 'on' : ''}`}
                  onClick={() => goPoint(i)}
                >
                  {i + 1}. {pl.name}
                  {state.stamps[p.placeId]?.storyPlayed && ' 🏅'}
                </button>
              )
            })}
          </div>

          {place && (
            <>
              <div className="player">
                <PlacePhoto place={place} px={720} className="pl-photo" emojiClassName="pl-photo-emoji" />
                <span className="verified">
                  ✓ {point.story?.generatedByAI ? 'AI 생성 · 자료 기반' : '자료 기반'}
                </span>
                <div className="st-title serif">{place.name}</div>

                <div
                  className="wave"
                  ref={waveRef}
                  onPointerDown={onSeekDown}
                  onPointerMove={onSeekMove}
                  onPointerUp={onSeekUp}
                  onPointerCancel={onSeekUp}
                  role="slider"
                  aria-label="재생 위치"
                  aria-valuenow={Math.round(progress)}
                >
                  {Array.from({ length: WAVE_BARS }).map((_, i) => {
                    const on = (i / WAVE_BARS) * 100 <= progress
                    const h = 30 + Math.abs(Math.sin(i * 1.3)) * 60
                    return <i key={i} className={on ? 'on' : ''} style={{ height: `${h}%` }} />
                  })}
                </div>
                <div className="ptime">
                  <span>{fmt((progress / 100) * totalSec)}</span>
                  <span>{fmt(totalSec)}</span>
                </div>

                <div className="pctrl">
                  <button className="sm" onClick={() => goPoint(active - 1)} disabled={active === 0}>⏮</button>
                  <button className="playbtn" onClick={toggle} disabled={!point.story}>
                    {playing ? '❚❚' : '▶'}
                  </button>
                  <button className="sm" onClick={() => goPoint(active + 1)} disabled={active === trip.routePoints.length - 1}>⏭</button>
                </div>
                <div className="tts-hint">파형을 누르거나 끌어 재생 위치를 바꿀 수 있어요</div>
              </div>

              <div className="script">{text || '아직 이야기가 없습니다.'}</div>

              <div className="pl-foot">
                <span className="dist-t">
                  {current ? `현위치까지 ${Math.round(distanceM(current, place))}m` : '위치 확인 중'}
                </span>
                <button className="btn ghost sm-btn" onClick={simHere}>📍 여기로(시뮬)</button>
              </div>
              {msg && <p className="note center">{msg}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
