import 'server-only';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/**
 * 관리자가 쓴 마크다운을 서버에서 HTML로 만든다.
 *
 * 작성자는 관리자 한 명뿐이지만, 계정이 털렸을 때 저장된 본문이 그대로 실행되지 않도록
 * 산출물을 반드시 소독한다. 렌더가 서버에서 끝나므로 크롤러에도 본문이 그대로 보인다.
 *
 * 소독기로 isomorphic-dompurify(jsdom 기반)를 쓰면 Vercel 서버리스에서 전이 의존성이
 * ERR_REQUIRE_ESM으로 깨진다(실제로 배포에서 상세 페이지가 500이 났다).
 * sanitize-html은 htmlparser2 기반 순수 JS라 같은 런타임에서 문제없이 돈다.
 */
export function renderMarkdown(src: string): string {
  // '## 제목' 처럼 # 뒤 공백을 빠뜨려도 제목으로 인식되게 보정한다.
  // 관리자가 실제로 자주 내는 실수라 원본 사이트에서도 같은 보정을 넣어 뒀다.
  const forgiving = String(src || '').replace(/^(#{1,6})([^#\s])/gm, '$1 $2');
  const html = marked.parse(forgiving, { async: false, breaks: true, gfm: true }) as string;

  return sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'blockquote', 'pre', 'code',
      'ul', 'ol', 'li', 'strong', 'em', 'del',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    // 본문에서 나가는 링크는 새 탭 + 참조 차단
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: /^https?:\/\//i.test(attribs.href || '')
          ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' }
          : attribs,
      }),
    },
  });
}
