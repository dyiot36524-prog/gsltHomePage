import type { Metadata } from 'next';
import NotFoundView from '@/components/NotFoundView';

// robots를 직접 적는다. Next가 404에 'noindex'를 하나 더 붙여 태그가 둘이 되지만, 여기서
// 빼면 레이아웃의 'index, follow'를 물려받아 두 태그가 서로 반대말을 한다(실측). 같은 말 두 번이 낫다.
// canonical은 지운다 — 레이아웃의 홈 주소를 물려받으면 404가 "정본은 홈"이라고 주장한다.
export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return <NotFoundView locale="ko" />;
}
