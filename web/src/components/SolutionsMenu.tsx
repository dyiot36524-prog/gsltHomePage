'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { SOLUTIONS } from '@/lib/site';
import { ChevronDown } from '@/components/Icon';

/**
 * 헤더의 솔루션 드롭다운. Header는 서버 컴포넌트로 두고 상태가 필요한 이 조각만 떼어냈다.
 *
 * 열림 신호가 둘(마우스 hover / 클릭·키보드)이라 서로 싸우기 쉽다. CSS `group-hover`를 남겨두면
 * 커서가 얹힌 상태에서는 클릭으로 닫을 수가 없으므로, hover도 JS 상태로 흡수해 open 하나로 굴린다.
 * hoverOpened는 "이번 열림이 hover로 시작됐는가"만 기억한다 — 클릭·키보드로 연 메뉴가
 * 커서가 벗어났다는 이유로 닫히면 안 되기 때문이다.
 */
export default function SolutionsMenu({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const hoverOpened = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      hoverOpened.current = false;
      setOpen(false);
      // 메뉴 안에 있던 포커스만 버튼으로 되돌린다. hover로 열린 경우 포커스는 딴 곳에 있으므로
      // 가져오면 오히려 사용자를 헤더로 끌고 오는 셈이 된다.
      if (rootRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      hoverOpened.current = false;
      setOpen(false);
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

  return (
    <div
      ref={rootRef}
      className="relative"
      // 터치는 pointerenter도 쏘기 때문에 마우스만 hover로 취급한다. 터치·펜은 클릭 경로로 보낸다.
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        hoverOpened.current = true;
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse' || !hoverOpened.current) return;
        hoverOpened.current = false;
        setOpen(false);
      }}
      // React의 onBlur는 focusout이라 버블한다. 포커스가 이 묶음 밖으로 나가면 닫는다.
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        hoverOpened.current = false;
        setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => {
          hoverOpened.current = false;
          setOpen((v) => !v);
        }}
        className={`flex items-center gap-1 transition-colors ${focusRing} ${overlay ? 'hover:text-white' : 'hover:text-gslt-600'}`}
      >
        솔루션
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {/* 닫힌 동안 안의 링크가 탭 순서에 잡히면 안 된다. visibility:hidden(invisible)만으로도
          포커스는 빠지지만 transition-all이 visibility를 200ms 끌고 가므로, 그 사이를 inert로 막는다. */}
      <div
        id={panelId}
        inert={!open}
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200 ${
          open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'
        }`}
      >
        <div className="w-72 bg-white rounded-2xl shadow-xl border border-slate-200/70 p-2">
          {SOLUTIONS.map((s) => (
            <Link key={s.href} href={s.href}
              className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group/item focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-600">
              <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
              <span className="block">
                <span className="font-bold text-slate-900 group-hover/item:text-gslt-600 transition-colors">
                  {s.name} <span className="text-slate-500 font-medium text-xs">{s.en}</span>
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">{s.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
