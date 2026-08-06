import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white px-6 text-center">
      <div>
        <p className="text-[6rem] md:text-[9rem] font-black leading-none tracking-tighter text-white/10 select-none">
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3 -mt-6">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-white/50 break-keep mb-10">주소가 바뀌었거나 삭제된 페이지입니다.</p>
        <Link
          href="/"
          className="inline-flex items-center px-7 py-3.5 rounded-full bg-gslt-500 hover:bg-gslt-600 text-white font-bold text-sm transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
