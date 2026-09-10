/** 사이트 전역 상수. 회사 정보·네비게이션 구성을 한 곳에서 관리한다. */

export const SITE = {
  name: 'GSLT',
  nameKo: '지에스엘티',
  // 정식 주소. canonical·og:url·sitemap·RSS가 모두 이 값을 쓴다.
  // home.gslt.kr은 정리 예정인 구 사이트 주소라, 그대로 두면 검색엔진이 죽을 주소를
  // 정답으로 알고 카톡 공유 썸네일도 깨진다. gslt.kr은 www로 넘어오므로 www를 정본으로 둔다.
  url: 'https://www.gslt.kr',
  tagline: 'IoT Space Builder',
  // 홈의 meta description이자 여러 스키마의 설명으로 함께 쓰인다.
  // 한글 60~85자 — 짧으면 정보가 부족하고 길면 검색 결과에서 잘린다.
  description:
    '무선 IoT 구축 전문기업. 배선 공사 없이 오피스·주거·빌딩을 스마트 공간으로 완성합니다. 상담부터 시공·유지보수까지 직접 수행합니다.',
} as const;

export const COMPANY = {
  ceo: '최광수',
  bizNo: '707-81-03107',
  address: '경기도 성남시 중원구 둔촌대로 388번길 24, 우림라이온스밸리 3차 501호',
  tel: '070-4659-4804',
  email: 'gs7078103107@gmail.com',
} as const;

/**
 * 헤더 솔루션 패널·푸터·모바일 행이 모두 이 목록 하나를 쓴다.
 *
 * `lead`와 `pillars`는 헤더 카드 패널에서만 쓰는 추가 설명이다. 시옷이 이 회사의
 * 대표 솔루션이라 패널 맨 위에 큰 카드로 서고, 나머지 둘은 그 아래 한 줄로 붙는다.
 * 순서가 곧 비중이므로 시옷을 첫 항목으로 둔다.
 */
export const SOLUTIONS = [
  {
    href: '/siot',
    name: '시옷',
    en: 'SIOT',
    desc: '빌딩 관제 · 공간 예약 · 복합 자동화',
    dot: '#f97316',
    lead: '예약과 출입, 조명과 공조, 에너지와 기록까지 하나의 플랫폼 위에.',
    pillars: ['통합 관제', '공간 예약', '출입 연동', '자동화', '에너지'],
  },
  {
    href: '/bizmoa',
    name: '비즈모아',
    en: 'BizMoa',
    desc: 'IoT 시공 견적 자동화 SaaS',
    dot: '#3b82f6',
    lead: '도면 위에 장비를 배치하면 견적서·계약서·납품확인서가 자동으로 나옵니다.',
  },
  {
    href: '/morak',
    name: '모락',
    en: 'Morak',
    desc: '기수제 모임 커뮤니티',
    dot: '#00c2c2',
    lead: '디지털 명함으로 만나는 원우회·동문회 커뮤니티 플랫폼.',
  },
] as const;

/** key는 활성 메뉴 표시에 쓴다. menu가 있으면 관리자에서 숨길 수 있는 항목. */
export const NAV = [
  { href: '/', key: 'home', label: '홈' },
  { href: '/about', key: 'about', label: '회사소개' },
  { href: '/faq', key: 'faq', label: 'FAQ' },
  { href: '/news', key: 'news', label: '뉴스', menu: 'news' },
  { href: '/downloads', key: 'downloads', label: '자료실', menu: 'downloads' },
  { href: '/portfolio', key: 'portfolio', label: '포트폴리오', menu: 'portfolio' },
] as const;

export type NavKey = (typeof NAV)[number]['key'] | '';
