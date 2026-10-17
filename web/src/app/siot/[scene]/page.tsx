import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { ArrowRight } from '@/components/Icon';
import { pageSeo } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { jsonLd, breadcrumbSchema, ORG_ID } from '@/lib/schema';
import { SCENES, sceneBySlug } from '@/lib/scenes';

/**
 * 시옷 활용 장면 — 회의실 예약·제어 / 휴게공간 예약·재실 현황판 / 화장실 재실 표시.
 *
 * 검색어 하나에 한 장이다. "회의실 예약 시스템", "화장실 재실 표시"를 찾는 담당자가 바로 이
 * 페이지에 닿고, 첫 문단에서 무엇인지 답을 얻고, 끝에서 **쇼룸 시연을 신청**한다.
 *
 * 구축 분야 페이지(/solutions/*)와 같은 기록 면(흰 지면·괘선·radius 0)을 쓴다. 읽는 페이지다.
 * 내용은 lib/scenes.ts 한 곳에 있고, 지금은 쇼룸 시연 수준이라 고객 사례·수치를 쓰지 않는다.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return SCENES.map((s) => ({ scene: s.slug }));
}

type Props = { params: Promise<{ scene: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scene } = await params;
  const s = sceneBySlug(scene);
  if (!s) return {};
  return pageSeo({ title: s.title, description: s.description, path: `/siot/${s.slug}` });
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-700';

function SectionHead({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 break-keep">
      {children}
    </h2>
  );
}

export default async function ScenePage({ params }: Props) {
  const { scene } = await params;
  const s = sceneBySlug(scene);
  if (!s) notFound();

  const url = `${SITE.url}/siot/${s.slug}`;
  const others = SCENES.filter((x) => x.slug !== s.slug);

  const service = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: s.keyword,
    serviceType: s.name,
    description: s.description,
    url,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: '대한민국' },
    isRelatedTo: { '@type': 'SoftwareApplication', name: '시옷(SIOT)', url: `${SITE.url}/siot` },
  };
  const faq = {
    '@type': 'FAQPage',
    mainEntity: s.faq.map((x) => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            service,
            faq,
            breadcrumbSchema([
              { name: '홈', path: '/' },
              { name: '시옷', path: '/siot' },
              { name: s.keyword, path: `/siot/${s.slug}` },
            ]),
          ),
        }}
      />
      <Header active="" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead title={s.keyword} lead={s.lead} />

        <div className="space-y-16 md:space-y-20 pb-8">
          <section aria-labelledby="s-problem" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="s-problem">이런 일이 생깁니다</SectionHead>
            <p className="mt-5 max-w-[68ch] text-base md:text-lg text-slate-600 leading-relaxed break-keep">
              {s.problem}
            </p>
          </section>

          <section aria-labelledby="s-how" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="s-how">이렇게 동작합니다</SectionHead>
            <dl className="mt-6 border-t border-slate-200">
              {s.how.map(([k, v]) => (
                <div
                  key={k}
                  className="grid gap-1.5 md:grid-cols-[13rem_1fr] md:gap-8 border-b border-slate-200 py-5"
                >
                  <dt className="font-bold text-slate-900 break-keep">{k}</dt>
                  <dd className="max-w-[68ch] text-[15px] md:text-base text-slate-600 leading-relaxed break-keep">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="s-admin" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="s-admin">관리자 화면에서 보는 것</SectionHead>
            <p className="mt-3 text-sm text-slate-500 break-keep">
              회의실·휴게공간·화장실을 따로 두지 않고 하나의 시옷 관제 화면에서 함께 봅니다.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 border-t border-slate-200">
              {s.admin.map((x) => (
                <li key={x} className="border-b border-slate-200 py-4 pr-4 text-[15px] font-bold text-slate-900 break-keep">
                  {x}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="s-devices" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="s-devices">붙는 장비</SectionHead>
            <p className="mt-3 text-sm text-slate-500 break-keep">
              배선 공사 없이 무선으로 얹고, 제조사가 달라도 Wi-Fi·블루투스·ZigBee·Z-Wave를 함께 지원하는 개방형 구조로 묶습니다.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 border-t border-slate-200">
              {s.devices.map((x) => (
                <li key={x} className="border-b border-slate-200 py-4 pr-4 text-[15px] font-bold text-slate-900 break-keep">
                  {x}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="s-faq" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="s-faq">자주 묻는 질문</SectionHead>
            <dl className="mt-2">
              {s.faq.map((x) => (
                <div key={x.q} className="border-b border-slate-200 py-7">
                  <dt className="text-lg md:text-xl font-black text-slate-900 break-keep leading-snug">{x.q}</dt>
                  <dd className="mt-3 max-w-[68ch] text-[15px] md:text-base text-slate-600 break-keep leading-relaxed">
                    {x.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 다른 장면으로. 회의실을 찾아온 담당자가 휴게공간·화장실도 같은 화면에서 된다는 것을 보는 길이고,
              검색엔진에게는 세 장이 시옷이라는 한 제품의 묶음이라는 신호다. */}
          <section aria-labelledby="s-others" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="s-others">시옷의 다른 활용 장면</SectionHead>
            <ul className="mt-6 border-t border-slate-200">
              {others.map((o) => (
                <li key={o.slug} className="border-b border-slate-200">
                  <Link
                    href={`/siot/${o.slug}`}
                    className={`group flex items-baseline justify-between gap-6 py-4 -mx-4 px-4 transition-colors hover:bg-slate-50 ${FOCUS}`}
                  >
                    <span className="min-w-0">
                      <span className="font-bold text-slate-900 group-hover:text-gslt-700 transition-colors">{o.keyword}</span>
                      <span className="mt-0.5 block text-sm text-slate-500 break-keep">{o.description}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-gslt-700 transition-colors" />
                  </Link>
                </li>
              ))}
              <li className="border-b border-slate-200">
                <Link
                  href="/siot"
                  className={`group flex items-baseline justify-between gap-6 py-4 -mx-4 px-4 transition-colors hover:bg-slate-50 ${FOCUS}`}
                >
                  <span className="min-w-0">
                    <span className="font-bold text-slate-900 group-hover:text-gslt-700 transition-colors">시옷(SIOT) 전체 보기</span>
                    <span className="mt-0.5 block text-sm text-slate-500 break-keep">통합 관제·공간 예약·출입 연동·자동화·에너지를 한 시스템에서.</span>
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-gslt-700 transition-colors" />
                </Link>
              </li>
            </ul>
          </section>
        </div>

        {/* 첫 행동은 쇼룸 시연이다. 고객 사례 대신 실제로 동작하는 모습을 보여 주는 것이 지금 가장 강한
            설득이다. 버튼은 문의 양식을 '쇼룸 시연 신청'으로 미리 채워 연다(저장 칸은 그대로). */}
        <div className="mt-16 bg-slate-900 text-white p-8 md:p-10">
          <p className="text-xl md:text-2xl font-black break-keep">성남 쇼룸에서 직접 보세요</p>
          <p className="mt-3 max-w-[62ch] text-sm md:text-base text-white/70 break-keep leading-relaxed">
            {s.name} 장면이 실제로 동작하는 모습을 쇼룸에서 보여 드립니다. 원하는 날짜를 남겨 주시면 담당자가 일정을 잡아 연락드립니다.
          </p>
          <Link
            href={`/contact?demo=${s.slug}`}
            className="mt-6 inline-flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            쇼룸 시연 신청
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
