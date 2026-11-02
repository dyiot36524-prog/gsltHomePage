import 'server-only';
import { lang } from 'next/root-params';
import { DEFAULT_LOCALE, isForeignLocale, type Locale } from './config';

/**
 * 지금 그리는 페이지의 언어 — 서버 컴포넌트·generateMetadata 어디서든 부른다.
 *
 * 루트 레이아웃이 둘이다: app/(ko)/layout(한국어, 주소에 언어 없음)과 app/[lang]/layout(en · zh · ja).
 * next/root-params의 lang()은 [lang] 쪽에서는 그 값을, (ko) 쪽에서는 undefined를 돌려준다.
 * 그래서 props로 언어를 내려보내지 않아도 헤더·푸터·페이지가 각자 읽는다.
 */
export async function getLocale(): Promise<Locale> {
  const v = await lang();
  return isForeignLocale(v) ? v : DEFAULT_LOCALE;
}
