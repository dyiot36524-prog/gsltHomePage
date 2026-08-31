import type { Metadata } from 'next';
import { pageSeo } from '@/lib/seo';
import { jsonLd, breadcrumbSchema } from '@/lib/schema';
import type { CSSProperties } from 'react';
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
  title: '시옷 — 공간 예약 자동화',
  description:
    '예약 스케줄에 맞춰 공간이 스스로 준비됩니다. 테니스코트·골프타석·회의실의 조명·공조·스마트글라스를 예약과 함께 제어하는 시옷.',
  path: '/siot',
});

const ld = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '시옷 (Siot)',
  url: `${SITE.url}/siot`,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    '실시간 공간 예약과 예약 스케줄에 연동된 공간 자동화를 한 시스템으로 묶은 솔루션. ' +
    '테니스코트·골프타석·볼링장·당구장·회의실처럼 시간 단위로 배정되는 공간에서, ' +
    '예약이 확정되면 그 공간의 조명·공조·스마트글라스가 스케줄에 맞춰 스스로 켜지고 꺼진다.',
  featureList: [
    '실시간 공간 예약 — 타임테이블 편성, 입장 QR 발송, 노쇼 자동 기록',
    '예약 연동 자동화 — 공간마다 입실·퇴실 자동화와 출입 단말을 연결',
    '도면 제어 — 평면도 위에 장비와 자동화를 배치해 현장에 가지 않고 관제',
    '통합 제어 — 조명·공조·스마트글라스·전원·커튼·리모컨을 제조사와 무관하게 하나로',
    '회원·이력 관리 — 방문·노쇼 기록, 출입 인증 기록, CSV 반출',
  ],
  provider: { '@type': 'Organization', name: '지에스엘티(GSLT)' },
};

/** 원본의 인라인 `style="--d:.15s"` 대응. 애니메이션 지연을 CSS 커스텀 속성으로 넘긴다. */
const d = (value: string) => ({ '--d': value }) as CSSProperties;

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
        <section className="relative min-h-[92vh] flex items-center bg-[#0a0a0f] overflow-hidden pb-20 px-4 sm:px-6 lg:px-8">
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
                · Wireless IoT Construction
              </span>
            </div>
            <h1 className="font-black tracking-tight leading-[1.1] break-keep text-white text-4xl sm:text-6xl lg:text-7xl mb-8">
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner} style={d('.3s')}>예약한 시간에 맞춰,</span>
              </span>
              <span className={styles.heroLine}>
                <span className={`${styles.heroLineInner} text-siot-500`} style={d('.45s')}>공간이 스스로 준비됩니다.</span>
              </span>
            </h1>
            <p
              className={`${styles.fadeUp} max-w-2xl text-base md:text-lg text-white/55 leading-relaxed break-keep mb-12`}
              style={d('.7s')}
            >
              테니스코트·골프타석·볼링장·당구장·회의실처럼 시간 단위로 배정되는 공간을 위한
              솔루션입니다. 실시간 예약을 받고, 그 스케줄에 맞춰 조명·공조·스마트글라스를
              자동으로 제어합니다. 배선 공사 없이 지금 쓰는 공간 그대로 얹습니다.
            </p>
            <div className={`${styles.fadeUp} flex flex-wrap items-center gap-4 mb-16`} style={d('.9s')}>
              <Link href="/contact" className="px-8 py-4 rounded-full bg-siot-500 hover:bg-siot-400 text-slate-900 font-bold transition-all">도입 문의하기</Link>
              {/* 포트폴리오는 올릴 사례가 쌓일 때까지 메뉴에서 숨긴 상태다. 숨긴 곳으로
                  보내지 않고, 구축 과정을 실제로 설명하는 회사소개로 보낸다. */}
              <Link href="/about" className="px-8 py-4 rounded-full border-2 border-white/15 text-white/80 font-bold hover:border-siot-500 hover:text-siot-400 transition-all">구축 과정 보기</Link>
            </div>
            <div className={`${styles.fadeUp} grid grid-cols-3 max-w-xl gap-6`} style={d('1.1s')}>
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

        {/* 핵심 기능 */}
        {/* 예약 → 자동화 사슬. 이 페이지가 팔아야 하는 것은 '제어'가 아니라
            '예약이 곧 준비'라는 연결이다. 화면은 전부 성남 쇼룸에서 실제로 돌고 있는 것이다. */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-24">

            <Reveal>
              <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">How it works</p>
              <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                손님이 문을 열기 전에<br />불이 켜져 있습니다
              </h2>
              <p className="max-w-[68ch] text-slate-500 leading-[1.85] break-keep">
                예약을 받는 시스템과 공간을 제어하는 시스템이 따로 놀면, 결국 사람이 그
                사이를 메웁니다. 시간표를 보고 가서 스위치를 올리고, 끝나면 다시 가서 끕니다.
                시옷은 그 둘을 하나로 묶습니다. 예약이 확정되는 순간부터 퇴실까지가 한 흐름입니다.
              </p>
              <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { n: '예약 확정', d: '타임테이블에서 공간과 시간을 배정합니다.' },
                  { n: '입장 QR 발송', d: '예약자에게 입장용 QR을 보냅니다.' },
                  { n: 'QR 스캔·입실', d: '출입 단말에서 인증하면 입실로 기록됩니다.' },
                  { n: '자동화 실행', d: '그 공간의 조명·공조·스마트글라스가 켜집니다.' },
                  { n: '퇴실·정리', d: '시간이 끝나면 자동으로 꺼집니다. 안 오면 노쇼로 남습니다.' },
                ].map((s, i) => (
                  <li key={s.n} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <span className="block text-xs font-black text-siot-700 tabular-nums mb-2">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-bold text-slate-900 break-keep mb-1.5">{s.n}</p>
                    <p className="text-sm text-slate-500 leading-relaxed break-keep">{s.d}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">01 — 공간 예약</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                  예약부터 입실·전원까지<br />한 번에
                </h2>
                <p className="text-slate-500 leading-[1.85] break-keep mb-6">
                  타임테이블에서 끌어서 공간과 시간을 조정합니다. 공간마다 출입 단말과
                  입실·퇴실 자동화를 묶어 두면, 그다음은 시스템이 합니다. 예약 변경·QR 발송·
                  출입 인증이 한 이력에 남고 CSV로 반출됩니다.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {[
                    '예약·이용중·이용완료·노쇼를 자동으로 구분해 기록',
                    '직접 조작과 자동 처리를 나눠 남겨 책임 소재가 분명',
                    '회원별 방문·노쇼 횟수 집계 · 연락처는 마스킹 저장',
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5 break-keep">
                      <span aria-hidden="true" className="text-siot-500 font-bold shrink-0">·</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <Image
                src="https://res.cloudinary.com/r9pnckwj/image/upload/f_auto,q_auto,w_1600/v1788165657/ha7psroqjjge0gbsuedp.png"
                alt="시옷 공간 예약 화면 — 타임테이블에 예약이 배치되고 운영 요약이 표시된다"
                width={2048}
                height={1086}
                sizes="(max-width:1024px) 100vw, 640px"
                className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
              />
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <Image
                src="https://res.cloudinary.com/r9pnckwj/image/upload/f_auto,q_auto,w_1600/v1788165668/aqfxczxhqre56zxj0wuu.png"
                alt="시옷 공간 관리 화면 — 공간마다 출입 단말과 입실·퇴실 자동화가 연결되어 있다"
                width={2048}
                height={982}
                sizes="(max-width:1024px) 100vw, 640px"
                className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
              />
              <div className="lg:order-first">
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">02 — 연결</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                  공간마다 무엇을 켤지<br />미리 정해 둡니다
                </h2>
                <p className="text-slate-500 leading-[1.85] break-keep">
                  A코트에 들어오면 그 코트의 조명과 공조가, B코트면 B코트 것이 켜집니다.
                  공간·출입 단말·자동화를 한 줄로 묶어 두는 방식이라, 코트가 늘어도 설정만
                  추가하면 됩니다. 운영 중에는 입·퇴실을 손으로 눌러 넘길 수도 있습니다.
                </p>
              </div>
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">03 — 도면 제어</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                  현장에 가지 않아도<br />공간 전체가 한눈에
                </h2>
                <p className="text-slate-500 leading-[1.85] break-keep mb-6">
                  평면도 위에 장비를 그대로 배치합니다. 어느 자리의 무엇이 꺼져 있는지를
                  목록이 아니라 위치로 봅니다. 자동화 버튼도 도면 위에 얹어, 그 구역을
                  누르면 그 구역이 움직입니다.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed break-keep">
                  같은 회사의 비즈모아는 도면 위에 장비를 배치해 견적을 냅니다. 시옷은 같은
                  도면으로 운영합니다 — 견적서의 도면이 그대로 관제판이 됩니다.
                </p>
              </div>
              <Image
                src="https://res.cloudinary.com/r9pnckwj/image/upload/f_auto,q_auto,w_1600/v1788165649/xders8akw9r5gf70yztp.png"
                alt="시옷 도면 제어 화면 — 평면도 위에 장비와 자동화가 배치되어 있다"
                width={2048}
                height={1039}
                sizes="(max-width:1024px) 100vw, 640px"
                className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
              />
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <Image
                src="https://res.cloudinary.com/r9pnckwj/image/upload/f_auto,q_auto,w_1600/v1788165630/ob1mkhtesmc1i5xug9oh.png"
                alt="시옷 대시보드 — 전력 사용량, 장비 연결 현황, 자동화 로그 위젯"
                width={2048}
                height={1365}
                sizes="(max-width:1024px) 100vw, 640px"
                className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
              />
              <div className="lg:order-first">
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">04 — 관제</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                  잘 되는 것보다<br />안 되는 것을 먼저
                </h2>
                <p className="text-slate-500 leading-[1.85] break-keep">
                  대시보드는 연결된 장비 수 옆에 오프라인 장비 수를 붉게 띄웁니다. 눌러서
                  어느 것이 끊겼는지 바로 봅니다. 전력 사용량, 환경 센서, 재실·출입, 자동화
                  실행 이력을 위젯으로 골라 자기 화면을 만듭니다.
                </p>
              </div>
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">05 — 장면 자동화</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                  한 번 눌러<br />공간 하나를 통째로
                </h2>
                <p className="text-slate-500 leading-[1.85] break-keep mb-6">
                  장면 하나에 여러 장비를 묶습니다. &lsquo;입실&rsquo;을 누르면 그 구역의 전등과
                  빔프로젝터, 공조가 함께 켜지고 &lsquo;퇴실&rsquo;이면 함께 꺼집니다. 예약과 연결해
                  두면 사람이 누르지 않아도 시간에 맞춰 실행됩니다.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed break-keep">
                  성남 쇼룸에서는 스크린골프 3사(카카오VX 프렌즈스크린 · 골프존파크 ·
                  GDR 아카데미) 타석마다 입·퇴실 장면을 걸어 두고 실증하고 있습니다.
                </p>
              </div>
              <Image
                src="https://res.cloudinary.com/r9pnckwj/image/upload/f_auto,q_auto,w_1600/v1788165692/xycz4pulxk4euucgq3oc.png"
                alt="시옷 자동화 제어 화면 — 입실·퇴실 장면 카드가 나열되어 있다"
                width={2048}
                height={1586}
                sizes="(max-width:1024px) 100vw, 640px"
                className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
              />
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <Image
                src="https://res.cloudinary.com/r9pnckwj/image/upload/f_auto,q_auto,w_1600/v1788170672/dsawwe8q4bjyyyo1qllq.png"
                alt="시옷 이력 화면 — 예약 변경·QR 발송·출입 인증 기록이 한 표에 남는다"
                width={2048}
                height={2178}
                sizes="(max-width:1024px) 100vw, 640px"
                className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
              />
              <div className="lg:order-first">
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">06 — 이력·회원</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                  누가 언제 왔는지<br />전부 남습니다
                </h2>
                <p className="text-slate-500 leading-[1.85] break-keep mb-6">
                  예약 변경, 입장 QR 발송, 출입 인증이 한 표에 시간순으로 쌓입니다. 각 줄에
                  사람이 눌러 처리한 것인지 시스템이 자동으로 처리한 것인지, QR 스캔으로
                  들어온 것인지가 구분되어 남습니다.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {[
                    '결과를 예약확정·이용중·이용완료·노쇼로 자동 구분',
                    '회원별 방문·노쇼 횟수 집계 — 상습 노쇼를 운영에 반영',
                    '연락처는 마스킹해 보관 · 필요할 때 CSV로 반출',
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5 break-keep">
                      <span aria-hidden="true" className="text-siot-500 font-bold shrink-0">·</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">07 — 개별 제어</p>
                <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                  장비 하나까지<br />손으로 잡습니다
                </h2>
                <p className="text-slate-500 leading-[1.85] break-keep">
                  자동화가 전부는 아닙니다. 공간별·장비 종류별로 묶어 두고 스위치 한 구,
                  블라인드 열림 정도, 에어컨 온도를 개별로 조작합니다. 적외선 리모컨이 필요한
                  기존 기기도 그대로 붙습니다. 끊긴 장비는 카드에 오프라인으로 표시됩니다.
                </p>
              </div>
              <Image
                src="https://res.cloudinary.com/r9pnckwj/image/upload/f_auto,q_auto,w_1600/v1788170696/kf5vy5atuzxkhfuszak6.png"
                alt="시옷 홈 관리 화면 — 스위치·커튼·플러그·센서를 종류별 탭으로 제어한다"
                width={2048}
                height={1362}
                sizes="(max-width:1024px) 100vw, 640px"
                className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
              />
            </Reveal>

            <Reveal>
              <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">08 — 붙는 장비</p>
              <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                제조사가 달라도<br />하나로 묶습니다
              </h2>
              <p className="max-w-[68ch] text-slate-500 leading-[1.85] break-keep mb-8">
                Wi-Fi·블루투스·ZigBee·Z-Wave를 함께 지원하는 개방형 구조입니다. 특정 제조사에
                묶이지 않아 이미 설치된 설비를 그대로 두고 위에 얹을 수 있습니다.
                성남 쇼룸에서는 스크린골프 3사(카카오VX 프렌즈스크린·골프존파크·GDR 아카데미)
                시스템과 함께 타석 단위 입·퇴실 자동화를 실증하고 있습니다.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['조명·스위치', '점등·소등, 구역별 일괄 제어'],
                  ['공조·환기', '온도·습도에 따른 자동 운전'],
                  ['스마트글라스', '투명도 전환으로 구역 분리'],
                  ['전원 플러그', '기기별 사용 전력 계측'],
                  ['환경 센서', '온습도·미세먼지·조도·누수'],
                  ['재실·동작', '사람이 있을 때만 켜기'],
                  ['적외선 리모컨', '에어컨·TV 등 기존 기기'],
                  ['범용 컨트롤러', '접점 제어로 나머지 설비'],
                ].map(([t, d2]) => (
                  <li key={t} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="font-bold text-slate-900 break-keep mb-1">{t}</p>
                    <p className="text-sm text-slate-500 leading-relaxed break-keep">{d2}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <p className="text-siot-700 text-xs font-black tracking-widest uppercase mb-4">어디에 쓰나</p>
              <h2 className="text-3xl md:text-4xl font-black break-keep leading-tight mb-5">
                시간 단위로 배정되는<br />모든 공간
              </h2>
              <p className="max-w-[68ch] text-slate-500 leading-[1.85] break-keep mb-8">
                예약을 받고 시간이 끝나면 비우는 공간이라면 형태를 가리지 않습니다.
                공간마다 켤 것을 다르게 정해 두면 됩니다.
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {['테니스코트', '골프 타석', '볼링장', '당구장', '회의실', '스터디룸', '연습실', '공유 오피스'].map((t) => (
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

        {/* 공간 영상 — 기능 설명을 흰 지면에서 읽고 난 뒤, 실제 공간의 공기를 한 번 보여준다.
            영상은 연출 자료라 "우리 시공 현장"이라고 말하지 않는다. 문구는 전부 제품 이야기다. */}
        <section className="bg-[#0a0a0f] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
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
              <figure key={v.src} className="relative h-[300px] rounded-2xl overflow-hidden border border-white/10 group">
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
