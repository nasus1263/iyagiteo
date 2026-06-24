# 이야기터 (Spotale) — 전주 한옥마을 프로토타입

관심사 기반 위치형 오디오 스토리텔링. 같은 장소도 방문자의 관심사에 따라 다른 이야기를 들려준다.
상위 기획: `prototype/프로젝트 초안.md`.

## 기술 스택
- **React + Vite** (백엔드 없음, SPA)
- **Kakao Map** — 동선/현위치 표시
- **Claude Haiku** (`claude-haiku-4-5`) — 관심사 맞춤 대본 **실시간** 생성 (브라우저 직접 호출)
- **Web Speech API** — 브라우저 내장 TTS
- 상태: `localStorage`

## 하이브리드 AI 범위 (기획 결정)
- 장소·사료(`src/data/sources.js`)는 **mock 하드코딩** (5곳 × 관심사 4종)
- 대본 생성만 **Haiku 실시간** — 고정 사료를 근거로 넣어 할루시네이션 차단
- API 키가 없거나 호출 실패 시 **사료 기반 폴백 대본**으로 동작

## 실행
```bash
cd prototype/iyagiteo
npm install
npm run dev
```
브라우저에서 안내된 주소(기본 http://localhost:5173) 열기. 모바일 화면 폭 기준.

## 키 설정 (둘 다 선택)
1. `.env` 복사: `cp .env.example .env` 후 `VITE_KAKAO_MAP_KEY`, `VITE_ANTHROPIC_API_KEY` 입력, 또는
2. 앱 실행 후 하단 **설정** 탭에서 입력 (localStorage 저장)

- **Kakao 키 없음** → 지도 자리에 안내 문구 (나머지 기능은 동작)
- **Anthropic 키 없음** → 자료 기반 폴백 대본 사용
- **Google Places(New) 키 없음** → 여행지 사진 대신 카테고리 이모지 표시
  - Places API (New) 활성화 + HTTP referrer 제한(localhost·Pages 도메인) 권장. 사진은 장소명 텍스트 검색(+좌표 bias)으로 조회, photoName을 localStorage에 캐시.

> 백엔드가 없어 API 키가 브라우저에 노출된다. **프로토타입 한정**이며 실서비스 시 서버 프록시 필요.

## 사용 흐름
1. **온보딩**: 관심사 4종 중 선택 + 체류 시간
2. **여행지**: 핵심 5곳(경기전·전동성당·풍남문·오목대·전주향교) 목록
3. **여행 → 새 여행**: 빈 시작 / 프롬프트 AI 초안 / 템플릿(테마 코스)
4. **동선 편집**: 장소 추가·제거 → **이야기 생성**(Haiku) → 지도에 동선 표시
5. **Play**: 상단 30% 지도+현위치 / 하단 70% 이야기(동선 선택·이미지·TTS 재생)
6. **스탬프**: 해당 지역 **100m** 안에서 이야기(TTS) 재생 완료 시 획득
   - 데모: Play 화면의 `📍 여기로(시뮬)` 버튼으로 현위치를 해당 지점으로 이동 가능

## 결정값
| 항목 | 값 |
|------|----|
| 지도 API | Kakao Map |
| AI 모델 | Claude Haiku (`claude-haiku-4-5`) |
| TTS | Web Speech API |
| 관심사 | 4종 |
| 스탬프 반경 | 100m |
| AI/RAG | 하이브리드 (사료 mock + 대본 실시간) |

## 추후 (mock → 실데이터)
- `src/data/places.js`, `src/data/sources.js` → 한국관광공사 TourAPI / 1차 사료 RAG
- 시각 자료: 현재 장소 이미지 → AI 자료 검색
- 키는 서버 프록시로 이전
