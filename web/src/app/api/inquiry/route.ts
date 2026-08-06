import { COMPANY } from '@/lib/site';

/**
 * 상담 문의 접수.
 *
 * 원본 index.html의 submitContactForm이 브라우저에서 하던 두 가지(문의함 저장 + 메일 알림)를
 * 서버로 옮긴 것이다. 서버에서 도는 이유는 두 가지다 — Web3Forms 키가 클라이언트 번들에
 * 실리지 않고, 길이·형식 검증이 브라우저 우회로 뚫리지 않는다.
 *
 * POST는 기본적으로 캐시되지 않으므로(route handler 문서) 세그먼트 설정을 따로 두지 않는다.
 */

const PROJECT_ID = 'gslthomepage';
// posts.ts와 같은 공개용 웹 API 키. 실제 권한은 firestore.rules가 통제한다 (비밀이 아님).
const API_KEY = 'AIzaSyCjnuHSGhy97XOtoVC1fSwnGInLwVs1wok';
const COMMIT_ENDPOINT =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
  `/databases/(default)/documents:commit?key=${API_KEY}`;

// 관리자 메일 알림. 서버에서만 읽으므로 클라이언트 번들에 나가지 않는다.
const WEB3FORMS_KEY = '96a55612-ee59-42c7-a34b-875d944c8943';

/** firestore.rules의 상한과 정확히 같은 값. 규칙이 거절하기 전에 우리가 먼저 400으로 돌려준다. */
const LIMIT = { name: 100, company: 200, email: 200, phone: 50, message: 5000 } as const;

type Inquiry = { name: string; company: string; email: string; phone: string; message: string };

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
 * 문의 접수함 저장.
 *
 * 규칙이 `createdAt == request.time`을 요구해 단순 createDocument로는 통과하지 못한다.
 * commit 엔드포인트에 서버 타임스탬프 transform을 실어야 규칙이 보는 값과 저장되는 값이 같아진다.
 * currentDocument.exists=false는 ID가 겹쳐도 기존 문서를 덮지 않게 하는 안전장치다.
 */
async function saveToInbox(v: Inquiry): Promise<void> {
  const res = await fetch(COMMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: `projects/${PROJECT_ID}/databases/(default)/documents/inquiries/${autoId()}`,
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

/** 관리자 메일 알림. 필드 이름은 원본과 같게 둬야 수신함에서 기존 문의와 같은 모양으로 읽힌다. */
async function sendMail(v: Inquiry): Promise<void> {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `[GSLT 무료 상담 신청] ${v.name} (${v.company})`,
      이름: v.name,
      회사명: v.company,
      이메일: v.email,
      연락처: v.phone,
      문의내용: v.message,
    }),
  });
  const data: { success?: boolean } = await res.json().catch(() => ({}));
  if (data.success !== true) throw new Error(`Web3Forms rejected: ${res.status}`);
}

/**
 * 같은 발신지에서 쏟아지는 접수를 막는다.
 *
 * 이게 없으면 누구든 이 엔드포인트를 반복 호출해 관리자 수신함을 채우고 Web3Forms 월 한도를
 * 태울 수 있다. 한도가 소진되면 **진짜 문의가 메일로 오지 않는다** — 조용히 실패하는 쪽이라
 * 더 위험하다.
 *
 * 한계를 분명히 해둔다: 서버리스는 인스턴스마다 메모리가 따로라 이 카운터는 인스턴스 단위다.
 * 분산 공격은 못 막고, 막으려면 KV 같은 공유 저장소가 필요하다. 여기서 막는 것은 한 곳에서
 * 반복 제출하는 흔한 경우다.
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

  const checked = validate(raw as Record<string, unknown>);
  if (!checked.ok) return fail(checked.message, 400);

  // 원본과 같은 관용 정책: 저장과 메일 중 하나라도 성공하면 접수 완료로 본다.
  const [saved, mailed] = await Promise.allSettled([
    saveToInbox(checked.data),
    sendMail(checked.data),
  ]);

  if (saved.status === 'rejected') console.error('[inquiry] inbox save failed:', saved.reason);
  if (mailed.status === 'rejected') console.error('[inquiry] mail notify failed:', mailed.reason);

  if (saved.status === 'rejected' && mailed.status === 'rejected') {
    // 내부 오류 문자열은 로그에만 남기고 사용자에게는 대체 연락 경로만 알린다.
    return fail(FALLBACK, 502);
  }

  return Response.json({ ok: true });
}
