import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { interestById } from '../data/interests.js'
import { repPlaces } from '../data/representative.js'
import { useStore } from '../store.jsx'
import PlacePhoto from '../components/PlacePhoto.jsx'

function fieldText(v) {
  return String(v).replace(/<br\s*\/?>/gi, '\n')
}

export default function Places() {
  const { state } = useStore()
  const navigate = useNavigate()
  const interest = interestById(state.interestId)
  const places = repPlaces(state.interestId)
  const [open, setOpen] = useState(null)

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
        <h3>대표 여행지 <span className="cnt">{places.length}</span></h3>
      </div>
      <div className="places">
        {places.map((p) => {
          const expanded = open === p.id
          return (
            <div className="place-wrap" key={p.id}>
              <button className={`place ${expanded ? 'open' : ''}`} onClick={() => setOpen(expanded ? null : p.id)}>
                <div className="thumb"><PlacePhoto place={p} className="thumb-img" /></div>
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
    </div>
  )
}
