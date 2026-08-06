/**
 * Firestore 조회 (서버 전용).
 *
 * 클라이언트 SDK 대신 REST를 쓴다. 서버 컴포넌트에서 그대로 돌고, 발행 글은
 * 보안 규칙상 익명 읽기가 허용돼 있어 인증이 필요 없다. 이 덕분에 목록·상세가
 * 서버에서 완성된 HTML로 나가고, 기존의 seo-sync 정적 스냅샷 우회가 필요 없어진다.
 */

import 'server-only';

const PROJECT_ID = 'gslthomepage';
// 공개용 웹 API 키. 실제 권한은 Firestore 보안 규칙이 통제한다 (비밀이 아님).
const API_KEY = 'AIzaSyCjnuHSGhy97XOtoVC1fSwnGInLwVs1wok';

export type Category = 'news' | 'portfolio' | 'downloads';

export const CATEGORY_LABEL: Record<Category, string> = {
  news: '뉴스',
  portfolio: '포트폴리오',
  downloads: '자료실',
};

export type Attachment = { name: string; url: string; size?: number };
export type Mirror = { label: string; url: string };

export type Post = {
  id: string;
  category: Category;
  /** 없으면 'article'. 'press'는 우리가 본문을 소유하지 않는 외부 기사. */
  type?: 'article' | 'press';
  title: string;
  excerpt?: string;
  body?: string;
  thumbnail?: string;
  tags?: string[];
  attachments?: Attachment[];
  published?: boolean;
  pinned?: boolean;
  views?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  /* press 전용 */
  sourceUrl?: string;
  outlet?: string;
  reporter?: string;
  publishedAt?: string;
  mirrors?: Mirror[];
};

/* ── Firestore 값 디코딩 ── */
type FsValue = Record<string, unknown>;

function decode(v: FsValue | null | undefined): unknown {
  if (v == null) return null;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.timestampValue !== undefined) return new Date(v.timestampValue as string);
  if (v.nullValue !== undefined) return null;
  if (v.arrayValue) {
    const a = v.arrayValue as { values?: FsValue[] };
    return (a.values || []).map(decode);
  }
  if (v.mapValue) {
    const m = v.mapValue as { fields?: Record<string, FsValue> };
    return Object.fromEntries(Object.entries(m.fields || {}).map(([k, x]) => [k, decode(x)]));
  }
  return null;
}

const ENDPOINT =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
  `/databases/(default)/documents:runQuery?key=${API_KEY}`;

/** 목록은 60초마다 재생성. 관리자가 글을 올리면 늦어도 1분 안에 반영된다. */
const REVALIDATE = 60;

async function runQuery(body: unknown): Promise<Post[]> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) {
    throw new Error(`Firestore query failed: ${res.status} ${await res.text()}`);
  }
  const rows = (await res.json()) as Array<{ document?: { name: string; fields?: Record<string, FsValue> } }>;
  return rows
    .filter((r) => r.document)
    .map((r) => {
      const doc = r.document!;
      const fields = Object.fromEntries(
        Object.entries(doc.fields || {}).map(([k, v]) => [k, decode(v)]),
      );
      return { id: doc.name.split('/').pop()!, ...fields } as Post;
    });
}

export function isPress(p: Post): boolean {
  return p.type === 'press' && /^https?:\/\//i.test(String(p.sourceUrl || ''));
}

/** 정렬 기준 시각. press는 기사 발행일이라야 자사 글과 시간순이 섞이지 않는다. */
export function postTime(p: Post): number {
  if (isPress(p) && p.publishedAt) {
    const t = Date.parse(`${String(p.publishedAt).slice(0, 10)}T00:00:00+09:00`);
    if (!Number.isNaN(t)) return t;
  }
  return p.createdAt instanceof Date ? p.createdAt.getTime() : 0;
}

/** 카드에 찍을 날짜. press는 기사 발행일, 그 외는 등록일. */
export function postDateLabel(p: Post): string {
  if (isPress(p) && p.publishedAt) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(p.publishedAt));
    if (m) return `${m[1]}. ${m[2]}. ${m[3]}`;
  }
  return formatDate(p.createdAt);
}

export function formatDate(d?: Date | null): string {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}. ${p(d.getMonth() + 1)}. ${p(d.getDate())}`;
}

/** http(s)만 통과. javascript: 등 스킴 주입 차단. */
export function safeHttpUrl(u?: string): string {
  const s = String(u || '').trim();
  return /^https?:\/\//i.test(s) ? s : '';
}

/** 카드 목적지. press면 원문, 아니면 내부 상세. */
export function postHref(p: Post): string {
  return isPress(p) ? safeHttpUrl(p.sourceUrl) || '#' : `/news/${p.id}`;
}

export function postMirrors(p: Post): Mirror[] {
  if (!isPress(p) || !Array.isArray(p.mirrors)) return [];
  return p.mirrors
    .map((m) => ({ label: String(m?.label || '').trim(), url: safeHttpUrl(m?.url) }))
    .filter((m) => m.label && m.url);
}

/** 카테고리별 발행 글. 고정 글 우선, 이후 최신순. */
export async function getPosts(category: Category): Promise<Post[]> {
  const posts = await runQuery({
    structuredQuery: {
      from: [{ collectionId: 'posts' }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            { fieldFilter: { field: { fieldPath: 'category' }, op: 'EQUAL', value: { stringValue: category } } },
            { fieldFilter: { field: { fieldPath: 'published' }, op: 'EQUAL', value: { booleanValue: true } } },
          ],
        },
      },
    },
  });
  return posts.sort(
    (a, b) => Number(b.pinned === true) - Number(a.pinned === true) || postTime(b) - postTime(a),
  );
}

/** 모든 발행 글 (sitemap 등에서 사용) */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await runQuery({
    structuredQuery: {
      from: [{ collectionId: 'posts' }],
      where: {
        fieldFilter: { field: { fieldPath: 'published' }, op: 'EQUAL', value: { booleanValue: true } },
      },
    },
  });
  return posts.sort((a, b) => postTime(b) - postTime(a));
}

/** 상세용 단건. 없거나 비공개면 null. */
export async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/posts/${encodeURIComponent(id)}?key=${API_KEY}`,
    { next: { revalidate: REVALIDATE } },
  );
  if (!res.ok) return null;
  const doc = (await res.json()) as { name?: string; fields?: Record<string, FsValue> };
  if (!doc.name) return null;
  const fields = Object.fromEntries(
    Object.entries(doc.fields || {}).map(([k, v]) => [k, decode(v)]),
  );
  const post = { id, ...fields } as Post;
  return post.published === false ? null : post;
}
