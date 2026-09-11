import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import AmbientVideo from '@/components/AmbientVideo';
import { SITE } from '@/lib/site';
import NodeCanvas from './NodeCanvas';
import CountUp from './CountUp';
import styles from './siot.module.css';

export const metadata: Metadata = pageSeo({
  title: '시옷 — 공간 운영 플랫폼',
  description:
    '예약과 출입, 조명과 공조, 에너지와 기록까지 한 플랫폼에서. 빌딩 전체를 한 화면으로 관제하는 지능형 공간 운영 솔루션 시옷.',
  path: '/siot',
});

const ld = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '시옷 (SIOT)',
  alternateName: 'SIOT Space Operating Platform',
  url: `${SITE.url}/siot`,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    '지능형 공간 운영 플랫폼. 전력·환경·재실·기기 상태를 한 화면에서 관제하고, ' +
    '실제 도면 위에서 장비를 실시간 제어하며, 공간 예약부터 QR 출입권 발급과 ' +
    '조명·공조 제어까지 하나의 흐름으로 잇는다. 조건이 겹치는 복합 레이어 자동화를 지원한다.',
  featureList: [
    '통합 관제 — 전력·환경·재실·기기 상태를 한 화면에서 실시간 확인',
    '공간 예약 — 층·회의실·타석별 타임라인 편성과 예약 등록',
    '출입 연동 — 예약 시간에만 유효한 모바일 QR 출입권, 문 열림과 동시에 조명·공조 실행',
    '자동화 — 시각·재실·구역 조건이 겹치는 복합 레이어 자동화',
    '도면 제어 — 실제 도면 위에 장비를 배치해 태블릿·PC·터치DID·모바일에서 제어',
    '에너지 — 기기별 전력 계측과 사용량 추이, 공기질 센서 측정',
  ],
  provider: { '@type': 'Organization', name: '지에스엘티(GSLT)' },
};

/** 원본의 인라인 `style="--d:.15s"` 대응. 애니메이션 지연을 CSS 커스텀 속성으로 넘긴다. */
const d = (value: string) => ({ '--d': value }) as CSSProperties;
/** 계단식 지연의 순번. 불빛이 지나가는 순서와 카드가 들어오는 순서를 CSS에 넘긴다. */
const i = (n: number) => ({ '--i': n }) as CSSProperties;

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

const SLIDE = {
  cover: slide('c_crop,x_1500,y_360,w_1870,h_1300', 'v1789053808/xr8ucukaldzgg96ispk9.png', 1870, 1300),
  booking: slide('c_crop,x_0,w_3414,y_420,h_750', 'v1789053855/wjzxdzgjjxbrsr4gs5xv.png', 3414, 750),
  control: slide('c_crop,x_0,w_3414,y_540,h_1380', 'v1789053818/mndewcysfx1ovq7rg5dg.png', 3414, 1380),
  floor: slide('c_crop,x_0,w_3414,y_330,h_1100', 'v1789053848/wng8jvfn5ef8kyx3f4wa.png', 3414, 1100),
  automation: slide('c_crop,x_0,w_3414,y_360,h_980', 'v1789053829/rdo4vb5jdfdh3y83mvet.png', 3414, 980),
} as const;

/** 예약이 확정된 뒤 문이 열리기까지. 제안서 19쪽의 네 단계 그대로다. */
const CHAIN = [
  { n: '관리자 예약 등록', d: '공간 · 시간 · 인원을 선택합니다.' },
  { n: '예약 현황 · 타임라인', d: '층 · 회의실 · 타석별 타임라인에 놓입니다.' },
  { n: '모바일 QR 출입권', d: '출입 가능한 시간에만 쓸 수 있는 코드가 나갑니다.' },
  { n: '출입 제어', d: '문 열림 + 조명·공조 ON + 예약 프로그램 실행.' },
] as const;

/** 제안서 17쪽의 복합 레이어 예시. 뒤 규칙이 앞 규칙을 덮어쓰므로 순서가 곧 정보다. */
const RULES = [
  '오전 8시에 모든 층의 실내 온도를 23℃로 맞춰.',
  '그 전에 움직임이 감지되면, 감지된 구역의 온도를 23℃로 맞춰.',
  '밤 10시에 공용부를 제외한 모든 구역의 전등과 EHP 전원을 끄되, 누군가 재실해 있다면 끄지 마.',
  '밤 10시 이후부터 오전 8시까지 움직임이 5분 동안 없으면 모든 전원을 꺼.',
] as const;

type Section = {
  title: ReactNode;
  lead: string;
  specs?: readonly (readonly [string, string])[];
  slide: Slide;
  alt: string;
};

/* 제안서 다섯 장이 이 페이지의 본문이다. 슬라이드 안에 박힌 글자는 기계가 못 읽으므로,
   같은 내용을 옆에 HTML 글자로 다시 세운다. */
const SECTIONS: readonly Section[] = [
  {
    title: (<>예약과 출입, 조명과 공조,<br />에너지와 기록까지</>),
    lead:
      '공간을 운영하는 데 필요한 일이 시스템마다 흩어져 있으면, 결국 사람이 그 사이를 ' +
      '오갑니다. 시옷은 다섯 가지를 하나의 플랫폼 위에 올립니다.',
    specs: [
      ['통합 관제', '전력 · 환경 · 재실 · 기기 상태를 한 화면에서 봅니다.'],
      ['공간 예약', '층 · 회의실 · 타석 단위로 시간을 배정합니다.'],
      ['출입 연동', '예약 시간에만 유효한 QR 출입권을 발급합니다.'],
      ['자동화', '조건이 겹치는 복합 규칙까지 걸어 둡니다.'],
      ['에너지', '기기별 사용 전력을 계측하고 추이를 봅니다.'],
    ],
    slide: SLIDE.cover,
    alt:
      '시옷(SIOT) 소개 슬라이드. SPACE OPERATING PLATFORM, 지능형 공간 운영을 도와주는 프리미엄 솔루션. ' +
      '노트북에 통합 대시보드가, 휴대폰에 예약 QR 출입권이 떠 있고 통합 관제·공간 예약·출입 연동·자동화·에너지 다섯 항목이 표시된다.',
  },
  {
    title: (<>공간 예약부터<br />공조 · 조명 · 출입제어까지 한 번에</>),
    lead:
      '예약 시스템을 개발한 노하우로, 예약부터 디바이스 제어와 출입통제까지 ' +
      '스케줄 데이터와 물리 설비를 잇습니다.',
    slide: SLIDE.booking,
    alt:
      '시옷 공간예약 솔루션 슬라이드. 관리자 예약 등록, 예약 현황·타임라인, 모바일 QR 출입권, ' +
      '출입 제어 네 단계가 모니터·노트북·휴대폰·출입 단말 사진으로 이어진다.',
  },
  {
    title: (<>한 화면에서<br />빌딩 전체를 관제합니다</>),
    lead:
      '전력 · 환경 · 재실 · 기기 상태가 실시간으로 모입니다. 실시간 알림과 현재 상태를 ' +
      '바로 나타내어, 어디를 먼저 봐야 하는지 화면이 알려줍니다.',
    specs: [
      ['오늘 전력 사용량', '통계 및 추이'],
      ['온라인 / 오프라인', '연결 디바이스 상태를 실시간으로'],
      ['공기질 측정', '실내 CO₂ 등 각종 환경 센서'],
      ['자동화 실행', '루틴화된 자동화의 실행 현황'],
    ],
    slide: SLIDE.control,
    alt:
      '시옷 빌딩관제 솔루션 슬라이드. 노트북 화면에 전력 사용량, 디바이스 연결 현황, 환경센서 측정값, ' +
      '재실·출입, 전력 상위 5개, 디바이스 로그, 자동화 로그 위젯이 한 대시보드에 모여 있다.',
  },
  {
    title: (<>실제 도면 위에서<br />실시간으로 제어합니다</>),
    lead:
      '각 층의 세분화된 IoT 장비와 이기종 장비를 실제 도면 위에 배치해, 한 화면 안에서 ' +
      '보여주고 제어합니다.',
    specs: [
      ['도면 위 배치', '어느 자리의 무엇이 꺼져 있는지를 목록이 아니라 위치로 봅니다.'],
      [
        '기기 무관',
        '태블릿 · PC · 대형 터치DID · 모바일까지. 상세한 권한 분리를 통해 각각의 장비에서 서로 실시간 연동됩니다.',
      ],
      [
        '견적에서 운영으로',
        '같은 회사의 비즈모아는 도면 위에 장비를 배치해 견적을 냅니다. 그 도면이 그대로 관제판이 됩니다.',
      ],
    ],
    slide: SLIDE.floor,
    alt:
      '시옷 도면 제어 슬라이드. 입체 평면도 위에 전등·TV전원·플러그·센서 아이콘이 자리마다 놓여 있고, ' +
      '노트북과 태블릿 두 기기에서 같은 도면을 제어하고 있다.',
  },
  {
    title: (<>다양한 장비의 제어와<br />복합 레이어 자동화</>),
    lead:
      '에어컨, 디밍조명, 매직글라스, 산업장비까지. 각 층의 세분화된 IoT 장비와 이기종 ' +
      '장비를 통합해 한 화면에서 보여주고 제어합니다.',
    slide: SLIDE.automation,
    alt:
      '시옷 자동화 슬라이드. 태블릿 두 대에 조명·센서·플러그·리모컨 등 기기 카드와 ' +
      '가상·모드·빔프로젝터 자동화 카드가 격자로 나열되어 있다.',
  },
];

/* 관리자가 쓰는 실제 화면. 제안서가 본문이 된 뒤로는 근거 자료다. */
const SCREENS = [
  {
    src: `${CDN},w_1600/v1788165657/ha7psroqjjge0gbsuedp.png`,
    w: 2048,
    h: 1086,
    cap: '예약 현황',
    desc: '타임테이블에 예약을 배치하고 운영 요약을 봅니다',
  },
  {
    src: `${CDN},w_1600/v1788165668/aqfxczxhqre56zxj0wuu.png`,
    w: 2048,
    h: 982,
    cap: '공간 관리',
    desc: '공간마다 출입 단말과 입실·퇴실 자동화를 연결합니다',
  },
  {
    src: `${CDN},w_1600/v1788165649/xders8akw9r5gf70yztp.png`,
    w: 2048,
    h: 1039,
    cap: '도면 제어',
    desc: '평면도 위에 장비와 자동화를 배치합니다',
  },
  {
    src: `${CDN},w_1600/v1788165630/ob1mkhtesmc1i5xug9oh.png`,
    w: 2048,
    h: 1365,
    cap: '대시보드',
    desc: '전력·환경·재실·자동화를 위젯으로 구성합니다',
  },
  {
    src: `${CDN},w_1600/v1788165692/xycz4pulxk4euucgq3oc.png`,
    w: 2048,
    h: 1586,
    cap: '자동화',
    desc: '입실·퇴실 장면을 카드로 묶어 관리합니다',
  },
  {
    src: `${CDN},w_1600/v1788170672/dsawwe8q4bjyyyo1qllq.png`,
    w: 2048,
    h: 2178,
    cap: '이력',
    desc: '예약 변경·QR 발송·출입 인증이 한 표에 남습니다',
  },
  {
    src: `${CDN},w_1600/v1788170696/kf5vy5atuzxkhfuszak6.png`,
    w: 2048,
    h: 1362,
    cap: '홈 관리',
    desc: '스위치·커튼·플러그·센서를 종류별로 제어합니다',
  },
] as const;

const DEVICE_KINDS = [
  ['조명 · 디밍', '점등·소등, 밝기와 색온도 조절'],
  ['공조 · 환기', '온도·습도에 따른 자동 운전'],
  ['매직글라스', '투명도 전환으로 구역 분리'],
  ['전원 플러그', '기기별 사용 전력 계측'],
  ['환경 센서', '온습도·CO₂·미세먼지·조도·누수'],
  ['재실 · 동작', '사람이 있을 때만 켜기'],
  ['적외선 리모컨', '에어컨·TV 등 기존 기기'],
  ['산업 장비', '접점 제어로 나머지 설비'],
] as const;

export default function SiotPage() {
  return (
    <>
      {/* 검색 결과의 경로 표시와 AI의 사이트 구조 이해에 함께 쓰인다. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(breadcrumbSchema([{ name: "홈", path: "/" }, { name: "시옷", path: "/siot" }])),
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
                alt="시옷"
                width={320}
                height={82}
                sizes="110px"
                className="h-5 md:h-6 w-auto shrink-0"
              />
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-siot-400">
                · Space Operating Platform
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
                  시옷 (SIOT)
                </span>
              </span>
              <span className={styles.heroLine}>
                <span
                  className={`${styles.heroLineInner} block text-[1.75rem] sm:text-4xl lg:text-[3.25rem] leading-[1.2] mt-1`}
                  style={d('.45s')}
                >
                  지능형 공간 운영을 도와주는
                </span>
              </span>
              <span className={styles.heroLine}>
                <span
                  className={`${styles.heroLineInner} block text-[1.75rem] sm:text-4xl lg:text-[3.25rem] leading-[1.2] text-siot-500`}
                  style={d('.6s')}
                >
                  프리미엄 솔루션
                </span>
              </span>
            </h1>
            <p
              className={`${styles.fadeUp} max-w-2xl text-base md:text-lg text-white/55 leading-relaxed break-keep mb-12`}
              style={d('.8s')}
            >
              보고 · 열고 · 끄는 일을 한 화면에서. 예약과 출입, 조명과 공조, 에너지와 기록까지
              하나의 플랫폼 위에 올립니다. 배선 공사 없이 지금 쓰는 공간 그대로 얹습니다.
            </p>
            <div className={`${styles.fadeUp} flex flex-wrap items-center gap-4 mb-16`} style={d('1s')}>
              <Link href="/contact" className="px-8 py-4 rounded-full bg-siot-500 hover:bg-siot-400 text-slate-900 font-bold transition-all">도입 문의하기</Link>
              {/* 포트폴리오는 올릴 사례가 쌓일 때까지 메뉴에서 숨긴 상태다. 숨긴 곳으로
                  보내지 않고, 구축 과정을 실제로 설명하는 회사소개로 보낸다. */}
              <Link href="/about" className="px-8 py-4 rounded-full border-2 border-white/15 text-white/80 font-bold hover:border-siot-500 hover:text-siot-400 transition-all">구축 과정 보기</Link>
            </div>
            <div className={`${styles.fadeUp} grid grid-cols-3 max-w-xl gap-6`} style={d('1.2s')}>
              {/* 쇼룸에서 실제로 돌고 있는 수치다. 화면에서 읽은 값만 쓴다 —
                  지어낸 수치를 넣지 않는 것이 이 회사의 규칙이다. */}
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={113} /></p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">연결 장비</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={17} /></p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">등록 자동화</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-white"><CountUp target={1} />초</p>
                <p className="text-xs md:text-sm text-white/55 font-medium mt-1">모니터링 주기</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 1막: 제안서 ──
            여기서부터 CTA 직전까지가 하나의 어두운 방이고, 빛은 화면에서만 나온다.
            슬라이드는 1280×720 설계물이라 지면 전체 폭에서 제 크기로 앉는다. */}
        <section className="bg-[#0a0a0f] px-4 sm:px-6 lg:px-8 pt-10 pb-28 md:pb-36 space-y-28 md:space-y-36 overflow-x-clip">
          {SECTIONS.map((s, n) => (
            <Reveal key={s.alt} className={`${styles.feature} max-w-7xl mx-auto`}>
              {/* 사양표가 있으면 [제목+리드 | 사양], 없으면 [제목 | 리드]로 두 기둥을 채운다.
                  없는 쪽을 비워 두면 오른쪽에 큰 구멍이 남는다. */}
              <div className={styles.head}>
                {s.specs ? (
                  <div>
                    <h2 className="text-[2rem] md:text-[2.75rem] font-black tracking-tight leading-[1.15] break-keep text-white">
                      {s.title}
                    </h2>
                    <p className="mt-6 text-lg md:text-xl text-white/70 leading-[1.75] break-keep">{s.lead}</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[2rem] md:text-[2.75rem] font-black tracking-tight leading-[1.15] break-keep text-white">
                      {s.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 leading-[1.75] break-keep lg:pb-2">{s.lead}</p>
                  </>
                )}
                {s.specs && (
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
                    src={s.slide.src}
                    alt={s.alt}
                    width={s.slide.w}
                    height={s.slide.h}
                    sizes="(max-width: 1280px) 100vw, 1216px"
                    className={styles.shot}
                  />
                </span>
              </figure>

              {/* 예약 슬라이드 아래에는 네 단계를 다시 세운다. 그림 속 순서를 불빛이
                  한 번 지나가며 짚어 주는 것이 이 페이지의 유일한 연출이다. */}
              {n === 1 && (
                <Reveal as="ol" className={`${styles.chain} mt-14`}>
                  {CHAIN.map((c, k) => (
                    <li key={c.n} className={styles.chainStep} style={i(k)}>
                      <span aria-hidden="true" className={styles.chainDot} />
                      <p className="font-bold text-white break-keep mb-1.5">{c.n}</p>
                      <p className="text-sm text-white/60 leading-[1.7] break-keep">{c.d}</p>
                    </li>
                  ))}
                </Reveal>
              )}

              {/* 자동화 슬라이드 아래에는 실제 규칙 문장을 옮긴다. 이 제품이 무엇을
                  할 수 있는지는 기능 이름보다 이 네 줄이 정확하게 말한다. */}
              {n === 4 && (
                <Reveal className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-9">
                  <p className="text-sm font-bold text-siot-500 mb-6">고도화된 복합 레이어 자동화의 예</p>
                  <ol className="space-y-4">
                    {RULES.map((r, k) => (
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
            <h2 className="text-[2rem] md:text-[2.75rem] font-black tracking-tight leading-[1.15] break-keep text-white">
              실제로 돌고 있는 화면
            </h2>
            <p className="mt-6 max-w-[62ch] text-lg md:text-xl text-white/70 leading-[1.75] break-keep">
              성남 쇼룸에서 운영 중인 관리자 화면입니다. 스크린골프 3사(카카오VX
              프렌즈스크린 · 골프존파크 · GDR 아카데미) 시스템과 함께 타석 단위
              입·퇴실 자동화를 실증하고 있습니다.
            </p>
          </Reveal>

          <Reveal className={`${styles.feature} ${styles.ref} max-w-7xl mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>
            {SCREENS.map((s) => (
              <figure key={s.cap} className={styles.stage}>
                <span aria-hidden="true" className={styles.bloom} />
                <span className={styles.screen}>
                  <Image
                    src={s.src}
                    alt={`시옷 ${s.cap} 화면 — ${s.desc}`}
                    width={s.w}
                    height={s.h}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"
                    className={styles.shot}
                  />
                </span>
                <figcaption className="mt-4">
                  <span className="block font-bold text-white break-keep">{s.cap}</span>
                  <span className="block mt-1 text-sm text-white/55 leading-relaxed break-keep">{s.desc}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        {/* 공간 영상 — 화면을 다 보고 난 뒤, 실제 공간의 공기를 한 번 보여주며 어두운 방을 닫는다.
            영상은 연출 자료라 "우리 시공 현장"이라고 말하지 않는다. 문구는 전부 제품 이야기다. */}
        <section className="bg-[#0a0a0f] pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                src: '/img/office2.mp4',
                title: '사라지는 컨트롤 패널',
                desc: '조명·블라인드·공조를 스마트폰 하나로. 복잡한 스위치 없이 언제 어디서나 공간을 바꿉니다.',
              },
              {
                src: '/img/office4.mp4',
                title: '무겁고 복잡한 시스템을 넘어',
                desc: '기존 스마트 시스템이 닿지 못한 세밀한 공간 제어를 시옷의 미니 IoT가 맡습니다.',
              },
            ].map((v) => (
              <figure key={v.src} className="relative h-[300px] md:h-[380px] rounded-2xl overflow-hidden border border-white/10 group">
                <AmbientVideo
                  src={v.src}
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-[2s] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                {/* 글자가 앉는 아래쪽을 확실히 눌러 준다 — 영상 프레임이 밝아져도 대비가 무너지지 않게 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <p className="text-lg font-bold text-white mb-1.5 break-keep">{v.title}</p>
                  <p className="text-slate-300 text-sm break-keep leading-relaxed">{v.desc}</p>
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
                  제조사가 달라도<br />하나로 묶습니다
                </h2>
                <p className="max-w-[68ch] text-slate-500 leading-[1.85] break-keep">
                  Wi-Fi·블루투스·ZigBee·Z-Wave를 함께 지원하는 개방형 구조입니다. 특정 제조사에
                  묶이지 않아 이미 설치된 설비를 그대로 두고 위에 얹을 수 있습니다. 에어컨과
                  디밍조명, 매직글라스, 산업장비까지 한 화면 안에서 함께 제어합니다.
                </p>
              </Reveal>

              <Reveal as="ul" className={`${styles.stagger} mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
                {DEVICE_KINDS.map(([t, desc], n) => (
                  <li
                    key={t}
                    style={i(n)}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-siot-500/60"
                  >
                    <p className="font-bold text-slate-900 break-keep mb-1">{t}</p>
                    <p className="text-sm text-slate-500 leading-relaxed break-keep">{desc}</p>
                  </li>
                ))}
              </Reveal>
            </div>

            <Reveal>
              <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                시간 단위로 배정되는<br />모든 공간
              </h2>
              <p className="max-w-[68ch] text-slate-500 leading-[1.85] break-keep mb-8">
                예약을 받고 시간이 끝나면 비우는 공간이라면 형태를 가리지 않습니다.
                공간마다 켤 것을 다르게 정해 두면 됩니다.
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {['회의실', '테니스코트', '골프 타석', '볼링장', '당구장', '스터디룸', '연습실', '공유 오피스'].map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    {t}
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
