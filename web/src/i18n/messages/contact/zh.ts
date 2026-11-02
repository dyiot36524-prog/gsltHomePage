import type { ko } from './ko';

export const zh: typeof ko = {
  meta: {
    title: '咨询合作',
    description: '告诉我们您的空间条件，我们将提出适合现场的配置方案和报价。现场测量前的咨询和初步说明均免费。',
  },
  title: '咨询合作',
  lead: '请选择您方便的方式。可通过 KakaoTalk 直接咨询，也可以通过邮件留言，我们将在 24 小时内与您联系。我们会根据现场条件免费为您提出配置方案和报价。',
  kakao: {
    heading: '通过 KakaoTalk 直接咨询',
    body: '有任何疑问，现在就可以提问。负责人会在 KakaoTalk 聊天中回复您。',
    button: '通过 KakaoTalk 咨询',
    note: '{name} 的 KakaoTalk 频道 · 将在新窗口中打开。在电脑上需先登录 Kakao 账号，之后在 KakaoTalk 中继续对话。',
    phone: '如需电话联系，请拨打 ',
  },
  email: {
    heading: '通过邮件留言咨询',
    before:
      '提交下方表单后，内容会直接送达负责人，我们将通过您留下的邮箱或电话回复。如果您习惯使用邮件客户端，也可以直接发送至 ',
    after: '。',
  },
  more: {
    heading: '公司地址 · 合作流程',
    address: '地址',
    steps: '后续流程',
  },
  steps: ['咨询与需求分析', '现场测量', '设计与报价', '施工与安装', '验收与运维'],

  form: {
    honeypot: '请勿填写此栏',
    required: ' 为必填项。',
    name: '姓名',
    namePlaceholder: '张伟',
    company: '公司名称',
    companyPlaceholder: '示例科技有限公司',
    email: '电子邮箱',
    emailPlaceholder: 'example@company.com',
    phone: '联系电话',
    phonePlaceholder: '+86 000 0000 0000',
    message: '咨询内容',
    messagePlaceholder: '请随意填写您正在考虑的解决方案或想了解的问题。',
    consent: '我同意收集和使用个人信息。',
    privacy: '查看隐私政策',
    sending: '正在发送…',
    submit: '提交咨询申请',
    note: '您填写的信息仅用于咨询目的。',
    failed: '发送失败。',
    network: '网络连接中断，未能发送。',
    fallback: {
      before: '请直接拨打电话 ',
      between: ' 或发送邮件至 ',
      after: ' 与我们联系。',
    },
    demo: {
      title: '展厅演示申请',
      notice: ' — {scene}。请填写您希望的日期和时间，负责人会安排日程并与您联系。',
      message: '{mark} {scene}\n希望在城南展厅观看此场景的演示。\n希望日期与时间：\n来访人数：\n我们的空间（楼层、房间数等）：',
    },
  },

  api: {
    nameRequired: '请输入姓名。',
    nameTooLong: '姓名请控制在 {n} 个字符以内。',
    companyTooLong: '公司名称请控制在 {n} 个字符以内。',
    emailRequired: '请输入电子邮箱。',
    emailTooLong: '电子邮箱请控制在 {n} 个字符以内。',
    emailInvalid: '请检查电子邮箱格式。',
    phoneTooLong: '联系电话请控制在 {n} 个字符以内。',
    messageRequired: '请输入咨询内容。',
    messageTooLong: '咨询内容请控制在 {n} 个字符以内。',
    rateLimited: '请稍后再试。如有急事，请致电 {tel}。',
    unreadable: '无法读取请求，请重试。',
    malformed: '请求格式不正确。',
    failed: '发送失败。请直接通过 {tel} 或 {email} 与我们联系。',
  },

  done: {
    meta: { title: '咨询申请已提交' },
    eyebrow: '已受理',
    title: ['您的咨询申请', '已成功提交'],
    lead: '您填写的内容已直接转交给负责人。接下来就交给我们。',
    next: {
      heading: '后续流程',
      items: [
        { when: '24 小时内', what: '负责人将通过您留下的联系方式与您联系。' },
        { when: '咨询 · 需求分析', what: '了解空间用途和您希望的控制范围，并提出配置方案。' },
        { when: '现场测量', what: '上门确认空间结构和设备环境。报价将在此之后确定。' },
      ],
    },
    urgent: { before: '如有急事，也可以现在直接致电 ', after: '。' },
    home: '返回首页',
    about: '了解实施流程',
    more: '等待期间',
  },
};
