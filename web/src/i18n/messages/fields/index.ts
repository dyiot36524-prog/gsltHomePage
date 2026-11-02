import { messages } from '@/i18n/check';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

/**
 * 구축 분야 페이지(/solutions/[slug]) 사전. 화면 글자는 여기서, 분야 본문은 lib/fields.ts의
 * fieldBySlugFor()로 읽는다 — 이 모듈을 읽는 순간 분야 번역의 모양(분야·FAQ·목록 수)도 함께 검사된다.
 */
export const fields = messages('fields', { ko, en, zh, ja });
export type FieldsMessages = typeof ko;
