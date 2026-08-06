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
  // 값이 있는 갈래가 하나뿐이면 '전체'와 결과가 같아 컨트롤이 둘 다 무의미해진다.
  const usable = items.filter((it) => it.count > 0 || it.value === current);
  if (usable.filter((it) => it.value !== 'all').length < 2) return null;

  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-label="목록 필터">
      {usable.map((it) => {
        const on = it.value === current;
        const href = it.value === 'all' ? basePath : `${basePath}?${param}=${encodeURIComponent(it.value)}`;
        // aria-current는 URL을 바꿔 '지금 보고 있는 목록'을 표현하므로 page가 정확한 값이다.
        // true도 유효하지만 "현재 항목"이라는 뜻만 남고 무엇의 현재인지가 빠진다.
        return (
          <Link
            key={it.value}
            href={href}
            aria-current={on ? 'page' : undefined}
            className={`inline-flex items-baseline gap-1.5 pb-1 border-b-2 transition-colors duration-200 ${
              on
                ? 'border-gslt-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {it.label}
            {/* 건수는 0.75rem 본문 글자다. gslt-600은 흰 바탕 3.66:1이라 아이콘·큰 글자 전용이므로
                (DESIGN.md '대비 사다리는 바탕을 따른다') 한 단계 내린 gslt-700(5.30:1)을 쓴다. */}
            <span className={`text-xs tabular-nums ${on ? 'text-gslt-700' : 'text-slate-500'}`}>
              {it.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
