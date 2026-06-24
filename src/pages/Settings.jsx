import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getKakaoKey,
  getAnthropicKey,
  getGoogleKey,
  setKakaoKey,
  setAnthropicKey,
  setGoogleKey,
} from '../config.js'
import { ttsSupported } from '../services/tts.js'
import { useStore } from '../store.jsx'

export default function Settings() {
  const navigate = useNavigate()
  const { setInterest } = useStore()
  const [kakao, setKakao] = useState(getKakaoKey())
  const [anthropic, setAnthropic] = useState(getAnthropicKey())
  const [google, setGoogle] = useState(getGoogleKey())
  const [saved, setSaved] = useState(false)

  function save() {
    setKakaoKey(kakao)
    setAnthropicKey(anthropic)
    setGoogleKey(google)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function resetInterest() {
    setInterest(null)
    navigate('/onboarding')
  }

  return (
    <div className="page">
      <h2 className="page-title">설정</h2>

      <div className="field">
        <label>Kakao 지도 JavaScript 키</label>
        <input value={kakao} onChange={(e) => setKakao(e.target.value)} placeholder="kakao app key" />
        <small>지도 표시에 필요. developers.kakao.com에서 발급.</small>
      </div>

      <div className="field">
        <label>Anthropic API 키 (Claude Haiku)</label>
        <input
          type="password"
          value={anthropic}
          onChange={(e) => setAnthropic(e.target.value)}
          placeholder="sk-ant-..."
        />
        <small>AI 이야기 생성에 필요. 비우면 사료 기반 폴백 대본 사용. 브라우저에 저장됨(프로토타입 한정).</small>
      </div>

      <div className="field">
        <label>Google Places API (New) 키</label>
        <input
          type="password"
          value={google}
          onChange={(e) => setGoogle(e.target.value)}
          placeholder="AIza..."
        />
        <small>여행지 사진에 사용. Google Cloud에서 <b>Places API (New)</b> + <b>Maps JavaScript API</b> 둘 다 활성화하고, 키의 HTTP referrer에 이 사이트 도메인을 허용하세요.</small>
      </div>

      <button className="btn-primary" onClick={save}>저장</button>
      {saved && <span className="note"> 저장됨</span>}

      <div className="field" style={{ marginTop: 28 }}>
        <label>환경</label>
        <small>음성 합성(TTS): {ttsSupported() ? '지원됨 ✅' : '미지원 ❌'}</small>
      </div>

      <button className="btn-outline" style={{ marginTop: 16 }} onClick={resetInterest}>
        관심사 다시 선택
      </button>
    </div>
  )
}
