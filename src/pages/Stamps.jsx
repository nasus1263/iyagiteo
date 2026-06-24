import { PLACES } from '../data/places.js'
import { useStore } from '../store.jsx'

export default function Stamps() {
  const { state } = useStore()
  const got = PLACES.filter((p) => state.stamps[p.id]?.storyPlayed).length

  return (
    <div className="page">
      <h2 className="page-title">스탬프</h2>
      <p className="page-hint">
        해당 지역(100m)에서 이야기 재생을 완료하면 스탬프를 얻어요. ({got}/{PLACES.length})
      </p>
      <div className="stamp-grid">
        {PLACES.map((p) => {
          const done = state.stamps[p.id]?.storyPlayed
          return (
            <div key={p.id} className={`stamp ${done ? 'done' : ''}`}>
              <span className="stamp-icon">{done ? '🏅' : '🔒'}</span>
              <span className="stamp-name">{p.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
