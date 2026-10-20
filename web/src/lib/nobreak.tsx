/**
 * 화면에 그릴 때만 줄바꿈 자리를 붙잡는다 — 데이터 문자열은 건드리지 않는다.
 *
 * break-keep(keep-all)은 한글 어절 중간의 줄바꿈만 막는다. 하이픈 뒤('070-/8676-3470',
 * 'Wi-/Fi', '2026-02-/27')와 가운뎃점 앞('회의실/·휴게공간')은 그대로 끊겨, 휴대폰 폭에서 번호가
 * 두 줄로 갈리고 줄 첫머리에 '·'가 온다. 그래서 그릴 때
 *   - 전화번호, 특허번호('제10-2659230호'), ISO 날짜('2026-02-27'), Wi-Fi·Z-Wave,
 *     '3차 501호' 같은 주소 끝은 whitespace-nowrap 한 덩어리로 감싸고,
 *   - '·' 앞에는 U+2060(단어 결합자)을 넣어 가운뎃점이 줄 첫머리에 오지 않게 한다. 띄어 쓴
 *     ' · '는 앞 공백을 U+00A0(줄바꿈 없는 공백)으로 바꾼다 — Chrome은 공백 바로 뒤를 늘 줄바꿈
 *     자리로 봐서, 공백과 '·' 사이에 단어 결합자를 넣어도 '휴게실 예약 / · 재실 현황판'으로 '·'가 내려갔다.
 *
 * 보이지 않는 문자는 렌더한 화면에만 들어간다. lib/faq.ts·fields.ts의 원문은 FAQPage 구조화
 * 데이터와 llms.txt에도 그대로 쓰이므로, 원문에 넣으면 AI가 인용하는 문장에 섞인다.
 * 소식 글도 같다 — 제목·요약·본문 원문은 JSON-LD·메타 설명·RSS·llms.txt에도 나간다. RSS 본문은
 * renderMarkdown 결과를 그대로 쓰므로, noBreakHtml은 renderMarkdown 안이 아니라 상세 화면에서만 부른다.
 */

// split에 캡처 그룹을 주면 붙잡은 덩어리가 홀수 칸에 온다. 번호 앞뒤가 숫자면 다른 번호의
// 일부라 잡지 않는다(사업자등록번호 같은 것). 특허번호는 FAQ 답변에서 '제10-/2659230호'로
// 하이픈 뒤가 갈렸다 — '제'와 '호'까지 함께 묶는다. ISO 날짜는 회사소개 포브스 캡션이 280px에서
// '2026-02-/27'로 갈렸다.
const KEEP = /((?<!\d)0\d{1,2}-\d{3,4}-\d{4}(?!\d)|제?(?<!\d)\d{2}-\d{7}(?!\d)호?|(?<!\d)\d{4}-\d{2}-\d{2}(?!\d)|Wi-Fi|Z-Wave|\d+차 \d+호)/;
const WORD_JOINER = '\u2060';
const NBSP = '\u00a0';

function joinDots(s: string) {
  return s.replace(/ ?·/g, (m) => (m === '·' ? `${WORD_JOINER}·` : `${NBSP}·`));
}

export function NoBreak({ children }: { children: string }) {
  const parts = children.split(KEEP);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <span key={i} className="whitespace-nowrap">
            {p}
          </span>
        ) : (
          joinDots(p)
        ),
      )}
    </>
  );
}

/**
 * 같은 규칙을 HTML 문자열에 입힌다 — 소식 상세의 본문(마크다운을 렌더한 bodyHtml) 전용.
 *
 * 글자 마디만 고친다. 태그와 그 속성값(링크 주소·이미지 alt)은 그대로 두고, <code>·<pre> 안은
 * 적힌 그대로가 뜻이라 손대지 않는다. 입력은 sanitize-html을 거친 산출물이어야 한다 — 소독기는
 * 글자와 속성값 안의 '<'·'>'를 늘 '&lt;'·'&gt;'로 바꿔 두므로, '<'에서 다음 '>'까지가 곧 태그 하나다.
 *
 * 화면에 그릴 문자열에만 쓴다. JSON-LD·RSS·llms.txt·메타 설명에 들어가는 원문에 쓰면 보이지
 * 않는 문자가 인용문에 섞인다.
 */
export function noBreakHtml(html: string): string {
  let raw = 0; // 열려 있는 <code>·<pre> 깊이. 0일 때만 글자를 고친다.
  return html
    .split(/(<[^>]*>)/)
    .map((part, i) => {
      if (i % 2) {
        const tag = /^<(\/?)(?:code|pre)\b/i.exec(part);
        if (tag) raw = Math.max(0, raw + (tag[1] ? -1 : 1));
        return part;
      }
      if (raw || !part) return part;
      return part
        .split(KEEP)
        .map((p, j) => (j % 2 ? `<span class="whitespace-nowrap">${p}</span>` : joinDots(p)))
        .join('');
    })
    .join('');
}

/**
 * 마지막 두 어절을 U+00A0으로 잇는다 — 제목·요약의 마지막 줄에 '출원'·'소개' 한 단어만 남지 않게.
 * 이어 붙인 덩어리가 길면 좁은 칸에서 넘치므로, 띄어쓰기까지 max자(기본 8) 이하일 때만 잇는다('2건 출원'·'기업 소개').
 * 넓은 문단(뉴스 요약, 300px에서도 한 줄 16자 안팎)은 더 길게 잇는다.
 */
export function bindLastWords(s: string, max = 8): string {
  const m = /(\S+) (\S+)$/.exec(s);
  return m && m[0].length <= max ? `${s.slice(0, m.index)}${m[1]}${NBSP}${m[2]}` : s;
}
