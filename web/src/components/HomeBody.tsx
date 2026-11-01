import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from '@/components/Icon';
import { SOLUTIONS, SIOT_HOME } from '@/lib/site';

/**
 * 히어로 다음에 이어지는 구축 분야 판.
 *
 * 처음에는 흰 지면에 긴 본문을 붙였다. 검색엔진이 홈을 읽을 근거는 생겼지만
 * 어두운 히어로 뒤에 흰 문서가 툭 붙어 보였고, 무엇보다 **읽히지 않는 글**이었다.
 * 방문자는 히어로에서 이미 무엇을 하는 회사인지 알았는데 같은 말을 문단으로 다시 읽는다.
 *
 * 다시 짰다. 어두운 바닥을 이어받아 히어로의 연장으로 두고, 문단 대신 **분야 카드**를
 * 세운다. 카드 제목이 곧 이 회사가 잡히고 싶은 검색어다 — 스마트오피스 구축,
 * 커스텀 스마트빌딩, 무인 자동화, AI 빌딩(BMS) 같은 말이 h3로 서면 검색엔진에는
 * 문단 속에 묻힌 같은 단어보다 강한 신호가 되고, 사람에게는 훑기 좋은 목록이 된다.
 *
 * 키워드를 숨기지 않는다. 전부 화면에 보이고, 각 문장은 실제로 이 회사가 하는 일이다.
 * 지어낸 수치는 넣지 않는다.
 *
 * 대비(히어로 바닥 #05070c · 카드 바탕 white 4%): 제목 18.9:1 · 본문 9.5:1 · 보조 7.2:1.
 */

const FIELDS = [
  {
    k: '커스텀 스마트오피스',
    href: '/solutions/smart-office',
    d: '사무실마다 층 구조와 업무 방식이 다릅니다. 스마트오피스 구축은 표준 패키지가 아니라 그 공간을 실측하는 데서 시작합니다.',
  },
  {
    k: '스마트홈',
    href: '/solutions/smart-home',
    d: '이미 지어진 주택과 아파트도 대규모 공사 없이 바꿉니다. 클라우드 월패드와 로비폰으로 조명·냉난방·보안을 하나로 묶습니다.',
  },
  {
    k: '커스텀 스마트빌딩',
    href: '/solutions/smart-building',
    d: '출입 통제와 에너지 관리, 안전 설비를 한 플랫폼에 모읍니다. 신축이 아니어도 기존 빌딩 위에 그대로 얹습니다.',
  },
  {
    k: '무인 자동화',
    href: '/solutions/unmanned-automation',
    d: '예약과 출입, 전원을 하나로 잇습니다. 관리자가 상주하지 않아도 예약 시간에 맞춰 공간이 스스로 열리고 닫힙니다.',
  },
  {
    k: 'AI 빌딩 · BMS',
    href: '/solutions/ai-building-bms',
    d: '설비 데이터를 모아 이상 징후를 예측합니다. 인공지능 빌딩 관제는 경보에서 끝나지 않고 조치 절차와 작업 지시까지 잇습니다.',
  },
  {
    k: '인공지능 오피스',
    href: '/solutions/ai-office',
    d: '재실과 사용 패턴을 근거로 조명과 공조를 자동 조절합니다. 사람이 없는 구역에 전력을 쓰지 않습니다.',
  },
] as const;

export default function HomeBody() {
  return (
    <section className="bg-[#05070c] text-white px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold tracking-[0.2em] text-gslt-400 mb-5">구축 분야</p>
        <h2 className="text-[1.75rem] md:text-[2.5rem] font-black tracking-tight leading-[1.2] break-keep">
          공간의 종류만큼
          <br />
          짓는 방식도 다릅니다
        </h2>
        <p className="mt-5 max-w-[62ch] text-base md:text-lg text-white/70 leading-relaxed break-keep">
          지에스엘티는 배선 공사 없이 기존 공간을 스마트 공간으로 바꿉니다. 사무실과 주택,
          빌딩은 층 구조도 설비도 다르기 때문에 같은 방식으로 짓지 않습니다.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 카드가 곧 각 분야 전용 페이지(/solutions/*)로 가는 문이다. 검색어가 h3로 서 있는
              이 판에서 그 검색어를 깊게 다룬 페이지로 이어져야 검색엔진도 둘을 한 묶음으로 본다. */}
          {FIELDS.map((f) => (
            <li key={f.k}>
              <Link
                href={f.href}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-400"
              >
                <h3 className="text-lg font-bold text-white break-keep">{f.k}</h3>
                <p className="mt-3 text-sm text-white/70 leading-[1.75] break-keep">{f.d}</p>
                <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-bold text-gslt-400">
                  자세히
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* 시옷으로 잇는 띠. 위 여섯 분야는 모두 시옷으로 운영한다(fields.ts의 product가 전부 시옷) —
            카드를 다 훑은 자리에서 그 공통분모를 로고와 실제 대시보드로 보여 주고 시옷 홈페이지로 보낸다.
            헤더 솔루션 패널의 시옷 카드와 같은 문법(공식 로고·대시보드·siothome 주황 단추)이다.
            화면 이미지는 아래쪽이라 기본 지연 로딩으로 스크롤이 닿을 때 받는다. */}
        <a
          href={SIOT_HOME}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mt-6 block overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f] px-6 pt-8 pb-0 sm:px-10 sm:pt-10 lg:min-h-[23rem] lg:pb-10 transition-colors duration-300 hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-400"
        >
          <span className="relative z-10 block lg:max-w-[26rem]">
            <Image
              src="/img/siot-home-logo-white.png"
              alt="시옷(SIOT)"
              width={377}
              height={96}
              sizes="220px"
              className="h-11 md:h-14 w-auto"
            />
            <h3 className="mt-7 text-2xl md:text-[1.75rem] font-black tracking-tight leading-[1.3] text-white break-keep text-balance">
              여섯 분야 모두, 운영은 시옷 한 화면에서
            </h3>
            <span className="mt-3 block text-base text-white/70 leading-relaxed break-keep">
              {SOLUTIONS[0].lead} 배선 공사 없이 지금 쓰는 공간 그대로 얹습니다.
            </span>
            <span className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-siothome-500 px-6 py-3 text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:bg-siothome-400">
                시옷 홈페이지 바로가기
                <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span className="text-sm font-medium text-white/55">siot-home.gslt.kr</span>
              <span className="sr-only">(새 창)</span>
            </span>
          </span>

          {/* 휴대폰·태블릿: 글 아래로 흘러 카드 바닥과 오른쪽 밖으로 잘린다. lg부터: 오른쪽에 걸려 위·왼쪽만 보인다.
              옆으로 거는 것을 md(768)부터 하면 화면이 제목 밑으로 파고들어 글자가 대시보드 위에 얹혔다. */}
          <span
            aria-hidden="true"
            className="pointer-events-none relative mt-8 -mr-10 sm:-mr-16 block overflow-hidden rounded-tl-xl shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10 transition-transform duration-700 ease-out group-hover:-translate-x-2 group-hover:-translate-y-1.5 motion-reduce:transition-none lg:absolute lg:mt-0 lg:mr-0 lg:-right-16 lg:top-12 lg:w-[38rem] lg:[mask-image:linear-gradient(to_right,transparent,black_22%)]"
          >
            <Image
              src="/img/siot-home-dashboard.webp"
              alt=""
              width={1440}
              height={1000}
              sizes="(min-width: 1024px) 608px, 100vw"
              className="block h-auto w-full"
            />
          </span>
        </a>

        {/* 솔루션으로 가는 내부 링크. 히어로에서 목록을 뺐으므로 여기가 홈의 유일한 경로다. */}
        <ul className="mt-16 border-t border-white/12">
          {SOLUTIONS.map((s) => (
            <li key={s.href} className="border-b border-white/12">
              <Link
                href={s.href}
                className="group grid grid-cols-[1fr_auto] md:grid-cols-[11rem_1fr_auto] gap-x-6 gap-y-1.5 items-start py-5 -mx-4 px-4 transition-colors hover:bg-white/[0.04]"
              >
                <span className="font-bold text-white group-hover:text-gslt-400 transition-colors">
                  {s.name}
                  <span className="ml-2 text-sm font-medium text-white/55">{s.en}</span>
                </span>
                <span className="col-span-2 md:col-span-1 md:col-start-2 text-sm text-white/70 leading-relaxed break-keep">
                  {s.desc}
                </span>
                <ArrowUpRight className="col-start-2 md:col-start-3 row-start-1 w-5 h-5 shrink-0 text-white/55 group-hover:text-gslt-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
