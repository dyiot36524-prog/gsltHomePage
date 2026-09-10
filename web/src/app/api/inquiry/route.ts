import { COMPANY } from '@/lib/site';
import { notifyAll, summarize, type Inquiry } from '@/lib/notify';
import { adminPatch, isAdminAvailable } from '@/lib/firestore-admin';

/**
 * 상담 문의 접수.
 *
 * 이 라우트는 원래 문의함 저장과 메일 알림을 **대등하게** 취급했다 —
 * `Promise.allSettled`로 동시에 쏘고 둘 중 하나만 성공하면 접수 완료로 봤다.
 * 두 가지가 잘못됐다.
 *
 *   1. 저장이 실패하고 메일만 성공하면 문의가 DB에 없다. 관리자 페이지에 보이지 않고,
 *      나중에 다시 알릴 근거도 없다. **기록이 먼저고 알림은 그 파생물이다.**
 *   2. 알림 채널이 하나뿐이라 그 하나가 죽으면 알림이 통째로 멈춘다. 실제로 그렇게 됐다 —
 *      발송 키가 공개 저장소에 평문으로 있었고, 실패는 `console.error`로만 남아
 *      아무도 몰랐다.
 *
 * 그래서 지금은: **저장 → (성공/실패를 손에 쥔 채) 알림**. 알림은 lib/notify.ts가
 * 여러 채널로 동시에 보내고, 채널 하나가 죽어도 나머지가 간다.
 *
 * POST는 기본적으로 캐시되지 않으므로(route handler 문서) 세그먼트 설정을 따로 두지 않는다.
 */

const PROJECT_ID = 'gslthomepage';
// posts.ts와 같은 공개용 웹 API 키. 실제 권한은 firestore.rules가 통제한다 (비밀이 아님).
const API_KEY = 'AIzaSyCjnuHSGhy97XOtoVC1fSwnGInLwVs1wok';
const COMMIT_ENDPOINT =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
  `/databases/(default)/documents:commit?key=${API_KEY}`;

/** firestore.rules의 상한과 정확히 같은 값. 규칙이 거절하기 전에 우리가 먼저 400으로 돌려준다. */
const LIMIT = { name: 100, company: 200, email: 200, phone: 50, message: 5000 } as const;

const FALLBACK = `전송에 실패했습니다. ${COMPANY.tel} 또는 ${COMPANY.email} 으로 직접 연락해 주세요.`;

function fail(message: string, status: number) {
  return Response.json({ ok: false, message }, { status });
}

/** Firestore 자동 ID와 같은 형식(62진 20자). */
function autoId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  let id = '';
  for (const b of bytes) id += chars[b % chars.length];
  return id;
}

function clean(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function validate(raw: Record<string, unknown>): { ok: true; data: Inquiry } | { ok: false; message: string } {
  const name = clean(raw.name);
  const company = clean(raw.company);
  const email = clean(raw.email);
  const phone = clean(raw.phone);
  const message = clean(raw.message);

  if (!name) return { ok: false, message: '이름을 입력해 주세요.' };
  if (name.length > LIMIT.name) return { ok: false, message: `이름은 ${LIMIT.name}자 이내로 입력해 주세요.` };
  if (company.length > LIMIT.company) return { ok: false, message: `회사명은 ${LIMIT.company}자 이내로 입력해 주세요.` };
  if (!email) return { ok: false, message: '이메일을 입력해 주세요.' };
  if (email.length > LIMIT.email) return { ok: false, message: `이메일은 ${LIMIT.email}자 이내로 입력해 주세요.` };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: '이메일 형식을 확인해 주세요.' };
  if (phone.length > LIMIT.phone) return { ok: false, message: `연락처는 ${LIMIT.phone}자 이내로 입력해 주세요.` };
  if (!message) return { ok: false, message: '문의 내용을 입력해 주세요.' };
  if (message.length > LIMIT.message) return { ok: false, message: `문의 내용은 ${LIMIT.message}자 이내로 입력해 주세요.` };

  // 빈 칸은 원본과 같이 '미기재'로 채운다. 관리자 수신함에서 누락과 구분되어야 한다.
  return { ok: true, data: { name, company: company || '미기재', email, phone: phone || '미기재', message } };
}

/**
 * 사람이 쓴 것인지 본다.
 *
 * 알림이 붙기 전에는 봇 제출의 피해가 DB 쓰레기뿐이었다. 이제는 **알림 폭탄과 발송 비용**이
 * 된다 — 알림톡은 건당 과금이고, 대표 휴대폰이 밤새 울린다.
 *
 * 둘 다 사용자에게 보이지 않고, 걸려도 실패를 알리지 않는다. 봇에게 무엇에 걸렸는지
 * 알려 주면 다음 시도에서 피해 간다. 조용히 버리고 200을 준다.
 */
function looksAutomated(raw: Record<string, unknown>): boolean {
  // 허니팟: 사람 눈에 안 보이는 칸이라 사람은 채울 수 없다.
  if (clean(raw.website)) return true;

  // 폼이 그려지고 3초도 안 돼 제출됐다면 사람이 타이핑한 것이 아니다.
  const startedAt = Number(raw.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 3000) return true;

  return false;
}

/**
 * 문의 접수함 저장.
 *
 * 규칙이 `createdAt == request.time`을 요구해 단순 createDocument로는 통과하지 못한다.
 * commit 엔드포인트에 서버 타임스탬프 transform을 실어야 규칙이 보는 값과 저장되는 값이 같아진다.
 * currentDocument.exists=false는 ID가 겹쳐도 기존 문서를 덮지 않게 하는 안전장치다.
 */
async function saveToInbox(v: Inquiry, id: string): Promise<void> {
  const res = await fetch(COMMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: `projects/${PROJECT_ID}/databases/(default)/documents/inquiries/${id}`,
            fields: {
              name: { stringValue: v.name },
              company: { stringValue: v.company },
              email: { stringValue: v.email },
              phone: { stringValue: v.phone },
              message: { stringValue: v.message },
              read: { booleanValue: false },
            },
          },
          updateTransforms: [{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }],
          currentDocument: { exists: false },
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Firestore commit ${res.status}: ${await res.text()}`);
}

/**
 * 알림 결과를 문의 문서에 남긴다.
 *
 * 이 기록이 있어야 `/api/notify/sweep`이 "알림이 안 나간 문의"를 찾아 다시 보낼 수 있다.
 * 기록이 없으면 실패는 로그에만 남고, 로그는 아무도 보지 않는다.
 *
 * **공개 키로는 쓸 수 없다.** `firestore.rules`가 inquiries의 update를 `isAdmin()`으로
 * 막기 때문에 저장에 쓰는 공개 키로 PATCH하면 403이다. 서비스 계정으로만 쓴다.
 * 서비스 계정이 없으면 조용히 넘어가고, 그때는 스윕도 함께 꺼져 있으므로
 * **중복 발송이 생기지 않는다** — 두 기능이 같은 열쇠를 공유하는 것이 여기서는 안전장치다.
 */
async function recordNotify(id: string, results: ReturnType<typeof summarize>): Promise<void> {
  if (!isAdminAvailable()) return;
  await adminPatch(
    `inquiries/${id}`,
    {
      notify: {
        mapValue: {
          fields: {
            attempt: { integerValue: '1' },
            at: { timestampValue: new Date().toISOString() },
            ok: { arrayValue: { values: results.ok.map((c) => ({ stringValue: c })) } },
            failed: { arrayValue: { values: results.failed.map((c) => ({ stringValue: c })) } },
          },
        },
      },
    },
    ['notify'],
  );
}

/**
 * 같은 발신지에서 쏟아지는 접수를 막는다.
 *
 * 한계를 분명히 해둔다: 서버리스는 인스턴스마다 메모리가 따로라 이 카운터는 인스턴스 단위다.
 * 분산 공격은 못 막고, 막으려면 KV 같은 공유 저장소가 필요하다. 여기서 막는 것은 한 곳에서
 * 반복 제출하는 흔한 경우다. 봇 판별은 looksAutomated()가 함께 맡는다.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function tooMany(request: Request): boolean {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // 오래된 항목을 흘려보내지 않으면 맵이 계속 자란다
  if (hits.size > 500) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  if (tooMany(request)) {
    return fail(`잠시 후 다시 시도해 주세요. 급하시면 ${COMPANY.tel}로 연락 주세요.`, 429);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail('요청을 읽지 못했습니다. 다시 시도해 주세요.', 400);
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fail('요청 형식이 올바르지 않습니다.', 400);
  }
  const fields = raw as Record<string, unknown>;

  // 봇에게는 성공처럼 보이게 하고 아무것도 하지 않는다.
  if (looksAutomated(fields)) return Response.json({ ok: true });

  const checked = validate(fields);
  if (!checked.ok) return fail(checked.message, 400);

  // 1) 기록이 먼저다.
  const id = autoId();
  let saveError = '';
  try {
    await saveToInbox(checked.data, id);
  } catch (e) {
    saveError = String(e);
    console.error('[inquiry] inbox save failed:', e);
  }

  // 2) 알림은 그 다음. 저장이 실패했다면 이 알림이 유일한 기록이라는 사실을 본문에 적는다.
  const results = await notifyAll(
    checked.data,
    saveError ? '문의함 저장에 실패했습니다. 이 알림이 유일한 기록입니다 — 즉시 회신해 주세요.' : '',
  );
  const summary = summarize(results);

  if (summary.failed.length) console.error('[inquiry] notify failed:', summary.failed.join(' | '));
  if (!saveError) await recordNotify(id, summary);

  // 저장도 알림도 전부 실패했을 때만 방문자에게 실패를 알린다.
  // 어느 하나라도 남았으면 우리가 문의를 잡고 있는 것이므로 접수 완료다.
  if (saveError && summary.ok.length === 0) return fail(FALLBACK, 502);

  return Response.json({ ok: true });
}
