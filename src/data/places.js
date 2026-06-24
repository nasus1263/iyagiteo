// 핵심 5곳 (기획 결정값). 좌표는 전주 한옥마을 일원 근사값.
// 이미지는 추후 한국관광공사 TourAPI로 교체. 우선 mock(위키미디어 등 공개 이미지).
export const PLACES = [
  {
    id: 'gyeonggijeon',
    name: '경기전',
    lat: 35.8157,
    lng: 127.1503,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gyeonggijeon_Shrine.jpg/640px-Gyeonggijeon_Shrine.jpg',
    summary: '태조 이성계의 어진을 모신 사적. 한옥마을의 중심.',
  },
  {
    id: 'jeondong',
    name: '전동성당',
    lat: 35.8146,
    lng: 127.1497,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Jeondong_Catholic_Church.jpg/640px-Jeondong_Catholic_Church.jpg',
    summary: '호남 최초의 로마네스크 양식 성당. 순교터 위에 세워졌다.',
  },
  {
    id: 'pungnammun',
    name: '풍남문',
    lat: 35.8137,
    lng: 127.1486,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Pungnammun_Gate.jpg/640px-Pungnammun_Gate.jpg',
    summary: '전주읍성의 남문. 옛 전주성에서 유일하게 남은 문.',
  },
  {
    id: 'omokdae',
    name: '오목대',
    lat: 35.8167,
    lng: 127.1531,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Omokdae.jpg/640px-Omokdae.jpg',
    summary: '이성계가 황산대첩 후 잔치를 벌인 언덕. 한옥마을 전경 조망.',
  },
  {
    id: 'hyanggyo',
    name: '전주향교',
    lat: 35.8138,
    lng: 127.1545,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jeonju_Hyanggyo.jpg/640px-Jeonju_Hyanggyo.jpg',
    summary: '조선시대 지방 교육기관. 수백 년 은행나무로 유명.',
  },
]

export const placeById = (id) => PLACES.find((p) => p.id === id)
