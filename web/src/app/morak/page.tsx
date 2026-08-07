import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import styles from './morak.module.css';

export const metadata: Metadata = {
  title: '모락(Morak) - 기수제 모임 커뮤니티 플랫폼',
  description:
    '원우회·동문회를 위한 모임 커뮤니티 플랫폼 모락(Morak). 디지털 명함 QR 교환, 기수·직책 관리, 일정·참석 관리, 원우수첩까지 — 흩어진 모임 운영을 한곳에서.',
  alternates: { canonical: '/morak' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    title: '모락(Morak) - 기수제 모임 커뮤니티 플랫폼 | GSLT',
    description: '기수제 모임을 한곳에서. 디지털 명함으로 만나는 원우회·동문회 커뮤니티.',
    url: '/morak',
    images: ['/img/og-image.png'],
    locale: 'ko_KR',
  },
  icons: { icon: '/img/morak-icon.png' },
};

/** 원본 <head>의 JSON-LD */
const ld = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '모락 (Morak)',
  url: 'https://morac.gslt.kr',
  applicationCategory: 'SocialNetworkingApplication',
  operatingSystem: 'Web, Android',
  description:
    '기수제 모임(원우회·동문회)을 위한 모바일 커뮤니티 플랫폼. 디지털 명함 QR 교환, 기수·직책 관리, 일정·참석 관리, 원우수첩을 제공한다.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  provider: { '@type': 'Organization', name: '지에스엘티(GSLT)' },
};

/** CSS의 var(--d) 애니메이션 지연을 인라인으로 넘기기 위한 헬퍼 */
const d = (value: string) => ({ '--d': value }) as CSSProperties;

const FEATURES = [
  {
    tag: 'CARD · QR',
    title: '디지털 명함',
    desc: '명함 여러 장을 만들어 모임마다 골라 쓰고, QR로 즉석 교환합니다. 종이 명함은 촬영해 인맥으로 저장.',
  },
  {
    tag: 'COHORT',
    title: '기수 · 직책 관리',
    desc: '"12기 총무", "7기 회원" — 기수와 직책이 명함에 함께 보여 처음 만나도 관계가 바로 파악됩니다.',
  },
  {
    tag: 'EVENT',
    title: '일정 · 참석 관리',
    desc: '모임 일정과 참석 응답(RSVP), 대기열, 리마인더 푸시. 내 모임 일정과 멤버 생일이 캘린더 하나에.',
  },
  {
    tag: 'FEED · POLL',
    title: '게시판 · 투표',
    desc: '공지·자유글·경조사 소식과 피드에서 바로 참여하는 투표. 중요한 글은 푸시로 전달됩니다.',
  },
  {
    tag: 'CHAT',
    title: '채팅',
    desc: '1:1 대화와 모임 단체방. 모임을 만들면 단체 채팅방이 자동으로 생깁니다.',
  },
  {
    tag: 'DIRECTORY',
    title: '원우수첩(명부)',
    desc: '기수별 회원 명부를 언제나 최신으로. 엑셀 명단을 붙여넣으면 명부가 즉시 만들어집니다.',
  },
];

const SHOTS = [
  { src: '/img/morak-shot-1.png', alt: '모락 홈 — 우리 기수의 온라인 아지트' },
  { src: '/img/morak-shot-2.png', alt: '내 모임 — 관심사로 모이고 기수로 이어져요' },
  { src: '/img/morak-shot-3.png', alt: '모임 공간 — 멤버·일정·게시판까지 통째로' },
  { src: '/img/morak-shot-4.png', alt: '멤버 관리 — 명함 한 장으로 시작하는 네트워킹' },
  { src: '/img/morak-shot-5.png', alt: '채팅 — 만남이 대화로, 대화가 인연으로' },
];

/**
 * 기존 사이트 홈의 모락 구간에 있던 네 개의 심화 블록. 문구와 화면 짝을 그대로 옮겼다.
 * 전부 실제 모락 앱 화면 캡처다.
 */
const SCREENS = [
  {
    src: '/img/morak-screen-home.png',
    title: '앱을 열면 이번 주가 먼저 보입니다',
    desc: '주간 하이라이트와 통합 캘린더가 첫 화면에 놓입니다. 여러 모임의 일정과 멤버 생일이 한 달력에 모여, 무엇을 챙겨야 하는지 바로 잡힙니다.',
    alt: '모락 홈 대시보드 화면. 주간 하이라이트와 여러 모임 일정이 합쳐진 통합 캘린더가 보인다.',
  },
  {
    src: '/img/morak-screen-groups.png',
    title: '내 모임, 한눈에 정리됩니다',
    desc: '가입한 모임이 커버 사진과 함께 카드로 쌓입니다. 오너·임원 역할과 기수 뱃지, 다가오는 일정 날짜까지 카드에서 바로 확인하고, 관심사·지역으로 새로운 모임도 찾아볼 수 있습니다.',
    alt: '모락 모임 목록 화면. 가입한 모임이 커버 사진과 기수 뱃지가 붙은 카드로 쌓여 있다.',
  },
  {
    src: '/img/morak-screen-space.png',
    title: '모임마다 하나의 공간이 생깁니다',
    desc: '멤버·일정·검색·관리 메뉴와 공지·자유·자기소개 게시판을 갖춘 전용 공간. 멤버 수, 기수, 창립연도, 활동률 통계가 모임 첫 화면에서 한눈에 잡힙니다.',
    alt: '모락 모임 공간 화면. 상단에 멤버 수와 창립연도 통계가 있고 아래에 게시판 메뉴가 놓여 있다.',
  },
  {
    src: '/img/morak-screen-members.png',
    title: '명함이 인맥이 되는 멤버 관리',
    desc: '모임에서 받은 명함과 인맥을 한곳에서 검색하고 관리합니다. 전화·이메일·주소를 저장하고, 필요하면 내 폰 연락처로 바로 내보낼 수 있습니다.',
    alt: '모락 멤버 관리 화면. 받은 명함이 목록으로 정리돼 있고 검색창이 위에 있다.',
  },
  {
    src: '/img/morak-screen-chat.png',
    title: '기수가 보이는 채팅',
    desc: '대화 상대 이름 옆에 "12기 · 회장" 같은 기수·직책 뱃지가 함께 보여, 누구와 이야기하는지 헷갈리지 않습니다. 1:1 대화와 모임 단체방을 모두 지원합니다.',
    alt: '모락 채팅 화면. 대화 상대 이름 옆에 기수와 직책 뱃지가 함께 표시돼 있다.',
  },
] as const;

export default function MorakPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <Header active="" />

      <main className={`${styles.page} bg-slate-50 text-slate-900`}>
        {/* 히어로 */}
        <section className="relative min-h-[88vh] flex items-center overflow-hidden pb-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="absolute -top-32 -right-32 w-[34rem] h-[34rem] bg-morak-50 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-24 w-[28rem] h-[28rem] bg-morak-100/60 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className={`${styles.fadeUp} flex items-center gap-4 mb-9`} style={d('.15s')}>
                <span className="block w-12 h-px bg-morak-500" />
                <span className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-morak-800">
                  Morak · Community Platform
                </span>
              </div>
              <h1 className="font-black tracking-tight leading-[1.1] break-keep text-4xl sm:text-6xl lg:text-7xl mb-8">
                <span className={styles.heroLine}>
                  <span className={styles.heroLineInner} style={d('.3s')}>기수제 모임을</span>
                </span>
                {/* 흰 바탕의 morak-500은 2.21:1로 큰 글자 기준(3:1)에도 못 미쳐 morak-600(3.10:1)으로 내렸다 */}
                <span className={styles.heroLine}>
                  <span className={`${styles.heroLineInner} text-morak-600`} style={d('.45s')}>한곳에서.</span>
                </span>
              </h1>
              <p
                className={`${styles.fadeUp} max-w-xl text-base md:text-lg text-slate-500 leading-relaxed break-keep mb-12`}
                style={d('.7s')}
              >
                흩어진 단톡방, 엑셀 명부, 종이 명함으로 돌아가던 원우회·동문회.
                모락은 디지털 명함과 기수 관리로 모임 운영을 하나로 모읍니다.
              </p>
              <div className={`${styles.fadeUp} flex flex-wrap items-center gap-4`} style={d('.9s')}>
                <a
                  href="https://morac.gslt.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-morak-500 hover:bg-morak-400 text-slate-900 font-bold transition-all"
                >
                  모락 시작하기
                </a>
                {/* 테두리가 이 버튼의 유일한 식별 요소라 비텍스트 3:1이 필요하다 — slate-200은 1.23:1, slate-300도 1.48:1로 미달 */}
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full border-2 border-slate-500 text-slate-600 font-bold hover:border-morak-600 hover:text-slate-900 transition-all"
                >
                  도입 문의
                </Link>
              </div>
              {/* 히어로 배경이 순백이 아니라 민트빛이라 slate-500이 4.32:1까지 내려간다.
                  12px 본문이라 4.5:1이 필요해 한 단계 내렸다. */}
              <p className={`${styles.fadeUp} mt-6 text-xs text-slate-600`} style={d('1.05s')}>
                웹 · 설치형 앱(PWA) · Google Play 지원, 핵심 기능 무료
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
                      alt="모락(Morak) 로고"
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
              alt="모락 — 명함으로 만나고, 기수로 이어집니다"
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
              <h2 className="text-3xl md:text-5xl font-black break-keep leading-tight mb-4">모임 운영에 필요한 전부</h2>
              <p className="text-slate-500 break-keep">명함 교환부터 명부 관리까지, 운영진과 회원 모두를 위한 기능.</p>
            </Reveal>
            <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
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
            {SCREENS.map((s, i) => (
              <Reveal
                key={s.src}
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
                      src={s.src}
                      alt={s.alt}
                      width={520}
                      height={1153}
                      sizes="(max-width: 767px) 208px, 240px"
                      className="w-full h-auto block"
                    />
                  </div>
                </figure>
                <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 break-keep leading-tight mb-4">
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
              <h2 className="text-2xl md:text-3xl font-black break-keep">화면 미리보기</h2>
              <p className="text-sm text-slate-500 hidden sm:block shrink-0">좌우로 넘겨보세요</p>
            </Reveal>
            <Reveal className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:thin]">
              {SHOTS.map((s) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  width={640}
                  height={1125}
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
                <h2 className="text-2xl md:text-3xl font-black break-keep mb-2">개인정보는 회원에게만</h2>
                <p className="text-slate-500 break-keep">
                  실명·연락처·명함·명부는 로그인한 모임 구성원에게만 보입니다. 비회원에게는 노출되지 않습니다.
                </p>
              </div>
              <a
                href="https://morac.gslt.kr/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-7 py-3.5 rounded-full border-2 border-slate-500 font-bold text-sm text-slate-600 hover:border-morak-600 hover:text-slate-900 transition-all"
              >
                개인정보 처리방침
              </a>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-6xl mx-auto rounded-3xl bg-[#062a2a] text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-16 w-72 h-72 bg-morak-500 rounded-full blur-[120px] opacity-25 pointer-events-none" />
            <div className="text-center md:text-left relative">
              <p className="text-2xl md:text-3xl font-black break-keep mb-2">우리 모임도 모락으로 옮겨볼까?</p>
              <p className="text-white/50 break-keep">
                지금 바로 무료로 모임을 만들 수 있습니다. 명단 온보딩은 도입 문의로 도와드립니다.
              </p>
            </div>
            <a
              href="https://morac.gslt.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-8 py-4 rounded-full bg-morak-500 hover:bg-morak-400 text-slate-900 font-bold transition-all relative"
            >
              모락 시작하기
            </a>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
