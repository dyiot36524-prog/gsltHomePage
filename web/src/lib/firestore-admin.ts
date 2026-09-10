/**
 * 서비스 계정으로 Firestore에 접근한다.
 *
 * 왜 필요한가: `firestore.rules`가 `inquiries`의 read/update를 `isAdmin()`으로 막는다.
 * 서버는 익명 공개 키로만 접근하므로 **자기가 방금 저장한 문의조차 다시 읽지 못한다.**
 * 그래서 "알림이 안 나간 문의를 찾아 다시 보낸다"는 재시도가 성립하지 않았다.
 *
 * 왜 firebase-admin을 쓰지 않는가: 이 저장소는 posts.ts·knowledge.ts·inquiry 라우트가
 * 전부 Firestore REST를 직접 호출한다. SDK를 들이면 같은 일을 하는 두 가지 방식이 공존한다.
 * 여기서는 **인증만** 더한다 — 서비스 계정으로 JWT를 만들어 액세스 토큰으로 바꾸고,
 * 호출 모양은 기존과 똑같이 유지한다. 의존성도 늘지 않는다(Web Crypto만 쓴다).
 *
 * 키가 없으면 `isAdminAvailable()`이 false다. 호출자는 그때 조용히 물러나야 한다 —
 * 2단계(재시도)가 없어도 1단계(즉시 알림)는 그대로 돌아야 하기 때문이다.
 */

const PROJECT_ID = 'gslthomepage';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const SCOPE = 'https://www.googleapis.com/auth/datastore';

type ServiceAccount = { client_email: string; private_key: string };

function account(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
    if (!parsed.client_email || !parsed.private_key) return null;
    return { client_email: parsed.client_email, private_key: parsed.private_key };
  } catch {
    // 붙여넣다 깨진 JSON은 흔하다. 여기서 죽으면 원인을 찾기 어려우니 로그를 남기고 물러난다.
    console.error('[firestore-admin] FIREBASE_SERVICE_ACCOUNT 파싱 실패');
    return null;
  }
}

export function isAdminAvailable(): boolean {
  return account() !== null;
}

function b64url(bytes: Uint8Array | string): string {
  const bin = typeof bytes === 'string' ? bytes : String.fromCharCode(...bytes);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** PEM(PKCS#8) → CryptoKey. 서비스 계정 JSON의 private_key가 이 형식이다. */
async function importKey(pem: string): Promise<CryptoKey> {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8',
    der.buffer as ArrayBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

/** 토큰은 1시간짜리다. 매 호출마다 새로 받으면 불필요한 왕복이 생긴다. */
let cached: { token: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string | null> {
  const sa = account();
  if (!sa) return null;

  // 만료 5분 전에 미리 갈아 끼운다. 경계에서 401이 나는 것을 피한다.
  if (cached && Date.now() < cached.expiresAt - 5 * 60 * 1000) return cached.token;

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const signing = `${header}.${claims}`;
  const key = await importKey(sa.private_key);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signing));
  const jwt = `${signing}.${b64url(new Uint8Array(sig))}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    console.error('[firestore-admin] 토큰 발급 실패:', res.status, (await res.text()).slice(0, 200));
    return null;
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;

  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cached.token;
}

/* ── Firestore 값 헬퍼. REST의 typed value를 오가는 지루한 부분을 한곳에 모은다. ── */

export type FsValue = {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  timestampValue?: string;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};

export type FsDoc = { name: string; fields?: Record<string, FsValue>; createTime?: string };

export const fs = {
  str: (v: FsValue | undefined): string => v?.stringValue ?? '',
  bool: (v: FsValue | undefined): boolean => v?.booleanValue === true,
  int: (v: FsValue | undefined): number => Number(v?.integerValue ?? 0) || 0,
  time: (v: FsValue | undefined): number => (v?.timestampValue ? Date.parse(v.timestampValue) : 0),
  arr: (v: FsValue | undefined): string[] =>
    (v?.arrayValue?.values ?? []).map((x) => x.stringValue ?? '').filter(Boolean),
  map: (v: FsValue | undefined): Record<string, FsValue> => v?.mapValue?.fields ?? {},
  /** 문서 경로에서 ID만. `projects/…/documents/inquiries/abc` → `abc` */
  id: (name: string): string => name.split('/').pop() ?? '',
};

/** structuredQuery 실행. 실패하면 빈 배열 — 스윕이 죽는 것보다 이번 차례를 거르는 편이 낫다. */
export async function adminQuery(structuredQuery: unknown): Promise<FsDoc[]> {
  const token = await accessToken();
  if (!token) return [];
  try {
    const res = await fetch(`${BASE}:runQuery`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ structuredQuery }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error('[firestore-admin] query 실패:', res.status, (await res.text()).slice(0, 300));
      return [];
    }
    const rows = (await res.json()) as Array<{ document?: FsDoc }>;
    return rows.map((r) => r.document).filter((d): d is FsDoc => Boolean(d));
  } catch (e) {
    console.error('[firestore-admin] query 예외:', e);
    return [];
  }
}

/** 지정한 필드만 갱신. updateMask를 주므로 나머지 필드는 건드리지 않는다. */
export async function adminPatch(
  path: string,
  fields: Record<string, FsValue>,
  maskPaths: string[],
): Promise<boolean> {
  const token = await accessToken();
  if (!token) return false;
  const mask = maskPaths.map((p) => `updateMask.fieldPaths=${encodeURIComponent(p)}`).join('&');
  try {
    const res = await fetch(`${BASE}/${path}?${mask}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error('[firestore-admin] patch 실패:', res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error('[firestore-admin] patch 예외:', e);
    return false;
  }
}
