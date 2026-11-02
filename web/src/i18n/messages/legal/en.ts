import type { ko } from './ko';

export const en: typeof ko = {
  notice: {
    text: 'This English version is a translation provided for reference only. If there is any discrepancy between this translation and the Korean original, the Korean version prevails.',
    link: 'Read the Korean original',
  },
  privacy: {
    meta: {
      title: 'Privacy Policy',
      description:
        'GSLT’s privacy policy: what personal information we collect and why, how long we keep it, outsourced processing, overseas transfers, and your rights.',
      ogDescription: 'How GSLT collects, uses and retains personal information.',
    },
    lead: 'GSLT Co., Ltd. (the "Company") complies with Korea’s Personal Information Protection Act and other applicable laws, and processes users’ personal information securely.',
    updated: 'Last updated: October 19, 2026',
    collect: {
      title: '1. Personal Information We Collect',
      items: [
        'When you request a consultation (the Contact us form, or “Talk to our team” in the AI consultation): name, email address and inquiry details (required); company name and phone number (optional). If you select “Include this conversation” in the AI consultation, we also receive that conversation.',
        'When you use the AI consultation: the conversation you enter. It is processed only while a response is being generated, and only conversations you choose to send with a consultation request are retained.',
        'When you contact us through our KakaoTalk Channel: your KakaoTalk profile name and profile photo (depending on your settings), the conversation, and any name, contact details or company name you share during the conversation',
        'Information generated and collected automatically: IP address (used briefly to prevent abuse and not stored), visit statistics (pages visited, referral source, device and browser type, country/region — collected without cookies), and initial referral source (cleared when you close the browser tab)',
      ],
    },
    purpose: {
      title: '2. Purposes and Legal Bases for Collection and Use',
      items: [
        'Consultation requests: receiving requests, connecting you with a specialist, and responding. The legal basis is the data subject’s consent (Article 15(1)(1) of the Personal Information Protection Act), which we obtain through the form.',
        'AI consultation: answering your questions and generating a summary for the consultation request. The legal basis is taking measures at the user’s request (Article 15(1)(4) of the same Act).',
        'KakaoTalk Channel inquiries: processed to respond to a consultation the user initiated, without a separate consent procedure (Article 15(1)(4) of the same Act).',
        'Visit statistics: improving our services. Used only as statistics that cannot identify individuals.',
      ],
    },
    retention: {
      title: '3. Retention and Use Period',
      intro:
        'In principle, personal information is destroyed without delay once the purpose of its collection and use has been achieved. However, where applicable laws require it to be preserved, it is kept for the period so required.',
      items: [
        'Consultation records: 1 year after the consultation is completed',
        'AI consultation records (those sent with a consultation request): 1 year from the date of storage',
        'KakaoTalk Channel consultation records: 1 year after the consultation is completed, we leave the chat room on the Company’s side and delete our notes and any transcribed copies.',
        'KakaoTalk conversation records: kept on Kakao’s servers for 3 years under Kakao Corp.’s policy.',
        'Access logs: the Company does not store them separately. Server logs kept by our hosting provider (Vercel) are deleted after a short period under that provider’s policy.',
      ],
    },
    destruction: {
      title: '4. Destruction of Personal Information',
      body: 'When the retention period expires or the purpose of processing has been achieved, personal information is destroyed without delay. Electronic files are deleted using methods that make recovery impossible. Where other laws require information to be retained, only that information is stored and kept separately.',
    },
    thirdParty: {
      title: '5. Provision of Personal Information to Third Parties',
      body: 'The Company does not provide users’ personal information to outside parties without their consent, except as provided by law.',
    },
    outsourcing: {
      title: '6. Outsourcing of Personal Information Processing',
      intro:
        'To handle consultations and operate its services smoothly, the Company outsources personal information processing as follows.',
      colProcessor: 'Entrusted party',
      colTask: 'Outsourced tasks',
      tasks: [
        'Website hosting, server operation for inquiries and the AI consultation, visit statistics',
        'Storage of inquiry and consultation records (Google Firebase, Seoul region), receipt of business email (Gmail)',
        'Generating AI consultation responses',
        'Sending inquiry notification emails',
      ],
      outro:
        'Our outsourcing contracts set out what is necessary to ensure personal information is processed securely, and we supervise whether entrusted parties comply. If an entrusted party changes, we will give notice through this policy.',
    },
    transfer: {
      title: '7. Overseas Transfer of Personal Information',
      intro:
        'To receive and respond to consultation requests, the Company outsources the processing of personal information overseas as set out below. This constitutes outsourcing of processing necessary to conclude and perform a contract with the data subject, disclosed in this policy (Article 28-8(1)(3)(a) of the Personal Information Protection Act).',
      heading: '{to} ({country})',
      labels: {
        contact: 'Contact: ',
        when: 'When and how transferred: ',
        items: 'Items transferred: ',
        purpose: 'Purpose of use: ',
        keep: 'Retention and use period: ',
      },
      recipients: [
        {
          country: 'United States',
          when: 'Sent over the network when you visit the website, submit an inquiry or use the AI consultation',
          items: 'IP address and device information, inquiry details, AI consultation conversations',
          purpose: 'Website hosting and server processing, visit statistics',
          keep: 'Deleted immediately after processing (server logs are kept for a short period under Vercel’s policy)',
        },
        {
          country: 'United States',
          when: 'Sent by email when an inquiry is submitted',
          items: 'Name, company name, email address, phone number, inquiry details',
          purpose: 'Notifying staff of new inquiries and replying',
          keep: 'The consultation record retention period in Section 3',
        },
        {
          country: 'United States',
          when: 'Sent over the network when you use the AI consultation',
          items: 'Conversations entered in the AI consultation',
          purpose: 'Generating AI consultation responses and consultation request summaries',
          keep: 'Deleted within 30 days (Anthropic’s policy; up to 2 years if a usage policy violation is suspected)',
        },
        {
          country: 'United States',
          when: 'Sent over the network when an inquiry is submitted',
          items: 'Name, company name, email address, phone number, inquiry details, referral source',
          purpose: 'Sending inquiry notification emails',
          keep: 'Sending logs kept for 30 days',
        },
      ],
      optOut:
        'If you do not want your information transferred overseas, you can contact us by phone ({tel}) or through our KakaoTalk Channel (based in Korea) instead of the inquiry form or the AI consultation. The inquiry form and the AI consultation cannot be used without the transfers described above. To have information that has already been transferred deleted, please contact the Chief Privacy Officer below and we will process your request.',
    },
    ai: {
      title: '8. About the AI Consultation',
      items: [
        'The AI consultation at the top of the home page generates answers with Anthropic’s AI (Claude), based on materials registered by the Company. AI answers may be wrong, so please confirm important matters with our staff.',
        'Conversations you enter are sent to Anthropic (United States) to generate answers. Anthropic does not use customer inputs to train its AI (Anthropic Commercial Terms).',
        'Conversations are retained only if you choose to send them with a consultation request; in that case, phone numbers and email addresses are masked.',
        'Please do not enter sensitive information such as resident registration numbers or health information.',
      ],
      report: 'Please report inappropriate answers to {email}.',
    },
    external: {
      title: '9. External Services (Video, Maps, KakaoTalk Channel, Fonts, Images)',
      youtube:
        'Our About page includes YouTube videos and Google Maps provided by Google LLC. Videos do not connect to YouTube until you press the play button; when you do, a YouTube player in privacy-enhanced mode {domain} opens. The map is loaded from Google Maps when that part of the page appears on screen.',
      google:
        'In that case, Google may process your IP address and device and browser information, or use cookies and other browser storage features; the Company does not collect or receive this information. This processing is governed by the {link}.',
      googleLink: 'Google Privacy Policy',
      kakao:
        'Clicking “Ask on KakaoTalk” on the Contact us page or in the consultation chatbot, or the “KakaoTalk Channel” link at the bottom of each page, opens a 1:1 chat with the Company’s channel “{channel}” (GSLT Co., Ltd.) on the KakaoTalk Channel service provided by Kakao Corp. The Company’s website does not send any user information to Kakao when this happens. Information processed by Kakao Corp. during KakaoTalk Channel conversations (Kakao Account, storage of conversations on its servers, etc.) is governed by the {link}, and information the Company receives through the conversation is processed under this policy.',
      kakaoLink: 'Kakao Corp. Privacy Policy',
      cdn: 'The website’s fonts are loaded from jsDelivr (Volentio JSD Ltd.), and some images and videos from Cloudinary. Your IP address and browser information may be passed to these services in the process; the Company does not receive this information.',
    },
    cookies: {
      title: '10. Installation, Operation and Refusal of Automatic Collection Tools',
      items: [
        'The Company does not use cookies.',
        'Visit statistics (Vercel Web Analytics) tell visits apart without cookies, using a temporary value created from request information; this value is discarded after 24 hours.',
        'The initial referral source (e.g. a search engine or another website) is kept briefly in your browser’s session storage, sent along with a consultation request, and cleared when you close the tab. Clearing site data in your browser settings deletes it immediately.',
      ],
    },
    security: {
      title: '11. Measures to Keep Personal Information Secure',
      items: [
        'Inquiries and consultation records can be viewed only by accounts that have passed administrator authentication.',
        'All transmissions are encrypted (HTTPS).',
        'Administrative privileges are granted only to those who need them.',
      ],
    },
    rights: {
      title: '12. Your Rights',
      body: 'You may request access to, correction or deletion of, or suspension of processing of your personal information at any time. Email your request to {email} and we will process it immediately.',
    },
    officer: {
      title: '13. Chief Privacy Officer',
      name: 'Name: {name} (CEO)',
      email: 'Email: {email}',
      tel: 'Phone: {tel}',
    },
    effective:
      'This policy takes effect on October 19, 2026. (Added sections on outsourced processing, overseas transfers and the AI consultation)',
  },
  terms: {
    meta: {
      title: 'Terms of Service',
      description:
        'GSLT’s Terms of Service: the conditions and procedures for using our services, and the rights, obligations and responsibilities of the Company and users.',
      ogDescription: 'The terms setting out the conditions and procedures for using the services provided by GSLT.',
    },
    lead: 'These terms set out the conditions and procedures for using the services provided by GSLT, and the rights, obligations and responsibilities of the Company and users.',
    updated: 'Last updated: January 1, 2025',
    articles: [
      {
        title: 'Article 1 (Purpose)',
        body: 'The purpose of these Terms is to set out the conditions and procedures for using all services, including SIOT (the "Services"), provided by GSLT Co., Ltd. (the "Company"), and the rights, obligations and responsibilities of the Company and users.',
      },
      {
        title: 'Article 2 (Definitions)',
        body: '"User" means any member or non-member who receives the Services provided by the Company under these Terms. "Services" means all smart office solutions and workspace platforms provided by the Company.',
      },
      {
        title: 'Article 3 (Effect and Amendment of the Terms)',
        body: 'These Terms take effect when posted on the service screen or otherwise notified to users. The Company may amend these Terms where there is reasonable cause, and the amended Terms take effect 7 days after notice is given.',
      },
      {
        title: 'Article 4 (Provision and Changes of the Services)',
        body: 'The Company makes its best efforts to provide the Services reliably. The Services may be temporarily suspended for system inspection, maintenance, technical reasons or the like, in which case the Company will give notice in advance or afterwards.',
      },
      {
        title: 'Article 5 (Obligations of Users)',
        body: 'When using the Services, users must comply with applicable laws, the provisions of these Terms, usage guides and other matters announced by the Company. Misappropriating another person’s information, copying or distributing the Services without authorization, unlawful acts and the like are prohibited.',
      },
      {
        title: 'Article 6 (Limitation of Liability)',
        body: 'The Company is exempt from liability where it is unable to provide the Services due to natural disasters, war, suspension of service by a facilities-based telecommunications carrier, or other force majeure events.',
      },
      {
        title: 'Article 7 (Dispute Resolution)',
        body: 'If a dispute arises in connection with the use of the Services, the Company and the user shall consult in good faith to resolve it amicably. If no agreement is reached, the competent court shall be the court having jurisdiction over the location of the Company.',
      },
    ],
    contact: 'Contact: ',
    tel: 'Tel.',
  },
};
