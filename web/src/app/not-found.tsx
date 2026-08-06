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
        {/* 제목 뒤에 깔리는 워터마크. 1.26:1이라 읽히는 글자가 아니고, 같은 뜻은 아래 h1이
            온전한 대비로 지고 있다. 보조기기에서도 장식으로 취급해 두 경험을 맞춘다. */}
        <p
          aria-hidden="true"
          className="text-[6rem] md:text-[9rem] font-black leading-none tracking-tighter text-white/10 select-none"
        >
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3 -mt-6">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-white/55 break-keep mb-10">주소가 바뀌었거나 삭제된 페이지입니다.</p>
        <Link
          href="/"
          className="inline-flex items-center px-7 py-3.5 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 font-bold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          홈으로 돌아가기
        </Link>
        {/* 홈으로 돌려보내는 것만으로는 원래 찾던 것에 닿지 못한다 — 사람에게 묻는 길을 하나 남긴다 */}
        <p className="mt-6 text-sm">
          <Link
            href="/contact"
            className="text-white/55 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            찾는 자료가 있으면 문의하기
          </Link>
        </p>
      </div>
    </main>
  );
}
