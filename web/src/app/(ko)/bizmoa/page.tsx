import type { Metadata } from 'next';
import { pageSeo, localeUrl } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { Fragment, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import styles from './bizmoa.module.css';
import { getLocale } from '@/i18n/server';
import { localePath } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
import { bizmoa } from '@/i18n/messages/bizmoa';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = bizmoa[locale];
  return pageSeo({
    locale,
    title: t.meta.title,
    description: t.meta.description,
    path: '/bizmoa',
    image: '/img/bizmoa1.JPG',
  });
}

/** 원본의 style="--d:.3s" 를 그대로 옮기기 위한 헬퍼 */
const d = (v: string) => ({ '--d': v }) as CSSProperties;

/** 히어로 도면 위 장비 마커 위치·지연 (원본 순서 유지) */
const HERO_MARKERS = [
  { top: '22%', left: '14%', delay: '0s' },
  { top: '35%', left: '78%', delay: '.6s' },
  { top: '64%', left: '22%', delay: '1.2s' },
  { top: '76%', left: '64%', delay: '1.8s' },
  { top: '18%', left: '52%', delay: '2.4s' },
  { top: '55%', left: '88%', delay: '3s' },
];

/**
 * 배치 → 견적 → 계약 → 관리 → 운영. 기존 사이트의 비즈모아 쇼케이스에 있던 5단계를
 * 문구·세부 기능·연결된 화면까지 그대로 옮긴 것이다. 문구를 새로 짓지 않았다.
 * 문구는 사전(messages/bizmoa steps)에 같은 순서로 있고, 여기에는 번호와 화면만 둔다 — 화면은 언어가 바뀌어도 같다.
 * shots는 전부 실제 비즈모아 화면 캡처이고, 원본이 각 단계에 붙여 두었던 짝을 유지한다. 대체 글은 사전의 shotAlts가 같은 순서다.
 */
const STEP_MEDIA = [
  { no: '01', shots: [{ src: '/img/bizmoa5.JPG' }] },
  { no: '02', shots: [{ src: '/img/bizmoa6.JPG' }] },
  { no: '03', shots: [{ src: '/img/bizmoa7.JPG' }, { src: '/img/bizmoa8.JPG' }] },
  {
    no: '04',
    // 두 장이 같은 프로젝트 화면이고 차이는 카드 하나 아래 펼친 견적 이력뿐이다. 휴대폰 폭에서는
    // 그 차이가 읽히지 않아 같은 그림이 두 번 나온 것으로 보인다 — 휴대폰에서는 첫 장만 둔다(대표님 결정).
    shots: [{ src: '/img/bizmoa3.JPG' }, { src: '/img/bizmoa4.JPG', hideOnPhone: true }],
  },
  { no: '05', shots: [{ src: '/img/bizmoa2.JPG' }, { src: '/img/bizmoa9.JPG' }] },
] as const;

export default async function BizmoaPage() {
  const locale = await getLocale();
  const t = bizmoa[locale];
  const c = common[locale];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.ld.name,
    url: localeUrl(locale, '/bizmoa'),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: t.ld.description,
    provider: { '@type': 'Organization', name: c.company.name },
  };

  return (
    <>
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: c.nav.home, path: localePath(locale, '/') },
              { name: c.solutions.bizmoa.name, path: localePath(locale, '/bizmoa') },
            ]),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Header active="" />

      <main className={`${styles.page} bg-slate-50 text-slate-900`}>
        {/* 히어로: 블루프린트 */}
        <section
          className={`${styles.blueprint} relative min-h-[92vh] flex items-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8`}
        >
          <div className={`${styles.scanline} pointer-events-none`} />
          {/* 도면 위 장비 마커. 휴대폰 폭에서는 글자가 히어로를 거의 다 덮어 마커가 제목·문단 위에
              겹쳐 깜빡인다. 글자와 떨어져 앉을 자리가 생기는 sm부터 보인다. */}
          {HERO_MARKERS.map((m) => (
            <div
              key={`${m.top}-${m.left}`}
              className={`${styles.marker} hidden sm:block`}
              style={{ top: m.top, left: m.left, animationDelay: m.delay }}
            />
          ))}

          <div
            className="max-w-6xl mx-auto w-full relative z-10"
            style={{ textShadow: '0 1px 2px rgba(4,10,24,.5), 0 3px 12px rgba(4,10,24,.55)' }}
          >
            <div className={`${styles.fadeUp} flex items-center gap-4 mb-9`} style={d('.15s')}>
              <span className="block w-12 h-px bg-bizmoa-500 shrink-0" />
              <Image
                src="/img/bizmoaLogo2-nav.png"
                alt={t.hero.logoAlt}
                width={72}
                height={72}
                sizes="24px"
                className="h-5 w-5 md:h-6 md:w-6 shrink-0"
              />
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-bizmoa-400">
                {t.hero.eyebrow}
              </span>
            </div>
            <h1 className="font-black tracking-tight leading-[1.1] break-keep text-white text-4xl sm:text-6xl lg:text-7xl mb-8">
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner} style={d('.3s')}>{t.hero.title}</span>
              </span>
              <span className={styles.heroLine}>
                <span className={`${styles.heroLineInner} text-bizmoa-400`} style={d('.45s')}>{t.hero.accent}</span>
              </span>
            </h1>
            <p
              className={`${styles.fadeUp} max-w-2xl text-base md:text-lg text-white/55 leading-relaxed break-keep mb-12`}
              style={d('.7s')}
            >
              {t.hero.lead}
            </p>
            <div className={`${styles.fadeUp} flex flex-wrap items-center gap-4 mb-16`} style={d('.9s')}>
              {/* 히어로 전체에 걸린 어두운 text-shadow가 밝은 버튼 면 위 먹색 글자에는 번짐으로 보여 끈다 */}
              <Link
                href={localePath(locale, '/contact')}
                className="px-8 py-4 rounded-full bg-bizmoa-500 hover:bg-bizmoa-400 text-slate-900 font-bold transition-all [text-shadow:none]"
              >
                {t.hero.contact}
              </Link>
              {/* 홈의 비즈모아 패널은 아직 이관 전이라 #bizmoa 앵커가 없다. 패널이 올라오면 앵커로 되돌린다 */}
              <Link
                href={localePath(locale, '/')}
                className="px-8 py-4 rounded-full border-2 border-white/15 text-white/80 font-bold hover:border-bizmoa-400 hover:text-bizmoa-400 transition-all"
              >
                {t.hero.home}
              </Link>
            </div>
            {/* 연결선은 단계 사이의 독립 span이라 휴대폰 폭에서 줄이 바뀌면 줄 끝에 홀로 매달린다.
                휴대폰에서는 선을 숨기고 단계 사이를 조금 더 벌려 묶음을 나눈다. */}
            <div
              className={`${styles.fadeUp} flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-3 text-[11px] font-bold uppercase tracking-[0.2em]`}
              style={d('1.1s')}
            >
              {t.hero.flow.map((label, i) => (
                <Fragment key={label}>
                  {i > 0 && <span className="hidden sm:block w-8 h-px bg-white/20" />}
                  <span className={i === 0 ? 'text-bizmoa-400' : 'text-white/55'}>{`${STEP_MEDIA[i].no} ${label}`}</span>
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* 쇼케이스 */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl md:text-5xl font-black break-keep leading-tight mb-4">
                {t.showcase.title}<br />
                <span className="text-bizmoa-500">{t.showcase.accent}</span>
              </h2>
              <p className="text-slate-500 break-keep">
                {t.showcase.lead}
              </p>
            </Reveal>
            <Reveal className="rounded-3xl overflow-hidden border border-slate-200/70 shadow-2xl bg-white max-w-5xl mx-auto">
              <Image
                src="/img/bizmoa1.JPG"
                alt={t.showcase.imageAlt}
                width={2518}
                height={1319}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="w-full h-auto block"
              />
            </Reveal>

          </div>
        </section>

        {/* 5단계 — 배치에서 운영까지.
            도면에서 시작한 데이터가 견적·계약·납품·정산까지 끊기지 않고 이어진다는 것이
            이 제품의 전부다. 그래서 기능을 카드로 나열하지 않고 순서대로 밟는다.
            번호를 쓰는 이유도 그것이다 — 여기서는 순서가 정보다.
            화면은 전부 실제 비즈모아 화면이다. */}
        <section className="pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
            {STEP_MEDIA.map((m, i) => {
              const s = t.steps[i];
              return (
                <Reveal
                  key={m.no}
                  // 단계마다 화면이 한 장 또는 두 장이라 높이가 다르다. 가운데 정렬하면
                  // 짧은 쪽 아래로 빈 구간이 크게 남으므로 위를 맞춘다.
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start"
                >
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-baseline gap-4 mb-4">
                      <span className="text-4xl md:text-5xl font-black tabular-nums text-bizmoa-500 leading-none">
                        {m.no}
                      </span>
                      {/* 휴대폰에서 '자동/생성', '배치'처럼 마지막 줄에 한 단어만 남아 줄 길이를 고르게 나눈다 */}
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 break-keep text-balance leading-tight">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 break-keep leading-relaxed mb-7 max-w-[60ch]">
                      {s.desc}
                    </p>
                    <dl className="border-t border-slate-200">
                      {s.items.map((it) => (
                        <div key={it.name} className="border-b border-slate-200 py-3.5">
                          <dt className="font-bold text-slate-900 text-[15px] break-keep">{it.name}</dt>
                          <dd className="mt-1 text-sm text-slate-500 break-keep leading-relaxed">{it.desc}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-6 text-lg md:text-xl font-black text-slate-900 break-keep">
                      {s.punch}
                    </p>
                  </div>

                  {/* space-y는 display:none인 마지막 항목 앞에도 여백을 남긴다. gap은 숨긴 항목을 건너뛴다. */}
                  <div className={`flex flex-col gap-4 min-w-0 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    {m.shots.map((shot, j) => (
                      <figure
                        key={shot.src}
                        className={`rounded-2xl overflow-hidden border border-slate-200/70 shadow-xl bg-white ${
                          'hideOnPhone' in shot ? 'hidden sm:block' : ''
                        }`}
                      >
                        <Image
                          src={shot.src}
                          alt={s.shotAlts[j]}
                          width={2518}
                          height={1319}
                          sizes="(max-width: 1024px) 100vw, 512px"
                          className="w-full h-auto block"
                        />
                      </figure>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* 추천 고객 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/60">
          <Reveal className="max-w-6xl mx-auto text-center">
            <p className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-6">
              {t.fit.title}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {t.fit.items.map((item) => (
                <span key={item} className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm">{item}</span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <Reveal
            className={`max-w-6xl mx-auto rounded-3xl ${styles.blueprint} text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden`}
          >
            <div className={styles.marker} style={{ top: '25%', left: '8%', animationDelay: '.3s' }} />
            <div className={styles.marker} style={{ top: '70%', left: '90%', animationDelay: '1.5s' }} />
            <div className="text-center md:text-left relative">
              <p className="text-2xl md:text-3xl font-black break-keep mb-2">{t.cta.title}</p>
              <p className="text-white/55 break-keep">{t.cta.lead}</p>
            </div>
            <Link
              href={localePath(locale, '/contact')}
              className="shrink-0 px-8 py-4 rounded-full bg-bizmoa-500 hover:bg-bizmoa-400 text-slate-900 font-bold transition-all relative"
            >
              {t.cta.button}
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
