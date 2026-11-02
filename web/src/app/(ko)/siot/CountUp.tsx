'use client';

import { useEffect, useRef } from 'react';

/**
 * 화면에 들어오면 0에서 목표값까지 1.2초간 세는 숫자.
 * 원본 siot.html의 .count-up 스크립트(easeOutCubic)와 동일하다.
 */
export default function CountUp({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          let start: number | null = null;
          const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / 1200, 1);
            el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
            if (p < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }),
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, decimals]);

  return <span ref={ref}>0</span>;
}
