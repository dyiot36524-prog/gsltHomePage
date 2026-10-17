/**
 * 시옷 활용 장면의 이름표와 시연 신청 표식 — 브라우저 쪽(문의 양식)도 쓰는 가벼운 조각.
 * 장면 본문(lib/scenes.ts)을 클라이언트 번들에 싣지 않으려고 따로 둔다.
 */

export type SceneSlug = 'meeting-room' | 'lounge' | 'restroom';

/** 장면 이름. lib/scenes.ts가 가져다 쓰고, 문의 양식이 '쇼룸 시연 신청'을 미리 채울 때도 쓴다. */
export const SCENE_NAMES: Record<SceneSlug, string> = {
  'meeting-room': '회의실 예약·제어',
  lounge: '휴게공간 예약·재실 현황판',
  restroom: '화장실 재실 표시',
};

/** 문의 내용 맨 앞의 표식. 알림 메일이 이것으로 시연 신청을 알아본다(lib/notify.ts). */
export const DEMO_MARK = '[쇼룸 시연 신청]';
