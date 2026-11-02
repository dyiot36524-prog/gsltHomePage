import type { Metadata } from 'next';
import { localeUrl, pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import { Fragment, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import AmbientVideo from '@/components/AmbientVideo';
import { SIOT_HOME } from '@/lib/site';
import { scenesFor } from '@/lib/scenes';
import { NoBreak } from '@/lib/nobreak';
import { ArrowUpRight } from '@/components/Icon';
import { fmt, localePath } from '@/i18n/config';
import { getLocale } from '@/i18n/server';
import { common } from '@/i18n/messages/common';
import { siot } from '@/i18n/messages/siot';
import NodeCanvas from './NodeCanvas';
import CountUp from './CountUp';
import styles from './siot.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = siot[locale].meta;
  return pageSeo({ locale, title: t.title, description: t.description, path: '/siot', image: '/img/siot1.png' });
}

/** 원본의 인라인 `style="--d:.15s"` 대응. 애니메이션 지연을 CSS 커스텀 속성으로 넘긴다. */
const d = (value: string) => ({ '--d': value }) as CSSProperties;
/** 계단식 지연의 순번. 불빛이 지나가는 순서와 카드가 들어오는 순서를 CSS에 넘긴다. */
const i = (n: number) => ({ '--i': n }) as CSSProperties;
/** 1막(제안서)·2막(실제 화면) 제목. 360px 미만에서 28px로 내리는 까닭은 1막 주석에 있다. */
const ACT_TITLE =
  'text-[1.75rem] min-[360px]:text-[2rem] md:text-[2.75rem] font-black tracking-tight leading-[1.15] break-keep text-balance text-white';

const CDN = 'https://res.cloudinary.com/r9pnckwj/image/upload/f_auto,q_auto';

/* ── 제안서 슬라이드(1280×720 → 192dpi = 3414×1920) ──
   슬라이드마다 제목이 그림 안에 글자로 박혀 있다. 그대로 걸면 같은 문장이
   HTML 제목과 그림에서 두 번 나온다 — 실제로 그렇게 보였다.
   제목 띠를 잘라내고 그림만 남긴다. 제안서의 문장은 HTML 쪽에 한 번만 서고,
   그래야 검색엔진과 스크린리더도 그 문장을 읽는다.
   표지(cover)는 좌우 2단이라 가로로 잘라 기기 목업만 쓴다.

   c_crop에 x·w를 빼면 Cloudinary가 자르기를 **조용히 무시하고** 원본을 그대로 준다.
   16:9가 그대로 나와도 오류가 아니라 정상 응답이라 눈으로만 봐서는 놓친다. */
type Slide = { src: string; w: number; h: number };
const slide = (crop: string, id: string, w: number, h: number): Slide => ({
  src: `${CDN.replace('/upload', `/upload/${crop}`)},w_2560/${id}`,
  w,
  h,
});

/** 사전 sections[].key → 슬라이드 그림. */
const SLIDE: Record<string, Slide> = {
  cover: slide('c_crop,x_1500,y_360,w_1870,h_1300', 'v1789053808/xr8ucukaldzgg96ispk9.png', 1870, 1300),
  booking: slide('c_crop,x_0,w_3414,y_420,h_750', 'v1789053855/wjzxdzgjjxbrsr4gs5xv.png', 3414, 750),
  control: slide('c_crop,x_0,w_3414,y_540,h_1380', 'v1789053818/mndewcysfx1ovq7rg5dg.png', 3414, 1380),
  floor: slide('c_crop,x_0,w_3414,y_330,h_1100', 'v1789053848/wng8jvfn5ef8kyx3f4wa.png', 3414, 1100),
  automation: slide('c_crop,x_0,w_3414,y_360,h_980', 'v1789053829/rdo4vb5jdfdh3y83mvet.png', 3414, 980),
};

/** 사전의 줄 배열 → 줄 사이에 <br />. 제목을 어디서 꺾을지는 언어마다 사전이 정한다. */
function Lines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((l, k) => (
        <Fragment key={k}>
          {k > 0 && <br />}
          {l}
        </Fragment>
      ))}
    </>
  );
}

/* 관리자가 쓰는 실제 화면. 제안서가 본문이 된 뒤로는 근거 자료다. */
const SCREENS: Record<string, { src: string; w: number; h: number }> = {
  reservations: { src: `${CDN},w_1600/v1788165657/ha7psroqjjge0gbsuedp.png`, w: 2048, h: 1086 },
  spaces: { src: `${CDN},w_1600/v1788165668/aqfxczxhqre56zxj0wuu.png`, w: 2048, h: 982 },
  floor: { src: `${CDN},w_1600/v1788165649/xders8akw9r5gf70yztp.png`, w: 2048, h: 1039 },
  dashboard: { src: `${CDN},w_1600/v1788165630/ob1mkhtesmc1i5xug9oh.png`, w: 2048, h: 1365 },
  automation: { src: `${CDN},w_1600/v1788165692/xycz4pulxk4euucgq3oc.png`, w: 2048, h: 1586 },
  history: { src: `${CDN},w_1600/v1788170672/dsawwe8q4bjyyyo1qllq.png`, w: 2048, h: 2178 },
  home: { src: `${CDN},w_1600/v1788170696/kf5vy5atuzxkhfuszak6.png`, w: 2048, h: 1362 },
};

/** 사전 videos[].key → 공간 영상. */
const VIDEOS: Record<string, string> = { office2: '/img/office2.mp4', office4: '/img/office4.mp4' };

export default async function SiotPage() {
  const locale = await getLocale();
  const t = siot[locale];
  const c = common[locale];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.ld.name,
    alternateName: t.ld.alternateName,
    url: localeUrl(locale, '/siot'),
    sameAs: [SIOT_HOME],
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: t.ld.description,
    featureList: t.ld.featureList,
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
              { name: c.solutions.siot.name, path: localePath(locale, '/siot') },
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
        {/* 히어로: IoT 노드 네트워크 */}
        <section className="relative min-h-[92vh] flex items-center bg-[#0a0a0f] overflow-hidden pt-16 pb-24 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8">
          <NodeCanvas className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute -bottom-40 -right-32 w-[34rem] h-[34rem] bg-siot-600 rounded-full blur-[160px] opacity-[0.12] pointer-events-none" />

          <div
            className="max-w-6xl mx-auto w-full relative z-10"
            style={{ textShadow: '0 1px 2px rgba(4,6,12,.5), 0 3px 12px rgba(4,6,12,.55)' }}
          >
            <div className={`${styles.fadeUp} flex items-center gap-4 mb-9`} style={d('.15s')}>
              <span className="block w-12 h-px bg-siot-500 shrink-0" />
              {/* 시옷 로고. 마크가 이미 '이IOT' 워드마크라 글자 앞에 '시옷'을 또 적지 않는다. */}
              <Image
                src="/img/siot_logo_white.png"
                alt={t.hero.logoAlt}
                width={320}
                height={82}
                sizes="110px"
                className="h-5 md:h-6 w-auto shrink-0"
              />
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-siot-400">
                {t.hero.eyebrow}
              </span>
            </div>
            {/* 제안서 표지의 문장을 그대로 쓴다. 회사가 자기 제품을 부르는 말이
                우리가 지어낸 문장보다 정확하다.

                한 줄짜리 큰 글씨(7xl)를 쓰지 않는 이유: 이 문장은 22자라 7xl에서 세 줄로
                꺾이고, 그만큼 히어로가 길어져 첫 줄이 헤더 밑으로 들어간다. 실제로
                1280×640에서 그렇게 잘리고 있었다. 크기를 낮추고 위 여백을 세웠다. */}
            <h1 className="font-black tracking-tight break-keep text-white mb-8">
              <span className={styles.heroLine}>
                <span
                  className={`${styles.heroLineInner} block text-2xl md:text-3xl leading-[1.3] text-white/80`}
                  style={d('.3s')}
                >
                  {t.hero.titleName}
                </span>
              </span>
              <span className={styles.heroLine}>
                {/* text-balance: 280~320px에서 '도와주는' 한 단어만 둘째 줄에 남았다. 고르게 나누면 '지능형 공간 / 운영을 도와주는'이 된다. */}
                <span
                  className={`${styles.heroLineInner} block text-[1.75rem] sm:text-4xl lg:text-[3.25rem] leading-[1.2] mt-1 text-balance`}
                  style={d('.45s')}
                >
                  {t.hero.titleLine}
                </span>
              </span>
              <span className={styles.heroLine}>
                <span
                  className={`${styles.heroLineInner} block text-[1.75rem] sm:text-4xl lg:text-[3.25rem] leading-[1.2] text-siot-500`}
                  style={d('.6s')}
                >
                  {t.hero.titleAccent}
                </span>
              </span>
            </h1>
            <p
              className={`${styles.fadeUp} max-w-2xl text-base md:text-lg text-white/55 leading-relaxed break-keep mb-12`}
              style={d('.8s')}
            >
              {t.hero.lead}
            </p>
            <div className={`${styles.fadeUp} flex flex-wrap items-center gap-4 mb-16`} style={d('1s')}>
              {/* 히어로 전체에 걸린 어두운 text-shadow가 밝은 주황 버튼 위 먹색 글자에는 번짐으로 보여 끈다(비즈모아와 같다) */}
              <Link href={localePath(locale, '/contact')} className="px-8 py-4 rounded-full bg-siot-500 hover:bg-siot-400 text-slate-900 font-bold transition-all [text-shadow:none]">{t.hero.contact}</Link>
              {/* 포트폴리오는 올릴 사례가 쌓일 때까지 메뉴에서 숨긴 상태다. 숨긴 곳으로
                  보내지 않고, 구축 과정을 실제로 설명하는 회사소개로 보낸다. */}
              <Link href={localePath(locale, '/about')} className="px-8 py-4 rounded-full border-2 border-white/15 text-white/80 font-bold hover:border-siot-500 hover:text-siot-400 transition-all">{t.hero.process}</Link>
              {/* 바깥 사이트라 맨 뒤에 둔다. 375px에서 앞의 두 버튼이 한 줄에 들고 이것만 둘째 줄로 내려간다 —
                  가운데에 두면 세 버튼이 폭이 제각각인 채 세 줄로 쌓였다. */}
              <a
                href={SIOT_HOME}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/15 text-white/80 font-bold hover:border-siot-500 hover:text-siot-400 transition-all"
              >
                {t.hero.siotHome}
                <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="sr-only">{c.header.newWindow}</span>
              </a>
            </div>
            <div className={`${styles.fadeUp} grid grid-cols-3 max-w-xl gap-6`} style={d('1.2s')}>
              {/* 쇼룸에서 실제로 돌고 있는 수치다. 화면에서 읽은 값만 쓴다 —
                  지어낸 수치를 넣지 않는 것이 이 회사의 규칙이다. */}
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={113} /></p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">{t.hero.statDevices}</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={17} /></p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">{t.hero.statAutomations}</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={1} />{t.hero.seconds}</p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">{t.hero.statInterval}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 1막: 제안서 ──
            여기서부터 CTA 직전까지가 하나의 어두운 방이고, 빛은 화면에서만 나온다.
            슬라이드는 1280×720 설계물이라 지면 전체 폭에서 제 크기로 앉는다. */}
        <section className="bg-[#0a0a0f] px-4 sm:px-6 lg:px-8 pt-10 pb-28 md:pb-36 space-y-28 md:space-y-36 overflow-x-clip">
          {t.sections.map((s, n) => (
            <Reveal key={s.key} className={`${styles.feature} max-w-7xl mx-auto`}>
              {/* 사양표가 있으면 [제목+리드 | 사양], 없으면 [제목 | 리드]로 두 기둥을 채운다.
                  없는 쪽을 비워 두면 오른쪽에 큰 구멍이 남는다.

                  제목은 360px 미만에서 28px로 내린다. 32px에서는 <br /> 뒤 '빌딩 전체를 관제합니다'·
                  '실시간으로 제어합니다'가 280~300px 폭의 칸(248~268px)보다 넓어 '관제합니다'·'제어합니다' 한 단어만
                  마지막 줄에 남았다. 28px이면 한 줄에 든다. text-balance는 Chrome 실측에서 <br /> 앞 덩어리만
                  고르게 나눈다 — 280px에서 '예약과 출입, 조명과 / 공조,'로 '공조,'만 한 줄이던 것이
                  '예약과 출입, / 조명과 공조,'가 된다. <br /> 뒤 덩어리는 그대로라 사전(messages/siot/ko.ts)
                  둘째 제목의 '한 번에'처럼 묶는다. 줄 배열의 칸 사이가 곧 <br />다(Lines). */}
              <div className={styles.head}>
                {s.specs.length > 0 ? (
                  <div>
                    <h2 className={ACT_TITLE}>
                      <Lines lines={s.title} />
                    </h2>
                    <p className="mt-6 text-lg md:text-xl text-white/70 leading-[1.75] break-keep">{s.lead}</p>
                  </div>
                ) : (
                  <>
                    <h2 className={ACT_TITLE}>
                      <Lines lines={s.title} />
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 leading-[1.75] break-keep lg:pb-2">{s.lead}</p>
                  </>
                )}
                {s.specs.length > 0 && (
                  <ul className={styles.specs}>
                    {s.specs.map(([k, v]) => (
                      <li key={k} className="grid gap-1 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-5 sm:items-baseline">
                        <span className="text-sm font-bold text-siot-500 break-keep">{k}</span>
                        <span className="text-sm text-white/60 leading-[1.75] break-keep">{v}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <figure className={styles.stage}>
                <span aria-hidden="true" className={styles.bloom} />
                <span className={styles.screen}>
                  <Image
                    src={SLIDE[s.key].src}
                    alt={s.alt}
                    width={SLIDE[s.key].w}
                    height={SLIDE[s.key].h}
                    sizes="(max-width: 1280px) 100vw, 1216px"
                    className={styles.shot}
                  />
                </span>
              </figure>

              {/* 예약 슬라이드 아래에는 네 단계를 다시 세운다. 그림 속 순서를 불빛이
                  한 번 지나가며 짚어 주는 것이 이 페이지의 유일한 연출이다. */}
              {n === 1 && (
                <Reveal as="ol" className={`${styles.chain} mt-14`}>
                  {t.chain.map((step, k) => (
                    <li key={step.name} className={styles.chainStep} style={i(k)}>
                      <span aria-hidden="true" className={styles.chainDot} />
                      <p className="font-bold text-white break-keep mb-1.5">{step.name}</p>
                      <p className="text-sm text-white/60 leading-[1.7] break-keep">{step.desc}</p>
                    </li>
                  ))}
                </Reveal>
              )}

              {/* 자동화 슬라이드 아래에는 실제 규칙 문장을 옮긴다. 이 제품이 무엇을
                  할 수 있는지는 기능 이름보다 이 네 줄이 정확하게 말한다. */}
              {n === 4 && (
                <Reveal className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-9">
                  <p className="text-sm font-bold text-siot-500 mb-6">{t.rulesTitle}</p>
                  <ol className="space-y-4">
                    {t.rules.map((r, k) => (
                      <li key={r} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 items-baseline">
                        <span className="text-sm font-black tabular-nums text-white/35">
                          {String(k + 1).padStart(2, '0')}
                        </span>
                        <span className="text-base md:text-lg text-white/80 leading-[1.7] break-keep">
                          {r}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              )}
            </Reveal>
          ))}
        </section>

        {/* ── 2막: 실제 화면 ──
            제안서가 본문이 되었으니 관리자 화면은 근거 자료로 내려온다.
            비율을 하나로 묶어 격자로 세운다 — 한 장씩 크게 볼 것이 아니라
            "이만큼이 실제로 돌고 있다"를 한눈에 보는 자리다. */}
        <section className="bg-[#0a0a0f] px-4 sm:px-6 lg:px-8 pb-28 md:pb-36 overflow-x-clip">
          <Reveal className="max-w-7xl mx-auto">
            {/* 1막 제목과 같은 크기 규칙이다. 280px에서 '화면' 한 단어만 둘째 줄에 남았다. */}
            <h2 className={ACT_TITLE}>
              {t.screensTitle}
            </h2>
            {/* 가운뎃점이 줄 첫머리로 내려가지 않게 렌더할 때만 붙여 둔다(NoBreak). */}
            <p className="mt-6 max-w-[62ch] text-lg md:text-xl text-white/70 leading-[1.75] break-keep">
              <NoBreak>{t.screensLead}</NoBreak>
            </p>
          </Reveal>

          <Reveal className={`${styles.feature} ${styles.ref} max-w-7xl mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
            {t.screens.map((s) => (
              <figure key={s.key} className={styles.stage}>
                <span aria-hidden="true" className={styles.bloom} />
                <span className={styles.screen}>
                  <Image
                    src={SCREENS[s.key].src}
                    alt={fmt(t.screenAlt, { cap: s.cap, desc: s.desc })}
                    width={SCREENS[s.key].w}
                    height={SCREENS[s.key].h}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"
                    className={styles.shot}
                  />
                </span>
                <figcaption className="mt-4">
                  <span className="block font-bold text-white break-keep">{s.cap}</span>
                  <span className="block mt-1 text-sm text-white/55 leading-relaxed break-keep text-pretty">{s.desc}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        {/* 공간 영상 — 화면을 다 보고 난 뒤, 실제 공간의 공기를 한 번 보여주며 어두운 방을 닫는다.
            영상은 연출 자료라 "우리 시공 현장"이라고 말하지 않는다. 문구는 전부 제품 이야기다. */}
        <section className="bg-[#0a0a0f] pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.videos.map((v) => (
              <figure key={v.key} className="relative h-[300px] md:h-[380px] rounded-2xl overflow-hidden border border-white/10 group">
                <AmbientVideo
                  src={VIDEOS[v.key]}
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-[2s] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                {/* 글자가 앉는 아래쪽을 확실히 눌러 준다 — 영상 프레임이 밝아져도 대비가 무너지지 않게 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <p className="text-lg font-bold text-white mb-1.5 break-keep">{v.title}</p>
                  <p className="text-slate-300 text-sm break-keep text-pretty leading-relaxed">{v.desc}</p>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        {/* ── 3막: 사양 ──
            여기서 지면이 다시 밝아진다. 앞이 '무엇을 하는가'였다면 여기는 '무엇에 붙는가'다.
            읽고 대조하는 내용이라 흰 지면이 맞다. 밝기가 바뀌는 것 자체가 막의 구분이다. */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-24">
            <div>
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                  <Lines lines={t.devicesTitle} />
                </h2>
                <p className="max-w-[68ch] text-slate-500 leading-[1.85] break-keep">
                  {t.devicesLead}
                </p>
              </Reveal>

              <Reveal as="ul" className={`${styles.stagger} mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
                {t.deviceKinds.map((kind, n) => (
                  <li
                    key={kind.name}
                    style={i(n)}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-siot-500/60"
                  >
                    <p className="font-bold text-slate-900 break-keep mb-1">{kind.name}</p>
                    <p className="text-sm text-slate-500 leading-relaxed break-keep">{kind.desc}</p>
                  </li>
                ))}
              </Reveal>
            </div>

            <Reveal>
              <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                <Lines lines={t.spacesTitle} />
              </h2>
              <p className="max-w-[68ch] text-slate-500 leading-[1.85] break-keep mb-8">
                {t.spacesLead}
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {t.spaces.map((space) => (
                  <li
                    key={space}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    {space}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* 활용 장면 — 회의실·휴게공간·화장실을 장면마다 한 장씩 따로 설명한다(/siot/*).
                장면마다 사람들이 검색하는 말이 달라서다. 각 장면 끝에서 쇼룸 시연을 신청한다. */}
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                {t.scenesTitle}
              </h2>
              <p className="max-w-[68ch] text-slate-500 leading-[1.85] break-keep mb-8">
                {t.scenesLead}
              </p>
              <ul className="grid gap-3 md:grid-cols-3">
                {scenesFor(locale).map((sc) => (
                  <li key={sc.slug}>
                    <Link
                      href={localePath(locale, `/siot/${sc.slug}`)}
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-siot-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-siot-700"
                    >
                      <span className="font-black text-slate-900 break-keep group-hover:text-siot-700 transition-colors">{sc.keyword}</span>
                      <span className="mt-2 text-sm text-slate-500 leading-relaxed break-keep">{sc.description}</span>
                      <span className="mt-4 text-sm font-bold text-siot-700">{t.sceneMore}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* 프로세스 배너 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/60">
          <Reveal className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                {/* text-balance: 360~412px에서 '끝납니다'만 둘째 줄에 남았다. 줄 길이를 고르게 맞추면
                    쉼표 뒤에서 '상담부터 유지보수까지, / 5단계로 끝납니다'로 나뉜다. */}
                <h2 className="text-2xl md:text-3xl font-black break-keep text-balance mb-2">{t.processTitle}</h2>
                <p className="text-slate-500 break-keep">{t.processSteps}</p>
              </div>
              <Link href={localePath(locale, '/about')} className="shrink-0 px-7 py-3.5 rounded-full border-2 border-slate-200 font-bold text-sm text-slate-600 hover:border-siot-500 hover:text-siot-700 transition-all">{t.processButton}</Link>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-6xl mx-auto rounded-3xl bg-[#0a0a0f] text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-16 w-72 h-72 bg-siot-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />
            <div className="text-center md:text-left relative">
              <p className="text-2xl md:text-3xl font-black break-keep mb-2">{t.ctaTitle}</p>
              <p className="text-white/50 break-keep">{t.ctaBody}</p>
            </div>
            <Link href={localePath(locale, '/contact')} className="shrink-0 px-8 py-4 rounded-full bg-siot-500 hover:bg-siot-400 text-slate-900 font-bold transition-all relative">{t.ctaButton}</Link>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
