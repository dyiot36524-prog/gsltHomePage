import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Chat from '@/components/Chat';

/**
 * 홈. 스크롤 연동 영상 스크럽 히어로 하나로 끝난다 — 히어로가 할 말을 다 하고,
 * 그 다음 이야기는 각 솔루션 페이지와 회사소개가 진다.
 *
 * 히어로는 클라이언트 컴포넌트지만 마크업은 서버에서도 렌더돼
 * 크롤러가 헤드라인·본문·세 솔루션 링크를 그대로 읽는다.
 *
 * 헤더는 히어로 영상 위에 겹쳐 떠야 하므로 높이 스페이서를 끈다.
 *
 * 히어로 다음은 상담 챗봇이다. 히어로가 "무엇을 하는 회사인지"를 말하고 나면 방문자의
 * 다음 질문은 늘 "우리 공간에도 되나"인데, 그 질문을 받을 자리가 없어 문의 폼까지
 * 스스로 찾아가야 했다. 챗봇이 그 자리를 맡는다.
 *
 * 푸터 위 여백을 내지 않는다(flush). 챗봇 섹션이 이미 아래로 py-28을 갖고 있어
 * 기본 mt-24를 더하면 흰 띠가 두 번 겹친다.
 */
export default function Home() {
  return (
    <>
      <Header active="home" overlay />
      <Hero />
      <Chat />
      <Footer flush />
    </>
  );
}
