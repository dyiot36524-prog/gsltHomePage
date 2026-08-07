import Link from 'next/link';
import Image from 'next/image';
import { COMPANY, SITE, SOLUTIONS } from '@/lib/site';

const NEWS_LINKS = [
  { href: '/news', label: '뉴스' },
  { href: '/downloads', label: '자료실' },
  { href: '/portfolio', label: '포트폴리오' },
];

const LEGAL_LINKS = [
  { href: '/legal/terms', label: '서비스 약관' },
  { href: '/legal/privacy', label: '개인정보 처리방침' },
  { href: '/support', label: '고객 지원' },
];

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
 */
export default function Footer({ flush = false }: { flush?: boolean }) {
  return (
    <footer
      className={`pt-14 pb-8 bg-[#050505] text-slate-400 border-t border-white/5 ${flush ? '' : 'mt-24'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 pb-10 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/img/gslt-logo-white.png" alt="GSLT" width={110} height={28}
                className="h-7 w-auto object-contain" style={{ width: 'auto', height: '1.75rem' }} />
              <span className="text-xs font-medium border-l border-white/10 pl-3 text-slate-400 uppercase tracking-widest">
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
            <Column title="소식" links={NEWS_LINKS} />
            <Column title="법적 고지" links={LEGAL_LINKS} />
          </div>
        </div>

        <div className="pt-7 flex flex-col md:flex-row justify-between items-start gap-4">
          {/* 표시 의무 정보라 값은 검정 푸터 위 하한인 slate-400(7.95:1)까지 올린다.
              라벨이 값보다 밝은 원본 위계는 slate-300(13.73:1)으로 유지한다. */}
          <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
            <p>
              <span className="text-slate-300 font-medium">상호</span>&nbsp; {SITE.nameKo}({SITE.name})
              &nbsp;|&nbsp; <span className="text-slate-300 font-medium">대표자</span>&nbsp; {COMPANY.ceo}
              &nbsp;|&nbsp; <span className="text-slate-300 font-medium">사업자등록번호</span>&nbsp; {COMPANY.bizNo}
            </p>
            <p><span className="text-slate-300 font-medium">주소</span>&nbsp; {COMPANY.address}</p>
            <p>
              <span className="text-slate-300 font-medium">Tel</span>&nbsp; {COMPANY.tel}
              &nbsp;|&nbsp; <span className="text-slate-300 font-medium">Email</span>&nbsp;
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">{COMPANY.email}</a>
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-1 md:mt-0 shrink-0">© 2025 GSLT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
