import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllPosts, getMenuVisibility, isPress, postTime } from '@/lib/posts';

/**
 * sitemap.xml — 검색엔진에 어떤 주소가 있는지 알려준다.
 *
 * 구 사이트에는 수동으로 관리하는 sitemap.xml이 있었는데 이관하며 빠졌고, 그동안
 * 새로 만든 /contact·/support·/legal/* 과 올린 글들이 목록에 아예 없었다.
 * 이제 Firestore를 읽어 실제 발행된 글까지 자동으로 채운다 — 글을 올리면 사람이
 * 손대지 않아도 다음 재생성 때 목록에 들어간다.
 *
 * 언론보도(press)는 넣지 않는다. 본문이 우리 것이 아니라 원문으로 내보내는 링크일 뿐이라
 * 우리 사이트의 색인 대상이 아니고, 상세 페이지도 원문으로 바로 나간다.
 *
 * 메뉴에서 숨긴 분류는 목록 페이지를 빼되, 이미 발행된 개별 글은 남긴다 —
 * 숨김은 '메뉴에 안 보이게'이지 '없던 일로'가 아니다.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const fixed: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/siot`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/bizmoa`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/morak`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/support`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/legal/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/legal/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  try {
    const [posts, menus] = await Promise.all([getAllPosts(), getMenuVisibility()]);

    const lists: MetadataRoute.Sitemap = (
      [
        ['news', `${base}/news`, 0.8],
        ['downloads', `${base}/downloads`, 0.6],
        ['portfolio', `${base}/portfolio`, 0.7],
      ] as const
    )
      .filter(([key]) => menus[key])
      .map(([, url, priority]) => ({ url, changeFrequency: 'weekly' as const, priority }));

    const details: MetadataRoute.Sitemap = posts
      .filter((p) => !isPress(p))
      .map((p) => ({
        url: `${base}/news/${p.id}`,
        lastModified: new Date(postTime(p)),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

    return [...fixed, ...lists, ...details];
  } catch {
    // Firestore를 못 읽어도 sitemap 자체가 없어지면 안 된다. 고정 목록만이라도 낸다.
    return fixed;
  }
}
