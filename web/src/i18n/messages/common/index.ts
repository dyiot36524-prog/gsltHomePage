import { messages } from '@/i18n/check';
import type { Locale } from '@/i18n/config';
import { SOLUTIONS } from '@/lib/site';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

export type CommonMessages = typeof ko;
export const common = messages('common', { ko, en, zh, ja });

/** lib/site.ts SOLUTIONS(주소·색·바깥 사이트)에 그 언어의 이름·설명을 입힌다. 순서·주소는 그대로. */
export function solutionsFor(locale: Locale) {
  const t = common[locale].solutions;
  return SOLUTIONS.map((s) => {
    const key = s.href.slice(1) as 'siot' | 'bizmoa' | 'morak';
    const m = t[key];
    return { ...s, name: m.name, desc: m.desc, lead: m.lead, pillars: 'pillars' in m ? m.pillars : undefined };
  });
}

/**
 * 전화 링크. 한국어는 페이지마다 써 온 꼴(koHref) 그대로 두고, 외국어 판은 국제 형식(tel:+827046594804)으로
 * 건다 — 070으로 시작하는 국내 번호는 해외 전화에서 걸리지 않는다.
 */
export function telHref(locale: Locale, koHref: string): string {
  return locale === 'ko' ? koHref : `tel:${common[locale].company.tel.replace(/-/g, '')}`;
}
