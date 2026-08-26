'use client';

import { useEffect, useRef } from 'react';
import Chat from '@/components/Chat';

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
  const chatRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const gateBarRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLCanvasElement>(null);
  /** 대화 중에는 스크롤이 흔들려도 상담판을 붙잡는다. ref로 두는 이유는 paint()가
      매 프레임 도는 rAF 루프 안에 있어 리렌더를 유발하면 안 되기 때문이다. */
  const engagedRef = useRef(false);
  /** 첫 메시지가 나가면 무대에 .hero-chatting을 건다. 헤드라인·설명이 스르르 물러나고
      상담판이 넓어지는 연출은 전부 CSS 전환이 진다 — JS는 클래스 하나만 바꾼다. */
  const chattingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!track || !stage || !video) return;

    const veil = veilRef.current;
    const cue = cueRef.current;

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

    /* ── 첫 진입 로딩 게이트 ──
       영상이 8MB(2560)라 회선이 느리면 진입 직후 스크롤해도 한참 움직이지 않는다.
       그 사이를 빈 화면으로 두지 않고 받는 만큼을 막대로 보여 준다.

       다만 **다 받을 때까지 막아 세우지는 않는다.** LTE에서 6초, 느린 4G에서는 40초가
       넘게 걸리는데 그동안 아무것도 못 하게 하면 로딩바가 문제를 옮길 뿐 없애지 못한다.
       그래서 상한(GATE_MAX_MS)을 두고, 넘으면 그냥 열어 준다 — 그때부터는 예전처럼
       구간 스트리밍으로 스크럽이 돌아간다(느리지만 동작한다).

       한 세션에 한 번만 보인다. 두 번째 방문은 영상이 캐시에 있어 즉시 끝난다. */
    const GATE_MAX_MS = 4500;
    const gate = gateRef.current;
    const gateBar = gateBarRef.current;
    const seen = (() => {
      try {
        return sessionStorage.getItem('hero-gate') === '1';
      } catch {
        return false;
      }
    })();
    let gateOpen = seen || stingy || !gate;

    const openGate = () => {
      if (gateOpen) return;
      gateOpen = true;
      try {
        sessionStorage.setItem('hero-gate', '1');
      } catch { /* 사파리 프라이빗 등 — 못 써도 동작에 지장 없다 */ }
      if (orbRaf) cancelAnimationFrame(orbRaf);
      if (!gate) return;
      gate.style.opacity = '0';
      gate.style.pointerEvents = 'none';
      window.setTimeout(() => gate.remove(), 500);
    };

    const onProgress = (r: number) => {
      if (gateBar) gateBar.style.transform = `scaleX(${Math.min(1, r).toFixed(3)})`;
    };

    /* ── 게이트의 입자 스퀘어클 ──
       점을 경위선 격자로 뿌리면 자오선이 줄무늬로 드러나 '입자 구름'이 아니라
       '와이어프레임 지구본'으로 보인다(처음에 그렇게 만들었다가 고쳤다).
       황금각 나선으로 구면에 고르게 뿌린 뒤, 초타원 노름으로 나눠 둥근 사각면 위로
       밀어 올린다. 지수를 시간에 따라 흔들면 구와 각진 사각 사이를 오간다.

       DOM 요소 수백 개 대신 캔버스 하나를 쓴다. 점이 2,200개라 요소로 만들면
       레이아웃·합성 비용이 그대로 초기 로딩을 갉아먹는데, 지금 이 화면은
       "느려서 보여 주는 화면"이라 그 비용을 낼 이유가 없다. */
    let orbRaf = 0;
    const startOrb = () => {
      const cv = orbRef.current;
      if (!cv) return;
      const ctx = cv.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const size = 260;
      cv.width = size * dpr;
      cv.height = size * dpr;
      ctx.scale(dpr, dpr);

      // 황금각 나선 — 이웃 점이 같은 선 위에 놓이지 않아 격자가 생기지 않는다
      const N = 2200;
      const GOLDEN = Math.PI * (3 - Math.sqrt(5));
      const base: { x: number; y: number; z: number }[] = [];
      for (let i = 0; i < N; i++) {
        const y = 1 - (2 * i + 1) / N;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const th = i * GOLDEN;
        base.push({ x: r * Math.cos(th), y, z: r * Math.sin(th) });
      }

      const R = size * 0.33;
      const cx = size / 2;
      const cy = size / 2;
      let t = 0;
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const draw = () => {
        // m이 2면 구, 커질수록 각진 사각이 된다
        const m = 3.4 + Math.sin(t * 0.7) * 1.5;
        const ry = t * 0.62;
        const rx = 0.38 + Math.sin(t * 0.45) * 0.14;
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        const cosX = Math.cos(rx), sinX = Math.sin(rx);

        ctx.clearRect(0, 0, size, size);
        ctx.globalCompositeOperation = 'lighter';

        for (const p0 of base) {
          // 초타원 노름으로 나눠 둥근 사각면 위로 민다
          const norm = Math.pow(
            Math.pow(Math.abs(p0.x), m) + Math.pow(Math.abs(p0.y), m) + Math.pow(Math.abs(p0.z), m),
            1 / m,
          );
          const k = norm > 0 ? 1 / norm : 0;
          const x0 = p0.x * k, y0 = p0.y * k, z0 = p0.z * k;

          const x1 = x0 * cosY + z0 * sinY;
          const z1 = -x0 * sinY + z0 * cosY;
          const y2 = y0 * cosX - z1 * sinX;
          const z2 = y0 * sinX + z1 * cosX;

          const persp = 1 / (2.05 - z2 * 0.5);
          const sx = cx + x1 * R * persp * 2.05;
          const sy = cy + y2 * R * persp * 2.05;

          const depth = (z2 + 1) / 2; // 0 뒤 · 1 앞
          // 실루엣 강조 — 중심에서 멀수록(=시선과 면이 나란할수록) 점이 몰려 보인다
          const dx = (sx - cx) / R, dy = (sy - cy) / R;
          const rim = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 1.75);
          const alpha = (0.11 + depth * 0.34) * (0.24 + Math.pow(rim, 1.5) * 1.7);
          if (alpha < 0.015) continue;

          // 앞쪽 청록(gslt-400) → 뒤쪽 밝은 파랑
          ctx.fillStyle =
            `rgba(${Math.round(70 + depth * 30)}, ${Math.round(178 + depth * 55)}, ` +
            `${Math.round(248 - depth * 30)}, ${Math.min(1, alpha).toFixed(3)})`;
          ctx.fillRect(sx, sy, 1.25 + depth * 0.6, 1.25 + depth * 0.6);
        }

        ctx.globalCompositeOperation = 'source-over';
      };

      if (still) {
        t = 1.1;
        draw();
        return;
      }
      const frame = () => {
        t += 0.0055;
        draw();
        orbRaf = requestAnimationFrame(frame);
      };
      orbRaf = requestAnimationFrame(frame);
    };
    if (!gateOpen) startOrb();

    if (gateOpen && gate) gate.remove();
    else window.setTimeout(openGate, GATE_MAX_MS);

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
      // .blob()을 바로 부르지 않고 스트림을 직접 읽는다. 받은 바이트를 세어야
      // 로딩 막대에 진짜 진행률을 그릴 수 있다. 가짜로 채워 넣는 막대는 느린 회선에서
      // 100%에 도달한 뒤에도 한참 기다리게 만들어, 없느니만 못하다.
      (async () => {
        try {
          const res = await fetch(src, { signal: controller.signal });
          if (!res.ok || !res.body) return;
          const total = Number(res.headers.get('content-length')) || 0;
          const reader = res.body.getReader();
          // BlobPart로 넘기려면 ArrayBuffer 기반임이 확정돼야 한다.
          // Uint8Array<ArrayBufferLike>는 SharedArrayBuffer일 수도 있어 타입이 좁혀지지 않는다.
          const chunks: BlobPart[] = [];
          let got = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!value) continue;
            chunks.push(value.slice().buffer as ArrayBuffer);
            got += value.byteLength;
            if (total) onProgress(got / total);
          }
          if (disposed) return;
          onProgress(1);
          blobUrl = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
          // 바로 갈아끼우지 않는다. src를 바꾸면 요소가 리셋돼 메타데이터를 다시 읽는 동안
          // frame 0으로 돌아가는데, 그 순간 사용자가 스크롤 중이면 한 프레임 깜빡인다
          // (실측: 80ms 샘플 하나 분량이 매번 잡혔다). 스크럽이 멈춘 틈에 조용히 바꾼다.
          pendingSwap = true;
          if (!raf) applySwap();
        } catch {
          /* 중단·실패는 무시 — 기존 스트리밍 경로가 그대로 남는다 */
        } finally {
          openGate();
        }
      })();
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

    const SCRUB_END = 0.6; // 필름 구간 안에서 영상이 끝까지 재생되는 지점

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

      // 상담판은 헤드라인·설명에 이어 같은 리듬으로 올라온다. 예전에는 솔루션 링크 세 줄이
      // 이 자리를 썼는데, 그 목록을 빼고 상담을 바로 놓았다 — 히어로가 무엇을 하는 회사인지
      // 말한 직후의 질문은 늘 "우리 공간에도 되나"이고, 그 질문을 받는 자리가 여기다.
      //
      // 대화 중에는 스크롤이 흔들려도 붙잡는다. 필름 앞쪽으로 충분히 되돌아가면 놓아준다.
      if (engagedRef.current && p < 0.5) engagedRef.current = false;
      const reveal = engagedRef.current ? 1 : easeOut(seg(p, 0.56, 0.78));
      const chat = chatRef.current;
      if (chat) {
        chat.style.setProperty('--o', reveal.toFixed(3));
        chat.style.setProperty('--y', `${((1 - reveal) * 18).toFixed(1)}px`);
        chat.style.pointerEvents = reveal > 0.9 ? '' : 'none';
        chat.setAttribute('aria-hidden', reveal > 0.9 ? 'false' : 'true');
      }
      // 상담판이 드러나는 만큼 화면을 눌러 준다. 필름용 veil은 아래에서 위로 옅어지는
      // 그라디언트라 화면 중단이 밝게 남는데, 상담판은 그 높이까지 글자를 올린다.
      if (dimRef.current) dimRef.current.style.opacity = (reveal * 0.85).toFixed(3);
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
          /* 겹쳐 두는 건 스크롤 인계가 있을 때만 뜻이 있다. JS가 없으면 세로로 쌓는다. */
          /* JS가 없으면 리빌이 돌지 않는다. 상담판을 처음부터 보이게 둔다. */
          .hero-fade { opacity: 1 !important; transform: none !important; }
        `}</style>
      </noscript>

      {/* 첫 진입 로딩 게이트. JS가 없거나 이미 본 세션이면 마운트 직후 제거된다.
          영상 위가 아니라 무대 밖 최상단에 두어, 히어로 내부 레이어 순서에 영향을 주지 않는다. */}
      <div
        ref={gateRef}
        className="hero-gate"
        role="status"
        aria-live="polite"
        aria-label="첫 화면을 준비하고 있습니다"
      >
        <div className="flex flex-col items-center px-8">
          {/* 입자 스퀘어클. 회전하면서 형태가 둥근 사각과 구 사이를 오간다.
              가장자리에 입자가 몰려 테두리가 빛나고 속은 비어 어둡다. */}
          <div className="hero-gate-orb-wrap">
            <canvas ref={orbRef} aria-hidden="true" className="hero-gate-orb" />
          </div>
          <p className="hero-gate-label mt-1 text-sm text-white/70 break-keep text-center">
            공간 지능 솔루션을 불러오는 중입니다
          </p>
          <span className="hero-gate-rail mt-6">
            <span className="hero-gate-bar" ref={gateBarRef} />
          </span>
        </div>
      </div>

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
          <div className="hero-dim" ref={dimRef} />

          {/* 화면 정중앙에 h1 → 문단 → 목록을 쌓는 대신 아래쪽에 앉힌다. 위를 비워
              빌딩 컷이 숨 쉬고, 글은 어두워진 바닥에 놓인다 — 스크롤로 재생되는 필름의
              자막판에 가까운 구조다. */}
          {/* 모바일 하단 여백이 넉넉해야 마지막 행이 떠 있는 '맨 위로' 버튼(bottom-6, 48px)에
              가리지 않는다. 아래로 붙이는 구성이라 이 여백이 곧 안전 거리다. */}
          <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-14">
            {/* 헤드라인과 상담판은 같은 자리를 나눠 쓴다. 스크롤이 필름을 다 지나면
                헤드라인이 위로 물러나고 그 자리에 상담판이 들어온다 — 영상은 바닥에
                그대로 남아 톤이 끊기지 않는다. 둘을 grid로 겹쳐 두면 전환 중에
                무대 높이가 흔들리지 않는다. */}
            <div className="max-w-6xl mx-auto w-full hero-shadow text-center">
              <h1 className="hero-title font-black break-keep text-white">
                <span className="hero-line hero-line-setup">
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

              <p
                className="hero-fade hero-desc max-w-xl mx-auto text-white/70 leading-relaxed break-keep"
                ref={descRef}
              >
                지에스엘티는 오피스·주거·빌딩, 모든 공간을 배선 공사 없이
                스마트 공간으로 완성하는 IoT 구축 전문기업입니다.
              </p>

              {/* 예전에는 여기에 솔루션 링크 세 줄이 있었다. 목록을 빼고 상담을 바로 놓는다.
                  헤드라인이 무엇을 하는 회사인지 말한 직후의 질문은 늘 "우리 공간에도 되나"이고,
                  그 질문을 받는 자리가 여기다. 솔루션으로 가는 길은 헤더 드롭다운과 푸터에 있다. */}
              <div className="hero-fade hero-chat mt-8 md:mt-10" ref={chatRef} aria-hidden="true">
                <Chat
                  onEngage={() => {
                    engagedRef.current = true;
                  }}
                  onStart={() => {
                    if (chattingRef.current) return;
                    chattingRef.current = true;
                    stageRef.current?.classList.add('hero-chatting');
                  }}
                  onClose={() => {
                    // 헤드라인이 되돌아온다. 같은 전환이 반대로 돌아 자연스럽게 이어진다.
                    chattingRef.current = false;
                    engagedRef.current = false;
                    stageRef.current?.classList.remove('hero-chatting');
                  }}
                />
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
