import Link from 'next/link';
import { localePath, type Locale } from '@/i18n/config';
import { common } from '@/i18n/messages/common';

/** 404 화면 — app/(ko)/not-found(한국어)와 app/[lang]/not-found(영어·중국어·일본어)가 함께 쓴다. */
export default function NotFoundView({ locale }: { locale: Locale }) {
  const t = common[locale].notFound;
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white px-6 text-center">
      <div>
        {/* 제목 뒤에 깔리는 워터마크. 1.26:1이라 읽히는 글자가 아니고, 같은 뜻은 아래 h1이
            온전한 대비로 지고 있다. 보조기기에서도 장식으로 취급해 두 경험을 맞춘다. */}
        <p
          aria-hidden="true"
          className="text-[6rem] md:text-[9rem] font-black leading-none tracking-tighter text-white/10 select-none"
        >
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight break-keep text-balance mb-3 -mt-6">
          {t.title}
        </h1>
        <p className="text-white/55 break-keep mb-10">{t.body}</p>
        <Link
          href={localePath(locale, '/')}
          className="inline-flex items-center px-7 py-3.5 rounded-full bg-gslt-500 hover:bg-gslt-400 text-slate-900 font-bold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {t.home}
        </Link>
        {/* 홈으로 돌려보내는 것만으로는 원래 찾던 것에 닿지 못한다 — 사람에게 묻는 길을 하나 남긴다 */}
        <p className="mt-6 text-sm">
          <Link
            href={localePath(locale, '/contact')}
            className="text-white/55 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t.contact}
          </Link>
        </p>
      </div>
    </main>
  );
}
