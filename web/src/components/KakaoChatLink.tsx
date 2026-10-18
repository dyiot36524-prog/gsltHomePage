import type { ReactNode } from 'react';
import { ArrowUpRight } from '@/components/Icon';
import { KAKAO } from '@/lib/site';

/**
 * 카카오톡 채널 1:1 채팅으로 가는 링크 — 도입 문의, 챗봇의 담당자 연결, 바닥글.
 *
 * 카카오 SDK를 싣지 않고 주소 하나로 연다. 사이트에 쿠키·외부 스크립트가 늘지 않고, JS가
 * 없어도 열린다. 클릭 수는 ConversionTracker가 data-track으로 센다(어느 자리에서 눌렀는지는 label).
 *
 * 새 탭으로 연다. 같은 탭이면 반쯤 쓴 상담 신청 폼이 날아간다. rel은 noopener만 둔다 —
 * 기본 리퍼러 정책이라 카카오에는 출처(https://www.gslt.kr/)만 가고 경로는 가지 않는다.
 * 전체 주소를 보내는 referrerPolicy는 넣지 않는다.
 *
 * 카카오 노랑과 말풍선 마크는 쓰지 않는다. 마크는 카카오가 단독 심볼 파일로 내준 것을 변형 없이
 * 쓸 때만 쓸 수 있는데 그 파일을 확보하지 못했고, 노랑만 두르면 카카오 모양을 흉내 내는 꼴이 된다.
 * 그래서 놓이는 면의 링크 문법을 따른다(DESIGN.md).
 */

type Place = 'contact' | 'chat' | 'footer';

/** 자리마다 놓이는 면이 정해져 있어 모양도 자리로 정한다. */
const SHAPE: Record<Place, string> = {
  // 도입 문의 ① — 그 갈래의 주 행동이라 사이트 주 버튼(청록 면·먹 글자·직각). ②의 '상담 신청 보내기'와 같은 크기.
  contact:
    'w-full justify-center gap-2 bg-gslt-500 px-6 py-4 text-base font-bold text-slate-900 hover:bg-gslt-400 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gslt-700',
  // 챗봇(어두운 무대) — 알약. 대화를 넘겨 주는 '담당자 연결'이 주 선택지라 테두리만 둔 보조 무게.
  chat:
    'gap-1 min-h-11 rounded-full border border-white/25 px-5 text-sm font-bold text-white/90 ' +
    'hover:border-white/50 hover:text-white ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
  // 바닥글 — 패밀리 사이트 링크와 같은 모양.
  footer: 'gap-0.5 hover:text-white',
};

export default function KakaoChatLink({
  place,
  describedBy,
  children,
}: {
  /** 놓인 자리. 모양과 클릭 집계의 label이 이것으로 정해진다. */
  place: Place;
  /** 화면에 '새 창에서 열립니다'를 적은 보조 문구의 id. 없으면 '(새 창)'을 낭독용으로만 붙인다. */
  describedBy?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={KAKAO.chat}
      target="_blank"
      rel="noopener"
      data-track="kakao_chat_click"
      data-track-label={place}
      aria-describedby={describedBy}
      className={`inline-flex items-center transition-colors ${SHAPE[place]}`}
    >
      {children}
      <ArrowUpRight className={place === 'footer' ? 'w-3 h-3' : 'w-4 h-4'} />
      {describedBy ? null : <span className="sr-only">(새 창)</span>}
    </a>
  );
}
