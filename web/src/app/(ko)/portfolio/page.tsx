import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Fragment, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead, { FilterBar } from '@/components/PageHead';
import { RecordEmpty, RecordHead, RecordList, RecordRow } from '@/components/Record';
import { QueryFilterBar, QueryFilterRows, type FilterRow } from '@/components/QueryFilter';
import { getPosts, isHiddenCategory, mediaUrl, postDateLabel } from '@/lib/posts';
import { localizePosts, localizeTags, type LocalizedPost } from '@/lib/translate';
import { SITE } from '@/lib/site';
import { ogImage } from '@/lib/og';
import { languageAlternates, pageSeo } from '@/lib/seo';
import { getLocale } from '@/i18n/server';
import { DEFAULT_LOCALE, localePath, type Locale } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
import { records, type RecordsMessages } from '@/i18n/messages/records';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = records[locale].portfolio;
  if (locale !== DEFAULT_LOCALE) {
    return pageSeo({ locale, title: t.meta.title, description: t.meta.description, path: '/portfolio' });
  }
  // 한국어는 예전 모양 그대로 두고 다른 언어 판(hreflang)만 더한다. 외국어 판이 한국어를 짝으로 가리키면
  // 한국어도 그들을 가리켜야 검색엔진이 짝을 인정한다.
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: '/portfolio', languages: languageAlternates('/portfolio') },
    openGraph: {
      type: 'website',
      siteName: SITE.siteName,
      locale: 'ko_KR',
      url: '/portfolio',
      description: t.meta.description,
      images: [ogImage('/portfolio', t.meta.title)],
    },
  };
}

/**
 * searchParams를 읽지 않는다. 읽으면 요청마다 함수가 그리는 페이지(ƒ)가 되어 ?tag= 주소마다 HTML이
 * 함수에서 다시 넘어갔다 — 2026-10-23 무료 한도(함수→CDN 전송 월 10GB) 초과로 사이트가 멈춘 원인 중
 * 하나다. 서버는 전체 목록을 캐시(ISR)하고, ?tag= 거르기는 브라우저가 한다(components/QueryFilter.tsx).
 */
export default async function PortfolioPage() {
  const locale = await getLocale();
  const t = records[locale];
  const c = common[locale];
  // 관리자에서 끈 분류는 주소로 직접 들어와도 없는 페이지로 낸다. 메뉴에서만 빼면
  // 검색결과·옛 링크·RSS로 그대로 닿아 '숨김'이 숨김이 아니게 된다.
  if (await isHiddenCategory('portfolio')) notFound();


  // 목록을 못 읽으면 던진다. 예전에는 '불러오지 못했습니다' 화면을 200으로 냈는데, 그 화면이
  // 캐시돼 1분간 모두에게 나가고 검색엔진은 '내용이 빈 정상 페이지'로 수집한다(네이버 HTTP 규약
  // 가이드: 서버 오류는 5xx). 던지면 ISR은 직전에 만든 정상 페이지를 계속 내보낸다.
  const posts = await getPosts('portfolio');

  // 태그는 등록된 글에서만 뽑는다 — 비어 있는 필터를 만들지 않기 위해.
  const tagCounts = new Map<string, number>();
  posts.forEach((p) => {
    (Array.isArray(p.tags) ? p.tags : []).forEach((t) => {
      const k = String(t).trim();
      if (k) tagCounts.set(k, (tagCounts.get(k) || 0) + 1);
    });
  });
  const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'));

  // 외국어 화면은 제목·요약과 태그 이름을 AI 번역으로 그린다. 필터 값(?tag=)은 한국어 태그 그대로다.
  const [items, tagNames] = await Promise.all([
    localizePosts(posts, locale),
    localizeTags(
      tags.map(([tag]) => tag),
      locale,
    ),
  ]);
  // 번역이 없거나(한국어·실패) 같으면 적힌 그대로 둔다.
  const tagLabel = (tag: string) => {
    const k = String(tag).trim();
    const v = tagNames.get(k);
    return v && v !== k ? v : tag;
  };

  const filterItems = [
    { value: 'all', label: t.portfolio.all, count: posts.length },
    ...tags.map(([tag, n]) => ({ value: tag, label: tagLabel(tag), count: n })),
  ];
  const rows = items.map((it) => portfolioRow(it, locale, t, tagLabel));
  const basePath = localePath(locale, '/portfolio');

  return (
    <>
      <Header active="portfolio" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead title={t.portfolio.title} lead={t.portfolio.lead} count={posts.length} totalTemplate={c.list.total}>
          {tags.length > 0 ? (
            // fallback이 HTML에 실리는 '전체' 모습이다. 고른 태그는 브라우저에서 바뀐다.
            <Suspense
              fallback={
                <FilterBar basePath={basePath} param="tag" current="all" items={filterItems} label={c.list.filter} />
              }
            >
              <QueryFilterBar basePath={basePath} param="tag" items={filterItems} label={c.list.filter} />
            </Suspense>
          ) : null}
        </PageHead>

        {posts.length === 0 ? (
          <RecordEmpty
            columns={t.portfolio.columns}
            title={t.portfolio.empty.title}
            body={t.portfolio.empty.body}
            action={
              <Link
                href={localePath(locale, '/contact')}
                className="inline-flex items-center bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors"
              >
                {t.portfolio.empty.action}
              </Link>
            }
          />
        ) : (
          // fallback = 전체 목록. 검색엔진과 첫 화면은 이것을 받는다. 행 node는 같은 객체를 넘긴다.
          <Suspense
            fallback={
              <>
                <RecordHead columns={t.portfolio.columns} />
                <RecordList>
                  {rows.map((r) => (
                    <Fragment key={r.key}>{r.node}</Fragment>
                  ))}
                </RecordList>
              </>
            }
          >
            <QueryFilterRows
              param="tag"
              values={tags.map(([tag]) => tag)}
              columns={t.portfolio.columns}
              rows={rows}
              empty={
                <RecordEmpty
                  columns={t.portfolio.columns}
                  title={t.portfolio.noMatch.title}
                  body={t.portfolio.noMatch.body}
                  action={
                    <Link
                      href={basePath}
                      className="inline-flex items-center px-6 py-3 border border-slate-300 text-sm font-bold text-slate-700 hover:border-gslt-500 hover:text-gslt-700 transition-colors"
                    >
                      {t.portfolio.showAll}
                    </Link>
                  }
                />
              }
            />
          </Suspense>
        )}
      </main>
      <Footer />
    </>
  );
}

/** 목록 행. 필터가 볼 갈래는 그 글의 태그들이다(앞뒤 공백을 걷어 필터 막대의 값과 맞춘다). */
function portfolioRow(
  { post: p, status }: LocalizedPost,
  locale: Locale,
  t: RecordsMessages,
  tagLabel: (tag: string) => string,
): FilterRow {
  return {
    key: p.id,
    groups: (Array.isArray(p.tags) ? p.tags : []).map((tag) => String(tag).trim()).filter(Boolean),
    node: (
      <RecordRow
        href={localePath(locale, `/news/${p.id}`)}
        date={postDateLabel(p)}
        dateLocale={locale !== DEFAULT_LOCALE ? locale : undefined}
        title={p.title}
        excerpt={p.excerpt}
        thumbnail={mediaUrl(p.thumbnail) || undefined}
        note={status === 'translated' ? t.translation.ai : status === 'original' ? t.translation.original : undefined}
        textLang={status === 'original' ? 'ko' : undefined}
        meta={
          Array.isArray(p.tags) && p.tags.length ? (
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
              {p.tags.map((tag) => (
                <li key={tag}>{tagLabel(tag)}</li>
              ))}
            </ul>
          ) : undefined
        }
      />
    ),
  };
}
