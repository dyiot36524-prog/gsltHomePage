import type { ko } from './ko';

export const en: typeof ko = {
  meta: {
    title: 'Contact us',
    description:
      'Tell us about your space and we’ll propose a setup and quote that fit your site. Consultation and an initial overview before the on-site survey are free.',
  },
  title: 'Contact us',
  lead: 'Choose whichever way suits you. Ask us right away on KakaoTalk, or leave an inquiry by email and we’ll get back to you within 24 hours. We’ll propose a setup and quote that fit your site, free of charge.',
  kakao: {
    heading: 'Ask us on KakaoTalk',
    body: 'Ask us anything, right now. Our team replies in a KakaoTalk chat.',
    button: 'Chat with us on KakaoTalk',
    note: '{name}’s KakaoTalk channel · Opens in a new window. On a computer, you sign in to Kakao and the chat continues in KakaoTalk.',
    phone: 'Prefer to call? ',
  },
  email: {
    heading: 'Send an inquiry by email',
    before:
      'Submit the form below and it goes straight to our team; we’ll reply to the email address or phone number you provide. If you prefer your own mail app, you can also write to ',
    after: '.',
  },
  more: {
    heading: 'Visit us · What happens next',
    address: 'Address',
    steps: 'Next steps',
  },
  steps: ['Consultation & requirements', 'On-site survey', 'Design & quote', 'Installation', 'Inspection & maintenance'],

  form: {
    honeypot: 'Leave this field empty',
    required: ' indicates a required field.',
    name: 'Name',
    namePlaceholder: 'Jane Smith',
    company: 'Company',
    companyPlaceholder: 'Example Co., Ltd.',
    email: 'Email',
    emailPlaceholder: 'example@company.com',
    phone: 'Phone',
    phonePlaceholder: '+1 000-000-0000',
    message: 'Message',
    messagePlaceholder: 'Tell us which solution you’re considering, or anything you’d like to know.',
    consent: 'I agree to the collection and use of my personal information.',
    privacy: 'View privacy policy',
    sending: 'Sending…',
    submit: 'Request a consultation',
    note: 'The information you enter is used only to respond to your inquiry.',
    failed: 'We couldn’t send your request.',
    network: 'Your connection dropped, so the request couldn’t be sent.',
    fallback: {
      before: 'Please contact us directly by phone at ',
      between: ' or by email at ',
      after: '.',
    },
    demo: {
      title: 'Showroom demo request',
      notice: ' — {scene}. Let us know your preferred date and time, and our team will contact you to schedule it.',
      message:
        '{mark} {scene}\nI’d like to see this scene at your Seongnam showroom.\nPreferred date and time: \nNumber of visitors: \nOur space (floors, rooms, etc.): ',
    },
  },

  api: {
    nameRequired: 'Please enter your name.',
    nameTooLong: 'Please keep your name within {n} characters.',
    companyTooLong: 'Please keep the company name within {n} characters.',
    emailRequired: 'Please enter your email address.',
    emailTooLong: 'Please keep your email address within {n} characters.',
    emailInvalid: 'Please check the format of your email address.',
    phoneTooLong: 'Please keep your phone number within {n} characters.',
    messageRequired: 'Please enter your message.',
    messageTooLong: 'Please keep your message within {n} characters.',
    rateLimited: 'Please try again in a moment. If it’s urgent, call us at {tel}.',
    unreadable: 'We couldn’t read your request. Please try again.',
    malformed: 'The request format is invalid.',
    failed: 'We couldn’t send your request. Please contact us directly at {tel} or {email}.',
  },

  done: {
    meta: { title: 'Request received' },
    eyebrow: 'Received',
    title: ['Request', 'received'],
    lead: 'Your details have gone straight to our team. Now it’s our turn.',
    next: {
      heading: 'What happens next',
      items: [
        { when: 'Within 24 hours', what: 'Our team will contact you using the details you provided.' },
        {
          when: 'Consultation & requirements',
          what: 'We learn how the space is used and what you want to control, then propose a setup.',
        },
        {
          when: 'On-site survey',
          what: 'We visit to check the layout of the space and its building systems. The quote is finalized after this step.',
        },
      ],
    },
    urgent: { before: 'If it’s urgent, you can call us right now at ', after: '.' },
    home: 'Back to home',
    about: 'See how we build',
    more: 'While you wait',
  },
};
