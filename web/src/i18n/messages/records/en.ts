import type { ko } from './ko';

export const en: typeof ko = {
  news: {
    meta: {
      title: 'News',
      description:
        'News and press coverage from GSLT: awards, patent filings and government project selections, in chronological order.',
    },
    title: 'GSLT News',
    lead: 'The record we keep as a company — our own updates alongside press coverage about us.',
    columns: ['Date', 'Type', 'Title'],
    filter: { all: 'All', article: 'Company news', press: 'Press' },
    empty: { title: 'No news yet', body: 'New updates will be posted here first.' },
    noMatch: { title: 'No matching records', body: 'Try selecting a different type.' },
    showAll: 'View all',
    pressNote: 'Press items include a summary of the article and a link to the original.',
  },
  portfolio: {
    meta: {
      title: 'Projects',
      description: 'Spaces GSLT has actually built, recorded with their site conditions and the solutions applied.',
    },
    title: 'Projects',
    lead: 'Which spaces we transformed, and how — without tearing out the wiring. Build records, site by site.',
    columns: ['Date', 'Site'],
    all: 'All',
    empty: {
      title: 'Project records are on the way',
      body: 'We are documenting completed sites and publishing them one by one. If you need a case from a particular kind of site, let us know.',
      action: 'Request a case',
    },
    noMatch: { title: 'No records with this tag', body: 'Try selecting a different tag.' },
    showAll: 'View all',
  },
  downloads: {
    meta: {
      title: 'Resources',
      description:
        'Download the GSLT company profile and solution materials. If you need anything else, just ask us any time.',
    },
    title: 'Resources',
    lead: 'Our company profile and product materials. Click to download right away.',
    total: 'Total files: {n}',
    columns: ['Date', 'Format', 'File'],
    empty: {
      title: 'No resources published yet',
      body: 'If you need any materials, contact us and we will send them right away.',
      action: 'Request materials',
    },
  },
  post: {
    notFound: 'Post not found',
    back: { news: 'GSLT News', portfolio: 'Portfolio', downloads: 'Resources' },
    kind: { article: 'Company news', press: 'Press', portfolio: 'Project', downloads: 'Resource' },
    category: { news: 'News', portfolio: 'Portfolio', downloads: 'Resources' },
    categoryFallback: 'News',
    describe: '{title} — {site} {category}',
    imageAlt: 'Featured image: {title}',
    views: 'Views: {n}',
    pressSummary: 'Summary written by GSLT.',
    source: { outlet: 'Outlet', reporter: 'Reporter', mirrors: 'Also on' },
    reporterValue: '{name}',
    byline: 'By {name}',
    original: 'Read the original',
    originalAt: 'Read the original on {outlet}',
    pressRights: 'The full article and its photos belong to the publishing outlet.',
    nav: 'More records',
    prev: 'Previous',
    next: 'Next',
    cta: {
      title: 'How would this work in your space?',
      body: 'We will propose a setup suited to your site conditions, free of charge.',
      action: 'Contact us',
    },
  },
  translation: {
    ai: 'Translated from Korean by AI',
    original: 'Shown in the original Korean',
  },
};
