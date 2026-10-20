'use client';

import { useEffect, useState } from 'react';

/** 600px 넘게 내려가면 나타나는 맨 위로 버튼. 전 페이지 공통. 홈에서는 히어로 무대가 걷힌 뒤부터. */
export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // 홈 히어로 무대가 화면에 붙어 있는 동안은 띄우지 않는다. 무대는 #hero-track 안에
      // sticky로 고정된 채 스크롤이 600px를 훌쩍 넘기 때문에, 예전에는 이 버튼이 무대 아래쪽
      // 상담 입력창 위에 떴다. 높이 553~622 화면에서는 보내기 버튼을 덮어, 보내려고 누르면
      // 맨 위로 올라갔다.
      // sticky는 트랙 바닥이 무대 바닥까지 올라온 순간 풀린다. 그 전까지는 트랙 바닥이 더 아래다.
      // innerHeight와 비교하지 않는 건 iOS에서 주소창이 접히면 innerHeight가 무대 높이(100svh)
      // 보다 커져, 무대가 아직 붙어 있는데도 풀린 것으로 읽히기 때문이다.
      // 레이아웃의 이 버튼은 페이지를 오가도 남아 있으므로 요소는 매번 새로 찾는다.
      const track = document.getElementById('hero-track');
      const stage = track?.querySelector('.hero-stage');
      const pinned =
        !!track && !!stage &&
        track.getBoundingClientRect().bottom - stage.getBoundingClientRect().bottom > 1;
      setShow(window.scrollY > 600 && !pinned);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // 화면 높이가 바뀌면(회전·주소창) 무대 높이와 트랙 길이도 바뀌어, 붙어 있는지가 달라질 수 있다
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로"
      // opacity:0으로만 감추면 버튼이 초점 순서에 그대로 남아, 키보드 사용자는 보이지 않는 버튼을
      // 밟는다. inert가 초점·접근성 트리에서 함께 빼준다.
      inert={!show}
      onClick={() => {
        // html의 scroll-behavior는 모션 최소화 때 auto로 되돌지만, 여기서 smooth를 명시하면
        // 그 설정을 덮어쓴다. 설정을 직접 읽어 맞춘다.
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }}
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white/95 border border-slate-200 shadow-lg text-[11px] font-extrabold tracking-wider text-slate-600 transition-opacity duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-700 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      TOP
    </button>
  );
}
