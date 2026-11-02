import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { RecordEmpty, RecordHead, RecordList, RecordRow } from '@/components/Record';
import { getPosts, isHiddenCategory, mediaUrl, postDateLabel, type Attachment, type Post } from '@/lib/posts';
import { localizePosts } from '@/lib/translate';
import { getLocale } from '@/i18n/server';
import { DEFAULT_LOCALE, localePath } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
import { records } from '@/i18n/messages/records';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = records[locale].downloads;
  return pageSeo({ locale, title: t.meta.title, description: t.meta.description, path: '/downloads' });
}

function ext(name: string) {
  const m = /\.([a-z0-9]{1,5})$/i.exec(String(name || '').trim());
  return m ? m[1].toUpperCase() : 'FILE';
}

function size(bytes?: number) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return '';
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function usable(p: Post): Attachment[] {
  return (Array.isArray(p.attachments) ? p.attachments : []).filter((f) => f && mediaUrl(f.url));
}

export default async function DownloadsPage() {
  const locale = await getLocale();
  const t = records[locale];
  const c = common[locale];
  const foreign = locale !== DEFAULT_LOCALE;
  // 관리자에서 끈 분류는 주소로 직접 들어와도 없는 페이지로 낸다. 메뉴에서만 빼면
  // 검색결과·옛 링크·RSS로 그대로 닿아 '숨김'이 숨김이 아니게 된다.
  if (await isHiddenCategory('downloads')) notFound();
  // 목록을 못 읽으면 던진다. 예전에는 '불러오지 못했습니다' 화면을 200으로 냈는데, 그 화면이
  // 캐시돼 1분간 모두에게 나가고 검색엔진은 '내용이 빈 정상 페이지'로 수집한다(네이버 HTTP 규약
  // 가이드: 서버 오류는 5xx). 던지면 ISR은 직전에 만든 정상 페이지를 계속 내보낸다.
  const posts = await getPosts('downloads');
  // 외국어 화면은 제목·요약·파일 이름을 AI 번역으로 그린다(lib/translate.ts). 한국어는 그대로 돌아온다.
  const items = await localizePosts(posts, locale);

  // 자료실의 단위는 '글'이 아니라 '파일'이다. 파일 단위로 펼쳐 한 행 = 한 다운로드가 되게 한다.
  // 번역은 첨부 순서를 지키므로 원문 파일(src)과 화면 파일(file)이 같은 자리끼리 짝이다.
  const rows = items.flatMap(({ post, status }, n) => {
    const files = usable(post);
    if (!files.length) return [];
    const src = usable(posts[n]);
    return files.map((f, i) => ({ post, status, file: f, src: src[i] ?? f, original: posts[n], first: i === 0, total: files.length }));
  });

  return (
    <>
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: c.nav.home, path: localePath(locale, '/') },
              { name: t.downloads.title, path: localePath(locale, '/downloads') },
            ]),
          ),
        }}
      />
      <Header active="downloads" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title={t.downloads.title}
          lead={t.downloads.lead}
          count={rows.length}
          totalTemplate={t.downloads.total}
        />

        {rows.length === 0 ? (
          <RecordEmpty
            columns={t.downloads.columns}
            title={t.downloads.empty.title}
            body={t.downloads.empty.body}
            action={
              <Link
                href={localePath(locale, '/contact')}
                className="inline-flex items-center bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors"
              >
                {t.downloads.empty.action}
              </Link>
            }
          />
        ) : (
          <>
            <RecordHead columns={t.downloads.columns} />
            <RecordList>
              {rows.map(({ post, status, file, src, original, first, total }) => (
                <RecordRow
                  key={`${post.id}-${file.url}`}
                  href={mediaUrl(file.url)}
                  external={/^https?:\/\//i.test(mediaUrl(file.url))}
                  action="download"
                  date={first ? postDateLabel(post) : ''}
                  dateLocale={foreign ? locale : undefined}
                  // 형식은 원래 파일 이름에서 읽는다 — 번역이 확장자를 바꿔도 표시가 흔들리지 않게.
                  mark={ext(src.name)}
                  markTone="file"
                  title={file.name || post.title}
                  // 내려받기 집계는 언어와 상관없이 같은 자료로 센다.
                  trackLabel={foreign ? src.name || original.title : undefined}
                  excerpt={first ? post.excerpt : undefined}
                  note={
                    first && status === 'translated'
                      ? t.translation.ai
                      : first && status === 'original'
                        ? t.translation.original
                        : undefined
                  }
                  textLang={status === 'original' ? 'ko' : undefined}
                  meta={
                    <p className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 tabular-nums">
                      {size(file.size) ? <span>{size(file.size)}</span> : null}
                      {total > 1 ? <span>{post.title}</span> : null}
                    </p>
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
