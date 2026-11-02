import type { Metadata } from 'next';
import NotFoundView from '@/components/NotFoundView';
import { getLocale } from '@/i18n/server';

// app/(ko)/not-found와 같은 이유로 robots·canonical을 직접 적는다. 제목은 세 언어 공통으로 영어다 —
// not-found는 언어별 메타데이터를 만들 자리가 없고, 이 제목은 색인되지 않는다.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default async function NotFound() {
  return <NotFoundView locale={await getLocale()} />;
}
