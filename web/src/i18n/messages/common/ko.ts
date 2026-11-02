/**
 * 모든 페이지가 함께 쓰는 글자 — 헤더 · 솔루션 메뉴 · 푸터 · 목록 머리 · 404 · 오류 화면 · 사이트 설명.
 * 페이지 본문은 각 페이지의 사전(messages/<페이지>)에 있다.
 */
export const ko = {
  site: {
    /** og:site_name · 홈 제목. */
    name: '지에스엘티(GSLT)',
    /** 하위 페이지 제목 틀. 한국어는 네이버 상호 검색 때문에 한글 상호를 붙인다(lib/site.ts titleBrand). */
    titleTemplate: '%s | 지에스엘티',
    description:
      '지에스엘티(GSLT)는 무선 IoT 구축 전문기업입니다. 배선 공사 없이 오피스·주거·빌딩을 스마트 공간으로 바꾸고, 시공·유지보수까지 직접 합니다.',
  },
  nav: {
    home: '홈',
    about: '회사소개',
    faq: 'FAQ',
    news: '뉴스',
    downloads: '자료실',
    portfolio: '포트폴리오',
    solutions: '솔루션',
    contact: '도입 문의',
  },
  header: {
    /** 로고 링크 이름. {name} = 상호. */
    homeAria: '{name} 홈',
    newWindow: '(새 창)',
    language: '언어',
  },
  solutions: {
    featured: '대표 솔루션',
    siotSite: '시옷 홈페이지',
    scenes: '활용 장면',
    siot: {
      name: '시옷',
      desc: '빌딩 관제 · 공간 예약 · 복합 자동화',
      lead: '예약과 출입, 조명과 공조, 에너지와 기록까지 하나의 플랫폼 위에.',
      pillars: ['통합 관제', '공간 예약', '출입 연동', '자동화', '에너지'],
    },
    bizmoa: {
      name: '비즈모아',
      desc: 'IoT 시공 견적 자동화 SaaS',
      lead: '도면 위에 장비를 배치하면 견적서·계약서·납품확인서가 자동으로 나옵니다.',
    },
    morak: {
      name: '모락',
      desc: '기수제 모임 커뮤니티',
      lead: '디지털 명함으로 만나는 원우회·동문회 커뮤니티 플랫폼.',
    },
  },
  /** 시옷 활용 장면 이름(lib/scene-names.ts의 SCENE_NAMES와 같은 말). */
  scenes: {
    'meeting-room': '회의실 예약·제어',
    lounge: '휴게공간 예약·재실 현황판',
    restroom: '화장실 재실 표시',
  },
  footer: {
    intro: ['무선 IoT 구축 전문기업.', '오피스·주거·빌딩을 배선 공사 없이 스마트 공간으로 완성합니다.'],
    colSolutions: '솔루션',
    colNews: '소식',
    colLegal: '법적 고지',
    terms: '서비스 약관',
    privacy: '개인정보 처리방침',
    support: '고객 지원',
    company: '상호',
    ceo: '대표자',
    bizNo: '사업자등록번호',
    address: '주소',
    tel: 'Tel',
    email: 'Email',
    kakao: '카카오톡 채널',
    family: '패밀리 사이트',
  },
  /** 화면에 쓰는 회사 정보. 한국어는 lib/site.ts COMPANY 값 그대로다. */
  company: {
    name: '지에스엘티(GSLT)',
    legalName: '(주)지에스엘티',
    ceo: '최광수',
    address: '경기도 성남시 중원구 둔촌대로 388번길 24, 우림라이온스밸리 3차 501호',
    tel: '070-4659-4804',
  },
  furniture: { name: '지에스엘티 퍼니처', desc: '락커·가구' },
  list: {
    /** 목록 머리의 총 건수. {n} = 숫자. */
    total: '총 {n}건',
    filter: '목록 필터',
  },
  scrollTop: '맨 위로',
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    body: '주소가 바뀌었거나 삭제된 페이지입니다.',
    home: '홈으로 돌아가기',
    contact: '찾는 자료가 있으면 문의하기',
  },
  error: {
    title: '잠시 내용을 불러오지 못했습니다',
    body: '일시적인 문제입니다. 잠시 후 다시 시도해 주세요.',
    retry: '다시 시도',
    home: '홈으로',
    contact: '문의하기',
  },
};
