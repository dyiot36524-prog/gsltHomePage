import 'server-only';
import { SITE } from './site';

/**
 * IndexNow — 바뀐 주소를 검색엔진에 바로 알린다.
 *
 * 네이버 서치어드바이저가 공식 지원하고(searchadvisor.naver.com/guide/indexnow-about), Bing·
 * Yandex·Seznam 등 참여 검색엔진끼리 받은 주소를 서로 공유한다(indexnow.org). ChatGPT 검색은
 * Bing 색인을 외부 검색 공급자로 쓰는 것으로 알려져 있어, Bing에 빨리 닿는 것이 곧 AI 검색에
 * 빨리 닿는 길이다. 구글은 참여하지 않는다.
 *
 * 키는 비밀이 아니다 — 사이트 루트의 <키>.txt에 그대로 공개해 "이 사이트의 주인이 보낸 알림"
 * 임을 증명하는 용도다. 색인을 보장하지는 않는다(두 곳 모두 그렇게 명시).
 * 바뀐 주소만 보낸다. 같은 목록을 반복해서 보내면 요청 제한(429)에 걸린다.
 */
export const INDEXNOW_KEY = '9bdf6557b8203adf341f0b2c58470a69';

const HOST = new URL(SITE.url).host;
const ENDPOINTS = [
  // 공용 접수처 — 참여 검색엔진 전체로 공유된다.
  'https://api.indexnow.org/indexnow',
  // 네이버는 이 사이트의 주 무대라 직접도 보낸다(공유를 기다리지 않게).
  'https://searchadvisor.naver.com/indexnow',
];

export type IndexNowResult = { endpoint: string; status: number | 'error'; detail?: string };

/** '/news/abc'나 전체 주소를 받아 우리 호스트의 전체 주소로 맞춘다. 남의 주소는 버린다. */
function absolute(u: string): string | null {
  try {
    const url = new URL(u, SITE.url);
    return url.host === HOST ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function notifyIndexNow(paths: string[]): Promise<IndexNowResult[]> {
  const urlList = [...new Set(paths.map(absolute).filter((u): u is string => !!u))].slice(0, 10000);
  if (!urlList.length) return [];
  const body = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE.url}/${INDEXNOW_KEY}.txt`,
    urlList,
  });
  return Promise.all(
    ENDPOINTS.map(async (endpoint): Promise<IndexNowResult> => {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body,
          signal: AbortSignal.timeout(8000),
        });
        // 200 접수 · 202 키 확인 대기 — 둘 다 정상이다.
        return { endpoint, status: res.status, detail: res.ok ? undefined : (await res.text()).slice(0, 200) };
      } catch (e) {
        return { endpoint, status: 'error', detail: String(e).slice(0, 200) };
      }
    }),
  );
}
