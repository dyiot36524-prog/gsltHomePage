/** 사이트 전역 상수. 회사 정보·네비게이션 구성을 한 곳에서 관리한다. */

export const SITE = {
  name: 'GSLT',
  nameKo: '지에스엘티',
  url: 'https://home.gslt.kr',
  tagline: 'IoT Space Builder',
  description:
    '무선 IoT 구축 전문기업. 배선 공사 없이 오피스·주거·빌딩을 스마트 공간으로 완성합니다.',
} as const;

export const COMPANY = {
  ceo: '최광수',
  bizNo: '707-81-03107',
  address: '경기도 성남시 중원구 둔촌대로 388번길 24, 우림라이온스밸리 3차 501호',
  tel: '070-4659-4804',
  email: 'gs7078103107@gmail.com',
} as const;

/** 헤더 드롭다운·푸터·모바일 행이 모두 이 목록 하나를 쓴다. */
export const SOLUTIONS = [
  { href: '/siot', name: '시옷', en: 'Siot', desc: '무선 IoT 통합 제어', dot: '#f97316' },
  { href: '/bizmoa', name: '비즈모아', en: 'BizMoa', desc: 'IoT 시공 견적 자동화 SaaS', dot: '#3b82f6' },
  { href: '/morak', name: '모락', en: 'Morak', desc: '기수제 모임 커뮤니티', dot: '#00c2c2' },
] as const;

/** key는 활성 메뉴 표시에 쓴다. menu가 있으면 관리자에서 숨길 수 있는 항목. */
export const NAV = [
  { href: '/', key: 'home', label: '홈' },
  { href: '/about', key: 'about', label: '회사소개' },
  { href: '/news', key: 'news', label: '뉴스', menu: 'news' },
  { href: '/downloads', key: 'downloads', label: '자료실', menu: 'downloads' },
  { href: '/portfolio', key: 'portfolio', label: '포트폴리오', menu: 'portfolio' },
] as const;

export type NavKey = (typeof NAV)[number]['key'] | '';
