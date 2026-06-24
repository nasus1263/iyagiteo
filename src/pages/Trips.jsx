import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { interestById } from '../data/interests.js'
import { templateById, TEMPLATES } from '../data/templates.js'
import { placeById } from '../data/places.js'
import { generateRouteDraft } from '../services/claude.js'

export default function Trips() {
  const { state, createTrip, deleteTrip } = useStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState(null) // null | 'prompt' | 'template'
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  const interest = interestById(state.interestId)

  function startEmpty() {
    const id = createTrip({ name: '새 여행', placeIds: [] })
    navigate(`/trips/${id}`)
  }

  async function startPrompt() {
    if (!prompt.trim()) return
    setBusy(true)
    setNote('AI가 동선 초안을 만드는 중…')
    const { placeIds, generatedByAI, error } = await generateRouteDraft({ prompt, interest })
    setBusy(false)
    const id = createTrip({ name: prompt.slice(0, 20) || '새 여행', placeIds })
    if (!generatedByAI) setNote(`AI 호출 실패로 기본 코스 사용: ${error || ''}`)
    navigate(`/trips/${id}`)
  }

  function startTemplate(t) {
    const id = createTrip({
      name: t.name,
      interestId: t.interestId,
      durationMin: t.durationMin,
      placeIds: t.placeIds,
    })
    navigate(`/trips/${id}`)
  }

  return (
    <div className="page">
      <h2 className="page-title">내 여행</h2>

      {state.trips.length === 0 && <p className="page-hint">아직 만든 여행이 없어요.</p>}
      <div className="trip-list">
        {state.trips.map((t) => (
          <div className="trip-card" key={t.id}>
            <div className="trip-icon">{interestById(t.interestId)?.emoji || '🧭'}</div>
            <div onClick={() => navigate(`/trips/${t.id}`)} style={{ flex: 1 }}>
              <h3>{t.name}</h3>
              <p>{t.routePoints.length}개 동선 · {interestById(t.interestId)?.label}</p>
            </div>
            <div className="trip-actions">
              <button className="btn-ghost" onClick={() => navigate(`/play/${t.id}`)}>▶ 시작</button>
              <button className="btn-ghost danger" onClick={() => deleteTrip(t.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      <div className="create-box">
        <h3>새 여행 만들기</h3>
        <div className="create-opts">
          <button className="btn-outline" onClick={startEmpty}>빈 상태로 시작</button>
          <button className="btn-outline" onClick={() => setMode(mode === 'prompt' ? null : 'prompt')}>
            프롬프트로 AI 초안
          </button>
          <button className="btn-outline" onClick={() => setMode(mode === 'template' ? null : 'template')}>
            템플릿 선택
          </button>
        </div>

        {mode === 'prompt' && (
          <div className="create-panel">
            <textarea
              placeholder="예: 가족과 2시간, 사진 찍기 좋은 곳 위주로"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button className="btn-primary" disabled={busy} onClick={startPrompt}>
              {busy ? '생성 중…' : 'AI로 동선 만들기'}
            </button>
            {note && <p className="note">{note}</p>}
          </div>
        )}

        {mode === 'template' && (
          <div className="create-panel">
            {TEMPLATES.map((t) => (
              <div className="tmpl-card" key={t.id} onClick={() => startTemplate(t)}>
                <h4>{t.name}</h4>
                <p>{t.desc}</p>
                <span className="coord">
                  {t.placeIds.map((id) => placeById(id)?.name).join(' → ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
