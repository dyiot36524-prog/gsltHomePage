'use client';

import { useSearchParams } from 'next/navigation';
import { Fragment, type ReactNode } from 'react';
import { FilterBar } from '@/components/PageHead';
import { RecordHead, RecordList } from '@/components/Record';

/**
 * 목록 필터(?type=·?tag=)를 브라우저에서 건다.
 *
 * 예전에는 페이지가 searchParams를 읽어 서버에서 걸렀다. 그 한 줄 때문에 /news·/portfolio가
 * 요청마다 함수가 새로 그리는 페이지(ƒ)가 됐고, 수집기가 ?type=·?tag= 주소를 돌 때마다 HTML 전체가
 * 함수에서 CDN으로 다시 넘어갔다 — 2026-10-23 Vercel 무료 한도(함수→CDN 전송 월 10GB) 초과로
 * 사이트가 멈춘 원인 중 하나다.
 *
 * 이제 서버는 전체 목록을 한 번 그려 캐시(ISR)해 두고, 고르는 일은 여기서 한다. 검색엔진이 받는
 * HTML에는 전체 목록이 그대로 있고(정본도 필터 없는 주소다), 방문자 화면만 고른 갈래로 줄어든다.
 * useSearchParams는 미리 그릴 때 값을 모르므로, 이 컴포넌트들은 반드시 Suspense 안에 두고
 * fallback에 '전체' 화면을 준다 — 그게 HTML에 실리는 모습이다.
 *
 * 주소의 값은 실제 갈래 중 하나일 때만 받는다. 모르는 값은 '전체' — 서버에서 하던 규칙 그대로다.
 */
function useCurrent(param: string, values: string[]): string {
  const v = useSearchParams().get(param);
  return v && v !== 'all' && values.includes(v) ? v : 'all';
}

type Item = { value: string; label: string; count: number };

/** 필터 막대. 지금 고른 갈래에 밑줄과 aria-current를 준다. */
export function QueryFilterBar({ items, basePath, param = 'type' }: { items: Item[]; basePath: string; param?: string }) {
  const current = useCurrent(param, items.map((it) => it.value));
  return <FilterBar items={items} current={current} basePath={basePath} param={param} />;
}

/** 목록의 한 행. node는 서버가 그린 RecordRow, groups는 이 행이 걸리는 필터 값들이다. */
export type FilterRow = { key: string; groups: string[]; node: ReactNode };

/** 고른 갈래의 행만 낸다. 하나도 없으면 empty(서버가 그린 빈 목록 안내)를 낸다. */
export function QueryFilterRows({
  param,
  values,
  columns,
  rows,
  empty,
}: {
  param: string;
  /** 받을 수 있는 필터 값('all' 제외) */
  values: string[];
  columns: string[];
  rows: FilterRow[];
  empty: ReactNode;
}) {
  const current = useCurrent(param, values);
  const shown = current === 'all' ? rows : rows.filter((r) => r.groups.includes(current));
  if (!shown.length) return <>{empty}</>;
  return (
    <>
      <RecordHead columns={columns} />
      <RecordList>
        {shown.map((r) => (
          <Fragment key={r.key}>{r.node}</Fragment>
        ))}
      </RecordList>
    </>
  );
}

/** 주소의 param이 value일 때만 숨긴다(예: 언론보도만 볼 때 '언론보도는…' 안내). */
export function QueryHide({ param, value, children }: { param: string; value: string; children: ReactNode }) {
  return useSearchParams().get(param) === value ? null : <>{children}</>;
}
