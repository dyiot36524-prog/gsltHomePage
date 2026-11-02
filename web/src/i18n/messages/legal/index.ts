import { messages } from '@/i18n/check';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

/** 개인정보 처리방침 · 서비스 이용약관(app/(ko)/legal/…). 외국어 판은 참고용 번역이고 한국어 원문이 우선한다. */
export const legal = messages('legal', { ko, en, zh, ja });
export type LegalMessages = typeof ko;
