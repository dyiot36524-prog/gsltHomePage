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
 * 언론보도도 넣는다. 예전에는 상세가 원문으로 바로 넘어가 색인할 것이 없었지만, 이제
 * 제목·우리가 쓴 요약·매체·일자·원문 링크를 담은 우리 지면이 있다. 이 회사를 다룬
 * 보도가 검색에서 우리 주소로 잡히려면 이 주소들이 목록에 있어야 한다.
 *
 * 관리자에서 끈 분류는 목록도 개별 글도 넣지 않는다. 처음엔 '숨김은 메뉴에서만 빼는 것'
 * 으로 보고 개별 글을 남겼는데, 그러면 끈 글이 계속 색인되어 검색결과로 닿는다.
 * 숨김은 공개를 접는 것이고, 사이트는 그 글에 404를 낸다 — 목록에 넣으면 거짓말이 된다.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const fixed: MetadataRoute.Sitemap = [
    // 홈은 슬래시 없이 낸다. next.config의 trailingSlash: false 때문에 Next가
    // canonical을 슬래시 없는 주소로 정규화하는데, sitemap만 슬래시를 붙이면
    // 같은 페이지를 두 주소로 신고하는 셈이 된다. 정규화하는 쪽에 맞춘다.
    { url: base, changeFrequency: 'weekly', priority: 1.0 },
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
      .filter((p) => menus[p.category] !== false)
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
