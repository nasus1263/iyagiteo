import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { PLACES, placeById } from '../data/places.js'
import { interestById } from '../data/interests.js'
import { generateStory } from '../services/claude.js'
import KakaoMap from '../components/KakaoMap.jsx'
import PlacePhoto from '../components/PlacePhoto.jsx'

export default function TripEdit() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { state, addPoint, removePoint, setStory } = useStore()
  const trip = state.trips.find((t) => t.id === tripId)
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  if (!trip) return <div className="page"><p>여행을 찾을 수 없습니다.</p></div>

  const interest = interestById(trip.interestId)
  const mapPoints = trip.routePoints.map((p) => {
    const pl = placeById(p.placeId)
    return { lat: pl.lat, lng: pl.lng, name: pl.name }
  })
  const usedIds = new Set(trip.routePoints.map((p) => p.placeId))
  // 장소 추가는 관광지 카테고리로 한정(목록이 197곳이라 과다)
  const available = PLACES.filter((p) => p.category === '관광지' && !usedIds.has(p.id))

  async function generateAll() {
    if (trip.routePoints.length === 0) return
    setBusy(true)
    let aiCount = 0
    for (const point of trip.routePoints) {
      const place = placeById(point.placeId)
      setNote(`${place.name} 이야기 생성 중…`)
      const story = await generateStory({ place, interest, extraPrompt: prompt })
      if (story.generatedByAI) aiCount++
      setStory(trip.id, point.id, {
        text: story.text,
        visuals: [],
        generatedByAI: story.generatedByAI,
      })
    }
    setBusy(false)
    setNote(`완료 (AI 생성 ${aiCount}/${trip.routePoints.length}). 나머지는 자료 기반 폴백.`)
  }

  const allHaveStory = trip.routePoints.length > 0 && trip.routePoints.every((p) => p.story)

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/trips')}>← 여행 목록</button>
      <h2 className="page-title">{trip.name}</h2>
      <p className="page-hint">관심사 {interest?.emoji} {interest?.label} · {trip.durationMin}분</p>

      <div className="edit-map">
        <KakaoMap points={mapPoints} height="220px" />
      </div>

      <h3>동선 ({trip.routePoints.length})</h3>
      {trip.routePoints.length === 0 && <p className="page-hint">아래에서 장소를 추가하세요.</p>}
      <ol className="point-list">
        {trip.routePoints.map((p) => {
          const pl = placeById(p.placeId)
          return (
            <li key={p.id}>
              <div className="pt-thumb"><PlacePhoto place={pl} px={96} className="thumb-img" /></div>
              <div className="pt-info">
                <b>{pl.name}</b>
                {p.story && <span className="badge">{p.story.generatedByAI ? 'AI' : '자료'} 이야기</span>}
              </div>
              <button className="btn-ghost danger" onClick={() => removePoint(trip.id, p.id)}>제거</button>
            </li>
          )
        })}
      </ol>

      {available.length > 0 && (
        <>
          <h3>장소 추가</h3>
          <div className="chip-row wrap">
            {available.map((p) => (
              <button key={p.id} className="chip" onClick={() => addPoint(trip.id, p.id)}>
                + {p.name}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="create-box">
        <h3>AI 이야기 생성</h3>
        <p className="page-hint">동선이 완성되면 위치별 해설 대본을 생성합니다 (Claude Haiku).</p>
        <textarea
          placeholder="이야기 톤/요청 (선택). 예: 아이도 이해하기 쉽게"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className="btn-primary" disabled={busy || trip.routePoints.length === 0} onClick={generateAll}>
          {busy ? '생성 중…' : '이야기 생성'}
        </button>
        {note && <p className="note">{note}</p>}
      </div>

      <button
        className="btn-primary big"
        disabled={!allHaveStory}
        onClick={() => navigate(`/play/${trip.id}`)}
      >
        ▶ 여행 시작 (Play)
      </button>
      {!allHaveStory && trip.routePoints.length > 0 && (
        <p className="page-hint center">모든 동선의 이야기를 생성하면 시작할 수 있어요.</p>
      )}
    </div>
  )
}
