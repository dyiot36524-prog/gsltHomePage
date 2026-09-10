import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TimelineProgress from './TimelineProgress';

export const metadata: Metadata = pageSeo({
  title: "회사소개",
  description:
    "2023년 설립한 무선 IoT 구축 전문기업 지에스엘티. 대표·연혁·수상 이력과 시공 5단계 절차를 소개합니다.",
  path: '/about',
});

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

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: '홈', path: '/' },
              { name: '회사소개', path: '/about' },
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
              alt="포브스 코리아 어워즈 수상 이미지. 트로피와 포브스 코리아 로고, 2026 최고의 브랜드 대상 엠블럼, 그리고 수상사 (주)지에스엘티 표기."
              width={2560}
              height={1600}
              sizes="(max-width: 1279px) 100vw, 1152px"
              className="w-full h-auto block"
              priority
            />
            {/* 위의 큰 그림은 수상 엠블럼(연출물)이고, 오른쪽 작은 사진은 시상식 현장이다.
                엠블럼만 있으면 '만든 그림'이지만 현장 사진이 붙으면 '실제로 받았다'가 된다.
                원본이 306px라 300px가 상한이다 — 더 키우면 뭉갠다.
                사진 속 인물은 이름을 적지 않는다. 그림만 보고 누구인지 단정할 수 없다. */}
            <div className="p-8 md:p-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-2xl md:text-4xl font-black leading-[1.2] break-keep text-white">
                  포브스 코리아 2026 소비자 선정 최고의 브랜드 대상
                </p>
                <p className="mt-3 text-lg md:text-xl font-bold text-amber-400 break-keep">
                  무선 IoT 기반 스마트 공간 부문
                </p>
                <p className="mt-4 text-sm md:text-base text-slate-300 break-keep leading-relaxed max-w-2xl">
                  포브스코리아 2026-02-27 선정, 한국경제TV 2026-04-21 보도.
                  배선 공사 없이 기존 공간을 스마트 공간으로 바꾸는 무선 IoT 구축 역량을 평가받았습니다.
                </p>
                <Link
                  href="/news"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white border-b-2 border-amber-400 pb-1 hover:text-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  보도 원문 보기
                </Link>
              </div>

              <figure className="lg:w-[300px] shrink-0">
                <Image
                  src="/img/forbes-ceremony-2026.png"
                  alt="포브스 코리아 2026 소비자 선정 최고의 브랜드 대상 시상식 현장. 수상자가 상패를 들고 무대에 서 있고, 배경 화면에 '2026 소비자선정 최고의 브랜드 大賞 Korea Best Brand Awards', 2026년 2월 27일 금요일 오전 10시 20분, 중앙일보·과학기술정보통신부·산업통상자원부·Forbes 로고가 보인다."
                  width={306}
                  height={230}
                  sizes="(max-width: 1023px) 90vw, 300px"
                  className="w-full h-auto block rounded-xl border border-white/15"
                />
                <figcaption className="mt-3 text-xs text-slate-400 break-keep">
                  시상식 현장 · 2026-02-27
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
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight break-keep mb-5">공간을 IoT로 짓는<br />구축 전문기업</h1>
          <p className="text-slate-600 text-lg break-keep max-w-2xl">지에스엘티(GSLT)는 배선 공사 없는 무선 IoT로 오피스·주거·빌딩을
            스마트 공간으로 완성합니다. 상담부터 유지보수까지, 구축의 전 과정을 책임집니다.</p>

          <dl className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-4 border-t border-slate-300 pt-5 max-w-2xl">
            <div className="flex items-baseline gap-2">
              <dt className="text-sm text-slate-600">설립</dt>
              <dd className="text-lg font-black tabular-nums text-slate-900">2023년</dd>
            </div>
            <span className="w-px h-4 bg-slate-300" aria-hidden="true" />
            <div className="flex items-baseline gap-2">
              <dt className="text-sm text-slate-600">자체 솔루션</dt>
              <dd className="text-lg font-black tabular-nums text-slate-900">3개</dd>
            </div>
            <span className="w-px h-4 bg-slate-300" aria-hidden="true" />
            <div className="flex items-baseline gap-2">
              <dt className="text-sm text-slate-600">IoT 제어 안정성</dt>
              <dd className="text-lg font-black tabular-nums text-slate-900">99.9%</dd>
            </div>
          </dl>
        </div>

        {/* IoT 구축 프로세스 */}
        <div className="bg-[#0a0a0f] py-20 md:py-28 mb-20 md:mb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white break-keep mb-4">IoT 구축, 이렇게 진행됩니다</h2>
            <p className="text-white/50 break-keep mb-14 max-w-2xl">무선 IoT라서 대규모 공사가 없습니다. 지금 쓰는 공간 그대로,
              다섯 단계면 스마트 공간이 됩니다.</p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="border-t border-white/15 pt-6">
                <p className="font-bold text-lg mb-2 flex items-baseline gap-2.5">
                  <span className="text-gslt-400 tabular-nums text-sm shrink-0">01</span>
                  <span className="text-white">상담·요구 분석</span>
                </p>
                <p className="text-white/55 text-sm break-keep leading-relaxed">공간 용도와 원하는 제어 범위를 듣고 최적 구성을 제안합니다.</p>
              </div>
              <div className="border-t border-white/15 pt-6">
                <p className="font-bold text-lg mb-2 flex items-baseline gap-2.5">
                  <span className="text-gslt-400 tabular-nums text-sm shrink-0">02</span>
                  <span className="text-white">현장 실측</span>
                </p>
                <p className="text-white/55 text-sm break-keep leading-relaxed">현장을 방문해 공간 구조와 설비 환경을 확인합니다.</p>
              </div>
              <div className="border-t border-white/15 pt-6">
                <p className="font-bold text-lg mb-2 flex items-baseline gap-2.5">
                  <span className="text-gslt-400 tabular-nums text-sm shrink-0">03</span>
                  <span className="text-white">설계·견적</span>
                </p>
                <p className="text-white/55 text-sm break-keep leading-relaxed">도면 위에 장비를 배치하고 견적을 산출합니다. 비즈모아로 견적서가 즉시 나옵니다.</p>
              </div>
              <div className="border-t border-white/15 pt-6">
                <p className="font-bold text-lg mb-2 flex items-baseline gap-2.5">
                  <span className="text-gslt-400 tabular-nums text-sm shrink-0">04</span>
                  <span className="text-white">시공·설치</span>
                </p>
                <p className="text-white/55 text-sm break-keep leading-relaxed">배선 공사 없이 무선 장비를 설치하고 통합 제어를 세팅합니다.</p>
              </div>
              <div className="border-t border-white/15 pt-6">
                <p className="font-bold text-lg mb-2 flex items-baseline gap-2.5">
                  <span className="text-gslt-400 tabular-nums text-sm shrink-0">05</span>
                  <span className="text-white">검수·유지보수</span>
                </p>
                <p className="text-white/55 text-sm break-keep leading-relaxed">현장 검수 후 인계하며, 1초 단위 모니터링으로 계속 관리합니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 성과 & 연혁 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-black">성과와 걸어온 길</h2>
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
                    alt="벤처기업확인서. 기업명 (주)지에스엘티, 확인유형 혁신성장유형, 유효기간 2026년 09월 09일부터 2029년 09월 08일까지, 발급번호 제20260909030005호, 벤처기업확인기관장 직인."
                    width={687}
                    height={903}
                    sizes="(max-width: 1023px) 90vw, 340px"
                    className="w-full h-auto block rounded-sm border border-slate-300/80 shadow-[0_20px_44px_-18px_rgb(15_23_42/0.4),0_4px_12px_-6px_rgb(15_23_42/0.25)] transition-transform duration-500 group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                  />
                  <span className="mt-5 block text-center text-xs font-bold text-slate-600 group-hover:text-gslt-700 transition-colors">
                    확인서 원본 크게 보기
                  </span>
                </a>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-black leading-snug break-keep text-slate-900">
                  벤처기업 확인
                </p>
                <p className="mt-2 text-sm font-bold text-gslt-700">혁신성장유형 · 2026</p>
                <p className="mt-5 text-slate-600 break-keep leading-relaxed max-w-[52ch]">
                  「벤처기업육성에 관한 특별법」 제25조에 따른 확인입니다. 혁신성장유형은
                  기술의 혁신성과 사업의 성장성을 평가해 확인하는 유형입니다.
                </p>
                <dl className="mt-8 border-t border-slate-300">
                  {[
                    ['확인기관', '벤처기업확인기관 · (사)벤처기업협회'],
                    ['발급번호', '제20260909030005호'],
                    ['유효기간', '2026.09.09 ~ 2029.09.08'],
                  ].map(([k, v]) => (
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
            {[
              {
                title: '디딤돌 R&D 국책과제 선정',
                by: '중소벤처기업부 · 2026',
                byClass: 'text-bizmoa-600',
                desc: '창업성장기술개발사업 — 무선 IoT 스마트 공간 기술 고도화',
                src: '/img/rnd-agreement-2026.png',
                alt: '국가연구개발사업 협약서 서류 이미지. 과제 정보와 협약 조건이 표로 정리되어 있고 하단에 서명란이 있다.',
                w: 158,
                h: 222,
              },
              {
                title: '초기창업패키지 선발 · 졸업',
                by: '중소벤처기업부 · 2025',
                byClass: 'text-emerald-700',
                desc: '기술 고도화·사업화 지원 프로그램 수행 완료',
                src: '/img/startup-package-certificate-2025.png',
                alt: '초기창업패키지 수행 확인서. 사업 수행 내용이 적혀 있고 하단에 창업진흥원장 직인이 찍혀 있다.',
                w: 157,
                h: 222,
              },
            ].map((c) => (
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
                <p className="text-5xl font-black text-slate-500 leading-none mb-3 select-none">2023</p>
                <p className="font-bold text-slate-900 mb-1">지에스엘티(GSLT) 설립</p>
                <p className="text-sm text-slate-500 break-keep">스마트 공간 솔루션 기업으로 창업, 시옷(Siot) 개발 착수</p>
              </div>
              <div className="relative md:pt-12">
                <div className="hidden md:block absolute top-0 left-0 w-[22px] h-[22px] rounded-full bg-white border-[3px] border-emerald-400 shadow-sm"></div>
                <p className="text-5xl font-black text-slate-500 leading-none mb-3 select-none">2025</p>
                <p className="font-bold text-slate-900 mb-1">초기창업패키지 선발</p>
                <p className="text-sm text-slate-500 break-keep">중소벤처기업부 프로그램 수행 후 졸업</p>
              </div>
              <div className="relative md:pt-12">
                <div className="tl-now hidden md:block absolute top-0 left-0 w-[22px] h-[22px] rounded-full bg-amber-400 border-[3px] border-white shadow-md"></div>
                <p className="text-5xl font-black text-amber-600 leading-none mb-3 select-none">2026</p>
                <p className="font-bold text-slate-900 mb-1">포브스 대상 · 디딤돌 R&D · 벤처기업 확인</p>
                <p className="text-sm text-slate-500 break-keep">대상 수상과 국책과제 선정에 이어, 9월 벤처기업(혁신성장유형) 확인을 받았습니다</p>
              </div>
            </div>
          </TimelineProgress>
        </div>

        {/* 솔루션 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-black">솔루션</h2>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/siot" className="group bg-white rounded-2xl border border-slate-200/70 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              {/* 서수와 hover 색은 각 브랜드의 '글자로 쓰는' 등급을 쓴다. 12px 서수는 작은 글자라
                  4.5:1이 필요한데 siot-500(2.80:1)·bizmoa-500(3.68:1)·morak-600(3.10:1)은 면으로 쓰는 값이다.
                  Tailwind 기본 orange/blue와 하드코딩 hex도 함께 팔레트 토큰으로 정리했다. */}
              <p className="text-xs font-black tracking-widest text-siot-700 mb-3">01</p>
              <p className="font-black text-xl mb-2 group-hover:text-siot-700 transition-colors">시옷 (Siot)</p>
              <p className="text-sm text-slate-500 break-keep leading-relaxed">배선 공사 없는 무선 IoT 통합 제어. 조명·블라인드·공조를 하나의 대시보드에서.</p>
            </Link>
            <Link href="/bizmoa" className="group bg-white rounded-2xl border border-slate-200/70 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <p className="text-xs font-black tracking-widest text-bizmoa-600 mb-3">02</p>
              <p className="font-black text-xl mb-2 group-hover:text-bizmoa-600 transition-colors">비즈모아 (BizMoa)</p>
              <p className="text-sm text-slate-500 break-keep leading-relaxed">도면 위 장비 배치부터 견적·계약·납품까지, IoT 시공업체용 올인원 SaaS.</p>
            </Link>
            <Link href="/morak" className="group bg-white rounded-2xl border border-slate-200/70 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <p className="text-xs font-black tracking-widest text-morak-800 mb-3">03</p>
              <p className="font-black text-xl mb-2 group-hover:text-morak-800 transition-colors">모락 (Morak)</p>
              <p className="text-sm text-slate-500 break-keep leading-relaxed">디지털 명함으로 만나는 기수제 모임(원우회·동문회) 커뮤니티 플랫폼.</p>
            </Link>
          </div>
        </div>

        {/* 오시는 길 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-28">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-black">오시는 길</h2>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">주소</p>
                <p className="font-bold break-keep">경기도 성남시 중원구 둔촌대로 388번길 24<br />우림라이온스밸리 3차 501호</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">전화</p>
                <p className="font-bold"><a href="tel:070-4659-4804" className="hover:text-gslt-600 transition-colors">070-4659-4804</a></p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">이메일</p>
                <p className="font-bold"><a href="mailto:gs7078103107@gmail.com" className="hover:text-gslt-600 transition-colors">gs7078103107@gmail.com</a></p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">대표자</p>
                <p className="font-bold">최광수</p>
              </div>
            </div>
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-slate-200/70 min-h-[320px]">
              <iframe title="GSLT 오시는 길 지도" className="w-full h-full min-h-[320px]" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%84%B1%EB%82%A8%EC%8B%9C%20%EC%A4%91%EC%9B%90%EA%B5%AC%20%EB%91%94%EC%B4%8C%EB%8C%80%EB%A1%9C388%EB%B2%88%EA%B8%B8%2024&z=16&output=embed"></iframe>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="rounded-3xl bg-slate-900 text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-black break-keep mb-2">우리 공간도 스마트해질 수 있을까?</p>
              <p className="text-slate-400 break-keep">무료 상담으로 구축 범위와 예상 비용을 알려드립니다.</p>
            </div>
            <Link href="/contact"
              className="shrink-0 px-8 py-4 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 font-bold transition-all">무료 상담 신청</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
