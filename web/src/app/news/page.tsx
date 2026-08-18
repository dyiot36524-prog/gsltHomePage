import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead, { FilterBar } from '@/components/PageHead';
import { RecordEmpty, RecordHead, RecordList, RecordRow } from '@/components/Record';
import { ArrowUpRight } from '@/components/Icon';
import { getPosts, isHiddenCategory, isPress, mediaUrl, postDateLabel, postHref, postMirrors, type Post } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'GSLT 소식',
  description: '지에스엘티의 새로운 소식과 언론보도를 기록순으로 전합니다.',
  alternates: { canonical: '/news' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    locale: 'ko_KR',
    url: '/news',
    title: 'GSLT 소식 | GSLT',
    description: '지에스엘티의 새로운 소식과 언론보도를 기록순으로 전합니다.',
    images: ['/img/og-image.png'],
  },
};

type Filter = 'all' | 'article' | 'press';

function match(p: Post, f: Filter) {
  if (f === 'press') return isPress(p);
  if (f === 'article') return !isPress(p);
  return true;
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const current: Filter = type === 'press' || type === 'article' ? type : 'all';

  // 관리자에서 끈 분류는 주소로 직접 들어와도 없는 페이지로 낸다. 메뉴에서만 빼면
  // 검색결과·옛 링크·RSS로 그대로 닿아 '숨김'이 숨김이 아니게 된다.
  if (await isHiddenCategory('news')) notFound();
  let posts: Post[] = [];
  let failed = false;
  try {
    posts = await getPosts('news');
  } catch {
    failed = true;
  }

  const shown = posts.filter((p) => match(p, current));
  const counts = {
    all: posts.length,
    article: posts.filter((p) => !isPress(p)).length,
    press: posts.filter(isPress).length,
  };

  return (
    <>
      <Header active="news" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="GSLT 소식"
          lead="회사가 남긴 기록입니다. 직접 쓴 소식과, 저희를 다룬 언론 보도를 함께 모았습니다."
          count={posts.length}
        >
          {posts.length > 0 ? (
            <FilterBar
              basePath="/news"
              current={current}
              items={[
                { value: 'all', label: '전체', count: counts.all },
                { value: 'article', label: '자사 소식', count: counts.article },
                { value: 'press', label: '언론보도', count: counts.press },
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
            columns={['일자', '구분', '제목']}
            title={posts.length === 0 ? '아직 등록된 소식이 없습니다' : '해당하는 기록이 없습니다'}
            body={
              posts.length === 0
                ? '새로운 소식이 준비되면 이곳에 먼저 올립니다.'
                : '다른 구분을 선택해 보세요.'
            }
            action={
              posts.length > 0 ? (
                <Link
                  href="/news"
                  className="inline-flex items-center px-6 py-3 border border-slate-300 text-sm font-bold text-slate-700 hover:border-gslt-500 hover:text-gslt-700 transition-colors"
                >
                  전체 보기
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <RecordHead columns={['일자', '구분', '제목']} />
            <RecordList>
              {shown.map((p) => {
                const press = isPress(p);
                const mirrors = postMirrors(p);
                return (
                  <RecordRow
                    key={p.id}
                    href={postHref(p)}
                    external={press}
                    date={postDateLabel(p)}
                    mark={press ? p.outlet || '언론보도' : '자사 소식'}
                    markTone={press ? 'press' : 'default'}
                    title={p.title}
                    excerpt={p.excerpt}
                    thumbnail={mediaUrl(p.thumbnail) || undefined}
                    action={press ? 'external' : 'read'}
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
                );
              })}
            </RecordList>
          </>
        )}

        {counts.press > 0 && current !== 'press' ? (
          <p className="mt-14 flex items-center gap-2 text-sm text-slate-500">
            <ArrowUpRight className="w-4 h-4 text-gslt-600" />
            언론보도는 원문 매체로 바로 연결됩니다.
          </p>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
