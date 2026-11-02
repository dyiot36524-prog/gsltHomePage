import type { Metadata } from 'next';
import { Fragment } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { COMPANY } from '@/lib/site';
import { NoBreak } from '@/lib/nobreak';
import { pageSeo } from '@/lib/seo';
import { getLocale } from '@/i18n/server';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { common, telHref } from '@/i18n/messages/common';
import { legal } from '@/i18n/messages/legal';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = legal[locale].terms.meta;
  const seo = pageSeo({ locale, title: t.title, description: t.description, path: '/legal/terms' });
  // 공유 카드 설명은 검색 설명과 따로 쓴 짧은 문장이다(다국어 전부터). 트위터 카드도 전처럼 이 문장을 쓴다.
  return {
    ...seo,
    openGraph: { ...seo.openGraph, description: t.ogDescription },
    twitter: { card: 'summary_large_image', description: t.ogDescription },
  };
}

export default async function TermsPage() {
  const locale = await getLocale();
  const all = legal[locale];
  const t = all.terms;
  // 한국어는 전처럼 site.ts의 회사 번호를 그대로 쓴다. 외국어는 국가 번호를 붙인 표기(+82 …)다.
  const tel = locale === DEFAULT_LOCALE ? COMPANY.tel : common[locale].company.tel;

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead title={t.meta.title} lead={t.lead} />

        <article className="max-w-[68ch]">
          {/* 외국어 판은 참고용 번역이다 — 어긋나면 한국어 원문이 우선한다는 것을 본문보다 먼저 알린다(대표 결정). */}
          {locale !== DEFAULT_LOCALE ? (
            <p
              role="note"
              className="mb-8 border-l-2 border-gslt-500 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 break-keep"
            >
              {all.notice.text}{' '}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 한국어 판은 루트 레이아웃이 달라 어차피 문서를 새로 받는다(LanguageMenu와 같다) */}
              <a
                href="/legal/terms"
                hrefLang="ko"
                className="font-semibold text-gslt-700 underline underline-offset-2 hover:text-slate-900 transition-colors"
              >
                {all.notice.link}
              </a>
            </p>
          ) : null}

          {/* 시행일은 약관의 효력 범위를 정하는 값이라 본문보다 먼저 온다. 2px 먹선이 문서의 위를 닫는다. */}
          <p className="border-t-2 border-slate-900 pt-4 text-sm text-slate-500 tabular-nums">{t.updated}</p>

          <div className="post-body mt-10">
            {t.articles.map((a) => (
              <Fragment key={a.title}>
                <h2>{a.title}</h2>
                <p>{a.body}</p>
              </Fragment>
            ))}
          </div>

          {/* 원본의 회색(2.56:1) 대신 slate-500(4.76:1) — 연락처는 장식이 아니라 조문의 일부다.
              휴대폰 폭에서 '·'가 줄 첫머리에 오지 않고, 'Tel.'과 번호는 한 덩어리라 번호가
              하이픈에서 갈리거나 'Tel.'만 줄 끝에 남지 않는다. */}
          <p className="mt-14 pt-6 border-t border-slate-200 text-xs text-slate-500 tabular-nums break-keep">
            {t.contact}
            <a
              href={`mailto:${COMPANY.email}`}
              className="underline underline-offset-2 decoration-slate-300 hover:text-gslt-700 transition-colors"
            >
              {COMPANY.email}
            </a>
            <NoBreak>{' · '}</NoBreak>
            <span className="whitespace-nowrap">
              {t.tel}{' '}
              <a
                href={telHref(locale, `tel:${COMPANY.tel}`)}
                className="underline underline-offset-2 decoration-slate-300 hover:text-gslt-700 transition-colors"
              >
                {tel}
              </a>
            </span>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
