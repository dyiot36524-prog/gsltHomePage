'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowUpRight } from '@/components/Icon';
import { localePath, type Locale } from '@/i18n/config';
import type { CommonMessages, solutionsFor } from '@/i18n/messages/common';

/**
 * 헤더의 솔루션 패널. Header는 서버 컴포넌트로 두고 상태가 필요한 이 조각만 떼어냈다.
 *
 * **호버로 열지 않는다.** 마우스가 스치기만 해도 열리는 메뉴는 커서가 지나갈 때마다
 * 화면이 덜컹거리고, 열림 신호가 둘(hover/클릭)이면 커서가 얹힌 상태에서 클릭으로 닫을 수
 * 없어 서로 싸운다. 이전 구현은 그 싸움을 hoverOpened 플래그로 중재하고 있었는데,
 * **여는 방법을 하나로 줄이면 중재할 것이 없어진다.** 클릭과 키보드만 남긴다.
 *
 * 내용도 목록이 아니라 카드다. 시옷이 이 회사의 대표 솔루션이므로 맨 위에 큰 카드로
 * 혼자 서고, 나머지 둘은 아래 한 줄에 붙는다 — 셋을 같은 크기로 늘어놓으면 무엇이
 * 중심인지 화면이 말하지 못한다.
 *
 * 글자는 서버 헤더가 지금 언어의 사전에서 골라 넘긴다(브라우저 번들에 네 언어를 다 싣지 않게).
 */

type Props = {
  overlay?: boolean;
  locale: Locale;
  /** solutionsFor(locale) — 순서가 곧 비중이라 첫 항목(시옷)이 큰 카드다. */
  solutions: ReturnType<typeof solutionsFor>;
  t: CommonMessages['solutions'] & { label: string; newWindow: string };
  sceneNames: CommonMessages['scenes'];
};

export default function SolutionsMenu({ overlay = false, locale, solutions, t, sceneNames }: Props) {
  const [FEATURED, ...REST] = solutions;
  const [open, setOpen] = useState(false);
  // 대표 카드의 대시보드 화면은 메뉴를 열 생각이 보일 때(버튼에 커서·포커스) 처음 불러온다.
  // 헤더는 모든 페이지에 있으므로, 숨은 패널 안 이미지를 바로 받으면 메뉴를 안 여는 방문자까지 받는다.
  const [armed, setArmed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // 메뉴 안에 있던 포커스만 버튼으로 되돌린다.
      close(Boolean(rootRef.current?.contains(document.activeElement)));
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const focusRing = overlay
    ? 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
    : 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gslt-600';

  const cardFocus =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-600';

  return (
    // relative를 두지 않는다. 패널(absolute)이 버튼이 아니라 헤더 가운데 메뉴 묶음을 기준으로 서게 하려는 것이다 —
    // 버튼 기준으로 가운데를 맞추면 메뉴가 나오는 가장 좁은 폭(1024px)에서 46rem 판이 왼쪽 화면 밖으로 20px 밀려났다.
    // 묶음은 화면 가운데에 있으므로 판도 화면 가운데에 선다.
    <div
      ref={rootRef}
      onPointerEnter={() => setArmed(true)}
      onFocus={() => setArmed(true)}
      // 포커스가 이 묶음 밖으로 나가면 닫는다. React의 onBlur는 focusout이라 버블한다.
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        close();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 transition-colors ${focusRing} ${overlay ? 'hover:text-white' : 'hover:text-gslt-700'}`}
      >
        {t.label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* 닫힌 동안 안의 링크가 탭 순서에 잡히면 안 된다. visibility:hidden만으로도 포커스는
          빠지지만 transition이 visibility를 200ms 끌고 가므로 그 사이를 inert로 막는다. */}
      <div
        id={panelId}
        inert={!open}
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200 ${
          open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'
        }`}
      >
        <div className="w-[min(46rem,calc(100vw-2rem))] rounded-2xl border border-slate-200/70 bg-white p-3 shadow-xl">
          {/* 대표 솔루션 = 시옷 홈페이지(siot-home.gslt.kr)로 넘어가는 문. 로고를 크게 세우고, 넘어가서 보게 될
              대시보드 화면을 오른쪽에 걸어 '다른 사이트로 간다'를 그림으로 먼저 말한다. 주황은 GSLT의 siot-500이
              아니라 그 사이트의 주황(siothome-500, globals.css)이다. */}
          <a
            href={'site' in FEATURED ? FEATURED.site : localePath(locale, FEATURED.href)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => close()}
            className={`group relative block min-h-[16.5rem] overflow-hidden rounded-xl bg-[#0a0a0f] p-7 transition-colors duration-300 hover:bg-[#101017] ${cardFocus}`}
          >
            {/* 왼쪽 끝은 마스크로 카드 바탕에 녹인다. 오른쪽·아래는 카드 밖으로 잘려 나가 화면이 더 크다는 느낌을 준다. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 top-7 w-[25rem] overflow-hidden rounded-tl-lg shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)] ring-1 ring-white/10 transition-transform duration-500 ease-out [mask-image:linear-gradient(to_right,transparent,black_28%)] group-hover:-translate-x-1.5 group-hover:-translate-y-1 motion-reduce:transition-none"
            >
              {armed || open ? (
                <Image
                  src="/img/siot-home-dashboard.webp"
                  alt=""
                  width={1440}
                  height={1000}
                  sizes="400px"
                  className="block h-auto w-full"
                />
              ) : (
                <span className="block aspect-[1440/1000] w-full bg-white/[0.03]" />
              )}
            </span>

            <span className="relative block max-w-[21rem]">
              <span className="flex items-center gap-3">
                <Image
                  src="/img/siot-home-logo-white.png"
                  alt={locale === 'ko' ? '시옷(SIOT)' : 'SIOT'}
                  width={377}
                  height={96}
                  sizes="160px"
                  className="h-10 w-auto"
                />
                <span className="rounded-full border border-siothome-500/45 px-2.5 py-1 text-[11px] font-bold text-siothome-500">
                  {t.featured}
                </span>
              </span>
              <span className="mt-5 block text-[15px] font-bold leading-relaxed text-white/80 break-keep">
                {FEATURED.lead}
              </span>
              <span className="mt-4 flex flex-wrap gap-1.5">
                {(FEATURED.pillars ?? []).map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-bold text-white/70"
                  >
                    {p}
                  </span>
                ))}
              </span>
              <span className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-siothome-500 px-4 py-2 text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:bg-siothome-400">
                  {t.siotSite}
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="text-xs font-medium text-white/50">siot-home.gslt.kr</span>
                <span className="sr-only">{t.newWindow}</span>
              </span>
            </span>
          </a>

          {/* 시옷 활용 장면. 대표 카드 자체가 링크라 그 안에 링크를 넣을 수 없어 바로 아래 한 줄로 둔다. */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1">
            <span className="mr-1 text-xs font-bold text-slate-500">{t.scenes}</span>
            {Object.entries(sceneNames).map(([slug, name]) => (
              <Link
                key={slug}
                href={localePath(locale, `/siot/${slug}`)}
                onClick={() => close()}
                className={`rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-siot-500/60 hover:text-siot-700 ${cardFocus}`}
              >
                {name}
              </Link>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {REST.map((s) => (
              <Link
                key={s.href}
                href={localePath(locale, s.href)}
                onClick={() => close()}
                className={`group block rounded-xl border border-slate-200/70 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 ${cardFocus}`}
              >
                <span className="mb-1.5 flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.dot }} />
                  <span className="font-bold text-slate-900">
                    {s.name}
                    {/* 외국어에서는 이름이 곧 영문 이름이라 한 번만 쓴다. */}
                    {locale === 'ko' ? <span className="text-xs font-medium text-slate-500"> {s.en}</span> : null}
                  </span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="block text-[13px] font-bold text-slate-700 break-keep">{s.desc}</span>
                <span className="mt-1 block text-xs text-slate-500 break-keep leading-relaxed">{s.lead}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
