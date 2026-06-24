// 테마 코스 템플릿(mock) — xlsx 여행지(관광지 카테고리)에서 동적으로 구성.
import { PLACES } from './places.js'

const tour = PLACES.filter((p) => p.category === '관광지')

export const TEMPLATES = [
  {
    id: 't1',
    name: '관광지 핵심 코스',
    interestId: 'history',
    durationMin: 120,
    placeIds: tour.slice(0, 3).map((p) => p.id),
    desc: '전주 대표 관광지 3곳',
  },
  {
    id: 't2',
    name: '더 둘러보기',
    interestId: 'royal',
    durationMin: 150,
    placeIds: tour.slice(3, 6).map((p) => p.id),
    desc: '관광지 추가 코스',
  },
  {
    id: 't3',
    name: '하루 한 바퀴',
    interestId: 'drama',
    durationMin: 180,
    placeIds: tour.slice(6, 10).map((p) => p.id),
    desc: '여유롭게 도는 관광지 코스',
  },
]

export const templateById = (id) => TEMPLATES.find((t) => t.id === id)
