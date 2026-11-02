import type { Locale } from '@/i18n/config';
import { common } from '@/i18n/messages/common';
import { scenes, type ScenesMessages } from '@/i18n/messages/scenes';
import { SCENE_NAMES, type SceneSlug } from './scene-names';

/**
 * 시옷 활용 장면 — 회의실·휴게공간·화장실.
 *
 * 세 가지는 따로 파는 제품이 아니라 **시옷(SIOT)이 실제 공간에서 쓰이는 장면**이다(대표님 결정,
 * 2026-10 인터뷰). 장면마다 사람들이 검색하는 말이 달라서("회의실 예약 시스템", "화장실 재실 표시")
 * 한 장씩 페이지를 둔다 — /siot/meeting-room, /siot/lounge, /siot/restroom.
 *
 * **지금은 쇼룸 시연 수준이다.** 고객사 이름·후기·효과 수치를 쓰지 않는다. 기능 문장은 대표님이
 * 확인한 동작과 사이트에 이미 공개된 시옷의 사실(예약 → 시간 한정 QR 출입권 → 조명·공조, 타임라인,
 * 예약확정·이용중·이용완료·노쇼 구분, 복합 자동화)에서만 쓴다. 설득은 "성남 쇼룸에서 직접 보라"로 한다.
 *
 * 문장은 i18n/messages/scenes 사전에 네 언어로 있다. 이 파일은 그것을 Scene 모양으로 엮는다.
 */

export type Scene = {
  slug: SceneSlug;
  /** 화면·카드에 쓰는 짧은 이름 */
  name: string;
  /** h1이자 대표 검색어 */
  keyword: string;
  /** <title> 앞부분(틀이 ' | 지에스엘티'를 붙인다) */
  title: string;
  description: string;
  /** 첫 문단 — 첫 문장이 곧 답이다(AI 답변 엔진이 그대로 인용한다) */
  lead: string;
  problem: string;
  /** 동작 — [이름, 설명] */
  how: readonly (readonly [string, string])[];
  /** 관리자 화면에서 보이는 것 */
  admin: readonly string[];
  /** 붙는 장비 */
  devices: readonly string[];
  faq: readonly { q: string; a: string }[];
};

/** 장면 순서 — 시옷 페이지 카드·사이트맵·llms.txt가 이 순서로 늘어놓는다. */
const ORDER: readonly SceneSlug[] = ['meeting-room', 'lounge', 'restroom'];

/** 사전(i18n/messages/scenes)의 장면 본문 + 장면 이름(common.scenes) → Scene. 글자는 언어마다 사전에 있다. */
function build(items: ScenesMessages['items'], names: Record<SceneSlug, string>): readonly Scene[] {
  return ORDER.map((slug) => {
    const m = items[slug];
    return {
      slug,
      name: names[slug],
      keyword: m.keyword,
      title: m.title,
      description: m.description,
      lead: m.lead,
      problem: m.problem,
      how: m.how.map(([k, v]) => [k, v] as const),
      admin: m.admin,
      devices: m.devices,
      faq: m.faq,
    };
  });
}

/** 한국어 장면. 사이트맵·공유 그림(lib/og.ts, 엣지)·llms.txt·챗봇이 이것을 쓴다. */
export const SCENES: readonly Scene[] = build(scenes.ko.items, SCENE_NAMES);

const BY_LOCALE: Partial<Record<Locale, readonly Scene[]>> = { ko: SCENES };

/** 그 언어의 장면 — 모양·순서·slug는 SCENES와 같고 글자만 다르다. */
export function scenesFor(locale: Locale): readonly Scene[] {
  return (BY_LOCALE[locale] ??= build(scenes[locale].items, common[locale].scenes));
}

/**
 * 구축 분야 페이지(/solutions/*)에서 이어 줄 장면. 그 분야에서 실제로 마주치는 공간만 잇는다 —
 * 스마트홈·AI 빌딩(BMS)은 회의실·휴게실·화장실 장면과 거리가 멀어 잇지 않는다.
 */
export const SCENES_FOR_FIELD: Record<string, readonly SceneSlug[]> = {
  'smart-office': ['meeting-room', 'lounge', 'restroom'],
  'smart-building': ['meeting-room', 'lounge', 'restroom'],
  'ai-office': ['meeting-room', 'lounge', 'restroom'],
  'unmanned-automation': ['meeting-room', 'lounge'],
};

export function sceneBySlug(slug: string): Scene | undefined {
  return SCENES.find((s) => s.slug === slug);
}

export function sceneBySlugFor(locale: Locale, slug: string): Scene | undefined {
  return scenesFor(locale).find((s) => s.slug === slug);
}
