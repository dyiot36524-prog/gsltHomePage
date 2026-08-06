'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * 가로 타임라인 위의 진행 바.
 * 원본 about.html 하단 스크립트(#tl-wrap / #tl-progress)를 그대로 옮긴 것으로,
 * 뷰포트에 30% 이상 들어오면 바가 100%까지 차오른다.
 */
export default function TimelineProgress({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const wrap = wrapRef.current;
    if (!bar || !wrap || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            bar.style.width = '100%';
            obs.disconnect();
          }
        }),
      { threshold: 0.3 },
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <div className="hidden md:block absolute top-[10px] left-1 right-1 h-0.5 bg-slate-200 rounded overflow-hidden">
        <div
          ref={barRef}
          className="h-full w-0 bg-gradient-to-r from-gslt-400 via-blue-500 to-amber-400"
          style={{ transition: 'width 1.6s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </div>
      {children}
    </div>
  );
}
