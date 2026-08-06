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
      // opacity:0으로만 감추면 버튼이 초점 순서에 그대로 남아, 키보드 사용자는 보이지 않는 버튼을
      // 밟는다. inert가 초점·접근성 트리에서 함께 빼준다.
      inert={!show}
      onClick={() => {
        // html의 scroll-behavior는 모션 최소화 때 auto로 되돌지만, 여기서 smooth를 명시하면
        // 그 설정을 덮어쓴다. 설정을 직접 읽어 맞춘다.
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }}
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white/95 border border-slate-200 shadow-lg text-[11px] font-extrabold tracking-wider text-slate-600 transition-opacity duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-700 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      TOP
    </button>
  );
}
