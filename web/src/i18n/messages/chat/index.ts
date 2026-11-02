import { messages } from '@/i18n/check';
import { ko } from './ko';
import { en } from './en';
import { zh } from './zh';
import { ja } from './ja';

export const chat = messages('chat', { ko, en, zh, ja });
export type ChatMessages = typeof ko;
