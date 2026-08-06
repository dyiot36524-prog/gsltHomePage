import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
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
  icons: { icon: '/img/gslt-symbol.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
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
        {children}
        <ScrollTop />
      </body>
    </html>
  );
}
