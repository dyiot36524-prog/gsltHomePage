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
};

export default nextConfig;
