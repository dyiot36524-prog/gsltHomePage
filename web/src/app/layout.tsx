import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import Script from 'next/script';
import ScrollTop from '@/components/ScrollTop';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'GSLT - IoT 구축 전문기업 | 스마트오피스·스마트홈·빌딩 IoT',
    template: '%s | GSLT',
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'ko_KR',
    url: SITE.url,
    images: ['/img/og-image.png'],
  },
  twitter: { card: 'summary_large_image' },
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
      </body>
    </html>
  );
}
