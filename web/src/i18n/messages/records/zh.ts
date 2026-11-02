import type { ko } from './ko';

export const zh: typeof ko = {
  news: {
    meta: {
      title: '新闻',
      description: 'GSLT 的最新动态与媒体报道，按时间顺序汇集获奖、专利申请及国家课题入选等记录。',
    },
    title: 'GSLT 新闻',
    lead: '这里记录着公司的点滴——既有我们自己发布的动态，也有媒体对我们的报道。',
    columns: ['日期', '类别', '标题'],
    filter: { all: '全部', article: '公司动态', press: '媒体报道' },
    empty: { title: '暂无新闻', body: '有新动态时，我们会第一时间在这里发布。' },
    noMatch: { title: '没有符合条件的记录', body: '请选择其他类别。' },
    showAll: '查看全部',
    pressNote: '媒体报道均附有文章摘要和原文链接。',
  },
  portfolio: {
    meta: {
      title: '项目案例',
      description: '记录 GSLT 实际建成的空间，以及各现场的条件和所采用的解决方案。',
    },
    title: '项目案例',
    lead: '不拆改原有布线，我们改造了哪些空间、又是如何改造的——按现场整理的建设记录。',
    columns: ['日期', '现场'],
    all: '全部',
    empty: {
      title: '项目案例正在整理中',
      body: '我们正在整理已完成的现场，并陆续公开。如需特定现场的案例，请告诉我们。',
      action: '索取案例',
    },
    noMatch: { title: '该标签下暂无记录', body: '请选择其他标签。' },
    showAll: '查看全部',
  },
  downloads: {
    meta: {
      title: '资料下载',
      description: '可下载 GSLT 公司介绍及解决方案资料。如需其他资料，欢迎随时向我们索取。',
    },
    title: '资料下载',
    lead: '公司介绍和产品资料，点击即可直接下载。',
    total: '共 {n} 个文件',
    columns: ['日期', '格式', '资料'],
    empty: {
      title: '暂无公开资料',
      body: '如需资料，请联系我们，我们会尽快发送给您。',
      action: '索取资料',
    },
  },
  post: {
    notFound: '找不到该文章',
    back: { news: 'GSLT 新闻', portfolio: '项目案例', downloads: '资料下载' },
    kind: { article: '公司动态', press: '媒体报道', portfolio: '项目案例', downloads: '资料' },
    category: { news: '新闻', portfolio: '项目案例', downloads: '资料下载' },
    categoryFallback: '新闻',
    describe: '{title} — {site} {category}',
    imageAlt: '{title} 主图',
    views: '浏览 {n}',
    pressSummary: '本摘要由 GSLT 整理。',
    source: { outlet: '媒体', reporter: '记者', mirrors: '转载' },
    reporterValue: '{name}',
    byline: '记者 {name}',
    original: '查看原文',
    originalAt: '查看{outlet}原文',
    pressRights: '文章正文及图片的权利归相关媒体所有。',
    nav: '其他记录',
    prev: '上一条',
    next: '下一条',
    cta: {
      title: '如何应用到您的空间？',
      body: '我们将根据现场条件，免费为您提供配置方案。',
      action: '咨询合作',
    },
  },
  translation: {
    ai: '由 AI 译自韩语原文',
    original: '以韩语原文显示',
  },
};
