/**
 * 챗봇 대화 기록.
 *
 * 지금까지 챗봇이 무슨 질문을 받는지 아무도 몰랐다. 대화는 브라우저 메모리에만 있다가
 * 탭을 닫으면 사라졌다. 그런데 **자주 묻는데 지식베이스에 없는 질문이 곧 다음 콘텐츠**다 —
 * "볼링장도 되나요"가 열 번 들어오면 볼링장 페이지를 써야 한다. 그 신호를 버리고 있었다.
 *
 * 대화 하나가 문서 하나다(id = 세션). 턴마다 문서를 통째로 다시 쓴다 — 관리자 화면에서
 * 한 줄이 한 대화가 되고, 마지막 상태만 보면 된다.
 *
 * 연락처는 저장 전에 가린다. 방문자가 채팅창에 전화번호를 적어도 이 기록에는 남지 않는다.
 * 연락처가 남는 곳은 방문자가 직접 폼으로 확정한 inquiries뿐이어야 한다.
 *
 * 저장은 공개 키 + firestore.rules(정해진 키·크기만 허용)로 한다. inquiries와 같은 방식이다.
 * 실패해도 던지지 않는다 — 기록은 부산물이고 답변이 본업이다. 규칙이 아직 게시되지 않았다면
 * 403이 로그에 남을 뿐 챗봇은 그대로 돈다.
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

export async function saveChatLog(session: string, turns: Turn[]): Promise<void> {
  if (!SESSION_RE.test(session) || turns.length === 0) return;
  const lastUser = [...turns].reverse().find((t) => t.role === 'user');
  try {
    await commit({
      update: {
        name: docName(session),
        fields: {
          transcript: { stringValue: transcript(turns) },
          turnCount: { integerValue: String(Math.min(turns.length, LOG_LIMIT.turns)) },
          lastUser: { stringValue: maskContacts(lastUser?.content ?? '').slice(0, LOG_LIMIT.lastUser) },
        },
      },
      // 마스크를 걸어 handoff 필드를 덮지 않는다 — 상담 연결 뒤에 대화가 이어져도 표시가 남는다.
      updateMask: { fieldPaths: ['transcript', 'turnCount', 'lastUser'] },
      updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
    });
  } catch (e) {
    console.error('[chat-log] 저장 실패:', e);
  }
}

/** 이 대화가 상담 신청으로 이어졌다고 표시한다. /api/inquiry가 부른다. */
export async function markHandoff(session: string): Promise<void> {
  if (!SESSION_RE.test(session)) return;
  try {
    await commit({
      update: { name: docName(session), fields: { handoff: { booleanValue: true } } },
      updateMask: { fieldPaths: ['handoff'] },
      updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
      currentDocument: { exists: true },
    });
  } catch (e) {
    console.error('[chat-log] handoff 표시 실패:', e);
  }
}
