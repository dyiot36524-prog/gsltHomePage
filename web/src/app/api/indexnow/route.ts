import { after } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';
import { notifyIndexNow } from '@/lib/indexnow';
import { SITE } from '@/lib/site';

/**
 * 관리자 화면이 글·영상을 저장한 직후 부른다 — 바뀐 주소를 네이버·Bing 등에 알린다.
 *
 * 관리자만 부를 수 있다. 열어 두면 누구나 우리 키로 알림을 보내 요청 제한(429)을 소진시킬 수 있다.
 *
 * **알리기 전에 캐시를 비우고 새 페이지를 한 번 만들어 둔다.** 사이트는 '오래된 페이지를 먼저
 * 내주고 뒤에서 다시 만드는' 캐시(ISR)라, 그냥 기다렸다 알리면 방문이 드문 이 사이트에서는
 * 알림 받고 달려온 수집기가 그 '첫 방문자'가 되어 수정 전 페이지를 가져간다(실측: STALE).
 * revalidatePath로 비우면 다음 방문은 새로 그려진다 — 그 첫 방문을 우리가 먼저 하고 나서 알린다.
 *
 * **비우는 범위는 알릴 주소만이 아니라 사이트 전체다.** 2026-10-23 무료 한도 초과로 사이트가 멈춘 뒤
 * 페이지 캐시 수명을 60초에서 하루로 늘렸다(lib/posts.ts REVALIDATE). 그 전에는 글 하나를 고치면
 * 이웃 글의 이전/다음 제목·홈·RSS가 1분 뒤 저절로 따라왔지만, 이제는 비워 주지 않으면 하루를 간다.
 * 그래서 /api/revalidate와 같은 revalidatePath('/', 'layout')을 쓴다. 다시 그리는 일은 방문이 올 때만 일어난다.
 */
export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ ok: false, error: '관리자 로그인이 필요합니다.' }, { status: 401 });
  }
  let paths: unknown;
  try {
    ({ paths } = (await request.json()) as { paths?: unknown });
  } catch {
    return Response.json({ ok: false, error: '본문을 읽지 못했습니다.' }, { status: 400 });
  }
  if (!Array.isArray(paths) || paths.length === 0 || paths.length > 50) {
    return Response.json({ ok: false, error: 'paths는 1~50개의 주소 배열이어야 합니다.' }, { status: 400 });
  }

  // 우리 사이트의 경로만 받는다('/news/abc'처럼 슬래시로 시작, 쿼리·조각 없이).
  const list = [...new Set(paths.map((p) => String(p).trim()))].filter((p) => /^\/[A-Za-z0-9_\-./]*$/.test(p)).slice(0, 50);
  if (!list.length) return Response.json({ ok: false, error: '알릴 주소가 없습니다.' }, { status: 400 });

  // 1) 캐시 비우기 — 모든 페이지와, 그 페이지들이 읽은 Firestore 응답 캐시까지 함께 무효가 된다.
  revalidatePath('/', 'layout');

  after(async () => {
    // 2) 새 페이지를 먼저 한 번 만들어 둔다(지운 글은 이때 404가 된다).
    await Promise.all(
      list.map((p) =>
        fetch(`${SITE.url}${p}`, { cache: 'no-store', signal: AbortSignal.timeout(15000) }).catch(() => null),
      ),
    );
    // 3) 그다음 알린다.
    const results = await notifyIndexNow(list);
    const bad = results.filter((r) => r.status !== 200 && r.status !== 202);
    if (bad.length) console.error('[indexnow]', JSON.stringify(bad));
  });
  return Response.json({ ok: true, queued: list.length });
}
