import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';
import { OG_SIZE, ogTitle, ogTitleHash } from '@/lib/og';

/**
 * 공유 이미지 — /og(홈), /og/contact, /og/siot/lounge, /og/news/<id> …
 *
 * 주소의 나머지가 **페이지 경로**다. 제목은 lib/og.ts가 그 경로로 찾는다. 쿼리(?v=1&h=…)는
 * 카카오·CDN 캐시를 새로 받게 하는 판 번호와 제목 지문일 뿐, 그림에 찍지 않는다(h는 캐시 길이를
 * 정할 때만 본다 — GET).
 *
 * 모양은 기존 /img/og-image.png를 잇는다 — 먹색 바탕, 위쪽 청록 띠, 오른쪽 아래 짙은 청록 원.
 * 그 위에 왼쪽 위 로고, 아래쪽에 페이지 제목, 맨 아래 괘선과 상호 줄을 둔다.
 * 제목은 아래에 붙여 둔다. 한 줄이든 두 줄이든 상호 줄과의 거리가 같아 그림마다 흔들리지 않는다.
 */

/**
 * 엣지에서 그린다. Node의 ImageResponse(@vercel/og)는 sharp가 있으면 sharp로 SVG를 PNG로 바꾸는데,
 * next start는 /_next/image 요청을 한 번이라도 받으면 sharp의 SVG 읽기를 **프로세스 전체에서** 막는다
 * (이미지 최적화기가 sharp.block으로 허용 형식 외의 입력을 끈다). 그 뒤로는 모든 그림이
 * 'Input buffer contains unsupported image format'으로 실패해 기본 그림(307)만 나갔다(2026-10).
 * 엣지 빌드는 sharp를 모르고 resvg(wasm)로 그린다.
 *
 * Next 16은 엣지 런타임을 deprecated로 표시하고 빌드 때 경고를 낸다. 알고 고른 것이다 — Node로
 * 돌아가려면 위 sharp 문제부터 풀어야 한다. 엣지에는 Buffer·node:* 가 없으니 여기서도, lib/og.ts가
 * 부르는 쪽에서도 쓰지 않는다. 글꼴·로고는 번들에 넣지 않고 처음 그릴 때 받는다(엣지 함수 크기 제한).
 */
export const runtime = 'edge';

const INK = '#0a0a0f';
const TEAL = '#28b8c5'; // gslt-500
const CIRCLE = '#0f252c'; // 기존 그림의 원 색
const GREY = '#94a3b8'; // slate-400 — 먹색 위 보조 글자

/**
 * 한글 글꼴. ImageResponse의 기본 글꼴에는 한글이 없어 □로 찍힌다.
 * 사이트가 화면에 쓰는 그 Pretendard(OFL)를 jsDelivr에서 받는다. woff2는 satori가 읽지 못해 woff다.
 */
const FONT_BASE = 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff';
/**
 * 로고는 운영 주소에서 받는다. public/ 파일은 함수 번들에 들어가지 않아 디스크로는 읽지 못한다.
 * 미리보기 배포 주소는 배포 보호(로그인)에 막힐 수 있어 정본 주소를 쓴다.
 */
const LOGO_URL = `${SITE.url}/img/gslt-logo-white.png`;
/** 로고 원본 2245×615. */
const LOGO_RATIO = 2245 / 615;

/** 파일 첫머리 서명. 받은 것이 정말 그 형식인지 본다. */
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const WOFF_MAGIC = [0x77, 0x4f, 0x46, 0x46]; // 'wOFF'

type Assets = { bold: ArrayBuffer; medium: ArrayBuffer; logo: string };

/**
 * 글꼴 두 벌(각 1.1MB)과 로고는 함수가 처음 그릴 때 한 번 받아 메모리에 둔다.
 *
 * **나쁜 파일은 쥐고 있지 않는다.** 받은 것을 검사해 형식이 틀리면 실패로 돌리고, 실패하면 비워
 * 다음 요청에서 다시 받는다. 200이라도 몸통이 오류 안내 HTML이거나 빈 파일일 수 있다(배포 보호 화면,
 * CDN 장애 페이지). 그런 것을 붙잡으면 함수가 식을 때까지 모든 그림이 기본 그림으로 넘어간다.
 */
let assets: Promise<Assets> | null = null;

async function download(url: string): Promise<{ type: string; data: ArrayBuffer }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return { type: res.headers.get('content-type') ?? '', data: await res.arrayBuffer() };
}

function hasMagic(data: ArrayBuffer, magic: readonly number[]): boolean {
  if (data.byteLength < magic.length) return false;
  const head = new Uint8Array(data, 0, magic.length);
  return magic.every((b, i) => head[i] === b);
}

async function downloadFont(file: string): Promise<ArrayBuffer> {
  const { data } = await download(`${FONT_BASE}/${file}`);
  if (!hasMagic(data, WOFF_MAGIC)) throw new Error(`${file}: woff가 아니다(${data.byteLength}B)`);
  return data;
}

/** 엣지에는 Buffer가 없다. btoa는 '한 글자 = 한 바이트'인 문자열을 받으므로 조각내어 옮긴다. */
function base64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function downloadLogo(): Promise<string> {
  const { type, data } = await download(LOGO_URL);
  if (!type.startsWith('image/png') || !hasMagic(data, PNG_MAGIC)) {
    throw new Error(`로고가 PNG가 아니다(${type || '형식 없음'}, ${data.byteLength}B)`);
  }
  return `data:image/png;base64,${base64(new Uint8Array(data))}`;
}

function loadAssets(): Promise<Assets> {
  assets ??= Promise.all([
    downloadFont('Pretendard-Bold.woff'),
    downloadFont('Pretendard-Medium.woff'),
    downloadLogo(),
  ])
    .then(([bold, medium, logo]) => ({ bold, medium, logo }))
    .catch((e) => {
      assets = null;
      throw e;
    });
  return assets;
}

/** 제목 한 줄의 폭. 1200에서 좌우 여백 80씩을 뺀 값. */
const LINE = 1040;
/**
 * 두 줄에 담는다고 보는 폭. 띄어쓰기에서만 줄을 바꾸므로 줄 끝에 빈 자리가 남는다 — 85%까지만 채운다.
 * 어림이다 — 이것을 넘는 제목은 shorten이 실제로 채워 본다.
 */
const TWO_LINES = LINE * 2 * 0.85;
/** 가장 작은 제목 크기. 이 크기로도 두 줄을 넘으면 잘라 낸다. */
const MIN_SIZE = 50;

/**
 * 제목의 대략 폭(em). Pretendard Bold 실측값이다 — 한글 0.86, 영문·숫자 평균 0.6, 공백 0.23,
 * 문장부호 0.3 안팎. 자간 -0.025em을 글자마다 뺀다.
 */
function emWidth(title: string): number {
  let w = 0;
  for (const ch of title) {
    if (/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7a3\u4e00-\u9fff]/.test(ch)) w += 0.86;
    else if (ch === ' ') w += 0.23;
    else if (/[A-Za-z0-9]/.test(ch)) w += 0.6;
    else if (ch === '—' || ch === '…') w += 0.9;
    else w += 0.35;
    w -= 0.025;
  }
  return w;
}

const graphemes = new Intl.Segmenter('ko', { granularity: 'grapheme' });

/** 말줄임표 앞에서 떼어 낼 꼬리 — 공백·쉼표·가운뎃점·줄표 따위('현황판,…'이 되지 않게). */
const TAIL = /[\s,·:;…—–-]+$/;

/**
 * 어절을 앞에서부터 두 줄에 넣는다. fits는 한 줄이 폭에 드는지 답한다.
 * 들어간 어절 수(used)도 돌려준다 — 빠진 어절이 있는지는 이것으로 본다.
 */
function fillTwoLines(words: string[], fits: (line: string) => boolean): { text: string; used: number } {
  const lines = [''];
  let used = 0;
  for (const word of words) {
    const last = lines.length - 1;
    const next = lines[last] ? `${lines[last]} ${word}` : word;
    if (fits(next)) lines[last] = next;
    else if (lines.length < 2 && lines[last] && fits(word)) lines.push(word);
    else break;
    used++;
  }
  return { text: lines.join(' '), used };
}

/**
 * TWO_LINES를 넘은 제목을 가장 작은 크기로 두 줄에 채워 보고, 넘치는 어절부터 잘라 '…'을 붙인다.
 *
 * 전에는 satori의 lineClamp에 맡겼는데, 말줄임표를 줄 폭 계산에 넣지 않아 '…'이 오른쪽 여백
 * 80px 안으로 삐져나갔다. 폭을 줄여 자리를 남기면 이번엔 어절 한가운데서 끊겼다('빈칸 안…').
 *
 * 그래서 두 줄을 여기서 어림으로 채운다. 잘라야 하면 어절을 줄마다 넣어 보고, 넣을 때마다 '…' 자리를 남긴다.
 * 어림값은 실제보다 한글은 2~6% 크고 영문 대문자·문장부호는 0.5% 안팎 작아(2026-10 실측),
 * 줄마다 4%를 남긴다. 그래도 빗나가면 세 줄로 위로 자랄 뿐 여백을 넘지 않는다 — 줄은 띄어쓰기에서만 바뀐다.
 *
 * 먼저 '…' 자리 없이 채워 보고, 어절이 하나도 빠지지 않으면 제목을 그대로 돌려준다. TWO_LINES(85%)는
 * 어림이라 그것을 넘고도 이 채우기(줄마다 96%)로는 다 들어가는 제목이 있다. 전에는 처음부터 '…' 자리를
 * 남기고 채워, 그런 제목도 다 그린 끝에 말줄임표만 붙거나('… 현황판 공개 시연…') '…' 자리 때문에
 * 마지막 어절이 빠졌다(2026-10).
 */
function shorten(title: string, size: number): string {
  const max = (LINE * 0.96) / size;
  const words = title.split(' ').filter(Boolean);
  if (fillTwoLines(words, (s) => emWidth(s) <= max).used === words.length) return title;
  let out = fillTwoLines(words, (s) => emWidth(`${s.replace(TAIL, '')}…`) <= max).text;
  // 첫 어절이 한 줄보다 길다 — 띄어쓰기 없이 긴 제목. 이런 어절은 glue가 묶지 않아 글자마다 줄이
  // 바뀔 수 있으니, 두 줄 폭만큼 글자 단위로 자른다.
  if (!out) {
    for (const { segment } of graphemes.segment(title)) {
      if (emWidth(`${out}${segment}…`) > max * 2) break;
      out += segment;
    }
  }
  return `${out.replace(TAIL, '')}…`;
}

/**
 * 제목 길이에 따라 글자 크기를 내린다. 한 줄에 들어가면 크게, 아니면 두 줄로 나눠 고르게 맞춘다.
 *
 * 두 줄짜리는 줄 길이를 고르게 나눈다(balance). 둘째 줄에 '인증 획득' 한 어절만 남지 않게.
 * 가장 작은 크기로도 TWO_LINES를 넘는 긴 보도 제목은 shorten에 넘겨 같은 두 줄로 그린다 — 실제로
 * 채워 보아 다 들어가면 제목 그대로, 넘치면 어절 단위로 잘라 '…'을 붙인다.
 * 어림값이 빗나가 세 줄이 되더라도 제목은 아래에 붙어 있어 위로 자랄 뿐 겹치지 않는다.
 */
function titleLayout(title: string): { text: string; size: number; balance: boolean } {
  const em = emWidth(title);
  for (const size of [88, 76]) if (em * size <= LINE) return { text: title, size, balance: false };
  for (const size of [72, 64, 56, MIN_SIZE]) if (em * size <= TWO_LINES) return { text: title, size, balance: true };
  return { text: shorten(title, MIN_SIZE), size: MIN_SIZE, balance: true };
}

/**
 * 줄은 띄어쓰기에서만 바꾼다. 어절 안의 글자 사이에 U+2060(단어 결합자)을 넣는다 —
 * 그림에만 넣는 글자이고, 제목 데이터나 x-og-title에는 넣지 않는다.
 *
 * satori의 wordBreak: 'keep-all'은 쓰지 않는다. 어절이 아니라 Intl.Segmenter의 단어 조각으로
 * 끊어서 문장부호 앞뒤에서도 줄을 바꾼다 — 시험해 보니 '‘혁신성장유형’'의 여는 따옴표가
 * 윗줄 끝에 홀로 남았다. 기본값(normal)은 한글을 음절마다 끊는다. 결합자를 넣은 normal이면
 * 띄어쓰기에서만 끊기고, 결합자는 폭 0으로 그려진다(Pretendard에 글리프가 있다).
 *
 * 한 줄보다 긴 어절은 묶지 않는다. 묶으면 끊을 곳이 없어 오른쪽 여백 밖으로 뻗는다.
 *
 * 가운뎃점은 앞 어절에 붙인다. ' · ' 앞의 공백에서 줄이 바뀌어 '·'가 줄 첫머리에 서지 않게
 * (lib/nobreak.tsx가 화면 글에 하는 것과 같은 규칙).
 */
function glue(title: string, size: number): string {
  return title
    .split(' ')
    .map((word) =>
      emWidth(word) * size > LINE ? word : Array.from(graphemes.segment(word), (g) => g.segment).join('\u2060'),
    )
    .join(' ')
    .replace(/ ·/g, ' \u2060·');
}

function Card({ title, home, logo }: { title: string | null; home: boolean; logo: string }) {
  const layout = title ? titleLayout(title) : null;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: INK,
        fontFamily: 'Pretendard',
        color: '#ffffff',
      }}
    >
      {/* 기존 그림의 원. 중심 (1050, 580), 반지름 350. */}
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 230,
          width: 700,
          height: 700,
          borderRadius: 350,
          background: CIRCLE,
        }}
      />
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 6, background: TEAL }} />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '76px 80px 56px',
        }}
      >
        {layout ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- satori가 그리는 그림 속 이미지다 */}
            <img src={logo} width={Math.round(52 * LOGO_RATIO)} height={52} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 44 }}>
              <div style={{ width: 72, height: 5, background: TEAL, marginBottom: 30 }} />
              <div
                style={{
                  display: 'block',
                  ...(layout.balance ? { textWrap: 'balance' as const } : {}),
                  fontSize: layout.size,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: -0.025 * layout.size,
                  maxWidth: LINE,
                }}
              >
                {glue(layout.text, layout.size)}
              </div>
            </div>
          </div>
        ) : (
          // 사이트에 없는 경로 — 제목 없이 기존 그림처럼 로고만 가운데 세운다.
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- satori가 그리는 그림 속 이미지다 */}
            <img src={logo} width={Math.round(132 * LOGO_RATIO)} height={132} />
            <div style={{ width: 80, height: 4, background: TEAL, marginTop: 56 }} />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            paddingTop: 24,
            fontSize: 26,
            fontWeight: 500,
            color: GREY,
            whiteSpace: 'nowrap',
          }}
        >
          {/* 홈은 제목이 이미 '무선 IoT 구축 전문기업'이라 상호만 둔다. */}
          <span>{home ? SITE.siteName : `${SITE.siteName} · 무선 IoT 구축 전문기업`}</span>
          <span>www.gslt.kr</span>
        </div>
      </div>
    </div>
  );
}

type Ctx = { params: Promise<{ path?: string[] }> };

const YEAR = 'public, max-age=31536000, immutable';

export async function GET(req: Request, { params }: Ctx) {
  const { path: segments = [] } = await params;
  const path = `/${segments.join('/')}`;

  // 제목을 못 찾은 그림(없는 경로·Firestore 장애)은 오래 캐시하지 않는다. 아직 공개 전인 글의
  // 주소가 기본 그림으로 1년 동안 굳으면, 글을 올린 뒤에도 카톡에는 로고만 뜬다.
  let title: string | null = null;
  let cache = 'public, max-age=3600';
  try {
    title = await ogTitle(path);
    if (title) {
      // 주소의 h(제목 지문)가 지금 찾은 제목과 다르면 1년 캐시하지 않는다. 글 제목을 고친 직후
      // 페이지는 새 제목의 주소를 냈는데 여기 조회가 아직 예전 제목이면, 새 주소에 예전 제목이 굳는다.
      // 아무 h나 붙인 주소도 CDN에 1년씩 쌓이지 않는다. h가 없는 예전 주소(?v=1)는 전처럼 둔다.
      const h = new URL(req.url).searchParams.get('h');
      cache = h && h !== ogTitleHash(title) ? 'public, max-age=60' : YEAR;
    }
  } catch (e) {
    console.error('[og] 제목 조회 실패', path, e);
    cache = 'public, max-age=60';
  }

  const pending = loadAssets();
  try {
    const { bold, medium, logo } = await pending;
    // 끝까지 그린 뒤에 응답한다. ImageResponse를 그대로 돌려주면 200과 1년 캐시 헤더가 먼저 나가고
    // 그리다 실패한 반쪽 그림이 CDN에 굳는다.
    const png = await new ImageResponse(<Card title={title} home={path === '/'} logo={logo} />, {
      ...OG_SIZE,
      fonts: [
        { name: 'Pretendard', data: bold, weight: 700, style: 'normal' },
        { name: 'Pretendard', data: medium, weight: 500, style: 'normal' },
      ],
    }).arrayBuffer();
    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': cache,
        // Vercel CDN이 함수 응답을 붙잡게 따로 적는다. 브라우저·카카오는 이 헤더를 보지 않는다.
        'CDN-Cache-Control': cache,
        // 배포본 검사(scripts/seo-check.mjs)가 그림 속 제목과 페이지 <title>을, 그림 주소의 h와 이 지문을
        // 맞춰 본다. 헤더 값은 ASCII만 받으므로 인코딩한다. 긴 제목은 그림에서 '…'로 잘려도 원 제목을 낸다.
        ...(title ? { 'x-og-title': encodeURIComponent(title), 'x-og-hash': ogTitleHash(title) } : {}),
      },
    });
  } catch (e) {
    // 글꼴·로고를 못 받았거나 그리다 실패했다. 카톡 썸네일이 빈칸이 되느니 예전 고정 그림을 낸다.
    // 받아 둔 글꼴·로고도 버린다 — 검사를 지났어도 깨진 파일일 수 있고, 쥐고 있으면 계속 실패한다.
    // (그사이 다른 요청이 새로 받기 시작했으면 그것은 두고.)
    console.error('[og] 그리기 실패', path, e);
    if (assets === pending) assets = null;
    return new Response(null, {
      status: 307,
      headers: { Location: '/img/og-image.png', 'Cache-Control': 'no-store' },
    });
  }
}
