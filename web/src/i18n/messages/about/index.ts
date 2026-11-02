import { messages } from '@/i18n/check';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

export type AboutMessages = typeof ko;
export const about = messages('about', { ko, en, zh, ja });
