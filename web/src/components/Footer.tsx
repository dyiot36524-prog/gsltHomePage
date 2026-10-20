import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COMPANY, FURNITURE, KAKAO, SITE, SOLUTIONS } from '@/lib/site';
import { ArrowUpRight } from '@/components/Icon';
import KakaoChatLink from '@/components/KakaoChatLink';
import { NoBreak } from '@/lib/nobreak';
import { getMenuVisibility, type MenuKey } from '@/lib/posts';

/** 상단 메뉴와 같은 설정을 따른다 — 헤더에서 숨긴 항목이 푸터에만 남으면 앞뒤가 안 맞는다. */
const NEWS_LINKS: { href: string; label: string; menu: MenuKey }[] = [
  { href: '/news', label: '뉴스', menu: 'news' },
  { href: '/downloads', label: '자료실', menu: 'downloads' },
  { href: '/portfolio', label: '포트폴리오', menu: 'portfolio' },
];

const LEGAL_LINKS = [
  { href: '/legal/terms', label: '서비스 약관' },
  { href: '/legal/privacy', label: '개인정보 처리방침' },
  { href: '/support', label: '고객 지원' },
];

/**
 * 사업자 정보의 '라벨+값' 한 쌍. 휴대폰에서는 한 줄에 하나씩 쌓고, md부터 '|'로 이어 한 줄에 둔다.
 *
 * 320–390에서 쌍들을 한 줄에 흘려 두니 '707-/81-03107'처럼 번호가 갈리고, 라벨만 줄 끝에
 * 남고, '|'가 줄 끝에 매달렸다. 짧은 쌍은 통째로 nowrap이다. 주소처럼 한 줄에 다 들어가지
 * 않는 값만 wrap으로 풀어 어절(break-keep) 단위로 넘긴다 — 이때도 라벨은 첫 어절에 붙는다.
 *
 * 값이 링크면(Email·카카오톡 채널·패밀리 사이트) md 미만에서 위아래 5px씩 탭 영역을 붙인다.
 * 12px 글자 한 줄이라 높이가 19.5px(Email은 인라인이라 14px)뿐이어서 손가락 타겟 24px에 못
 * 미쳤고, Email은 바로 아래 카카오톡 링크와 붙어 WCAG 2.2 2.5.8의 간격 예외도 못 받았다.
 * 여백을 주면 셋 다 29.5px가 되고 서로 겹치지 않는다(푸터는 30px 길어진다). 카카오톡 링크는
 * 공용 컴포넌트(KakaoChatLink)라 링크 쪽 클래스를 건드리지 않고 이 래퍼의 자식 선택자([&>a])로
 * 준다. md부터는 '|'로 한 줄에 이어 붙이므로 여백을 거둔다.
 */
function Pair({ label, wrap = false, children }: { label?: string; wrap?: boolean; children: ReactNode }) {
  return (
    <span className={`block md:inline [&>a]:py-[5px] md:[&>a]:py-0 ${wrap ? '' : 'whitespace-nowrap'}`}>
      {label ? (
        <>
          <span className="text-slate-300 font-medium whitespace-nowrap">{label}</span>&nbsp;&nbsp;
        </>
      ) : null}
      {children}
    </span>
  );
}

/**
 * md부터 보이는 구분자. 쌍을 쌓는 폭에서는 숨기고, 화면낭독기에는 '세로 막대'로 읽히지 않게 한다.
 * 줄을 넘길 자리는 막대 뒤 공백 하나뿐이다 — 막대가 줄 첫머리에 오지 않게.
 */
function Sep() {
  return <span className="hidden md:inline" aria-hidden="true">&nbsp;&nbsp;|&nbsp; </span>;
}

/** 저작권 연도. 서버는 UTC로 돌아 1월 1일 0~9시(서울)에는 지난해가 찍히므로 서울 기준으로 센다. */
function seoulYear(): string {
  return new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric' }).format(new Date());
}

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * flush: 바로 위 구간이 이미 어두운 면으로 끝날 때 쓴다. 기본 여백(mt-24)은 흰 지면
 * 콘텐츠 페이지용이라, 검정 계기면 뒤에 그대로 두면 body 흰색이 96px 띠로 드러난다.
 *
 * 바닥 여백은 md 미만에서 pb-24다. 맨 위로 버튼(ScrollTop, 바닥에서 24~72px)이 오른쪽 아래에
 * 떠 있어, pb-8이면 320px에서 저작권 줄 끝을 덮었다. md부터는 폭이 넓어 왼쪽의 저작권 줄과
 * 오른쪽의 버튼이 가로로 비켜나고, lg부터는 저작권 줄이 정보 칸 맨 윗줄 높이로 올라간다.
 */
export default async function Footer({ flush = false }: { flush?: boolean }) {
  const menus = await getMenuVisibility();
  const newsLinks = NEWS_LINKS.filter((l) => menus[l.menu]);
  return (
    <footer
      className={`pt-14 pb-24 md:pb-8 bg-[#050505] text-slate-400 border-t border-white/5 ${flush ? '' : 'mt-24'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-10 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/img/gslt-logo-white.png" alt={SITE.siteName} width={110} height={28}
                className="h-7 w-auto object-contain" style={{ width: 'auto', height: '1.75rem' }} />
              {/* 실제 브랜드 태그라인이다. 대문자로 바꾸고 자간을 넓히는 건 원본 표기를
                  뭉개면서 템플릿 마이크로 라벨처럼 보이게 만든다 — 적힌 대로 쓴다. */}
              <span className="text-xs font-medium border-l border-white/10 pl-3 text-slate-400">
                {SITE.tagline}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed break-keep max-w-xs">
              무선 IoT 구축 전문기업.<br />
              오피스·주거·빌딩을 배선 공사 없이 스마트 공간으로 완성합니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 text-sm">
            <Column title="솔루션"
              links={SOLUTIONS.map((s) => ({ href: s.href, label: `${s.name} (${s.en})` }))} />
            <Column title="소식" links={newsLinks} />
            <Column title="법적 고지" links={LEGAL_LINKS} />
          </div>
        </div>

        {/* 저작권 줄은 lg부터 오른쪽에 붙인다. md(768)에서 옆에 두면 정보 칸이 좁아져
            'Tel | Email |' 줄이 꺾이고 '|'가 줄 끝에 남았다. md에서는 아래로 내려 정보가 폭을 다 쓴다. */}
        <div className="pt-7 flex flex-col lg:flex-row justify-between items-start gap-4">
          {/* 표시 의무 정보라 값은 검정 푸터 위 하한인 slate-400(7.95:1)까지 올린다.
              라벨이 값보다 밝은 원본 위계는 slate-300(13.73:1)으로 유지한다.
              break-keep이 없어 '우림라이/온스밸리'처럼 어절 중간이 꺾였다. */}
          <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed break-keep">
            <p>
              <Pair label="상호">{SITE.nameKo}({SITE.name})</Pair>
              <Sep />
              <Pair label="대표자">{COMPANY.ceo}</Pair>
              <Sep />
              <Pair label="사업자등록번호">{COMPANY.bizNo}</Pair>
            </p>
            {/* 주소만 한 줄에 다 들어가지 않는다. 어절로 넘기되 '3차 501호'는 NoBreak가 붙잡는다. */}
            <p>
              <Pair label="주소" wrap><NoBreak>{COMPANY.address}</NoBreak></Pair>
            </p>
            <p>
              <Pair label="Tel">{COMPANY.tel}</Pair>
              <Sep />
              {/* 인라인 링크는 세로 여백이 줄 높이에 잡히지 않는다 — md 미만에서만 inline-block으로 세운다. */}
              <Pair label="Email">
                <a href={`mailto:${COMPANY.email}`}
                  className="inline-block md:inline hover:text-white transition-colors">{COMPANY.email}</a>
              </Pair>
              <Sep />
              {/* 라벨까지 링크 안에 둔다 — 링크 목록에서 '(주)지에스엘티'만 들리면 회사 사이트로 오해한다. */}
              <Pair>
                <KakaoChatLink place="footer">
                  <span className="text-slate-300 font-medium">카카오톡 채널</span>&nbsp;&nbsp;{KAKAO.name}
                </KakaoChatLink>
              </Pair>
            </p>
            {/* 같은 법인의 가구 사업. 상호가 같아 검색에서 서로 섞이므로, 두 사이트가
                같은 회사라는 것을 여기서 밝히고 서로 링크한다(site.ts FURNITURE). */}
            <p>
              <Pair label="패밀리 사이트">
                <a href={FURNITURE.url} target="_blank" rel="noopener"
                  className="inline-flex items-center gap-0.5 hover:text-white transition-colors">
                  {FURNITURE.name} ({FURNITURE.desc})
                  <ArrowUpRight className="w-3 h-3" />
                  <span className="sr-only">(새 창)</span>
                </a>
              </Pair>
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1 lg:mt-0 shrink-0 break-keep">
            © {seoulYear()} {SITE.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
