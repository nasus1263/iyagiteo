// 흥미별 대표 여행지(map<흥미, 여행지명[]>). 장소명만 사용(설명 무시).
// 데이터셋(datas)에 있으면 매칭해 전체 정보를 보여주고, 없으면 이름만 가진 placeholder.
import { PLACES } from './places.js'

export const REPRESENTATIVE = {
  history: ['전주 한옥마을', '전주 풍남문', '전라감영', '전주 풍패지관(전주객사)', '한벽당', '남천교 청연루'],
  royal: ['경기전', '어진박물관', '오목대와 이목대', '조경단', '예종대왕태실 및 비', '충경사'],
  drama: ['전주향교', '전주 영화의 거리', '전주영화제작소', '전주영화호텔 영화도서관', '객사길', '자만마을 벽화갤러리'],
  modern: ['전주전동성당', '치명자산성지', '동학혁명기념관', '관성묘', '남고사', '장현식고택'],
}

const norm = (s) => String(s || '').replace(/\(.*?\)/g, '').replace(/[\s·]/g, '').trim()

function findPlace(name) {
  const k = norm(name)
  if (!k) return null
  return (
    PLACES.find((p) => norm(p.name) === k) ||
    PLACES.find((p) => norm(p.name).includes(k)) ||
    PLACES.find((p) => k.includes(norm(p.name)) && norm(p.name).length >= 3) ||
    null
  )
}

// 흥미별 대표 장소 객체 배열. 매칭 실패 시 이름만 가진 placeholder.
export function repPlaces(interestId) {
  return (REPRESENTATIVE[interestId] || []).map((name) => {
    return (
      findPlace(name) || { id: 'rep:' + name, name, category: '관광지', summary: '', fields: [['명칭', name]] }
    )
  })
}
