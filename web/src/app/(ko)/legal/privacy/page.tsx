import type { Metadata } from 'next';
import { Fragment, type ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { COMPANY, KAKAO } from '@/lib/site';
import { NoBreak } from '@/lib/nobreak';
import { pageSeo } from '@/lib/seo';
import { getLocale } from '@/i18n/server';
import { DEFAULT_LOCALE, fmt } from '@/i18n/config';
import { common, telHref } from '@/i18n/messages/common';
import { legal } from '@/i18n/messages/legal';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = legal[locale].privacy.meta;
  const seo = pageSeo({ locale, title: t.title, description: t.description, path: '/legal/privacy' });
  // 공유 카드 설명은 검색 설명과 따로 쓴 짧은 문장이다(다국어 전부터). 트위터 카드도 전처럼 이 문장을 쓴다.
  return {
    ...seo,
    openGraph: { ...seo.openGraph, description: t.ogDescription },
    twitter: { card: 'summary_large_image', description: t.ogDescription },
  };
}

/**
 * 국외 이전. 코드가 실제로 보내는 곳만 적는다(2026-10 확인).
 *  - Firestore(문의함·대화 기록)는 서울 리전(asia-northeast3)이라 여기 없고 위탁 표에만 있다.
 *  - Telegram·솔라피 알림톡·접수 확인 자동 메일은 환경 변수가 없어 꺼져 있다. 켜는 날 여기와 위탁 표에 더한다.
 * 이름·연락처는 번역하지 않는다. 나라·이전 항목·기간은 사전(i18n/messages/legal의 transfer.recipients)에 같은 순서로 있다.
 */
const TRANSFERS = [
  { to: 'Vercel Inc.', contact: 'privacy@vercel.com' },
  { to: 'Google LLC (Gmail)', contact: 'https://policies.google.com/privacy' },
  { to: 'Anthropic, PBC', contact: 'privacy@anthropic.com' },
  { to: 'Plus Five Five, Inc. (Resend)', contact: 'privacy@resend.com' },
];

/** 처리 위탁 표의 수탁자(6절). 맡기는 업무는 사전(outsourcing.tasks)에 같은 순서로 있다. */
const PROCESSORS = ['Vercel Inc.', 'Google LLC', 'Anthropic, PBC', 'Plus Five Five, Inc.(Resend)'];

/**
 * 국외 이전 받는 곳의 연락처(이메일 또는 주소). 'https://policies.google.com/privacy'는 끊을 자리가
 * 없어 280px에서 칸보다 넓었고 페이지가 19px 옆으로 밀렸다. inline-block으로 묶어 들어가는 폭에서는
 * 통째로 다음 줄로 넘기고, 그래도 넓을 때만 마지막 '/' 뒤(<wbr/>)에서 꺾는다.
 */
function TransferContact({ value }: { value: string }) {
  const cut = value.lastIndexOf('/') + 1;
  return (
    <span className="inline-block">
      {cut ? (
        <>
          {value.slice(0, cut)}
          <wbr />
          {value.slice(cut)}
        </>
      ) : (
        value
      )}
    </span>
  );
}

/**
 * 사전 문장의 {이름} 자리에 링크·한 덩어리 묶음을 끼운다. 어순이 언어마다 달라
 * ('{email}으로 알려 주세요' · 'report … to {email}') 문장을 앞뒤 조각으로 나눠 두지 않는다.
 */
function rich(template: string, parts: Record<string, ReactNode>): ReactNode[] {
  return template
    .split(/(\{\w+\})/)
    .map((s, i) => (i % 2 ? <Fragment key={i}>{parts[s.slice(1, -1)] ?? s}</Fragment> : s))
    .filter((s) => s !== '');
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const all = legal[locale];
  const t = all.privacy;
  // 법정 표기(성명·연락처)는 한국어에서 전처럼 site.ts의 회사 상수를 그대로 쓴다. 외국어는 그 언어 표기(+82 …)다.
  const ceo = locale === DEFAULT_LOCALE ? COMPANY.ceo : common[locale].company.ceo;
  const tel = locale === DEFAULT_LOCALE ? COMPANY.tel : common[locale].company.tel;
  const mail = <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;

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
                href="/legal/privacy"
                hrefLang="ko"
                className="font-semibold text-gslt-700 underline underline-offset-2 hover:text-slate-900 transition-colors"
              >
                {all.notice.link}
              </a>
            </p>
          ) : null}

          <p className="border-t-2 border-slate-900 pt-4 text-sm text-slate-500 tabular-nums">{t.updated}</p>

          <div className="post-body mt-10">
            {/* 항목은 코드가 실제로 받는 것만 적는다. 쿠키는 쓰지 않는다(layout.tsx·10절). */}
            <h2>{t.collect.title}</h2>
            <ul>
              {t.collect.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>{t.purpose.title}</h2>
            <ul>
              {t.purpose.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>{t.retention.title}</h2>
            <p>{t.retention.intro}</p>
            <ul>
              {t.retention.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>{t.destruction.title}</h2>
            <p>{t.destruction.body}</p>

            <h2>{t.thirdParty.title}</h2>
            <p>{t.thirdParty.body}</p>

            {/* 개인정보 보호법 제26조. 코드가 실제로 넘기는 곳만 적는다 — 꺼진 채널(Telegram·솔라피)은 켤 때 더한다. */}
            <h2>{t.outsourcing.title}</h2>
            <p>{t.outsourcing.intro}</p>
            <table>
              <thead>
                <tr>
                  <th scope="col">{t.outsourcing.colProcessor}</th>
                  <th scope="col">{t.outsourcing.colTask}</th>
                </tr>
              </thead>
              <tbody>
                {PROCESSORS.map((name, i) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{t.outsourcing.tasks[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>{t.outsourcing.outro}</p>

            {/* 개인정보 보호법 제28조의8. 항목이 많아 휴대폰에서 표가 넘치므로 받는 곳마다 목록으로 적는다. */}
            <h2>{t.transfer.title}</h2>
            <p>{t.transfer.intro}</p>
            {TRANSFERS.map((x, i) => {
              const r = t.transfer.recipients[i];
              const label = t.transfer.labels;
              return (
                <div key={x.to}>
                  <h3>{fmt(t.transfer.heading, { to: x.to, country: r.country })}</h3>
                  <ul>
                    <li>
                      {label.contact}
                      <TransferContact value={x.contact} />
                    </li>
                    <li>
                      {label.when}
                      {r.when}
                    </li>
                    <li>
                      {label.items}
                      {r.items}
                    </li>
                    <li>
                      {label.purpose}
                      {r.purpose}
                    </li>
                    <li>
                      {label.keep}
                      {r.keep}
                    </li>
                  </ul>
                </div>
              );
            })}
            <p>{rich(t.transfer.optOut, { tel: <span className="whitespace-nowrap">{tel}</span> })}</p>

            {/* 2026년 4월 처리방침 작성지침의 생성형 AI 항목. 대화 기록은 상담 신청과 함께 보낸 것만 남는다(lib/chat-log.ts). */}
            <h2>{t.ai.title}</h2>
            <ul>
              {t.ai.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>{rich(t.ai.report, { email: mail })}</li>
            </ul>

            {/* 회사소개 페이지의 유튜브 영상·구글 지도. 유튜브는 누르기 전까지 연결하지 않도록
                만들었지만(VideoShowcase), 누른 뒤에는 Google이 처리하므로 그 사실을 적는다.
                지도는 전부터 있었는데 여기 빠져 있었다.
                '·'가 든 제목은 NoBreak로 그린다 — 360~430px에서 '·카카오톡'이 줄 첫머리에 왔다(10절도 같은 처리).
                도메인은 한 덩어리로 묶는다 — 360·375px에서 하이픈 뒤가 꺾여 'youtube-/nocookie.com)'으로 갈렸다. */}
            <h2>
              <NoBreak>{t.external.title}</NoBreak>
            </h2>
            <p>
              {rich(t.external.youtube, {
                domain: <span className="whitespace-nowrap">(youtube-nocookie.com)</span>,
              })}
            </p>
            <p>
              {rich(t.external.google, {
                link: (
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                    {t.external.googleLink}
                  </a>
                ),
              })}
            </p>
            {/* 카카오톡 문의 링크(KakaoChatLink). 사이트는 SDK·쿠키 없이 주소로만 넘긴다. 카카오가 처리하는 것과
                회사가 대화로 받은 것을 나눠 적는다 — 뒤쪽까지 카카오 방침으로 넘기면 회사 책임을 지우는 말이 된다. */}
            <p>
              {rich(t.external.kakao, {
                channel: KAKAO.name,
                link: (
                  <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer">
                    {t.external.kakaoLink}
                  </a>
                ),
              })}
            </p>
            {/* layout.tsx의 Pretendard(jsDelivr), 관리자가 올린 이미지·영상(Cloudinary). 브라우저가 직접 받아 온다. */}
            <p>{t.external.cdn}</p>

            <h2>
              <NoBreak>{t.cookies.title}</NoBreak>
            </h2>
            <ul>
              {t.cookies.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>{t.security.title}</h2>
            <ul>
              {t.security.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>{t.rights.title}</h2>
            <p>{rich(t.rights.body, { email: mail })}</p>

            {/* 법정 표기는 성명 또는 부서 명칭과 연락처다(제30조제1항제6호). 표시 의무 항목이라 회사 상수만 본다. */}
            <h2>{t.officer.title}</h2>
            <ul>
              <li>{fmt(t.officer.name, { name: ceo })}</li>
              <li>{rich(t.officer.email, { email: mail })}</li>
              <li>
                {/* 번호가 하이픈에서 두 줄로 갈리지 않게 한 덩어리로 둔다. */}
                {rich(t.officer.tel, {
                  tel: (
                    <a href={telHref(locale, `tel:${COMPANY.tel}`)} className="whitespace-nowrap">
                      {tel}
                    </a>
                  ),
                })}
              </li>
            </ul>
          </div>

          {/* 본문(.post-body)과 달리 이 줄은 바깥이라 break-keep을 따로 준다. 없으면 '국/외'로 끊긴다. */}
          <p className="mt-14 pt-6 border-t border-slate-200 text-xs text-slate-500 tabular-nums break-keep">
            <NoBreak>{t.effective}</NoBreak>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
