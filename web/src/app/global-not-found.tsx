import type { Metadata } from 'next';
import NotFoundView from '@/components/NotFoundView';
import './globals.css';

/**
 * 어느 주소에도 맞지 않는 요청의 404. 루트 레이아웃이 둘((ko) · [lang])이라 레이아웃 하나에 기대는
 * not-found로는 모든 경우를 덮지 못한다(next.config의 experimental.globalNotFound).
 * 레이아웃을 거치지 않으므로 <html>부터 여기서 그린다. 언어를 알 길이 없어 한국어로 낸다.
 */
export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 | 지에스엘티',
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        <NotFoundView locale="ko" />
      </body>
    </html>
  );
}
