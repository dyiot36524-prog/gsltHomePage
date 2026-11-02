import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import KakaoChatLink from '@/components/KakaoChatLink';
import { NoBreak } from '@/lib/nobreak';
import { COMPANY, KAKAO } from '@/lib/site';
import { fmt, localePath } from '@/i18n/config';
import { getLocale } from '@/i18n/server';
import { common, telHref } from '@/i18n/messages/common';
import { contact } from '@/i18n/messages/contact';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = contact[locale];
  return pageSeo({ locale, title: t.meta.title, description: t.meta.description, path: '/contact' });
}

/** 이메일 주소는 @ 뒤에서만 줄을 바꾼다(<wbr/>). break-all은 320px에서 'gs707810 / 3107@…'처럼 잘랐다. */
const [EMAIL_USER, EMAIL_DOMAIN] = COMPANY.email.split('@');

/**
 * 두 열의 머리. 기록부의 표머리(RecordHead)와 같은 역할이라 같은 라벨 문법을 쓰되,
 * 표머리와 달리 모바일에서도 남는다 — 여기서는 열 이름이 아니라 구획의 제목이기 때문이다.
 */
function ColumnHead({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="border-b-2 border-slate-900 pb-3 text-[11px] font-bold tracking-[0.14em] text-slate-600"
    >
      {children}
    </h2>
  );
}

/**
 * 두 갈래 문의의 머리. 번호는 순서가 아니라 고를 수 있는 길의 이름이라 낭독에서는 뺀다.
 * scroll-margin은 고정 헤더 높이만큼 — 주소의 #으로 바로 와도 머리가 헤더에 가리지 않는다.
 */
function StepHead({ id, n, children }: { id: string; n: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-32 lg:scroll-mt-24 flex items-baseline gap-3 border-b-2 border-slate-900 pb-3 text-xl md:text-2xl font-black tracking-tight text-slate-900 break-keep"
    >
      <span className="text-sm font-black tabular-nums text-gslt-700" aria-hidden="true">
        {n}
      </span>
      {children}
    </h2>
  );
}

function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-6">
      <dt className="text-[11px] font-bold tracking-[0.14em] text-slate-500 mb-2">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = contact[locale];
  const c = common[locale];
  // 보이는 번호는 그 언어의 표기(외국어는 +82-…), 거는 번호(tel:)는 그대로다.
  const tel = c.company.tel;
  return (
    <>
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: c.nav.home, path: localePath(locale, '/') },
              { name: t.title, path: localePath(locale, '/contact') },
            ]),
          ),
        }}
      />
      <Header active="" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead title={t.title} lead={t.lead} />

        {/* 문의는 두 갈래다 — ① 지금 바로 묻는 카카오톡, ② 내용을 정리해 남기는 이메일(상담 신청서).
            휴대폰에서는 ①이 첫 화면에 오고 ②가 이어진다. 둘 다 서버에서 그려져 JS 없이도 선다. */}
        <div className="grid gap-x-16 gap-y-16 lg:grid-cols-[22rem_1fr]">
          <section aria-labelledby="contact-kakao">
            <StepHead id="contact-kakao" n="01">
              {t.kakao.heading}
            </StepHead>
            <p className="mt-5 text-[15px] text-slate-600 leading-relaxed break-keep">{t.kakao.body}</p>
            {/* 모바일은 카카오톡 앱이 바로 열리고, PC는 카카오 로그인을 거쳐 카카오톡에서 이어진다 —
                그 차이를 보조 문구가 미리 말한다. 채널 이름을 적어 두면 링크가 막힌 인앱 브라우저에서도
                카카오톡 검색으로 찾을 수 있다. 보조 문구는 NoBreak로 그려 가운뎃점이 줄 첫머리에 오지 않게 한다. */}
            <div className="mt-6">
              <KakaoChatLink place="contact" describedBy="contact-kakao-note" newWindow={c.header.newWindow}>
                {t.kakao.button}
              </KakaoChatLink>
              <p id="contact-kakao-note" className="mt-3 text-sm text-slate-500 leading-relaxed break-keep">
                {/* 채널 이름은 한글 상호 '(주)지에스엘티'뿐이다. 외국어 판은 없는 영문 채널명을 지어내지 않고
                    'GSLT의 카카오톡 채널'로 적는다. */}
                <NoBreak>
                  {fmt(t.kakao.note, { name: locale === 'ko' ? KAKAO.name : c.company.name })}
                </NoBreak>
              </p>
            </div>
            {/* 전화번호는 하이픈에서 끊기지 않게 통째로 넘긴다. */}
            <p className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-600 break-keep">
              {t.kakao.phone}
              <a
                href={telHref(locale, `tel:${COMPANY.tel.replace(/-/g, '')}`)}
                className="whitespace-nowrap text-lg font-black tracking-tight tabular-nums text-slate-900 transition-colors hover:text-gslt-700"
              >
                {tel}
              </a>
            </p>
          </section>

          {/* 장면 페이지의 '쇼룸 시연 신청'은 이 머리(#contact-email)로 바로 온다. */}
          <section aria-labelledby="contact-email">
            <StepHead id="contact-email" n="02">
              {t.email.heading}
            </StepHead>
            <p className="mt-5 text-[15px] text-slate-600 leading-relaxed break-keep">
              {t.email.before}
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-bold text-slate-900 underline underline-offset-4 decoration-slate-300 transition-colors hover:text-gslt-700"
              >
                {EMAIL_USER}@<wbr />{EMAIL_DOMAIN}
              </a>
              {t.email.after}
            </p>
            {/* 폼은 브라우저 컴포넌트라 이 언어의 글자 조각만 넘긴다(네 언어 사전을 번들에 싣지 않는다). */}
            <ContactForm locale={locale} t={t.form} tel={tel} sceneNames={c.scenes} />
          </section>
        </div>

        {/* 문의 다음에 알면 좋은 것 — 찾아오는 곳과 진행 순서. 두 갈래 선택을 흐리지 않게 아래로 뺀다. */}
        <section aria-labelledby="contact-more" className="mt-20">
          <ColumnHead id="contact-more">{t.more.heading}</ColumnHead>
          <dl className="grid md:grid-cols-2 md:gap-x-16 border-b border-slate-200">
            {/* 주소 끝 '3차 501호'는 한 덩어리로 넘긴다 — '3차 / 501호'로 갈라지지 않게. */}
            <Line label={t.more.address}>
              <p className="text-sm text-slate-600 leading-relaxed break-keep">
                <NoBreak>{c.company.address}</NoBreak>
              </p>
            </Line>
            {/* 시공 5단계 — 신청 이후에 무엇이 일어나는지를 알린다. */}
            <Line label={t.more.steps}>
              <ol className="text-sm text-slate-600 tabular-nums">
                {t.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 py-1">
                    <span className="text-slate-500 font-bold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="break-keep">{s}</span>
                  </li>
                ))}
              </ol>
            </Line>
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
