import type { ko } from './ko';

export const en: typeof ko = {
  hero: {
    gateAria: 'Preparing the page',
    gateLabel: 'Thank you for visiting GSLT',
    title: {
      setup: 'From custom space design to device deployment,',
      lines: [
        { pre: 'spatial intelligence', accent: '', post: '' },
        { pre: '', accent: 'tailored', post: ' to you.' },
      ],
    },
    desc: 'GSLT is an IoT integration specialist that turns any space — office, home or building — into a smart space, without rewiring.',
    scroll: 'Scroll',
  },
  body: {
    eyebrow: 'What we build',
    title: ['Different spaces,', 'different ways to build'],
    intro:
      'GSLT turns existing spaces into smart spaces without rewiring. Offices, homes and buildings differ in floor layout and equipment, so we never build them all the same way.',
    fields: [
      {
        href: '/solutions/smart-office',
        title: 'Custom smart office',
        desc: 'Every office has its own floor layout and way of working. A smart office build starts not from a standard package, but from measuring the space on site.',
      },
      {
        href: '/solutions/smart-home',
        title: 'Smart home',
        desc: 'Existing houses and apartments can be upgraded without major construction. A cloud wall pad and lobby phone bring lighting, heating and cooling, and security together.',
      },
      {
        href: '/solutions/smart-building',
        title: 'Custom smart building',
        desc: 'Access control, energy management and safety systems come together on one platform. No new build needed — it layers onto your existing building as is.',
      },
      {
        href: '/solutions/unmanned-automation',
        title: 'Unstaffed automation',
        desc: 'Bookings, access and power are linked as one. Even with no staff on site, the space opens and closes itself on the booked schedule.',
      },
      {
        href: '/solutions/ai-building-bms',
        title: 'AI building · BMS',
        desc: 'Equipment data is gathered to predict anomalies. AI building control doesn’t stop at an alarm — it carries through to response procedures and work orders.',
      },
      {
        href: '/solutions/ai-office',
        title: 'AI office',
        desc: 'Lighting and HVAC adjust automatically based on occupancy and usage patterns. No power is spent on empty zones.',
      },
    ],
    more: 'Learn more',
    siot: {
      logoAlt: 'SIOT',
      title: 'All six fields, run from a single SIOT screen',
      body: '{lead} It layers onto the space you use today, without rewiring.',
      cta: 'Visit the SIOT website',
    },
  },
};
