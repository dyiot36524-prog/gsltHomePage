import type { ko } from './ko';

export const en: typeof ko = {
  meta: {
    title: 'BizMoa — Quote Automation',
    description:
      'Place devices on a floor plan and get quotes, contracts and delivery confirmations automatically. B2B SaaS for IoT and electrical installation contractors.',
  },
  ld: {
    name: 'BizMoa',
    description:
      'An all-in-one B2B SaaS for installation contractors: place devices on an architectural floor plan and quotes, contracts and delivery confirmations are generated automatically. Includes automatic labor cost calculation and project and permission management.',
  },
  hero: {
    logoAlt: 'BizMoa',
    eyebrow: 'BizMoa · Quotation Automation',
    title: 'From floor plan to quote,',
    accent: 'in one go.',
    lead: 'The moment you place devices on a floor plan, the quote is ready — and the contract and delivery confirmation follow automatically. An all-in-one SaaS for IoT and smart home installation contractors.',
    contact: 'Contact us',
    home: 'Explore on our home page',
    flow: ['Place', 'Quote', 'Contract', 'Manage', 'Operate'],
  },
  showcase: {
    title: 'A full day of writing quotes',
    accent: 'becomes a few clicks',
    lead: 'Unit prices of the placed devices and labor costs by trade are totaled automatically, then exported straight to Excel or PDF.',
    imageAlt: 'BizMoa dashboard',
  },
  steps: [
    {
      title: 'Drag devices onto the floor plan',
      desc: 'Place IoT devices on architectural floor plans intuitively, as color-coded markers. Even large buildings can be laid out quickly, floor by floor.',
      items: [
        { name: 'Plans for every floor', desc: 'Register a plan for each floor and switch between them as you place devices' },
        { name: 'AI placement suggestions', desc: 'Get optimal positions suggested automatically and cut design time' },
        { name: 'Device category tree', desc: 'Pick devices from a tree organized by item and drop them straight onto the plan' },
      ],
      punch: 'One drag, and it’s placed.',
      shotAlts: ['BizMoa floor plan editor — IoT devices placed as color markers on an architectural floor plan'],
    },
    {
      title: 'Device + labor quotes, generated automatically',
      desc: 'The moment placement is done, a quote combining device unit prices with labor costs by trade is created instantly.',
      items: [
        { name: 'Devices + labor, totaled automatically', desc: 'Unit prices of placed devices and labor costs by trade are added up instantly' },
        { name: 'Separate customer and admin views', desc: 'Keep the two views apart and apply a discount rate per quote' },
        { name: 'Excel · PDF export', desc: 'Send the finished quote to your customer right away' },
      ],
      punch: 'Quotes, ready the moment you place.',
      shotAlts: ['BizMoa quote screen — an itemized quote totaling device unit prices and labor costs'],
    },
    {
      title: 'From contract to delivery, generated in one click',
      desc: 'Once a quote is confirmed, the formal contract and delivery confirmation are drawn up automatically. Even on-site inspection is completed within the system.',
      items: [
        { name: 'Automatic contracts', desc: 'Quote data turns directly into a formal contract' },
        { name: 'Delivery inspection checklist', desc: 'Item-by-item delivery checks close out site management' },
        { name: 'Formal PDF documents', desc: 'Output ready-to-sign documents right away' },
      ],
      punch: 'Contract and delivery paperwork, in one click.',
      shotAlts: [
        'BizMoa contract screen — a formal contract form filled in from quote data',
        'BizMoa delivery confirmation screen — an item-by-item delivery checklist',
      ],
    },
    {
      title: 'Projects at a glance, quote history included',
      desc: 'See the status and amount of every active site, one card each, while every quote revision is kept as a version.',
      items: [
        { name: 'Card-based project dashboard', desc: 'Progress · assigned staff · amount, summarized on a card' },
        { name: 'Quote version history', desc: 'Every revision is saved as a version, so changes can be traced' },
        { name: 'Progress tracking', desc: 'Check each project’s progress as a number' },
      ],
      punch: 'Every project, one screen.',
      shotAlts: [
        'BizMoa project cards — a dashboard summarizing each site’s progress and amount on cards',
        'BizMoa quote history — a chronological list of quote revisions',
      ],
    },
    {
      title: 'From labor costing to access control',
      desc: 'Set up your rate structure and team permissions once, and every project runs on the same standard.',
      items: [
        { name: 'Automatic rates by position', desc: 'Hourly · daily · monthly rates calculated by formula' },
        { name: 'Labor costs flow into quotes', desc: 'Labor costs are included automatically when you build a quote' },
        { name: 'Three-tier access', desc: 'Role-based control for Admin · Manager · Coordinator' },
      ],
      punch: 'Three permission tiers. Data kept safe.',
      shotAlts: [
        'BizMoa labor rate table — hourly, daily and monthly rates set by position',
        'BizMoa user management — permission settings for Admin, Manager and Coordinator',
      ],
    },
  ],
  fit: {
    title: 'Made for companies like these',
    items: [
      'IoT / smart home installers',
      'Security / CCTV installers',
      'Network infrastructure companies',
      'Electrical / telecom contractors',
    ],
  },
  cta: {
    title: 'All you need to start is a floor plan',
    lead: 'Get a free demo and onboarding guidance.',
    button: 'Request a free consultation',
  },
};
