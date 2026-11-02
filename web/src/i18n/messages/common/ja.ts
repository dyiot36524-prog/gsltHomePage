import type { ko } from './ko';

export const ja: typeof ko = {
  site: {
    name: 'GSLT',
    titleTemplate: '%s | GSLT',
    description:
      'GSLTはワイヤレスIoTの構築を専門とする企業です。配線工事なしでオフィス・住宅・ビルをスマート空間に変え、施工から保守まで自社で行います。',
  },
  nav: {
    home: 'ホーム',
    about: '会社概要',
    faq: 'よくある質問',
    news: 'ニュース',
    downloads: '資料',
    portfolio: '導入事例',
    solutions: 'ソリューション',
    contact: 'お問い合わせ',
  },
  header: {
    homeAria: '{name} ホーム',
    newWindow: '（新しいウィンドウで開きます）',
    language: '言語',
  },
  solutions: {
    featured: '主力ソリューション',
    siotSite: 'SIOT 公式サイト',
    scenes: '活用シーン',
    siot: {
      name: 'SIOT',
      desc: 'ビル管制 · スペース予約 · 複合自動化',
      lead: '予約と入退室、照明と空調、エネルギーと記録まで、ひとつのプラットフォームで。',
      pillars: ['統合管制', 'スペース予約', '入退室連携', '自動化', 'エネルギー'],
    },
    bizmoa: {
      name: 'BizMoa',
      desc: 'IoT施工見積もり自動化SaaS',
      lead: '図面の上に機器を配置するだけで、見積書・契約書・納品確認書が自動で作成されます。',
    },
    morak: {
      name: 'Morak',
      desc: '期別コミュニティ',
      lead: 'デジタル名刺でつながる、同窓会・OB会のためのコミュニティプラットフォーム。',
    },
  },
  scenes: {
    'meeting-room': '会議室の予約・制御',
    lounge: '休憩スペースの予約・在室状況ボード',
    restroom: 'トイレの在室表示',
  },
  footer: {
    intro: ['ワイヤレスIoT構築の専門企業。', '配線工事なしで、オフィス・住宅・ビルをスマート空間に仕上げます。'],
    colSolutions: 'ソリューション',
    colNews: 'お知らせ',
    colLegal: '法的情報',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    support: 'カスタマーサポート',
    company: '商号',
    ceo: '代表者',
    bizNo: '事業者登録番号',
    address: '所在地',
    tel: 'Tel',
    email: 'Email',
    kakao: 'KakaoTalkチャンネル',
    family: '関連サイト',
  },
  company: {
    name: 'GSLT',
    legalName: 'GSLT Co., Ltd.',
    ceo: 'Kwangsu Choi',
    address:
      '#501, Woolim Lions Valley 3, 24 Dunchon-daero 388beon-gil, Jungwon-gu, Seongnam-si, Gyeonggi-do, Republic of Korea',
    tel: '+82-70-4659-4804',
  },
  furniture: { name: 'GSLT Furniture', desc: 'ロッカー・家具 · 韓国語サイト' },
  list: {
    total: '全{n}件',
    filter: '一覧の絞り込み',
  },
  scrollTop: 'ページの先頭へ',
  notFound: {
    title: 'ページが見つかりません',
    body: 'アドレスが変更されたか、削除されたページです。',
    home: 'ホームに戻る',
    contact: 'お探しの資料があればお問い合わせください',
  },
  error: {
    title: '内容を読み込めませんでした',
    body: '一時的な問題です。しばらくしてから再度お試しください。',
    retry: '再試行',
    home: 'ホーム',
    contact: 'お問い合わせ',
  },
};
