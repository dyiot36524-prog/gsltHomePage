import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { SITE } from '@/lib/site';
import NodeCanvas from './NodeCanvas';
import CountUp from './CountUp';
import styles from './siot.module.css';

const TITLE = '시옷(Siot) - 무선 IoT 통합 제어';
const DESCRIPTION =
  '배선 공사 없는 무선 IoT 구축 솔루션 시옷(Siot). 조명·블라인드·공조를 하나의 대시보드에서 제어하고, 1초 단위 실시간 모니터링과 99.9% 제어 안정성을 제공합니다.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/siot' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'ko_KR',
    title: `${TITLE} | ${SITE.name}`,
    description: '배선 공사 없이 공간 전체를 제어합니다. 무선 IoT 구축 솔루션 시옷.',
    url: '/siot',
    images: ['/img/og-image.png'],
  },
};

const ld = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '시옷 (Siot)',
  url: `${SITE.url}/siot`,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    '배선 공사 없는 무선 IoT 통합 제어 솔루션. 조명·블라인드·공조를 하나의 대시보드에서 제어하고 1초 단위 실시간 모니터링을 제공한다.',
  provider: { '@type': 'Organization', name: '지에스엘티(GSLT)' },
};

/** 원본의 인라인 `style="--d:.15s"` 대응. 애니메이션 지연을 CSS 커스텀 속성으로 넘긴다. */
const d = (value: string) => ({ '--d': value }) as CSSProperties;

export default function SiotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <Header active="" />

      <main className={`${styles.page} bg-slate-50 text-slate-900`}>
        {/* 히어로: IoT 노드 네트워크 */}
        <section className="relative min-h-[92vh] flex items-center bg-[#0a0a0f] overflow-hidden pb-20 px-4 sm:px-6 lg:px-8">
          <NodeCanvas className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute -bottom-40 -right-32 w-[34rem] h-[34rem] bg-siot-600 rounded-full blur-[160px] opacity-[0.12] pointer-events-none" />

          <div
            className="max-w-6xl mx-auto w-full relative z-10"
            style={{ textShadow: '0 1px 2px rgba(4,6,12,.5), 0 3px 12px rgba(4,6,12,.55)' }}
          >
            <div className={`${styles.fadeUp} flex items-center gap-4 mb-9`} style={d('.15s')}>
              <span className="block w-12 h-px bg-siot-500" />
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-siot-400">
                Siot · Wireless IoT Construction
              </span>
            </div>
            <h1 className="font-black tracking-tight leading-[1.1] break-keep text-white text-4xl sm:text-6xl lg:text-7xl mb-8">
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner} style={d('.3s')}>배선 공사 없이,</span>
              </span>
              <span className={styles.heroLine}>
                <span className={`${styles.heroLineInner} text-siot-500`} style={d('.45s')}>공간 전체를 제어합니다.</span>
              </span>
            </h1>
            <p
              className={`${styles.fadeUp} max-w-2xl text-base md:text-lg text-white/55 leading-relaxed break-keep mb-12`}
              style={d('.7s')}
            >
              시옷은 무선 IoT 장비로 조명·블라인드·공조를 하나의 대시보드에 통합합니다.
              벽을 뜯지 않고, 지금 쓰는 공간 그대로 스마트 공간이 됩니다.
            </p>
            <div className={`${styles.fadeUp} flex flex-wrap items-center gap-4 mb-16`} style={d('.9s')}>
              <Link href="/contact" className="px-8 py-4 rounded-full bg-siot-500 hover:bg-siot-400 text-slate-900 font-bold transition-all">도입 문의하기</Link>
              {/* 원래 /#siot 로 갔지만 Next 홈에는 아직 시옷 섹션이 없다. 실제로 존재하는 시공 기록으로 보낸다. */}
              <Link href="/portfolio" className="px-8 py-4 rounded-full border-2 border-white/15 text-white/80 font-bold hover:border-siot-500 hover:text-siot-400 transition-all">시공사례 보기</Link>
            </div>
            <div className={`${styles.fadeUp} grid grid-cols-3 max-w-xl gap-6`} style={d('1.1s')}>
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={99.9} decimals={1} />%</p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">제어 안정성</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={1} />초</p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">모니터링 주기</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={0} /></p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">배선 공사</p>
              </div>
            </div>
          </div>
        </section>

        {/* 핵심 기능 */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-24">

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">01 — Main Control</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">전체 공간을<br />한눈에</h2>
                <p className="text-slate-500 leading-relaxed break-keep mb-6">모든 층, 모든 방의 장비 상태가 하나의 관제 화면에 모입니다.
                  온도·조명·전력 상태를 실시간으로 확인하고 이상 신호를 즉시 감지합니다.</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>1초 단위 실시간 모니터링</li>
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>이상 신호 즉시 감지·알림</li>
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>중앙 집중식 관제</li>
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200/70 shadow-xl bg-white">
                <Image src="/img/siot3.png" alt="시옷 메인 관제 화면" width={1440} height={1674} sizes="(max-width: 1024px) 100vw, 544px"
                  className="w-full h-auto block" />
              </div>
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="lg:order-2">
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">02 — Unified Control</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">조명부터 공조까지<br />통합 제어</h2>
                <p className="text-slate-500 leading-relaxed break-keep mb-6">장치 종류가 달라도 제어는 하나의 방식으로.
                  스마트폰과 웹에서 공간의 모든 디테일을 손끝으로 조절합니다.</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>조명 · 블라인드 · 공조 통합</li>
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>장치 무제한 확장</li>
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>모바일 · 웹 어디서나</li>
                </ul>
              </div>
              <div className="lg:order-1 rounded-2xl overflow-hidden border border-slate-200/70 shadow-xl bg-white">
                <Image src="/img/siot1.png" alt="시옷 통합 제어 대시보드" width={1440} height={1144} sizes="(max-width: 1024px) 100vw, 544px"
                  className="w-full h-auto block" />
              </div>
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">03 — Scene Mode</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">원클릭으로 완성되는<br />공간 환경</h2>
                <p className="text-slate-500 leading-relaxed break-keep mb-6">회의·집중·휴식 등 상황별 환경을 프리셋으로 저장해 두고,
                  버튼 하나로 모든 장치를 동시에 전환합니다.</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>상황별 프리셋 저장</li>
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>모든 장치 동시 전환</li>
                  <li className="flex gap-3"><span className="text-siot-500 font-black" aria-hidden="true">—</span>무한 커스터마이징</li>
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200/70 shadow-xl bg-white">
                <Image src="/img/siot2.png" alt="시옷 장면 모드 프리셋" width={1440} height={900} sizes="(max-width: 1024px) 100vw, 544px"
                  className="w-full h-auto block" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 프로세스 배너 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/60">
          <Reveal className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black break-keep mb-2">상담부터 유지보수까지, 5단계로 끝납니다</h2>
                <p className="text-slate-500 break-keep">상담 · 실측 → 설계 · 견적 → 시공 · 설치 → 검수 → 유지보수</p>
              </div>
              <Link href="/about" className="shrink-0 px-7 py-3.5 rounded-full border-2 border-slate-200 font-bold text-sm text-slate-600 hover:border-siot-500 hover:text-siot-700 transition-all">구축 프로세스 보기</Link>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-6xl mx-auto rounded-3xl bg-[#0a0a0f] text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-16 w-72 h-72 bg-siot-600 rounded-full blur-[120px] opacity-20 pointer-events-none" />
            <div className="text-center md:text-left relative">
              <p className="text-2xl md:text-3xl font-black break-keep mb-2">우리 공간에는 어떻게 적용될까?</p>
              <p className="text-white/50 break-keep">현장 조건에 맞는 구성을 무료로 제안해 드립니다.</p>
            </div>
            <Link href="/contact" className="shrink-0 px-8 py-4 rounded-full bg-siot-500 hover:bg-siot-400 text-slate-900 font-bold transition-all relative">무료 상담 신청</Link>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
