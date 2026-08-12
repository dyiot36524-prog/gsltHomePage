'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from '@/components/Icon';

/**
 * 히어로 — 스크롤에 따라 재생되는 스마트빌딩 필름.
 *
 * #hero-track이 스크롤 구간을 만들고 .hero-stage가 그 안에 sticky로 고정된다.
 * 스크롤 진행도(0~1) 하나를 잡아 영상 currentTime과 텍스트 리빌을 함께 몰아준다.
 *
 * 영상은 짧은 GOP(-g 12, 30fps라 0.4초마다 키프레임)로 인코딩돼 있다. 예전에는 전 프레임을
 * 키프레임(-g 1)으로 두었는데, 그러면 10초짜리가 2560에서 14.2MB(12Mbps)까지 부풀어
 * 회선이 느린 곳에서는 스크롤해도 영상이 따라오지 못했다. 짧은 GOP로 바꿔 8.0MB로 줄이면서
 * 오히려 화질은 올라갔다(마스터 대비 SSIM 0.9752 → 0.9756). 탐색 시 최대 11프레임을
 * 더 디코딩하지만 H.264에서는 밀리초 단위다.
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
  const kickerRef = useRef<HTMLSpanElement>(null);
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

    // ─── 영상 전체를 따로 받아, 스크럽을 네트워크에서 떼어낸다 ───
    // 스크럽은 매 프레임 currentTime을 바꾼다. 그때마다 브라우저는 진행 중이던 순차
    // 다운로드를 버리고 그 지점의 range를 새로 요청한다. 그래서 "진입하자마자 스크롤"하면
    // 버퍼가 0.35초에서 영원히 자라지 않고 탐색이 매번 네트워크로 나가 영상이 멈춘 것처럼
    // 보인다. 가만히 두면 1초 만에 9.93초가 차는 것과 정반대다 — 스크롤이 버퍼링을 스스로 막는다.
    // (배포본 실측: 대기 후 스크롤 = 버퍼 9.93s·탐색 15~26ms / 진입 직후 스크롤 = 버퍼 0.35s)
    //
    // 그래서 video 요소의 로딩에 맡기지 않고 fetch로 파일 전체를 따로 받는다. 이 다운로드는
    // 사용자가 아무리 스크럽해도 중단되지 않는다. 다 받으면 Blob URL로 갈아끼워 이후 모든
    // 탐색이 메모리에서 끝난다. 화질은 그대로 두고 랙만 없앤다.
    const controller = new AbortController();
    let blobUrl = '';
    let fetched = false;
    /** 파일 전체가 메모리에 올라왔는가. 그 전까지는 탐색이 네트워크로 나간다. */
    let memoryBacked = false;
    /** 받아는 뒀고, 스크럽이 멈추는 틈을 기다리는 중 */
    let pendingSwap = false;

    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const stingy =
      conn?.saveData === true || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '2g';

    const cacheWholeFile = () => {
      // 데이터 절약 모드·저속 회선에서는 통째로 받지 않는다. 마크업의 preload="metadata"가
      // 그대로 남아 duration은 잡히고, 스크럽은 구간별 range로 이어간다(느리지만 동작한다).
      if (fetched || stingy) return;
      fetched = true;
      // <source>의 media 조건을 브라우저가 이미 평가해 고른 주소다. 우리가 다시 고르지 않는다.
      const src = video.currentSrc;
      if (!src) return;

      // 우선순위를 낮추지 않는다. 이 영상이 곧 첫 화면의 내용이고, 늦게 받을수록
      // 스크럽이 네트워크에 매달리는 시간이 길어진다. 낮췄을 때 4G에서 blob이
      // 18초까지 밀려 초반 탐색이 2.7초씩 걸렸다.
      fetch(src, { signal: controller.signal })
        .then((r) => (r.ok ? r.blob() : null))
        .then((blob) => {
          if (!blob || disposed) return;
          blobUrl = URL.createObjectURL(blob);
          // 바로 갈아끼우지 않는다. src를 바꾸면 요소가 리셋돼 메타데이터를 다시 읽는 동안
          // frame 0으로 돌아가는데, 그 순간 사용자가 스크롤 중이면 한 프레임 깜빡인다
          // (실측: 80ms 샘플 하나 분량이 매번 잡혔다). 스크럽이 멈춘 틈에 조용히 바꾼다.
          pendingSwap = true;
          if (!raf) applySwap();
        })
        .catch(() => { /* 중단·실패는 무시 — 기존 스트리밍 경로가 그대로 남는다 */ });
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
      // 모션 최소화에서는 스크럽이 없으니 파일을 통째로 받을 이유도 없다.
      return () => {
        controller.abort();
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
        // 미세한 차이까지 대입하면 탐색이 밀리므로 임계값을 둔다.
        // 파일이 아직 메모리에 없는 동안에는 탐색 하나하나가 range 요청이라, 촘촘히 보내면
        // 정작 파일 전체를 받아오는 다운로드의 대역폭을 뺏어 느린 상태가 오래 간다.
        // 그동안은 성기게(0.25초 단위) 움직이고, 메모리에 올라온 뒤 프레임 단위로 붙는다.
        if (Math.abs(video.currentTime - t) > (memoryBacked ? 0.01 : 0.25)) {
          try {
            video.currentTime = t;
          } catch { /* 탐색 실패 무시 */ }
        }
      }

      if (veil) veil.style.opacity = seg(p, 0.3, 0.6).toFixed(3);
      if (cue) cue.style.opacity = (1 - seg(p, 0.02, 0.14)).toFixed(3);

      // 조건절 → 결론 두 줄 → 설명 순으로 조금씩 어긋나게 올라온다
      maskUp(kickerRef.current, seg(p, 0.32, 0.5));
      maskUp(line1Ref.current, seg(p, 0.38, 0.58));
      maskUp(line2Ref.current, seg(p, 0.44, 0.64));
      fade(descRef.current, seg(p, 0.52, 0.68), 22);
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

    /** 받아 둔 파일을 요소에 물린다. 리셋이 한 프레임 보이므로 정지 상태에서만 부른다. */
    const applySwap = () => {
      if (!pendingSwap || !blobUrl || disposed) return;
      pendingSwap = false;
      const at = video.currentTime;
      video.addEventListener(
        'loadedmetadata',
        () => {
          try {
            video.currentTime = at;
          } catch { /* 탐색 실패 무시 */ }
          memoryBacked = true;
          kick();
        },
        { once: true }
      );
      // src를 직접 주면 <source> 목록보다 우선한다. load()로 새 소스를 물린다.
      video.src = blobUrl;
      video.load();
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
      const halting = settled > 3;
      raf = halting ? 0 : requestAnimationFrame(frame);
      // 루프가 멈추는 순간 = 사용자가 스크롤을 놓은 순간. 여기서 갈아끼우면 티가 나지 않는다.
      if (halting) applySwap();
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
      // currentSrc는 메타데이터가 온 뒤에야 확정된다. 이 시점에 전체 받기를 시작한다 —
      // 페이지 load까지 기다리면 그 사이에 사용자가 이미 스크롤을 시작해 버린다.
      cacheWholeFile();
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
      controller.abort();
      // Blob URL을 놓아주지 않으면 영상 크기만큼(6~15MB) 메모리가 그대로 남는다.
      if (blobUrl) URL.revokeObjectURL(blobUrl);
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
            poster="/img/hero-v3-poster.jpg"
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/img/hero-v3-1280.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/img/hero-v3-1920.mp4" type="video/mp4" media="(max-width: 1439px)" />
            <source src="/img/hero-v3-2560.mp4" type="video/mp4" />
          </video>

          <div className="hero-grade" />
          <div className="hero-veil" ref={veilRef} />

          {/* 화면 정중앙에 h1 → 문단 → 목록을 쌓는 대신 아래쪽에 앉힌다. 위를 비워
              빌딩 컷이 숨 쉬고, 글은 어두워진 바닥에 놓인다 — 스크롤로 재생되는 필름의
              자막판에 가까운 구조다. */}
          {/* 모바일 하단 여백이 넉넉해야 마지막 행이 떠 있는 '맨 위로' 버튼(bottom-6, 48px)에
              가리지 않는다. 아래로 붙이는 구성이라 이 여백이 곧 안전 거리다. */}
          <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-14">
            <div className="max-w-6xl mx-auto w-full hero-shadow">
              <h1 className="hero-title font-black break-keep text-white">
                <span className="hero-line">
                  <span className="hero-line-inner hero-title-setup text-white/75" ref={kickerRef}>
                    맞춤형 공간 설계부터 디바이스 구축까지,
                  </span>
                </span>
                <span className="hero-line">
                  {/* 강조는 한 줄 전체가 아니라 이 네 글자에만 준다 */}
                  <span className="hero-line-inner" ref={line1Ref}>
                    당신에게 <span className="text-gslt-400">딱 맞춘</span>
                  </span>
                </span>
                <span className="hero-line">
                  <span className="hero-line-inner" ref={line2Ref}>공간 지능 솔루션.</span>
                </span>
              </h1>

              {/* 제품 이름 셋은 바로 아래 목록이 다시 부른다. 여기서는 회사가 무엇을 하는지만 말한다. */}
              <p
                className="hero-fade hero-desc max-w-xl text-white/70 leading-relaxed break-keep"
                ref={descRef}
              >
                지에스엘티는 오피스·주거·빌딩, 모든 공간을 배선 공사 없이
                스마트 공간으로 완성하는 IoT 구축 전문기업입니다.
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
