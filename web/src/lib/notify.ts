import { COMPANY, SITE } from '@/lib/site';

/**
 * 문의 접수 알림.
 *
 * 이 파일이 있는 이유는 "알림이 없어서"가 아니다. 알림은 있었다 —
 * `/api/inquiry`가 Web3Forms로 메일을 쏘고 있었고, **그 하나가 조용히 죽자
 * 대표는 문의가 들어온 사실 자체를 몰랐다.** 발송 키가 공개 저장소에 평문으로
 * 커밋돼 있어 무료 한도가 남에게 소진됐을 가능성이 크다.
 *
 * 그래서 여기서 고치는 것은 "메일을 보내는 방법"이 아니라 **알림이 끊기는 구조**다.
 *
 *   1. 채널을 여럿 둔다. 하나가 죽어도 나머지가 간다.
 *   2. 채널은 환경변수가 없으면 **조용히 건너뛴다**(skipped). 미설정은 실패가 아니다.
 *      이 성질 덕분에 알림톡은 키만 넣으면 코드 변경 없이 켜진다.
 *   3. 채널마다 타임아웃을 건다. 한 채널이 늘어져 함수 전체를 잡아먹지 않게.
 *   4. 결과를 반환한다. 호출자가 기록하고, 실패한 건은 나중에 다시 시도한다.
 *
 * 여기서 던지지 않는다. 알림이 실패해도 방문자의 접수는 성공이어야 한다.
 */

export type Channel = 'email' | 'telegram' | 'alimtalk';

export type NotifyResult = {
  channel: Channel;
  ok: boolean;
  /** 필요한 환경변수가 없어 시도하지 않음. 실패와 구분한다. */
  skipped?: boolean;
  error?: string;
};

export type Inquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

/** 채널 하나가 이보다 오래 걸리면 포기한다. Vercel 함수 기본 한도보다 넉넉히 작게. */
const CHANNEL_TIMEOUT_MS = 8000;

const ADMIN_URL = `${SITE.url}/admin.html`;

/** 쉼표로 구분된 환경변수를 목록으로. 직원 추가가 값 수정만으로 끝나게 하는 장치다. */
function list(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** 서울 시각. 서버는 UTC로 돌기 때문에 그대로 찍으면 9시간 어긋난 시각이 알림에 나간다. */
function seoulNow(): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());
}

/* ────────────────────────────── 이메일 ────────────────────────────── */

/**
 * Resend로 보낸다.
 *
 * `replyTo`를 문의자 주소로 잡는 것이 이 함수에서 제일 실용적인 부분이다 —
 * 수신함에서 답장 버튼을 누르면 그대로 회신이 된다. 주소를 복사할 일이 없다.
 */
async function sendEmail(v: Inquiry, warning: string): Promise<NotifyResult> {
  const key = process.env.RESEND_API_KEY;
  // 수신자를 따로 정하지 않았으면 회사 대표 메일로 보낸다. 키만 넣었는데 변수 하나가
  // 더 없어서 조용히 건너뛰는 일은 없어야 한다 — 실제로 그렇게 됐다.
  const to = list(process.env.NOTIFY_EMAILS);
  if (to.length === 0) to.push(COMPANY.email);
  if (!key) return { channel: 'email', ok: false, skipped: true };

  // 도메인 인증 전에는 Resend가 내주는 발신 주소로 먼저 돌린다.
  const from = process.env.NOTIFY_EMAIL_FROM || 'GSLT 문의 <onboarding@resend.dev>';

  const rows: Array<[string, string]> = [
    ['이름', v.name],
    ['회사명', v.company],
    ['이메일', v.email],
    ['연락처', v.phone],
    ['접수시각', seoulNow()],
  ];

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;max-width:640px;color:#0f172a">
${warning ? `<p style="margin:0 0 16px;padding:12px 16px;background:#fef2f2;border-left:3px solid #dc2626;font-weight:700">${esc(warning)}</p>` : ''}
<h1 style="margin:0 0 20px;font-size:18px">새 상담 신청이 접수되었습니다</h1>
<table style="border-collapse:collapse;width:100%;font-size:14px">
${rows
  .map(
    ([k, val]) =>
      `<tr><th align="left" style="width:88px;padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600">${k}</th>` +
      `<td style="padding:10px 0;border-bottom:1px solid #e2e8f0">${esc(val)}</td></tr>`,
  )
  .join('')}
</table>
<h2 style="margin:24px 0 8px;font-size:14px;color:#64748b">문의 내용</h2>
<div style="white-space:pre-wrap;line-height:1.7;font-size:14px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0">${esc(v.message)}</div>
<p style="margin:24px 0 0;font-size:13px">
  <a href="${ADMIN_URL}" style="color:#1c7682;font-weight:700">관리자 페이지에서 보기</a>
  &nbsp;·&nbsp; 이 메일에 그대로 답장하면 문의자에게 회신됩니다.
</p>
</div>`;

  const text =
    (warning ? `${warning}\n\n` : '') +
    rows.map(([k, val]) => `${k}: ${val}`).join('\n') +
    `\n\n문의 내용\n${v.message}\n\n관리자 페이지: ${ADMIN_URL}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      reply_to: v.email,
      subject: `[GSLT 상담신청] ${v.name} (${v.company})`,
      html,
      text,
    }),
    signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
  });

  if (!res.ok) {
    return { channel: 'email', ok: false, error: `Resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
  }
  return { channel: 'email', ok: true };
}

/* ───────────────────────────── 텔레그램 ───────────────────────────── */

/**
 * 휴대폰 푸시의 본줄기.
 *
 * 직원이 늘면 그룹 채팅방을 만들어 봇을 초대하고 그 그룹 id 하나만 넣으면 된다 —
 * 사람마다 id를 모으지 않아도 된다.
 */
async function sendTelegram(v: Inquiry, warning: string): Promise<NotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = list(process.env.TELEGRAM_CHAT_IDS);
  if (!token || chats.length === 0) return { channel: 'telegram', ok: false, skipped: true };

  // 휴대폰 알림 미리보기에 들어갈 분량만. 전문은 메일과 관리자 페이지가 갖는다.
  const brief = v.message.length > 200 ? `${v.message.slice(0, 200)}…` : v.message;
  const text =
    (warning ? `⚠️ ${warning}\n\n` : '') +
    `📩 <b>새 상담 신청</b>\n\n` +
    `<b>이름</b> ${esc(v.name)}\n` +
    `<b>회사</b> ${esc(v.company)}\n` +
    `<b>연락처</b> ${esc(v.phone)}\n` +
    `<b>이메일</b> ${esc(v.email)}\n` +
    `<b>접수</b> ${esc(seoulNow())}\n\n` +
    `${esc(brief)}\n\n` +
    `<a href="${ADMIN_URL}">관리자 페이지에서 보기</a>`;

  // 한 사람에게 실패해도 나머지는 보낸다. 모두 실패했을 때만 실패로 친다.
  const sent = await Promise.allSettled(
    chats.map(async (chat_id) => {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: 'HTML',
          link_preview_options: { is_disabled: true },
        }),
        signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`${chat_id}: ${res.status} ${(await res.text()).slice(0, 120)}`);
    }),
  );

  const failed = sent.filter((r) => r.status === 'rejected');
  if (failed.length === chats.length) {
    const reason = failed[0] && failed[0].status === 'rejected' ? String(failed[0].reason) : 'unknown';
    return { channel: 'telegram', ok: false, error: reason.slice(0, 200) };
  }
  return { channel: 'telegram', ok: true };
}

/* ──────────────────────────── 카카오 알림톡 ──────────────────────────── */

/**
 * 솔라피(SOLAPI) 규격. 대행사가 다르면 이 함수 하나만 갈아 끼우면 된다.
 *
 * 템플릿에 연락처와 문의 본문을 넣지 않는다. 심사에 유리하고, 수신자가 여러 명으로
 * 늘었을 때 개인정보가 여러 휴대폰에 흩어지지 않는다. 상세는 메일과 관리자 페이지가 갖는다.
 *
 * 아직 키가 없으면 skipped로 빠진다 — 템플릿 심사가 끝나는 날 환경변수만 넣으면 켜진다.
 */
async function sendAlimtalk(v: Inquiry): Promise<NotifyResult> {
  const apiKey = process.env.ALIMTALK_API_KEY;
  const apiSecret = process.env.ALIMTALK_API_SECRET;
  const pfId = process.env.ALIMTALK_SENDER_KEY;
  const templateId = process.env.ALIMTALK_TEMPLATE_ID;
  const from = process.env.ALIMTALK_FROM;
  const to = list(process.env.ALIMTALK_TO);

  if (!apiKey || !apiSecret || !pfId || !templateId || !from || to.length === 0) {
    return { channel: 'alimtalk', ok: false, skipped: true };
  }

  // 솔라피 HMAC 인증: date + salt를 apiSecret으로 서명한다.
  const date = new Date().toISOString();
  const salt = crypto.randomUUID().replace(/-/g, '');
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(apiSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBytes = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(date + salt));
  const signature = [...new Uint8Array(sigBytes)].map((b) => b.toString(16).padStart(2, '0')).join('');

  const res = await fetch('https://api.solapi.com/messages/v4/send-many/detail', {
    method: 'POST',
    headers: {
      Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: to.map((phone) => ({
        to: phone,
        from,
        kakaoOptions: {
          pfId,
          templateId,
          // 템플릿 변수. 등록한 템플릿의 #{...} 이름과 정확히 같아야 한다.
          variables: {
            '#{이름}': v.name,
            '#{회사명}': v.company,
            '#{접수시각}': seoulNow(),
          },
          // 알림톡이 실패하면(친구 아님·차단·카카오 장애) 문자로 떨어뜨린다.
          disableSms: false,
        },
      })),
    }),
    signal: AbortSignal.timeout(CHANNEL_TIMEOUT_MS),
  });

  if (!res.ok) {
    return { channel: 'alimtalk', ok: false, error: `SOLAPI ${res.status}: ${(await res.text()).slice(0, 200)}` };
  }
  return { channel: 'alimtalk', ok: true };
}

/* ──────────────────────────────── 진입점 ──────────────────────────────── */

/**
 * 모든 채널로 동시에 보낸다.
 *
 * @param warning 저장에 실패했을 때 알림 맨 위에 붙일 경고. 이 알림이 유일한 기록이라는 뜻이다.
 */
export async function notifyAll(v: Inquiry, warning = ''): Promise<NotifyResult[]> {
  const settled = await Promise.allSettled([
    sendEmail(v, warning),
    sendTelegram(v, warning),
    sendAlimtalk(v),
  ]);

  const channels: Channel[] = ['email', 'telegram', 'alimtalk'];
  return settled.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { channel: channels[i], ok: false, error: String(r.reason).slice(0, 200) },
  );
}

/** 아직 확인하지 않은 문의가 쌓여 있다는 요약 알림. 놓친 문의를 사람이 알게 하는 마지막 그물. */
export async function notifyUnreadDigest(count: number, oldestHours: number): Promise<NotifyResult[]> {
  const v: Inquiry = {
    name: `미확인 ${count}건`,
    company: '—',
    email: COMPANY.email,
    phone: COMPANY.tel,
    message:
      `아직 확인하지 않은 상담 신청이 ${count}건 있습니다. ` +
      `가장 오래된 건은 약 ${oldestHours}시간 전에 접수됐습니다.\n\n` +
      `관리자 페이지 문의함에서 확인해 주세요: ${ADMIN_URL}`,
  };
  // 알림톡은 '새 상담 신청' 템플릿뿐이라 이 요약에는 쓰지 않는다.
  const settled = await Promise.allSettled([sendEmail(v, ''), sendTelegram(v, '')]);
  const channels: Channel[] = ['email', 'telegram'];
  return settled.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { channel: channels[i], ok: false, error: String(r.reason).slice(0, 200) },
  );
}

/** 관리자가 확인할 수 있게 결과를 한 줄로 요약한다. 로그와 Firestore 양쪽에 같은 문자열이 남는다. */
export function summarize(results: NotifyResult[]): { ok: string[]; failed: string[]; skipped: string[] } {
  return {
    ok: results.filter((r) => r.ok).map((r) => r.channel),
    failed: results.filter((r) => !r.ok && !r.skipped).map((r) => `${r.channel}: ${r.error ?? 'unknown'}`),
    skipped: results.filter((r) => r.skipped).map((r) => r.channel),
  };
}
