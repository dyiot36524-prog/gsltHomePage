import { messages } from '@/i18n/check';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

/** 시옷 활용 장면 본문과 장면 페이지 글자. 장면 모양(Scene)으로 엮는 것은 lib/scenes.ts의 scenesFor다. */
export const scenes = messages('scenes', { ko, en, zh, ja });
export type ScenesMessages = typeof ko;
