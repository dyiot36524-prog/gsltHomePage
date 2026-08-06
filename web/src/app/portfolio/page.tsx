import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead, { FilterBar } from '@/components/PageHead';
import { RecordEmpty, RecordHead, RecordList, RecordRow } from '@/components/Record';
import { getPosts, mediaUrl, postDateLabel, type Post } from '@/lib/posts';

export const metadata: Metadata = {
  title: '시공사례',
  description: '지에스엘티가 실제로 구축한 공간들. 현장 조건과 적용 솔루션을 기록으로 남깁니다.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    locale: 'ko_KR',
    url: '/portfolio',
    title: '시공사례 | GSLT',
    description: '지에스엘티가 실제로 구축한 공간들. 현장 조건과 적용 솔루션을 기록으로 남깁니다.',
    images: ['/img/og-image.png'],
  },
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  let posts: Post[] = [];
  let failed = false;
  try {
    posts = await getPosts('portfolio');
  } catch {
    failed = true;
  }

  // 태그는 등록된 글에서만 뽑는다 — 비어 있는 필터를 만들지 않기 위해.
  const tagCounts = new Map<string, number>();
  posts.forEach((p) => {
    (Array.isArray(p.tags) ? p.tags : []).forEach((t) => {
      const k = String(t).trim();
      if (k) tagCounts.set(k, (tagCounts.get(k) || 0) + 1);
    });
  });
  const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'));

  const current = tag && tagCounts.has(tag) ? tag : 'all';
  const shown = current === 'all' ? posts : posts.filter((p) => (p.tags || []).includes(current));

  return (
    <>
      <Header active="portfolio" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="시공사례"
          lead="배선을 뜯지 않고 어떤 공간을, 어떻게 바꿨는지. 현장별로 남긴 구축 기록입니다."
          count={posts.length}
        >
          {tags.length > 0 ? (
            <FilterBar
              basePath="/portfolio"
              param="tag"
              current={current}
              items={[
                { value: 'all', label: '전체', count: posts.length },
                ...tags.map(([t, c]) => ({ value: t, label: t, count: c })),
              ]}
            />
          ) : null}
        </PageHead>

        {failed ? (
          <RecordEmpty
            title="목록을 불러오지 못했습니다"
            body="일시적인 문제일 수 있습니다. 잠시 후 새로고침해 주세요."
          />
        ) : shown.length === 0 ? (
          <RecordEmpty
            columns={['일자', '현장']}
            title={posts.length === 0 ? '시공사례를 준비하고 있습니다' : '해당 태그의 기록이 없습니다'}
            body={
              posts.length === 0
                ? '진행한 현장을 정리해 순차적으로 공개하고 있습니다. 특정 현장 사례가 필요하시면 알려주세요.'
                : '다른 태그를 선택해 보세요.'
            }
            action={
              posts.length === 0 ? (
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors"
                >
                  사례 요청하기
                </Link>
              ) : (
                <Link
                  href="/portfolio"
                  className="inline-flex items-center px-6 py-3 border border-slate-300 text-sm font-bold text-slate-700 hover:border-gslt-500 hover:text-gslt-700 transition-colors"
                >
                  전체 보기
                </Link>
              )
            }
          />
        ) : (
          <>
            <RecordHead columns={['일자', '현장']} />
            <RecordList>
              {shown.map((p) => (
                <RecordRow
                  key={p.id}
                  href={`/news/${p.id}`}
                  date={postDateLabel(p)}
                  title={p.title}
                  excerpt={p.excerpt}
                  thumbnail={mediaUrl(p.thumbnail) || undefined}
                  meta={
                    Array.isArray(p.tags) && p.tags.length ? (
                      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                        {p.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : undefined
                  }
                />
              ))}
            </RecordList>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
