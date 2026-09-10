'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { SOLUTIONS } from '@/lib/site';
import { ChevronDown, ArrowUpRight } from '@/components/Icon';

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
 */

const [FEATURED, ...REST] = SOLUTIONS;

export default function SolutionsMenu({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
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
    <div
      ref={rootRef}
      className="relative"
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
        솔루션
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
          {/* 대표 솔루션. 어두운 바닥과 주황 강조로 나머지 둘과 무게를 갈라 둔다. */}
          <Link
            href={FEATURED.href}
            onClick={() => close()}
            className={`group relative block overflow-hidden rounded-xl bg-[#0a0a0f] p-6 transition-colors hover:bg-[#12121a] ${cardFocus}`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-siot-500 opacity-[0.16] blur-[70px] transition-opacity duration-500 group-hover:opacity-[0.26]"
            />
            <span className="relative block">
              <span className="mb-2 flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: FEATURED.dot }} />
                <span className="text-lg font-black text-white">
                  {FEATURED.name} <span className="text-sm font-bold text-siot-400">{FEATURED.en}</span>
                </span>
                <span className="ml-auto rounded-full border border-siot-500/40 px-2.5 py-1 text-[11px] font-bold text-siot-400">
                  대표 솔루션
                </span>
              </span>
              <span className="block text-sm font-bold text-white/85 break-keep">{FEATURED.desc}</span>
              <span className="mt-1.5 block text-sm text-white/55 break-keep leading-relaxed">
                {FEATURED.lead}
              </span>
              <span className="mt-4 flex flex-wrap gap-1.5">
                {FEATURED.pillars.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-bold text-white/70"
                  >
                    {p}
                  </span>
                ))}
              </span>
            </span>
          </Link>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {REST.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => close()}
                className={`group block rounded-xl border border-slate-200/70 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 ${cardFocus}`}
              >
                <span className="mb-1.5 flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.dot }} />
                  <span className="font-bold text-slate-900">
                    {s.name} <span className="text-xs font-medium text-slate-500">{s.en}</span>
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
