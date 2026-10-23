import { revalidatePath } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';

/**
 * 사이트 전체 캐시 비우기 — 관리자 화면이 공개 내용을 저장한 직후 부른다(메뉴 설정·지식베이스 등).
 *
 * 2026-10-23 사이트가 멈췄다. 모든 페이지가 60초마다 스스로 다시 만들어지는 ISR이라, 수집기가 쉬지
 * 않고 들르는 동안 Vercel Hobby의 Fast Origin Transfer(함수→CDN 전송, 월 10GB)를 다 써 버렸다.
 * 그래서 시간 기반 재생성은 하루로 늘리고(lib/posts.ts REVALIDATE), 대신 **바뀔 때만** 여기서 비운다.
 *
 * 경로 하나가 아니라 레이아웃 전체를 비운다. 헤더의 메뉴는 모든 페이지가 그리고, 글 하나를 고치면
 * 목록·이전/다음 글·홈·RSS·sitemap이 함께 바뀐다 — 무엇이 어디에 실리는지 따지다 하나 빠뜨리느니,
 * 저장 한 번에 전부를 '다음 방문 때 새로 그림'으로 돌려 둔다. 실제 재생성은 방문이 올 때 한 번씩만 일어난다.
 *
 * 관리자만 부를 수 있다. 열어 두면 누구나 캐시를 계속 비워, 막으려던 재생성 폭주를 그대로 다시 만든다.
 * 글 저장은 /api/indexnow가 같은 일을 하고 검색엔진 알림까지 이어서 한다.
 */
export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ ok: false, error: '관리자 로그인이 필요합니다.' }, { status: 401 });
  }
  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}
