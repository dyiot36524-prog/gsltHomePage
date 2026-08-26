import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { jsonLd, organizationSchema, webSiteSchema } from '@/lib/schema';
import Script from 'next/script';
import ScrollTop from '@/components/ScrollTop';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'GSLT - IoT 구축 전문기업 | 스마트오피스·스마트홈·빌딩 IoT',
    template: '%s | GSLT',
  },
  description: SITE.description,
  // 홈의 정본 주소. 하위 페이지는 각자 alternates.canonical을 갖고 있다.
  alternates: { canonical: '/', types: { 'application/rss+xml': `${SITE.url}/rss.xml` } },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'ko_KR',
    url: SITE.url,
    images: ['/img/og-image.png'],
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
  // 아이콘은 파일 컨벤션(favicon.ico · icon.png · apple-icon.png, 이 디렉터리)이 맡는다.
  // 여기서 metadata.icons로 다시 지정하면 중복 <link> 태그가 나가고,
  // 594×615 비정사각 원본을 그대로 물리는 문제도 생긴다.
};

/** 이 사이트 콘텐츠 서피스가 무엇을 하기로 했는지의 계약. 편집할 때마다 먼저 읽는다. */
const DIRECTION_CONTRACT = `<!-- impeccable:af5dbd57
THESIS: 뉴스·시공사례·자료는 회사가 남긴 '기록'이다. 이 회사가 현장에서 실제로 쓰는 기록부의
  문법으로 읽히게 한다. 카테고리 기본값인 3열 카드 그리드를 거부한다.
OWN-WORLD: 흰 지면, 헤어라인 괘선, 좌측에 날짜가 등번호처럼 큰 tabular 숫자로 서는 행 구조.
  구분은 채운 사각 태그. 강조는 gslt 청록 하나. 서체는 Pretendard 단일, 굵기·크기로만 위계.
STORY: 방문자는 "이 회사가 무엇을 해왔는지"를 훑고, 한 건을 골라 읽고, 문의로 간다.
FIRST VIEWPORT: 제목과 총 기록 수 → 괘선 위 열 이름(일자/구분/제목) → 첫 기록 행 3개.
  날짜가 왼쪽 기둥으로 서고 제목이 본문 크기로 이어진다. 필터는 밑줄 텍스트 버튼.
FORM: 시공 기록부(as-built record). 자체 후보 목록 7/7. seed af5dbd57.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 아래 인라인 스크립트가 <html>에 js-hero를 붙이므로 서버 렌더 결과와 어긋난다.
    // 의도된 차이라 하이드레이션 경고를 끈다.
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Pretendard: 한글 동적 서브셋 — 기존 사이트와 동일한 서체를 유지한다 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="" />
        {/* 회사·사이트 구조화 데이터. 검색엔진은 화면 글자만으로 "이 회사가 뭐 하는 곳인지"를
            확신하지 못한다. 회사명·주소·연락처·수상을 기계가 읽는 형식으로 한 번 더 준다.
            next/script가 아니라 <script>를 직접 쓴다 — 크롤러가 HTML을 받는 순간 있어야 한다. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema, webSiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        {/* 히어로 텍스트와 스크롤 리빌 요소의 초기 은닉. 마운트 후 숨기면 한 번 번쩍이므로
            페인트 전에 클래스를 건다. JS가 없으면 붙지 않아 내용이 그대로 보인다 —
            이 안전장치가 없으면 스크립트가 죽었을 때 제품 페이지 본문이 통째로 사라진다. */}
        <Script id="js-hero-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js-hero','js-reveal')`}
        </Script>
        {/* React는 JSX 주석을 DOM으로 내보내지 않는다. 방향 계약이 빌드 산출물에 남아
            감사 가능하려면 실제 HTML 주석으로 주입해야 한다. */}
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        {children}
        <ScrollTop />
        {/* 방문자 분석. 지금까지 아무 도구도 없어 하루 몇 명이 오는지, 어디서 오는지,
            문의까지 몇 %가 닿는지를 전혀 몰랐다. 쿠키를 쓰지 않고 개인을 식별하지 않아
            별도 동의 배너 없이 쓸 수 있다. Vercel 프로젝트에서 Analytics를 켜야 수집된다. */}
        <Analytics />
      </body>
    </html>
  );
}
