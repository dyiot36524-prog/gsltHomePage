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

/**
 * 배치 → 견적 → 계약 → 관리 → 운영. 기존 사이트의 비즈모아 쇼케이스에 있던 5단계를
 * 문구·세부 기능·연결된 화면까지 그대로 옮긴 것이다. 문구를 새로 짓지 않았다.
 * shots는 전부 실제 비즈모아 화면 캡처이고, 원본이 각 단계에 붙여 두었던 짝을 유지한다.
 */
const STEPS = [
  {
    no: '01',
    title: '도면 위에 장비를 드래그하여 배치',
    desc: '건축 도면 위에 IoT 장비를 컬러 마커로 직관적으로 배치합니다. 대규모 건물도 층 단위로 빠르게 설계할 수 있습니다.',
    items: [
      { name: '층별 도면 관리', desc: '건물의 층마다 도면을 등록해 오가며 배치' },
      { name: 'AI 자동배치 추천', desc: '최적 위치를 자동 추천받아 설계 시간 단축' },
      { name: '장비 카테고리 트리', desc: '품목별 트리에서 장비를 골라 바로 도면 위로' },
    ],
    punch: '드래그 한 번으로 배치 완료.',
    shots: [{ src: '/img/bizmoa5.JPG', alt: '비즈모아 도면 편집기 — 건축 도면 위에 IoT 장비가 컬러 마커로 배치된 화면' }],
  },
  {
    no: '02',
    title: '장비 + 노무비 결합 견적서 자동 생성',
    desc: '배치를 마치는 순간, 장비 단가와 직종별 인건비가 결합된 견적서가 즉시 만들어집니다.',
    items: [
      { name: '장비 + 노무비 자동 합산', desc: '배치된 장비 단가와 직종별 인건비가 즉시 합산' },
      { name: '소비자용 · 관리자용 분리', desc: '뷰를 구분하고 할인율을 견적별로 적용' },
      { name: 'Excel · PDF 내보내기', desc: '완성된 견적서를 고객에게 바로 전달' },
    ],
    punch: '견적서, 배치 즉시 생성.',
    shots: [{ src: '/img/bizmoa6.JPG', alt: '비즈모아 견적서 화면 — 장비 단가와 인건비가 항목별로 합산된 견적 내역' }],
  },
  {
    no: '03',
    title: '계약서부터 납품까지 원클릭 자동 생성',
    desc: '견적이 확정되면 정식 계약서와 납품확인서가 자동으로 작성됩니다. 현장 검수까지 시스템 안에서 끝납니다.',
    items: [
      { name: '계약서 자동 작성', desc: '견적 데이터가 그대로 정식 계약서로 변환' },
      { name: '납품 검수 체크리스트', desc: '품목별 납품 확인으로 현장 관리 완결' },
      { name: 'PDF 정식 문서 출력', desc: '서명만 하면 되는 문서로 바로 출력' },
    ],
    punch: '계약·납품 서류, 원클릭.',
    shots: [
      { src: '/img/bizmoa7.JPG', alt: '비즈모아 계약서 화면 — 견적 데이터가 옮겨진 정식 계약서 양식' },
      { src: '/img/bizmoa8.JPG', alt: '비즈모아 납품확인서 화면 — 품목별 납품 확인 체크리스트' },
    ],
  },
  {
    no: '04',
    title: '프로젝트 한눈에, 견적 이력까지',
    desc: '진행 중인 모든 현장의 상태와 금액을 카드 한 장씩으로 파악하고, 견적 수정 이력은 버전으로 남습니다.',
    items: [
      { name: '카드형 프로젝트 대시보드', desc: '진행 상태 · 투입 인력 · 금액을 카드로 요약' },
      { name: '견적 버전 이력 관리', desc: '수정할 때마다 버전으로 보존, 이력 추적' },
      { name: '진행률 추적', desc: '프로젝트별 진척도를 숫자로 확인' },
    ],
    punch: '모든 프로젝트, 한 화면.',
    shots: [
      { src: '/img/bizmoa3.JPG', alt: '비즈모아 프로젝트 카드 화면 — 현장별 진행 상태와 금액이 카드로 정리된 대시보드' },
      { src: '/img/bizmoa4.JPG', alt: '비즈모아 견적 이력 화면 — 견적 수정 버전이 시간순으로 남은 목록' },
    ],
  },
  {
    no: '05',
    title: '인건비 산출부터 권한 관리까지',
    desc: '단가 체계와 팀 권한을 한 번 세팅하면, 모든 프로젝트가 같은 기준으로 운영됩니다.',
    items: [
      { name: '직급별 단가 자동 계산', desc: '시급 · 일급 · 월급이 공식에 따라 산출' },
      { name: '견적서 노무비 자동 반영', desc: '견적 작성 시 인건비가 자동으로 포함' },
      { name: '3단계 접근 권한', desc: '관리자 · 매니저 · 관리담당 역할별 제어' },
    ],
    punch: '권한 3단계, 데이터는 안전하게.',
    shots: [
      { src: '/img/bizmoa2.JPG', alt: '비즈모아 인건비 단가표 화면 — 직급별 시급·일급·월급 단가 설정' },
      { src: '/img/bizmoa9.JPG', alt: '비즈모아 사용자 관리 화면 — 관리자·매니저·관리담당 권한 설정' },
    ],
  },
] as const;

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
              {/* 히어로 전체에 걸린 어두운 text-shadow가 밝은 버튼 면 위 먹색 글자에는 번짐으로 보여 끈다 */}
              <Link
                href="/contact"
                className="px-8 py-4 rounded-full bg-bizmoa-500 hover:bg-bizmoa-400 text-slate-900 font-bold transition-all [text-shadow:none]"
              >
                도입 문의하기
              </Link>
              {/* 홈의 비즈모아 패널은 아직 이관 전이라 #bizmoa 앵커가 없다. 패널이 올라오면 앵커로 되돌린다 */}
              <Link
                href="/"
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
              <span className="text-white/55">02 견적</span><span className="w-8 h-px bg-white/20" />
              <span className="text-white/55">03 계약</span><span className="w-8 h-px bg-white/20" />
              <span className="text-white/55">04 관리</span><span className="w-8 h-px bg-white/20" />
              <span className="text-white/55">05 운영</span>
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

          </div>
        </section>

        {/* 5단계 — 배치에서 운영까지.
            도면에서 시작한 데이터가 견적·계약·납품·정산까지 끊기지 않고 이어진다는 것이
            이 제품의 전부다. 그래서 기능을 카드로 나열하지 않고 순서대로 밟는다.
            번호를 쓰는 이유도 그것이다 — 여기서는 순서가 정보다.
            화면은 전부 실제 비즈모아 화면이다. */}
        <section className="pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
            {STEPS.map((s, i) => (
              <Reveal
                key={s.no}
                // 단계마다 화면이 한 장 또는 두 장이라 높이가 다르다. 가운데 정렬하면
                // 짧은 쪽 아래로 빈 구간이 크게 남으므로 위를 맞춘다.
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start"
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-4xl md:text-5xl font-black tabular-nums text-bizmoa-500 leading-none">
                      {s.no}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-black text-slate-900 break-keep leading-tight">
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

                <div className={`space-y-4 min-w-0 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {s.shots.map((shot) => (
                    <figure
                      key={shot.src}
                      className="rounded-2xl overflow-hidden border border-slate-200/70 shadow-xl bg-white"
                    >
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={2518}
                        height={1319}
                        sizes="(max-width: 1024px) 100vw, 512px"
                        className="w-full h-auto block"
                      />
                    </figure>
                  ))}
                </div>
              </Reveal>
            ))}
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
              <p className="text-white/55 break-keep">데모와 도입 안내를 무료로 받아보세요.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 px-8 py-4 rounded-full bg-bizmoa-500 hover:bg-bizmoa-400 text-slate-900 font-bold transition-all relative"
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
