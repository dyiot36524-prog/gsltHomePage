'use client';

import { useEffect, useState } from 'react';

/** 600px 넘게 내려가면 나타나는 맨 위로 버튼. 전 페이지 공통. */
export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white/95 border border-slate-200 shadow-lg text-[11px] font-extrabold tracking-wider text-slate-600 transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      TOP
    </button>
  );
}
