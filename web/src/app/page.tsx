import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SOLUTIONS } from '@/lib/site';

/**
 * 임시 홈. 히어로 영상 스크럽·비즈모아 패널 스냅 등 연출이 많은 실제 홈은
 * 이관 3단계에서 옮긴다. 그때까지 자리만 잡아 둔다.
 */
export default function Home() {
  return (
    <>
      <Header active="home" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-gslt-600 mb-5">
          Migration in progress
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight break-keep leading-tight mb-6">
          오피스에서 빌딩까지,<br />
          <span className="text-gslt-500">공간을 IoT로 짓습니다.</span>
        </h1>
        <p className="text-slate-500 text-lg break-keep max-w-2xl mb-12">
          이 페이지는 Next.js 이관 중인 임시 홈입니다. 연출이 들어간 실제 홈 화면은
          3단계에서 옮깁니다. 아래 페이지들은 이미 이관됐습니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map((s) => (
            <Link key={s.href} href={s.href}
              className="group rounded-2xl border border-slate-200/70 bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <span className="block w-2.5 h-2.5 rounded-full mb-5" style={{ background: s.dot }} />
              <p className="font-black text-xl mb-2 group-hover:text-gslt-600 transition-colors">
                {s.name} <span className="text-slate-500 font-medium text-sm">{s.en}</span>
              </p>
              <p className="text-sm text-slate-500 break-keep">{s.desc}</p>
            </Link>
          ))}
          <Link href="/about"
            className="group rounded-2xl border border-slate-200/70 bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
            <span className="block w-2.5 h-2.5 rounded-full mb-5 bg-slate-900" />
            <p className="font-black text-xl mb-2 group-hover:text-gslt-600 transition-colors">회사소개</p>
            <p className="text-sm text-slate-500 break-keep">연혁·구축 프로세스·오시는 길</p>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
