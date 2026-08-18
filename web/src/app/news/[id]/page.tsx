import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tag } from '@/components/Record';
import { ArrowLeft, ArrowRight } from '@/components/Icon';
import { renderMarkdown } from '@/lib/markdown';
import {
  getPost, getPosts, isHiddenCategory, isPress, mediaUrl, postDateLabel, postTime, safeHttpUrl, type Post,
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

  // 언론보도는 본문을 우리가 갖고 있지 않다. 원문으로 넘긴다.
  if (isPress(post)) {
    const src = safeHttpUrl(post.sourceUrl);
    if (src) redirect(src);
  }

  const bodyHtml = renderMarkdown(post.body || '');
  const all = await getPosts(post.category).catch(() => [] as Post[]);
  const { prev, next } = neighbours(all.filter((p) => !isPress(p)), id);

  const backTo =
    post.category === 'portfolio' ? { href: '/portfolio', label: '포트폴리오' }
    : post.category === 'downloads' ? { href: '/downloads', label: '자료실' }
    : { href: '/news', label: 'GSLT 소식' };

  // 주소를 하드코딩하지 않는다. 구 도메인(home.gslt.kr)이 박혀 있어 검색엔진이
  // 정리될 주소를 이 글의 정본으로 알고 있었다.
  const ld = jsonLd(
    {
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
              <Tag>{post.category === 'portfolio' ? '시공사례' : post.category === 'downloads' ? '자료' : '자사 소식'}</Tag>
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

          {mediaUrl(post.thumbnail) ? (
            <div className="relative w-full aspect-[16/9] mt-10 bg-slate-100 overflow-hidden">
              <Image src={mediaUrl(post.thumbnail)} alt="" fill sizes="(max-width:768px) 100vw, 68ch" className="object-cover" />
            </div>
          ) : null}

          {bodyHtml ? (
            <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : null}

          {Array.isArray(post.attachments) && post.attachments.length ? (
            <section className="mt-14 pt-8 border-t border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 mb-4">첨부 파일</h2>
              <ul className="divide-y divide-slate-200 border-y border-slate-200">
                {post.attachments
                  .filter((f) => f && mediaUrl(f.url))
                  .map((f) => (
                    <li key={f.url}>
                      <a
                        href={mediaUrl(f.url)}
                        {...(/^https?:\/\//i.test(mediaUrl(f.url))
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="group flex items-center justify-between gap-4 py-4 text-sm"
                      >
                        <span className="font-medium text-slate-700 group-hover:text-gslt-700 transition-colors break-all">
                          {f.name}
                        </span>
                        <span className="shrink-0 text-xs text-slate-500 tabular-nums">
                          {typeof f.size === 'number' ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : ''}
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
