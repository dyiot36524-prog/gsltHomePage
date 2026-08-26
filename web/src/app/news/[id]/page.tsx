import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tag } from '@/components/Record';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download } from '@/components/Icon';
import { renderMarkdown } from '@/lib/markdown';
import {
  getPost, getPosts, isHiddenCategory, isPress, mediaUrl, postDateLabel, postMirrors, postTime,
  safeHttpUrl, type Post,
} from '@/lib/posts';
import { SITE } from '@/lib/site';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post || (await isHiddenCategory(post.category)))
    return { title: '글을 찾을 수 없습니다', robots: { index: false, follow: true } };
  const url = `/news/${id}`;
  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: 'GSLT',
      locale: 'ko_KR',
      url,
      title: `${post.title} | GSLT`,
      description: post.excerpt || post.title,
      images: [mediaUrl(post.thumbnail) || '/img/og-image.png'],
    },
  };
}

/**
 * 첨부 크기 표기. MB로만 찍으면 1MB 미만이 전부 '0.0 MB'가 되어, 회사 소개서 한 건이
 * 실제로 그렇게 보이고 있었다. 크기에 맞는 단위를 고른다.
 */
function fileSize(n?: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

type SourceRow = { label: string; value: React.ReactNode };

/** 앞·뒤 기록. 고정 글 여부와 무관하게 시간순으로만 잇는다. */
function neighbours(all: Post[], id: string) {
  const line = [...all].sort((a, b) => postTime(b) - postTime(a));
  const i = line.findIndex((p) => p.id === id);
  return { prev: i > 0 ? line[i - 1] : null, next: i >= 0 && i < line.length - 1 ? line[i + 1] : null };
}

export default async function PostPage({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  // 분류를 끄면 그 분류의 글도 공개되지 않는다. 목록만 막고 상세를 열어 두면
  // 검색결과에 남은 링크로 그대로 읽힌다.
  if (await isHiddenCategory(post.category)) notFound();

  // 언론보도도 우리 지면을 갖는다. 예전에는 원문으로 바로 넘겼는데, 그러면 이 회사를
  // 다룬 기사 4건이 검색에서 우리 주소로는 전혀 잡히지 않았다(sitemap·RSS도 뺄 수밖에 없었다).
  // 기사 본문과 사진은 우리 것이 아니므로 가져오지 않는다. 제목·우리가 쓴 요약·매체·기자·
  // 일자와 원문 링크만으로 지면을 만든다.
  const press = isPress(post);
  const source = press ? safeHttpUrl(post.sourceUrl) : '';
  const mirrors = postMirrors(post);

  // 값이 있는 항목만 행이 된다. 빈 칸에 '-'를 채우지 않는 것이 이 기록부의 규칙이다.
  const sourceRows: SourceRow[] = press
    ? ([
        post.outlet ? { label: '매체', value: <span className="font-bold">{post.outlet}</span> } : null,
        post.reporter ? { label: '기자', value: `${post.reporter} 기자` } : null,
        mirrors.length
          ? {
              label: '전재',
              value: (
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {mirrors.map((m) => (
                    <li key={m.url}>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 font-bold text-gslt-700 hover:text-gslt-600 transition-colors"
                      >
                        {m.label}
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              ),
            }
          : null,
      ] as (SourceRow | null)[]).filter((r): r is SourceRow => r !== null)
    : [];

  const bodyHtml = renderMarkdown(post.body || '');
  const all = await getPosts(post.category).catch(() => [] as Post[]);
  const { prev, next } = neighbours(all, id);

  const backTo =
    post.category === 'portfolio' ? { href: '/portfolio', label: '포트폴리오' }
    : post.category === 'downloads' ? { href: '/downloads', label: '자료실' }
    : { href: '/news', label: 'GSLT 소식' };

  // 주소를 하드코딩하지 않는다. 구 도메인(home.gslt.kr)이 박혀 있어 검색엔진이
  // 정리될 주소를 이 글의 정본으로 알고 있었다.
  const ld = jsonLd(
    press
      ? {
          // 이 지면은 '기사를 소개하는 페이지'다. 기사 자체의 저자·발행처는 언론사이고
          // 우리가 쓴 것은 요약뿐이라, 저자를 우리로 주장하면 사실과 다르다.
          '@type': 'WebPage',
          name: post.title,
          description: post.excerpt || post.title,
          inLanguage: 'ko-KR',
          url: `${SITE.url}/news/${id}`,
          publisher: { '@id': `${SITE.url}/#organization` },
          mainEntity: {
            '@type': 'NewsArticle',
            headline: post.title,
            ...(source ? { url: source } : {}),
            ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
            ...(post.outlet ? { publisher: { '@type': 'Organization', name: post.outlet } } : {}),
            ...(post.reporter ? { author: { '@type': 'Person', name: post.reporter } } : {}),
            about: { '@id': `${SITE.url}/#organization` },
          },
        }
      : {
      '@type': post.category === 'news' ? 'NewsArticle' : 'Article',
      headline: post.title,
      description: post.excerpt || post.title,
      datePublished: post.createdAt instanceof Date ? post.createdAt.toISOString() : undefined,
      dateModified: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : undefined,
      inLanguage: 'ko-KR',
      author: { '@id': `${SITE.url}/#organization` },
      publisher: { '@id': `${SITE.url}/#organization` },
      mainEntityOfPage: `${SITE.url}/news/${id}`,
      url: `${SITE.url}/news/${id}`,
      ...(mediaUrl(post.thumbnail) ? { image: [mediaUrl(post.thumbnail)] } : {}),
        },
    breadcrumbSchema([
      { name: '홈', path: '/' },
      { name: backTo.label, path: backTo.href },
      { name: post.title, path: `/news/${id}` },
    ]),
  );

  return (
    <>
      <Header active={post.category === 'portfolio' ? 'portfolio' : post.category === 'downloads' ? 'downloads' : 'news'} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />

        <div className="pt-10 md:pt-14">
          <Link
            href={backTo.href}
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-gslt-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {backTo.label}
          </Link>
        </div>

        <article className="max-w-[68ch] pt-8 md:pt-12">
          <header className="pb-8 border-b-2 border-slate-900">
            <div className="flex items-center gap-3 mb-5 tabular-nums">
              <Tag>{press ? '언론보도' : post.category === 'portfolio' ? '시공사례' : post.category === 'downloads' ? '자료' : '자사 소식'}</Tag>
              <span className="text-sm text-slate-500">{postDateLabel(post)}</span>
              {typeof post.views === 'number' && post.views > 0 ? (
                <span className="text-sm text-slate-500">조회 {post.views}</span>
              ) : null}
            </div>
            <h1 className="text-3xl md:text-[2.6rem] font-black tracking-tight leading-[1.2] break-keep text-slate-900">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 text-lg text-slate-500 leading-relaxed break-keep">{post.excerpt}</p>
            ) : null}
            {press && post.excerpt && !bodyHtml ? (
              <p className="mt-3 text-xs text-slate-500">GSLT가 정리한 요약입니다.</p>
            ) : null}
            {Array.isArray(post.tags) && post.tags.length ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <li key={t} className="text-xs font-medium text-slate-500 border border-slate-200 px-2.5 py-1">
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          {/* 비율을 강제하지 않는다. 16:9 상자에 object-cover로 채웠더니 수상 카드와 인증서
              그래픽의 아래쪽 글자가 잘렸다 — 사진이면 잘려도 되지만 글자가 든 그래픽은 안 된다.
              원본 비율 그대로 폭에 맞춰 내린다. next/image 대신 <img>를 쓰는 이유는 비율을
              모르는 원격 이미지를 자르지 않고 배치하려면 고정 상자를 버려야 하기 때문이고,
              크기 최적화는 Cloudinary가 f_auto,q_auto,w_1600으로 이미 하고 있다. */}
          {mediaUrl(post.thumbnail) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl(post.thumbnail)}
              alt=""
              loading="lazy"
              decoding="async"
              className="mt-10 w-full h-auto bg-slate-100"
            />
          ) : null}

          {bodyHtml ? (
            <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : null}

          {/* 출처는 상자에 담기지 않는다. 헤어라인으로 나뉜 행으로 눕는다. 이전에는 2px 테두리
              상자였는데, 아래 이전/다음 표와 먹색 CTA 면 사이에 끼어 '상자 → 표 → 면'으로
              무게가 세 번 튀었다. 이제 '표 → 표 → 면' 한 방향으로 간다.

              '출처' 같은 머리 라벨은 두지 않는다. 매체·기자·전재가 이미 이름을 지고 있어
              그 위의 라벨은 제목 위 작은 라벨(키커)이 되고, 머리말을 닫은 2px 먹선 바로 아래
              또 2px 먹선이 와서 선이 두 번 겹쳤다.

              기사 본문과 사진은 언론사의 것이라 여기 옮기지 않는다. */}
          {press ? (
            <section className="mt-10">
              <dl className="divide-y divide-slate-200 border-b border-slate-200">
                {sourceRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[4.5rem_1fr] md:grid-cols-[7.5rem_1fr] gap-x-5 py-4"
                  >
                    <dt className="text-[0.6875rem] font-bold tracking-[0.14em] text-slate-500 pt-1">
                      {row.label}
                    </dt>
                    <dd className="text-slate-900 break-keep">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {source ? (
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3.5 text-sm font-bold transition-colors"
                >
                  {post.outlet ? `${post.outlet} 원문 보기` : '원문 보기'}
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : null}
              <p className="mt-4 text-sm text-slate-500 break-keep">
                기사 본문과 사진은 해당 언론사에 있습니다.
              </p>
            </section>
          ) : null}

          {/* 첨부 파일. 출처 표와 같은 문법으로 눕는다 — 머리말을 닫은 2px 먹선이 표머리를
              대신하므로 위 헤어라인을 두지 않는다. */}
          {Array.isArray(post.attachments) && post.attachments.length ? (
            <section className="mt-10">
              <ul className="divide-y divide-slate-200 border-b border-slate-200">
                {post.attachments
                  .filter((f) => f && mediaUrl(f.url))
                  .map((f) => (
                    <li key={f.url}>
                      <a
                        href={mediaUrl(f.url)}
                        {...(/^https?:\/\//i.test(mediaUrl(f.url))
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="group flex items-center gap-4 py-4 text-sm"
                      >
                        <Download className="w-5 h-5 shrink-0 text-slate-500 transition-colors group-hover:text-gslt-700" />
                        <span className="min-w-0 flex-1 font-bold text-slate-900 group-hover:text-gslt-700 transition-colors break-all">
                          {f.name}
                        </span>
                        <span className="shrink-0 text-xs text-slate-500 tabular-nums">
                          {fileSize(f.size)}
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </section>
          ) : null}
        </article>

        {(prev || next) && (
          <nav className="max-w-[68ch] mt-20 border-t-2 border-slate-900" aria-label="다른 기록">
            <ul className="divide-y divide-slate-200">
              {prev && (
                <li>
                  <Link href={`/news/${prev.id}`} className="group flex items-center gap-4 py-6">
                    <ArrowLeft className="w-4 h-4 shrink-0 text-slate-500 transition-all duration-300 group-hover:text-gslt-600 group-hover:-translate-x-0.5" />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold tracking-[0.14em] text-slate-500 mb-1">이전 기록</span>
                      <span className="block font-bold text-slate-900 break-keep group-hover:text-gslt-700 transition-colors line-clamp-1">
                        {prev.title}
                      </span>
                    </span>
                  </Link>
                </li>
              )}
              {next && (
                <li>
                  <Link href={`/news/${next.id}`} className="group flex items-center justify-end gap-4 py-6 text-right">
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold tracking-[0.14em] text-slate-500 mb-1">다음 기록</span>
                      <span className="block font-bold text-slate-900 break-keep group-hover:text-gslt-700 transition-colors line-clamp-1">
                        {next.title}
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-500 transition-all duration-300 group-hover:text-gslt-600 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        <aside className="max-w-[68ch] mt-16 bg-slate-900 text-white p-8 md:p-10">
          <p className="text-xl md:text-2xl font-black tracking-tight break-keep mb-2">
            우리 공간에는 어떻게 적용될까요?
          </p>
          <p className="text-white/60 break-keep mb-7">
            현장 조건에 맞는 구성을 무료로 제안해 드립니다.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors"
          >
            도입 문의
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </aside>
      </main>
      <Footer />
    </>
  );
}
