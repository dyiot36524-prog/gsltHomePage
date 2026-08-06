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
 * 대비 기준: 정보를 담는 글자는 slate-500(4.76:1) 이상, 동작 아이콘도 slate-500.
 * slate-400은 2.56:1, slate-300은 1.5:1이라 정보나 어포던스에 쓰지 않는다.
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
        {m[2]}<span className="text-slate-400 mx-px">.</span>{m[3]}
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

/** 데스크톱에서만 보이는 열 이름 줄. 실제 기록 문서의 표머리와 같은 역할. */
export function RecordHead({ columns }: { columns: [string, string, string] }) {
  return (
    <div className="hidden md:grid grid-cols-[7.5rem_9rem_1fr] gap-6 pb-3 border-b-2 border-slate-900 text-[11px] font-bold tracking-[0.14em] text-slate-600">
      <span>{columns[0]}</span>
      <span>{columns[1]}</span>
      <span>{columns[2]}</span>
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
  mark: string;
  markTone?: RecordMark;
  title: string;
  excerpt?: string;
  /** 제목 아래 한 줄 부가 정보 (전재 매체, 파일 형식·용량, 태그 등) */
  meta?: ReactNode;
  thumbnail?: string;
  action?: 'read' | 'external' | 'download';
}) {
  const ActionIcon = action === 'external' ? ArrowUpRight : action === 'download' ? Download : ArrowRight;

  return (
    <li>
      <Link
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group grid grid-cols-[4.5rem_1fr] md:grid-cols-[7.5rem_9rem_1fr_auto] gap-x-5 md:gap-x-6 gap-y-3 md:gap-y-0 py-7 md:py-8 items-start transition-colors duration-300 hover:bg-slate-50/80 -mx-4 px-4 md:-mx-6 md:px-6"
      >
        {/* 모바일에서는 일자가 좌측 레일로 2행을 관통하고 나머지가 오른쪽 열에 쌓인다.
            데스크톱에서는 네 칸이 한 줄로 선다. */}
        <div className="col-start-1 row-start-1 row-span-2 md:row-span-1 pt-0.5">
          <DateStack date={date} />
        </div>

        <div className="col-start-2 row-start-1 flex items-center justify-between gap-3 md:justify-start md:pt-1">
          <Tag tone={markTone}>{mark}</Tag>
          <ActionIcon className="w-5 h-5 shrink-0 text-slate-500 transition-all duration-300 group-hover:text-gslt-700 group-hover:translate-x-0.5 md:hidden" />
        </div>

        <div className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug break-keep transition-colors duration-300 group-hover:text-gslt-700">
            {title}
          </h3>
          {excerpt ? (
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed break-keep line-clamp-2 max-w-[60ch]">
              {excerpt}
            </p>
          ) : null}
          {meta ? <div className="mt-3">{meta}</div> : null}
        </div>

        <div className="hidden md:flex md:col-start-4 md:row-start-1 items-center gap-4 md:pt-1">
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
          <ActionIcon className="w-5 h-5 shrink-0 text-slate-500 transition-all duration-300 group-hover:text-gslt-700 group-hover:translate-x-0.5" />
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
  columns?: [string, string, string];
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
