'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * 스크롤 진입 시 나타나는 래퍼. 기존 사이트의 .animate-on-scroll / .reveal 을 대체한다.
 * 서버에서 렌더된 내용을 감싸기만 하므로 콘텐츠 자체는 크롤러에 그대로 보인다.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** ms */
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 모션 최소화 설정이면 관찰 없이 즉시 노출
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('on');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
