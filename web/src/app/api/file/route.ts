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

export async function GET(request: Request) {
  const url = new URL(request.url);
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
    // 경로에 타임스탬프가 박혀 내용이 바뀌지 않는다. CDN이 오래 들고 있어도 안전하고,
    // 같은 파일의 두 번째 내려받기부터는 함수가 돌지 않는다.
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return new Response(found.stream, { headers });
  } catch (e) {
    console.error('[api/file]', e instanceof Error ? e.message : e);
    return new Response('파일을 불러오지 못했습니다.', { status: 502 });
  }
}
