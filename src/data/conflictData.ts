import { ConflictFlashpoint } from '../types/travelRisk';

export const ACTIVE_WAR_FLASHPOINTS: ConflictFlashpoint[] = [
  {
    id: 'ukraine-russia',
    titleKo: '러시아-우크라이나 전면전 및 동유럽 국경 분쟁',
    regionKo: '동유럽 (우크라이나 전역 & 러시아 서부 접경)',
    countriesInvolved: ['우크라이나', '러시아', '벨라루스'],
    coords: [34.0, 49.5],
    intensity: '극심 (전면전)',
    impactOnTravel: '우크라이나 영공 전면 폐쇄, 흑해 항해 통제, 러시아 접경 50km 지역 4단계 여행금지',
    airspaceStatus: '전면 폐쇄',
    summary: '2022년 러시아의 전면 침공 이후 장기화된 고강도 전면전. 순항·탄도 미사일 및 드론 공격이 우크라이나 전역의 도시와 민간 인프라에 무차별적으로 감행되고 있습니다. 러시아 국경 지대(쿠르스크, 벨고로드 등) 또한 교전지대로 변모했습니다.',
    recommendation: '우크라이나 전역 입국 절대 금지(위반 시 여권법 형사 처벌). 인접 폴란드, 루마니아 등 동유럽 여행 시에도 국경 군사 통제 지역 접근 금지.'
  },
  {
    id: 'middle-east-gaza-lebanon',
    titleKo: '중동 분쟁 (이스라엘-가자-레바논-이란 무력 충돌)',
    regionKo: '중동 (이스라엘, 가자지구, 서안, 레바논 남부, 홍해)',
    countriesInvolved: ['이스라엘', '팔레스타인', '레바논', '이란', '예멘'],
    coords: [35.2, 32.1],
    intensity: '극심 (전면전)',
    impactOnTravel: '가자지구 전면전, 레바논 남부 지상전/공습, 이스라엘 전국 로켓 경보, 텔아비브 공항 결항 빈발',
    airspaceStatus: '위험 영공 지정',
    summary: '하마스 기습 이후 가자지구 지상전, 헤즈볼라와의 레바논 전선 격화, 이란과의 탄도 미사일 상호 타격 등으로 중동 전역이 비상 전시 상태에 돌입했습니다. 국제 항공 노선들이 이란, 이라크, 이스라엘 영공을 대거 우회하고 있습니다.',
    recommendation: '가자지구 및 레바논 남부 절대 방문 금지. 이스라엘 체류 교민 신속 출국 권고. 중동 항공편 경유 시 영공 폐쇄 및 환승 취소 동향 실시간 확인 필수.'
  },
  {
    id: 'sudan-civil-war',
    titleKo: '수단 정부군-신속지원군(RSF) 유혈 내전',
    regionKo: '북동 아프리카 (수단 전역 & 차드 국경)',
    countriesInvolved: ['수단', '차드', '남수단'],
    coords: [32.5, 15.6],
    intensity: '극심 (전면전)',
    impactOnTravel: '수단 전역 4단계 여행금지, 수도 하르툼 공항 파괴 및 영공 통제, 심각한 치안 마비',
    airspaceStatus: '전면 폐쇄',
    summary: '정부군(SAF)과 준군사조직 RSF 간의 정권 장악을 둘러싼 대규모 시가전 및 민간인 학살. 수도 하르툼을 비롯한 주요 도시의 전기, 통신, 병원이 완전히 파괴되었으며 수백만 명의 난민이 발생한 최악의 인도적 재난 상황입니다.',
    recommendation: '수단 전역 및 수단 접경 지역 절대 여행 금지. 인접 이집트, 에티오피아 국경 이동 자제.'
  },
  {
    id: 'myanmar-civil-war',
    titleKo: '미얀마 군부 쿠데타 및 전국적 민주반군 내전',
    regionKo: '동남아시아 (미얀마 전국 및 태국/중국 국경)',
    countriesInvolved: ['미얀마', '태국 접경', '중국 접경'],
    coords: [96.0, 20.0],
    intensity: '심각 (교전·공습)',
    impactOnTravel: '국경 및 소수민족주 4단계 여행금지, 골든트라이앵글 불법 취업 감금 사기 다발',
    airspaceStatus: '위험 영공 지정',
    summary: '2021년 군부 쿠데타 이후 국민통합정부(NUG) 산하 시민방위군(PDF) 및 소수민족 무장단체와의 교전이 전국 영토로 확산되었습니다. 군부의 무차별 공습과 징집령으로 정세가 극도로 불안정하며, 카친주, 샨주 등은 반군이 장악하고 있습니다.',
    recommendation: '양곤을 포함한 미얀마 전역 여행 취소 권고. 특히 미얀마-태국-라오스 접경 골든트라이앵글 지역의 고수익 취업 사기 범죄 조직에 절대 유인되지 말 것.'
  },
  {
    id: 'yemen-red-sea',
    titleKo: '예멘 내전 및 홍해 상선 공격·다국적군 공습',
    regionKo: '아라비아 반도 남부 (예멘 & 홍해-바브엘만데브 해협)',
    countriesInvolved: ['예멘', '사우디아라비아 남부', '미국·영국 해군'],
    coords: [44.2, 15.3],
    intensity: '심각 (교전·공습)',
    impactOnTravel: '예멘 전역 4단계 여행금지, 홍해 크루즈 및 화물선 항해 전면 우회, 미사일 요격전',
    airspaceStatus: '전면 폐쇄',
    summary: '친이란 성향 후티 반군의 아덴만 및 홍해 민간 선박 드론·미사일 공격과 이에 대응하는 미·영 연합군의 예멘 내 군사거점 타격전. 장기간 내전으로 지뢰 매설 및 외국인 납치 위험이 극에 달해 있습니다.',
    recommendation: '예멘 전역 방문 절대 불가. 홍해 해상 크루즈 및 인근 해양 레저 참여 전면 취소.'
  },
  {
    id: 'syria-conflict',
    titleKo: '시리아 장기 내전 및 주변국 공습',
    regionKo: '중동 (시리아 전역)',
    countriesInvolved: ['시리아', '이스라엘', '러시아', '튀르키예 접경'],
    coords: [37.0, 35.5],
    intensity: '심각 (교전·공습)',
    impactOnTravel: '시리아 전역 4단계 여행금지, 다마스쿠스·알레포 공항 간헐적 공습 피해',
    airspaceStatus: '전면 폐쇄',
    summary: '정부군, 반군, 쿠르드 무장세력 간 대립과 잔존 ISIL 테러 세력 활동. 이스라엘군의 친이란 무장세력 목표물 공습이 다마스쿠스 공항 인근까지 수시로 전개됩니다.',
    recommendation: '외교부 흑색경보 국가로 무단 입국 시 여권법 위반으로 엄중 형사 처벌됩니다.'
  },
  {
    id: 'somalia-horn-of-africa',
    titleKo: '소말리아 알샤바브 반군 테러 및 해적 분쟁',
    regionKo: '아프리카의 뿔 (소말리아 전역 & 아덴만)',
    countriesInvolved: ['소말리아', '케냐 접경'],
    coords: [45.3, 2.0],
    intensity: '심각 (교전·공습)',
    impactOnTravel: '소말리아 전역 4단계 여행금지, 모가디슈 시내 대형 자살폭탄 테러 빈발',
    airspaceStatus: '위험 영공 지정',
    summary: '알카에다 연계 이슬람 극단주의 무장단체 알샤바브가 정부군 및 아프리카연합 평화유지군과 내전 지속. 주요 호텔 및 공항을 겨냥한 자살폭탄 테러가 상시 발생합니다.',
    recommendation: '전역 출입 불가. 소말리아 인근 해역 항해 및 접근 절대 금지.'
  },
  {
    id: 'sahel-belt-conflict',
    titleKo: '사헬 3국 (말리·부르키나파소·니제르) 무장 반군 벨트',
    regionKo: '서아프리카 사헬 지대',
    countriesInvolved: ['말리', '부르키나파소', '니제르'],
    coords: [1.0, 14.5],
    intensity: '심각 (교전·공습)',
    impactOnTravel: '영토 상당 부분 무장세력 장악, 외국인 표적 매복 납치 극심, 국경 폐쇄 빈발',
    airspaceStatus: '위험 영공 지정',
    summary: '군사 쿠데타 이후 프랑스 등 서방 군대가 철수한 틈을 타 알카에다(JNIM)와 ISIL 지부가 영토를 급속히 잠식. 수도 외곽 도로가 사실상 봉쇄되어 육로 이동이 불가능합니다.',
    recommendation: '3국 전역 출국 권고 및 국경 지역 여행금지. 비즈니스 및 NGO 목적 방문도 전면 취소 요망.'
  },
  {
    id: 'haiti-gang-war',
    titleKo: '아이티 갱단 장악 및 국가 치안 붕괴',
    regionKo: '카리브해 (아이티 포르토프랭스)',
    countriesInvolved: ['아이티'],
    coords: [-72.3, 18.5],
    intensity: '심각 (교전·공습)',
    impactOnTravel: '포르토프랭스 국제공항 총격 피습, 경찰서 및 교도소 습격, 외국인 납치',
    airspaceStatus: '위험 영공 지정',
    summary: '대통령 암살 이후 무장 갱단 연합체 \'비브 앙상블\'이 수도권의 80% 이상을 실효 지배. 법과 질서가 붕괴되었으며 경찰관과 민간인에 대한 무차별 살상 및 납치가 만연합니다.',
    recommendation: '외교부 4단계 여행금지 국가. 인접 도미니카공화국과의 육상 국경도 완전 폐쇄.'
  },
  {
    id: 'drc-eastern-conflict',
    titleKo: '콩고민주공화국 동부 M23 반군 무력 충돌',
    regionKo: '중앙 아프리카 (DR콩고 노스키부·남키부 주)',
    countriesInvolved: ['콩고민주공화국', '르완다 접경'],
    coords: [29.2, -1.6],
    intensity: '고조 (국지적 무력 충돌)',
    impactOnTravel: '고마(Goma) 시 인근 포격전, 주요 육로 차단, 동부 국립공원 방문 불가',
    airspaceStatus: '위험 영공 지정',
    summary: '투치족 중심의 M23 반군이 르완다 국경 부근 주요 요충지를 포위 공격 중. 수십만 명의 피란민이 발생했으며 유엔 평화유지군과의 중화기 교전이 빈번합니다.',
    recommendation: 'DR콩고 동부 지역 4단계 여행금지. 킨샤사 등 서부 지역도 극심한 치안 불안으로 방문 자제.'
  }
];
