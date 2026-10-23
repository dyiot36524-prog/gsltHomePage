import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Fragment, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead, { FilterBar } from '@/components/PageHead';
import { RecordEmpty, RecordHead, RecordList, RecordRow } from '@/components/Record';
import { QueryFilterBar, QueryFilterRows, QueryHide, type FilterRow } from '@/components/QueryFilter';
import { ArrowUpRight } from '@/components/Icon';
import { bindLastWords } from '@/lib/nobreak';
import { getPosts, isHiddenCategory, isPress, mediaUrl, postDateLabel, postHref, postMirrors, type Post } from '@/lib/posts';

export const metadata: Metadata = pageSeo({
  // 틀이 뒤에 상호를 붙이므로 앞에 또 쓰지 않는다('GSLT 소식 | GSLT'였다).
  title: "소식",
  description:
    "지에스엘티의 새 소식과 언론보도입니다. 수상·특허 출원·국책과제 선정 기록을 시간순으로 모아 전해 드립니다.",
  path: '/news',
});

const COLUMNS = ['일자', '구분', '제목'];

/**
 * searchParams를 읽지 않는다. 읽으면 이 페이지가 요청마다 함수가 그리는 페이지(ƒ)가 되어, 수집기가
 * ?type= 주소를 돌 때마다 HTML이 함수에서 다시 넘어갔다 — 2026-10-23 무료 한도(함수→CDN 전송 월 10GB)
 * 초과로 사이트가 멈춘 원인 중 하나다. 서버는 전체 목록을 캐시(ISR)하고, ?type=(자사 소식/언론보도)
 * 거르기는 브라우저가 한다(components/QueryFilter.tsx).
 */
export default async function NewsPage() {
  // 관리자에서 끈 분류는 주소로 직접 들어와도 없는 페이지로 낸다. 메뉴에서만 빼면
  // 검색결과·옛 링크·RSS로 그대로 닿아 '숨김'이 숨김이 아니게 된다.
  if (await isHiddenCategory('news')) notFound();
  // 목록을 못 읽으면 던진다. 예전에는 '불러오지 못했습니다' 화면을 200으로 냈는데, 그 화면이
  // 캐시돼 1분간 모두에게 나가고 검색엔진은 '내용이 빈 정상 페이지'로 수집한다(네이버 HTTP 규약
  // 가이드: 서버 오류는 5xx). 던지면 ISR은 직전에 만든 정상 페이지를 계속 내보낸다.
  const posts = await getPosts('news');

  const counts = {
    all: posts.length,
    article: posts.filter((p) => !isPress(p)).length,
    press: posts.filter(isPress).length,
  };
  const filterItems = [
    { value: 'all', label: '전체', count: counts.all },
    { value: 'article', label: '자사 소식', count: counts.article },
    { value: 'press', label: '언론보도', count: counts.press },
  ];
  const rows = posts.map(newsRow);

  return (
    <>
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbSchema([{ name: "홈", path: "/" }, { name: "GSLT 소식", path: "/news" }])),
        }}
      />
      <Header active="news" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="GSLT 소식"
          lead="회사가 남긴 기록입니다. 직접 쓴 소식과, 저희를 다룬 언론 보도를 함께 모았습니다."
          count={posts.length}
        >
          {posts.length > 0 ? (
            // fallback이 HTML에 실리는 '전체' 모습이다. 고른 갈래는 브라우저에서 바뀐다.
            <Suspense fallback={<FilterBar basePath="/news" current="all" items={filterItems} />}>
              <QueryFilterBar basePath="/news" items={filterItems} />
            </Suspense>
          ) : null}
        </PageHead>

        {posts.length === 0 ? (
          <RecordEmpty
            columns={COLUMNS}
            title="아직 등록된 소식이 없습니다"
            body="새로운 소식이 준비되면 이곳에 먼저 올립니다."
          />
        ) : (
          // fallback = 전체 목록. 검색엔진과 첫 화면은 이것을 받는다. 행 node는 같은 객체를 넘긴다.
          <Suspense
            fallback={
              <>
                <RecordHead columns={COLUMNS} />
                <RecordList>
                  {rows.map((r) => (
                    <Fragment key={r.key}>{r.node}</Fragment>
                  ))}
                </RecordList>
              </>
            }
          >
            <QueryFilterRows
              param="type"
              values={['article', 'press']}
              columns={COLUMNS}
              rows={rows}
              empty={
                <RecordEmpty
                  columns={COLUMNS}
                  title="해당하는 기록이 없습니다"
                  body="다른 구분을 선택해 보세요."
                  action={
                    <Link
                      href="/news"
                      className="inline-flex items-center px-6 py-3 border border-slate-300 text-sm font-bold text-slate-700 hover:border-gslt-500 hover:text-gslt-700 transition-colors"
                    >
                      전체 보기
                    </Link>
                  }
                />
              }
            />
          </Suspense>
        )}

        {/* break-keep이 없어 좁은 폭에서 '실었습/니다'로 끊겼다. 문장은 span 하나로 감싸 줄어들 수
            있는 flex 항목으로 두고, 아이콘은 줄지 않게 한다. 언론보도만 볼 때는 숨긴다(브라우저에서). */}
        {counts.press > 0 ? (
          <Suspense fallback={pressNote}>
            <QueryHide param="type" value="press">
              {pressNote}
            </QueryHide>
          </Suspense>
        ) : null}
      </main>
      <Footer />
    </>
  );
}

/** 목록 행. 화면용 RecordRow와, 필터가 볼 갈래(자사 소식 article / 언론보도 press)를 함께 만든다. */
function newsRow(p: Post): FilterRow {
  const press = isPress(p);
  const mirrors = postMirrors(p);
  return {
    key: p.id,
    groups: [press ? 'press' : 'article'],
    node: (
      <RecordRow
        href={postHref(p)}
        date={postDateLabel(p)}
        mark={press ? p.outlet || '언론보도' : '자사 소식'}
        markTone={press ? 'press' : 'default'}
        // 휴대폰 폭(280~375px)에서 제목 마지막 줄에 '출원'·'소개'·'획득' 한 단어만 남았다.
        // 마지막 두 어절을 이어 함께 넘긴다.
        // 이 목록 화면에만 쓴다 — 상세의 메타·JSON-LD와 RSS는 원래 제목을 따로 읽는다.
        title={bindLastWords(p.title)}
        excerpt={p.excerpt}
        thumbnail={mediaUrl(p.thumbnail) || undefined}
        action="read"
        meta={
          press && (p.reporter || mirrors.length) ? (
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              {p.reporter ? <span>{p.reporter} 기자</span> : null}
              {mirrors.length ? (
                <span className="inline-flex items-center gap-1.5">
                  전재
                  <span className="text-slate-500">
                    {mirrors.map((m) => m.label).join(' · ')}
                  </span>
                </span>
              ) : null}
            </p>
          ) : undefined
        }
      />
    ),
  };
}

const pressNote = (
  <p className="mt-14 flex items-center gap-2 text-sm text-slate-500 break-keep">
    <ArrowUpRight className="w-4 h-4 shrink-0 text-gslt-600" />
    <span className="min-w-0">언론보도는 기사 요약과 원문 링크를 함께 실었습니다.</span>
  </p>
);
