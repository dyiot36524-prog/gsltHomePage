import { CONDITIONS, FIELDS, type FieldSlug, type FieldText } from '@/lib/fields';

/**
 * 구축 분야 페이지(/solutions/[slug]) — 화면 글자와 분야 본문.
 *
 * 분야 본문의 한국어 원본은 lib/fields.ts FIELDS다(사이트맵·공유 그림·llms.txt·챗봇이 읽는다).
 * 여기서는 그 글자만 떼어 번역의 기준 모양으로 둔다 — en·zh·ja의 분야·FAQ·목록 수가 한국어와 같은지
 * index.ts의 messages()가 검사한다. 번역은 lib/fields.ts의 fieldsFor()가 FIELDS에 입힌다.
 */
const items = Object.fromEntries(
  FIELDS.map((f) => [
    f.slug,
    {
      keyword: f.keyword,
      title: f.title,
      description: f.description,
      lead: f.lead,
      problem: f.problem,
      approach: f.approach,
      features: f.features,
      featuresLead: f.featuresLead,
      product: { name: f.product.name, why: f.product.why },
      faq: f.faq,
    },
  ]),
) as Record<FieldSlug, FieldText>;

export const ko = {
  sections: {
    problem: '이 공간에서 생기는 일',
    approach: '이렇게 짓습니다',
    features: '붙는 것',
    product: '받치는 제품',
    scenes: '시옷 활용 장면',
    faq: '자주 묻는 질문',
    others: '다른 구축 분야',
  },
  cta: {
    title: '우리 공간에도 될까요?',
    body: '공간 조건과 원하는 제어 범위를 알려주시면 현장에 맞는 구성을 제안해 드립니다. 실측 전 상담은 무료입니다.',
    button: '도입 문의',
  },
  /** 구조화 데이터 — 빵부스러기 첫 칸과 서비스 지역. */
  ld: {
    home: '홈',
    country: '대한민국',
  },
  /** 모든 분야에 공통인 적용 조건(lib/fields.ts CONDITIONS). */
  conditions: CONDITIONS,
  items,
};
