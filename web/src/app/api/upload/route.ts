import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

/**
 * 대용량 첨부 업로드 (Vercel Blob, 클라이언트 직접 업로드).
 *
 * 자료실 첨부는 Cloudinary로 가는데 무료 플랜 상한이 파일당 10MB다. 23MB 회사소개서가
 * 실제로 거절됐다. 이 라우트는 그보다 큰 파일을 위한 두 번째 경로다 —
 * 관리자 페이지가 10MB를 넘는 파일만 이쪽으로 보낸다.
 *
 * 서버를 거치지 않고 브라우저가 저장소로 직접 올린다. Vercel 함수의 요청 본문 상한이
 * 4.5MB라 서버 경유로는 애초에 큰 파일을 받을 수 없다. 이 라우트가 하는 일은
 * 업로드 토큰 발급뿐이고, 파일 바이트는 여기를 지나가지 않는다.
 *
 * **토큰 발급은 관리자에게만 한다.** 클라이언트가 Firebase 로그인 토큰을 함께 보내면,
 * 그 토큰으로 Firestore admins 문서를 읽어 본다. 읽기 권한 자체가 firestore.rules의
 * isAdmin()으로 걸려 있으므로, 200(문서 있음)이나 404(문서 없음)가 오면 관리자이고
 * 403이면 아니다 — 보안 규칙을 그대로 인증 판정에 쓴다. 서버에 비밀키가 필요 없다.
 *
 * 사전 준비: Vercel 대시보드 → Storage → Blob 스토어를 만들어 gslt-next에 연결해야
 * BLOB_READ_WRITE_TOKEN이 주입된다. 없으면 아래에서 안내 메시지로 실패한다.
 */

export const runtime = 'nodejs';

const PROJECT_ID = 'gslthomepage';

async function isAdminToken(idToken: string): Promise<boolean> {
  if (!idToken) return false;
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
        `/databases/(default)/documents/admins/_probe`,
      { headers: { Authorization: `Bearer ${idToken}` }, cache: 'no-store' },
    );
    // 200 문서 있음 · 404 문서 없음 — 둘 다 "읽기 권한은 있다"는 뜻이라 관리자다.
    // 401·403은 규칙이 거절한 것이므로 관리자가 아니다.
    return res.status === 200 || res.status === 404;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // 연결 여부를 환경변수 이름으로 미리 판정하지 않는다. Blob 스토어를 붙이는 방식이
  // 두 가지(RW 토큰 / OIDC + BLOB_STORE_ID)라 특정 이름의 유무로 막으면, 멀쩡히 연결된
  // 설정을 '연결 안 됨'으로 잘못 돌려보낸다 — 실제로 그렇게 한 번 막았다.
  // SDK가 시도하게 두고, 실패했을 때 그 이유를 그대로 받아 안내로 바꾼다.
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const ok = await isAdminToken(String(clientPayload || ''));
        if (!ok) throw new Error('관리자 로그인이 필요합니다.');
        return {
          // 첨부로 쓰이는 형식만. 실수로 아무 파일이나 올리는 것을 막는 정도의 제한이다.
          allowedContentTypes: [
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/haansofthwp',
            'application/x-hwp',
            'application/octet-stream',
            'image/png',
            'image/jpeg',
            'image/webp',
            'video/mp4',
          ],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200MB — 상한은 두되 넉넉히
          addRandomSuffix: true,
        };
      },
      // 업로드 완료 웹훅. 지금은 기록할 것이 없다 — 첨부 URL은 관리자 페이지가
      // 글 문서에 직접 저장한다.
      onUploadCompleted: async () => {},
    });
    return Response.json(result);
  } catch (e) {
    const raw = e instanceof Error ? e.message : '';
    // 배포 로그에 남긴다. 브라우저 쪽 메시지만으로는 어느 단계에서 막혔는지
    // 알 수 없어 원인 추적에 한 번 애를 먹었다.
    console.error('[api/upload]', raw || e);
    // 스토어 미연결은 사용자가 고칠 수 있는 일이라 무엇을 해야 하는지 알려 준다.
    if (/BLOB_READ_WRITE_TOKEN|No token|store/i.test(raw)) {
      return Response.json(
        {
          error:
            `대용량 저장소에 연결하지 못했습니다. Vercel 대시보드 → Storage에서 Blob 스토어가 gslt-next에 연결됐는지 확인해 주세요. (${raw})`,
        },
        { status: 503 },
      );
    }
    return Response.json({ error: raw || '업로드 준비에 실패했습니다.' }, { status: 400 });
  }
}
