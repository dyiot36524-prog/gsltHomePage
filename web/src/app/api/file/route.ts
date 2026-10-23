import { get } from '@vercel/blob';

/**
 * 비공개 저장소의 첨부 내려받기.
 *
 * Blob 스토어가 **비공개(private)** 로 만들어져 있다. 공개 스토어를 전제로 access:'public'
 * 업로드를 보냈더니 전송이 100% 끝난 뒤 저장소가 거절했고, SDK가 재시도하며 진행률이
 * 0%로 되감겼다 — 자가 점검으로 확정한 원인이다:
 *
 *   "Cannot use public access on a private store."
 *
 * 그래서 업로드는 private으로 올리고, 방문자 내려받기는 이 라우트가 서버 자격증명으로
 * 저장소에서 읽어 흘려보낸다. 함수는 스트리밍으로 응답하므로 본문 크기 제한(4.5MB)과
 * 무관하고, 응답에 캐시 헤더를 실어 같은 파일의 두 번째 요청부터는 CDN이 낸다.
 *
 * 덤으로 Content-Disposition을 우리가 정하므로 **내려받는 파일명이 원래 한글 이름**이
 * 된다. 저장 경로는 토큰 서명 문제로 ASCII로 정규화돼 있어(blobPathname), 경로를
 * 그대로 쓰면 저장명이 _-2026-xxxx.pdf처럼 나온다.
 */

export const runtime = 'nodejs';
export const maxDuration = 60;

/** RFC 5987 — 비ASCII 파일명은 filename*=UTF-8''… 로 싣고, ASCII 대체를 함께 둔다. */
function disposition(name: string): string {
  const clean = name.replace(/[\r\n"\\]/g, '_').slice(0, 180);
  const ascii = clean.replace(/[^\x20-\x7E]/g, '_') || 'download';
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(clean)}`;
}

/**
 * 화면 전환용 미리 받기(prefetch)·RSC 요청인가.
 *
 * 내려받기 행은 next/link다. Link는 주소를 미리 받아 두고(prefetch), 누르면 먼저 RSC 요청
 * (RSC: 1, ?_rsc=…)을 보낸 뒤 응답이 RSC가 아니면 그제서야 브라우저 이동으로 다시 연다. 이 라우트가
 * 그 요청마다 파일 전체를 저장소에서 읽어 흘려보내, 한 번 누를 때 PDF가 두 번(미리 받기까지 세 번)
 * 함수를 지나 CDN으로 넘어갔다 — 2026-10-23 무료 한도(함수→CDN 전송 월 10GB) 초과로 사이트가 멈춘
 * 원인 중 하나다. 이런 요청에는 본문 없이 204만 낸다. 라우터는 RSC가 아닌 응답을 받으면 같은 주소로
 * 브라우저 이동을 하므로, 내려받기는 그 두 번째 요청에서 그대로 일어난다.
 * 브라우저 자체의 미리 받기(Sec-Purpose / Purpose: prefetch)도 같은 이유로 거절한다.
 */
function isPrefetchOrRsc(request: Request, url: URL): boolean {
  const h = request.headers;
  return (
    h.get('rsc') === '1' ||
    h.has('next-router-prefetch') ||
    h.has('next-router-segment-prefetch') ||
    url.searchParams.has('_rsc') ||
    /prefetch/i.test(h.get('sec-purpose') || h.get('purpose') || '')
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  // 저장소를 읽기 전에 돌려보낸다. no-store — CDN이 이 빈 응답을 파일 대신 들고 있으면 안 된다.
  if (isPrefetchOrRsc(request, url)) {
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  }
  const p = String(url.searchParams.get('p') || '');
  const name = String(url.searchParams.get('name') || '');

  // 관리자가 올린 첨부 경로만 낸다. 저장소의 다른 경로를 이 라우트로 훑지 못하게 한다.
  if (!/^attachments\/[A-Za-z0-9._/-]{1,200}$/.test(p) || p.includes('..')) {
    return new Response('잘못된 경로입니다.', { status: 400 });
  }

  try {
    const found = await get(p, { access: 'private' });
    if (!found) return new Response('파일이 없습니다.', { status: 404 });

    const headers = new Headers();
    headers.set('Content-Type', found.blob.contentType || 'application/octet-stream');
    if (found.blob.size) headers.set('Content-Length', String(found.blob.size));
    headers.set('Content-Disposition', disposition(name || p.split('/').pop() || 'download'));
    // 경로에 타임스탬프가 박혀 내용이 바뀌지 않는다. 오래 들고 있어도 안전하다.
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    // 위 줄은 브라우저용이다. Vercel CDN은 함수 응답을 s-maxage나 CDN용 헤더가 있을 때만 들고 있어서
    // (vercel.com/docs/caching/cdn-cache), 이것만으로는 방문자·수집기마다 파일 전체가 함수를 다시
    // 지나갔다 — 2026-10-23 무료 한도 초과의 한 갈래. Vercel 전용 헤더로 CDN에 1년 보관을 시킨다.
    // 브라우저에는 나가지 않고 Cache-Control도 건드리지 않는다. 리전마다 처음 한 번만 함수가 돈다.
    // (스트리밍 응답은 20MB까지만 CDN에 담긴다. 그보다 큰 첨부는 여전히 매번 함수를 지난다.)
    headers.set('Vercel-CDN-Cache-Control', 'max-age=31536000');
    return new Response(found.stream, { headers });
  } catch (e) {
    console.error('[api/file]', e instanceof Error ? e.message : e);
    return new Response('파일을 불러오지 못했습니다.', { status: 502 });
  }
}
