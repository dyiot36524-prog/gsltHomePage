'use client';

import { usePathname } from 'next/navigation';
import { splitLocale, type Locale } from './config';

/**
 * 브라우저 컴포넌트에서 지금 언어 — 주소에서 읽는다(next/root-params는 서버 전용).
 * 가능하면 서버 부모가 사전 조각을 props로 넘기는 편이 낫다. 이 훅은 오류 화면처럼 부모가 없는 곳용이다.
 */
export function useLocale(): Locale {
  return splitLocale(usePathname() ?? '/').locale;
}
