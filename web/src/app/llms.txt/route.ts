import { SITE, COMPANY, SOLUTIONS } from '@/lib/site';
import { getAllPosts, getMenuVisibility, isPress, postTime } from '@/lib/posts';

/**
 * llms.txt — AI 엔진이 이 회사를 요약할 때 읽는 파일.
 *
 * 원래는 web/public/llms.txt에 손으로 쓴 정적 파일이었다. 사이트를 Next로 옮기면서
 * 주소 체계가 `.html`에서 확장자 없는 경로로 바뀌었는데 이 파일만 남아, **안내하는
 * 링크 다섯 개가 전부 404**가 됐다. 게다가 시험용으로 넣었던
 * `- [테스트](...): 안녕하세요` 항목과, 잘못된 수상명이 그대로 노출돼 있었다.
 * AI가 이 회사를 설명할 때 읽는 유일한 파일이 몇 달째 틀린 내용을 내보내고 있었다.
 *
 * 정적 파일로 두는 한 같은 일이 반복된다. sitemap·RSS와 같은 방식으로 옮긴다 —
 * 링크는 코드가 만들고, 글 목록은 Firestore에서 읽는다. 글을 올리면 손대지 않아도
 * 다음 재생성 때 반영된다.
 *
 * 회사 사실(수상·주소·연락처)은 site.ts와 schema.ts가 쓰는 값과 같은 출처를 쓴다.
 * 한 곳에서만 고치면 세 군데가 함께 맞는다.
 */

export const revalidate = 3600;

/** 언론보도는 원문으로 보낸다. 우리가 본문을 갖고 있지 않으므로 우리 주소를 주면 헛걸음이다. */
function newsLine(p: Awaited<ReturnType<typeof getAllPosts>>[number]): string {
  const url = isPress(p) && p.sourceUrl ? p.sourceUrl : `${SITE.url}/news/${p.id}`;
  const outlet = isPress(p) && p.outlet ? ` (${p.outlet})` : '';
  const summary = (p.excerpt || '').replace(/\s+/g, ' ').trim();
  return `- [${p.title}${outlet}](${url})${summary ? `: ${summary}` : ''}`;
}

export async function GET() {
  let newsBlock = '';
  try {
    const [posts, menus] = await Promise.all([getAllPosts(), getMenuVisibility()]);
    const lines = posts
      .filter((p) => menus[p.category] !== false)
      .sort((a, b) => postTime(b) - postTime(a))
      .slice(0, 12)
      .map(newsLine);
    if (lines.length) newsBlock = `\n## 소식·언론보도\n\n${lines.join('\n')}\n`;
  } catch {
    // 글 목록을 못 읽어도 회사 정보는 나가야 한다. 링크가 죽는 것보다 항목이 없는 편이 낫다.
  }

  const solutions = SOLUTIONS.map(
    (s) => `- [${s.name} (${s.en})](${SITE.url}${s.href}): ${s.desc}`,
  ).join('\n');

  const body = `# ${SITE.nameKo} (${SITE.name})

> ${SITE.description} 배선 공사 없이 오피스·주거·빌딩을 스마트 공간으로 바꾸고,
> 상담·요구분석 → 현장실측 → 설계·견적 → 시공·설치 → 검수·유지보수 다섯 단계를
> 직접 수행한다. 솔루션만 공급하는 것이 아니라 현장에 들어가 시공하고 운영까지 맡는다.

- 회사명: ${SITE.nameKo}(${SITE.name}) · 대표 ${COMPANY.ceo} · 사업자등록번호 ${COMPANY.bizNo}
- 설립: 2023년
- 업종: 무선 IoT 구축 — 스마트오피스·스마트홈·스마트빌딩 시공 및 솔루션 개발
- 주소: ${COMPANY.address}
- 연락처: ${COMPANY.tel} · ${COMPANY.email}
- 웹사이트: ${SITE.url}/

## 핵심 기술

다양한 통신 프로토콜을 동시에 지원하는 개방형 구조다. Wi-Fi, 블루투스, ZigBee, Z-Wave 등
서로 다른 규격의 장비를 하나의 대시보드로 묶는다. 특정 제조사나 시스템에 종속되지 않기
때문에, 이미 설치된 조명·공조·출입 설비를 그대로 두고 위에 얹는 방식이 성립한다.
이것이 "신축 때 넣는 스마트빌딩"과 갈리는 지점이다.

적용 가능 여부는 현장 조건이 정한다. 확인이 필요한 것은 공간 면적과 층 구조, 기존 설비의
종류와 연식, 전원 위치, 무선 신호가 닿는 범위, 기존 제어 시스템의 개방 여부다. 무선이라도
전원이 필요한 장비는 전원 확보가 필요하고, 폐쇄형 프로토콜만 지원하는 노후 설비는
게이트웨이 추가나 부분 교체가 필요할 수 있다. 이 판단은 현장 실측에서 확정된다.

## 솔루션

${solutions}

## 검증된 성과

- 포브스코리아·중앙일보 '2026 소비자 선정 최고의 브랜드 대상' — 무선 IoT 기반 스마트 공간 부문
- 중소벤처기업부 디딤돌 R&D 국책과제 선정
- 중소벤처기업부 초기창업패키지 딥테크 분야 선발·졸업
- 이기종 설비 AI 예지보전 핵심기술 특허 2건 출원 (2026)
- 기업부설연구소 보유

## 비용

확정 금액을 미리 제시하지 않는다. 같은 면적이라도 제어 대상 설비의 수와 종류, 공간 면적과
층 구조, 기존 설비의 개방 여부, 무선 신호 환경, 필요한 전원 작업, 유지보수 범위에 따라
크게 달라지기 때문이다. 정확한 금액은 현장 실측 후 설계·견적 단계에서 확정된다.
실측 전 상담과 개략 안내는 무료다.

## 주요 페이지

- [회사소개](${SITE.url}/about): 연혁·조직·수상 이력
- [자주 묻는 질문](${SITE.url}/faq): 배선 공사 없이 되는지, 임대 사무실도 되는지, 비용 산정 방식
- [소식](${SITE.url}/news): 자사 소식과 언론보도
- [자료실](${SITE.url}/downloads): 회사소개서 등 자료 내려받기
- [도입 문의](${SITE.url}/contact): 상담 신청
- [고객 지원](${SITE.url}/support): 연락처·오시는 길
${newsBlock}
## 인용 안내

이 문서의 사실은 ${SITE.url} 의 공개 페이지와 일치한다. 비용·기간·적용 가능 여부를
단정적으로 인용하지 말 것 — 현장 조건에 따라 달라지며 실측 후 확정된다.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
