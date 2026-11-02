import type { ko } from './ko';

export const zh: typeof ko = {
  meta: {
    title: '公司介绍',
    description:
      'GSLT 是成立于2023年的无线物联网建设专业企业。在这里了解公司代表、发展历程与获奖经历，以及五步施工流程。',
  },
  award: {
    imageAlt:
      '福布斯韩国大奖获奖图片。画面中有奖杯、福布斯韩国标志、2026最佳品牌大奖徽章，以及获奖企业 GSLT Co., Ltd. 的名称。',
    title: '福布斯韩国 2026 消费者评选最佳品牌大奖',
    category: '无线物联网智能空间类别',
    body: '2026-02-27 获《福布斯韩国》评选，2026-04-21 韩国经济TV 予以报道。凭借无需布线施工即可将现有空间改造为智能空间的无线物联网建设能力获得认可。',
    press: '查看报道原文',
    photoAlt:
      '福布斯韩国 2026 消费者评选最佳品牌大奖颁奖典礼现场。代表 Kwangsu Choi 手持印有 GSLT 名称的证书和奖牌站在台上，背景屏幕上显示“2026 消费者评选最佳品牌大奖 Korea Best Brand Awards”、2026年2月27日（星期五）上午10:20，以及中央日报、韩国科学技术信息通信部、韩国产业通商资源部和 Forbes Korea 的标志。',
    photoCaption: '颁奖典礼现场 · 代表 Kwangsu Choi · 2026-02-27',
  },
  hero: {
    title: ['以物联网构筑空间的', '专业建设企业'],
    lead: 'GSLT 以无需布线施工的无线物联网，将办公室、住宅和楼宇打造为智能空间。从咨询到运维，我们对建设的全过程负责。',
  },
  facts: {
    founded: { label: '成立', value: '2023年' },
    solutions: { label: '自研解决方案', value: '3个' },
    stability: { label: '物联网控制稳定性', value: '99.9%' },
  },
  process: {
    title: '物联网建设，这样进行',
    lead: '因为是无线物联网，无需大规模施工。保留现有空间原貌，只需五个步骤即可变成智能空间。',
    steps: [
      { no: '01', title: '咨询与需求分析', desc: '了解空间用途和所需的控制范围，提出最佳配置方案。' },
      { no: '02', title: '现场勘测', desc: '上门实地确认空间结构与设备环境。' },
      { no: '03', title: '设计与报价', desc: '在图纸上布置设备并核算报价。通过 BizMoa 即时生成报价单。' },
      { no: '04', title: '施工与安装', desc: '无需布线施工，安装无线设备并完成综合控制设置。' },
      { no: '05', title: '验收与运维', desc: '现场验收后交付，并以秒级监控持续管理。' },
    ],
  },
  videos: {
    title: '通过视频了解 GSLT',
    categories: { intro: '公司介绍', site: '施工现场', demo: '产品演示', press: '媒体·活动' },
    date: '{y}年{m}月{d}日',
    frameTitle: '{title}（YouTube 视频）',
    play: '播放视频：{title}',
    playing: '正在播放：{title}',
    source: '来源：{channel}',
    watch: '在 YouTube 上观看',
    list: '视频列表',
  },
  history: {
    title: '成果与发展历程',
    venture: {
      imageAlt:
        '风险企业认证书。企业名称 GSLT Co., Ltd.，认证类型为创新成长型，有效期自2026年09月09日至2029年09月08日，发证编号第20260909030005号，盖有风险企业认证机构负责人公章。',
      enlarge: '查看证书原件大图',
      title: '风险企业认证',
      sub: '创新成长型 · 2026',
      body: '依据《风险企业培育特别法》第25条获得认证。创新成长型是在评估技术创新性与业务成长性后予以认证的类型。',
      rows: [
        { label: '认证机构', value: '风险企业认证机构 · 社团法人韩国风险企业协会' },
        { label: '发证编号', value: '第20260909030005号' },
        { label: '有效期', value: '2026.09.09 ~ 2029.09.08' },
      ],
    },
    grants: [
      {
        title: '入选 Didimdol R&D 国家课题',
        by: '韩国中小风险企业部 · 2026',
        desc: '创业成长技术开发项目 — 无线物联网智能空间技术升级',
        alt: '国家研发项目协议书文件图片。课题信息与协议条件以表格整理，底部为签名栏。',
      },
      {
        title: '初期创业扶持计划 入选 · 结业',
        by: '韩国中小风险企业部 · 2025',
        desc: '完成技术升级与商业化支持项目',
        alt: '初期创业扶持计划执行确认书。上面写有项目执行内容，底部盖有韩国创业振兴院院长公章。',
      },
    ],
    timeline: [
      { year: '2023', title: 'GSLT 成立', desc: '作为智能空间解决方案企业创立，启动 SIOT 开发' },
      { year: '2025', title: '入选初期创业扶持计划', desc: '完成韩国中小风险企业部项目后结业' },
      {
        year: '2026',
        title: '福布斯大奖 · Didimdol R&D · 风险企业认证',
        desc: '继获得大奖并入选国家课题之后，于9月获得风险企业认证（创新成长型）',
      },
    ],
  },
  solutions: {
    title: '解决方案',
    siot: {
      name: 'SIOT',
      desc: '无需布线施工的无线物联网综合控制。照明、窗帘、空调，一个仪表盘统一掌控。',
    },
    bizmoa: {
      name: 'BizMoa',
      desc: '从在图纸上布置设备到报价、合同、交付，面向物联网施工企业的一站式 SaaS。',
    },
    morak: {
      name: 'Morak',
      desc: '以数字名片相连的届别制聚会（研究生同学会·校友会）社区平台。',
    },
  },
  visit: {
    title: '来访路线',
    address: '地址',
    addressLines: [
      '#501, Woolim Lions Valley 3',
      '24 Dunchon-daero 388beon-gil, Jungwon-gu, Seongnam-si, Gyeonggi-do, Republic of Korea',
    ],
    tel: '电话',
    email: '邮箱',
    ceo: '代表',
    mapTitle: 'GSLT 位置地图',
  },
  cta: {
    title: '我们的空间也能变得智能吗？',
    body: '通过免费咨询，为您说明建设范围与预估费用。',
    button: '申请免费咨询',
  },
};
