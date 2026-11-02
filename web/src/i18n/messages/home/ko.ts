/**
 * 홈 — 히어로(components/Hero.tsx)와 그 아래 구축 분야 판(components/HomeBody.tsx).
 * 상담 챗봇 글자는 messages/chat에 따로 있다.
 */
export const ko = {
  hero: {
    /** 첫 진입 로딩 게이트 — 낭독용 상태 문구와 화면에 보이는 인사. */
    gateAria: '첫 화면을 준비하고 있습니다',
    gateLabel: '지에스엘티에 방문 감사드립니다',
    /**
     * 헤드라인. 앞 절(setup)은 작게, 결론 두 줄은 크게 선다(globals.css .hero-title).
     * 줄마다 pre · accent · post — accent만 브랜드색이다. 빈 글자는 그리지 않는다.
     * 결론 줄은 320px 폭(글자 자리 288px, 1.9rem Black)에서 한 줄에 들어가야 한다 — 번역도 그 폭에 맞춰 끊는다.
     */
    title: {
      setup: '맞춤형 공간 설계부터 디바이스 구축까지,',
      lines: [
        { pre: '당신에게 ', accent: '딱 맞춘', post: '' },
        { pre: '공간 지능 솔루션.', accent: '', post: '' },
      ],
    },
    desc: '지에스엘티는 오피스·주거·빌딩, 모든 공간을 배선 공사 없이 스마트 공간으로 완성하는 IoT 구축 전문기업입니다.',
    scroll: '스크롤',
  },
  body: {
    eyebrow: '구축 분야',
    /** 두 줄 — 사이에 <br />. */
    title: ['공간의 종류만큼', '짓는 방식도 다릅니다'],
    intro:
      '지에스엘티는 배선 공사 없이 기존 공간을 스마트 공간으로 바꿉니다. 사무실과 주택, 빌딩은 층 구조도 설비도 다르기 때문에 같은 방식으로 짓지 않습니다.',
    /** 카드 제목이 곧 이 회사가 잡히고 싶은 검색어다. href는 각 분야 페이지(/solutions/*). */
    fields: [
      {
        href: '/solutions/smart-office',
        title: '커스텀 스마트오피스',
        desc: '사무실마다 층 구조와 업무 방식이 다릅니다. 스마트오피스 구축은 표준 패키지가 아니라 그 공간을 실측하는 데서 시작합니다.',
      },
      {
        href: '/solutions/smart-home',
        title: '스마트홈',
        desc: '이미 지어진 주택과 아파트도 대규모 공사 없이 바꿉니다. 클라우드 월패드와 로비폰으로 조명·냉난방·보안을 하나로 묶습니다.',
      },
      {
        href: '/solutions/smart-building',
        title: '커스텀 스마트빌딩',
        desc: '출입 통제와 에너지 관리, 안전 설비를 한 플랫폼에 모읍니다. 신축이 아니어도 기존 빌딩 위에 그대로 얹습니다.',
      },
      {
        href: '/solutions/unmanned-automation',
        title: '무인 자동화',
        desc: '예약과 출입, 전원을 하나로 잇습니다. 관리자가 상주하지 않아도 예약 시간에 맞춰 공간이 스스로 열리고 닫힙니다.',
      },
      {
        href: '/solutions/ai-building-bms',
        title: 'AI 빌딩 · BMS',
        desc: '설비 데이터를 모아 이상 징후를 예측합니다. 인공지능 빌딩 관제는 경보에서 끝나지 않고 조치 절차와 작업 지시까지 잇습니다.',
      },
      {
        href: '/solutions/ai-office',
        title: '인공지능 오피스',
        desc: '재실과 사용 패턴을 근거로 조명과 공조를 자동 조절합니다. 사람이 없는 구역에 전력을 쓰지 않습니다.',
      },
    ],
    more: '자세히',
    /** 시옷 홈페이지로 잇는 띠. body의 {lead}는 common.solutions.siot.lead. */
    siot: {
      logoAlt: '시옷(SIOT)',
      title: '여섯 분야 모두, 운영은 시옷 한 화면에서',
      body: '{lead} 배선 공사 없이 지금 쓰는 공간 그대로 얹습니다.',
      cta: '시옷 홈페이지 바로가기',
    },
  },
};
