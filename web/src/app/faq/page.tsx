import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { SITE } from '@/lib/site';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';

/**
 * 자주 묻는 질문.
 *
 * 구 사이트 홈에 있던 5문항이 이관하면서 통째로 사라졌다. 전부 구매 결정을 막는
 * 질문이고 답도 이미 쓰여 있어 되살린다. 문구는 원문 그대로다.
 *
 * 접었다 펴는 아코디언을 쓰지 않는다. 다섯 개뿐이고 전부 중요한 질문이라 숨길 이유가
 * 없다 — 답이 처음부터 보여야 하고, 그래야 검색엔진도 본문으로 읽는다.
 */

const FAQ = [
  {
    q: '정말 배선 공사 없이 설치가 가능한가요?',
    a: '네. 시옷(Siot)은 무선 IoT 장비 기반이라 벽을 뜯거나 배선을 새로 깔지 않습니다. 지금 사용 중인 공간 그대로 장비를 부착·설치하고 무선으로 연결합니다.',
  },
  {
    q: '기존 건물이나 임대 사무실에도 설치할 수 있나요?',
    a: '가능합니다. 공사가 없어 원상복구 부담이 적기 때문에 임대 공간에도 적합합니다. 오피스·주거·빌딩 등 공간 유형과 규모에 맞춰 구성을 제안해 드립니다.',
  },
  {
    q: '구축은 어떤 과정으로 진행되나요?',
    a: '상담·요구 분석 → 현장 실측 → 설계·견적 → 시공·설치 → 검수·유지보수의 5단계로 진행됩니다. 도면 기반 설계로 견적이 빠르게 산출되며, 설치 후에는 1초 단위 실시간 모니터링으로 관리됩니다.',
  },
  {
    q: '비용은 어떻게 산정되나요?',
    a: '공간 규모와 제어 범위(조명·블라인드·공조 등)에 따라 장비 구성과 설치 비용이 정해집니다. 무료 상담을 신청하시면 현장 조건에 맞는 견적을 안내해 드립니다.',
  },
  {
    q: '설치 후 관리와 유지보수는 어떻게 하나요?',
    a: '시옷 대시보드가 모든 장비 상태를 1초 단위로 모니터링하며 이상 신호를 즉시 감지합니다. 99.9% 제어 안정성을 유지하도록 지속적인 유지보수를 제공합니다.',
  },
] as const;

const TITLE = '자주 묻는 질문';
const DESCRIPTION =
  '배선 공사 없이 설치가 가능한지, 임대 사무실에도 되는지, 구축 절차와 비용 산정, 설치 후 유지보수까지 — 무선 IoT 구축을 검토할 때 가장 많이 받는 질문에 답합니다.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/faq' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'ko_KR',
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    url: '/faq',
    images: ['/img/og-image.png'],
  },
};

/** FAQPage 스키마 — 구글이 검색 결과에 질문을 직접 펼쳐 보여줄 수 있게 한다. */
const faqSchema = {
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            faqSchema,
            breadcrumbSchema([
              { name: '홈', path: '/' },
              { name: TITLE, path: '/faq' },
            ]),
          ),
        }}
      />
      <Header active="" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead title={TITLE} lead="무선 IoT 구축을 검토하실 때 가장 많이 받는 질문입니다." />

        {/* 괘선은 컨테이너를 가로지른다. 뉴스·자료실 목록과 같은 자다.
            예전에는 목록 전체를 68ch로 묶어, 같은 컨테이너 안에서 이 페이지만
            오른쪽 440px이 비어 보였다. 읽기 폭은 답변 문단이 따로 지킨다. */}
        <dl className="border-t-2 border-slate-900">
          {FAQ.map((f) => (
            <div key={f.q} className="border-b border-slate-200 py-7">
              <dt className="text-lg md:text-xl font-black text-slate-900 break-keep leading-snug">
                {f.q}
              </dt>
              <dd className="mt-3 max-w-[68ch] text-[15px] md:text-base text-slate-600 break-keep leading-relaxed">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 bg-slate-900 text-white p-8 md:p-10">
          <p className="text-xl md:text-2xl font-black break-keep">여기에 없는 질문이라면</p>
          <p className="mt-3 max-w-[62ch] text-sm md:text-base text-white/70 break-keep leading-relaxed">
            공간 조건과 원하는 제어 범위를 알려주시면 현장에 맞는 구성을 제안해 드립니다.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            도입 문의
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
