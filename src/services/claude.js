// Claude Haiku 호출 (브라우저 직접). 백엔드 없음 → x-api-key + 브라우저 직접 호출 헤더.
// 하이브리드: xlsx 여행지 정보(개요 등 고정 근거)를 넣고 관심사 톤에 맞춰 대본만 실시간 생성.
import { getAnthropicKey, CLAUDE_MODEL } from '../config.js'
import { PLACES } from '../data/places.js'

const API_URL = 'https://api.anthropic.com/v1/messages'

// 근거로 쓸 설명성 필드
const FACT_LABELS = ['개요', '소개', '행사내용', '설명', '내용', '메뉴', '코스']
const NON_FACT = new Set(['위도', '경도', '우편번호'])

function placeSources(place) {
  const facts = place.fields
    .filter(([h]) => FACT_LABELS.includes(h))
    .map(([, v]) => String(v).replace(/<br\s*\/?>/gi, ' ').trim())
    .filter(Boolean)
  if (facts.length) return facts
  // 설명 필드가 없으면 위경도 제외 전체 필드를 근거로
  return place.fields
    .filter(([h]) => !NON_FACT.has(h))
    .map(([h, v]) => `${h}: ${String(v).replace(/<br\s*\/?>/gi, ' ').trim()}`)
}

async function callClaude({ system, user, maxTokens = 800 }) {
  const apiKey = getAnthropicKey()
  if (!apiKey) throw new Error('NO_KEY')
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Claude API ${res.status}: ${body.slice(0, 200)}`)
  }
  const data = await res.json()
  const block = (data.content || []).find((b) => b.type === 'text')
  return block ? block.text.trim() : ''
}

// 동선 한 지점의 해설 대본 생성. place: xlsx 여행지 객체.
export async function generateStory({ place, interest, extraPrompt }) {
  const sources = placeSources(place)
  const system = [
    `너는 전주의 오디오 도슨트다. ${interest.tone}.`,
    '아래 "자료"에 적힌 사실만 근거로 사용하라. 자료에 없는 사실을 지어내지 마라.',
    `방문자의 관심사는 "${interest.label}"이다. 이 관점에서 이야기를 들려줘라.`,
    '이어폰으로 걸으며 듣는 상황이다. 2~3개의 짧은 문단, 자연스러운 구어체.',
    '마크다운/목록/제목 없이 줄글로만 작성하라. 200~320자 분량.',
  ].join('\n')
  const user = [
    `장소: ${place.name} (${place.category})`,
    '자료:',
    ...sources.map((s) => `- ${s}`),
    extraPrompt ? `\n추가 요청: ${extraPrompt}` : '',
  ].join('\n')

  try {
    const text = await callClaude({ system, user, maxTokens: 600 })
    return { text, generatedByAI: true }
  } catch (e) {
    const text = `${place.name}에 오신 것을 환영합니다. ${sources.join(' ')}`.slice(0, 600)
    return { text, generatedByAI: false, error: e.message }
  }
}

// 프롬프트로 동선 초안 생성 → 관광지 중 placeIds 배열.
export async function generateRouteDraft({ prompt, interest }) {
  const pool = PLACES.filter((p) => p.category === '관광지')
  const allowed = pool.map((p) => `${p.id}: ${p.name}`).join('\n')
  const system = [
    '너는 전주 여행 동선 설계자다.',
    '아래 목록의 장소 중에서만 3~5곳을 골라 방문 순서를 정한다.',
    `방문자 관심사: ${interest.label}.`,
    '응답은 오직 장소 id를 쉼표로 이은 한 줄로만 출력한다. 예: p1,p3,p5',
    '설명·따옴표·줄바꿈 금지.',
  ].join('\n')
  const user = `장소 목록:\n${allowed}\n\n요청: ${prompt || '추천 코스를 만들어줘'}`

  try {
    const text = await callClaude({ system, user, maxTokens: 80 })
    const ids = text
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((id) => pool.some((p) => p.id === id))
    if (ids.length === 0) throw new Error('빈 결과')
    return { placeIds: [...new Set(ids)], generatedByAI: true }
  } catch (e) {
    return { placeIds: pool.slice(0, 3).map((p) => p.id), generatedByAI: false, error: e.message }
  }
}
