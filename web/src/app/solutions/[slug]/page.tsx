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
import { FIELDS, fieldBySlug } from '@/lib/fields';
import { SCENES, SCENES_FOR_FIELD } from '@/lib/scenes';
import { NoBreak } from '@/lib/nobreak';

/**
 * 구축 분야 랜딩 — 검색어 하나에 한 장.
 *
 * 홈의 분야 카드는 검색어를 세웠고, 이 페이지는 그 검색어를 **깊게** 다룬다. 검색엔진은
 * 한 주제를 다룬 페이지를 올린다. 구성은 방문자가 실제로 묻는 순서다 — 우리 공간에서
 * 무슨 문제가 생기나 → 어떻게 짓나 → 무엇이 붙나 → 그걸 받치는 제품 → 흔한 질문 → 상담.
 *
 * 기록 면의 문법(흰 지면·괘선·radius 0)을 쓴다. 읽는 페이지라 /faq·/contact와 같은 세계다.
 * 내용은 lib/fields.ts 한 곳에 있고, 모든 문장이 이미 공개된 사실에서 왔다.
 *
 * 본문 문장은 NoBreak로 그린다 — 'Wi-Fi'·'Z-Wave'가 하이픈에서, '·'가 줄 첫머리에서 끊기지
 * 않게. 원문은 구조화 데이터에도 쓰이므로 보이지 않는 문자는 화면에만 넣는다.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return FIELDS.map((f) => ({ slug: f.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = fieldBySlug(slug);
  if (!f) return {};
  return pageSeo({ title: f.title, description: f.description, path: `/solutions/${f.slug}` });
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-700';

function SectionHead({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 break-keep">
      {children}
    </h2>
  );
}

export default async function FieldPage({ params }: Props) {
  const { slug } = await params;
  const f = fieldBySlug(slug);
  if (!f) notFound();

  const url = `${SITE.url}/solutions/${f.slug}`;
  const others = FIELDS.filter((x) => x.slug !== f.slug);
  const scenes = SCENES.filter((x) => (SCENES_FOR_FIELD[f.slug] ?? []).includes(x.slug));

  const service = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: f.keyword,
    serviceType: f.keyword,
    description: f.description,
    url,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: '대한민국' },
  };
  const faq = {
    '@type': 'FAQPage',
    mainEntity: f.faq.map((x) => ({
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
              { name: f.keyword, path: `/solutions/${f.slug}` },
            ]),
          ),
        }}
      />
      <Header active="" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead title={f.keyword} lead={f.lead} />

        <div className="space-y-16 md:space-y-20 pb-8">
          <section aria-labelledby="f-problem" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="f-problem">이 공간에서 생기는 일</SectionHead>
            <p className="mt-5 max-w-[68ch] text-base md:text-lg text-slate-600 leading-relaxed break-keep">
              <NoBreak>{f.problem}</NoBreak>
            </p>
          </section>

          <section aria-labelledby="f-approach" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="f-approach">이렇게 짓습니다</SectionHead>
            <dl className="mt-6 border-t border-slate-200">
              {f.approach.map(([k, v]) => (
                <div
                  key={k}
                  className="grid gap-1.5 md:grid-cols-[13rem_1fr] md:gap-8 border-b border-slate-200 py-5"
                >
                  <dt className="font-bold text-slate-900 break-keep">{k}</dt>
                  <dd className="max-w-[68ch] text-[15px] md:text-base text-slate-600 leading-relaxed break-keep">
                    <NoBreak>{v}</NoBreak>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="f-features" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="f-features">붙는 것</SectionHead>
            <p className="mt-3 text-sm text-slate-500 break-keep">
              <NoBreak>{f.featuresLead}</NoBreak>
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 border-t border-slate-200">
              {f.features.map((x) => (
                <li key={x} className="border-b border-slate-200 py-4 pr-4 text-[15px] font-bold text-slate-900 break-keep">
                  <NoBreak>{x}</NoBreak>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="f-product" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="f-product">받치는 제품</SectionHead>
            {/* 괘선은 감싸는 div가 긋고, 링크는 hover 바탕만 -mx-4로 넓힌다. 둘이 한 요소에 있으면
                괘선도 함께 넓어져 휴대폰에서 화면 끝까지 나간다. 아래 목록들과 같은 짜임이다. */}
            <div className="mt-6 border-y border-slate-200">
              <Link
                href={f.product.href}
                className={`group flex items-baseline justify-between gap-6 py-6 -mx-4 px-4 transition-colors hover:bg-slate-50 ${FOCUS}`}
              >
                <span className="min-w-0">
                  <span className="block text-lg font-black text-slate-900 group-hover:text-gslt-700 transition-colors">
                    {f.product.name}
                  </span>
                  <span className="mt-1 block text-[15px] text-slate-600 leading-relaxed break-keep">
                    <NoBreak>{f.product.why}</NoBreak>
                  </span>
                </span>
                <ArrowRight className="w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-gslt-700" />
              </Link>
            </div>
          </section>

          {/* 이 분야에서 시옷이 실제로 쓰이는 장면. 회의실·휴게공간·화장실은 장면마다 한 장씩 있고,
              끝에서 쇼룸 시연을 신청한다(/siot/*). 관련 없는 분야에는 그리지 않는다. */}
          {scenes.length > 0 && (
            <section aria-labelledby="f-scenes" className="border-t-2 border-slate-900 pt-8">
              <SectionHead id="f-scenes">시옷 활용 장면</SectionHead>
              <ul className="mt-6 border-t border-slate-200">
                {scenes.map((sc) => (
                  <li key={sc.slug} className="border-b border-slate-200">
                    <Link
                      href={`/siot/${sc.slug}`}
                      className={`group flex items-baseline justify-between gap-6 py-4 -mx-4 px-4 transition-colors hover:bg-slate-50 ${FOCUS}`}
                    >
                      <span className="min-w-0">
                        <span className="font-bold text-slate-900 group-hover:text-gslt-700 transition-colors">{sc.keyword}</span>
                        <span className="mt-0.5 block text-sm text-slate-500 break-keep">
                          <NoBreak>{sc.description}</NoBreak>
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-gslt-700 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="f-faq" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="f-faq">자주 묻는 질문</SectionHead>
            <dl className="mt-2">
              {f.faq.map((x) => (
                <div key={x.q} className="border-b border-slate-200 py-7">
                  {/* 두 줄 질문의 끝에 '하나요?'·'있나요?'만 남지 않게 줄 길이를 고른다. */}
                  <dt className="text-lg md:text-xl font-black text-slate-900 break-keep text-balance leading-snug">
                    <NoBreak>{x.q}</NoBreak>
                  </dt>
                  <dd className="mt-3 max-w-[68ch] text-[15px] md:text-base text-slate-600 break-keep leading-relaxed">
                    <NoBreak>{x.a}</NoBreak>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 다른 분야로. 검색으로 한 장에 들어온 사람이 이 회사의 나머지 범위를 보는 길이고,
              검색엔진에게는 여섯 장이 한 묶음이라는 신호다. */}
          <section aria-labelledby="f-others" className="border-t-2 border-slate-900 pt-8">
            <SectionHead id="f-others">다른 구축 분야</SectionHead>
            <ul className="mt-6 border-t border-slate-200">
              {others.map((o) => (
                <li key={o.slug} className="border-b border-slate-200">
                  <Link
                    href={`/solutions/${o.slug}`}
                    className={`group flex items-baseline justify-between gap-6 py-4 -mx-4 px-4 transition-colors hover:bg-slate-50 ${FOCUS}`}
                  >
                    <span className="min-w-0">
                      <span className="font-bold text-slate-900 group-hover:text-gslt-700 transition-colors">{o.keyword}</span>
                      <span className="mt-0.5 block text-sm text-slate-500 break-keep">
                        <NoBreak>{o.lead}</NoBreak>
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-gslt-700 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-16 bg-slate-900 text-white p-8 md:p-10">
          <p className="text-xl md:text-2xl font-black break-keep">우리 공간에도 될까요?</p>
          <p className="mt-3 max-w-[62ch] text-sm md:text-base text-white/70 break-keep leading-relaxed">
            공간 조건과 원하는 제어 범위를 알려주시면 현장에 맞는 구성을 제안해 드립니다. 실측 전 상담은 무료입니다.
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
