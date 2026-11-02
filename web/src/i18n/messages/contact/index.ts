import { messages } from '@/i18n/check';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

export const contact = messages('contact', { ko, en, zh, ja });
export type ContactMessages = typeof ko;
/** 상담 신청 폼(브라우저 컴포넌트)에 넘기는 조각. */
export type ContactFormMessages = ContactMessages['form'];
