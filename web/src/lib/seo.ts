import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { ogImage } from '@/lib/og';
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, OG_LOCALE, localePath, type Locale } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
// 배포본 검사(scripts/seo-check.mjs)도 이 파일을 읽는다. 상한이 두 곳에 따로 있으면 한쪽만 고쳐진다.
import LIMITS from './seo-limits.json';

/**
 * 검색 결과에 실제로 보이는 문구를 만든다.
 *
 * 손으로 쓰던 때는 제목이 77자, 설명이 224자까지 늘어났다. 한글 기준 구글이 보여 주는
 * 폭은 **제목 약 30자 · 설명 약 80자**라, 그 뒤는 잘려 나가고 무엇이 남는지 통제하지
 * 못했다. 규칙을 문서에 적어 두면 다음 페이지에서 또 넘치므로 여기에 박는다.
 *
 * 넘치면 조용히 자르지 않고 **개발 중에는 경고를 띄운다.** 조용히 자르면 잘린 줄
 * 모른 채 배포되고, 그게 지금까지 벌어진 일이다. 최종 검증은 scripts/seo-check.mjs가
 * 배포본을 대상으로 한다.
 */

/** 제목 틀 ' | 지에스엘티'(8자)를 포함한 전체 길이 상한. */
const { TITLE_MAX } = LIMITS;
/** 설명 권장 폭. 짧으면 정보가 부족하고 길면 잘린다. */
const { DESC_MIN, DESC_MAX } = LIMITS;

/** layout.tsx의 제목 틀. 길이 검사가 실제로 붙는 접미사와 같은 값을 재야 한다. */
export const TITLE_TEMPLATE = `%s | ${SITE.titleBrand}`;

function warn(kind: string, value: string, max: number) {
  if (process.env.NODE_ENV === 'production') return;
  // 빌드를 멈추지는 않는다 — 글자 수는 사람이 판단할 여지가 있고,
  // 배포본 검사(seo-check.mjs)가 최종 관문이다.
  console.warn(
    `[seo] ${kind}가 ${value.length}자로 상한 ${max}자를 넘었습니다. 검색 결과에서 잘립니다.\n      "${value}"`,
  );
}

/**
 * 그 언어 판의 절대 주소. 한국어 홈은 슬래시 없이 낸다 — Next가 머리의 canonical·hreflang을 그렇게
 * 정규화하고 sitemap도 그 꼴이다(app/sitemap.ts). sitemap의 hreflang은 정규화를 거치지 않아 여기서 맞춘다.
 */
export function localeUrl(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path === '/' ? SITE.url : `${SITE.url}${path}`;
  return `${SITE.url}${localePath(locale, path)}`;
}

/**
 * 같은 페이지의 네 언어 판 — hreflang(alternates.languages). x-default는 한국어다.
 * path는 한국어 기준 경로('/about'). 홈은 '/'.
 */
export function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[HTML_LANG[l]] = localeUrl(l, path);
  out['x-default'] = localeUrl(DEFAULT_LOCALE, path);
  return out;
}

type PageSeoInput = {
  /** 지금 언어. 빠지면 한국어. */
  locale?: Locale;
  /** ' | 지에스엘티'(외국어는 ' | GSLT')를 뺀 제목. 틀은 레이아웃이 붙인다. */
  title: string;
  description: string;
  /** '/siot' 처럼 앞에 슬래시가 붙은 **한국어 기준** 경로. 언어 접두어는 여기서 붙인다. */
  path: string;
  /**
   * 공유 이미지. 지정하지 않으면 이 페이지 제목이 들어간 그림(/og<path>, lib/og.ts)을 쓴다.
   * 제목 그림보다 설득력이 큰 사진이 있는 페이지만 지정한다(회사소개의 시상식 사진 등).
   */
  image?: string;
};

/**
 * 페이지 메타데이터를 한 벌로 만든다.
 *
 * canonical·openGraph·twitter를 페이지마다 손으로 쓰면 하나씩 빠진다. 실제로 홈의
 * canonical만 슬래시가 빠져 sitemap과 어긋나 있었다.
 *
 * 공유 카드 제목(og·twitter)은 **여기서 만들지 않는다.** 비워 두면 Next가 틀이 적용된
 * `<title>`을 그대로 쓴다(next/dist/lib/metadata/resolve-metadata.js의 inheritFromMetadata).
 * 전에는 여기서 `제목 | GSLT`를 따로 조립해, 틀을 바꾸면 검색 제목과 공유 제목이
 * 서로 다른 상호를 달고 나갈 수 있었다.
 */
export function pageSeo({ locale = DEFAULT_LOCALE, title, description, path, image }: PageSeoInput): Metadata {
  // 글자 수 상한은 한글 기준이다(구글이 보여 주는 폭). 외국어는 seo-check가 따로 본다.
  if (locale === DEFAULT_LOCALE) {
    const full = TITLE_TEMPLATE.replace('%s', title);
    if (full.length > TITLE_MAX) warn('제목', full, TITLE_MAX);
    if (description.length > DESC_MAX) warn('설명', description, DESC_MAX);
    if (description.length < DESC_MIN && process.env.NODE_ENV !== 'production') {
      console.warn(`[seo] 설명이 ${description.length}자로 짧습니다(권장 ${DESC_MIN}자 이상). "${description}"`);
    }
  }

  return {
    title,
    description,
    // types를 함께 적는다. 페이지가 alternates를 쓰면 레이아웃의 RSS 자동탐지 링크가 통째로
    // 덮여 사라진다(메타데이터는 얕게 합쳐진다). 모든 페이지가 피드를 알리게 한다.
    // languages는 같은 페이지의 다른 언어 판(hreflang)이다.
    alternates: {
      canonical: localePath(locale, path),
      languages: languageAlternates(path),
      types: { 'application/rss+xml': `${SITE.url}/rss.xml` },
    },
    openGraph: {
      type: 'website',
      siteName: common[locale].site.name,
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, path),
      description,
      // 사진도 대체 글을 단다. 그림을 못 받았을 때, 카드를 읽어 주는 스크린리더에 남는 것이 이 글이다.
      // 사진은 크기가 페이지마다 달라 적지 않는다 — 틀린 크기는 카톡이 자리를 잘못 잡게 한다.
      // 제목 그림(/og)은 Pretendard로 그려 한글·영문만 된다. 외국어 판은 글자 없는 홈 그림(로고)을 쓴다.
      images: [
        image
          ? { url: image, alt: title }
          : ogImage(locale === DEFAULT_LOCALE ? path : '/', title),
      ],
    },
    twitter: { card: 'summary_large_image', description },
  };
}

export const SEO_LIMITS = { TITLE_MAX, DESC_MIN, DESC_MAX } as const;
