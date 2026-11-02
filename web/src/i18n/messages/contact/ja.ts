import type { ko } from './ko';

export const ja: typeof ko = {
  meta: {
    title: 'お問い合わせ',
    description:
      '空間の条件をお知らせいただければ、現場に合った構成と見積もりをご提案します。実測前のご相談と概要のご案内は無料です。',
  },
  title: 'お問い合わせ',
  lead: 'ご都合のよい方法をお選びください。KakaoTalkですぐにご質問いただくか、メールでお問い合わせいただければ24時間以内にご連絡します。現場の条件に合った構成と見積もりを無料でご提案します。',
  kakao: {
    heading: 'KakaoTalkですぐに相談',
    body: '気になることを今すぐご質問ください。担当者がKakaoTalkのチャットでお答えします。',
    button: 'KakaoTalkで問い合わせる',
    note: '{name}のKakaoTalkチャンネル · 新しいウィンドウで開きます。PCではKakaoにログインした後、KakaoTalkで会話が続きます。',
    phone: 'お電話の場合は ',
  },
  email: {
    heading: 'メールでお問い合わせ',
    before:
      '下のフォームを送信いただくと担当者に直接届き、ご記入いただいたメールアドレスまたは電話番号宛てにご返信します。メールソフトをお使いの場合は ',
    after: ' 宛てにお送りいただいても構いません。',
  },
  more: {
    heading: '所在地 · ご依頼の流れ',
    address: '住所',
    steps: 'その後の流れ',
  },
  steps: ['ご相談・要件分析', '現地実測', '設計・見積もり', '施工・設置', '検収・保守'],

  form: {
    honeypot: 'この欄は空欄のままにしてください',
    required: ' は必須項目です。',
    name: 'お名前',
    namePlaceholder: '山田 太郎',
    company: '会社名',
    companyPlaceholder: '株式会社サンプル',
    email: 'メールアドレス',
    emailPlaceholder: 'example@company.com',
    phone: '電話番号',
    phonePlaceholder: '+81 00-0000-0000',
    message: 'お問い合わせ内容',
    messagePlaceholder: 'ご検討中のソリューションやご質問などを自由にご記入ください。',
    consent: '個人情報の収集・利用に同意します。',
    privacy: 'プライバシーポリシーを見る',
    sending: '送信中…',
    submit: '相談を申し込む',
    note: 'ご入力いただいた情報はご相談の目的にのみ使用します。',
    failed: '送信に失敗しました。',
    network: 'ネットワーク接続が切れたため、送信できませんでした。',
    fallback: {
      before: 'お電話 ',
      between: ' またはメール ',
      after: ' まで直接ご連絡ください。',
    },
    demo: {
      title: 'ショールームデモのお申し込み',
      notice: ' — {scene}。ご希望の日時をご記入いただければ、担当者が日程を調整してご連絡します。',
      message:
        '{mark} {scene}\n城南（ソンナム）のショールームでこのシーンを見学したいです。\n希望日時：\n訪問人数：\n当社のスペース（階数・部屋数など）：',
    },
  },

  api: {
    nameRequired: 'お名前を入力してください。',
    nameTooLong: 'お名前は{n}文字以内で入力してください。',
    companyTooLong: '会社名は{n}文字以内で入力してください。',
    emailRequired: 'メールアドレスを入力してください。',
    emailTooLong: 'メールアドレスは{n}文字以内で入力してください。',
    emailInvalid: 'メールアドレスの形式をご確認ください。',
    phoneTooLong: '電話番号は{n}文字以内で入力してください。',
    messageRequired: 'お問い合わせ内容を入力してください。',
    messageTooLong: 'お問い合わせ内容は{n}文字以内で入力してください。',
    rateLimited: 'しばらくしてから再度お試しください。お急ぎの場合は {tel} までご連絡ください。',
    unreadable: 'リクエストを読み取れませんでした。もう一度お試しください。',
    malformed: 'リクエストの形式が正しくありません。',
    failed: '送信に失敗しました。{tel} または {email} まで直接ご連絡ください。',
  },

  done: {
    meta: { title: 'お申し込み完了' },
    eyebrow: '受付完了',
    title: ['お申し込みを', '受け付けました'],
    lead: 'ご記入いただいた内容は担当者に直接届きました。ここからは私たちの番です。',
    next: {
      heading: 'その後の流れ',
      items: [
        { when: '24時間以内', what: 'ご記入いただいた連絡先に担当者からご連絡します。' },
        { when: 'ご相談・要件分析', what: '空間の用途とご希望の制御範囲をお伺いし、構成をご提案します。' },
        { when: '現地実測', what: '現地を訪問し、空間の構造と設備環境を確認します。見積もりはその後に確定します。' },
      ],
    },
    urgent: { before: 'お急ぎの場合は、今すぐ ', after: ' までお電話いただいても構いません。' },
    home: 'ホームへ',
    about: '構築の流れを見る',
    more: 'お待ちいただく間に',
  },
};
