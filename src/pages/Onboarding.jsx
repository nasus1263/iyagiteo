import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { INTERESTS } from '../data/interests.js'
import { useStore } from '../store.jsx'
import Mascot from '../components/Mascot.jsx'

const SUBS = {
  history: '옛 건물에 담긴 역사 이야기',
  royal: '왕과 사람들의 이야기',
  drama: '드라마·영화 속 그곳',
  modern: '신앙과 근대의 흔적',
}

export default function Onboarding() {
  const { setInterest } = useStore()
  const navigate = useNavigate()
  const [picked, setPicked] = useState(null)
  const [duration, setDuration] = useState(120)

  function start() {
    if (!picked) return
    setInterest(picked, duration)
    navigate('/places', { replace: true })
  }

  return (
    <div className="scroll">
      <div className="ob-hero">
        <div className="ob-logo bob"><Mascot size={104} /></div>
        <h2 className="serif">이야기터</h2>
        <div className="tag">같은 장소, 다른 이야기</div>
      </div>

      <div className="ob-q">
        <h3>어떤 이야기가 궁금하세요?</h3>
        <p>고른 관심사에 맞춰 이야기를 들려드려요.</p>
      </div>

      <div className="interests">
        {INTERESTS.map((it) => (
          <div
            key={it.id}
            className={`icard ${picked === it.id ? 'on' : ''}`}
            onClick={() => setPicked(it.id)}
          >
            <span className="chk">✓</span>
            <span className="ic">{it.emoji}</span>
            <span className="nm">{it.label}</span>
            <span className="sub">{SUBS[it.id]}</span>
          </div>
        ))}
      </div>

      <div className="ob-q"><h3>얼마나 둘러보실 건가요?</h3></div>
      <div className="chips" style={{ padding: '0 24px' }}>
        {[60, 90, 120, 180].map((m) => (
          <button
            key={m}
            className={`chip pick ${duration === m ? 'on' : ''}`}
            onClick={() => setDuration(m)}
          >
            {m < 120 ? `${m}분` : `${m / 60}시간`}
          </button>
        ))}
      </div>

      <div className="ob-foot">
        <button className="btn" disabled={!picked} onClick={start}>
          여행 시작하기
        </button>
        <div className="note">관심사는 여행 중에도 언제든 바꿀 수 있어요</div>
      </div>
    </div>
  )
}
