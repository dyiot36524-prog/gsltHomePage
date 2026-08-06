import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import styles from './bizmoa.module.css';

export const metadata: Metadata = {
  title: '비즈모아(BizMoa) - IoT 시공 견적 자동화 SaaS',
  description:
    '건축 도면 위에 장비를 배치하면 견적서·계약서·납품확인서가 자동 생성됩니다. IoT·스마트홈 시공업체를 위한 올인원 B2B SaaS 비즈모아(BizMoa).',
  alternates: { canonical: '/bizmoa' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    locale: 'ko_KR',
    title: '비즈모아(BizMoa) - IoT 시공 견적 자동화 SaaS | GSLT',
    description: '도면 위에서 견적까지, 한 번에. 시공·설치업체용 올인원 SaaS 비즈모아.',
    url: '/bizmoa',
    images: ['/img/og-image.png'],
  },
};

const ld = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '비즈모아 (BizMoa)',
  url: 'https://home.gslt.kr/bizmoa',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    '건축 도면 위에 장비를 배치하면 견적서·계약서·납품확인서가 자동 생성되는 시공·설치업체용 올인원 B2B SaaS. 인건비 자동 산출과 프로젝트·권한 관리 포함.',
  provider: { '@type': 'Organization', name: '지에스엘티(GSLT)' },
};

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

export default function BizmoaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Header active="" />

      <main className={`${styles.page} bg-slate-50 text-slate-900`}>
        {/* 히어로: 블루프린트 */}
        <section
          className={`${styles.blueprint} relative min-h-[92vh] flex items-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8`}
        >
          <div className={`${styles.scanline} pointer-events-none`} />
          {/* 도면 위 장비 마커 */}
          {HERO_MARKERS.map((m) => (
            <div
              key={`${m.top}-${m.left}`}
              className={styles.marker}
              style={{ top: m.top, left: m.left, animationDelay: m.delay }}
            />
          ))}

          <div
            className="max-w-6xl mx-auto w-full relative z-10"
            style={{ textShadow: '0 1px 2px rgba(4,10,24,.5), 0 3px 12px rgba(4,10,24,.55)' }}
          >
            <div className={`${styles.fadeUp} flex items-center gap-4 mb-9`} style={d('.15s')}>
              <span className="block w-12 h-px bg-bizmoa-500" />
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-bizmoa-400">
                BizMoa · Quotation Automation
              </span>
            </div>
            <h1 className="font-black tracking-tight leading-[1.1] break-keep text-white text-4xl sm:text-6xl lg:text-7xl mb-8">
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner} style={d('.3s')}>도면 위에서 견적까지,</span>
              </span>
              <span className={styles.heroLine}>
                <span className={`${styles.heroLineInner} text-bizmoa-400`} style={d('.45s')}>한 번에.</span>
              </span>
            </h1>
            <p
              className={`${styles.fadeUp} max-w-2xl text-base md:text-lg text-white/55 leading-relaxed break-keep mb-12`}
              style={d('.7s')}
            >
              도면에 장비를 배치하는 순간 견적서가 만들어지고, 계약서와 납품확인서까지 자동으로 이어집니다.
              IoT·스마트홈 시공업체를 위한 올인원 SaaS입니다.
            </p>
            <div className={`${styles.fadeUp} flex flex-wrap items-center gap-4 mb-16`} style={d('.9s')}>
              <Link
                href="/?open=contact"
                className="px-8 py-4 rounded-full bg-bizmoa-500 hover:bg-bizmoa-600 text-white font-bold transition-all"
              >
                도입 문의하기
              </Link>
              <Link
                href="/#bizmoa"
                className="px-8 py-4 rounded-full border-2 border-white/15 text-white/80 font-bold hover:border-bizmoa-400 hover:text-bizmoa-400 transition-all"
              >
                홈에서 살펴보기
              </Link>
            </div>
            <div
              className={`${styles.fadeUp} flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em]`}
              style={d('1.1s')}
            >
              <span className="text-bizmoa-400">01 배치</span><span className="w-8 h-px bg-white/20" />
              <span className="text-white/50">02 견적</span><span className="w-8 h-px bg-white/20" />
              <span className="text-white/50">03 계약</span><span className="w-8 h-px bg-white/20" />
              <span className="text-white/50">04 관리</span><span className="w-8 h-px bg-white/20" />
              <span className="text-white/50">05 운영</span>
            </div>
          </div>
        </section>

        {/* 쇼케이스 */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl md:text-5xl font-black break-keep leading-tight mb-4">
                견적 작성에 쓰던 하루가<br />
                <span className="text-bizmoa-500">클릭 몇 번이 됩니다</span>
              </h2>
              <p className="text-slate-500 break-keep">
                배치된 장비 단가와 직종별 인건비가 자동 합산되고, Excel·PDF로 바로 내보냅니다.
              </p>
            </Reveal>
            <Reveal className="rounded-3xl overflow-hidden border border-slate-200/70 shadow-2xl bg-white max-w-5xl mx-auto">
              <Image
                src="/img/bizmoa1.JPG"
                alt="비즈모아 대시보드"
                width={2518}
                height={1319}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="w-full h-auto block"
              />
            </Reveal>

            <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200/70 p-7">
                <p className="text-xs font-black tracking-widest text-bizmoa-500 mb-3">DRAWING</p>
                <p className="font-bold text-lg mb-2 break-keep">도면 위 드래그 배치</p>
                <p className="text-sm text-slate-500 break-keep leading-relaxed">
                  층별 도면 관리와 AI 자동배치로 대규모 건물도 빠르게 설계합니다.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/70 p-7">
                <p className="text-xs font-black tracking-widest text-bizmoa-500 mb-3">QUOTATION</p>
                <p className="font-bold text-lg mb-2 break-keep">견적·서류 자동 생성</p>
                <p className="text-sm text-slate-500 break-keep leading-relaxed">
                  장비+노무비 결합 견적서, 계약서, 납품확인서가 자동으로 만들어집니다.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/70 p-7">
                <p className="text-xs font-black tracking-widest text-bizmoa-500 mb-3">MANAGE</p>
                <p className="font-bold text-lg mb-2 break-keep">프로젝트·권한 관리</p>
                <p className="text-sm text-slate-500 break-keep leading-relaxed">
                  진행 상태·견적 이력을 한 화면에서, 역할별 권한으로 안전하게.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 추천 고객 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/60">
          <Reveal className="max-w-6xl mx-auto text-center">
            <p className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-6">
              이런 회사에 맞습니다
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm">IoT / 스마트홈 시공업체</span>
              <span className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm">보안 / CCTV 설치업체</span>
              <span className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm">네트워크 인프라 업체</span>
              <span className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm">전기 / 통신 설비 시공사</span>
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
              <p className="text-2xl md:text-3xl font-black break-keep mb-2">도면만 있으면 시작할 수 있습니다</p>
              <p className="text-white/50 break-keep">데모와 도입 안내를 무료로 받아보세요.</p>
            </div>
            <Link
              href="/?open=contact"
              className="shrink-0 px-8 py-4 rounded-full bg-bizmoa-500 hover:bg-bizmoa-600 text-white font-bold transition-all relative"
            >
              무료 상담 신청
            </Link>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
