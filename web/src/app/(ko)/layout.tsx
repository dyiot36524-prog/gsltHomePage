import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { TITLE_TEMPLATE, languageAlternates } from '@/lib/seo';
import { HOME_OG_TITLE, ogImage } from '@/lib/og';
import {
  jsonLd,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
  webSiteSchema,
} from '@/lib/schema';
import RootDocument from '@/components/RootDocument';
import '../globals.css';

/**
 * 한국어 루트 레이아웃 — 지금까지의 모든 주소(/, /about …). 영어·중국어·일본어는 app/[lang]/layout.
 * 둘이 함께 쓰는 <html>·<body>는 components/RootDocument.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // 홈 제목이 77자여서 검색 결과에서 잘리고 있었다. 한글 기준 구글이 보여 주는 폭은
  // 약 30자다. 잘린 뒤에 무엇이 남는지 통제하지 못하느니, 노리는 질의 하나로 짧게 쓴다.
  //
  // 홈 제목은 **상호 그 자체**다. 네이버 가이드가 홈 제목을 "사이트를 대표하는 이름(상호명)"으로
  // 쓰라고 하고, 네이버가 결과에 보여 주는 "사이트명"이 곧 이 값이다. 같은 회사 가구 쇼핑몰
  // (gslf.kr)은 제목이 '지에스엘티' 그대로라 상호 검색 1위를 가져갔다. 우리는 한글 상호와
  // 영문 GSLT를 함께 둬 '지에스엘티'·'GSLT' 두 검색어에 모두 맞는다. '무선 IoT 구축 전문기업'
  // 같은 설명은 meta description이 맡는다. 하위 페이지는 틀이 뒤에 상호를 붙인다 —
  // 틀은 seo.ts의 TITLE_TEMPLATE 하나에서 온다(길이 검사와 같은 값).
  title: {
    default: SITE.siteName,
    template: TITLE_TEMPLATE,
  },
  description: SITE.description,
  // 홈의 정본 주소. 하위 페이지는 각자 alternates.canonical을 갖고 있다.
  // canonical을 '/'로 두면 Next가 슬래시 없는 주소로 낸다. sitemap은 슬래시를 붙여
  // 내보내므로 둘이 어긋난다 — 같은 페이지를 두 주소로 신고하는 셈이라 명시적으로 맞춘다.
  // languages는 같은 홈의 영어·중국어·일본어 판(hreflang)이다.
  alternates: {
    canonical: `${SITE.url}/`,
    languages: languageAlternates('/'),
    types: { 'application/rss+xml': `${SITE.url}/rss.xml` },
  },
  openGraph: {
    type: 'website',
    siteName: SITE.siteName,
    locale: 'ko_KR',
    url: SITE.url,
    // 홈 그림은 먹색 바탕 가운데 로고 하나뿐이다(app/og 라우트의 LogoOnly).
    // 하위 페이지는 pageSeo가 자기 제목 그림으로 덮는다. 직접 metadata를 쓰는 페이지가
    // openGraph를 빠뜨리면 이 홈 그림을 물려받는다.
    images: [ogImage('/', `${SITE.siteName} — ${HOME_OG_TITLE}`)],
  },
  twitter: { card: 'summary_large_image' },
  // 검색엔진이 이 사이트를 어떻게 다뤄야 하는지. max-image-preview:large 가 있어야
  // 구글 결과에 큰 썸네일이 뜬다(뉴스·수상 이미지가 있는 사이트에는 차이가 크다).
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  keywords: [
    '지에스엘티', 'GSLT', '무선 IoT', 'IoT 구축', '스마트오피스', '스마트홈',
    '빌딩 자동화', '스마트빌딩', '시옷', 'Siot', '비즈모아', 'BizMoa', '모락', 'Morak',
    'IoT 통합관제', '배선 공사 없는 IoT', 'AI 예지보전',
  ],
  // 사이트 소유 확인. 구글은 gslt.kr의 DNS TXT 레코드로 잡혀 있어 태그가 필요 없고,
  // 네이버 서치어드바이저는 HTML 태그 방식만 받아 여기서 head에 넣는다.
  // 소유 확인이 풀리면 서치어드바이저의 수집 요청·색인 현황이 통째로 막히므로 지우지 않는다.
  //
  // 네이버는 프로토콜과 www 유무까지 서로 다른 사이트로 세고 사이트마다 코드가 다르다.
  // 두 항목(gslt.kr · www.gslt.kr)의 코드를 함께 내보내 어느 쪽을 확인하든 걸리게 한다.
  // 첫 번째가 gslt.kr용이다 — 태그를 하나만 읽는 검사기라도 이쪽이 먼저 잡히도록.
  //
  // 다만 https://gslt.kr 자체는 여기서 308로 www에 넘기므로 그 응답 본문에는 태그가 없다.
  // 네이버 검사기가 리다이렉트를 따라가면 www에서 코드를 찾아 통과하고, 따라가지 않으면
  // 실패한다. 확실히 하려면 gslt.kr을 넘김이 아니라 본 주소로 돌려야 한다.
  verification: {
    other: {
      'naver-site-verification': [
        '06a78caded48ce220865f7f10a2e48f897d6f71c', // https://gslt.kr
        '15c11b1008709c2b03dfd1b5ee0d4cef63bd8b3b', // https://www.gslt.kr
      ],
    },
  },
  // 아이콘은 파일 컨벤션(favicon.ico · icon.png · apple-icon.png, app/)이 맡는다.
  // 여기서 metadata.icons로 다시 지정하면 중복 <link> 태그가 나가고,
  // 594×615 비정사각 원본을 그대로 물리는 문제도 생긴다.
};

export default function KoLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument
      locale="ko"
      ld={jsonLd(organizationSchema, webSiteSchema, serviceSchema, localBusinessSchema)}
    >
      {children}
    </RootDocument>
  );
}
