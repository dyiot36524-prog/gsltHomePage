'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { AboutVideo } from '@/lib/about-videos';
import { ArrowUpRight, Play } from '@/components/Icon';

/**
 * 회사소개 영상 — 큰 플레이어 하나와 옆 목록.
 *
 * **누르기 전에는 표지 그림만 그린다.** 유튜브 iframe은 페이지를 여는 순간 쿠키 6개를
 * 심고(실측) 수백 KB의 스크립트를 받는다. 이 사이트는 쿠키가 없어 동의 배너를 두지 않는
 * 방침이라, 방문자가 재생을 누른 뒤에야 youtube-nocookie 플레이어를 붙인다.
 * 파일 영상도 같다 — 누르기 전에는 영상 데이터를 한 바이트도 받지 않는다.
 *
 * 목록에서 고르면 큰 플레이어가 그 영상으로 바뀌고 바로 재생된다. 한 번 누른 것이
 * 재생 의사다. 포커스는 목록에 남기고, 바뀐 영상은 화면 밖 알림으로 읽어 준다.
 */

function nocookieSrc(v: AboutVideo): string {
  const q = new URLSearchParams({ autoplay: '1', playsinline: '1', rel: '0' });
  if (v.start) q.set('start', String(v.start));
  return `https://www.youtube-nocookie.com/embed/${v.youtubeId}?${q}`;
}

function clock(sec: number): string {
  if (!sec) return '';
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * 세로 영상은 16:9 판 가운데에 9:16으로 앉힌다. 가로 영상은 판을 채운다.
 * 크기는 여기서만 정한다 — 세로 쪽에 w-full이 덧붙으면 aspect가 무시돼 판 전체로 퍼진다.
 */
function frameClass(v: AboutVideo): string {
  return v.vertical
    ? 'absolute inset-y-0 left-1/2 -translate-x-1/2 h-full aspect-[9/16]'
    : 'absolute inset-0 w-full h-full';
}

function Stage({ video, active, onPlay, focusOnMount }: {
  video: AboutVideo;
  active: boolean;
  onPlay: () => void;
  focusOnMount: boolean;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!active) return;
    // 표지를 눌러 켰으면 포커스를 플레이어로 옮긴다 — 누른 단추가 사라져 포커스가 문서
    // 맨 앞으로 튀면 키보드 사용자는 자리를 잃는다. 목록에서 고른 경우는 목록에 남긴다.
    if (focusOnMount) (frameRef.current ?? videoRef.current)?.focus();
    // 파일 영상은 autoPlay 속성만으로는 브라우저가 무시할 때가 있다. 누른 직후라 허용된다.
    videoRef.current?.play().catch(() => {});
  }, [active, focusOnMount, video.id]);

  if (active && video.kind === 'youtube') {
    return (
      <iframe
        key={video.id}
        ref={frameRef}
        src={nocookieSrc(video)}
        title={`${video.title} (YouTube 동영상)`}
        className={`${frameClass(video)} border-0`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen; web-share"
        allowFullScreen
        // no-referrer로 두면 유튜브가 재생을 거부한다(오류 153). 출처(origin)만 보낸다.
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  if (active && video.kind === 'file') {
    return (
      <video
        key={video.id}
        ref={videoRef}
        className={`${frameClass(video)} bg-black`}
        src={video.src}
        poster={video.poster || undefined}
        controls
        playsInline
        autoPlay
        preload="auto"
        aria-label={video.title}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`${video.title} 영상 재생`}
      className="group absolute inset-0 w-full h-full cursor-pointer focus-visible:outline-3 focus-visible:-outline-offset-[6px] focus-visible:outline-white"
    >
      {video.poster && video.vertical && (
        // 세로 영상은 양옆이 비므로 같은 그림을 흐리게 깔아 판을 채운다.
        <Image src={video.poster} alt="" fill sizes="(max-width: 1023px) 100vw, 800px"
          className="object-cover blur-2xl scale-110 opacity-40" />
      )}
      {video.poster && (
        <span className={frameClass(video)}>
          <Image src={video.poster} alt="" fill sizes="(max-width: 1023px) 100vw, 800px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        </span>
      )}
      <span className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 text-slate-900 shadow-[0_12px_40px_-8px_rgb(0_0_0/0.6)] group-focus-visible:ring-4 group-focus-visible:ring-gslt-400 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <Play className="w-7 h-7 md:w-8 md:h-8 translate-x-0.5" />
      </span>
    </button>
  );
}

export default function VideoShowcase({ videos }: { videos: AboutVideo[] }) {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [fromList, setFromList] = useState(false);
  const [announce, setAnnounce] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);
  const current = videos[index] ?? videos[0];
  const multi = videos.length > 1;

  function playCurrent() {
    setFromList(false);
    setActive(true);
  }

  function choose(i: number) {
    setIndex(i);
    setFromList(true);
    setActive(true);
    setAnnounce(`${videos[i].title} 재생`);
    // 좁은 화면에서는 목록이 플레이어 아래에 있다. 누른 순간 소리가 나는데 플레이어는
    // 화면 밖일 수 있으므로 판을 끌어올린다. 넓은 화면은 둘이 나란히 있어 필요 없다.
    if (!window.matchMedia('(min-width: 1024px)').matches) {
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      stageRef.current?.scrollIntoView({ block: 'start', behavior: still ? 'auto' : 'smooth' });
    }
  }

  const meta = [current.categoryLabel, current.dateLabel, current.kind === 'file' ? clock(current.duration) : '']
    .filter(Boolean);

  return (
    <div className={multi ? 'grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start' : ''}>
      <div>
        {/* 유튜브 플레이어는 200×200 이상이어야 한다. 휴대폰(375px)에서 여백 안 16:9 판은 높이가
            190px대로 모자라, 가로 영상은 판을 화면 끝까지 넓힌다. 세로 영상은 판 자체를 9:16으로
            세운다 — 16:9 판 안에 9:16을 넣으면 폭이 100px 남짓이 된다. sm부터는 원래 판. */}
        <div
          ref={stageRef}
          className={`relative overflow-hidden bg-[#0a0a0f] scroll-mt-28 sm:mx-0 sm:rounded-3xl sm:aspect-video sm:max-h-none shadow-[0_24px_60px_-28px_rgb(15_23_42/0.55)] ${
            current.vertical ? 'aspect-[9/16] max-h-[80svh] mx-auto rounded-3xl' : 'aspect-video -mx-4 rounded-none'
          }`}
        >
          <Stage video={current} active={active} onPlay={playCurrent} focusOnMount={!fromList} />
        </div>

        <div className="mt-6">
          <h3 className="text-xl md:text-2xl font-black break-keep text-slate-900">{current.title}</h3>
          {current.description && (
            <p className="mt-2 text-slate-600 break-keep leading-relaxed max-w-[62ch]">{current.description}</p>
          )}
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 tabular-nums">
            {meta.map((m) => <span key={m}>{m}</span>)}
            {current.channel && <span>출처 {current.channel}</span>}
            {current.watchUrl && (
              <a href={current.watchUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-bold text-slate-700 hover:text-gslt-700 transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-600">
                YouTube에서 보기
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span className="sr-only">(새 창)</span>
              </a>
            )}
          </p>
        </div>
      </div>

      {multi && (
        <ul className="space-y-3 lg:max-h-[36rem] lg:overflow-y-auto lg:p-2 lg:-m-2" aria-label="영상 목록">
          {videos.map((v, i) => {
            const on = i === index;
            const sub = [v.categoryLabel, v.dateLabel].filter(Boolean).join(' · ');
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-current={on ? 'true' : undefined}
                  className={`group w-full flex items-center gap-4 p-3 rounded-2xl border bg-white text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-600 ${
                    on
                      ? 'border-gslt-500 shadow-md'
                      : 'border-slate-200/70 hover:shadow-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0'
                  }`}
                >
                  <span className="relative w-32 shrink-0 aspect-video rounded-lg overflow-hidden bg-[#0a0a0f]">
                    {v.poster ? (
                      <Image src={v.poster} alt="" fill sizes="128px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-white/60">
                        <Play className="w-5 h-5" />
                      </span>
                    )}
                    {v.kind === 'file' && v.duration > 0 && (
                      <span className="absolute right-1.5 bottom-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[11px] font-bold text-white tabular-nums">
                        {clock(v.duration)}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-bold leading-snug break-keep line-clamp-2 ${on ? 'text-gslt-700' : 'text-slate-900'}`}>
                      {v.title}
                    </span>
                    {sub && <span className="mt-1 block text-xs text-slate-500 tabular-nums">{sub}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}
