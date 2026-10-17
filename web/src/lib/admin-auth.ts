import 'server-only';
import { PROJECT_ID } from './posts';

/**
 * 관리자 확인 — Firebase 로그인 토큰으로 Firestore admins 문서를 읽어 본다.
 *
 * 읽기 권한 자체가 firestore.rules의 isAdmin()으로 걸려 있으므로, 200(문서 있음)이나
 * 404(문서 없음)가 오면 관리자이고 401·403이면 아니다 — 보안 규칙을 그대로 인증 판정에
 * 쓴다. 서버에 비밀키가 필요 없다. 업로드 토큰 발급과 IndexNow 알림이 함께 쓴다.
 */
export async function isAdminToken(idToken: string): Promise<boolean> {
  if (!idToken) return false;
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
        `/databases/(default)/documents/admins/_probe`,
      { headers: { Authorization: `Bearer ${idToken}` }, cache: 'no-store' },
    );
    return res.status === 200 || res.status === 404;
  } catch {
    return false;
  }
}

/** 요청의 Authorization: Bearer <토큰>을 꺼내 관리자인지 본다. */
export async function isAdminRequest(request: Request): Promise<boolean> {
  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return isAdminToken(token);
}
