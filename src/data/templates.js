// 테마 코스 템플릿 — 사전 생성된 세션 데이터(mock). 추후 TourAPI로 확장.
export const TEMPLATES = [
  {
    id: 'joseon-start',
    name: '조선 왕조의 시작',
    interestId: 'royal',
    durationMin: 120,
    placeIds: ['gyeonggijeon', 'omokdae', 'pungnammun'],
    desc: '태조 이성계의 자취를 따라 걷는 코스',
  },
  {
    id: 'modern-jeonju',
    name: '근대의 전주',
    interestId: 'modern',
    durationMin: 90,
    placeIds: ['jeondong', 'pungnammun', 'hyanggyo'],
    desc: '순교지와 근대 건축, 옛 성문을 잇는 코스',
  },
  {
    id: 'photo-spots',
    name: '인생샷 한 바퀴',
    interestId: 'drama',
    durationMin: 120,
    placeIds: ['gyeonggijeon', 'hyanggyo', 'omokdae'],
    desc: '촬영지·포토스팟 위주로 도는 코스',
  },
]

export const templateById = (id) => TEMPLATES.find((t) => t.id === id)
