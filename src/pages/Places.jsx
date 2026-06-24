import { PLACES } from '../data/places.js'
import { interestById } from '../data/interests.js'
import { useStore } from '../store.jsx'

export default function Places() {
  const { state } = useStore()
  const interest = interestById(state.interestId)

  return (
    <div className="page">
      <div className="topbar">
        <div className="hi">
          전주 한옥마을
          <small>같은 장소, 당신의 관심사로 다시 듣기</small>
        </div>
        <div className="chips">
          {interest && <span className="chip">{interest.emoji} {interest.label}</span>}
          <span className="chip">⏱ {state.durationMin}분</span>
        </div>
      </div>

      <div className="sec-h"><h3>여행지</h3></div>
      <div className="places">
        {PLACES.map((p) => (
          <div className="place" key={p.id}>
            <div className="thumb">
              <img
                src={p.image}
                alt={p.name}
                onError={(e) => {
                  e.currentTarget.replaceWith(document.createTextNode('🏯'))
                }}
              />
            </div>
            <div className="info">
              <div className="nm">{p.name}</div>
              <div className="ds">{p.summary}</div>
            </div>
            <div className="meta">
              <div className="dist">{p.lat.toFixed(3)}</div>
              <div className="stt">{p.lng.toFixed(3)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
