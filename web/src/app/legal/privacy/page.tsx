import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description:
    '지에스엘티(GSLT)의 개인정보 처리방침입니다. 수집하는 항목과 이용 목적, 보유 기간, 제3자 제공, 이용자의 권리를 안내합니다.',
  alternates: { canonical: '/legal/privacy' },
  openGraph: {
    type: 'website',
    siteName: 'GSLT',
    locale: 'ko_KR',
    url: '/legal/privacy',
    title: '개인정보 처리방침 | GSLT',
    description: '지에스엘티(GSLT)가 개인정보를 어떻게 수집·이용·보관하는지 안내합니다.',
    images: ['/img/og-image.png'],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHead
          title="개인정보 처리방침"
          lead={'지에스엘티(이하 "회사")는 개인정보 보호법 등 관련 법령을 준수하며, 이용자의 개인정보를 안전하게 처리합니다.'}
        />

        <article className="max-w-[68ch]">
          <p className="border-t-2 border-slate-900 pt-4 text-sm text-slate-500 tabular-nums">
            최종 업데이트: 2025년 1월 1일
          </p>

          <div className="post-body mt-10">
            <h2>1. 수집하는 개인정보 항목</h2>
            <ul>
              <li>상담 신청 시: 이름, 이메일, 전화번호, 회사명, 문의내용</li>
              <li>서비스 이용 시: 서비스 이용 기록, 접속 로그, 쿠키</li>
            </ul>

            <h2>2. 개인정보의 수집 및 이용 목적</h2>
            <ul>
              <li>상담 신청 접수 및 전문가 연결</li>
              <li>서비스 제공 및 고객 지원</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
            </ul>

            <h2>3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              원칙적으로 개인정보 수집 및 이용 목적이 달성된 후 지체 없이 파기합니다. 단, 관련 법령에 따라
              보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
            <ul>
              <li>상담 기록: 상담 완료 후 1년</li>
              <li>서비스 이용 기록: 3개월 (통신비밀보호법)</li>
            </ul>

            <h2>4. 개인정보의 제3자 제공</h2>
            <p>
              회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의한 경우는 예외로
              합니다.
            </p>

            <h2>5. 이용자의 권리</h2>
            <p>
              이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 요청은{' '}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>으로 이메일 주시면 즉시 처리합니다.
            </p>

            <h2>6. 개인정보 보호책임자</h2>
            {/* 표시 의무 항목이라 연락처는 site.ts의 회사 상수 하나만 본다. */}
            <ul>
              <li>성명: GSLT 개인정보 담당자</li>
              <li>
                이메일: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
              <li>
                Tel: <a href={`tel:${COMPANY.tel}`}>{COMPANY.tel}</a>
              </li>
            </ul>
          </div>

          <p className="mt-14 pt-6 border-t border-slate-200 text-xs text-slate-500 tabular-nums">
            본 방침은 2025년 1월 1일부터 시행됩니다.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
