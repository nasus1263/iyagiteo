import { PLACES } from '../data/places.js'
import { interestById } from '../data/interests.js'
import { useStore } from '../store.jsx'

export default function Places() {
  const { state } = useStore()
  const interest = interestById(state.interestId)

  return (
    <div className="page">
      <h2 className="page-title">전주 한옥마을 여행지</h2>
      {interest && (
        <p className="page-hint">
          현재 관심사: <b>{interest.emoji} {interest.label}</b>
        </p>
      )}
      <div className="place-list">
        {PLACES.map((p) => (
          <div className="place-card" key={p.id}>
            <img
              src={p.image}
              alt={p.name}
              onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
            />
            <div className="place-body">
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <span className="coord">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
