import { messages } from '@/i18n/check';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

export const bizmoa = messages('bizmoa', { ko, en, zh, ja });
export type BizmoaMessages = typeof ko;
