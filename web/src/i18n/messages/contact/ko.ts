/**
 * 도입 문의(/contact) · 접수 완료(/contact/done) · 상담 신청 폼 · 문의 접수 API(/api/inquiry)가
 * 방문자에게 보이는 글자.
 *
 * 링크 앞뒤 글자(before · after)는 띄어쓰기까지 글자에 넣는다 — 언어마다 링크 앞뒤의 공백이 다르다.
 */
export const ko = {
  meta: {
    title: '도입 문의',
    description: '공간 조건을 알려주시면 현장에 맞는 구성과 견적을 제안해 드립니다. 실측 전 상담과 개략 안내는 무료입니다.',
  },
  title: '도입 문의',
  lead: '편한 방법 하나를 고르세요. 카카오톡으로 바로 묻거나, 이메일로 문의를 남겨 주시면 24시간 내에 연락드립니다. 현장 조건에 맞는 구성과 견적은 무료로 제안해 드립니다.',
  kakao: {
    heading: '카카오톡으로 바로 문의',
    body: '궁금한 것을 지금 바로 물어보세요. 담당자가 카카오톡 채팅으로 답합니다.',
    button: '카카오톡으로 문의하기',
    /**
     * {name} = 카카오톡 채널 이름(lib/site.ts KAKAO.name). 영문 채널명은 없어서 외국어 판은 상호(common.company.name)를
     * 받아 'GSLT의 카카오톡 채널'로 쓴다.
     */
    note: '카카오톡 채널 ‘{name}’ · 새 창에서 열립니다. PC에서는 카카오 로그인 후 카카오톡에서 대화가 이어집니다.',
    /** 전화번호 링크 앞 글자. */
    phone: '전화가 편하시면 ',
  },
  email: {
    heading: '이메일로 문의 남기기',
    /** 메일 주소 링크 앞뒤 글자. */
    before:
      '아래 양식을 보내 주시면 담당자에게 바로 전달되고, 남겨 주신 이메일이나 연락처로 답을 드립니다. 메일 프로그램이 편하시면 ',
    after: '로 보내셔도 됩니다.',
  },
  more: {
    heading: '찾아오시는 곳 · 진행 순서',
    address: '주소',
    steps: '이후 절차',
  },
  /** 시공 5단계. PRODUCT.md가 정의한 실제 진행 순서다. */
  steps: ['상담·요구분석', '현장실측', '설계·견적', '시공·설치', '검수·유지보수'],

  /** 상담 신청 폼(components/ContactForm.tsx). */
  form: {
    honeypot: '이 칸은 비워 두세요',
    /** '*' 뒤에 붙는 글자. */
    required: ' 표시는 필수 항목입니다.',
    name: '이름',
    namePlaceholder: '홍길동',
    company: '회사명',
    companyPlaceholder: '(주)예시회사',
    email: '이메일',
    emailPlaceholder: 'example@company.com',
    phone: '연락처',
    phonePlaceholder: '010-0000-0000',
    message: '문의 내용',
    messagePlaceholder: '도입을 검토 중인 솔루션이나 궁금하신 점을 자유롭게 적어주세요.',
    consent: '개인정보 수집·이용에 동의합니다.',
    privacy: '처리방침 보기',
    sending: '전송 중…',
    submit: '상담 신청 보내기',
    note: '입력하신 정보는 상담 목적으로만 사용됩니다.',
    /** 서버가 글자 없이 실패를 돌려줬을 때. */
    failed: '전송에 실패했습니다.',
    network: '네트워크 연결이 끊겨 전송하지 못했습니다.',
    /** 서버·네트워크가 죽었을 때 붙이는 대체 연락처. 전화 링크 · 메일 링크 사이의 글자. */
    fallback: {
      before: '전화 ',
      between: ' 또는 이메일 ',
      after: ' 로 직접 연락해 주세요.',
    },
    /** 장면 페이지의 '쇼룸 시연 신청'으로 들어왔을 때. */
    demo: {
      title: '쇼룸 시연 신청',
      /** {scene} = 그 언어의 장면 이름. */
      notice: ' — {scene}. 희망 날짜와 시간을 적어 주시면 담당자가 일정을 잡아 연락드립니다.',
      /**
       * 문의 내용 미리 채움. {mark} = '[쇼룸 시연 신청]'(lib/scene-names.ts DEMO_MARK — 알림이 이것으로
       * 시연 신청을 알아본다), {scene} = 직원이 읽을 한국어 장면 이름(외국어 판은 뒤에 그 언어 이름을 괄호로 붙인다).
       */
      message: '{mark} {scene} 장면을 성남 쇼룸에서 보고 싶습니다.\n희망 날짜·시간: \n방문 인원: \n우리 공간(층·실 수 등): ',
    },
  },

  /** 문의 접수 API(app/api/inquiry/route.ts)가 돌려주는 안내. {n} = 글자 수 상한, {tel} · {email} = 연락처. */
  api: {
    nameRequired: '이름을 입력해 주세요.',
    nameTooLong: '이름은 {n}자 이내로 입력해 주세요.',
    companyTooLong: '회사명은 {n}자 이내로 입력해 주세요.',
    emailRequired: '이메일을 입력해 주세요.',
    emailTooLong: '이메일은 {n}자 이내로 입력해 주세요.',
    emailInvalid: '이메일 형식을 확인해 주세요.',
    phoneTooLong: '연락처는 {n}자 이내로 입력해 주세요.',
    messageRequired: '문의 내용을 입력해 주세요.',
    messageTooLong: '문의 내용은 {n}자 이내로 입력해 주세요.',
    rateLimited: '잠시 후 다시 시도해 주세요. 급하시면 {tel}로 연락 주세요.',
    unreadable: '요청을 읽지 못했습니다. 다시 시도해 주세요.',
    malformed: '요청 형식이 올바르지 않습니다.',
    failed: '전송에 실패했습니다. {tel} 또는 {email} 으로 직접 연락해 주세요.',
  },

  /** 접수 완료(/contact/done). */
  done: {
    meta: { title: '상담 신청 완료' },
    eyebrow: '접수 완료',
    /** 두 줄로 세운다(<br/>). */
    title: ['상담 신청이', '접수되었습니다'],
    lead: '남겨 주신 내용은 담당자에게 바로 전달됐습니다. 이제 저희 차례입니다.',
    next: {
      heading: '이후 절차',
      /** 신청 이후의 실제 순서. steps와 같은 다섯 단계 중 첫 칸에 서 있다. */
      items: [
        { when: '24시간 이내', what: '담당자가 남겨 주신 연락처로 연락드립니다.' },
        { when: '상담 · 요구 분석', what: '공간 용도와 원하는 제어 범위를 듣고 구성을 제안합니다.' },
        { when: '현장 실측', what: '방문해 공간 구조와 설비 환경을 확인합니다. 견적은 이 뒤에 확정됩니다.' },
      ],
    },
    /** 전화번호 링크 앞뒤 글자. */
    urgent: { before: '급하시면 지금 바로 ', after: '로 전화 주셔도 됩니다.' },
    home: '홈으로',
    about: '구축 과정 보기',
    more: '기다리는 동안',
  },
};
