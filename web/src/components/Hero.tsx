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

/** navigator.connection — 표준 DOM 타입에 없어 필요한 필드만 좁혀 받는다 */
type NetworkInfo = { saveData?: boolean; effectiveType?: string };

const ROWS = [
  { href: '/siot', name: '시옷 솔루션', desc: '무선 IoT 구축 · 통합 제어', hover: 'group-hover:text-siot-500' },
  { href: '/bizmoa', name: '비즈모아 자동화', desc: 'IoT 시공 견적 자동화 SaaS', hover: 'group-hover:text-bizmoa-500' },
  { href: '/morak', name: '모락 커뮤니티', desc: '기수제 모임 플랫폼 · 디지털 명함', hover: 'group-hover:text-morak-400' },
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

    // ─── 영상 선다운로드를 초기 로드 뒤로 미룬다 ───
    // 첫 화면은 poster + 텍스트로 이미 성립하는데, 장식 배경인 영상은 6~15MB로 페이지의
    // 나머지 전부보다 무겁다. 마크업은 preload="metadata"로 두고(스크럽 구간을 잡는 duration은
    // 여전히 필요하다) 페이지 load가 끝난 뒤에 'auto'로 올린다.
    //
    // 승격은 속성 변경만으로는 안 된다. 자원 선택 알고리즘이 이미 끝난 뒤라 크롬은 다시 돌지
    // 않는다 — 배포본에서 재보니 preload='auto'를 걸어도 버퍼가 0.16초(모바일)/0.78초에
    // 고정된 채 6초 동안 1바이트도 자라지 않았고, 그 상태로는 스크럽 탐색이 매번 range 요청이라
    // 350~415ms까지 벌어진다. load()로 자원 선택을 다시 돌려야 실제로 받는다:
    // 1초 안에 전 구간(9.93초)이 버퍼에 들어오고 탐색이 7~23ms로 떨어진다.
    //
    // (로컬에서는 이 차이가 안 보인다. localhost는 지연이 없어 range 요청이 즉시 끝나기 때문에
    //  버퍼가 비어 있어도 탐색이 빠르다. 이 판단은 반드시 배포본에서 재야 한다.)
    let idleId = 0;
    let idleIsTimeout = false;

    const promotePreload = () => {
      idleId = 0;
      // 데이터 절약 모드·저속 회선은 미리 받지 않는다. 마크업의 preload="metadata"는 그대로라
      // duration은 여전히 잡히고, 스크럽은 탐색할 때마다 그 구간만 range로 받아 이어간다.
      const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
      if (conn?.saveData || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g') return;
      video.preload = 'auto';
      // load()는 currentTime을 0으로 되돌리지만, loadedmetadata가 다시 떠서 onMeta → kick으로
      // 스크롤 위치를 재계산해 그리므로 제자리를 찾아온다.
      video.load();
    };

    const queuePromote = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(promotePreload, { timeout: 2000 });
      } else {
        idleIsTimeout = true;
        idleId = window.setTimeout(promotePreload, 300);
      }
    };

    if (document.readyState === 'complete') queuePromote();
    else window.addEventListener('load', queuePromote, { once: true });

    const stopPromote = () => {
      window.removeEventListener('load', queuePromote);
      if (!idleId) return;
      if (idleIsTimeout) window.clearTimeout(idleId);
      else window.cancelIdleCallback?.(idleId);
      idleId = 0;
    };

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
      return () => {
        stopPromote();
        video.removeEventListener('loadedmetadata', toEnd);
        document.documentElement.classList.remove('hero-static');
      };
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
      stopPromote();
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
          .hero-veil { opacity: 1; }
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
            preload="metadata"
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

              {/* 제품 세 개는 순서가 아니라 나란한 선택지다 — 01/02/03 번호를 붙이지 않는다.
                  이름 칸에 고정 폭을 줘 설명이 한 줄로 서게 하고(전에는 이름 길이에 따라
                  들쭉날쭉했다), 행 폭을 본문과 같은 자로 묶어 화살표가 멀리 떠 있지 않게 한다. */}
              <div className="max-w-3xl">
                {ROWS.map((r, i) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    ref={(el) => {
                      if (el) rowsRef.current[i] = el;
                    }}
                    className={`hero-fade hero-row group flex items-center gap-4 border-t ${
                      i === ROWS.length - 1 ? 'border-b' : ''
                    } border-white/10`}
                  >
                    <span
                      className={`hero-row-name font-bold text-white shrink-0 sm:w-[13rem] ${r.hover} transition-colors duration-300`}
                    >
                      {r.name}
                    </span>
                    <span className="hidden sm:block flex-1 min-w-0 text-sm text-white/55 truncate">
                      {r.desc}
                    </span>
                    <ArrowUpRight
                      className={`w-5 h-5 md:w-6 md:h-6 ml-auto sm:ml-0 text-white/55 ${r.hover} group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0`}
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
            {/* 영문 대문자 마이크로 라벨(tracking .35em)은 어느 템플릿에나 붙어 있는 장식이다.
                이 사이트는 한국어로 말하므로 한국어로, 자간도 보통으로 둔다. */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-semibold text-white/60">스크롤</span>
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
