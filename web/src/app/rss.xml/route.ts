import { SITE, COMPANY } from '@/lib/site';
import { getAllPosts, getMenuVisibility, isPress, postTime, safeHttpUrl, CATEGORY_LABEL } from '@/lib/posts';

/**
 * rss.xml — 구 사이트에 있던 피드를 새 주소로 되살린 것이다.
 *
 * 언론보도는 싣지 않는다. 네이버 서치어드바이저의 RSS 제출은 "내 사이트의 이 주소들을
 * 수집해 달라"는 요청이라, 항목 link가 남의 도메인이면 수집 대상이 아니라서 거절된다.
 * 실제로 5건 중 4건이 조선비즈·이코노미스트·한국경제TV·포브스코리아 링크였고 제출이 막혔다.
 * 우리는 기사 본문을 갖고 있지 않아 우리 주소로 보낼 수도 없다(상세는 원문으로 넘긴다).
 * sitemap이 같은 이유로 이미 press를 빼고 있었는데 피드만 어긋나 있었다.
 *
 * description에 본문을 넣지 않는다 — 자사 글도 excerpt까지만 내보내 전문을 복제하지 않는다.
 */
export const revalidate = 600;

/** XML에 그대로 넣으면 깨지는 문자를 막는다. CDATA를 쓰더라도 ]]> 는 여전히 위험하다. */
function esc(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    // 관리자에서 끈 분류는 피드에도 싣지 않는다. 사이트에서 내린 글이 구독기에는
    // 계속 흘러가면 내린 의미가 없다.
    const [all, menus] = await Promise.all([getAllPosts(), getMenuVisibility()]);
    posts = all.filter((p) => !isPress(p) && menus[p.category] !== false);
  } catch {
    // 목록을 못 읽어도 빈 피드를 정상 응답으로 낸다. 500을 내면 구독기가 피드를 죽은 것으로 본다.
  }

  const items = posts
    .slice()
    .sort((a, b) => postTime(b) - postTime(a))
    .slice(0, 50)
    .map((p) => {
      const link = isPress(p)
        ? safeHttpUrl(p.sourceUrl) || `${SITE.url}/news`
        : `${SITE.url}/news/${p.id}`;
      const cat = CATEGORY_LABEL[p.category] ?? '소식';
      const outlet = isPress(p) && p.outlet ? ` (${p.outlet})` : '';
      return [
        '    <item>',
        `      <title>${esc(p.title)}${esc(outlet)}</title>`,
        `      <link>${esc(link)}</link>`,
        // 언론보도는 우리 주소가 없으므로 원문 URL을 식별자로 쓴다(isPermaLink=false).
        `      <guid isPermaLink="${isPress(p) ? 'false' : 'true'}">${esc(isPress(p) ? `gslt-press-${p.id}` : link)}</guid>`,
        `      <pubDate>${new Date(postTime(p)).toUTCString()}</pubDate>`,
        `      <category>${esc(cat)}</category>`,
        p.excerpt ? `      <description>${esc(p.excerpt)}</description>` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.nameKo)}(${esc(SITE.name)}) 소식</title>
    <link>${SITE.url}/news</link>
    <description>${esc(SITE.description)}</description>
    <language>ko</language>
    <managingEditor>${esc(COMPANY.email)} (${esc(SITE.nameKo)})</managingEditor>
    <lastBuildDate>${new Date(posts.length ? postTime(posts[0]) : Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600',
    },
  });
}
