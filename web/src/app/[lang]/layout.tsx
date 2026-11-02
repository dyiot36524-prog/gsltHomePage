import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/site';
import { languageAlternates, localeUrl } from '@/lib/seo';
import { HOME_OG_TITLE, ogImage } from '@/lib/og';
import { jsonLd, localizedWebSiteSchema, organizationSchema } from '@/lib/schema';
import { FOREIGN_LOCALES, OG_LOCALE, isForeignLocale } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
import RootDocument from '@/components/RootDocument';
import '../globals.css';

/**
 * 영어·중국어·일본어 루트 레이아웃 — /en · /zh · /ja 아래 모든 주소. 서버 HTML부터 <html lang="en|zh-CN|ja">.
 *
 * 페이지는 app/(ko)/…의 같은 파일을 다시 내보낸다(app/[lang]/…/page.tsx). 화면은 i18n/server.ts의
 * getLocale()로 언어를 읽어 사전을 고른다.
 *
 * dynamicParams=false를 여기 두지 않는다. Next는 경로의 모든 조각 중 하나라도 false면 그 아래 전부를
 * '목록에 없으면 404'로 만든다(build/static-paths/app.js) — 그러면 빌드 뒤에 올린 글(/en/news/<새 글>)이
 * 다음 배포까지 404다. 대신 각 페이지 파일이 dynamicParams=false를 갖고(글 상세만 빼고),
 * 여기서는 모르는 언어를 404로 돌린다.
 */
export function generateStaticParams() {
  return FOREIGN_LOCALES.map((lang) => ({ lang }));
}

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isForeignLocale(lang)) return {};
  const t = common[lang].site;
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.name, template: t.titleTemplate },
    description: t.description,
    alternates: {
      canonical: localeUrl(lang, '/'),
      languages: languageAlternates('/'),
      types: { 'application/rss+xml': `${SITE.url}/rss.xml` },
    },
    openGraph: {
      type: 'website',
      siteName: t.name,
      locale: OG_LOCALE[lang],
      url: localeUrl(lang, '/'),
      images: [ogImage('/', `${t.name} — ${HOME_OG_TITLE}`)],
    },
    twitter: { card: 'summary_large_image' },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isForeignLocale(lang)) notFound();
  const t = common[lang].site;
  return (
    <RootDocument
      locale={lang}
      ld={jsonLd(organizationSchema, localizedWebSiteSchema(lang, t.name, t.description))}
    >
      {children}
    </RootDocument>
  );
}
