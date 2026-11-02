import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from '@/components/Icon';
import { COMPANY } from '@/lib/site';
import { localePath } from '@/i18n/config';
import { getLocale } from '@/i18n/server';
import { common, solutionsFor, telHref } from '@/i18n/messages/common';
import { contact } from '@/i18n/messages/contact';

/**
 * 상담 신청 완료.
 *
 * 전에는 폼을 비우고 그 자리에 두 줄짜리 상태 문구를 띄웠다. 방문자는 방금 채운 폼이
 * 텅 빈 채 그대로 있고 아래에 작은 글씨만 바뀐 화면을 본다 — **보냈는지 확신이 안 서고,
 * 다음에 뭘 해야 하는지도 없다.** 실제로 대표님이 "현재 페이지에 남아 있으니 이상하다"고
 * 지적한 지점이다.
 *
 * 그래서 페이지를 옮긴다. 이 페이지가 하는 일은 셋이다: ① 접수됐다고 분명히 말한다
 * ② 다음에 무슨 일이 일어나는지 알린다(누가, 언제) ③ 갈 곳을 준다.
 *
 * 검색엔진에는 내보내지 않는다. 폼을 거치지 않고 도착하는 사람에게는 의미가 없는 화면이다.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: contact[locale].done.meta.title,
    robots: { index: false, follow: true },
    // 색인하지 않는 페이지가 홈을 정본으로 가리키면 신호가 엇갈린다. 레이아웃 값을 지운다.
    alternates: { canonical: null },
  };
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-700';

export default async function ContactDonePage() {
  const locale = await getLocale();
  const t = contact[locale].done;
  const tel = common[locale].company.tel;
  return (
    <>
      <Header active="" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 md:pt-24 pb-24 md:pb-32 max-w-3xl">
          {/* 완료 표시. 큰 초록 체크 아이콘 대신 굵은 괘선 위에 결론을 한 줄로 세운다 —
              이 페이지가 속한 기록 면의 문법이다. */}
          <p className="border-t-2 border-slate-900 pt-6 text-[11px] font-bold tracking-[0.14em] text-slate-600">
            {t.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight leading-tight break-keep text-slate-900">
            {t.title[0]}<br />{t.title[1]}
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed break-keep max-w-[54ch]">{t.lead}</p>

          <section aria-labelledby="done-next" className="mt-14">
            <h2
              id="done-next"
              className="border-b-2 border-slate-900 pb-3 text-[11px] font-bold tracking-[0.14em] text-slate-600"
            >
              {t.next.heading}
            </h2>
            {/* 신청 이후의 실제 순서. 도입 문의의 다섯 단계 중 첫 칸에 서 있다. */}
            <ol className="divide-y divide-slate-200 border-b border-slate-200">
              {t.next.items.map((s, n) => (
                <li key={s.when} className="grid gap-1 py-5 sm:grid-cols-[2rem_10rem_1fr] sm:gap-4">
                  <span className="text-sm font-bold tabular-nums text-slate-500">
                    {String(n + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{s.when}</span>
                  <span className="text-sm text-slate-600 leading-relaxed break-keep">{s.what}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 급한 사람을 위한 길. 24시간이 길게 느껴지는 경우가 있다. */}
          <p className="mt-8 text-sm text-slate-600 break-keep">
            {t.urgent.before}
            <a
              href={telHref(locale, `tel:${COMPANY.tel.replace(/-/g, '')}`)}
              className={`font-bold text-gslt-700 underline underline-offset-4 decoration-gslt-200 hover:decoration-gslt-500 transition-colors ${FOCUS}`}
            >
              {tel}
            </a>
            {t.urgent.after}
          </p>

          <div className="mt-14 flex flex-wrap gap-3">
            <Link
              href={localePath(locale, '/')}
              className={`group inline-flex items-center gap-2 bg-gslt-500 px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:bg-gslt-400 ${FOCUS}`}
            >
              {t.home}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={localePath(locale, '/about')}
              className={`inline-flex items-center border border-slate-300 px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:border-slate-900 ${FOCUS}`}
            >
              {t.about}
            </Link>
          </div>

          {/* 기다리는 동안 볼 것. 상담이 오기 전에 제품을 알고 있으면 첫 통화가 달라진다. */}
          <section aria-labelledby="done-more" className="mt-20">
            <h2
              id="done-more"
              className="border-b-2 border-slate-900 pb-3 text-[11px] font-bold tracking-[0.14em] text-slate-600"
            >
              {t.more}
            </h2>
            <ul className="divide-y divide-slate-200 border-b border-slate-200">
              {solutionsFor(locale).map((s) => (
                <li key={s.href}>
                  <Link
                    href={localePath(locale, s.href)}
                    className={`group flex items-baseline justify-between gap-6 py-5 transition-colors hover:text-gslt-700 ${FOCUS}`}
                  >
                    <span className="min-w-0">
                      <span className="font-bold text-slate-900 group-hover:text-gslt-700 transition-colors">
                        {s.name}
                        {/* 외국어 판은 이름이 곧 영문 이름이라 두 번 쓰지 않는다. */}
                        {s.en === s.name ? null : (
                          <span className="ml-2 text-xs font-medium text-slate-500">{s.en}</span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-600 break-keep">{s.desc}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-gslt-700" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
