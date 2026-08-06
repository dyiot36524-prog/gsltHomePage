'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from '@/components/Icon';

/**
 * 히어로 — 스크롤에 따라 재생되는 스마트빌딩 필름.
 *
 * #hero-track이 스크롤 구간을 만들고 .hero-stage가 그 안에 sticky로 고정된다.
 * 스크롤 진행도(0~1) 하나를 잡아 영상 currentTime과 텍스트 리빌을 함께 몰아준다.
 * 영상은 전 프레임 키프레임(-g 1)이라 currentTime 대입만으로 프레임 단위 탐색이 된다.
 *
 * 클라이언트 컴포넌트지만 마크업은 서버에서도 렌더되므로 크롤러는 헤드라인·본문을 그대로 본다.
 * 초기 은닉은 layout의 인라인 스크립트가 붙이는 .js-hero 클래스가 담당한다 —
 * 마운트 후 숨기면 텍스트가 한 번 번쩍이기 때문이다.
 */

const ROWS = [
  { href: '/siot', no: '01', name: '시옷 솔루션', desc: '무선 IoT 구축 · 통합 제어', hover: 'group-hover:text-siot-500' },
  { href: '/bizmoa', no: '02', name: '비즈모아 자동화', desc: 'IoT 시공 견적 자동화 SaaS', hover: 'group-hover:text-bizmoa-500' },
  { href: '/morak', no: '03', name: '모락 커뮤니티', desc: '기수제 모임 플랫폼 · 디지털 명함', hover: 'group-hover:text-morak-400' },
] as const;

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const rowsRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!track || !stage || !video) return;

    const veil = veilRef.current;
    const cue = cueRef.current;
    const rows = rowsRef.current.filter(Boolean);

    // 모션 최소화 설정: 스크럽 없이 마지막 장면 + 텍스트를 즉시 노출
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('hero-static');
      const toEnd = () => {
        try {
          video.currentTime = Math.max(0, video.duration - 0.05);
        } catch { /* 탐색 실패 무시 */ }
      };
      if (video.readyState >= 1) toEnd();
      else video.addEventListener('loadedmetadata', toEnd, { once: true });
      return () => document.documentElement.classList.remove('hero-static');
    }

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const SCRUB_END = 0.6; // 이 진행도에서 영상이 끝까지 재생되고, 이후는 텍스트 리빌·정지 구간
    let duration = 0;

    const fade = (el: HTMLElement | null, t: number, dist: number) => {
      if (!el) return;
      const e = easeOut(t);
      el.style.setProperty('--o', e.toFixed(3));
      el.style.setProperty('--y', `${((1 - e) * dist).toFixed(1)}px`);
    };

    const maskUp = (el: HTMLElement | null, t: number) => {
      if (!el) return;
      el.style.setProperty('--y', `${((1 - easeOut(t)) * 110).toFixed(1)}%`);
    };

    const paint = (p: number) => {
      if (duration) {
        const t = Math.min(duration - 0.03, seg(p, 0, SCRUB_END) * duration);
        // 미세한 차이까지 대입하면 탐색이 밀리므로 임계값을 둔다
        if (Math.abs(video.currentTime - t) > 0.01) {
          try {
            video.currentTime = t;
          } catch { /* 탐색 실패 무시 */ }
        }
      }

      if (veil) veil.style.opacity = seg(p, 0.3, 0.6).toFixed(3);
      if (cue) cue.style.opacity = (1 - seg(p, 0.02, 0.14)).toFixed(3);

      maskUp(line1Ref.current, seg(p, 0.36, 0.56));
      maskUp(line2Ref.current, seg(p, 0.42, 0.62));
      fade(descRef.current, seg(p, 0.5, 0.66), 22);
      rows.forEach((r, i) => {
        const a = 0.56 + i * 0.035;
        fade(r, seg(p, a, a + 0.16), 18);
      });

      // 리빌 전에는 투명한 링크가 클릭·탭을 가로채지 않게
      const live = p > 0.58;
      rows.forEach((r) => {
        r.style.pointerEvents = live ? '' : 'none';
      });
    };

    let target = 0;
    let current = 0;
    let raf = 0;
    let settled = 0;
    let disposed = false;

    const measure = () => {
      const span = track.offsetHeight - stage.offsetHeight;
      if (span <= 0) return 0;
      return clamp01(-track.getBoundingClientRect().top / span);
    };

    const frame = () => {
      if (disposed) return;
      const delta = target - current;
      if (Math.abs(delta) < 0.0006) {
        current = target;
        settled++;
      } else {
        current += delta * 0.2; // 살짝 뒤따라오게 해 탐색 요청이 몰리지 않도록
        settled = 0;
      }
      paint(current);
      raf = settled > 3 ? 0 : requestAnimationFrame(frame);
    };

    const kick = () => {
      if (disposed) return;
      target = measure();
      settled = 0;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMeta = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      kick();
    };
    if (video.readyState >= 1) onMeta();
    else video.addEventListener('loadedmetadata', onMeta);

    // iOS는 사용자 제스처 안에서 한 번 재생을 거쳐야 탐색이 안정적으로 먹는다
    const prime = () => {
      const played = video.play();
      if (played && played.then) played.then(() => video.pause()).catch(() => {});
      else {
        try {
          video.pause();
        } catch { /* 무시 */ }
      }
    };
    window.addEventListener('touchstart', prime, { once: true, passive: true });
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);

    current = target = measure();
    paint(current);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      video.removeEventListener('loadedmetadata', onMeta);
      window.removeEventListener('touchstart', prime);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
  }, []);

  return (
    <section id="hero" className="relative bg-[#05070c]">
      <noscript>
        <style>{`
          #hero-track { height: auto; }
          .hero-stage { position: relative; height: auto; min-height: 100svh; }
          .hero-veil { opacity: .82; }
        `}</style>
      </noscript>

      <div id="hero-track" ref={trackRef} className="relative">
        <div className="hero-stage" ref={stageRef}>
          {/*
            poster는 반드시 영상의 '첫 프레임'이어야 한다. 마지막 프레임을 쓰면 로드 직후
            끝 장면이 떠 있다가 스크럽이 t=0을 그리는 순간 첫 장면으로 튄다.
            파일명의 v2는 캐시 버전 — 같은 이름에 다른 내용을 덮어쓰면 재방문자가
            옛 영상을 계속 보게 되므로, 내용이 바뀌면 v3로 올린다.

            화면 크기별 3단. media는 로드 시점에 한 번만 평가된다.
            코덱은 전부 H.264 — 같은 화질의 VP9/WebM은 all-intra 디코딩이 무거워
            2560에서 탐색이 126ms까지 늘어져(H.264는 10ms) 스크럽이 끊긴다.
          */}
          <video
            id="hero-video"
            ref={videoRef}
            poster="/img/hero-v2-poster.jpg"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/img/hero-v2-1280.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/img/hero-v2-1920.mp4" type="video/mp4" media="(max-width: 1439px)" />
            <source src="/img/hero-v2-2560.mp4" type="video/mp4" />
          </video>

          <div className="hero-grade" />
          <div className="hero-veil" ref={veilRef} />

          <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-6xl mx-auto w-full hero-shadow">
              <h1 className="hero-title font-black tracking-tight break-keep text-white">
                <span className="hero-line">
                  <span className="hero-line-inner" ref={line1Ref}>오피스에서 빌딩까지,</span>
                </span>
                <span className="hero-line">
                  <span className="hero-line-inner text-gslt-400" ref={line2Ref}>공간을 IoT로 짓습니다.</span>
                </span>
              </h1>

              <p
                className="hero-fade hero-desc max-w-2xl text-white/55 leading-relaxed break-keep"
                ref={descRef}
              >
                배선 공사 없는 무선 IoT 구축 <strong className="text-white font-semibold">시옷</strong>,
                IoT 시공 견적 자동화 <strong className="text-white font-semibold">비즈모아</strong>,
                모임을 연결하는 <strong className="text-white font-semibold">모락</strong>.
                지에스엘티는 오피스·주거·빌딩, 모든 공간을 스마트 공간으로 완성하는 IoT 구축 전문기업입니다.
              </p>

              <div>
                {ROWS.map((r, i) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    ref={(el) => {
                      if (el) rowsRef.current[i] = el;
                    }}
                    className={`hero-fade hero-row group flex items-center justify-between gap-4 border-t ${
                      i === ROWS.length - 1 ? 'border-b' : ''
                    } border-white/10`}
                  >
                    <div className="flex items-baseline gap-4 md:gap-6 min-w-0">
                      <span className="text-xs font-semibold tracking-widest text-white/30">{r.no}</span>
                      <span className={`hero-row-name font-bold text-white ${r.hover} transition-colors duration-300`}>
                        {r.name}
                      </span>
                      <span className="hidden sm:inline text-sm text-white/35 truncate">{r.desc}</span>
                    </div>
                    <ArrowUpRight
                      className={`w-5 h-5 md:w-6 md:h-6 text-white/30 ${r.hover} group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div
            id="hero-cue"
            ref={cueRef}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hero-shadow pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/45">Scroll</span>
              <span className="relative block w-px h-12 bg-white/15 overflow-hidden">
                <span className="scroll-dash" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
