import { FAQ_GROUPS } from '@/lib/faq';

/**
 * 자주 묻는 질문(/faq) — 화면 글자와 질문 목록.
 *
 * 질문의 한국어 원본은 lib/faq.ts FAQ_GROUPS다(llms-full.txt·챗봇이 읽는다). 여기서는 번역의 기준 모양으로
 * 그대로 둔다 — en·zh·ja의 묶음·질문 수와 묶음 id가 한국어와 같은지 index.ts의 messages()가 검사한다.
 * 화면과 FAQPage 구조화 데이터는 lib/faq.ts의 faqFor(locale)로 그 언어 판을 꺼낸다.
 */
export const ko = {
  meta: {
    title: '자주 묻는 질문',
    description: '배선 공사 없이 되는지, 임대 사무실도 가능한지, 비용은 어떻게 산정되는지 — 자주 받는 질문을 모았습니다.',
  },
  title: '자주 묻는 질문',
  lead: '무선 IoT 구축을 검토하실 때 가장 많이 받는 질문입니다.',
  cta: {
    title: '여기에 없는 질문이라면',
    body: '공간 조건과 원하는 제어 범위를 알려주시면 현장에 맞는 구성을 제안해 드립니다.',
    button: '도입 문의',
  },
  groups: FAQ_GROUPS,
};
