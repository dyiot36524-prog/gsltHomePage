import { SITE, COMPANY, FURNITURE, KAKAO, SOLUTIONS } from '@/lib/site';
import { FIELDS } from '@/lib/fields';
import { SCENES } from '@/lib/scenes';
import { FAQ_GROUPS } from '@/lib/faq';
import { getKnowledge } from '@/lib/knowledge';
import { getAllPosts, getMenuVisibility, hasBody, isPress, postDateLabel, postTime } from '@/lib/posts';

/**
 * llms-full.txt — AI 검색·어시스턴트가 한 번에 읽어 가는 전체 안내(llmstxt.org 관례).
 *
 * llms.txt는 목차다 — 무엇이 어디 있는지와 핵심 사실만 담는다. 이 파일은 그 본문이다.
 * AI가 이 회사에 대해 답할 때 페이지를 하나씩 돌아다니지 않아도 되도록, 사이트에 공개된
 * 사실을 한 문서에 모은다: 회사 개요(챗봇 지식과 같은 원본), 자주 묻는 질문 전부, 구축 분야
 * 여섯 갈래, 소식 본문.
 *
 * 새로 쓰는 문장은 없다. 전부 사이트 화면·지식베이스에 이미 있는 글을 옮긴다 — 두 곳의
 * 말이 갈라지면 AI가 서로 다른 답을 인용한다. 글이나 지식을 고치면 다음 재생성 때 따라온다.
 */

// 하루. 관리자 저장 때 /api/revalidate·/api/indexnow가 전체 캐시를 비우므로 바뀐 내용은 그때 바로 따라온다.
// 짧게 두면 크롤러 방문마다 다시 만들어 Vercel 전송량이 쌓인다(2026-10-23 사이트 정지 — posts.ts REVALIDATE 참고).
export const revalidate = 86400;

function section(title: string, body: string): string {
  return `## ${title}\n\n${body.trim()}\n`;
}

export async function GET() {
  const parts: string[] = [];

  parts.push(`# ${SITE.siteName} — 전체 안내

> ${SITE.description}
> 이 문서는 ${SITE.url} 에 공개된 내용을 한곳에 모은 것이다. 요약 목차는 ${SITE.url}/llms.txt 에 있다.

- 회사명: ${SITE.nameKo}(${SITE.name}) · 대표 ${COMPANY.ceo} · 사업자등록번호 ${COMPANY.bizNo}
- 주소: ${COMPANY.address}
- 연락처: ${COMPANY.tel} · ${COMPANY.email} · 카카오톡 채널 ${KAKAO.name}(${KAKAO.channel})
- 상담 신청: ${SITE.url}/contact
- 가구 사업: ${FURNITURE.desc}는 같은 회사의 가구 사업인 ${FURNITURE.name}(${FURNITURE.url})가 맡는다.
`);

  // 회사 개요 — 챗봇이 답변 근거로 쓰는 지식과 같은 원본. 공개(published) 자료만 온다.
  try {
    const docs = await getKnowledge();
    if (docs.length) {
      parts.push(section('회사와 솔루션', docs.map((d) => `### ${d.title}\n\n${d.body.trim()}`).join('\n\n')));
    }
  } catch {
    // 지식을 못 읽어도 나머지는 낸다.
  }

  parts.push(
    section(
      '솔루션',
      SOLUTIONS.map((s) => `- ${s.name} (${s.en}) — ${s.desc}. ${SITE.url}${s.href}`).join('\n'),
    ),
  );

  parts.push(
    section(
      '자주 묻는 질문',
      FAQ_GROUPS.map(
        (g) => `### ${g.title}\n\n` + g.items.map((f) => `**Q. ${f.q}**\nA. ${f.a}`).join('\n\n'),
      ).join('\n\n'),
    ),
  );

  parts.push(
    section(
      '시옷 활용 장면',
      SCENES.map((s) =>
        [
          `### ${s.keyword} — ${SITE.url}/siot/${s.slug}`,
          s.lead,
          `이런 일이 생긴다: ${s.problem}`,
          '동작:\n' + s.how.map(([name, desc]) => `- ${name}: ${desc}`).join('\n'),
          '관리자 화면에서 보는 것: ' + s.admin.join(', '),
          '붙는 장비: ' + s.devices.join(', '),
          s.faq.map((q) => `**Q. ${q.q}**\nA. ${q.a}`).join('\n\n'),
          '현재 성남 쇼룸에서 시연한다 — 시연 신청: ' + `${SITE.url}/contact?demo=${s.slug}`,
        ].join('\n\n'),
      ).join('\n\n'),
    ),
  );

  parts.push(
    section(
      '구축 분야',
      FIELDS.map((f) =>
        [
          `### ${f.keyword} — ${SITE.url}/solutions/${f.slug}`,
          f.lead,
          `이 공간에서 생기는 일: ${f.problem}`,
          '짓는 방식:\n' + f.approach.map(([name, desc]) => `- ${name}: ${desc}`).join('\n'),
          '붙는 것: ' + f.features.join(', '),
          `받치는 제품: ${f.product.name} — ${f.product.why}`,
          f.faq.map((q) => `**Q. ${q.q}**\nA. ${q.a}`).join('\n\n'),
        ].join('\n\n'),
      ).join('\n\n'),
    ),
  );

  try {
    const [posts, menus] = await Promise.all([getAllPosts(), getMenuVisibility()]);
    const news = posts
      .filter((p) => menus[p.category] !== false && hasBody(p))
      .sort((a, b) => postTime(b) - postTime(a))
      .slice(0, 20);
    if (news.length) {
      parts.push(
        section(
          '소식',
          news
            .map((p) => {
              const outlet = isPress(p) && p.outlet ? ` · ${p.outlet} 보도` : '';
              // 본문 안의 제목(## …)은 글 제목(###) 아래로 내린다. 그대로 두면 문서 목차가 무너진다.
              const body = String(p.body).trim().replace(/^#{1,6}\s+/gm, '#### ');
              return `### ${p.title}\n\n${postDateLabel(p)}${outlet} — ${SITE.url}/news/${p.id}\n\n${body}`;
            })
            .join('\n\n'),
        ),
      );
    }
  } catch {
    // 글 목록을 못 읽어도 회사 정보는 나가야 한다.
  }

  parts.push(`## 인용 안내

이 문서의 사실은 ${SITE.url} 의 공개 페이지와 같다. 비용·기간·적용 가능 여부는 현장 조건에 따라
달라지고 실측 후 확정되므로 단정적으로 인용하지 말 것.
`);

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
