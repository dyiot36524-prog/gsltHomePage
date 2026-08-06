import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * 목록 페이지 머리.
 * 제목 위에 작은 라벨(아이브로)을 두지 않는다 — 제목이 스스로 버틴다.
 * 대신 오른쪽에 총 기록 수를 둬서, 이 페이지가 무엇을 얼마나 담고 있는지를 먼저 알린다.
 */
export default function PageHead({
  title,
  lead,
  count,
  countLabel = '건',
  children,
}: {
  title: string;
  lead: string;
  count?: number;
  countLabel?: string;
  /** 필터 등 제목 아래 붙는 조작 영역 */
  children?: ReactNode;
}) {
  return (
    <div className="pt-16 md:pt-24 pb-10 md:pb-14">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-6">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight break-keep text-slate-900">
          {title}
        </h1>
        {typeof count === 'number' ? (
          <p className="shrink-0 text-sm text-slate-500 tabular-nums sm:pb-2">
            총 <span className="font-bold text-slate-900">{count}</span>
            {countLabel}
          </p>
        ) : null}
      </div>
      <p className="text-slate-500 leading-relaxed break-keep max-w-[62ch]">{lead}</p>
      {children ? <div className="mt-10">{children}</div> : null}
    </div>
  );
}

/**
 * 필터. 알약 칩 대신 밑줄 텍스트 버튼 — 기록부의 표머리와 같은 결로 읽힌다.
 * URL 쿼리로 동작해 서버에서 걸러지고, 링크를 공유하면 그 상태가 그대로 열린다.
 */
export function FilterBar({
  items,
  current,
  basePath,
  param = 'type',
}: {
  items: { value: string; label: string; count: number }[];
  current: string;
  basePath: string;
  param?: string;
}) {
  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-label="목록 필터">
      {items.filter((it) => it.count > 0 || it.value === current).map((it) => {
        const on = it.value === current;
        const href = it.value === 'all' ? basePath : `${basePath}?${param}=${encodeURIComponent(it.value)}`;
        return (
          <Link
            key={it.value}
            href={href}
            aria-current={on ? 'true' : undefined}
            className={`inline-flex items-baseline gap-1.5 pb-1 border-b-2 transition-colors duration-200 ${
              on
                ? 'border-gslt-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {it.label}
            <span className={`text-xs tabular-nums ${on ? 'text-gslt-600' : 'text-slate-500'}`}>
              {it.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
