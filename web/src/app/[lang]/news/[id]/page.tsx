/**
 * news/[id]의 영어·중국어·일본어 판 — 한국어 페이지(app/(ko)/news/[id]/page.tsx)를 그대로 다시 내보낸다.
 * dynamicParams는 true다 — 빌드 뒤에 올린 글도 첫 방문 때 그려 캐시한다(한국어 판과 같은 규칙).
 */
export { default, generateMetadata } from '@/app/(ko)/news/[id]/page';
export { generateStaticParams } from '@/app/(ko)/news/[id]/page';
export const dynamicParams = true;
