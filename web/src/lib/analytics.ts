import { track } from '@vercel/analytics';

/**
 * 이름 있는 전환 이벤트.
 *
 * 문자열을 각 컴포넌트에 흩뿌리면 'inquiry_submit'과 'inquiry-submit'이 따로 집계되는
 * 날이 온다. 이름은 여기서만 정하고, 컴포넌트는 함수를 부른다.
 * 클릭으로 잡히는 것(전화·메일·다운로드)은 ConversionTracker가 맡는다.
 */
export const conversions = {
  /** 상담 신청이 접수됨. source로 폼과 챗봇을 구분한다. */
  inquirySubmitted: (source: 'form' | 'chat') => track('inquiry_submit', { source }),
  /**
   * 챗봇에 첫 메시지를 보냄. 대화가 몇 번 시작되는지가 챗봇의 존재 가치다.
   * 질문 내용은 싣지 않는다 — 첫 말에 전화번호를 적는 사람이 있고, 그게 동의 없이 외부
   * 분석 도구로 나가면 안 된다. 무엇을 물었는지는 연락처를 가린 chatLogs가 맡는다.
   */
  chatStarted: () => track('chat_start'),
  /** 챗봇 안에서 담당자 연결을 눌렀음. 답변이 상담으로 이어지는 비율. */
  chatHandoff: () => track('chat_handoff'),
};
