'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HTML_LANG, LOCALES, LOCALE_LABEL, localePath, splitLocale } from '@/i18n/config';
import { ChevronDown, Globe } from '@/components/Icon';

/**
 * 헤더의 언어 고르기 — 지금 보는 페이지의 다른 언어 판으로 간다('/about' ↔ '/en/about').
 *
 * 링크는 <a>다. 한국어와 외국어는 루트 레이아웃이 달라(<html lang>부터 다르다) 어차피 문서를 새로 받는다.
 * 여는 방법은 솔루션 메뉴와 같이 클릭·키보드 하나다(SolutionsMenu 설명).
 */
export default function LanguageMenu({ overlay = false, label }: { overlay?: boolean; label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const { locale, path } = splitLocale(usePathname() ?? '/');

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      if (rootRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${LOCALE_LABEL[locale]}`}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-full px-2 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
          overlay
            ? 'text-white/80 hover:text-white focus-visible:outline-white'
            : 'text-slate-600 hover:text-gslt-700 focus-visible:outline-gslt-600'
        }`}
      >
        {/* 휴대폰(640px 미만)에서는 지구본만 둔다. 로고와 문의 단추 사이가 320px 폭에서 171px뿐이라
            'EN ▾'까지 두면 영어 'Contact us'·일본어 'お問い合わせ'와 함께 헤더가 화면 밖으로 15~30px 넘쳤다.
            지금 언어는 버튼 이름(aria-label)이 말한다. */}
        <Globe className="h-[18px] w-[18px] shrink-0" />
        <span className="hidden sm:inline uppercase">{locale}</span>
        <ChevronDown className={`hidden sm:block h-3 w-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <ul
        id={listId}
        inert={!open}
        className={`absolute right-0 top-full mt-2 min-w-[9.5rem] rounded-xl border border-slate-200/70 bg-white p-1.5 shadow-xl transition-all duration-200 ${
          open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-1'
        }`}
      >
        {LOCALES.map((l) => (
          <li key={l}>
            <a
              href={localePath(l, path)}
              hrefLang={HTML_LANG[l]}
              lang={HTML_LANG[l]}
              aria-current={l === locale ? 'true' : undefined}
              className={`block rounded-lg px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-600 ${
                l === locale ? 'bg-slate-100 text-gslt-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {LOCALE_LABEL[l]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
