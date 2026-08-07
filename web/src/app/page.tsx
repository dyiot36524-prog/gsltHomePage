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
 * 푸터는 히어로가 어두운 면으로 끝나므로 위 여백을 내지 않는다 —
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
