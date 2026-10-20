import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHead from '@/components/PageHead';
import { COMPANY, KAKAO, SITE } from '@/lib/site';
import { NoBreak } from '@/lib/nobreak';
import { ogImage } from '@/lib/og';

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description:
    '지에스엘티(GSLT)의 개인정보 처리방침입니다. 수집 항목과 목적, 보유 기간, 처리 위탁과 국외 이전, 이용자의 권리를 안내합니다.',
  alternates: { canonical: '/legal/privacy' },
  openGraph: {
    type: 'website',
    siteName: SITE.siteName,
    locale: 'ko_KR',
    url: '/legal/privacy',
    description: '지에스엘티(GSLT)가 개인정보를 어떻게 수집·이용·보관하는지 안내합니다.',
    images: [ogImage('/legal/privacy', '개인정보 처리방침')],
  },
};

/**
 * 국외 이전. 코드가 실제로 보내는 곳만 적는다(2026-10 확인).
 *  - Firestore(문의함·대화 기록)는 서울 리전(asia-northeast3)이라 여기 없고 위탁 표에만 있다.
 *  - Telegram·솔라피 알림톡·접수 확인 자동 메일은 환경 변수가 없어 꺼져 있다. 켜는 날 여기와 위탁 표에 더한다.
 */
const TRANSFERS = [
  {
    to: 'Vercel Inc.',
    country: '미국',
    contact: 'privacy@vercel.com',
    when: '홈페이지 접속, 문의 접수, AI 상담 때 네트워크로 전송',
    items: '접속 IP·기기 정보, 문의 내용, AI 상담 대화',
    purpose: '홈페이지 호스팅과 서버 처리, 방문 통계',
    keep: '처리 후 바로 삭제(서버 기록은 Vercel 정책에 따라 짧은 기간 보관)',
  },
  {
    to: 'Google LLC (Gmail)',
    country: '미국',
    contact: 'https://policies.google.com/privacy',
    when: '문의 접수 때 이메일로 전송',
    items: '이름, 회사명, 이메일, 전화번호, 문의 내용',
    purpose: '담당자 접수 알림과 답변',
    keep: '3절의 상담 기록 보유 기간',
  },
  {
    to: 'Anthropic, PBC',
    country: '미국',
    contact: 'privacy@anthropic.com',
    when: 'AI 상담 이용 때 네트워크로 전송',
    items: 'AI 상담에 입력한 대화 내용',
    purpose: 'AI 상담 답변과 상담 신청서 요약 생성',
    keep: '30일 이내 삭제(Anthropic 정책. 이용정책 위반이 의심되면 최대 2년)',
  },
  {
    to: 'Plus Five Five, Inc. (Resend)',
    country: '미국',
    contact: 'privacy@resend.com',
    when: '문의 접수 때 네트워크로 전송',
    items: '이름, 회사명, 이메일, 전화번호, 문의 내용, 유입 경로',
    purpose: '문의 접수 알림 메일 발송',
    keep: '발송 기록 30일',
  },
];

/**
 * 국외 이전 받는 곳의 연락처(이메일 또는 주소). 'https://policies.google.com/privacy'는 끊을 자리가
 * 없어 280px에서 칸보다 넓었고 페이지가 19px 옆으로 밀렸다. inline-block으로 묶어 들어가는 폭에서는
 * 통째로 다음 줄로 넘기고, 그래도 넓을 때만 마지막 '/' 뒤(<wbr/>)에서 꺾는다.
 */
function TransferContact({ value }: { value: string }) {
  const cut = value.lastIndexOf('/') + 1;
  return (
    <span className="inline-block">
      {cut ? (
        <>
          {value.slice(0, cut)}
          <wbr />
          {value.slice(cut)}
        </>
      ) : (
        value
      )}
    </span>
  );
}

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
            최종 업데이트: 2026년 10월 19일
          </p>

          <div className="post-body mt-10">
            {/* 항목은 코드가 실제로 받는 것만 적는다. 쿠키는 쓰지 않는다(layout.tsx·10절). */}
            <h2>1. 수집하는 개인정보 항목</h2>
            <ul>
              <li>
                상담 신청 시(도입 문의 양식, AI 상담의 ‘담당자 연결’): 이름, 이메일, 문의 내용(필수), 회사명,
                전화번호(선택). AI 상담에서 ‘지금까지의 대화 내용을 함께 보냅니다’를 선택하면 그 대화 내용도
                함께 받습니다.
              </li>
              <li>
                AI 상담 이용 시: 입력한 대화 내용. 답변을 만드는 동안만 처리하며, 상담 신청과 함께 보내기로
                선택한 대화만 보관합니다.
              </li>
              {/* 관리자 화면에 실제로 보이는 고객 정보로 확정한다(대표님 시험 채팅). 그 전까지의 기본안. */}
              <li>
                카카오톡 채널 문의 시: 카카오톡 프로필명·프로필 사진(이용자 설정에 따름), 대화 내용, 이용자가
                대화 중 알려 준 이름·연락처·회사명
              </li>
              <li>
                자동으로 생성·수집되는 정보: 접속 IP 주소(남용 방지를 위해 잠시 쓰고 저장하지 않음), 방문
                통계(방문한 페이지, 유입 경로, 기기·브라우저 종류, 국가·지역 — 쿠키 없이 수집), 첫 유입
                경로(브라우저 탭을 닫으면 사라짐)
              </li>
            </ul>

            {/* 근거 조항은 법률 검토 대상이다 — 특히 AI 상담과 카카오톡의 제4호. */}
            <h2>2. 개인정보의 수집 및 이용 목적과 근거</h2>
            <ul>
              <li>
                상담 신청: 상담 접수, 전문가 연결, 답변. 근거는 정보주체의 동의(개인정보 보호법
                제15조제1항제1호)이며, 양식에서 동의를 받습니다.
              </li>
              <li>
                AI 상담: 질문에 대한 답변과 상담 신청서 요약 생성. 근거는 이용자의 요청에 따른 조치(같은 법
                제15조제1항제4호)입니다.
              </li>
              <li>
                카카오톡 채널 문의: 이용자가 먼저 요청한 상담에 답하기 위해 처리하며, 별도의 동의 절차 없이
                처리합니다(같은 법 제15조제1항제4호).
              </li>
              <li>방문 통계: 서비스 개선. 개인을 알아볼 수 없는 통계로만 이용합니다.</li>
            </ul>

            <h2>3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              원칙적으로 개인정보 수집 및 이용 목적이 달성된 후 지체 없이 파기합니다. 단, 관련 법령에 따라
              보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
            <ul>
              <li>상담 기록: 상담 완료 후 1년</li>
              <li>AI 상담 대화 기록(상담 신청과 함께 보낸 것): 저장일로부터 1년</li>
              <li>
                카카오톡 채널 상담 기록: 상담 완료 후 1년이 지나면 회사 쪽 채팅방을 나가고 메모와 옮겨 적은
                사본을 삭제합니다.
              </li>
              <li>카카오톡 대화 기록: ㈜카카오 정책에 따라 카카오 서버에 3년간 보관됩니다.</li>
              <li>
                접속 기록: 회사는 따로 저장하지 않습니다. 호스팅 업체(Vercel)의 서버 기록은 그 업체의 정책에
                따라 짧은 기간 뒤 삭제됩니다.
              </li>
            </ul>

            <h2>4. 개인정보의 파기</h2>
            <p>
              보유 기간이 지나거나 처리 목적이 달성되면 지체 없이 파기합니다. 전자 파일은 복구할 수 없는
              방법으로 삭제합니다. 다른 법령에 따라 보관해야 하는 경우에는 그 정보만 따로 저장해 보관합니다.
            </p>

            <h2>5. 개인정보의 제3자 제공</h2>
            <p>
              회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의한 경우는 예외로
              합니다.
            </p>

            {/* 개인정보 보호법 제26조. 코드가 실제로 넘기는 곳만 적는다 — 꺼진 채널(Telegram·솔라피)은 켤 때 더한다. */}
            <h2>6. 개인정보 처리의 위탁</h2>
            <p>회사는 원활한 상담과 서비스 운영을 위해 아래와 같이 개인정보 처리 업무를 위탁합니다.</p>
            <table>
              <thead>
                <tr>
                  <th scope="col">수탁자</th>
                  <th scope="col">위탁하는 업무</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vercel Inc.</td>
                  <td>홈페이지 호스팅, 문의 접수·AI 상담 서버 운영, 방문 통계</td>
                </tr>
                <tr>
                  <td>Google LLC</td>
                  <td>문의·상담 기록 보관(Google Firebase, 서울 리전), 업무 메일 수신(Gmail)</td>
                </tr>
                <tr>
                  <td>Anthropic, PBC</td>
                  <td>AI 상담 답변 생성</td>
                </tr>
                <tr>
                  <td>Plus Five Five, Inc.(Resend)</td>
                  <td>문의 접수 알림 메일 발송</td>
                </tr>
              </tbody>
            </table>
            <p>
              위탁 계약에서 개인정보가 안전하게 처리되도록 필요한 사항을 정하고, 수탁자가 이를 지키는지
              감독합니다. 수탁자가 바뀌면 이 방침으로 알립니다.
            </p>

            {/* 개인정보 보호법 제28조의8. 항목이 많아 휴대폰에서 표가 넘치므로 받는 곳마다 목록으로 적는다. */}
            <h2>7. 개인정보의 국외 이전</h2>
            <p>
              회사는 상담 접수와 답변을 위해 아래와 같이 개인정보를 국외에서 처리하도록 위탁합니다. 정보주체와의
              계약 체결·이행을 위한 처리위탁으로서 이 방침에 공개하는 경우에 해당합니다(개인정보 보호법
              제28조의8제1항제3호가목).
            </p>
            {TRANSFERS.map((t) => (
              <div key={t.to}>
                <h3>
                  {t.to} ({t.country})
                </h3>
                <ul>
                  <li>
                    연락처: <TransferContact value={t.contact} />
                  </li>
                  <li>이전 시기·방법: {t.when}</li>
                  <li>이전 항목: {t.items}</li>
                  <li>이용 목적: {t.purpose}</li>
                  <li>보유·이용 기간: {t.keep}</li>
                </ul>
              </div>
            ))}
            <p>
              국외 이전을 원하지 않으시면 문의 양식과 AI 상담 대신
              전화(<span className="whitespace-nowrap">{COMPANY.tel}</span>)나 카카오톡 채널(국내)로
              문의하실 수 있습니다. 문의 양식과 AI 상담은 위 이전 없이는 이용할 수 없습니다. 이미 이전된 정보의
              삭제는 아래 보호책임자에게 요청하시면 처리합니다.
            </p>

            {/* 2026년 4월 처리방침 작성지침의 생성형 AI 항목. 대화 기록은 상담 신청과 함께 보낸 것만 남는다(lib/chat-log.ts). */}
            <h2>8. AI 상담 안내</h2>
            <ul>
              <li>
                홈 첫 화면의 AI 상담은 회사가 등록한 자료를 바탕으로 Anthropic의 AI(Claude)가 답변을 만듭니다.
                AI 답변은 틀릴 수 있으니 중요한 내용은 담당자에게 확인해 주세요.
              </li>
              <li>
                입력한 대화는 답변을 만들기 위해 Anthropic(미국)으로 전송됩니다. Anthropic은 고객의 입력을 AI
                학습에 쓰지 않습니다(Anthropic 상용 약관).
              </li>
              <li>
                대화는 상담 신청과 함께 보내기로 선택한 경우에만 보관하며, 이때 전화번호와 이메일은 가립니다.
              </li>
              <li>주민등록번호, 건강 정보 같은 민감한 정보는 입력하지 마세요.</li>
              <li>
                부적절한 답변은 <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>으로 알려 주세요.
              </li>
            </ul>

            {/* 회사소개 페이지의 유튜브 영상·구글 지도. 유튜브는 누르기 전까지 연결하지 않도록
                만들었지만(VideoShowcase), 누른 뒤에는 Google이 처리하므로 그 사실을 적는다.
                지도는 전부터 있었는데 여기 빠져 있었다.
                '·'가 든 제목은 NoBreak로 그린다 — 360~430px에서 '·카카오톡'이 줄 첫머리에 왔다(10절도 같은 처리).
                도메인은 한 덩어리로 묶는다 — 360·375px에서 하이픈 뒤가 꺾여 'youtube-/nocookie.com)'으로 갈렸다. */}
            <h2>
              <NoBreak>9. 외부 서비스 연결(동영상·지도·카카오톡 채널·글꼴·이미지)</NoBreak>
            </h2>
            <p>
              회사소개 페이지에는 Google LLC가 제공하는 YouTube 동영상과 Google 지도가 포함되어 있습니다.
              동영상은 이용자가 재생 버튼을 누르기 전까지 YouTube에 연결하지 않으며, 누르면 YouTube 개인정보
              보호 강화 모드<span className="whitespace-nowrap">(youtube-nocookie.com)</span> 플레이어가 열립니다. 지도는 해당 부분이 화면에 표시될 때
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
              ㈜카카오가 제공하는 카카오톡 채널 서비스의 회사 채널 ‘{KAKAO.name}’ 1:1 채팅으로 연결됩니다. 이때
              회사 홈페이지는 카카오에 이용자 정보를 따로 보내지 않습니다. 카카오톡 채널 대화 중 ㈜카카오가 처리하는
              정보(카카오계정, 서버의 대화 보관 등)에는{' '}
              <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer">
                ㈜카카오 개인정보처리방침
              </a>
              이 적용되며, 회사가 대화로 받은 정보는 이 방침에 따라 처리합니다.
            </p>
            {/* layout.tsx의 Pretendard(jsDelivr), 관리자가 올린 이미지·영상(Cloudinary). 브라우저가 직접 받아 온다. */}
            <p>
              홈페이지의 글꼴은 jsDelivr(Volentio JSD Ltd.)에서, 일부 이미지·영상은 Cloudinary에서 불러옵니다. 이때
              이용자의 IP 주소와 브라우저 정보가 해당 서비스에 전달될 수 있으며, 회사는 이 정보를 받지 않습니다.
            </p>

            <h2>
              <NoBreak>10. 자동 수집 장치의 설치·운영 및 거부</NoBreak>
            </h2>
            <ul>
              <li>회사는 쿠키를 쓰지 않습니다.</li>
              <li>
                방문 통계(Vercel Web Analytics)는 쿠키 없이, 요청 정보로 만든 임시 값으로 방문을 구분하며 이
                값은 24시간 뒤 폐기됩니다.
              </li>
              <li>
                첫 유입 경로(예: 검색, 다른 사이트)는 브라우저의 세션 저장소에 잠시 두었다가 상담 신청 때 함께
                전달하며, 탭을 닫으면 사라집니다. 브라우저 설정에서 사이트 데이터를 지우면 바로 삭제됩니다.
              </li>
            </ul>

            <h2>11. 개인정보의 안전성 확보 조치</h2>
            <ul>
              <li>문의함과 상담 기록은 관리자 인증을 거친 계정만 볼 수 있습니다.</li>
              <li>모든 전송 구간은 암호화(HTTPS)합니다.</li>
              <li>관리 권한은 필요한 사람에게만 줍니다.</li>
            </ul>

            <h2>12. 이용자의 권리</h2>
            <p>
              이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 요청은{' '}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>으로 이메일 주시면 즉시 처리합니다.
            </p>

            {/* 법정 표기는 성명 또는 부서 명칭과 연락처다(제30조제1항제6호). 표시 의무 항목이라 site.ts의 회사 상수만 본다. */}
            <h2>13. 개인정보 보호책임자</h2>
            <ul>
              <li>성명: {COMPANY.ceo}(대표)</li>
              <li>
                이메일: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
              <li>
                {/* 번호가 하이픈에서 두 줄로 갈리지 않게 한 덩어리로 둔다. */}
                전화:{' '}
                <a href={`tel:${COMPANY.tel}`} className="whitespace-nowrap">
                  {COMPANY.tel}
                </a>
              </li>
            </ul>
          </div>

          {/* 본문(.post-body)과 달리 이 줄은 바깥이라 break-keep을 따로 준다. 없으면 '국/외'로 끊긴다. */}
          <p className="mt-14 pt-6 border-t border-slate-200 text-xs text-slate-500 tabular-nums break-keep">
            <NoBreak>본 방침은 2026년 10월 19일부터 시행됩니다. (처리 위탁·국외 이전·AI 상담 항목 추가)</NoBreak>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
