/**
 * 챗봇 대화 기록 — 상담 신청으로 이어진 대화만.
 *
 * 방문자가 챗봇의 '담당자 연결' 폼을 보내면서 "지금까지의 대화 내용을 함께 보냅니다"를 켜 두었을
 * 때만 그 대화를 남긴다. 그냥 묻고 떠난 대화는 남기지 않는다 — 상담(계약 체결 준비)에 필요한 것만
 * 보관해야 국외 보관의 근거가 서고(개인정보 보호법 제28조의8제1항제3호), 방문자가 끈 선택도 지켜진다.
 * 관리자 화면은 이 기록으로 '상담으로 이어진 대화가 무엇을 물었는지'를 본다.
 *
 * 연락처는 저장 전에 가린다. 연락처가 남는 곳은 방문자가 직접 폼으로 확정한 inquiries뿐이어야 한다.
 *
 * 저장은 공개 키 + firestore.rules(정해진 키·크기만 허용)로 한다. inquiries와 같은 방식이다.
 * 실패해도 던지지 않는다 — 기록은 부산물이고 상담 접수가 본업이다.
 */

const PROJECT_ID = 'gslthomepage';
// posts.ts와 같은 공개용 웹 API 키. 실제 권한은 firestore.rules가 통제한다 (비밀이 아님).
const API_KEY = 'AIzaSyCjnuHSGhy97XOtoVC1fSwnGInLwVs1wok';
const COMMIT_ENDPOINT =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
  `/databases/(default)/documents:commit?key=${API_KEY}`;

/** 세션 id 형식. 클라이언트가 만든 UUID(하이픈 제거, 32자 hex)만 받는다. */
export const SESSION_RE = /^[0-9a-f]{32}$/;

/** firestore.rules의 상한과 같은 값. 바꾸면 규칙도 함께 바꿔야 한다. */
export const LOG_LIMIT = { transcript: 60000, lastUser: 2000, turns: 100 } as const;

type Turn = { role: 'user' | 'assistant'; content: string };

/** 전화번호·이메일을 가린다. 패턴은 chat/route.ts의 scrubContacts와 같다. */
export function maskContacts(text: string): string {
  return text
    .replace(/\b0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g, '[연락처]')
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, '[이메일]');
}

function transcript(turns: Turn[]): string {
  return turns
    .map((t) => `${t.role === 'user' ? '방문자' : 'AI'}: ${maskContacts(t.content)}`)
    .join('\n\n')
    .slice(0, LOG_LIMIT.transcript);
}

function docName(session: string): string {
  return `projects/${PROJECT_ID}/databases/(default)/documents/chatLogs/${session}`;
}

async function commit(write: unknown): Promise<void> {
  const res = await fetch(COMMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ writes: [write] }),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
}

/** 클라이언트가 보낸 대화를 기록용으로 고른다. 형식이 어긋난 줄은 버린다. */
function parseTurns(raw: unknown): Turn[] {
  if (!Array.isArray(raw)) return [];
  const turns: Turn[] = [];
  for (const m of raw.slice(-LOG_LIMIT.turns)) {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if ((role === 'user' || role === 'assistant') && typeof content === 'string' && content.trim()) {
      turns.push({ role, content: content.trim().slice(0, LOG_LIMIT.lastUser) });
    }
  }
  return turns;
}

/** 상담 신청과 함께 보낸 대화를 남긴다. /api/inquiry가 접수를 확정한 뒤에 부른다. */
export async function saveHandoffLog(session: string, rawTurns: unknown): Promise<void> {
  const turns = parseTurns(rawTurns);
  if (!SESSION_RE.test(session) || !turns.some((t) => t.role === 'user')) return;
  const lastUser = [...turns].reverse().find((t) => t.role === 'user');
  try {
    await commit({
      update: {
        name: docName(session),
        fields: {
          transcript: { stringValue: transcript(turns) },
          turnCount: { integerValue: String(turns.length) },
          lastUser: { stringValue: maskContacts(lastUser?.content ?? '').slice(0, LOG_LIMIT.lastUser) },
          handoff: { booleanValue: true },
        },
      },
      updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
    });
  } catch (e) {
    console.error('[chat-log] 저장 실패:', e);
  }
}
