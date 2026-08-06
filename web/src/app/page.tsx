import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

/**
 * 홈. 히어로는 스크롤 연동 영상 스크럽이라 클라이언트 컴포넌트지만,
 * 마크업은 서버에서도 렌더돼 크롤러가 헤드라인·본문을 그대로 읽는다.
 *
 * 헤더는 히어로 영상 위에 겹쳐 떠야 하므로 높이 스페이서를 끈다.
 * 나머지 홈 섹션(시옷·비즈모아 패널·모락·연혁·문의)은 이어서 옮긴다.
 */
export default function Home() {
  return (
    <>
      <Header active="home" overlay />
      <Hero />
      <Footer />
    </>
  );
}
