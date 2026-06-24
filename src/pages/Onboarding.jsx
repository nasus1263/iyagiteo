import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { INTERESTS } from '../data/interests.js'
import { useStore } from '../store.jsx'

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
    <div className="onboarding">
      <div className="ob-hero">
        <h1>이야기터</h1>
        <p>같은 장소도 당신의 관심사에 따라 다른 이야기를 들려드립니다.</p>
      </div>

      <h2>무엇이 궁금하세요?</h2>
      <div className="interest-grid">
        {INTERESTS.map((it) => (
          <button
            key={it.id}
            className={`interest-card ${picked === it.id ? 'sel' : ''}`}
            onClick={() => setPicked(it.id)}
          >
            <span className="emoji">{it.emoji}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>

      <h2>체류 시간</h2>
      <div className="chip-row">
        {[60, 90, 120, 180].map((m) => (
          <button
            key={m}
            className={`chip ${duration === m ? 'sel' : ''}`}
            onClick={() => setDuration(m)}
          >
            {m < 120 ? `${m}분` : `${m / 60}시간`}
          </button>
        ))}
      </div>

      <button className="btn-primary big" disabled={!picked} onClick={start}>
        시작하기
      </button>
    </div>
  )
}
