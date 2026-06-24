import { useState } from 'react'
import { useStore } from '../store.jsx'
import { INTERESTS, interestById } from '../data/interests.js'
import { repPlaces } from '../data/representative.js'
import Mascot from '../components/Mascot.jsx'

// 흥미별 명예시민증 (이야기터_프로토타입_최종.html의 div.reward 참고)
function Certificate({ interest, places, stamps }) {
  const done = places.filter((p) => stamps[p.id]?.storyPlayed).length
  const complete = places.length > 0 && done === places.length
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '')

  return (
    <div className={`reward ${complete ? '' : 'locked'}`}>
      <div className="cert">
        <div className="cert-strip" />
        <div className="cert-body">
          <div className="cert-masc"><Mascot size={52} /></div>
          <div className="cert-head">
            <div className="cert-emblem">터</div>
            <div>
              <div className="cert-kicker">전주 이야기터 · {interest.label}</div>
              <div className="cert-title">명예시민증</div>
            </div>
          </div>
          <div className="cert-name">여행자 <b>○○○</b> 님</div>
          <div className="cert-line">
            {complete
              ? `‘${interest.label}’ 대표 여행지 ${places.length}곳의 이야기를 모두 모았기에, 이야기터 명예시민으로 임명합니다.`
              : `‘${interest.label}’ 대표 여행지의 스탬프를 모두 모으면 명예시민증이 발급돼요.`}
          </div>
          <div className="cert-seals">
            {places.map((p) => (
              <span key={p.id} className={`cseal ${stamps[p.id]?.storyPlayed ? 'on' : ''}`}>
                {p.name.slice(0, 2)}
              </span>
            ))}
          </div>
          <div className="cert-foot">
            <span>{complete ? `발급일 ${today} · 전주 한옥마을` : `수집 ${done}/${places.length}`}</span>
            <span>{complete ? '발급 완료' : '미발급'}</span>
          </div>
        </div>
      </div>
      {!complete && <div className="cert-lockbar">🔒 대표 여행지 스탬프를 모두 모으면 활성화돼요</div>}
    </div>
  )
}

export default function Stamps() {
  const { state } = useStore()
  const [view, setView] = useState(state.interestId)
  const interest = interestById(view) || INTERESTS[0]
  const places = repPlaces(view)
  const got = places.filter((p) => state.stamps[p.id]?.storyPlayed).length
  const pct = places.length ? Math.round((got / places.length) * 100) : 0

  return (
    <div className="page">
      <div className="topbar">
        <div className="hi">스탬프 도감</div>
      </div>

      <div className="stamp-filter">
        <label>흥미</label>
        <select value={view} onChange={(e) => setView(e.target.value)}>
          {INTERESTS.map((it) => (
            <option key={it.id} value={it.id}>
              {it.emoji} {it.label}
              {it.id === state.interestId ? ' (선택됨)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="rec-hero">
        <div className="rec-masc bob"><Mascot size={58} /></div>
        <div className="rec-bubble">
          <div className="who">이야기 요정 · 터울</div>
          <div className="msg">{interest.label} 도감을 채워봐요 ✨</div>
        </div>
      </div>

      <div className="dogam">
        <div className="top">
          <span className="t">{interest.label} 스탬프</span>
          <span className="n">{got} / {places.length}</span>
        </div>
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="rec-sec">🏅 대표 여행지 스탬프</div>
      <div className="stampgrid">
        {places.map((p) => {
          const doneP = state.stamps[p.id]?.storyPlayed
          return (
            <div key={p.id} className={`sstamp ${doneP ? 'got' : 'lock'}`}>
              <span className="em">{doneP ? '🏅' : '🔒'}</span>
              <span className="nm">{p.name}</span>
            </div>
          )
        })}
      </div>

      <div className="rec-sec">🎖️ 명예시민증</div>
      <Certificate interest={interest} places={places} stamps={state.stamps} />
    </div>
  )
}
