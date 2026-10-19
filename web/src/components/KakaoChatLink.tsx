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
 * 버튼(도입 문의·챗봇)은 카카오톡 모양이다 — 노랑 바탕에 갈색 말풍선·글자. 방문자가 한눈에
 * '카톡'으로 알아보게 하려는 것이고, 다른 회사의 카톡 문의 버튼이 쓰는 그 모양이다(대표님 결정,
 * 2026-10). 말풍선은 카카오 로고 파일이 아니라 일반 말풍선 아이콘이다. 바닥글은 글자 링크로 둔다.
 */

/** 카카오 노랑과 카카오톡의 갈색. 갈색 위 노랑 대비는 약 12:1이다. */
const KAKAO_YELLOW = 'bg-[#FEE500] hover:bg-[#F5DC00]';
const KAKAO_BROWN = 'text-[#3C1E1E]';

type Place = 'contact' | 'chat' | 'footer';

/** 자리마다 놓이는 면이 정해져 있어 모양도 자리로 정한다. */
const SHAPE: Record<Place, string> = {
  // 도입 문의 ① — 그 갈래의 주 행동. ②의 '상담 신청 보내기'와 같은 크기, 기록 면이라 직각.
  contact:
    `w-full justify-center gap-2 px-6 py-4 text-base font-bold ${KAKAO_YELLOW} ${KAKAO_BROWN} ` +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C1E1E]',
  // 챗봇(어두운 무대) — '담당자 연결' 옆의 알약.
  chat:
    `gap-1.5 min-h-11 rounded-full px-5 text-sm font-bold ${KAKAO_YELLOW} ${KAKAO_BROWN} ` +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
  // 바닥글 — 패밀리 사이트 링크와 같은 모양.
  footer: 'gap-0.5 hover:text-white',
};

/** 말풍선. 채운 모양 하나라 갈색 글자색(currentColor)을 그대로 받는다. */
function Bubble({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.85 5.33 4.64 6.75L5.5 21.5l4.39-2.9c.69.1 1.39.15 2.11.15 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
    </svg>
  );
}

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
  const footer = place === 'footer';
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
      {footer ? null : <Bubble className={place === 'contact' ? 'w-5 h-5' : 'w-4 h-4'} />}
      {children}
      {footer ? <ArrowUpRight className="w-3 h-3" /> : null}
      {describedBy ? null : <span className="sr-only">(새 창)</span>}
    </a>
  );
}
