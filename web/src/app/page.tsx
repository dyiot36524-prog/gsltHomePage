import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

/**
 * 홈. 스크롤 연동 영상 스크럽 히어로 하나로 끝난다 — 히어로가 할 말을 다 하고,
 * 그 다음 이야기는 각 솔루션 페이지와 회사소개가 진다.
 *
 * 히어로는 클라이언트 컴포넌트지만 마크업은 서버에서도 렌더돼
 * 크롤러가 헤드라인·본문·세 솔루션 링크를 그대로 읽는다.
 *
 * 헤더는 히어로 영상 위에 겹쳐 떠야 하므로 높이 스페이서를 끈다.
 *
 * 상담 챗봇은 히어로 안에 있다. 처음에는 히어로가 끝난 뒤 흰 지면에 따로 뒀는데,
 * 영상이 끝나고 나면 톤이 뚝 끊겨 다른 사이트가 이어붙은 것처럼 보였다. 지금은
 * 스크롤이 필름을 다 지나면 헤드라인이 물러나고 그 자리에 상담판이 들어온다.
 *
 * 푸터는 히어로가 어두운 면으로 끝나므로 위 여백을 내지 않는다(flush) —
 * 기본 mt-24를 두면 그 사이로 body 흰색이 96px 띠로 드러난다.
 */
export default function Home() {
  return (
    <>
      <Header active="home" overlay />
      <Hero />
      <Footer flush />
    </>
  );
}
