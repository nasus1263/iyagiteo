// 키 우선순위: localStorage(앱 설정) > .env(VITE_*).
// 백엔드가 없으므로 키는 클라이언트에 보관됨(프로토타입 한정).

export function getKakaoKey() {
  return (
    localStorage.getItem('iyagiteo.kakaoKey') ||
    import.meta.env.VITE_KAKAO_MAP_KEY ||
    ''
  )
}

export function getAnthropicKey() {
  return (
    localStorage.getItem('iyagiteo.anthropicKey') ||
    import.meta.env.VITE_ANTHROPIC_API_KEY ||
    ''
  )
}

export function getGoogleKey() {
  return (
    localStorage.getItem('iyagiteo.googleKey') ||
    import.meta.env.VITE_GOOGLE_PLACES_KEY ||
    ''
  )
}

export function setKakaoKey(v) {
  localStorage.setItem('iyagiteo.kakaoKey', v.trim())
}

export function setAnthropicKey(v) {
  localStorage.setItem('iyagiteo.anthropicKey', v.trim())
}

export function setGoogleKey(v) {
  localStorage.setItem('iyagiteo.googleKey', v.trim())
}

// 스탬프/도착 판정 반경 (m) — 기획 결정값
export const STAMP_RADIUS_M = 100

// AI 대본 생성 모델 — 기획 결정값
export const CLAUDE_MODEL = 'claude-haiku-4-5'

// 전주 한옥마을 중심 좌표 (지도 초기 위치)
export const JEONJU_CENTER = { lat: 35.8151, lng: 127.1512 }
