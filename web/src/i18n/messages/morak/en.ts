import type { ko } from './ko';

export const en: typeof ko = {
  meta: {
    title: 'Morak — App for Cohort-Based Groups',
    description:
      'A mobile community app for alumni and cohort associations. QR business card exchange, cohort and role management, events and attendance — all in one place.',
  },
  ld: {
    name: 'Morak',
    description:
      'A mobile community platform for cohort-based groups such as alumni associations. Offers QR exchange of digital business cards, cohort and role management, event and attendance management, and a member directory.',
  },
  hero: {
    iconAlt: 'Morak',
    eyebrow: 'Morak · Community Platform',
    title: 'Your cohort group,',
    accent: 'all in one place.',
    lead: 'Alumni and cohort associations used to run on scattered group chats, Excel rosters and paper business cards. With digital business cards and cohort management, Morak brings all of your group’s operations together.',
    start: 'Get started with Morak',
    contact: 'Contact us',
    platforms: 'Web · installable app (PWA) · Google Play — core features are free',
    logoAlt: 'Morak logo',
  },
  featureImageAlt: 'Morak — meet through business cards, stay connected through your cohort',
  features: {
    title: 'Everything you need to run a group',
    lead: 'From exchanging cards to managing the directory — features for organizers and members alike.',
    items: [
      {
        tag: 'CARD · QR',
        title: 'Digital business cards',
        desc: 'Create several cards, choose the right one for each group, and swap them instantly by QR. Photograph paper cards to save them as contacts.',
      },
      {
        tag: 'COHORT',
        title: 'Cohorts · roles',
        desc: '“Cohort 12, Secretary,” “Cohort 7, Member” — cohort and role appear right on the card, so you know how you’re connected even at a first meeting.',
      },
      {
        tag: 'EVENT',
        title: 'Events · attendance',
        desc: 'Group events with RSVPs, waitlists and reminder push notifications. Your groups’ events and members’ birthdays, together in one calendar.',
      },
      {
        tag: 'FEED · POLL',
        title: 'Boards · polls',
        desc: 'Announcements, open posts and news of members’ life events, plus polls you can join right from the feed. Important posts arrive as push notifications.',
      },
      {
        tag: 'CHAT',
        title: 'Chat',
        desc: 'One-on-one conversations and group rooms. Creating a group automatically opens a group chat.',
      },
      {
        tag: 'DIRECTORY',
        title: 'Member directory',
        desc: 'Keep each cohort’s member directory always up to date. Paste in an Excel list and the directory is built instantly.',
      },
    ],
  },
  screens: [
    {
      title: 'Open the app and see your week first',
      desc: 'Weekly highlights and a combined calendar sit on the first screen. Events from all your groups and members’ birthdays come together on one calendar, so you can see right away what needs your attention.',
      alt: 'Morak home dashboard showing weekly highlights and a combined calendar that merges events from several groups.',
    },
    {
      title: 'All your groups, organized at a glance',
      desc: 'The groups you’ve joined stack up as cards with their cover photos. Check your owner or officer role, cohort badge and upcoming event dates right on the card, and discover new groups by interest or region.',
      alt: 'Morak group list showing joined groups stacked as cards with cover photos and cohort badges.',
    },
    {
      title: 'Every group gets its own space',
      desc: 'A dedicated space with member, event, search and admin menus, plus boards for announcements, open posts and self-introductions. Member count, cohorts, founding year and activity rate are all visible on the group’s first screen.',
      alt: 'Morak group space with member count and founding-year statistics at the top and board menus below.',
    },
    {
      title: 'Member management that turns cards into connections',
      desc: 'Search and manage the cards and contacts you’ve received through your groups, all in one place. Save phone numbers, emails and addresses, and export them straight to your phone’s contacts when needed.',
      alt: 'Morak member management screen with received business cards listed and a search bar at the top.',
    },
    {
      title: 'Chat that shows cohorts',
      desc: 'Cohort and role badges such as “Cohort 12 · President” appear next to each person’s name, so you always know who you’re talking to. Supports both one-on-one chats and group rooms.',
      alt: 'Morak chat screen with cohort and role badges shown next to each participant’s name.',
    },
  ],
  preview: {
    title: 'Screen preview',
    hint: 'Scroll sideways to see more',
    shotAlts: [
      'Morak home — an online hangout for your cohort',
      'My groups — gather around interests, connect through cohorts',
      'Group space — members, events and boards, all in one',
      'Member management — networking that starts with a single card',
      'Chat — meetings become conversations, conversations become connections',
    ],
  },
  privacy: {
    title: 'Personal data stays with members',
    body: 'Real names, contact details, business cards and directories are visible only to signed-in members of the group. They are not shown to non-members.',
    link: 'Privacy Policy',
  },
  cta: {
    title: 'Ready to move your group to Morak?',
    lead: 'You can create a group for free right now. To onboard your member list, contact us and we’ll help.',
  },
};
