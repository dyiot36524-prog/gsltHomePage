import type { ko } from './ko';

export const zh: typeof ko = {
  site: {
    name: 'GSLT',
    titleTemplate: '%s | GSLT',
    description:
      'GSLT 是一家专注于无线物联网（IoT）系统建设的企业。无需布线施工，即可将办公室、住宅和楼宇打造为智能空间，并亲自负责施工与运维。',
  },
  nav: {
    home: '首页',
    about: '公司介绍',
    faq: '常见问题',
    news: '新闻',
    downloads: '资料下载',
    portfolio: '项目案例',
    solutions: '解决方案',
    contact: '咨询合作',
  },
  header: {
    homeAria: '{name} 首页',
    newWindow: '（在新窗口打开）',
    language: '语言',
  },
  solutions: {
    featured: '核心解决方案',
    siotSite: 'SIOT 官网',
    scenes: '应用场景',
    siot: {
      name: 'SIOT',
      desc: '楼宇管控 · 空间预约 · 综合自动化',
      lead: '预约与门禁、照明与空调、能源与记录，统一在一个平台上。',
      pillars: ['综合管控', '空间预约', '门禁联动', '自动化', '能源'],
    },
    bizmoa: {
      name: 'BizMoa',
      desc: 'IoT 施工报价自动化 SaaS',
      lead: '在图纸上布置设备，即可自动生成报价单、合同和交付确认书。',
    },
    morak: {
      name: 'Morak',
      desc: '期数制社群平台',
      lead: '以数字名片相连的校友会、同学会社群平台。',
    },
  },
  scenes: {
    'meeting-room': '会议室预约与控制',
    lounge: '休息区预约与在室状态看板',
    restroom: '卫生间在室显示',
  },
  footer: {
    intro: ['无线物联网系统建设专业企业。', '无需布线施工，将办公室、住宅和楼宇打造为智能空间。'],
    colSolutions: '解决方案',
    colNews: '动态',
    colLegal: '法律信息',
    terms: '服务条款',
    privacy: '隐私政策',
    support: '客户支持',
    company: '公司名称',
    ceo: '代表',
    bizNo: '营业执照号',
    address: '地址',
    tel: '电话',
    email: '邮箱',
    kakao: 'KakaoTalk 频道',
    family: '关联网站',
  },
  company: {
    name: 'GSLT',
    legalName: 'GSLT Co., Ltd.',
    ceo: 'Kwangsu Choi',
    address:
      '#501, Woolim Lions Valley 3, 24 Dunchon-daero 388beon-gil, Jungwon-gu, Seongnam-si, Gyeonggi-do, Republic of Korea',
    tel: '+82-70-4659-4804',
  },
  furniture: { name: 'GSLT Furniture', desc: '储物柜·家具 · 韩文网站' },
  list: {
    total: '共 {n} 条',
    filter: '列表筛选',
  },
  scrollTop: '返回顶部',
  notFound: {
    title: '找不到该页面',
    body: '页面地址可能已更改或已被删除。',
    home: '返回首页',
    contact: '找不到所需资料？请联系我们',
  },
  error: {
    title: '暂时无法加载内容',
    body: '这是临时问题，请稍后重试。',
    retry: '重试',
    home: '首页',
    contact: '联系我们',
  },
};
