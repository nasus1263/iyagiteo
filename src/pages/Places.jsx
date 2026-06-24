import { useNavigate } from 'react-router-dom'
import { PLACES } from '../data/places.js'
import { interestById } from '../data/interests.js'
import { useStore } from '../store.jsx'

export default function Places() {
  const { state } = useStore()
  const navigate = useNavigate()
  const interest = interestById(state.interestId)

  return (
    <div className="page">
      <div className="topbar">
        <div className="hi">
          전주 한옥마을
          <small>같은 장소, 당신의 관심사로 다시 듣기</small>
        </div>
        <div className="chips">
          <button className="chip tap" onClick={() => navigate('/onboarding')}>
            {interest ? `${interest.emoji} ${interest.label}` : '관심사 선택'} <span className="chip-edit">✎</span>
          </button>
          <span className="chip muted">⏱ {state.durationMin}분</span>
        </div>
      </div>

      <div className="sec-h"><h3>여행지</h3></div>
      <div className="places">
        {PLACES.map((p) => (
          <div className="place" key={p.id}>
            <div className="thumb">
              <span className="thumb-fallback">🏯</span>
              <img
                src={p.image}
                alt={p.name}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
            <div className="info">
              <div className="nm">{p.name}</div>
              <div className="ds">{p.summary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
