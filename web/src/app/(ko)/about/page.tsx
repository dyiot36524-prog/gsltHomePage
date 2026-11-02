import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TimelineProgress from './TimelineProgress';
import VideoShowcase from './VideoShowcase';
import { getAboutVideos } from '@/lib/about-videos';
import { NoBreak } from '@/lib/nobreak';
import { getLocale } from '@/i18n/server';
import { DEFAULT_LOCALE, HTML_LANG, localePath } from '@/i18n/config';
import { common, telHref } from '@/i18n/messages/common';
import { about } from '@/i18n/messages/about';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = about[locale];
  return pageSeo({
    locale,
    title: t.meta.title,
    description: t.meta.description,
    path: '/about',
    // 공유·검색 대표 이미지. 공용 로고 그림 대신 이 페이지를 대표하는 시상식 사진을 쓴다(외국어 판도 같은 사진).
    image: '/img/forbes-ceremony-2026.jpg',
  });
}

/** 국책과제 두 건의 서류 그림 — 글자는 사전 history.grants에 같은 순서로 있다. */
const GRANT_DOCS = [
  { byClass: 'text-bizmoa-600', src: '/img/rnd-agreement-2026.png', w: 158, h: 222 },
  { byClass: 'text-emerald-700', src: '/img/startup-package-certificate-2025.png', w: 157, h: 222 },
];

/** 지도는 한국어 주소로 찾는다. 외국어 판은 지도 글자만 그 언어로(hl) 바꾼다. */
const MAP_SRC =
  'https://maps.google.com/maps?q=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%84%B1%EB%82%A8%EC%8B%9C%20%EC%A4%91%EC%9B%90%EA%B5%AC%20%EB%91%94%EC%B4%8C%EB%8C%80%EB%A1%9C388%EB%B2%88%EA%B8%B8%2024&z=16&output=embed';

/** 원본 <style>에 있던 페이지 전용 장식 — 타임라인 현재 지점 펄스와 아웃라인 워터마크. */
const pageCss = `
.tl-now::after {
  content: '';
  position: absolute;
  inset: -7px;
  border-radius: 999px;
  border: 2px solid rgba(245, 158, 11, 0.5);
  animation: tlPulse 2.4s ease-out infinite;
}
@keyframes tlPulse {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .tl-now::after { animation: none; } }

`;

export default async function AboutPage() {
  const locale = await getLocale();
  const t = about[locale];
  const co = common[locale];
  const videos = await getAboutVideos(locale);
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: co.nav.home, path: localePath(locale, '/') },
              { name: co.nav.about, path: localePath(locale, '/about') },
            ]),
          ),
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <Header active="about" />

      <main className="pt-6 md:pt-24">
        {/* 회사소개의 첫 화면은 수상이다. 이 회사가 외부에서 받은 가장 큰 검증을
            페이지 맨 앞에 세운다. 수상명은 그림 안에만 두지 않고 HTML 글자로도 남긴다 —
            검색엔진도 스크린리더도 그림 속 글자는 읽지 못한다. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 md:mb-20">
          <div className="overflow-hidden rounded-3xl bg-[#0a0a0f]">
            <Image
              src="/img/forbes-award-2026.png"
              alt={t.award.imageAlt}
              width={2560}
              height={1600}
              sizes="(max-width: 1279px) 100vw, 1152px"
              className="w-full h-auto block"
              priority
            />
            {/* 위의 큰 그림은 수상 엠블럼(연출물)이고, 오른쪽 작은 사진은 시상식 현장이다.
                엠블럼만 있으면 '만든 그림'이지만 현장 사진이 붙으면 '실제로 받았다'가 된다.
                처음에는 306px짜리 축소본을 써서 520px로 늘리면 무릎이 보였다. 대표님이 4032px
                원본을 주셔서 1600px(185KB)로 다시 떴다 — 이제 확대가 아니라 축소다.
                사진 속 명찰에 '최광수'가 찍혀 있어 캡션에 이름을 적는다. 앞선 축소본에서는
                읽히지 않아 '수상자'로만 뒀던 자리다. */}
            <div className="p-8 md:p-12 grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
              <div>
                {/* 360px에서 마지막 줄에 '대상' 한 단어만 남았다. 줄 길이를 고르게 나눈다. */}
                <p className="text-2xl md:text-4xl font-black leading-[1.2] break-keep text-balance text-white">
                  {t.award.title}
                </p>
                <p className="mt-3 text-lg md:text-xl font-bold text-amber-400 break-keep">
                  {t.award.category}
                </p>
                {/* 날짜는 NoBreak로 한 덩어리로 묶는다. break-keep은 하이픈 뒤를 막지 못해
                    '2026-02-/27'로 갈렸다(캡션은 280px에서 실제로 그랬다). */}
                <p className="mt-4 text-sm md:text-base text-slate-300 break-keep leading-relaxed max-w-2xl">
                  <NoBreak>{t.award.body}</NoBreak>
                </p>
                <Link
                  href={localePath(locale, '/news')}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white border-b-2 border-amber-400 pb-1 hover:text-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {t.award.press}
                </Link>
              </div>

              <figure>
                <Image
                  src="/img/forbes-ceremony-2026.jpg"
                  alt={t.award.photoAlt}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 1023px) 92vw, 520px"
                  className="w-full h-auto block rounded-xl border border-white/15"
                />
                <figcaption className="mt-3 text-xs text-slate-400 break-keep">
                  <NoBreak>{t.award.photoCaption}</NoBreak>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* 제목 위 아이브로(About GSLT)와 배경 워터마크(ABOUT)를 걷어냈다. 제목이 스스로 선다.
            핵심 수치는 같은 크기 카드 넉 장으로 늘어놓지 않는다 — 큰 숫자 + 작은 라벨을
            격자에 까는 건 어느 회사 소개에나 붙는 배열이라 이 회사에 대해 아무것도 말하지 않는다.
            사실은 한 줄 제원표로 잇는다. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight break-keep mb-5">{t.hero.title[0]}<br />{t.hero.title[1]}</h1>
          <p className="text-slate-600 text-lg break-keep max-w-2xl">{t.hero.lead}</p>

          {/* 구분선을 항목 사이의 독립 span으로 두면 flex-wrap이 줄을 바꿀 때 선이 줄 끝이나
              줄 첫머리에 홀로 남는다. 선을 항목 자신의 왼쪽 테두리로 붙이고, 한 줄에 다 들어가는
              sm 이상에서만 긋는다. 휴대폰에서는 두 칸 격자에 세 번째 항목을 두 칸으로 놓아
              선 없이 줄로만 나눈다. */}
          <dl className="mt-10 grid grid-cols-2 items-baseline gap-x-8 gap-y-4 border-t border-slate-300 pt-5 max-w-2xl sm:flex">
            <div className="flex items-baseline gap-2">
              <dt className="text-sm text-slate-600">{t.facts.founded.label}</dt>
              <dd className="text-lg font-black tabular-nums text-slate-900">{t.facts.founded.value}</dd>
            </div>
            <div className="flex items-baseline gap-2 sm:border-l sm:border-slate-300 sm:pl-8">
              <dt className="text-sm text-slate-600">{t.facts.solutions.label}</dt>
              <dd className="text-lg font-black tabular-nums text-slate-900">{t.facts.solutions.value}</dd>
            </div>
            <div className="col-span-2 flex items-baseline gap-2 sm:border-l sm:border-slate-300 sm:pl-8">
              <dt className="text-sm text-slate-600">{t.facts.stability.label}</dt>
              <dd className="text-lg font-black tabular-nums text-slate-900">{t.facts.stability.value}</dd>
            </div>
          </dl>
        </div>

        {/* IoT 구축 프로세스.

            전에는 화면 폭을 꽉 채운 검은 띠였다. 흰 지면 사이에 먹지가 한 장 끼어든 것처럼
            **페이지가 거기서 끊겼다.** 이 페이지의 다른 검은 면(맨 위 수상 판, 맨 아래 CTA)은
            전부 둥근 패널인데 이것만 전폭이었던 탓이다.

            같은 문법으로 되돌린다 — 여백 안에 앉는 둥근 패널. 청록 번짐을 하나 두어
            먹지가 아니라 만들어진 물건으로 읽히게 한다. 순서가 정보이므로 ol로 세운다. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0f] p-8 md:p-14">
            <div className="absolute -top-40 -left-28 w-[32rem] h-[32rem] rounded-full bg-gslt-500 blur-[150px] opacity-[0.13] pointer-events-none" />
            <div className="relative">
              {/* text-balance: 320~412px에서 'IoT 구축, 이렇게 / 진행됩니다'로 윗줄만 길었다. 줄 길이를 고르게
                  맞추면 쉼표 뒤에서 'IoT 구축, / 이렇게 진행됩니다'로 나뉜다. */}
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white break-keep text-balance mb-4">{t.process.title}</h2>
              <p className="text-white/55 break-keep mb-14 max-w-2xl">{t.process.lead}</p>

              <ol className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {t.process.steps.map((step) => (
                  <li key={step.no} className="relative border-t border-white/15 pt-6">
                    {/* 단계 위 작은 점. 다섯 개가 한 줄에 찍혀 진행 눈금처럼 읽힌다. */}
                    <span aria-hidden="true" className="absolute -top-[3px] left-0 h-[5px] w-[5px] rounded-full bg-gslt-400" />
                    <p className="font-bold text-lg mb-2 flex items-baseline gap-2.5">
                      <span className="text-gslt-400 tabular-nums text-sm shrink-0">{step.no}</span>
                      {/* 영어 단계 이름은 md(5칸, 칸당 100px 남짓)에서 넘치지 않게 짧은 동사로 썼다. */}
                      <span className="text-white break-keep">{step.title}</span>
                    </p>
                    <p className="text-white/55 text-sm break-keep leading-relaxed">{step.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* 영상 — 관리자 '회사소개 영상' 탭에서 넣고 뺀다(settings/aboutVideos).
            절차를 글로 읽은 바로 다음에 실제 모습을 보여 주는 자리다. 공개 영상이 없거나
            읽기에 실패하면 구역 자체를 그리지 않는다 — 빈 판을 보여 주느니 없는 편이 낫다. */}
        {videos.length > 0 && (
          <section aria-labelledby="about-videos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
            <div className="flex items-center gap-4 mb-10">
              <h2 id="about-videos" className="text-2xl md:text-3xl font-black">{t.videos.title}</h2>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            <VideoShowcase videos={videos} t={t.videos} newWindow={co.header.newWindow} />
          </section>
        )}

        {/* 성과 & 연혁 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-black">{t.history.title}</h2>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* 벤처기업 확인 — 확인서 실물과 제원표를 나란히.
              확인서는 상장이 아니라 **서류**다. 트로피처럼 크게 걸면 형식이 어긋나고,
              340px로 앉히면 그 안의 글자는 어차피 읽히지 않는다. 그래서 이미지는
              '이 서류가 실재한다'는 증거로만 두고, 읽을 값은 옆의 제원표가 전부 글자로
              갖는다 — 검색엔진도 스크린리더도 그림 속 글자는 읽지 못한다.
              원본 해상도가 687px라 표시 폭 340px가 2배 밀도에서 딱 맞는 상한이다.

              상이 아니라 **유효기간이 있는 자격**이라 기간을 반드시 함께 적는다.
              2029-09-08이 지나면 이 판은 사실이 아니게 된다. */}
          <div className="rounded-3xl bg-white border border-slate-200/70 overflow-hidden mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200/70 p-8 md:p-10 flex justify-center">
                <a
                  href="/img/venture-certificate-2026.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full max-w-[340px] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gslt-600"
                >
                  <Image
                    src="/img/venture-certificate-2026.png"
                    alt={t.history.venture.imageAlt}
                    width={687}
                    height={903}
                    sizes="(max-width: 1023px) 90vw, 340px"
                    className="w-full h-auto block rounded-sm border border-slate-300/80 shadow-[0_20px_44px_-18px_rgb(15_23_42/0.4),0_4px_12px_-6px_rgb(15_23_42/0.25)] transition-transform duration-500 group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                  />
                  <span className="mt-5 block text-center text-xs font-bold text-slate-600 group-hover:text-gslt-700 transition-colors">
                    {t.history.venture.enlarge}
                  </span>
                </a>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-black leading-snug break-keep text-slate-900">
                  {t.history.venture.title}
                </p>
                <p className="mt-2 text-sm font-bold text-gslt-700">{t.history.venture.sub}</p>
                <p className="mt-5 text-slate-600 break-keep leading-relaxed max-w-[52ch]">
                  {t.history.venture.body}
                </p>
                <dl className="mt-8 border-t border-slate-300">
                  {t.history.venture.rows.map(({ label: k, value: v }) => (
                    <div
                      key={k}
                      className="grid gap-0.5 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-5 sm:items-baseline py-3.5 border-b border-slate-200"
                    >
                      <dt className="text-sm text-slate-500">{k}</dt>
                      <dd className="text-sm font-bold text-slate-900 break-keep">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* 포브스 대상은 이 페이지 맨 위로 올라갔다. 여기서 또 크게 반복하면 광고가 된다 —
              연혁 항목으로만 남기고, 국책과제 두 건을 사실 그대로 잇는다.

              두 서류의 원본이 158px밖에 안 된다. 104px 이상으로 키우면 뭉개지고,
              그 크기에서는 어차피 안에 적힌 글자를 읽을 수 없다. 그래서 확대 링크를
              달지 않는다 — '크게 보기'를 눌렀는데 거의 같은 크기가 나오면 속은 것이다.
              서류는 '실물이 있다'는 표식으로만 두고, 내용은 옆의 글자가 갖는다. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {t.history.grants.map((g, i) => ({ ...g, ...GRANT_DOCS[i] })).map((c) => (
              <div
                key={c.title}
                className="rounded-3xl bg-white border border-slate-200/70 p-8 flex flex-col sm:flex-row gap-6 sm:items-center"
              >
                <div className="shrink-0 self-start rounded-lg bg-slate-100 border border-slate-200/70 p-2.5">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={c.w}
                    height={c.h}
                    sizes="104px"
                    className="block w-[104px] h-auto rounded-sm border border-slate-300/70 shadow-[0_6px_14px_-8px_rgb(15_23_42/0.45)]"
                  />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-black leading-snug break-keep text-slate-900">
                    {c.title}
                  </p>
                  <p className={`mt-2 text-sm font-bold ${c.byClass}`}>{c.by}</p>
                  <p className="mt-3 text-sm text-slate-500 break-keep leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 가로 타임라인 */}
          <TimelineProgress>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              <div className="relative md:pt-12">
                <div className="hidden md:block absolute top-0 left-0 w-[22px] h-[22px] rounded-full bg-white border-[3px] border-gslt-400 shadow-sm"></div>
                <p className="text-5xl font-black text-slate-500 leading-none mb-3 select-none">{t.history.timeline[0].year}</p>
                <p className="font-bold text-slate-900 mb-1">{t.history.timeline[0].title}</p>
                <p className="text-sm text-slate-500 break-keep">{t.history.timeline[0].desc}</p>
              </div>
              <div className="relative md:pt-12">
                <div className="hidden md:block absolute top-0 left-0 w-[22px] h-[22px] rounded-full bg-white border-[3px] border-emerald-400 shadow-sm"></div>
                <p className="text-5xl font-black text-slate-500 leading-none mb-3 select-none">{t.history.timeline[1].year}</p>
                <p className="font-bold text-slate-900 mb-1">{t.history.timeline[1].title}</p>
                <p className="text-sm text-slate-500 break-keep">{t.history.timeline[1].desc}</p>
              </div>
              <div className="relative md:pt-12">
                <div className="tl-now hidden md:block absolute top-0 left-0 w-[22px] h-[22px] rounded-full bg-amber-400 border-[3px] border-white shadow-md"></div>
                <p className="text-5xl font-black text-amber-600 leading-none mb-3 select-none">{t.history.timeline[2].year}</p>
                <p className="font-bold text-slate-900 mb-1">{t.history.timeline[2].title}</p>
                <p className="text-sm text-slate-500 break-keep">{t.history.timeline[2].desc}</p>
              </div>
            </div>
          </TimelineProgress>
        </div>

        {/* 솔루션 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-black">{t.solutions.title}</h2>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href={localePath(locale, '/siot')} className="group bg-white rounded-2xl border border-slate-200/70 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              {/* 서수와 hover 색은 각 브랜드의 '글자로 쓰는' 등급을 쓴다. 12px 서수는 작은 글자라
                  4.5:1이 필요한데 siot-500(2.80:1)·bizmoa-500(3.68:1)·morak-600(3.10:1)은 면으로 쓰는 값이다.
                  Tailwind 기본 orange/blue와 하드코딩 hex도 함께 팔레트 토큰으로 정리했다.
                  설명은 NoBreak로 그린다 — 1024px에서 '원우회/·동문회'로 '·'가 줄 첫머리에 왔다. */}
              <p className="text-xs font-black tracking-widest text-siot-700 mb-3">01</p>
              <p className="font-black text-xl mb-2 group-hover:text-siot-700 transition-colors">{t.solutions.siot.name}</p>
              <p className="text-sm text-slate-500 break-keep leading-relaxed"><NoBreak>{t.solutions.siot.desc}</NoBreak></p>
            </Link>
            <Link href={localePath(locale, '/bizmoa')} className="group bg-white rounded-2xl border border-slate-200/70 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <p className="text-xs font-black tracking-widest text-bizmoa-600 mb-3">02</p>
              <p className="font-black text-xl mb-2 group-hover:text-bizmoa-600 transition-colors">{t.solutions.bizmoa.name}</p>
              <p className="text-sm text-slate-500 break-keep leading-relaxed"><NoBreak>{t.solutions.bizmoa.desc}</NoBreak></p>
            </Link>
            <Link href={localePath(locale, '/morak')} className="group bg-white rounded-2xl border border-slate-200/70 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <p className="text-xs font-black tracking-widest text-morak-800 mb-3">03</p>
              <p className="font-black text-xl mb-2 group-hover:text-morak-800 transition-colors">{t.solutions.morak.name}</p>
              <p className="text-sm text-slate-500 break-keep leading-relaxed"><NoBreak>{t.solutions.morak.desc}</NoBreak></p>
            </Link>
          </div>
        </div>

        {/* 오시는 길 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-black">{t.visit.title}</h2>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">{t.visit.address}</p>
                <p className="font-bold break-keep">{t.visit.addressLines[0]}<br />{t.visit.addressLines[1]}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">{t.visit.tel}</p>
                <p className="font-bold"><a href={telHref(locale, 'tel:070-4659-4804')} className="hover:text-gslt-600 transition-colors">{co.company.tel}</a></p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">{t.visit.email}</p>
                <p className="font-bold"><a href="mailto:gs7078103107@gmail.com" className="hover:text-gslt-600 transition-colors">gs7078103107@gmail.com</a></p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">{t.visit.ceo}</p>
                <p className="font-bold">{co.company.ceo}</p>
              </div>
            </div>
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200/70 min-h-[320px]">
              <iframe title={t.visit.mapTitle} className="w-full h-full min-h-[320px]" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={locale === DEFAULT_LOCALE ? MAP_SRC : `${MAP_SRC}&hl=${HTML_LANG[locale]}`}></iframe>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="rounded-3xl bg-slate-900 text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-black break-keep mb-2">{t.cta.title}</p>
              <p className="text-slate-400 break-keep">{t.cta.body}</p>
            </div>
            <Link href={localePath(locale, '/contact')}
              className="shrink-0 px-8 py-4 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 font-bold transition-all">{t.cta.button}</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
