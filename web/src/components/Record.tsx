import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, Download } from '@/components/Icon';

/**
 * 기록부(as-built record) 행.
 *
 * 카드가 아니라 괘선으로 나뉜 행이다. 왼쪽에 일자가 등번호처럼 서고, 구분 태그가 붙고,
 * 제목이 본문 크기로 이어진다. 글이 몇 건 없어도 문서처럼 읽혀서 빈약해 보이지 않는다.
 *
 * 대비 기준: 정보를 담는 글자는 slate-500(4.76:1) 이상. slate-400은 2.56:1이라
 * 정보에 쓰지 않는다. 다만 목록 화살표는 행 전체가 링크이고 제목이 어포던스를 지는
 * 순수 장식이라 slate-400로 두고, 혼자 의미를 지는 내려받기 글리프만 slate-500로 올린다.
 */

export type RecordMark = 'default' | 'press' | 'file';

/** 왼쪽 일자 기둥. 연도는 작게, 월·일은 크게 — tabular 숫자로 세로 정렬을 맞춘다. */
function DateStack({ date }: { date: string }) {
  // 같은 글의 두 번째 첨부처럼 이어지는 행은 일자를 비운다. 자리표시 글리프를 넣지 않는다.
  if (!date) return null;

  const m = /^(\d{4})\.\s*(\d{2})\.\s*(\d{2})/.exec(date);
  if (!m) {
    return <span className="text-sm text-slate-500 tabular-nums">{date}</span>;
  }
  return (
    <span className="block tabular-nums leading-none">
      <span className="block text-[11px] font-medium text-slate-500 mb-1.5">{m[1]}</span>
      <span className="block text-2xl md:text-[1.75rem] font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-gslt-700">
        {/* 월·일 사이 구분점. 숫자가 바로 옆에 붙어 읽히므로 정보를 지지 않는 장식이고,
            보조기기에는 "10 점 07"로 읽히면 방해가 되므로 숨긴다. */}
        {m[2]}<span className="text-slate-400 mx-px" aria-hidden="true">.</span>{m[3]}
      </span>
    </span>
  );
}

export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: RecordMark }) {
  // 흰 글씨는 gslt-700(5.3:1)까지 내려야 읽힌다. gslt-600은 3.66:1로 부족하다.
  const tones: Record<RecordMark, string> = {
    default: 'bg-slate-900 text-white',
    press: 'bg-gslt-700 text-white',
    file: 'bg-slate-100 text-slate-700',
  };
  return (
    <span className={`inline-block px-2 py-[3px] text-[11px] font-bold leading-tight ${tones[tone]}`}>
      {children}
    </span>
  );
}

/**
 * 데스크톱에서만 보이는 열 이름 줄. 실제 기록 문서의 표머리와 같은 역할.
 * 열은 2개 또는 3개다 — 행마다 값이 달라지지 않는 '구분' 열은 정보가 0이므로 아예 두지 않는다.
 */
export function RecordHead({ columns }: { columns: string[] }) {
  const grid = columns.length === 3 ? 'md:grid-cols-[7.5rem_9rem_1fr]' : 'md:grid-cols-[7.5rem_1fr]';
  return (
    <div className={`hidden md:grid ${grid} gap-6 pb-3 border-b-2 border-slate-900 text-[11px] font-bold tracking-[0.14em] text-slate-600`}>
      {columns.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}

/**
 * 기록 목록. 표는 위아래가 닫혀 있어야 문서로 읽힌다.
 * 모바일에는 표머리가 없으므로 목록이 직접 위쪽 굵은 괘선을 갖고, 어느 화면에서든 아래를 닫는다.
 */
export function RecordList({ children }: { children: ReactNode }) {
  return (
    <ul className="border-t-2 border-slate-900 md:border-t-0 border-b border-slate-200 divide-y divide-slate-200">
      {children}
    </ul>
  );
}

export function RecordRow({
  href,
  external = false,
  date,
  mark,
  markTone = 'default',
  title,
  excerpt,
  meta,
  thumbnail,
  action = 'read',
}: {
  href: string;
  external?: boolean;
  date: string;
  /** 없으면 구분 트랙을 통째로 뺀다 */
  mark?: string;
  markTone?: RecordMark;
  title: string;
  excerpt?: string;
  /** 제목 아래 한 줄 부가 정보 (전재 매체, 파일 형식·용량, 태그 등) */
  meta?: ReactNode;
  thumbnail?: string;
  action?: 'read' | 'external' | 'download';
}) {
  const ActionIcon = action === 'external' ? ArrowUpRight : action === 'download' ? Download : ArrowRight;
  // 내려받기 글리프는 '이 행은 파일을 받는다'를 혼자 말하므로 4.76:1로 둔다.
  // 목록 화살표는 행 전체가 링크이고 제목이 어포던스를 지므로 장식이다 — 되돌린다.
  const iconTone = action === 'download' ? 'text-slate-500' : 'text-slate-400';

  return (
    <li>
      <Link
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`group grid grid-cols-[4.5rem_1fr] ${
          mark ? 'md:grid-cols-[7.5rem_9rem_1fr_auto]' : 'md:grid-cols-[7.5rem_1fr_auto]'
        } gap-x-5 md:gap-x-6 gap-y-3 md:gap-y-0 py-7 md:py-8 items-start transition-colors duration-300 hover:bg-slate-50/80 -mx-4 px-4 md:-mx-6 md:px-6`}
      >
        {/* 모바일에서는 일자가 좌측 레일로 2행을 관통하고 나머지가 오른쪽 열에 쌓인다.
            데스크톱에서는 네 칸이 한 줄로 선다. */}
        <div className="col-start-1 row-start-1 row-span-2 md:row-span-1 pt-0.5">
          <DateStack date={date} />
        </div>

        <div className={`col-start-2 row-start-1 flex items-center justify-between gap-3 md:justify-start md:pt-1 ${mark ? '' : 'md:hidden'}`}>
          {mark ? <Tag tone={markTone}>{mark}</Tag> : <span />}
          <ActionIcon className={`w-5 h-5 shrink-0 ${iconTone} transition-all duration-300 group-hover:text-gslt-700 group-hover:translate-x-0.5 md:hidden`} />
        </div>

        <div className={`col-start-2 row-start-2 ${mark ? 'md:col-start-3' : 'md:col-start-2'} md:row-start-1 min-w-0`}>
          {/* 목록 페이지의 h1(제목) 바로 다음 단계다. h3로 두면 h1 → h3로 한 칸 건너뛰어
              스크린리더의 제목 목록에 빈 층이 생긴다. 크기는 클래스가 정하므로 위계만 바로잡는다. */}
          <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug break-keep transition-colors duration-300 group-hover:text-gslt-700">
            {title}
          </h2>
          {excerpt ? (
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed break-keep line-clamp-2 max-w-[60ch]">
              {excerpt}
            </p>
          ) : null}
          {meta ? <div className="mt-3">{meta}</div> : null}
        </div>

        <div className={`hidden md:flex ${mark ? 'md:col-start-4' : 'md:col-start-3'} md:row-start-1 items-center gap-4 md:pt-1`}>
          {thumbnail ? (
            <span className="relative block w-28 h-[4.5rem] shrink-0 overflow-hidden bg-slate-100">
              <Image
                src={thumbnail}
                alt=""
                fill
                sizes="112px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </span>
          ) : null}
          <ActionIcon className={`w-5 h-5 shrink-0 ${iconTone} transition-all duration-300 group-hover:text-gslt-700 group-hover:translate-x-0.5`} />
        </div>
      </Link>
    </li>
  );
}

/**
 * 목록이 비었을 때.
 * 표머리와 굵은 괘선을 그대로 두고 메시지를 일자 열 아래에 왼쪽 정렬한다 —
 * 페이지가 가장 얇은 순간에 오히려 기록부의 틀을 놓지 않기 위해서다.
 */
export function RecordEmpty({
  title,
  body,
  action,
  columns,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  /** 목록과 같은 표머리를 유지한다 */
  columns?: string[];
}) {
  return (
    <>
      {columns ? <RecordHead columns={columns} /> : null}
      <div className="border-t-2 border-slate-900 md:border-t-0 border-b border-slate-200 py-20 md:py-24 md:pl-[7.5rem]">
        <p className="text-lg font-bold text-slate-900 mb-2 break-keep">{title}</p>
        <p className="text-sm text-slate-500 break-keep max-w-[52ch] mb-8">{body}</p>
        {action}
      </div>
    </>
  );
}
