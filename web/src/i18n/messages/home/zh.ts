import type { ko } from './ko';

export const zh: typeof ko = {
  hero: {
    gateAria: '正在准备页面',
    gateLabel: '感谢您访问 GSLT',
    title: {
      setup: '从定制空间设计到设备部署，',
      lines: [
        { pre: '为您', accent: '量身打造', post: '的' },
        { pre: '空间智能解决方案。', accent: '', post: '' },
      ],
    },
    desc: 'GSLT 是一家专业的 IoT 建设企业，无需布线施工，即可将办公室、住宅、楼宇等一切空间打造为智能空间。',
    scroll: '向下滚动',
  },
  body: {
    eyebrow: '建设领域',
    title: ['空间类型各不相同，', '建设方式也各有不同'],
    intro:
      'GSLT 无需布线施工，即可将现有空间改造为智能空间。办公室、住宅和楼宇的楼层结构与设备各不相同，因此我们不会用同一种方式来建设。',
    fields: [
      {
        href: '/solutions/smart-office',
        title: '定制智能办公',
        desc: '每间办公室的楼层结构和工作方式都不尽相同。智能办公建设不是从标准套餐开始，而是从实地测量这个空间开始。',
      },
      {
        href: '/solutions/smart-home',
        title: '智能家居',
        desc: '已建成的住宅和公寓，同样无需大规模施工即可升级。借助云端室内控制面板（Wall Pad）与大堂对讲机，将照明、冷暖空调和安防整合为一体。',
      },
      {
        href: '/solutions/smart-building',
        title: '定制智能楼宇',
        desc: '将门禁管理、能源管理与安全设施整合到一个平台。无需新建，直接部署在现有楼宇之上。',
      },
      {
        href: '/solutions/unmanned-automation',
        title: '无人值守自动化',
        desc: '将预约、门禁与电源联为一体。即使无人常驻管理，空间也会按预约时间自动开启和关闭。',
      },
      {
        href: '/solutions/ai-building-bms',
        title: 'AI 楼宇 · BMS',
        desc: '汇集设备数据，预测异常征兆。AI 楼宇管控不止于报警，还会延伸到处置流程和工单派发。',
      },
      {
        href: '/solutions/ai-office',
        title: 'AI 办公',
        desc: '根据在室状态和使用规律，自动调节照明与空调。无人区域不消耗电力。',
      },
    ],
    more: '了解详情',
    siot: {
      logoAlt: 'SIOT',
      title: '六大领域，统一在 SIOT 一个界面上运营',
      body: '{lead}无需布线施工，直接部署在您现有的空间之上。',
      cta: '前往 SIOT 官网',
    },
  },
};
