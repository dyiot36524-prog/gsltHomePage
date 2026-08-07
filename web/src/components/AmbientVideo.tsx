'use client';

import { useEffect, useRef } from 'react';

/**
 * 화면 안에 있을 때만 도는 배경 영상.
 *
 * 원본 index.html의 data-autoplay 스크립트가 하던 일을 컴포넌트로 옮긴 것이다.
 * 보이지도 않는 영상을 계속 돌리면 디코딩과 배터리만 쓴다. preload="none"이라
 * 스크롤이 닿기 전에는 바이트도 받지 않는다.
 *
 * 모션 최소화 설정에서는 재생하지 않는다 — 분위기용 루프라 멈춰 있어도
 * 잃는 정보가 없다. 소리도 없고 자막이 필요한 내용도 없으므로 보조기기에서는 숨긴다.
 */
export default function AmbientVideo({
  src,
  className = '',
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const p = v.play();
            if (p && p.catch) p.catch(() => { /* 자동재생 거부는 무시 — 정지 화면으로 남는다 */ });
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
