import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // web/ 이 저장소 루트가 아니라서 Turbopack이 상위 lockfile을 잡으려 한다. 명시적으로 고정.
  turbopack: { root: path.resolve(__dirname) },
  images: {
    // 관리자가 올리는 이미지는 Cloudinary로 간다. 허용 호스트를 명시하지 않으면
    // next/image가 외부 이미지를 거부한다.
    // i.ytimg.com은 회사소개 영상의 유튜브 표지(썸네일)다. 재생 전에는 이 그림만 받는다.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
  // 같은 사이트가 Vercel 기본 주소(gslt-next.vercel.app)로도 200을 내고 있었다. 네이버 가이드는
  // 같은 콘텐츠를 여러 주소로 내지 말고 대표 주소로 301 하라고 한다. 프로젝트 기본 주소는
  // 정본으로 보낸다. 배포마다 생기는 미리보기 주소는 확인용이라 남기되, 아래에서 noindex를 붙인다.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'gslt-next.vercel.app' }],
        destination: 'https://www.gslt.kr/:path*',
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<deploy>.+)\\.vercel\\.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },
};

export default nextConfig;
