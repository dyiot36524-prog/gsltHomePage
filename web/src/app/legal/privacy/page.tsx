import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { COMPANY, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description:
    '지에스엘티(GSLT)의 개인정보 처리방침입니다. 수집하는 항목과 이용 목적, 보유 기간, 제3자 제공, 이용자의 권리를 안내합니다.',
  alternates: { canonical: '/legal/privacy' },
  openGraph: {
    type: 'website',
    siteName: SITE.siteName,
    locale: 'ko_KR',
    url: '/legal/privacy',
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
            최종 업데이트: 2026년 10월 17일
          </p>

          <div className="post-body mt-10">
            <h2>1. 수집하는 개인정보 항목</h2>
            <ul>
              <li>상담 신청 시: 이름, 이메일, 전화번호, 회사명, 문의내용</li>
              <li>서비스 이용 시: 서비스 이용 기록, 접속 로그, 쿠키</li>
              {/* 관리자 화면에 실제로 보이는 고객 정보로 확정한다(대표님 시험 채팅). 그 전까지의 기본안. */}
              <li>
                카카오톡 채널 문의 시: 카카오톡 프로필명·프로필 사진(이용자 설정에 따름), 대화 내용, 이용자가
                대화 중 알려 준 이름·연락처·회사명
              </li>
            </ul>

            <h2>2. 개인정보의 수집 및 이용 목적</h2>
            <ul>
              <li>상담 신청 접수 및 전문가 연결</li>
              <li>서비스 제공 및 고객 지원</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
            </ul>
            {/* 근거 조항은 추론이다 — B2B 도입 문의가 4호에 해당하는지 법률 검토를 받는다. */}
            <p>
              카카오톡 채널로 받은 문의는 이용자가 먼저 요청한 상담에 답하기 위해 처리하며, 별도의 동의
              절차 없이 처리합니다(개인정보 보호법 제15조제1항제4호).
            </p>

            <h2>3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              원칙적으로 개인정보 수집 및 이용 목적이 달성된 후 지체 없이 파기합니다. 단, 관련 법령에 따라
              보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
            <ul>
              <li>상담 기록: 상담 완료 후 1년</li>
              <li>
                카카오톡 채널 상담 기록: 상담 완료 후 1년이 지나면 회사 쪽 채팅방을 나가고 메모와 옮겨 적은
                사본을 삭제합니다.
              </li>
              <li>카카오톡 대화 기록: ㈜카카오 정책에 따라 카카오 서버에 3년간 보관됩니다.</li>
              <li>서비스 이용 기록: 3개월 (통신비밀보호법)</li>
            </ul>

            <h2>4. 개인정보의 제3자 제공</h2>
            <p>
              회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의한 경우는 예외로
              합니다.
            </p>

            {/* 회사소개 페이지의 유튜브 영상·구글 지도. 유튜브는 누르기 전까지 연결하지 않도록
                만들었지만(VideoShowcase), 누른 뒤에는 Google이 처리하므로 그 사실을 적는다.
                지도는 전부터 있었는데 여기 빠져 있었다. */}
            <h2>5. 외부 서비스 연결(동영상·지도·카카오톡 채널)</h2>
            <p>
              회사소개 페이지에는 Google LLC가 제공하는 YouTube 동영상과 Google 지도가 포함되어 있습니다.
              동영상은 이용자가 재생 버튼을 누르기 전까지 YouTube에 연결하지 않으며, 누르면 YouTube 개인정보
              보호 강화 모드(youtube-nocookie.com) 플레이어가 열립니다. 지도는 해당 부분이 화면에 표시될 때
              Google 지도에서 불러옵니다.
            </p>
            <p>
              이때 Google이 이용자의 IP 주소, 기기·브라우저 정보를 처리하거나 쿠키 등 브라우저 저장 기능을
              사용할 수 있으며, 회사는 이 정보를 수집하거나 전달받지 않습니다. 해당 처리에는{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google 개인정보처리방침
              </a>
              이 적용됩니다.
            </p>
            {/* 카카오톡 문의 링크(KakaoChatLink). 사이트는 SDK·쿠키 없이 주소로만 넘긴다. 카카오가 처리하는 것과
                회사가 대화로 받은 것을 나눠 적는다 — 뒤쪽까지 카카오 방침으로 넘기면 회사 책임을 지우는 말이 된다. */}
            <p>
              도입 문의 페이지·상담 챗봇의 ‘카카오톡으로 문의’나 각 페이지 하단의 ‘카카오톡 채널’ 링크를 누르면
              ㈜카카오가 제공하는 카카오톡 채널 서비스의 회사 채널 ‘(주)지에스엘티’ 1:1 채팅으로 연결됩니다. 이때
              회사 홈페이지는 카카오에 이용자 정보를 따로 보내지 않습니다. 카카오톡 채널 대화 중 ㈜카카오가 처리하는
              정보(카카오계정, 서버의 대화 보관 등)에는{' '}
              <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer">
                ㈜카카오 개인정보처리방침
              </a>
              이 적용되며, 회사가 대화로 받은 정보는 이 방침에 따라 처리합니다.
            </p>

            <h2>6. 이용자의 권리</h2>
            <p>
              이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 요청은{' '}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>으로 이메일 주시면 즉시 처리합니다.
            </p>

            <h2>7. 개인정보 보호책임자</h2>
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
            본 방침은 2026년 10월 17일부터 시행됩니다. (카카오톡 채널 문의 항목 추가)
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
