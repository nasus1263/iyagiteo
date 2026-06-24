import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLACES, CATEGORIES, categoryEmoji } from '../data/places.js'
import { interestById } from '../data/interests.js'
import { useStore } from '../store.jsx'

// 값 안의 <br>/줄바꿈을 보존해 표시
function fieldText(v) {
  return String(v).replace(/<br\s*\/?>/gi, '\n')
}

export default function Places() {
  const { state } = useStore()
  const navigate = useNavigate()
  const interest = interestById(state.interestId)
  const [open, setOpen] = useState(null)

  return (
    <div className="page">
      <div className="topbar">
        <div className="hi">
          전주 여행지
          <small>같은 장소, 당신의 관심사로 다시 듣기</small>
        </div>
        <div className="chips">
          <button className="chip tap" onClick={() => navigate('/onboarding')}>
            {interest ? `${interest.emoji} ${interest.label}` : '관심사 선택'} <span className="chip-edit">✎</span>
          </button>
          <span className="chip muted">⏱ {state.durationMin}분</span>
        </div>
      </div>

      {CATEGORIES.map((cat) => {
        const items = PLACES.filter((p) => p.category === cat)
        return (
          <section key={cat}>
            <div className="sec-h">
              <h3>{categoryEmoji(cat)} {cat} <span className="cnt">{items.length}</span></h3>
            </div>
            <div className="places">
              {items.map((p) => {
                const expanded = open === p.id
                return (
                  <div className="place-wrap" key={p.id}>
                    <button className={`place ${expanded ? 'open' : ''}`} onClick={() => setOpen(expanded ? null : p.id)}>
                      <div className="thumb"><span className="thumb-fallback">{categoryEmoji(p.category)}</span></div>
                      <div className="info">
                        <div className="nm">{p.name}</div>
                        <div className="ds">{p.summary}</div>
                      </div>
                      <span className="chev">{expanded ? '▾' : '▸'}</span>
                    </button>
                    {expanded && (
                      <dl className="place-detail">
                        {p.fields.map(([label, value], i) => (
                          <div className="frow" key={i}>
                            <dt>{label}</dt>
                            <dd>{fieldText(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
