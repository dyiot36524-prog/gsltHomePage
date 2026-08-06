import Link from 'next/link';
import Image from 'next/image';
import { NAV, SOLUTIONS, type NavKey } from '@/lib/site';
import { ChevronDown } from '@/components/Icon';

export default function Header({ active = '' as NavKey }: { active?: NavKey }) {
  const linkCls = (key: string) =>
    active === key ? 'text-gslt-600' : 'text-slate-600 hover:text-gslt-600 transition-colors';

  return (
    <header>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between h-16 relative">
          <Link href="/" className="flex items-center h-8 z-10" aria-label="GSLT 홈">
            <Image src="/img/gslt-logo-color.png" alt="GSLT" width={120} height={32}
              priority className="h-full w-auto object-contain" />
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-9 text-sm font-bold text-slate-600">
            <div className="relative group">
              <button type="button" className="flex items-center gap-1 hover:text-gslt-600 transition-colors">
                솔루션
                <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                <div className="w-72 bg-white rounded-2xl shadow-xl border border-slate-200/70 p-2">
                  {SOLUTIONS.map((s) => (
                    <Link key={s.href} href={s.href}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                      <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }} />
                      <span className="block">
                        <span className="font-bold text-slate-900 group-hover/item:text-gslt-600 transition-colors">
                          {s.name} <span className="text-slate-500 font-medium text-xs">{s.en}</span>
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5">{s.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {NAV.map((n) => (
              <Link key={n.key} href={n.href} className={linkCls(n.key)}>{n.label}</Link>
            ))}
          </div>

          <Link href="/#contact"
            className="hidden md:flex items-center gap-2 bg-gslt-500 hover:bg-gslt-400 text-slate-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 z-10">
            도입 문의
          </Link>
        </div>

        <div className="md:hidden border-t border-slate-100 bg-white/95">
          <div className="flex items-center gap-5 px-4 py-2.5 text-sm font-bold overflow-x-auto whitespace-nowrap text-slate-600">
            {SOLUTIONS.map((s) => (
              <Link key={s.href} href={s.href} className="hover:text-gslt-600 transition-colors shrink-0">
                {s.name}
              </Link>
            ))}
            <span className="w-px h-4 bg-slate-200 shrink-0" />
            {NAV.map((n) => (
              <Link key={n.key} href={n.href} className={`${linkCls(n.key)} shrink-0`}>{n.label}</Link>
            ))}
          </div>
        </div>
      </nav>
      {/* 고정 헤더 높이만큼 본문을 밀어준다 (모바일은 2단이라 더 높다) */}
      <div className="h-[6.5rem] md:h-16" aria-hidden="true" />
    </header>
  );
}
