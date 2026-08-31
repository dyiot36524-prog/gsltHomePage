import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

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

/** 템플릿 ' | GSLT'(7자)를 포함한 전체 길이 상한. */
const TITLE_MAX = 30;
/** 설명 권장 폭. 짧으면 정보가 부족하고 길면 잘린다. */
const DESC_MIN = 60;
const DESC_MAX = 85;

function warn(kind: string, value: string, max: number) {
  if (process.env.NODE_ENV === 'production') return;
  // 빌드를 멈추지는 않는다 — 글자 수는 사람이 판단할 여지가 있고,
  // 배포본 검사(seo-check.mjs)가 최종 관문이다.
  console.warn(
    `[seo] ${kind}가 ${value.length}자로 상한 ${max}자를 넘었습니다. 검색 결과에서 잘립니다.\n      "${value}"`,
  );
}

type PageSeoInput = {
  /** ' | GSLT'를 뺀 제목. */
  title: string;
  description: string;
  /** '/siot' 처럼 앞에 슬래시가 붙은 경로. */
  path: string;
  /** 지정하지 않으면 공용 OG 이미지. */
  image?: string;
};

/**
 * 페이지 메타데이터를 한 벌로 만든다.
 *
 * canonical·openGraph·twitter를 페이지마다 손으로 쓰면 하나씩 빠진다. 실제로 홈의
 * canonical만 슬래시가 빠져 sitemap과 어긋나 있었다.
 */
export function pageSeo({ title, description, path, image }: PageSeoInput): Metadata {
  const full = `${title} | ${SITE.name}`;
  if (full.length > TITLE_MAX) warn('제목', full, TITLE_MAX);
  if (description.length > DESC_MAX) warn('설명', description, DESC_MAX);
  if (description.length < DESC_MIN && process.env.NODE_ENV !== 'production') {
    console.warn(`[seo] 설명이 ${description.length}자로 짧습니다(권장 ${DESC_MIN}자 이상). "${description}"`);
  }

  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: 'ko_KR',
      url,
      title: full,
      description,
      images: [image || '/img/og-image.png'],
    },
    twitter: { card: 'summary_large_image', title: full, description },
  };
}

export const SEO_LIMITS = { TITLE_MAX, DESC_MIN, DESC_MAX } as const;
