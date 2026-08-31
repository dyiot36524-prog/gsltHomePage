import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * 웹 앱 매니페스트. /manifest.webmanifest 가 404였다.
 *
 * 홈 화면에 추가했을 때의 이름·아이콘·색을 정한다. 검색 순위에 직접 걸리지는 않지만,
 * 모바일에서 저장한 사용자에게 주소 문자열 대신 회사 이름이 뜨고, 브라우저가
 * 사이트를 하나의 앱으로 인식한다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.nameKo}(${SITE.name}) — 무선 IoT 구축`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    lang: 'ko',
    // 히어로가 어두운 면으로 시작하므로 로딩 배경도 같은 색으로 둔다.
    background_color: '#05070c',
    theme_color: '#28b8c5',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
