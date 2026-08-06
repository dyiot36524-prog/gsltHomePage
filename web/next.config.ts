import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // web/ 이 저장소 루트가 아니라서 Turbopack이 상위 lockfile을 잡으려 한다. 명시적으로 고정.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
