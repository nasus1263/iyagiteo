// 테마 코스 = 흥미별 대표 여행지 코스. (대표_여행지 기반)
import { INTERESTS } from './interests.js'
import { repPlaces } from './representative.js'

export const TEMPLATES = INTERESTS.map((it) => {
  const places = repPlaces(it.id)
  return {
    id: 't_' + it.id,
    name: `${it.label} 코스`,
    interestId: it.id,
    durationMin: 120,
    placeIds: places.map((p) => p.id),
    desc: `${it.label} 대표 여행지 ${places.length}곳`,
  }
})

export const templateById = (id) => TEMPLATES.find((t) => t.id === id)
