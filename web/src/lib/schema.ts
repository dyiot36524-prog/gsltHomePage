import { SITE, COMPANY } from '@/lib/site';

/**
 * 구조화 데이터(JSON-LD).
 *
 * 검색엔진은 화면에 그려진 글자만 보고 "이 회사가 뭐 하는 곳인지"를 확신하지 못한다.
 * 여기서 회사·주소·연락처·수상을 기계가 읽는 형식으로 한 번 더 명시한다.
 * 구글이 회사명을 검색했을 때 우측에 뜨는 정보 패널이 이 데이터를 근거로 만들어진다.
 *
 * 지어낸 값을 넣지 않는다. 전부 PRODUCT.md와 실제 보도로 확인된 사실이다.
 */

const ORG_ID = `${SITE.url}/#organization`;

/** 회사 자체. 사이트 전 페이지에 한 번씩 실린다. */
export const organizationSchema = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.nameKo,
  alternateName: [SITE.name, '주식회사 지에스엘티'],
  url: SITE.url,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE.url}/img/gslt-logo-color.png`,
    width: 2245,
    height: 615,
  },
  image: `${SITE.url}/img/og-image.png`,
  description: SITE.description,
  foundingDate: '2023',
  founder: { '@type': 'Person', name: COMPANY.ceo },
  taxID: COMPANY.bizNo,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '중원구 둔촌대로 388번길 24, 우림라이온스밸리 3차 501호',
    addressLocality: '성남시',
    addressRegion: '경기도',
    addressCountry: 'KR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: `+82-${COMPANY.tel.replace(/^0/, '').replace(/-/g, '-')}`,
    email: COMPANY.email,
    contactType: 'sales',
    areaServed: 'KR',
    availableLanguage: ['Korean'],
  },
  award: [
    '포브스 코리아 2026 소비자 선정 최고의 브랜드 대상 — 무선 IoT 기반 스마트 공간 부문',
    '중소벤처기업부 디딤돌 R&D 국책과제 선정 (2026)',
    '중소벤처기업부 초기창업패키지 선발·졸업 (2025)',
  ],
  knowsAbout: [
    '무선 IoT 구축',
    '스마트오피스',
    '스마트홈',
    '빌딩 자동화',
    'IoT 통합 관제',
    'AI 예지보전',
  ],
} as const;

/** 사이트 자체. 검색창에서 사이트 내 검색이 뜨게 하려면 WebSite가 필요하다. */
export const webSiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: `${SITE.nameKo}(${SITE.name})`,
  description: SITE.description,
  publisher: { '@id': ORG_ID },
  inLanguage: 'ko-KR',
} as const;

/** 여러 스키마를 한 덩어리로 묶어 내보낸다. @graph는 서로를 @id로 참조할 수 있게 해준다. */
export function jsonLd(...nodes: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}

/** 빵부스러기 — 검색 결과에 '홈 > 뉴스 > 글제목' 경로가 뜨게 한다. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE.url}${t.path}`,
    })),
  };
}
