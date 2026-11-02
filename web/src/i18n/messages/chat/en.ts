import type { ko } from './ko';

export const en: typeof ko = {
  ui: {
    suggestions: [
      'Can you do a 3rd-floor office without rewiring?',
      'Have you done projects of a similar size?',
      'Can we start with consulting only?',
    ],
    intent:
      '\\b(?:quote|cost|price|pricing|how much|budget|schedule|timeline|how long|visit|on-?site|site survey|measure|install|adopt|contract|consultation|meeting|contact|call)',
    heading: 'Ask our AI',
    chatting: 'AI consultation',
    close: 'Close chat',
    thinking: 'Thinking through a solution for you…',
    ungrounded: 'Company information hasn’t been added yet, so answers are limited.',
    connError: 'We’re having trouble connecting. Please call us at {tel}.',
    submitError: 'We couldn’t submit your request. Please call us at {tel}.',
    handoff: {
      lead: 'Site conditions are best assessed by our team in person.',
      connect: 'Talk to our team',
      kakao: 'Ask on KakaoTalk',
      kakaoNote: 'This conversation isn’t passed on if you ask on KakaoTalk · Opens in a new window',
    },
    form: {
      honeypot: 'Leave this field empty',
      name: 'Name',
      company: 'Company',
      email: 'Email',
      phone: 'Phone',
      message: 'Your inquiry',
      summarizing: 'Summarizing the conversation…',
      summarized: 'Summarized from the chat. Feel free to edit.',
      placeholder: 'Tell us about the space and what you’d like to do.',
      withLog: 'Include this conversation',
      privacy: 'I agree to the collection and use of my personal information.',
      privacyLink: 'View privacy policy',
      sending: 'Sending…',
      submit: 'Send inquiry',
    },
    sent: 'Received. Our team will be in touch shortly.',
    inputLabel: 'Type your question',
    inputPlaceholder: 'Ask if it works wire-free',
    send: 'Send',
  },
  api: {
    fallback:
      'We can’t answer right now. Call {tel} or leave a message through Contact us, and our team will get back to you directly.',
    busy: 'We’re receiving a lot of requests. Please try again shortly or call {tel}.',
    unreadable: 'We couldn’t read your request. Please try again.',
    invalid: 'The request format is invalid.',
    empty: 'There’s nothing to send.',
    tooLong: 'This conversation has gotten long. Our team can help you faster from here — please leave an inquiry.',
    blank: 'You can’t send an empty message.',
    maxChars: 'You can send up to {n} characters at a time.',
    rateLimited: 'Too many requests right now. Please try again shortly.',
  },
};
