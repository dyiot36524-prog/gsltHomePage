import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import KakaoChatLink from '@/components/KakaoChatLink';
import { COMPANY, KAKAO } from '@/lib/site';

const DESCRIPTION =
  '전화·이메일로 바로 연결하거나 상담을 신청하세요. 현장 조건에 맞는 구성과 견적을 무료로 제안해 드립니다.';

export const metadata: Metadata = pageSeo({
  title: "도입 문의",
  description:
    "공간 조건을 알려주시면 현장에 맞는 구성과 견적을 제안해 드립니다. 실측 전 상담과 개략 안내는 무료입니다.",
  path: '/contact',
});

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

export default function ContactPage() {
  return (
    <>
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbSchema([{ name: "홈", path: "/" }, { name: "도입 문의", path: "/contact" }])),
        }}
      />
      <Header active="" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="도입 문의"
          lead="편한 방법 하나를 고르세요. 카카오톡으로 바로 묻거나, 이메일로 문의를 남겨 주시면 24시간 내에 연락드립니다. 현장 조건에 맞는 구성과 견적은 무료로 제안해 드립니다."
        />

        {/* 문의는 두 갈래다 — ① 지금 바로 묻는 카카오톡, ② 내용을 정리해 남기는 이메일(상담 신청서).
            휴대폰에서는 ①이 첫 화면에 오고 ②가 이어진다. 둘 다 서버에서 그려져 JS 없이도 선다. */}
        <div className="grid gap-x-16 gap-y-16 lg:grid-cols-[22rem_1fr]">
          <section aria-labelledby="contact-kakao">
            <StepHead id="contact-kakao" n="01">
              카카오톡으로 바로 문의
            </StepHead>
            <p className="mt-5 text-[15px] text-slate-600 leading-relaxed break-keep">
              궁금한 것을 지금 바로 물어보세요. 담당자가 카카오톡 채팅으로 답합니다.
            </p>
            {/* 모바일은 카카오톡 앱이 바로 열리고, PC는 카카오 로그인을 거쳐 카카오톡에서 이어진다 —
                그 차이를 보조 문구가 미리 말한다. 채널 이름을 적어 두면 링크가 막힌 인앱 브라우저에서도
                카카오톡 검색으로 찾을 수 있다. */}
            <div className="mt-6">
              <KakaoChatLink place="contact" describedBy="contact-kakao-note">
                카카오톡으로 문의하기
              </KakaoChatLink>
              <p id="contact-kakao-note" className="mt-3 text-sm text-slate-500 leading-relaxed break-keep">
                카카오톡 채널 ‘{KAKAO.name}’ · 새 창에서 열립니다. PC에서는 카카오 로그인 후 카카오톡에서 대화가
                이어집니다.
              </p>
            </div>
            <p className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-600 break-keep">
              전화가 편하시면{' '}
              <a
                href={`tel:${COMPANY.tel.replace(/-/g, '')}`}
                className="text-lg font-black tracking-tight tabular-nums text-slate-900 transition-colors hover:text-gslt-700"
              >
                {COMPANY.tel}
              </a>
            </p>
          </section>

          {/* 장면 페이지의 '쇼룸 시연 신청'은 이 머리(#contact-email)로 바로 온다. */}
          <section aria-labelledby="contact-email">
            <StepHead id="contact-email" n="02">
              이메일로 문의 남기기
            </StepHead>
            <p className="mt-5 text-[15px] text-slate-600 leading-relaxed break-keep">
              아래 양식을 보내 주시면 담당자에게 바로 전달되고, 남겨 주신 이메일이나 연락처로 답을 드립니다. 메일
              프로그램이 편하시면{' '}
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-bold text-slate-900 break-all underline underline-offset-4 decoration-slate-300 transition-colors hover:text-gslt-700"
              >
                {COMPANY.email}
              </a>
              로 보내셔도 됩니다.
            </p>
            <ContactForm />
          </section>
        </div>

        {/* 문의 다음에 알면 좋은 것 — 찾아오는 곳과 진행 순서. 두 갈래 선택을 흐리지 않게 아래로 뺀다. */}
        <section aria-labelledby="contact-more" className="mt-20">
          <ColumnHead id="contact-more">찾아오시는 곳 · 진행 순서</ColumnHead>
          <dl className="grid md:grid-cols-2 md:gap-x-16 border-b border-slate-200">
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
      </main>
      <Footer />
    </>
  );
}
