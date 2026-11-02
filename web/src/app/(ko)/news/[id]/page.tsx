import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tag } from '@/components/Record';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download } from '@/components/Icon';
import { renderMarkdown } from '@/lib/markdown';
import { bindLastWords, NoBreak, noBreakHtml } from '@/lib/nobreak';
import {
  getAllPosts, getPost, getPosts, hasBody, isHiddenCategory, isPress, mediaUrl, postDateText,
  postMirrors, postTime, safeHttpUrl, type Post,
} from '@/lib/posts';
import { localizePost, localizePosts, localizeTags } from '@/lib/translate';
import { SITE } from '@/lib/site';
import { ogImage } from '@/lib/og';
import { languageAlternates, localeUrl } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { getLocale } from '@/i18n/server';
import { DEFAULT_LOCALE, HTML_LANG, OG_LOCALE, fmt, localePath, type Locale } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
import { records } from '@/i18n/messages/records';

type Params = { params: Promise<{ id: string }> };

/**
 * 글 지면을 캐시(ISR)한다.
 *
 * generateStaticParams가 없으면 이 경로는 요청마다 함수가 그리는 페이지(ƒ)였다 — 수집기가 글을 하나
 * 들를 때마다 HTML 전체가 함수에서 CDN으로 다시 넘어갔고, 2026-10-23 Vercel 무료 한도(함수→CDN
 * 전송 월 10GB) 초과로 사이트가 멈춘 원인 중 하나다. 배포 때 발행 글을 전부 미리 그려 두고,
 * 그 뒤에 올린 글은 첫 방문 때 그려 캐시한다(dynamicParams). 고치거나 지우면 관리자 화면이 부르는
 * /api/indexnow가 사이트 캐시를 비운다. 없는 글은 404로 캐시된다.
 *
 * 목록을 못 읽으면 빈 배열 — 빌드를 막지 않고, 모든 글을 첫 방문 때 그리는 것으로 물러선다.
 *
 * 영어·중국어·일본어 판(app/[lang]/news/[id])이 이 파일을 다시 내보낸다. 글은 관리자가 한국어로 쓰므로
 * 외국어 판은 lib/translate.ts의 AI 번역으로 그린다. 번역하지 못하면 한국어 원문에 그 사실을 적어 낸다.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getAllPosts()).map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const locale = await getLocale();
  const t = records[locale].post;
  const source = await getPost(id);
  // 없는 글은 404다. robots를 직접 적는 이유는 not-found.tsx와 같다(빼면 레이아웃의 index를 물려받는다).
  // canonical은 레이아웃의 홈 주소를 물려받지 않게 지운다 — 404가 홈을 정본이라 주장하면 안 된다.
  if (!source || (await isHiddenCategory(source.category)))
    return { title: t.notFound, robots: { index: false, follow: true }, alternates: { canonical: null } };
  // 화면과 같은 번역을 쓴다(같은 렌더에서는 호출이 한 번이다).
  const { post, status } = await localizePost(source, locale);
  const path = `/news/${id}`;
  const url = localePath(locale, path);
  const description = describe(post, locale);
  const thumbnail = mediaUrl(post.thumbnail);
  // 한국어 제목 틀은 ' | 지에스엘티', 외국어는 ' | GSLT'다(i18n common site.titleTemplate).
  const brand = locale === DEFAULT_LOCALE ? SITE.titleBrand : common[locale].site.name;
  // 본문 없이 파일만 있는 자료실 항목은 색인하지 않는다(sitemap·RSS에서도 뺐다).
  // 관리자에서 요약 본문을 쓰면 그때부터 색인된다. 외국어 판이 번역을 못 해 한국어 원문을 낸 동안에도
  // 색인하지 않는다 — 한국어 지면과 같은 글이 다른 주소로 한 벌 더 잡힌다.
  const noindex = !hasBody(source) || status === 'original';
  return {
    // 글 제목에 이미 상호가 있으면 틀(' | 지에스엘티')을 붙이지 않는다 — 같은 말을 두 번 쓰지
    // 말라는 것이 네이버 콘텐츠 마크업 가이드다. 보도 제목은 대개 '지에스엘티, …'로 시작한다.
    title: post.title.includes(brand) ? { absolute: post.title } : post.title,
    description,
    // languages는 같은 글의 다른 언어 판(hreflang). 글마다 네 언어 주소가 모두 있다.
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
      types: { 'application/rss+xml': `${SITE.url}/rss.xml` },
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'article',
      siteName: common[locale].site.name,
      locale: OG_LOCALE[locale],
      url,
      description,
      // 대표 사진이 있으면 사진을, 없으면 글 제목이 들어간 그림을 쓴다(lib/og.ts).
      // 수상 카드·인증서 같은 사진이 제목 글자보다 많은 것을 말한다.
      // 제목 그림은 한글·영문 글꼴로만 그린다 — 외국어 판은 글자 없는 홈 그림(로고)을 쓴다.
      images: [
        thumbnail
          ? { url: thumbnail, alt: fmt(t.imageAlt, { title: post.title }) }
          : ogImage(locale === DEFAULT_LOCALE ? path : '/', post.title),
      ],
    },
  };
}

/**
 * 검색 결과 설명. 관리자가 쓴 요약이 있으면 그것을, 없으면 본문 첫머리를 쓴다.
 * 둘 다 없을 때 제목을 그대로 쓰면 '설명 = 제목'이 되는데, 네이버는 이를 불이익 대상으로 본다.
 */
function describe(post: Post, locale: Locale): string {
  const excerpt = (post.excerpt || '').trim();
  if (excerpt) return excerpt;
  const plain = String(post.body || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // 85자는 한글 기준 검색 결과 폭(lib/seo-limits.json)이다. 영어는 같은 폭에 글자가 두 배쯤 들어간다.
  const max = locale === 'en' ? 155 : 85;
  if (plain) return plain.length > max ? plain.slice(0, max - 1).trimEnd() + '…' : plain;
  const t = records[locale].post;
  const category = (t.category as Record<string, string>)[post.category] ?? t.categoryFallback;
  return fmt(t.describe, { title: post.title, site: common[locale].site.name, category });
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
  const locale = await getLocale();
  const t = records[locale];
  const c = common[locale];
  const foreign = locale !== DEFAULT_LOCALE;
  const source = await getPost(id);
  if (!source) notFound();

  // 분류를 끄면 그 분류의 글도 공개되지 않는다. 목록만 막고 상세를 열어 두면
  // 검색결과에 남은 링크로 그대로 읽힌다.
  if (await isHiddenCategory(source.category)) notFound();

  const all = await getPosts(source.category).catch(() => [] as Post[]);
  const near = neighbours(all, id);
  // 외국어 판은 글과 이전·다음 제목, 태그를 AI 번역으로 그린다. 이전·다음은 목록 페이지와 같은 칸만 옮겨
  // 목록이 만든 번역을 그대로 꺼낸다. 태그는 분류 전체를 한 묶음으로 옮겨 목록 필터와 같은 말이 된다.
  // 태그가 없는 글은 태그 번역을 부르지 않는다 — 그 번역이 실패해 이 지면의 캐시 수명까지 줄이지 않게.
  const hasTags = Array.isArray(source.tags) && source.tags.some((tag) => String(tag).trim());
  const [{ post, status }, around, tagNames] = await Promise.all([
    localizePost(source, locale),
    localizePosts([near.prev, near.next].filter((p): p is Post => p !== null), locale),
    hasTags
      ? localizeTags(
          [...all, source].flatMap((p) => (Array.isArray(p.tags) ? p.tags : [])),
          locale,
        )
      : new Map<string, string>(),
  ]);
  const prev = near.prev ? around[0] : null;
  const next = near.next ? around[near.prev ? 1 : 0] : null;
  const tagLabel = (tag: string) => {
    const k = String(tag).trim();
    const v = tagNames.get(k);
    return v && v !== k ? v : tag;
  };
  // 번역하지 못해 한국어 원문을 그린 칸은 lang="ko"를 단다 — 스크린리더가 그 언어로 읽는다.
  const textLang = status === 'original' ? 'ko' : undefined;

  // 언론보도도 우리 지면을 갖는다. 예전에는 원문으로 바로 넘겼는데, 그러면 이 회사를
  // 다룬 기사 4건이 검색에서 우리 주소로는 전혀 잡히지 않았다(sitemap·RSS도 뺄 수밖에 없었다).
  // 기사 본문과 사진은 우리 것이 아니므로 가져오지 않는다. 제목·우리가 쓴 요약·매체·기자·
  // 일자와 원문 링크만으로 지면을 만든다.
  const press = isPress(post);
  const sourceUrl = press ? safeHttpUrl(post.sourceUrl) : '';
  const mirrors = postMirrors(post);

  // 값이 있는 항목만 행이 된다. 빈 칸에 '-'를 채우지 않는 것이 이 기록부의 규칙이다.
  const sourceRows: SourceRow[] = press
    ? ([
        post.outlet ? { label: t.post.source.outlet, value: <span className="font-bold">{post.outlet}</span> } : null,
        post.reporter ? { label: t.post.source.reporter, value: fmt(t.post.reporterValue, { name: post.reporter }) } : null,
        mirrors.length
          ? {
              label: t.post.source.mirrors,
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

  const backTo =
    post.category === 'portfolio' ? { href: '/portfolio', label: t.post.back.portfolio }
    : post.category === 'downloads' ? { href: '/downloads', label: t.post.back.downloads }
    : { href: '/news', label: t.post.back.news };

  // 주소를 하드코딩하지 않는다. 구 도메인(home.gslt.kr)이 박혀 있어 검색엔진이
  // 정리될 주소를 이 글의 정본으로 알고 있었다.
  const path = `/news/${id}`;
  const pageUrl = localeUrl(locale, path);
  // 이 지면의 글이 실제로 쓰인 언어. 번역하지 못했으면 한국어다.
  const inLanguage = status === 'translated' ? HTML_LANG[locale] : 'ko-KR';
  // 번역 판은 한국어 원문 지면을 가리킨다 — 같은 글이 어느 글의 번역인지 기계가 읽는다.
  const translationOf =
    status === 'translated'
      ? { translationOfWork: { '@type': 'CreativeWork', url: localeUrl(DEFAULT_LOCALE, path), inLanguage: 'ko-KR' } }
      : {};
  const ld = jsonLd(
    press
      ? {
          // 이 지면은 '기사를 소개하는 페이지'다. 기사 자체의 저자·발행처는 언론사이고
          // 우리가 쓴 것은 요약뿐이라, 저자를 우리로 주장하면 사실과 다르다.
          '@type': 'WebPage',
          name: post.title,
          description: post.excerpt || post.title,
          inLanguage,
          url: pageUrl,
          publisher: { '@id': `${SITE.url}/#organization` },
          ...translationOf,
          mainEntity: {
            '@type': 'NewsArticle',
            // 기사 제목은 언론사가 붙인 한국어 제목 그대로다(번역 판도 기사 자체는 한국어 기사다).
            headline: source.title,
            ...(foreign ? { inLanguage: 'ko-KR' } : {}),
            ...(sourceUrl ? { url: sourceUrl } : {}),
            ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
            // 매체·기자도 기사에 실린 원래 이름이다. 화면의 이름은 번역 판에서 로마자 등으로 옮겨진다.
            ...(source.outlet ? { publisher: { '@type': 'Organization', name: source.outlet } } : {}),
            ...(source.reporter ? { author: { '@type': 'Person', name: source.reporter } } : {}),
            about: { '@id': `${SITE.url}/#organization` },
          },
        }
      : {
      '@type': post.category === 'news' ? 'NewsArticle' : 'Article',
      headline: post.title,
      description: post.excerpt || post.title,
      datePublished: post.createdAt instanceof Date ? post.createdAt.toISOString() : undefined,
      dateModified: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : undefined,
      inLanguage,
      author: { '@id': `${SITE.url}/#organization` },
      publisher: { '@id': `${SITE.url}/#organization` },
      mainEntityOfPage: pageUrl,
      url: pageUrl,
      ...(mediaUrl(post.thumbnail) ? { image: [mediaUrl(post.thumbnail)] } : {}),
      ...translationOf,
        },
    breadcrumbSchema([
      { name: c.nav.home, path: localePath(locale, '/') },
      { name: backTo.label, path: localePath(locale, backTo.href) },
      { name: post.title, path: localePath(locale, path) },
    ]),
  );

  return (
    <>
      <Header active={post.category === 'portfolio' ? 'portfolio' : post.category === 'downloads' ? 'downloads' : 'news'} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />

        <div className="pt-10 md:pt-14">
          <Link
            href={localePath(locale, backTo.href)}
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-gslt-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {backTo.label}
          </Link>
        </div>

        <article className="max-w-[68ch] pt-8 md:pt-12">
          <header className="pb-8 border-b-2 border-slate-900">
            <div className="flex items-center gap-3 mb-5 tabular-nums">
              <Tag>{press ? t.post.kind.press : post.category === 'portfolio' ? t.post.kind.portfolio : post.category === 'downloads' ? t.post.kind.downloads : t.post.kind.article}</Tag>
              <span className="text-sm text-slate-500">{postDateText(post, locale)}</span>
              {typeof post.views === 'number' && post.views > 0 ? (
                <span className="text-sm text-slate-500">{fmt(t.post.views, { n: post.views })}</span>
              ) : null}
            </div>
            {/* 제목·요약은 화면에서만 NoBreak로 그린다 — 원문은 위 메타 설명·JSON-LD에 그대로 쓰인다.
                text-balance: 제목이 휴대폰 폭(280~430px)에서 '출원'·'획득'·'소개' 한 단어만 마지막 줄에
                남겼다. 요약은 문단이라 text-pretty로 마지막 줄 한 어절만 피한다. */}
            <h1
              lang={textLang}
              className="text-3xl md:text-[2.6rem] font-black tracking-tight leading-[1.2] break-keep text-balance text-slate-900"
            >
              <NoBreak>{post.title}</NoBreak>
            </h1>
            {post.excerpt ? (
              <p lang={textLang} className="mt-5 text-lg text-slate-500 leading-relaxed break-keep text-pretty">
                <NoBreak>{bindLastWords(post.excerpt, 14)}</NoBreak>
              </p>
            ) : null}
            {press && post.excerpt && !bodyHtml ? (
              <p className="mt-3 text-xs text-slate-500">{t.post.pressSummary}</p>
            ) : null}
            {Array.isArray(post.tags) && post.tags.length ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="text-xs font-medium text-slate-500 border border-slate-200 px-2.5 py-1">
                    {tagLabel(tag)}
                  </li>
                ))}
              </ul>
            ) : null}
            {/* 외국어 판에만 — 관리자가 한국어로 쓴 글을 AI가 옮겼는지, 원문 그대로인지 알린다. */}
            {foreign ? (
              <p className="mt-6 text-xs text-slate-500">
                {status === 'translated' ? t.translation.ai : t.translation.original}
              </p>
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
              // 대표 이미지는 수상 카드·인증서처럼 글자가 든 그래픽이 많다. 빈 alt면 그 내용이
              // 검색엔진과 스크린리더에서 통째로 사라진다. 글이 다루는 내용으로 이름을 붙인다.
              alt={fmt(t.post.imageAlt, { title: post.title })}
              loading="lazy"
              decoding="async"
              className="mt-10 w-full h-auto bg-slate-100"
            />
          ) : null}

          {/* 본문도 그릴 때만 NoBreak 규칙을 입힌다(noBreakHtml) — 'Z-/Wave'·'제10-/2659230호'가
              하이픈 뒤에서 갈리고 '·'가 줄 첫머리로 내려가던 자리다. */}
          {bodyHtml ? (
            <div lang={textLang} className="post-body mt-10" dangerouslySetInnerHTML={{ __html: noBreakHtml(bodyHtml) }} />
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
                    <dd lang={textLang} className="text-slate-900 break-keep">{row.value}</dd>
                  </div>
                ))}
              </dl>

              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3.5 text-sm font-bold transition-colors"
                >
                  {post.outlet ? fmt(t.post.originalAt, { outlet: post.outlet }) : t.post.original}
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : null}
              <p className="mt-4 text-sm text-slate-500 break-keep">
                {t.post.pressRights}
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
                        <span
                          lang={textLang}
                          className="min-w-0 flex-1 font-bold text-slate-900 group-hover:text-gslt-700 transition-colors break-all"
                        >
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
          <nav className="max-w-[68ch] mt-20 border-t-2 border-slate-900" aria-label={t.post.nav}>
            <ul className="divide-y divide-slate-200">
              {prev && (
                <li>
                  <Link href={localePath(locale, `/news/${prev.post.id}`)} className="group flex items-center gap-4 py-6">
                    <ArrowLeft className="w-4 h-4 shrink-0 text-slate-500 transition-all duration-300 group-hover:text-gslt-600 group-hover:-translate-x-0.5" />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold tracking-[0.14em] text-slate-500 mb-1">{t.post.prev}</span>
                      <span
                        lang={prev.status === 'original' ? 'ko' : undefined}
                        className="block font-bold text-slate-900 break-keep group-hover:text-gslt-700 transition-colors line-clamp-1"
                      >
                        {prev.post.title}
                      </span>
                    </span>
                  </Link>
                </li>
              )}
              {next && (
                <li>
                  <Link href={localePath(locale, `/news/${next.post.id}`)} className="group flex items-center justify-end gap-4 py-6 text-right">
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold tracking-[0.14em] text-slate-500 mb-1">{t.post.next}</span>
                      <span
                        lang={next.status === 'original' ? 'ko' : undefined}
                        className="block font-bold text-slate-900 break-keep group-hover:text-gslt-700 transition-colors line-clamp-1"
                      >
                        {next.post.title}
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
            {t.post.cta.title}
          </p>
          <p className="text-white/60 break-keep mb-7">
            {t.post.cta.body}
          </p>
          <Link
            href={localePath(locale, '/contact')}
            className="group inline-flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors"
          >
            {t.post.cta.action}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </aside>
      </main>
      <Footer />
    </>
  );
}
