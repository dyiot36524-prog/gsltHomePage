import { COMPANY } from '@/lib/site';
import { sourceLabel } from '@/lib/traffic-source';
import { after } from 'next/server';
import { notifyAll, sendAutoReply, summarize, type Inquiry } from '@/lib/notify';
import { saveHandoffLog, SESSION_RE } from '@/lib/chat-log';
import { adminPatch, isAdminAvailable } from '@/lib/firestore-admin';
import { DEFAULT_LOCALE, fmt, isForeignLocale, isLocale, type ForeignLocale, type Locale } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
import { contact } from '@/i18n/messages/contact';

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
 *
 * 외국어 페이지(/en · /zh · /ja/contact)의 폼은 주소에 ?lang=을 붙여 보낸다. 방문자에게 돌려주는 안내만
 * 그 언어로 바꾸고, 저장하는 칸은 그대로다(firestore.rules가 정해진 칸만 받는다). 직원 알림에는 회신할
 * 언어를 한 줄 붙인다. lang이 없거나 모르는 값이면 한국어 — 챗봇(Chat.tsx)과 한국어 폼은 예전 그대로다.
 * 실패 응답에는 언어와 상관없는 code(사전 키)도 함께 싣는다.
 */

const PROJECT_ID = 'gslthomepage';
// posts.ts와 같은 공개용 웹 API 키. 실제 권한은 firestore.rules가 통제한다 (비밀이 아님).
const API_KEY = 'AIzaSyCjnuHSGhy97XOtoVC1fSwnGInLwVs1wok';
const COMMIT_ENDPOINT =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
  `/databases/(default)/documents:commit?key=${API_KEY}`;

/** firestore.rules의 상한과 정확히 같은 값. 규칙이 거절하기 전에 우리가 먼저 400으로 돌려준다. */
const LIMIT = { name: 100, company: 200, email: 200, phone: 50, message: 5000 } as const;

type ApiMessages = (typeof contact)[Locale]['api'];
type FailCode = keyof ApiMessages;

/** 직원 알림에 붙이는 회신 언어. 직원이 읽는 글이라 한국어다. */
const REPLY_IN: Record<ForeignLocale, string> = { en: '영어', zh: '중국어(간체)', ja: '일본어' };

/** 주소의 ?lang= → 언어. 없거나 모르는 값이면 한국어. */
function requestLocale(request: Request): Locale {
  const lang = new URL(request.url).searchParams.get('lang');
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/** 그 언어의 안내 문구. {tel}은 그 언어의 번호 표기(외국어는 +82-…)로 채운다. */
function failure(locale: Locale, code: FailCode, status: number, n?: number) {
  const message = fmt(contact[locale].api[code], {
    tel: common[locale].company.tel,
    email: COMPANY.email,
    ...(n === undefined ? {} : { n }),
  });
  return Response.json({ ok: false, code, message }, { status });
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

type Invalid = { ok: false; code: FailCode; n?: number };

function validate(raw: Record<string, unknown>): { ok: true; data: Inquiry } | Invalid {
  const name = clean(raw.name);
  const company = clean(raw.company);
  const email = clean(raw.email);
  const phone = clean(raw.phone);
  const message = clean(raw.message);

  // 연락처는 형식을 보지 않는다 — 외국어 페이지에서 오는 국제 번호(+1 …, +81 …)도 그대로 받는다.
  if (!name) return { ok: false, code: 'nameRequired' };
  if (name.length > LIMIT.name) return { ok: false, code: 'nameTooLong', n: LIMIT.name };
  if (company.length > LIMIT.company) return { ok: false, code: 'companyTooLong', n: LIMIT.company };
  if (!email) return { ok: false, code: 'emailRequired' };
  if (email.length > LIMIT.email) return { ok: false, code: 'emailTooLong', n: LIMIT.email };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, code: 'emailInvalid' };
  if (phone.length > LIMIT.phone) return { ok: false, code: 'phoneTooLong', n: LIMIT.phone };
  if (!message) return { ok: false, code: 'messageRequired' };
  if (message.length > LIMIT.message) return { ok: false, code: 'messageTooLong', n: LIMIT.message };

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
  const locale = requestLocale(request);
  if (tooMany(request)) return failure(locale, 'rateLimited', 429);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return failure(locale, 'unreadable', 400);
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return failure(locale, 'malformed', 400);
  }
  const fields = raw as Record<string, unknown>;

  // 봇에게는 성공처럼 보이게 하고 아무것도 하지 않는다.
  if (looksAutomated(fields)) return Response.json({ ok: true });

  const checked = validate(fields);
  if (!checked.ok) return failure(locale, checked.code, 400, checked.n);

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
  // 첫 방문 출처는 알림에만 싣는다. 문의함(DB)은 정해진 칸만 받으므로 저장 데이터와 분리한다.
  // 외국어 페이지에서 온 문의는 회신 언어를 같은 자리(알림 맨 위)에 적는다 — 이것도 알림에만 있고 저장하지 않는다.
  const warning = [
    saveError ? '문의함 저장에 실패했습니다. 이 알림이 유일한 기록입니다 — 즉시 회신해 주세요.' : '',
    isForeignLocale(locale) ? `${REPLY_IN[locale]} 페이지에서 온 문의입니다 — ${REPLY_IN[locale]}로 회신해 주세요.` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const results = await notifyAll({ ...checked.data, source: sourceLabel(fields.source) }, warning);
  const summary = summarize(results);

  if (summary.failed.length) console.error('[inquiry] notify failed:', summary.failed.join(' | '));
  if (!saveError) await recordNotify(id, summary);


  // 저장도 알림도 전부 실패했을 때만 방문자에게 실패를 알린다.
  // 어느 하나라도 남았으면 우리가 문의를 잡고 있는 것이므로 접수 완료다.
  if (saveError && summary.ok.length === 0) return failure(locale, 'failed', 502);

  // 응답을 보낸 뒤에 한다. 둘 다 방문자가 기다릴 이유가 없는 일이다.
  // 위의 502 판정보다 **뒤에** 둔다 — 우리가 문의를 잡지 못했는데 '잘 받았습니다'를 보내면 거짓말이다.
  //  - 챗봇에서 넘어온 신청이고 방문자가 '대화 내용을 함께 보냅니다'를 켜 두었으면 그 대화를 남긴다
  //    (그때만 클라이언트가 session·turns를 보낸다).
  //  - 문의자에게 접수 확인 메일(도메인 인증 전에는 조용히 건너뛴다).
  const session = typeof fields.session === 'string' && SESSION_RE.test(fields.session) ? fields.session : '';
  after(async () => {
    if (session) await saveHandoffLog(session, fields.turns);
    const reply = await sendAutoReply(checked.data);
    if (!reply.ok && !reply.skipped) console.error('[inquiry] auto-reply failed:', reply.error);
  });

  return Response.json({ ok: true });
}
