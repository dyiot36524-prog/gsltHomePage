import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import { COMPANY } from '@/lib/site';

const DESCRIPTION =
  '전화·이메일로 바로 연결하거나 상담을 신청하세요. 현장 조건에 맞는 구성과 견적을 무료로 제안해 드립니다.';

export const metadata: Metadata = {
  title: '도입 문의',
  description: DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    locale: 'ko_KR',
    url: '/contact',
    title: '도입 문의 | GSLT',
    description: DESCRIPTION,
    images: ['/img/og-image.png'],
  },
};

/** 시공 5단계. PRODUCT.md가 정의한 실제 진행 순서이고, 신청 이후에 무엇이 일어나는지를 알린다. */
const STEPS = ['상담·요구분석', '현장실측', '설계·견적', '시공·설치', '검수·유지보수'];

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

function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-6">
      <dt className="text-[11px] font-bold tracking-[0.14em] text-slate-500 mb-2">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Header active="" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="도입 문의"
          lead="도입을 검토 중인 솔루션이나 궁금하신 점을 남겨 주세요. 전문가가 24시간 내에 연락드립니다. 현장 조건에 맞는 구성과 견적을 무료로 제안해 드립니다."
        />

        <div className="grid gap-x-16 gap-y-16 lg:grid-cols-[19rem_1fr]">
          {/* 폼보다 먼저 온다. 전송이 실패해도, JS가 없어도 이 열은 서버 렌더된 채 남는다. */}
          <section aria-labelledby="contact-direct">
            <ColumnHead id="contact-direct">바로 연결</ColumnHead>
            <dl className="divide-y divide-slate-200 border-b border-slate-200">
              <Line label="전화">
                <a
                  href={`tel:${COMPANY.tel.replace(/-/g, '')}`}
                  className="text-2xl font-black tracking-tight tabular-nums text-slate-900 transition-colors hover:text-gslt-700"
                >
                  {COMPANY.tel}
                </a>
              </Line>
              <Line label="이메일">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-base font-bold text-slate-900 break-all transition-colors hover:text-gslt-700"
                >
                  {COMPANY.email}
                </a>
              </Line>
              <Line label="주소">
                <p className="text-sm text-slate-600 leading-relaxed break-keep">{COMPANY.address}</p>
              </Line>
              <Line label="이후 절차">
                <ol className="text-sm text-slate-600 tabular-nums">
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex gap-3 py-1">
                      <span className="text-slate-500 font-bold">{String(i + 1).padStart(2, '0')}</span>
                      <span className="break-keep">{s}</span>
                    </li>
                  ))}
                </ol>
              </Line>
            </dl>
          </section>

          <section aria-labelledby="contact-apply">
            <ColumnHead id="contact-apply">상담 신청</ColumnHead>
            <ContactForm />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
