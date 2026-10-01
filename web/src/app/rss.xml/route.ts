import { SITE, COMPANY } from '@/lib/site';
import { getAllPosts, getMenuVisibility, hasBody, isPress, postTime, CATEGORY_LABEL } from '@/lib/posts';
import { renderMarkdown } from '@/lib/markdown';

/**
 * rss.xml — 구 사이트에 있던 피드를 새 주소로 되살린 것이다.
 *
 * 언론보도도 싣되 link는 우리 지면으로 낸다. 네이버 서치어드바이저의 RSS 제출은
 * "내 사이트의 이 주소들을 수집해 달라"는 요청이라 항목 link가 남의 도메인이면 거절된다.
 * 한때 5건 중 4건이 언론사 링크여서 제출이 막혔다. 이제 언론보도도 우리 지면이 있어
 * 모든 항목이 자사 도메인을 가리킨다.
 *
 * **본문 전체를 싣는다**(content:encoded). 네이버 서치어드바이저 가이드가 "사이트 내의
 * 최신글은 본문 전체를 포함하여 RSS 피드에 담아 달라"고 한다. 전에는 요약만 내보냈다.
 * 언론보도 글의 본문은 기사 원문이 아니라 우리가 쓴 요약이라(news/[id] 참고) 그대로 실어도
 * 남의 글을 복제하는 일이 없다. description(요약)은 모든 항목에 반드시 넣는다.
 *
 * 본문 없이 파일만 있는 자료실 항목은 뺀다 — 제목과 파일 이름뿐인 얇은 지면을 수집해 달라고
 * 할 이유가 없다(sitemap도 같은 기준).
 */
export const revalidate = 600;

/** CDATA 안에 그대로 넣으면 구간이 끝나 버리는 ']]>'를 쪼갠다. */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

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
    posts = all.filter((p) => menus[p.category] !== false && hasBody(p));
  } catch {
    // 목록을 못 읽어도 빈 피드를 정상 응답으로 낸다. 500을 내면 구독기가 피드를 죽은 것으로 본다.
  }

  const items = posts
    .slice()
    .sort((a, b) => postTime(b) - postTime(a))
    .slice(0, 50)
    .map((p) => {
      const link = `${SITE.url}/news/${p.id}`;
      const cat = CATEGORY_LABEL[p.category] ?? '소식';
      const outlet = isPress(p) && p.outlet ? ` (${p.outlet})` : '';
      const summary = (p.excerpt || '').trim() || p.title;
      return [
        '    <item>',
        `      <title>${esc(p.title)}${esc(outlet)}</title>`,
        `      <link>${esc(link)}</link>`,
        `      <guid isPermaLink="true">${esc(link)}</guid>`,
        `      <pubDate>${new Date(postTime(p)).toUTCString()}</pubDate>`,
        `      <category>${esc(cat)}</category>`,
        `      <description>${esc(summary)}</description>`,
        `      <content:encoded>${cdata(renderMarkdown(p.body || ''))}</content:encoded>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
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
