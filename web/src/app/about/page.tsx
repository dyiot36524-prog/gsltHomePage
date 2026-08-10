import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TimelineProgress from './TimelineProgress';

export const metadata: Metadata = {
  title: '회사소개 - IoT 구축 전문기업',
  description:
    '지에스엘티(GSLT)는 무선 IoT 구축 전문기업입니다. 상담부터 실측·설계·시공·유지보수까지, 오피스·주거·빌딩을 배선 공사 없이 스마트 공간으로 완성합니다.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    title: '회사소개 - GSLT | IoT 구축 전문기업',
    description:
      '상담부터 실측·설계·시공·유지보수까지. 배선 공사 없는 무선 IoT 구축 전문기업 지에스엘티입니다.',
    url: '/about',
    images: ['/img/og-image.png'],
    locale: 'ko_KR',
  },
};

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
            <div className="p-8 md:p-12">
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

          {/* 포브스 대상은 이 페이지 맨 위로 올라갔다. 여기서 또 크게 반복하면 광고가 된다 —
              연혁 항목으로만 남기고, 국책과제 두 건을 사실 그대로 잇는다. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="rounded-3xl bg-white border border-slate-200/70 p-8">
              <p className="text-xl md:text-2xl font-black leading-snug break-keep text-slate-900">
                디딤돌 R&amp;D 국책과제 선정
              </p>
              <p className="mt-2 text-sm font-bold text-bizmoa-600">중소벤처기업부 · 2026</p>
              <p className="mt-3 text-sm text-slate-500 break-keep leading-relaxed">
                창업성장기술개발사업 — 무선 IoT 스마트 공간 기술 고도화
              </p>
            </div>
            <div className="rounded-3xl bg-white border border-slate-200/70 p-8">
              <p className="text-xl md:text-2xl font-black leading-snug break-keep text-slate-900">
                초기창업패키지 선발 · 졸업
              </p>
              <p className="mt-2 text-sm font-bold text-emerald-700">중소벤처기업부 · 2025</p>
              <p className="mt-3 text-sm text-slate-500 break-keep leading-relaxed">
                기술 고도화·사업화 지원 프로그램 수행 완료
              </p>
            </div>
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
                <p className="font-bold text-slate-900 mb-1">디딤돌 R&D 선정 · 포브스 코리아 대상</p>
                <p className="text-sm text-slate-500 break-keep">국책과제 선정과 대상 수상을 함께 이룬 해</p>
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
