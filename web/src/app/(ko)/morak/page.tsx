import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { NoBreak } from '@/lib/nobreak';
import styles from './morak.module.css';
import { getLocale } from '@/i18n/server';
import { localePath } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
import { morak } from '@/i18n/messages/morak';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = morak[locale];
  return pageSeo({
    locale,
    title: t.meta.title,
    description: t.meta.description,
    path: '/morak',
    image: '/img/morak-feature.png',
  });
}

/** CSS의 var(--d) 애니메이션 지연을 인라인으로 넘기기 위한 헬퍼 */
const d = (value: string) => ({ '--d': value }) as CSSProperties;

/** 화면 미리보기 캡처. 대체 글은 사전 preview.shotAlts가 같은 순서다. */
const SHOT_SRC = [
  '/img/morak-shot-1.png',
  '/img/morak-shot-2.png',
  '/img/morak-shot-3.png',
  '/img/morak-shot-4.png',
  '/img/morak-shot-5.png',
] as const;

/**
 * 기존 사이트 홈의 모락 구간에 있던 네 개의 심화 블록. 문구와 화면 짝을 그대로 옮겼다.
 * 전부 실제 모락 앱 화면 캡처다. 문구·대체 글은 사전 screens가 같은 순서다.
 */
const SCREEN_SRC = [
  '/img/morak-screen-home.png',
  '/img/morak-screen-groups.png',
  '/img/morak-screen-space.png',
  '/img/morak-screen-members.png',
  '/img/morak-screen-chat.png',
] as const;

export default async function MorakPage() {
  const locale = await getLocale();
  const t = morak[locale];
  const c = common[locale];

  /** 원본 <head>의 JSON-LD */
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.ld.name,
    url: 'https://morac.gslt.kr',
    applicationCategory: 'SocialNetworkingApplication',
    operatingSystem: 'Web, Android',
    description: t.ld.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
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
              { name: c.solutions.morak.name, path: localePath(locale, '/morak') },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <Header active="" />

      <main className={`${styles.page} bg-slate-50 text-slate-900`}>
        {/* 히어로. 휴대폰에서는 내용이 88vh보다 길어 가운데 정렬이 듣지 않고 첫 줄이 헤더 바로 밑에
            붙었다. 시옷 히어로와 같은 윗여백을 둔다. */}
        <section className="relative min-h-[88vh] flex items-center overflow-hidden pt-16 pb-20 md:pt-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="absolute -top-32 -right-32 w-[34rem] h-[34rem] bg-morak-50 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-24 w-[28rem] h-[28rem] bg-morak-100/60 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className={`${styles.fadeUp} flex items-center gap-4 mb-9`} style={d('.15s')}>
                <span className="block w-12 h-px bg-morak-500 shrink-0" />
                <Image
                  src="/img/morak-icon.png"
                  alt={t.hero.iconAlt}
                  width={512}
                  height={512}
                  sizes="24px"
                  className="h-5 w-5 md:h-6 md:w-6 shrink-0"
                />
                <span className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-morak-800">
                  {t.hero.eyebrow}
                </span>
              </div>
              <h1 className="font-black tracking-tight leading-[1.1] break-keep text-4xl sm:text-6xl lg:text-7xl mb-8">
                <span className={styles.heroLine}>
                  <span className={styles.heroLineInner} style={d('.3s')}>{t.hero.title}</span>
                </span>
                {/* 흰 바탕의 morak-500은 2.21:1로 큰 글자 기준(3:1)에도 못 미쳐 morak-600(3.10:1)으로 내렸다 */}
                <span className={styles.heroLine}>
                  <span className={`${styles.heroLineInner} text-morak-600`} style={d('.45s')}>{t.hero.accent}</span>
                </span>
              </h1>
              {/* 390px에서 '원우회 / ·동문회'로 가운뎃점이 줄 첫머리에 왔다. 렌더할 때만 붙여 둔다(NoBreak). */}
              <p
                className={`${styles.fadeUp} max-w-xl text-base md:text-lg text-slate-500 leading-relaxed break-keep mb-12`}
                style={d('.7s')}
              >
                <NoBreak>{t.hero.lead}</NoBreak>
              </p>
              <div className={`${styles.fadeUp} flex flex-wrap items-center gap-4`} style={d('.9s')}>
                <a
                  href="https://morac.gslt.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-morak-500 hover:bg-morak-400 text-slate-900 font-bold transition-all"
                >
                  {t.hero.start}
                </a>
                {/* 테두리가 이 버튼의 유일한 식별 요소라 비텍스트 3:1이 필요하다 — slate-200은 1.23:1, slate-300도 1.48:1로 미달 */}
                <Link
                  href={localePath(locale, '/contact')}
                  className="px-8 py-4 rounded-full border-2 border-slate-500 text-slate-600 font-bold hover:border-morak-600 hover:text-slate-900 transition-all"
                >
                  {t.hero.contact}
                </Link>
              </div>
              {/* 히어로 배경이 순백이 아니라 민트빛이라 slate-500이 4.32:1까지 내려간다.
                  12px 본문이라 4.5:1이 필요해 한 단계 내렸다. */}
              <p className={`${styles.fadeUp} mt-6 text-xs text-slate-600`} style={d('1.05s')}>
                {t.hero.platforms}
              </p>
            </div>

            {/* 오빗 비주얼 */}
            <div
              className={`${styles.fadeUp} relative flex items-center justify-center min-h-[340px]`}
              style={d('.6s')}
            >
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                <div className="absolute inset-0 rounded-full border border-morak-100" />
                <div className="absolute inset-[18%] rounded-full border border-morak-100" />
                <div className={`${styles.orbitRing} absolute inset-0`}>
                  <span className={styles.orbitDot} style={{ top: '-7px', left: '50%', marginLeft: '-7px' }} />
                  <span className={styles.orbitDot} style={{ bottom: '-5px', left: '22%', width: '10px', height: '10px' }} />
                  <span className={styles.orbitDot} style={{ top: '30%', right: '-6px', width: '12px', height: '12px' }} />
                </div>
                <div className={`${styles.orbitRingR} absolute inset-[18%]`}>
                  <span className={styles.orbitDot} style={{ top: '-6px', left: '50%', marginLeft: '-6px', width: '12px', height: '12px' }} />
                  <span className={styles.orbitDot} style={{ bottom: '8%', left: '-4px', width: '9px', height: '9px' }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.4rem] bg-white shadow-2xl border border-slate-100 flex items-center justify-center">
                    {/* 원본이 2271px인데 실제로는 80~112px로 그려진다. sizes가 없으면
                        next/image가 선언 폭 기준으로 큰 변형을 고르고, priority까지 붙어
                        그 큰 파일을 첫 화면에서 먼저 받는다. */}
                    <Image
                      src="/img/morak-logo.png"
                      alt={t.hero.logoAlt}
                      width={2271}
                      height={1121}
                      priority
                      sizes="(max-width: 768px) 80px, 112px"
                      className="w-20 md:w-28 h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 피처 그래픽 쇼케이스 */}
        <section className="pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-5xl mx-auto">
            <Image
              src="/img/morak-feature.png"
              alt={t.featureImageAlt}
              width={1124}
              height={600}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="w-full h-auto rounded-3xl border border-slate-200/70 shadow-xl"
            />
          </Reveal>
        </section>

        {/* 기능 6그리드 */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              {/* text-balance: 280px에서 '전부' 한 단어만 둘째 줄에 남았다. */}
              <h2 className="text-3xl md:text-5xl font-black break-keep text-balance leading-tight mb-4">{t.features.title}</h2>
              <p className="text-slate-500 break-keep">{t.features.lead}</p>
            </Reveal>
            <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.features.items.map((f) => (
                <div key={f.tag} className="bg-white rounded-2xl border border-slate-200/70 p-7">
                  <p className="text-xs font-black tracking-widest text-morak-800 mb-3">{f.tag}</p>
                  <p className="font-bold text-lg mb-2 break-keep">{f.title}</p>
                  <p className="text-sm text-slate-500 break-keep leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 네 개의 화면 — 기존 사이트 홈의 모락 구간에 있던 심화 설명을 문구와 화면 그대로 옮긴 것.
            위의 기능 목록이 "무엇이 있는가"라면 여기는 "실제로 어떻게 보이는가"다.
            폰 화면이라 세로로 길다 — 가로 이미지와 같은 틀에 넣지 않고 비율을 그대로 살린다. */}
        <section className="pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
            {t.screens.map((s, i) => (
              <Reveal
                key={SCREEN_SRC[i]}
                // 좌우를 번갈아 놓되 트랙 폭을 함께 뒤집는다. order만 바꾸면 폰 화면이
                // 넓은 쪽 트랙으로 들어가 240px짜리가 860px로 부푼다.
                // 폰 화면은 세로로 길고 설명은 두세 줄이라, 가운데 정렬하면 글 위아래로
                // 250px씩 빈다. 위를 맞춰 읽는 줄이 화면 상단과 같은 높이에서 시작하게 한다.
                className={`grid grid-cols-1 gap-8 md:gap-14 items-start ${
                  i % 2 === 1
                    ? 'md:grid-cols-[minmax(0,1fr)_15rem]'
                    : 'md:grid-cols-[15rem_minmax(0,1fr)]'
                }`}
              >
                <figure className={`mx-auto md:mx-0 w-[13rem] md:w-[15rem] ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="rounded-[1.75rem] overflow-hidden border border-slate-200 shadow-xl bg-white">
                    <Image
                      src={SCREEN_SRC[i]}
                      alt={s.alt}
                      width={520}
                      height={1153}
                      sizes="(max-width: 767px) 208px, 240px"
                      className="w-full h-auto block"
                    />
                  </div>
                </figure>
                <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                  {/* text-balance: 280~320px에서 '보입니다'·'정리됩니다'·'생깁니다'·'관리' 한 단어만 마지막 줄에 남았다. */}
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 break-keep text-balance leading-tight mb-4">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 break-keep leading-relaxed max-w-[60ch]">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 화면 미리보기 */}
        <section className="pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-black break-keep">{t.preview.title}</h2>
              <p className="text-sm text-slate-500 hidden sm:block shrink-0">{t.preview.hint}</p>
            </Reveal>
            {/* 휴대폰에서는 넘기는 줄이 바깥 16px 여백에서 잘려 다음 장이 벽에 막힌 것처럼 보였다.
                여백만큼 바깥으로 내밀어 화면 끝까지 흐르게 하고, 첫 장과 넘겨 멈추는 자리는 여백에 맞춘다.
                sm부터는 지면 여백 안에 둔다. */}
            <Reveal className="-mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:thin]">
              {SHOT_SRC.map((src, i) => (
                // 원본 캡처 맨 아래 10px에 어두운 띠가 찍혀 있어 카드 밑에 검은 줄로 보였다. 잘라 냈다(640×1148 → 640×1138).
                <Image
                  key={src}
                  src={src}
                  alt={t.preview.shotAlts[i]}
                  width={640}
                  height={1138}
                  loading="lazy"
                  sizes="(max-width: 768px) 240px, 280px"
                  className="w-[240px] md:w-[280px] h-auto shrink-0 snap-start rounded-2xl border border-slate-200/70 shadow-lg"
                />
              ))}
            </Reveal>
          </div>
        </section>

        {/* 프라이버시 밴드 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/60">
          <Reveal className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black break-keep mb-2">{t.privacy.title}</h2>
                <p className="text-slate-500 break-keep">
                  {t.privacy.body}
                </p>
              </div>
              <a
                href="https://morac.gslt.kr/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-7 py-3.5 rounded-full border-2 border-slate-500 font-bold text-sm text-slate-600 hover:border-morak-600 hover:text-slate-900 transition-all"
              >
                {t.privacy.link}
              </a>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-6xl mx-auto rounded-3xl bg-[#062a2a] text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-16 w-72 h-72 bg-morak-500 rounded-full blur-[120px] opacity-25 pointer-events-none" />
            <div className="text-center md:text-left relative">
              <p className="text-2xl md:text-3xl font-black break-keep mb-2">{t.cta.title}</p>
              <p className="text-white/50 break-keep">
                {t.cta.lead}
              </p>
            </div>
            <a
              href="https://morac.gslt.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-8 py-4 rounded-full bg-morak-500 hover:bg-morak-400 text-slate-900 font-bold transition-all relative"
            >
              {t.hero.start}
            </a>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
