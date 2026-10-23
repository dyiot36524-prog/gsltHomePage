import { revalidatePath } from 'next/cache';
import { KNOWLEDGE_SEED } from '@/lib/knowledge-seed';
import { adminPatch, isAdminAvailable } from '@/lib/firestore-admin';

/**
 * 코드에 적어 둔 회사 지식을 챗봇의 지식베이스(Firestore)로 밀어 넣는다.
 *
 * 왜 필요한가: `getKnowledge()`는 **Firestore에 문서가 하나라도 있으면 그쪽만 쓴다.**
 * 지금 10건이 등록돼 있으므로 `knowledge-seed.ts`를 아무리 고쳐도 챗봇은 옛날 내용을
 * 계속 답한다. 실제로 이 회사에 대해 새로 알게 된 것들 — 벤처기업 확인, 시옷이
 * 'Space Operating Platform'이라는 것, 복합 레이어 자동화 — 이 전부 화면에는 반영됐는데
 * 챗봇만 모르는 상태였다.
 *
 * 사람이 관리자 페이지에 붙여넣는 방법도 있다. 하지만 이 저장소에서 이미 한 번 배운 것이
 * 있다 — **콘텐츠가 사람의 클릭을 기다리는 구조 자체가 결함이다.** 언론보도 본문이 그렇게
 * 몇 주를 비어 있었다. 그래서 배포 후 한 번 호출하면 끝나는 경로를 둔다.
 *
 * 덮어쓰기 범위를 좁힌다: **id가 `seed-`로 시작하는 문서만** 건드린다. 관리자 페이지에서
 * 새로 만든 문서는 다른 id를 받으므로 이 동기화가 지우거나 덮지 않는다. 다만 관리자가
 * `seed-*` 문서를 화면에서 고쳤다면 그 수정은 여기서 덮인다 — 코드가 원본이라는 뜻이다.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function unauthorized() {
  return Response.json({ ok: false, message: 'unauthorized' }, { status: 401 });
}

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (request.headers.get('authorization') ?? '') === `Bearer ${secret}`;
}

async function sync() {
  if (!isAdminAvailable()) {
    return { ok: false, message: 'FIREBASE_SERVICE_ACCOUNT가 없습니다. 서비스 계정을 먼저 넣어 주세요.' };
  }

  const written: string[] = [];
  const failed: string[] = [];

  for (const d of KNOWLEDGE_SEED) {
    if (!d.id.startsWith('seed-')) continue; // 관리자가 만든 문서는 건드리지 않는다
    const ok = await adminPatch(
      `knowledge/${d.id}`,
      {
        title: { stringValue: d.title },
        category: { stringValue: d.category },
        body: { stringValue: d.body },
        priority: { integerValue: String(d.priority) },
        published: { booleanValue: true },
        source: { stringValue: 'code' },
        syncedAt: { timestampValue: new Date().toISOString() },
      },
      ['title', 'category', 'body', 'priority', 'published', 'source', 'syncedAt'],
    );
    (ok ? written : failed).push(d.id);
  }

  // 지식 캐시는 하루다(lib/knowledge.ts — 2026-10-23 무료 한도 초과 뒤 5분에서 늘렸다). 기다리지 않게
  // 여기서 사이트 전체 캐시를 비운다. 챗봇과 /llms-full.txt가 다음 요청부터 새 지식을 읽는다.
  if (written.length) revalidatePath('/', 'layout');
  return { ok: failed.length === 0, written: written.length, failed, note: '챗봇·사이트에 바로 반영' };
}

export async function POST(request: Request) {
  if (!authorized(request)) return unauthorized();
  return Response.json(await sync());
}
