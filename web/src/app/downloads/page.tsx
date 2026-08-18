import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { RecordEmpty, RecordHead, RecordList, RecordRow } from '@/components/Record';
import { getPosts, isHiddenCategory, mediaUrl, postDateLabel, type Attachment, type Post } from '@/lib/posts';

export const metadata: Metadata = {
  title: '자료실',
  description: '회사소개서·제품 자료를 내려받을 수 있습니다.',
  alternates: { canonical: '/downloads' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    locale: 'ko_KR',
    url: '/downloads',
    title: '자료실 | GSLT',
    description: '회사소개서·제품 자료를 내려받을 수 있습니다.',
    images: ['/img/og-image.png'],
  },
};

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
  // 관리자에서 끈 분류는 주소로 직접 들어와도 없는 페이지로 낸다. 메뉴에서만 빼면
  // 검색결과·옛 링크·RSS로 그대로 닿아 '숨김'이 숨김이 아니게 된다.
  if (await isHiddenCategory('downloads')) notFound();
  let posts: Post[] = [];
  let failed = false;
  try {
    posts = await getPosts('downloads');
  } catch {
    failed = true;
  }

  // 자료실의 단위는 '글'이 아니라 '파일'이다. 파일 단위로 펼쳐 한 행 = 한 다운로드가 되게 한다.
  const rows = posts.flatMap((p) => {
    const files = usable(p);
    if (!files.length) return [];
    return files.map((f, i) => ({ post: p, file: f, first: i === 0, total: files.length }));
  });

  return (
    <>
      <Header active="downloads" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="자료실"
          lead="회사소개서와 제품 자료입니다. 클릭하면 바로 내려받습니다."
          count={rows.length}
          countLabel="개 파일"
        />

        {failed ? (
          <RecordEmpty
            title="목록을 불러오지 못했습니다"
            body="일시적인 문제일 수 있습니다. 잠시 후 새로고침해 주세요."
          />
        ) : rows.length === 0 ? (
          <RecordEmpty
            columns={['일자', '형식', '자료']}
            title="아직 공개된 자료가 없습니다"
            body="필요한 자료가 있으시면 문의 주세요. 바로 보내드리겠습니다."
            action={
              <Link
                href="/contact"
                className="inline-flex items-center bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors"
              >
                자료 요청하기
              </Link>
            }
          />
        ) : (
          <>
            <RecordHead columns={['일자', '형식', '자료']} />
            <RecordList>
              {rows.map(({ post, file, first, total }) => (
                <RecordRow
                  key={`${post.id}-${file.url}`}
                  href={mediaUrl(file.url)}
                  external={/^https?:\/\//i.test(mediaUrl(file.url))}
                  action="download"
                  date={first ? postDateLabel(post) : ''}
                  mark={ext(file.name)}
                  markTone="file"
                  title={file.name || post.title}
                  excerpt={first ? post.excerpt : undefined}
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
