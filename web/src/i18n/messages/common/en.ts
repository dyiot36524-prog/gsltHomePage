import type { ko } from './ko';

export const en: typeof ko = {
  site: {
    name: 'GSLT',
    titleTemplate: '%s | GSLT',
    description:
      'GSLT is a wireless IoT integration company. We turn offices, homes and buildings into smart spaces without rewiring, and handle installation and maintenance ourselves.',
  },
  nav: {
    home: 'Home',
    about: 'About',
    faq: 'FAQ',
    news: 'News',
    downloads: 'Resources',
    portfolio: 'Portfolio',
    solutions: 'Solutions',
    contact: 'Contact us',
  },
  header: {
    homeAria: '{name} home',
    newWindow: '(opens in a new window)',
    language: 'Language',
  },
  solutions: {
    featured: 'Flagship solution',
    siotSite: 'SIOT website',
    scenes: 'Use cases',
    siot: {
      name: 'SIOT',
      desc: 'Building control · Space booking · Automation',
      lead: 'Booking and access, lighting and HVAC, energy and records — all on one platform.',
      pillars: ['Integrated control', 'Space booking', 'Access integration', 'Automation', 'Energy'],
    },
    bizmoa: {
      name: 'BizMoa',
      desc: 'SaaS that automates IoT installation quotes',
      lead: 'Place devices on a floor plan and the quote, contract and delivery confirmation are generated automatically.',
    },
    morak: {
      name: 'Morak',
      desc: 'Community for cohort-based groups',
      lead: 'A community platform for alumni and cohort associations, connected through digital business cards.',
    },
  },
  scenes: {
    'meeting-room': 'Meeting room booking & control',
    lounge: 'Lounge booking & occupancy board',
    restroom: 'Restroom occupancy display',
  },
  footer: {
    intro: [
      'A wireless IoT integration company.',
      'We turn offices, homes and buildings into smart spaces — without rewiring.',
    ],
    colSolutions: 'Solutions',
    colNews: 'Updates',
    colLegal: 'Legal',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    support: 'Customer Support',
    company: 'Company',
    ceo: 'CEO',
    bizNo: 'Business Registration No.',
    address: 'Address',
    tel: 'Tel',
    email: 'Email',
    kakao: 'KakaoTalk Channel',
    family: 'Family site',
  },
  company: {
    name: 'GSLT',
    legalName: 'GSLT Co., Ltd.',
    ceo: 'Kwangsu Choi',
    address:
      '#501, Woolim Lions Valley 3, 24 Dunchon-daero 388beon-gil, Jungwon-gu, Seongnam-si, Gyeonggi-do, Republic of Korea',
    tel: '+82-70-4659-4804',
  },
  furniture: { name: 'GSLT Furniture', desc: 'lockers & furniture · Korean site' },
  list: {
    total: '{n} total',
    filter: 'Filter list',
  },
  scrollTop: 'Back to top',
  notFound: {
    title: 'Page not found',
    body: 'The page may have moved or been removed.',
    home: 'Back to home',
    contact: 'Looking for something? Contact us',
  },
  error: {
    title: 'We couldn’t load this page',
    body: 'This is a temporary problem. Please try again in a moment.',
    retry: 'Try again',
    home: 'Home',
    contact: 'Contact us',
  },
};
