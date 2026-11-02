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
    if (!bar || !wrap) return;

    // 다 찬 상태로 즉시 세운다. 진행 바는 연혁이 '지금'까지 왔다는 표시라
    // 채워지지 않은 채 남으면 정보가 빠진 것이고, 빈 트랙만 보인다.
    const fill = () => {
      bar.style.transition = 'none';
      bar.style.transform = 'scaleX(1)';
    };
    if (!('IntersectionObserver' in window)) return fill();
    // 모션 최소화: 1.6초짜리 채움을 돌리지 않고 결과만 보여준다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return fill();

    const obs = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            bar.style.transform = 'scaleX(1)';
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
        {/* 폭을 늘리면 매 프레임 레이아웃이 걸리므로 가로 스케일로 채운다.
            가로 그라디언트를 가로로 균일 확대한 결과는 폭 애니메이션과 동일하다. */}
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-gradient-to-r from-gslt-400 via-blue-500 to-amber-400"
          style={{ transform: 'scaleX(0)', transition: 'transform 1.6s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </div>
      {children}
    </div>
  );
}
