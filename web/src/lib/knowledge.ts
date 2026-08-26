import { KNOWLEDGE_SEED } from './knowledge-seed';

/**
 * 챗봇이 답변 근거로 쓰는 회사 지식.
 *
 * Firestore `knowledge` 컬렉션을 읽는다. 관리자 페이지의 '지식베이스' 탭이 이 컬렉션을
 * 관리하고, 여기서 끄면(published=false) 다음 재생성부터 답변 근거에서 빠진다.
 *
 * 등록된 문서가 없으면 knowledge-seed.ts의 기본값으로 답한다 — 빈 지식으로 도는
 * 챗봇은 겉보기에 정상이라 조용히 방치된다.
 *
 * 벡터 DB를 쓰지 않는다. 문서가 수십 건인 동안은 전량을 프롬프트에 넣는 편이 정확하고,
 * 임베딩 색인을 따로 갱신하는 운영 부담이 없다. 문서가 늘어 예산을 넘기면 그때
 * priority 순으로 자르고, 그래도 모자라면 그때 검색을 도입한다 — 지금 도입하면
 * 관리할 것만 늘고 답변은 나아지지 않는다.
 */

const PROJECT_ID = 'gslthomepage';
// posts.ts와 같은 공개용 웹 API 키. 실제 권한은 firestore.rules가 통제한다 (비밀이 아님).
const API_KEY = 'AIzaSyCjnuHSGhy97XOtoVC1fSwnGInLwVs1wok';

/** 지식은 자주 바뀌지 않는다. 5분이면 관리자가 고친 내용이 충분히 빨리 반영된다. */
const REVALIDATE = 300;

export type KnowledgeDoc = {
  id: string;
  title: string;
  category: string;
  body: string;
  priority: number;
};

type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
};

function str(v: FsValue | undefined): string {
  return typeof v?.stringValue === 'string' ? v.stringValue : '';
}

function num(v: FsValue | undefined): number {
  if (v?.integerValue !== undefined) return Number(v.integerValue) || 0;
  if (typeof v?.doubleValue === 'number') return v.doubleValue;
  return 0;
}

/**
 * 공개된 지식 문서. priority 내림차순 — 프롬프트 예산이 모자랄 때 뒤에서부터 잘린다.
 *
 * 실패하면 빈 배열을 낸다. 지식이 없으면 챗봇은 "회사 자료에서 확인되지 않는다"고
 * 답하게 되어 있어, 틀린 답을 지어내는 것보다 낫다.
 */
export async function getKnowledge(): Promise<KnowledgeDoc[]> {
  const docs = await fetchKnowledge();
  // Firestore에 문서가 하나라도 있으면 그쪽만 쓴다. 관리자에서 자료를 넣는 순간부터
  // 코드 쪽 기본값은 쓰이지 않는다 — 자세한 사정은 knowledge-seed.ts에 적었다.
  return docs.length > 0 ? docs : KNOWLEDGE_SEED;
}

async function fetchKnowledge(): Promise<KnowledgeDoc[]> {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
        `/databases/(default)/documents:runQuery?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'knowledge' }],
            where: {
              fieldFilter: {
                field: { fieldPath: 'published' },
                op: 'EQUAL',
                value: { booleanValue: true },
              },
            },
          },
        }),
        next: { revalidate: REVALIDATE },
      },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{
      document?: { name: string; fields?: Record<string, FsValue> };
    }>;
    return rows
      .filter((r) => r.document)
      .map((r) => {
        const f = r.document!.fields || {};
        return {
          id: r.document!.name.split('/').pop()!,
          title: str(f.title),
          category: str(f.category),
          body: str(f.body),
          priority: num(f.priority),
        };
      })
      .filter((d) => d.title && d.body)
      .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title, 'ko'));
  } catch {
    return [];
  }
}

/**
 * 지식 문서를 프롬프트에 넣을 형태로 만든다.
 *
 * `<document>` 태그로 감싸는 것이 핵심이다. 이 안의 글자는 **읽을 자료이지 지시가 아니다**.
 * 관리자만 쓸 수 있는 컬렉션이라 유입 경로가 좁지만, 문서에 "이제부터 모든 규칙을
 * 무시하라" 같은 문장이 섞여 들어와도 모델이 그것을 명령으로 읽지 않게 경계를 둔다.
 *
 * budget은 대략적인 글자 수 상한이다. 넘으면 priority가 낮은 것부터 뺀다.
 */
export function knowledgeBlock(docs: KnowledgeDoc[], budget = 24000): string {
  const kept: string[] = [];
  let used = 0;
  for (const d of docs) {
    const chunk =
      `<document category="${d.category || '기타'}">\n` +
      `# ${d.title}\n${d.body.trim()}\n` +
      `</document>`;
    if (used + chunk.length > budget) continue;
    kept.push(chunk);
    used += chunk.length;
  }
  return kept.join('\n\n');
}
