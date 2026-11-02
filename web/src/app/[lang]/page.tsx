/**
 * 영어·중국어·일본어 홈 — 한국어 홈(app/(ko)/page.tsx)을 그대로 다시 내보낸다.
 * 화면은 getLocale()로 언어를 읽는다. 경로 설정(dynamicParams)은 Next가 파일에서 직접 읽으므로 여기 적는다.
 */
export { default } from '@/app/(ko)/page';
export const dynamicParams = false;
