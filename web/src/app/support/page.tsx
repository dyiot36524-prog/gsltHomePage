import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { ArrowRight, ArrowUpRight } from '@/components/Icon';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = pageSeo({
  title: "고객 지원",
  description:
    "전화 070-4659-4804, 이메일 문의는 24시간 내 답변드립니다. 오시는 길과 운영 시간을 함께 안내합니다.",
  path: '/support',
});

/**
 * 연락 수단 한 줄. 왼쪽에 항목 이름, 오른쪽에 값이 서는 표 구조다.
 * 전화·이메일은 사이트 밖(전화 앱·메일 앱)으로 넘어가므로 ArrowUpRight를 붙이고,
 * 이 글리프가 '여기서 나간다'를 혼자 말하므로 slate-500(4.76:1)로 둔다.
 */
function ContactRow({
  term,
  href,
  value,
  note,
}: {
  term: string;
  href?: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-[5rem_1fr] md:grid-cols-[7.5rem_1fr] gap-x-5 md:gap-x-6 py-7">
      <dt className="text-[11px] font-bold tracking-[0.14em] text-slate-600 pt-1.5">{term}</dt>
      <dd className="min-w-0">
        {href ? (
          <a
            href={href}
            className="group inline-flex items-center gap-2 text-lg md:text-xl font-bold text-slate-900 tabular-nums break-all transition-colors duration-300 hover:text-gslt-700"
          >
            {value}
            <ArrowUpRight className="w-5 h-5 shrink-0 text-slate-500 transition-all duration-300 group-hover:text-gslt-700 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <p className="text-slate-700 leading-relaxed break-keep">{value}</p>
        )}
        {note ? <p className="mt-1.5 text-sm text-slate-500 tabular-nums">{note}</p> : null}
      </dd>
    </div>
  );
}

export default function SupportPage() {
  return (
    <>
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbSchema([{ name: "홈", path: "/" }, { name: "고객 지원", path: "/support" }])),
        }}
      />
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="고객 지원"
          lead="무엇이든 도와드리겠습니다. 아래 연락처로 문의 주시면 담당자가 확인 후 답변드립니다."
        />

        {/* 연락처 표도 컨테이너를 가로지른다. 뉴스·자료실·FAQ와 같은 자다 —
            이 페이지만 오른쪽이 비어 다른 사이트처럼 보였다. */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-4">연락처</h2>
          {/* 표는 위아래가 닫혀야 문서로 읽힌다 — 위 2px 먹선, 아래 1px 헤어라인. */}
          <dl className="border-t-2 border-t-slate-900 border-b border-b-slate-200 divide-y divide-slate-200">
            <ContactRow
              term="전화 문의"
              href={`tel:${COMPANY.tel}`}
              value={COMPANY.tel}
              note="평일 09:00 – 18:00"
            />
            <ContactRow
              term="이메일 문의"
              href={`mailto:${COMPANY.email}`}
              value={COMPANY.email}
              note="24시간 내 답변"
            />
            <ContactRow term="오시는 길" value={COMPANY.address} />
          </dl>
        </section>

        <aside className="mt-16 bg-slate-900 text-white p-8 md:p-10">
          <p className="text-xl md:text-2xl font-black tracking-tight break-keep mb-2">
            상담이 필요하신가요?
          </p>
          <p className="max-w-[62ch] text-white/60 break-keep mb-7">
            현장 조건에 맞는 구성을 무료로 제안해 드립니다.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors"
          >
            무료 상담 신청하기
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </aside>
      </main>
      <Footer />
    </>
  );
}
