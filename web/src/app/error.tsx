'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * 서버 오류 화면. 404(not-found.tsx)와 같은 모양으로, 상태 코드는 Next가 5xx로 낸다.
 *
 * 목록·글을 못 읽으면 이제 화면을 200으로 그리지 않고 던진다(네이버 HTTP 규약 가이드:
 * 서버 오류는 5xx로). 그 대신 방문자가 막다른 화면을 보지 않도록 다시 시도와 문의 길을 둔다.
 * ISR 페이지는 다시 만들다 실패하면 직전 정상 페이지를 계속 내보내므로, 이 화면은
 * 캐시가 없을 때만 보인다.
 */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white px-6 text-center">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">잠시 내용을 불러오지 못했습니다</h1>
        <p className="text-white/55 break-keep mb-10">일시적인 문제입니다. 잠시 후 다시 시도해 주세요.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center px-7 py-3.5 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 font-bold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          다시 시도
        </button>
        <p className="mt-6 text-sm flex items-center justify-center gap-5">
          <Link
            href="/"
            className="text-white/55 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            홈으로
          </Link>
          <Link
            href="/contact"
            className="text-white/55 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            문의하기
          </Link>
        </p>
      </div>
    </main>
  );
}
