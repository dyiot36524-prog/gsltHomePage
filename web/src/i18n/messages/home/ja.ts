import type { ko } from './ko';

export const ja: typeof ko = {
  hero: {
    gateAria: 'ページを準備しています',
    gateLabel: 'GSLTへのご訪問ありがとうございます',
    title: {
      setup: 'オーダーメイドの空間設計からデバイス構築まで、',
      lines: [
        { pre: 'あなたに', accent: 'ぴったり', post: 'の' },
        { pre: 'スマート空間を。', accent: '', post: '' },
      ],
    },
    desc: 'GSLTは、オフィス・住宅・ビルなどあらゆる空間を、配線工事なしでスマート空間に仕上げるIoT構築の専門企業です。',
    scroll: 'スクロール',
  },
  body: {
    eyebrow: '構築分野',
    title: ['空間の種類だけ、', 'つくり方も異なります'],
    intro:
      'GSLTは配線工事なしで、既存の空間をスマート空間に変えます。オフィス、住宅、ビルはフロア構成も設備も異なるため、同じ方法ではつくりません。',
    fields: [
      {
        href: '/solutions/smart-office',
        title: 'カスタムスマートオフィス',
        desc: 'オフィスごとにフロア構成も働き方も異なります。スマートオフィスの構築は、標準パッケージではなく、その空間の実測から始まります。',
      },
      {
        href: '/solutions/smart-home',
        title: 'スマートホーム',
        desc: '建築済みの住宅やマンションも、大規模な工事なしで生まれ変わります。クラウド型ウォールパッドとロビーインターホンで、照明・冷暖房・セキュリティをひとつにまとめます。',
      },
      {
        href: '/solutions/smart-building',
        title: 'カスタムスマートビル',
        desc: '入退室管理、エネルギー管理、安全設備をひとつのプラットフォームに集約します。新築でなくても、既存のビルにそのまま導入できます。',
      },
      {
        href: '/solutions/unmanned-automation',
        title: '無人自動化',
        desc: '予約と入退室、電源をひとつにつなぎます。管理者が常駐していなくても、予約時間に合わせて空間が自動で開き、閉まります。',
      },
      {
        href: '/solutions/ai-building-bms',
        title: 'AIビル · BMS',
        desc: '設備データを集めて異常の兆候を予測します。AIによるビル管制はアラートで終わらず、対応手順と作業指示までつなげます。',
      },
      {
        href: '/solutions/ai-office',
        title: 'AIオフィス',
        desc: '在室状況と利用パターンをもとに、照明と空調を自動で調整します。人のいないエリアでは電力を使いません。',
      },
    ],
    more: '詳しく見る',
    siot: {
      logoAlt: 'SIOT',
      title: '6つの分野すべてを、SIOTのひとつの画面で運用',
      body: '{lead}配線工事なしで、今お使いの空間にそのまま導入できます。',
      cta: 'SIOT公式サイトへ',
    },
  },
};
