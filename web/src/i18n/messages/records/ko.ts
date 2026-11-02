/**
 * 기록 페이지 — 소식(/news) · 시공사례(/portfolio) · 자료실(/downloads) · 글 지면(/news/<id>)의 고정 글자.
 * 글 자체(제목·요약·본문·첨부 이름)는 관리자가 한국어로 쓴다. 외국어 화면은 lib/translate.ts가 AI로 옮긴다.
 */
export const ko = {
  news: {
    meta: {
      // 틀이 뒤에 상호를 붙이므로 앞에 또 쓰지 않는다('GSLT 소식 | GSLT'였다).
      title: '소식',
      description:
        '지에스엘티의 새 소식과 언론보도입니다. 수상·특허 출원·국책과제 선정 기록을 시간순으로 모아 전해 드립니다.',
    },
    title: 'GSLT 소식',
    lead: '회사가 남긴 기록입니다. 직접 쓴 소식과, 저희를 다룬 언론 보도를 함께 모았습니다.',
    columns: ['일자', '구분', '제목'],
    filter: { all: '전체', article: '자사 소식', press: '언론보도' },
    empty: { title: '아직 등록된 소식이 없습니다', body: '새로운 소식이 준비되면 이곳에 먼저 올립니다.' },
    noMatch: { title: '해당하는 기록이 없습니다', body: '다른 구분을 선택해 보세요.' },
    showAll: '전체 보기',
    pressNote: '언론보도는 기사 요약과 원문 링크를 함께 실었습니다.',
  },
  portfolio: {
    meta: {
      title: '시공사례',
      description: '지에스엘티가 실제로 구축한 공간들. 현장 조건과 적용 솔루션을 기록으로 남깁니다.',
    },
    title: '시공사례',
    lead: '배선을 뜯지 않고 어떤 공간을, 어떻게 바꿨는지. 현장별로 남긴 구축 기록입니다.',
    columns: ['일자', '현장'],
    all: '전체',
    empty: {
      title: '시공사례를 준비하고 있습니다',
      body: '진행한 현장을 정리해 순차적으로 공개하고 있습니다. 특정 현장 사례가 필요하시면 알려주세요.',
      action: '사례 요청하기',
    },
    noMatch: { title: '해당 태그의 기록이 없습니다', body: '다른 태그를 선택해 보세요.' },
    showAll: '전체 보기',
  },
  downloads: {
    meta: {
      title: '자료실',
      description:
        '지에스엘티 회사소개서와 솔루션 자료를 내려받으실 수 있습니다. 필요한 자료가 있으시면 언제든 요청해 주세요.',
    },
    title: '자료실',
    lead: '회사소개서와 제품 자료입니다. 클릭하면 바로 내려받습니다.',
    /** 목록 머리의 총 건수. 자료실의 단위는 글이 아니라 파일이다. {n} = 숫자. */
    total: '총 {n}개 파일',
    columns: ['일자', '형식', '자료'],
    empty: {
      title: '아직 공개된 자료가 없습니다',
      body: '필요한 자료가 있으시면 문의 주세요. 바로 보내드리겠습니다.',
      action: '자료 요청하기',
    },
  },
  post: {
    notFound: '글을 찾을 수 없습니다',
    /** 뒤로 가기 링크와 경로 표시(breadcrumb)의 이름. 분류마다 돌아갈 목록이 다르다. */
    back: { news: 'GSLT 소식', portfolio: '포트폴리오', downloads: '자료실' },
    /** 제목 위 구분 태그. */
    kind: { article: '자사 소식', press: '언론보도', portfolio: '시공사례', downloads: '자료' },
    /** 검색 설명의 분류 이름(lib/posts.ts CATEGORY_LABEL과 같은 말). */
    category: { news: '뉴스', portfolio: '포트폴리오', downloads: '자료실' },
    categoryFallback: '소식',
    /** 요약도 본문도 없을 때의 검색 설명. {title} 글 제목, {site} 상호, {category} 분류. */
    describe: '{title} — {site} {category}',
    imageAlt: '{title} 대표 이미지',
    views: '조회 {n}',
    pressSummary: 'GSLT가 정리한 요약입니다.',
    source: { outlet: '매체', reporter: '기자', mirrors: '전재' },
    /** 지면 출처 표의 기자 칸. */
    reporterValue: '{name} 기자',
    /** 목록 행의 기자 표기. */
    byline: '{name} 기자',
    original: '원문 보기',
    originalAt: '{outlet} 원문 보기',
    pressRights: '기사 본문과 사진은 해당 언론사에 있습니다.',
    nav: '다른 기록',
    prev: '이전 기록',
    next: '다음 기록',
    cta: {
      title: '우리 공간에는 어떻게 적용될까요?',
      body: '현장 조건에 맞는 구성을 무료로 제안해 드립니다.',
      action: '도입 문의',
    },
  },
  /** 외국어 화면에서 관리자 글 옆에 붙는 안내. 한국어 화면에는 나가지 않는다. */
  translation: {
    ai: 'AI가 한국어 원문을 번역했습니다',
    original: '한국어 원문 그대로 보여 드립니다',
  },
};
