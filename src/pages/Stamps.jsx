import { PLACES } from '../data/places.js'
import { useStore } from '../store.jsx'
import Mascot from '../components/Mascot.jsx'

export default function Stamps() {
  const { state } = useStore()
  const got = PLACES.filter((p) => state.stamps[p.id]?.storyPlayed).length
  const pct = Math.round((got / PLACES.length) * 100)

  return (
    <div className="page">
      <div className="topbar">
        <div className="hi">스탬프 도감</div>
      </div>

      <div className="rec-hero">
        <div className="rec-masc bob"><Mascot size={58} /></div>
        <div className="rec-bubble">
          <div className="who">이야기 요정 · 터울</div>
          <div className="msg">반가워요! 함께 전주 도감을 채워봐요 ✨</div>
        </div>
      </div>

      <div className="dogam">
        <div className="top">
          <span className="t">한옥마을 스탬프</span>
          <span className="n">{got} / {PLACES.length}</span>
        </div>
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="rec-sec">🏅 모은 스탬프</div>
      <div className="stampgrid">
        {PLACES.map((p) => {
          const done = state.stamps[p.id]?.storyPlayed
          return (
            <div key={p.id} className={`sstamp ${done ? 'got' : 'lock'}`}>
              <span className="em">{done ? '🏅' : '🔒'}</span>
              <span className="nm">{p.name}</span>
            </div>
          )
        })}
      </div>

      <p className="empty">
        해당 지역(100m)에서 이야기 재생을 완료하면 스탬프를 얻어요.
      </p>
    </div>
  )
}
