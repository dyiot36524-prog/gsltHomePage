/**
 * 다국어 — 한국어 · 영어 · 중국어(간체) · 일본어 (2026-11 대표 요청, 시옷 홈페이지와 같은 방식).
 *
 * 주소: 한국어는 지금 주소 그대로(/, /about …), 나머지는 앞에 언어를 붙인다(/en, /en/about …).
 * 한국어 주소를 바꾸지 않는 이유 — 네이버·구글에 쌓인 색인과 카톡에 올라간 링크가 모두 이 주소다.
 *
 * 페이지 파일은 app/(ko)/… 에 하나만 있다. app/[lang]/… 는 같은 페이지를 다시 내보내는 얇은 파일이고,
 * 화면은 지금 언어를 i18n/server.ts의 getLocale()(서버) · useLocale()(브라우저)로 읽어 사전을 고른다.
 */
export const LOCALES = ['ko', 'en', 'zh', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';

/** 주소 앞에 붙는 언어 — app/[lang]가 만드는 셋. */
export const FOREIGN_LOCALES = ['en', 'zh', 'ja'] as const satisfies readonly Locale[];
export type ForeignLocale = (typeof FOREIGN_LOCALES)[number];

/** 언어 고르기 메뉴에 보이는 이름. 각 언어를 그 언어로 쓴다. */
export const LOCALE_LABEL: Record<Locale, string> = { ko: '한국어', en: 'English', zh: '中文', ja: '日本語' };

/** <html lang> · hreflang 값. 중국어는 간체라 zh-CN이다. */
export const HTML_LANG: Record<Locale, string> = { ko: 'ko', en: 'en', zh: 'zh-CN', ja: 'ja' };

/** og:locale. */
export const OG_LOCALE: Record<Locale, string> = { ko: 'ko_KR', en: 'en_US', zh: 'zh_CN', ja: 'ja_JP' };

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
export const isForeignLocale = (v: unknown): v is ForeignLocale =>
  typeof v === 'string' && (FOREIGN_LOCALES as readonly string[]).includes(v);

/**
 * 한국어 경로('/about', '/news?type=x', '/#fields') → 그 언어의 경로('/en/about' …).
 * 바깥 주소(https://…, mailto:, tel:)와 '#…'만 있는 것은 그대로 둔다.
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE || !path.startsWith('/') || path.startsWith('//')) return path;
  if (path === '/') return `/${locale}`;
  // '/?x' · '/#x' → '/en?x' · '/en#x'
  if (path[1] === '?' || path[1] === '#') return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** 지금 주소(pathname) → { 언어, 한국어 기준 경로 }. '/en/about' → { en, '/about' }, '/en' → { en, '/' }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const m = /^\/(en|zh|ja)(?=\/|$)/.exec(pathname);
  if (!m) return { locale: DEFAULT_LOCALE, path: pathname || '/' };
  return { locale: m[1] as ForeignLocale, path: pathname.slice(m[0].length) || '/' };
}

/** '{n}건' 같은 자리표시를 채운다. 사전 글자에는 함수를 넣지 않는다(브라우저 컴포넌트로 넘길 수 없다). */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
