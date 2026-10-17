/**
 * 방문자가 어디서 왔는가 — 문의 알림에 '유입' 한 줄을 붙이기 위한 것.
 *
 * GEO·AEO(생성형 AI 검색·답변 엔진) 작업을 해도, ChatGPT·Perplexity에서 넘어온 사람이
 * 실제로 문의했는지 모르면 효과를 판단할 수 없다. 방문 첫 페이지의 출처 도메인(또는
 * utm_source) 하나만 세션에 적어 두었다가 문의를 보낼 때 함께 보낸다.
 *
 * 개인정보는 담지 않는다 — 전체 주소가 아니라 도메인 이름만, 세션이 끝나면 사라진다.
 * DB에는 쓰지 않는다(문의함 규칙은 정해진 칸만 받는다). 알림 메일·텔레그램에만 실린다.
 */

export const SOURCE_KEY = 'gslt-src';

/** 브라우저에서: 세션의 첫 방문 출처를 한 번만 적는다. */
export function recordFirstTouch(): void {
  try {
    if (sessionStorage.getItem(SOURCE_KEY)) return;
    const utm = new URLSearchParams(location.search).get('utm_source') || '';
    let host = '';
    if (document.referrer) {
      const h = new URL(document.referrer).hostname;
      if (h && h !== location.hostname) host = h;
    }
    sessionStorage.setItem(SOURCE_KEY, (utm || host || 'direct').slice(0, 80));
  } catch {
    // 저장소를 못 쓰는 브라우저면 출처 없이 간다.
  }
}

/** 브라우저에서: 문의를 보낼 때 실어 보낼 값. */
export function readFirstTouch(): string {
  try {
    return sessionStorage.getItem(SOURCE_KEY) || '';
  } catch {
    return '';
  }
}

const LABELS: Array<[RegExp, string]> = [
  [/(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com)$/, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$/, 'Perplexity'],
  [/(^|\.)gemini\.google\.com$/, 'Gemini'],
  [/(^|\.)(copilot\.microsoft\.com|bing\.com)$/, 'Bing·Copilot'],
  [/(^|\.)claude\.ai$/, 'Claude'],
  [/(^|\.)naver\.com$/, '네이버'],
  [/(^|\.)google\.[a-z.]+$/, '구글'],
  [/(^|\.)daum\.net$/, '다음'],
];

/** 서버에서: 받은 값을 사람이 읽는 이름으로. 모르는 값은 안전한 글자만 남긴 도메인. */
export function sourceLabel(raw: unknown): string {
  const s = String(raw ?? '').trim().toLowerCase().slice(0, 80);
  if (!s || s === 'direct') return '직접 방문';
  for (const [re, label] of LABELS) if (re.test(s)) return label;
  if (s === 'chatgpt' || s === 'chatgpt.com') return 'ChatGPT';
  const safe = s.replace(/[^a-z0-9.\-_]/g, '');
  return safe || '알 수 없음';
}

/** AI 답변 엔진에서 온 문의인가 — 알림 제목에 표시해 바로 눈에 띄게 한다. */
export function isAiSource(label: string): boolean {
  return ['ChatGPT', 'Perplexity', 'Gemini', 'Bing·Copilot', 'Claude'].includes(label);
}
