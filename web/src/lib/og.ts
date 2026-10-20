import { sceneBySlug } from '@/lib/scenes';
import { fieldBySlug } from '@/lib/fields';
import { getPost, isHiddenCategory } from '@/lib/posts';

/**
 * 공유 이미지(og:image) — 카톡에 링크를 올리면 뜨는 그림.
 *
 * 전에는 모든 페이지가 로고 그림 한 장(/img/og-image.png)을 냈다. 대화방에 '도입 문의'를
 * 올려도 '회의실 예약 시스템'을 올려도 같은 그림이라, 무슨 페이지인지 링크 제목을 읽어야 알았다.
 * 이제 같은 브랜드 바탕에 **그 페이지 제목**이 크게 들어간다(대표님 결정, 2026-10).
 *
 * 이미지 주소에는 제목이 아니라 **페이지 경로**가 들어간다 — /og/contact, /og/news/<id>.
 * 제목은 서버가 이 파일에서 찾는다. 주소에 받은 글자를 그대로 그려 주면 누구나 우리 도메인으로
 * '아무 문구'가 찍힌 그림을 만들 수 있다. 경로만 받으면 그릴 수 있는 글자는 사이트에 실제로
 * 있는 제목뿐이다.
 *
 * 그림은 app/og/[[...path]]/route.tsx가 그린다.
 */

/**
 * 이미지 주소의 판(?v=). 그림 모양을 바꾸면 올린다.
 * 카카오는 이미지 주소마다 썸네일을 캐시하고 지워 주지 않는다 — 주소가 바뀌어야 새로 받는다.
 * 응답도 1년짜리 immutable 캐시라 같은 주소로는 CDN에서도 예전 그림이 나간다.
 */
const OG_VERSION = 1;

/** 카톡·페이스북 큰 카드 규격(1.91:1). */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/** 홈 그림의 제목. 상호는 그림 아래 줄에 들어가므로 여기서 또 쓰지 않는다. */
export const HOME_OG_TITLE = '무선 IoT 구축 전문기업';

/**
 * 제목의 지문 — 8자리 16진수(FNV-1a 32비트). 암호용이 아니라 '글자가 바뀌었는가'만 가린다.
 * metadata는 동기로 만들어지고 이 파일은 엣지(그림 라우트)에서도 돌아서, crypto.subtle(비동기)이나
 * node:crypto 대신 직접 계산한다. 같은 제목이면 어디서 계산해도 같은 값이다.
 */
export function ogTitleHash(title: string): string {
  let h = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(title)) h = Math.imul(h ^ byte, 0x01000193) >>> 0;
  return h.toString(16).padStart(8, '0');
}

/**
 * openGraph.images의 한 칸 — 페이지 경로('/contact') → 공유 이미지 주소('/og/contact?v=1&h=…').
 * 크기와 대체 글을 함께 내야 카톡이 그림을 받기 전에 자리를 잡는다.
 *
 * h는 제목의 지문이다. 판(v)은 그림 **모양**이 바뀔 때 올리고, 글자가 바뀐 것은 h가 알린다 —
 * 관리자에서 글 제목을 고치면 주소가 바뀌어 카카오·CDN이 새 그림을 받는다. 같은 주소로는
 * 카카오가 예전 썸네일을 계속 낸다(OG_VERSION 설명). 라우트는 그릴 때 h를 읽지 않는다.
 *
 * 지문은 **그림에 찍히는 제목**으로 만든다. 고정 페이지·장면·솔루션은 이 파일이 아는 제목을 쓰고
 * (홈의 alt는 상호가 붙어 그림 제목과 다르다), 글(/news/<id>)은 alt로 받은 글 제목을 쓴다 —
 * 그림 라우트도 같은 글 제목을 찍는다.
 */
export function ogImage(path: string, alt: string) {
  const p = path.replace(/\/+$/, '');
  const title = knownTitle(p || '/') ?? alt.trim();
  return { url: `/og${p}?v=${OG_VERSION}&h=${ogTitleHash(title)}`, ...OG_SIZE, alt };
}

/**
 * 고정 페이지의 제목. **각 페이지가 pageSeo·metadata에 넘기는 title과 글자 하나까지 같아야 한다.**
 * 페이지 제목을 고치고 여기를 빠뜨리면 그림만 예전 제목으로 남는다 —
 * scripts/seo-check.mjs가 그림 응답의 x-og-title과 페이지 <title>을 맞춰 보고 실패로 막는다.
 *
 * /about·/siot·/bizmoa·/morak은 지금 사진을 공유 이미지로 쓴다(pageSeo의 image).
 * 사진을 빼는 날 바로 제목 그림이 나가도록 여기 제목은 둔다.
 */
const STATIC_TITLES: Record<string, string> = {
  '/': HOME_OG_TITLE,
  '/about': '회사소개',
  '/siot': '시옷 — 공간 운영 플랫폼',
  '/bizmoa': '비즈모아 — 견적 자동화',
  '/morak': '모락 — 기수제 모임 앱',
  '/news': '소식',
  '/downloads': '자료실',
  '/portfolio': '시공사례',
  '/faq': '자주 묻는 질문',
  '/contact': '도입 문의',
  '/support': '고객 지원',
  '/legal/privacy': '개인정보 처리방침',
  '/legal/terms': '서비스 이용약관',
};

/** Firestore 문서 id. 이 모양이 아니면 조회하지 않는다 — 아무 경로나 DB 요청으로 바꾸지 않게. */
const POST_ID = /^[A-Za-z0-9_-]{1,64}$/;

/** 경로만 보고 아는 제목 — 고정 페이지·시옷 장면·솔루션. 글은 Firestore를 봐야 해서 여기서는 null. */
function knownTitle(path: string): string | null {
  if (Object.hasOwn(STATIC_TITLES, path)) return STATIC_TITLES[path];
  const [section, slug, ...rest] = path.split('/').filter(Boolean);
  if (!slug || rest.length) return null;
  if (section === 'siot') return sceneBySlug(slug)?.title ?? null;
  if (section === 'solutions') return fieldBySlug(slug)?.title ?? null;
  return null;
}

/**
 * 페이지 경로 → 그림에 넣을 제목. 사이트에 없는 경로면 null(로고만 있는 기본 그림).
 *
 * 글(/news/<id>)은 공개된 글만 제목을 낸다. 비공개 글이나 관리자에서 끈 분류의 글은
 * 페이지가 404인데 그림 주소로 제목이 새어 나가면 안 된다. Firestore 일시 장애는 그대로 던진다 —
 * 부르는 쪽이 짧은 캐시로 기본 그림을 내고, 다음 요청에서 다시 찾는다.
 *
 * 그림 라우트는 엣지에서 돈다. 여기서 부르는 것(lib/scenes·fields·posts)은 데이터와 fetch뿐이라
 * 엣지에서 그대로 돈다('server-only'는 서버 컴포넌트 층에서 빈 모듈이다). 이 파일과 그 아래에 Node 전용
 * API(node:* 모듈·fs·Buffer)를 들이면 빌드가 깨지거나, 그림이 전부 기본 그림(307)으로 넘어간다.
 */
export async function ogTitle(path: string): Promise<string | null> {
  const known = knownTitle(path);
  if (known) return known;

  const [section, slug, ...rest] = path.split('/').filter(Boolean);
  if (rest.length) return null;
  if (section === 'news' && slug && POST_ID.test(slug)) {
    const post = await getPost(slug);
    if (!post || (await isHiddenCategory(post.category))) return null;
    return post.title.trim() || null;
  }
  return null;
}
