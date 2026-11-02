import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { faqFor } from '@/lib/faq';
import { NoBreak } from '@/lib/nobreak';
import { localePath } from '@/i18n/config';
import { getLocale } from '@/i18n/server';
import { common } from '@/i18n/messages/common';
import { faq } from '@/i18n/messages/faq';

/**
 * 자주 묻는 질문.
 *
 * 구 사이트 홈에 있던 5문항이 이관하면서 통째로 사라져 되살렸고, 이후 AI 답변 엔진이
 * 인용할 수 있도록 회사가 공개한 사실에서 질문을 더했다. 목록은 lib/faq.ts 한 곳에 있다 —
 * 이 화면, FAQPage 구조화 데이터, llms-full.txt가 같은 문장을 쓴다. 외국어 판은 faqFor(locale)가 꺼낸다.
 *
 * 접었다 펴는 아코디언을 쓰지 않는다. 답이 처음부터 보여야 사람도 훑어 읽고, 검색엔진과
 * AI도 본문으로 읽는다. 대신 주제별 제목(h2)으로 묶어 길이를 견딘다.
 *
 * 화면에 그릴 때만 NoBreak로 전화번호·'Wi-Fi'가 하이픈에서, '·'가 줄 첫머리에서 끊기지 않게
 * 한다. 원문(lib/faq.ts)은 구조화 데이터와 llms에도 쓰여 보이지 않는 문자를 넣지 않는다.
 */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = faq[locale];
  return pageSeo({ locale, title: t.meta.title, description: t.meta.description, path: '/faq' });
}

export default async function FaqPage() {
  const locale = await getLocale();
  const t = faq[locale];
  const groups = faqFor(locale);
  /** FAQPage 스키마 — 구글이 검색 결과에 질문을 직접 펼쳐 보여줄 수 있게 한다. 화면과 같은 언어다. */
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: groups
      .flatMap((g) => g.items)
      .map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            faqSchema,
            breadcrumbSchema([
              { name: common[locale].nav.home, path: localePath(locale, '/') },
              { name: t.title, path: localePath(locale, '/faq') },
            ]),
          ),
        }}
      />
      <Header active="" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead title={t.title} lead={t.lead} />

        {/* 괘선은 컨테이너를 가로지른다. 뉴스·자료실 목록과 같은 자다.
            예전에는 목록 전체를 68ch로 묶어, 같은 컨테이너 안에서 이 페이지만
            오른쪽 440px이 비어 보였다. 읽기 폭은 답변 문단이 따로 지킨다. */}
        {groups.map((g, gi) => (
          <section key={g.id} aria-labelledby={`faq-${g.id}`} className={gi ? 'mt-16' : ''}>
            {/* 묶음이 하나뿐이면 제목이 군더더기라 두 개 이상일 때만 단다. */}
            {groups.length > 1 && (
              <h2 id={`faq-${g.id}`} className="mb-4 text-sm font-black text-slate-500">{g.title}</h2>
            )}
            <dl className="border-t-2 border-slate-900">
              {g.items.map((f) => (
                <div key={f.q} className="border-b border-slate-200 py-7">
                  {/* 질문이 두 줄이 되면 '하나요?'만 다음 줄에 남지 않게 줄 길이를 고른다. */}
                  <dt className="text-lg md:text-xl font-black text-slate-900 break-keep text-balance leading-snug">
                    <NoBreak>{f.q}</NoBreak>
                  </dt>
                  <dd className="mt-3 max-w-[68ch] text-[15px] md:text-base text-slate-600 break-keep leading-relaxed">
                    <NoBreak>{f.a}</NoBreak>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <div className="mt-16 bg-slate-900 text-white p-8 md:p-10">
          <p className="text-xl md:text-2xl font-black break-keep">{t.cta.title}</p>
          <p className="mt-3 max-w-[62ch] text-sm md:text-base text-white/70 break-keep leading-relaxed">
            {t.cta.body}
          </p>
          <Link
            href={localePath(locale, '/contact')}
            className="mt-6 inline-flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t.cta.button}
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
