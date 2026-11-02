import type { ko } from './ko';

export const en: typeof ko = {
  meta: {
    title: 'About us',
    description:
      'GSLT is a wireless IoT integration company founded in 2023. Meet our CEO, see our history and awards, and learn our five-step installation process.',
  },
  award: {
    imageAlt:
      'Forbes Korea Awards winner image: a trophy, the Forbes Korea logo, the 2026 Best Brand Grand Prize emblem, and the name of the winning company, GSLT Co., Ltd.',
    title: 'Forbes Korea 2026 Consumers’ Choice Best Brand Grand Prize',
    category: 'Category: Wireless IoT-Based Smart Spaces',
    body: 'Selected by Forbes Korea on 2026-02-27 and reported by Korea Economic TV on 2026-04-21. The award recognized our ability to integrate wireless IoT that turns existing spaces into smart spaces without rewiring.',
    press: 'Read the press coverage',
    photoAlt:
      'The Forbes Korea 2026 Consumers’ Choice Best Brand Grand Prize ceremony. CEO Kwangsu Choi stands on stage holding a certificate and a plaque bearing the GSLT name. The screen behind him shows “2026 Consumers’ Choice Best Brand Grand Prize — Korea Best Brand Awards,” the date and time Friday, February 27, 2026, 10:20 a.m., and the logos of JoongAng Ilbo, the Ministry of Science and ICT, the Ministry of Trade, Industry and Energy, and Forbes Korea.',
    photoCaption: 'At the award ceremony · CEO Kwangsu Choi · 2026-02-27',
  },
  hero: {
    title: ['Integration specialists', 'who build spaces with IoT'],
    lead: 'GSLT turns offices, homes and buildings into smart spaces with wireless IoT — no rewiring required. From the first consultation to maintenance, we take responsibility for the entire build.',
  },
  facts: {
    founded: { label: 'Founded', value: '2023' },
    solutions: { label: 'In-house solutions', value: '3' },
    stability: { label: 'IoT control reliability', value: '99.9%' },
  },
  process: {
    title: 'How an IoT project runs',
    lead: 'Because it’s wireless IoT, there’s no major construction. Your space stays as it is — five steps make it a smart space.',
    steps: [
      {
        no: '01',
        title: 'Consult & analyze',
        desc: 'We learn how the space is used and how much you want to control, then propose the best setup.',
      },
      { no: '02', title: 'Survey the site', desc: 'We visit the site to check the layout and the existing building systems.' },
      {
        no: '03',
        title: 'Design & quote',
        desc: 'We place devices on the floor plan and calculate the quote. BizMoa produces the quote instantly.',
      },
      { no: '04', title: 'Install', desc: 'We install wireless devices without rewiring and set up integrated control.' },
      {
        no: '05',
        title: 'Inspect & maintain',
        desc: 'After an on-site inspection we hand the system over, then keep managing it with second-by-second monitoring.',
      },
    ],
  },
  videos: {
    title: 'GSLT on video',
    categories: { intro: 'About GSLT', site: 'On site', demo: 'Product demo', press: 'Press & events' },
    date: '{y}-{m}-{d}',
    frameTitle: '{title} (YouTube video)',
    play: 'Play video: {title}',
    playing: 'Now playing: {title}',
    source: 'Source: {channel}',
    watch: 'Watch on YouTube',
    list: 'Video list',
  },
  history: {
    title: 'Achievements & history',
    venture: {
      imageAlt:
        'Venture Business Certificate. Company: GSLT Co., Ltd.; certification type: Innovation Growth; valid from September 9, 2026 to September 8, 2029; certificate No. 20260909030005; with the official seal of the head of the venture business certification agency.',
      enlarge: 'View the full-size certificate',
      title: 'Venture Business Certification',
      sub: 'Innovation Growth type · 2026',
      body: 'Certified under Article 25 of the Act on Special Measures for the Promotion of Venture Businesses. The Innovation Growth type is granted after evaluating how innovative a company’s technology is and how much growth potential its business has.',
      rows: [
        { label: 'Certified by', value: 'Venture Business Certification Agency · Korea Venture Business Association' },
        { label: 'Issue no.', value: 'No. 20260909030005' },
        { label: 'Validity', value: '2026.09.09 ~ 2029.09.08' },
      ],
    },
    grants: [
      {
        title: 'Selected for a Didimdol R&D national project',
        by: 'Ministry of SMEs and Startups · 2026',
        desc: 'Startup Growth Technology Development Program — advancing wireless IoT smart-space technology',
        alt: 'A national R&D program agreement. Project details and agreement terms are laid out in tables, with signature fields at the bottom.',
      },
      {
        title: 'Early-Stage Startup Package: selected & graduated',
        by: 'Ministry of SMEs and Startups · 2025',
        desc: 'Completed a support program for technology advancement and commercialization',
        alt: 'Early-Stage Startup Package completion certificate describing the work carried out, with the official seal of the President of the Korea Institute of Startup & Entrepreneurship Development at the bottom.',
      },
    ],
    timeline: [
      {
        year: '2023',
        title: 'GSLT founded',
        desc: 'Started as a smart-space solutions company and began developing SIOT',
      },
      {
        year: '2025',
        title: 'Selected for the Early-Stage Startup Package',
        desc: 'Completed the Ministry of SMEs and Startups program and graduated',
      },
      {
        year: '2026',
        title: 'Forbes Grand Prize · Didimdol R&D · Venture certification',
        desc: 'After winning the Grand Prize and being selected for a national R&D project, we received Venture Business Certification (Innovation Growth type) in September',
      },
    ],
  },
  solutions: {
    title: 'Solutions',
    siot: {
      name: 'SIOT',
      desc: 'Integrated wireless IoT control with no rewiring. Lighting, blinds and HVAC from a single dashboard.',
    },
    bizmoa: {
      name: 'BizMoa',
      desc: 'From placing devices on floor plans to quotes, contracts and delivery — all-in-one SaaS for IoT installers.',
    },
    morak: {
      name: 'Morak',
      desc: 'A community platform for cohort-based groups (graduate-school and alumni associations), connected through digital business cards.',
    },
  },
  visit: {
    title: 'Visit us',
    address: 'Address',
    addressLines: [
      '#501, Woolim Lions Valley 3',
      '24 Dunchon-daero 388beon-gil, Jungwon-gu, Seongnam-si, Gyeonggi-do, Republic of Korea',
    ],
    tel: 'Phone',
    email: 'Email',
    ceo: 'CEO',
    mapTitle: 'Map to GSLT',
  },
  cta: {
    title: 'Could your space be smart too?',
    body: 'Book a free consultation and we’ll tell you the scope of work and the expected cost.',
    button: 'Free consultation',
  },
};
