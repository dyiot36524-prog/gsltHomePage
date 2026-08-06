import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: '서비스 이용약관',
  description:
    '지에스엘티(GSLT) 서비스 이용약관입니다. 서비스 이용 조건과 절차, 회사와 이용자의 권리·의무 및 책임사항을 정합니다.',
  alternates: { canonical: '/legal/terms' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    locale: 'ko_KR',
    url: '/legal/terms',
    title: '서비스 이용약관 | GSLT',
    description: '지에스엘티(GSLT)가 제공하는 서비스의 이용 조건과 절차를 정한 약관입니다.',
    images: ['/img/og-image.png'],
  },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="서비스 이용약관"
          lead="지에스엘티(GSLT)가 제공하는 서비스의 이용 조건과 절차, 회사와 이용자의 권리·의무 및 책임사항을 정합니다."
        />

        <article className="max-w-[68ch]">
          {/* 시행일은 약관의 효력 범위를 정하는 값이라 본문보다 먼저 온다. 2px 먹선이 문서의 위를 닫는다. */}
          <p className="border-t-2 border-slate-900 pt-4 text-sm text-slate-500 tabular-nums">
            최종 업데이트: 2025년 1월 1일
          </p>

          <div className="post-body mt-10">
            <h2>제1조 (목적)</h2>
            <p>
              이 약관은 지에스엘티(이하 &quot;회사&quot;)가 제공하는 시옷(Siot) 등 모든 서비스(이하
              &quot;서비스&quot;)의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을
              목적으로 합니다.
            </p>

            <h2>제2조 (용어의 정의)</h2>
            <p>
              &quot;이용자&quot;란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
              &quot;서비스&quot;란 회사가 제공하는 스마트 오피스 솔루션 및 워크스페이스 플랫폼 일체를
              의미합니다.
            </p>

            <h2>제3조 (약관의 효력 및 변경)</h2>
            <p>
              이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
              회사는 합리적인 사유가 있는 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 7일 이후부터
              효력이 발생합니다.
            </p>

            <h2>제4조 (서비스의 제공 및 변경)</h2>
            <p>
              회사는 안정적인 서비스 제공을 위해 최선을 다합니다. 시스템 점검·보수·기술적 사유 등으로
              서비스가 일시 중단될 수 있으며, 이 경우 사전 또는 사후에 공지합니다.
            </p>

            <h2>제5조 (이용자의 의무)</h2>
            <p>
              이용자는 서비스 이용 시 관계 법령, 이 약관의 규정, 이용 안내 등 회사가 공지하는 사항을
              준수하여야 합니다. 타인의 정보 도용, 서비스 무단 복제·배포, 불법 행위 등은 금지됩니다.
            </p>

            <h2>제6조 (책임의 제한)</h2>
            <p>
              회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지, 기타 불가항력적 사유로 인해 서비스를
              제공할 수 없는 경우에는 책임이 면제됩니다.
            </p>

            <h2>제7조 (분쟁 해결)</h2>
            <p>
              서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 원만한 해결을 위해 성실히
              협의합니다. 협의가 이루어지지 않을 경우, 관할 법원은 회사 소재지를 관할하는 법원으로 합니다.
            </p>
          </div>

          {/* 원본의 회색(2.56:1) 대신 slate-500(4.76:1) — 연락처는 장식이 아니라 조문의 일부다. */}
          <p className="mt-14 pt-6 border-t border-slate-200 text-xs text-slate-500 tabular-nums">
            문의:{' '}
            <a
              href={`mailto:${COMPANY.email}`}
              className="underline underline-offset-2 decoration-slate-300 hover:text-gslt-700 transition-colors"
            >
              {COMPANY.email}
            </a>{' '}
            · Tel.{' '}
            <a
              href={`tel:${COMPANY.tel}`}
              className="underline underline-offset-2 decoration-slate-300 hover:text-gslt-700 transition-colors"
            >
              {COMPANY.tel}
            </a>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
