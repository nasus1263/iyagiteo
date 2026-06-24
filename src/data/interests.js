// 관심사 4종 (기획 결정값). 같은 장소도 관심사에 따라 다른 이야기를 들려준다.
export const INTERESTS = [
  {
    id: 'history',
    label: '역사·건축',
    emoji: '🏛️',
    tone: '건축 양식과 시대적 내력을 차분하고 단정하게 설명하는 해설가',
  },
  {
    id: 'royal',
    label: '인물·왕실',
    emoji: '👑',
    tone: '왕실 인물과 그들의 사연을 이야기처럼 들려주는 이야기꾼',
  },
  {
    id: 'drama',
    label: '사극·영화 촬영지',
    emoji: '🎬',
    tone: '촬영 비하인드와 명장면을 흥미롭게 짚어주는 가이드',
  },
  {
    id: 'modern',
    label: '종교·근대사',
    emoji: '⛪',
    tone: '근대사와 종교의 흔적을 의미 있게 풀어내는 해설가',
  },
]

export const interestById = (id) => INTERESTS.find((i) => i.id === id)
