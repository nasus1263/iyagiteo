import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLACES, CATEGORIES, categoryEmoji } from '../data/places.js'
import { interestById } from '../data/interests.js'
import { repPlaces } from '../data/representative.js'
import { useStore } from '../store.jsx'
import PlacePhoto from '../components/PlacePhoto.jsx'

function fieldText(v) {
  return String(v).replace(/<br\s*\/?>/gi, '\n')
}

function PlaceCard({ place, open, onToggle }) {
  const expanded = open
  return (
    <div className="place-wrap">
      <button className={`place ${expanded ? 'open' : ''}`} onClick={onToggle}>
        <div className="thumb"><PlacePhoto place={place} className="thumb-img" /></div>
        <div className="info">
          <div className="nm">{place.name}</div>
          <div className="ds">{place.summary}</div>
        </div>
        <span className="chev">{expanded ? '▾' : '▸'}</span>
      </button>
      {expanded && (
        <dl className="place-detail">
          {place.fields.map(([label, value], i) => (
            <div className="frow" key={i}>
              <dt>{label}</dt>
              <dd>{fieldText(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

export default function Places() {
  const { state } = useStore()
  const navigate = useNavigate()
  const interest = interestById(state.interestId)
  const reps = repPlaces(state.interestId)
  // 대표 여행지는 아래 전체 목록에서 중복 노출하지 않음
  const repIds = new Set(reps.map((p) => p.id))
  const [open, setOpen] = useState(null)
  const toggle = (key) => setOpen(open === key ? null : key)

  return (
    <div className="page">
      <div className="topbar">
        <div className="hi">
          전주 여행지
          <small>{interest ? `${interest.label} 흥미의 대표 여행지` : '관심사를 선택하세요'}</small>
        </div>
        <div className="chips">
          <button className="chip tap" onClick={() => navigate('/onboarding')}>
            {interest ? `${interest.emoji} ${interest.label}` : '관심사 선택'} <span className="chip-edit">✎</span>
          </button>
        </div>
      </div>

      <div className="sec-h">
        <h3>⭐ 대표 여행지 <span className="cnt">{reps.length}</span></h3>
      </div>
      <div className="places">
        {reps.map((p) => (
          <PlaceCard key={'rep:' + p.id} place={p} open={open === 'rep:' + p.id} onToggle={() => toggle('rep:' + p.id)} />
        ))}
      </div>

      {CATEGORIES.map((cat) => {
        const items = PLACES.filter((p) => p.category === cat && !repIds.has(p.id))
        if (items.length === 0) return null
        return (
          <section key={cat}>
            <div className="sec-h">
              <h3>{categoryEmoji(cat)} {cat} <span className="cnt">{items.length}</span></h3>
            </div>
            <div className="places">
              {items.map((p) => (
                <PlaceCard key={p.id} place={p} open={open === p.id} onToggle={() => toggle(p.id)} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
