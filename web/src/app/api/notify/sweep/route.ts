import { adminQuery, adminPatch, isAdminAvailable, fs, type FsDoc } from '@/lib/firestore-admin';
import { notifyAll, notifyUnreadDigest, summarize, type Inquiry } from '@/lib/notify';

/**
 * 놓친 알림을 줍는 청소부.
 *
 * 즉시 알림(`/api/inquiry`)만으로는 부족하다. 그 순간 메일 서버가 죽어 있었거나 토큰이
 * 만료됐다면 알림은 영영 안 간다 — 그리고 **아무도 그 사실을 모른다.** 지금까지 정확히
 * 그 일이 벌어졌다. 이 라우트가 그 구멍을 막는다.
 *
 * 두 가지를 한다.
 *   1. **재발송** — 알림이 한 채널도 성공하지 못한 문의를 다시 알린다. 지수 백오프로
 *      최대 5회. 그래도 안 되면 사람이 봐야 하는 문제다.
 *   2. **미확인 요약** — 접수된 지 오래됐는데 아직 읽지 않은 문의가 있으면 요약을 보낸다.
 *      알림이 성공했더라도 사람이 못 봤을 수 있다. 마지막 그물이다.
 *
 * 외부 크론(cron-job.org 등)이나 Vercel Cron이 5~15분마다 부른다.
 * 서비스 계정이 없으면 아무것도 하지 않고 물러난다 — 1단계만 켜진 상태에서도
 * 배포가 깨지지 않아야 한다.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** 접수 후 이 시간이 지나도록 읽지 않으면 요약을 보낸다. */
const UNREAD_AFTER_H = 3;
/** 재발송 대상은 최근 이 기간 안의 문의만. 오래된 실패를 영원히 붙들지 않는다. */
const RETRY_WINDOW_H = 24;
const MAX_ATTEMPTS = 5;
/** 시도 횟수별 대기 시간(분). 뒤로 갈수록 벌린다. */
const BACKOFF_MIN = [5, 15, 60, 180, 360];

function unauthorized() {
  return Response.json({ ok: false, message: 'unauthorized' }, { status: 401 });
}

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  // 시크릿을 설정하지 않았으면 아무도 못 부른다. 열어 두는 쪽이 기본값이면 안 된다.
  if (!secret) return false;
  const header = request.headers.get('authorization') ?? '';
  return header === `Bearer ${secret}`;
}

function toInquiry(d: FsDoc): Inquiry {
  const f = d.fields ?? {};
  return {
    name: fs.str(f.name),
    company: fs.str(f.company),
    email: fs.str(f.email),
    phone: fs.str(f.phone),
    message: fs.str(f.message),
  };
}

/** 지금 다시 시도할 차례인가. 마지막 시도로부터 백오프만큼 지났는지 본다. */
function dueForRetry(attempt: number, lastAt: number, createdAt: number): boolean {
  if (attempt >= MAX_ATTEMPTS) return false;
  const waitMs = (BACKOFF_MIN[Math.min(attempt, BACKOFF_MIN.length - 1)] ?? 360) * 60 * 1000;
  // 한 번도 시도하지 않았다면(기록 자체가 없음) 접수 시각을 기준으로 삼는다.
  return Date.now() - (lastAt || createdAt) >= waitMs;
}

async function run(): Promise<Record<string, unknown>> {
  if (!isAdminAvailable()) {
    return { skipped: 'FIREBASE_SERVICE_ACCOUNT 미설정 — 재시도 기능은 꺼져 있습니다' };
  }

  const since = new Date(Date.now() - RETRY_WINDOW_H * 60 * 60 * 1000).toISOString();
  const docs = await adminQuery({
    from: [{ collectionId: 'inquiries' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'createdAt' },
        op: 'GREATER_THAN',
        value: { timestampValue: since },
      },
    },
    orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
    limit: 100,
  });

  let retried = 0;
  let recovered = 0;
  const stillFailing: string[] = [];

  for (const d of docs) {
    const f = d.fields ?? {};
    const notify = fs.map(f.notify);
    const ok = fs.arr(notify.ok);
    if (ok.length > 0) continue; // 한 채널이라도 성공했으면 알림은 간 것이다

    const attempt = fs.int(notify.attempt);
    const lastAt = fs.time(notify.at);
    const createdAt = fs.time(f.createdAt);
    if (!dueForRetry(attempt, lastAt, createdAt)) continue;

    const results = await notifyAll(toInquiry(d), '재발송 — 접수 시점에 알림이 나가지 못했습니다.');
    const s = summarize(results);
    retried++;
    if (s.ok.length > 0) recovered++;
    else stillFailing.push(`${fs.id(d.name)}: ${s.failed.join(' | ') || '설정된 채널 없음'}`);

    await adminPatch(
      `inquiries/${fs.id(d.name)}`,
      {
        notify: {
          mapValue: {
            fields: {
              attempt: { integerValue: String(attempt + 1) },
              at: { timestampValue: new Date().toISOString() },
              ok: { arrayValue: { values: s.ok.map((c) => ({ stringValue: c })) } },
              failed: { arrayValue: { values: s.failed.map((c) => ({ stringValue: c })) } },
            },
          },
        },
      },
      ['notify'],
    );
  }

  /* ── 미확인 요약 ── */
  const cutoff = Date.now() - UNREAD_AFTER_H * 60 * 60 * 1000;
  const unread = docs.filter((d) => {
    const f = d.fields ?? {};
    return !fs.bool(f.read) && fs.time(f.createdAt) < cutoff;
  });

  let digest = false;
  if (unread.length > 0) {
    // 하루 한 번으로 묶는다. 15분마다 같은 잔소리를 보내면 사람이 알림을 꺼 버린다.
    const oldest = Math.min(...unread.map((d) => fs.time(d.fields?.createdAt)));
    const marker = unread.find((d) => fs.time(d.fields?.createdAt) === oldest);
    const lastDigest = marker ? fs.time(fs.map(marker.fields?.notify).digestAt) : 0;
    if (Date.now() - lastDigest > 24 * 60 * 60 * 1000) {
      const hours = Math.round((Date.now() - oldest) / (60 * 60 * 1000));
      await notifyUnreadDigest(unread.length, hours);
      digest = true;
      if (marker) {
        // 중첩 필드는 mask에만 점 표기를 쓰고, 본문은 map 구조를 그대로 실어야 한다.
        await adminPatch(
          `inquiries/${fs.id(marker.name)}`,
          {
            notify: {
              mapValue: { fields: { digestAt: { timestampValue: new Date().toISOString() } } },
            },
          },
          ['notify.digestAt'],
        );
      }
    }
  }

  return { scanned: docs.length, retried, recovered, stillFailing, unread: unread.length, digest };
}

export async function POST(request: Request) {
  if (!authorized(request)) return unauthorized();
  return Response.json({ ok: true, ...(await run()) });
}

/** Vercel Cron은 GET으로 부른다. 외부 크론 서비스는 대개 POST를 쓴다. 둘 다 받는다. */
export async function GET(request: Request) {
  if (!authorized(request)) return unauthorized();
  return Response.json({ ok: true, ...(await run()) });
}
