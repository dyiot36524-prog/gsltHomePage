import Link from 'next/link';
import Image from 'next/image';
import { NAV, SOLUTIONS, type NavKey } from '@/lib/site';
import { getMenuVisibility, type MenuKey } from '@/lib/posts';
import SolutionsMenu from '@/components/SolutionsMenu';

/**
 * overlay: 히어로 영상 위에 겹쳐 뜨는 모드. 배경을 지우고 흰 글씨로 바꾸며,
 * 아래 스페이서도 내지 않는다 — 영상이 화면 맨 위부터 차야 하기 때문이다.
 */
export default async function Header({
  active = '' as NavKey,
  overlay = false,
}: {
  active?: NavKey;
  overlay?: boolean;
}) {
  // 관리자가 끈 메뉴는 내지 않는다. menu 키가 없는 항목(홈·회사소개)은 항상 보인다.
  const menus = await getMenuVisibility();
  const nav = NAV.filter((n) => !('menu' in n) || menus[(n as { menu: MenuKey }).menu]);

  const linkCls = (key: string) =>
    overlay
      ? active === key
        ? 'text-white'
        : 'text-white/70 hover:text-white transition-colors'
      // 14px 볼드는 작은 글자라 4.5:1이 필요하다. gslt-600은 흰 바탕 3.66:1로
      // DESIGN.md가 '아이콘과 굵은 큰 글자 전용'으로 못박은 값이라 글자에는 gslt-700을 쓴다.
      : active === key
        ? 'text-gslt-700'
        : 'text-slate-600 hover:text-gslt-700 transition-colors';

  return (
    <header>
      <nav
        className={
          overlay
            ? 'fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/45 to-transparent'
            : 'fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm'
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between h-16 relative">
          <Link href="/" className="flex items-center h-8 z-10" aria-label="GSLT 홈">
            <Image
              src={overlay ? '/img/gslt-logo-white.png' : '/img/gslt-logo-color.png'}
              alt="GSLT" width={120} height={32}
              priority className="h-full w-auto object-contain"
              style={{ width: 'auto', height: '100%' }}
            />
          </Link>

          {/* 중앙 네비는 lg(1024px)부터. md(768px)에서는 라벨 5개 + 로고 + CTA가 폭에 들어가지
              않아 '포트폴리/오'처럼 어절 중간이 꺾였다. whitespace-nowrap은 그 안전장치다. */}
          <div className={`absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-9 text-sm font-bold whitespace-nowrap ${overlay ? 'text-white/80' : 'text-slate-600'}`}>
            <SolutionsMenu overlay={overlay} />
            {nav.map((n) => (
              <Link key={n.key} href={n.href} className={linkCls(n.key)}>{n.label}</Link>
            ))}
          </div>

          <Link href="/contact"
            className="hidden lg:flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 z-10">
            도입 문의
          </Link>
        </div>

        <div className={overlay ? 'lg:hidden border-t border-white/10' : 'lg:hidden border-t border-slate-100 bg-white/95'}>
          {/* 세로 여백을 줄이 아니라 링크에 준다. 줄 높이(40px)는 그대로지만 각 링크의
              탭 영역이 20px → 40px가 된다. 손가락으로 누르는 유일한 내비게이션이다.
              간격도 24px로 벌려 WCAG 2.2 2.5.8의 간격 예외를 실제로 만족시킨다. */}
          <div className={`flex items-center gap-6 px-4 text-sm font-bold overflow-x-auto whitespace-nowrap ${overlay ? 'text-white/80' : 'text-slate-600'}`}>
            {SOLUTIONS.map((s) => (
              <Link key={s.href} href={s.href}
                className={`py-2.5 transition-colors shrink-0 ${overlay ? 'hover:text-white' : 'hover:text-gslt-700'}`}>
                {s.name}
              </Link>
            ))}
            <span className={`w-px h-4 shrink-0 ${overlay ? 'bg-white/20' : 'bg-slate-200'}`} aria-hidden="true" />
            {nav.map((n) => (
              <Link key={n.key} href={n.href} className={`${linkCls(n.key)} py-2.5 shrink-0`}>{n.label}</Link>
            ))}
          </div>
        </div>
      </nav>
      {/* 고정 헤더 높이만큼 본문을 밀어준다 (2단 가로 스크롤 줄이 붙는 lg 미만은 더 높다).
          overlay 모드는 영상 위에 겹쳐야 하므로 스페이서를 내지 않는다. */}
      {overlay ? null : <div className="h-[6.5rem] lg:h-16" aria-hidden="true" />}
    </header>
  );
}
