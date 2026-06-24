// Web Speech API 기반 TTS (브라우저 내장, 무료, 기획 결정값).
// 별도 오디오 파일을 만들지 않고 브라우저가 실시간 합성한다.

export function ttsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let koVoice = null
function pickKoreanVoice() {
  if (!ttsSupported()) return null
  const voices = window.speechSynthesis.getVoices()
  return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ko')) || null
}

// 일부 브라우저는 voices가 비동기로 로드됨 → 갱신.
if (ttsSupported()) {
  koVoice = pickKoreanVoice()
  window.speechSynthesis.onvoiceschanged = () => {
    koVoice = pickKoreanVoice()
  }
}

// text 재생. 끝까지 재생되면 onEnd 호출(스탬프 획득 조건).
// 반환값: 정지 함수.
export function speak(text, { onEnd, onError } = {}) {
  if (!ttsSupported()) {
    onError && onError(new Error('이 브라우저는 음성 합성을 지원하지 않습니다.'))
    return () => {}
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ko-KR'
  if (koVoice) u.voice = koVoice
  u.rate = 1.0
  u.onend = () => onEnd && onEnd()
  u.onerror = (e) => onError && onError(e)
  window.speechSynthesis.speak(u)
  return () => window.speechSynthesis.cancel()
}

export function stopSpeak() {
  if (ttsSupported()) window.speechSynthesis.cancel()
}
