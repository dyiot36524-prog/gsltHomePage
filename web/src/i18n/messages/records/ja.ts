import type { ko } from './ko';

export const ja: typeof ko = {
  news: {
    meta: {
      title: 'ニュース',
      description:
        'GSLTの最新情報とメディア掲載です。受賞・特許出願・国家プロジェクト採択などの記録を時系列でお届けします。',
    },
    title: 'GSLTニュース',
    lead: '会社の歩みの記録です。自社からのお知らせと、当社を取り上げた報道をまとめました。',
    columns: ['日付', '区分', 'タイトル'],
    filter: { all: 'すべて', article: 'お知らせ', press: 'メディア掲載' },
    empty: { title: 'まだニュースはありません', body: '新しいお知らせは、まずこちらに掲載します。' },
    noMatch: { title: '該当する記録はありません', body: '別の区分を選んでください。' },
    showAll: 'すべて見る',
    pressNote: 'メディア掲載では、記事の要約と元記事へのリンクをあわせて掲載しています。',
  },
  portfolio: {
    meta: {
      title: '導入事例',
      description: 'GSLTが実際に構築した空間を、現場の条件と導入したソリューションとともに記録しています。',
    },
    title: '導入事例',
    lead: '配線を剥がさずに、どんな空間をどう変えたのか。現場ごとに残した構築の記録です。',
    columns: ['日付', '現場'],
    all: 'すべて',
    empty: {
      title: '導入事例を準備しています',
      body: '施工した現場を整理し、順次公開しています。特定の現場の事例が必要な場合はお知らせください。',
      action: '事例をリクエスト',
    },
    noMatch: { title: 'このタグの記録はありません', body: '別のタグを選んでください。' },
    showAll: 'すべて見る',
  },
  downloads: {
    meta: {
      title: '資料ダウンロード',
      description:
        'GSLTの会社案内とソリューション資料をダウンロードいただけます。必要な資料があれば、いつでもお申し付けください。',
    },
    title: '資料ダウンロード',
    lead: '会社案内と製品資料です。クリックするとすぐにダウンロードできます。',
    total: '全{n}ファイル',
    columns: ['日付', '形式', '資料'],
    empty: {
      title: '公開中の資料はまだありません',
      body: '必要な資料があればお問い合わせください。すぐにお送りします。',
      action: '資料をリクエスト',
    },
  },
  post: {
    notFound: '記事が見つかりません',
    back: { news: 'GSLTニュース', portfolio: '導入事例', downloads: '資料ダウンロード' },
    kind: { article: 'お知らせ', press: 'メディア掲載', portfolio: '導入事例', downloads: '資料' },
    category: { news: 'ニュース', portfolio: '導入事例', downloads: '資料' },
    categoryFallback: 'ニュース',
    describe: '{title} — {site} {category}',
    imageAlt: '{title}のメイン画像',
    views: '閲覧数 {n}',
    pressSummary: 'GSLTがまとめた要約です。',
    source: { outlet: '媒体', reporter: '記者', mirrors: '転載' },
    reporterValue: '{name} 記者',
    byline: '{name} 記者',
    original: '元記事を読む',
    originalAt: '{outlet}で元記事を読む',
    pressRights: '記事本文と写真の権利は、掲載したメディアに帰属します。',
    nav: 'ほかの記録',
    prev: '前の記録',
    next: '次の記録',
    cta: {
      title: 'お客様の空間では、どう活かせるでしょうか？',
      body: '現場の条件に合った構成を無料でご提案します。',
      action: 'お問い合わせ',
    },
  },
  translation: {
    ai: '韓国語の原文をAIが翻訳しました',
    original: '韓国語の原文のまま表示しています',
  },
};
