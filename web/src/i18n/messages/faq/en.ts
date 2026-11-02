import type { ko } from './ko';

export const en: typeof ko = {
  meta: {
    title: 'Frequently asked questions',
    description:
      'Does it work without rewiring? Can it go into a leased office? How is the cost calculated? Answers to the questions we hear most.',
  },
  title: 'Frequently asked questions',
  lead: 'The questions we hear most often from teams considering a wireless IoT deployment.',
  cta: {
    title: 'Don’t see your question?',
    body: 'Tell us about your space and what you want to control, and we’ll propose a setup that fits your site.',
    button: 'Contact us',
  },
  groups: [
    {
      id: 'basics',
      title: 'Installation & construction',
      items: [
        {
          q: 'Can you really install without rewiring?',
          a: 'Yes. SIOT runs on wireless IoT devices, so there is no need to open up walls or lay new wiring. Devices are mounted in your space exactly as it is today and connected wirelessly.',
        },
        {
          q: 'Can it be installed in an existing building or a leased office?',
          a: 'Yes. Because there is no construction work, there is little to restore when you move out, which makes it a good fit for leased spaces. We propose a setup tailored to the type and size of your space — office, residential or building.',
        },
        {
          q: 'What does the project process look like?',
          a: 'Projects follow five stages: consultation and requirements analysis → on-site survey → design and quote → installation → inspection and maintenance. Design is based on floor plans, so quotes are produced quickly, and after installation the system is managed with real-time monitoring at one-second intervals.',
        },
        {
          q: 'How is the cost calculated?',
          a: 'The device configuration and installation cost depend on the size of the space and what you want to control (lighting, blinds, HVAC and so on). Request a free consultation and we will provide a quote that fits your site conditions.',
        },
        {
          q: 'How are management and maintenance handled after installation?',
          a: 'The SIOT dashboard monitors the status of every device at one-second intervals and detects abnormal signals immediately. We provide ongoing maintenance to keep control stability at 99.9%.',
        },
        {
          q: 'Do you only supply the solution, or do you handle installation too?',
          a: 'GSLT does more than supply solutions — we go on site, carry out the installation ourselves and take responsibility through to operation. One company handles the entire process — consultation and requirements analysis, on-site survey, design and quote, installation, and inspection and maintenance — so clients do not need to coordinate multiple contractors. We continue to support operations after handover.',
        },
        {
          q: 'How do I request a quote?',
          a: 'Contact us through the inquiry form on our website or by phone (+82-70-4659-4804), and our team will get back to you. We first learn how the space is used and what you want to control, then schedule an on-site survey and provide a design and quote based on the results. Consultation and an initial overview before the survey are free, and you can also start with consulting only.',
        },
      ],
    },
    {
      id: 'solutions',
      title: 'SIOT & solutions',
      items: [
        {
          q: 'What is SIOT?',
          a: 'SIOT is an intelligent Space Operating Platform developed by GSLT. It brings five functions — integrated monitoring and control, space booking, access integration, automation and energy — into one system, so you can see power, environment, occupancy and device status on a single screen and control devices directly on your actual floor plan. It supports multi-layer automation that combines time, occupancy and zone conditions, and it runs on top of the space you already use, without rewiring.',
        },
        {
          q: 'Which communication protocols are supported?',
          a: 'SIOT has an open architecture that supports Wi-Fi, Bluetooth, ZigBee and Z-Wave together, so devices from different manufacturers come together on one screen. As a multi-protocol IoT gateway, SIOT also connects devices that use other standards, such as LoRa, Matter, Thread, BLE and Modbus. However, older equipment that only supports closed protocols may need an additional gateway or partial replacement; this is confirmed during the on-site survey.',
        },
        {
          q: 'What devices can SIOT connect to and control?',
          a: 'Lighting and dimming, HVAC and ventilation, switchable smart glass, smart plugs, environmental sensors, occupancy and motion sensors, infrared remotes and industrial equipment can all be connected and controlled from one screen. Environmental sensors measure temperature and humidity, CO₂, fine dust, illuminance and water leaks, while smart plugs meter the power each device uses. Existing devices operated by infrared remote, such as air conditioners and TVs, can be included, and other equipment can be tied in through contact control.',
        },
        {
          q: 'Can access be limited to the person who booked a space, only during their booking?',
          a: 'Yes. When a booking is made in SIOT, the person who booked receives a mobile QR access pass that is valid only for that time slot. When they authenticate at the on-site terminal, the door opens and, at the same time, the lighting and HVAC turn on and the booked program starts. Bookings are managed on a timeline by floor, meeting room or bay, and each one is automatically recorded as confirmed, in use, completed or no-show.',
        },
        {
          q: 'Which access authentication methods are supported? Is facial recognition available?',
          a: 'SIOT supports facial recognition and QR authentication for access. QR codes are issued as mobile access passes valid only during the booked time or as one-time access credentials, and access control, membership management and booking systems are integrated with SIOT into a single operational framework.',
        },
        {
          q: 'Can a screen golf venue be run without staff?',
          a: 'Yes. For spaces allocated by the hour, such as golf bays, SIOT links booking, access, lighting and HVAC into a single flow, so the space opens and closes on schedule without staff on site. At our Seongnam showroom, we are demonstrating per-bay check-in and check-out automation together with the systems of three screen golf providers (Kakao VX Friends Screen, Golfzon Park and GDR Academy). What to turn on can be set differently for each space, and adding spaces only means adding settings.',
        },
        {
          q: 'Does it integrate with fire detection and fire safety equipment?',
          a: 'Yes. In smart building projects, we link a photoelectric smoke detection system with fire safety equipment to strengthen early fire response. Access control, energy management and safety systems are brought together on one platform, which also provides QR-based one-time access authentication and real-time energy control.',
        },
        {
          q: 'Can shared spaces such as meeting rooms, lounges and restrooms be managed too?',
          a: 'Yes. SIOT alone handles meeting room booking and control, lounge booking with an occupancy board, and restroom occupancy display. In meeting rooms, the person who booked can be given control of the lighting and HVAC for the booked time; in restrooms, door and occupancy sensors detect only whether each stall is in use, with no cameras. Each scenario is explained in the meeting room, lounge and restroom use cases on the SIOT page, and we offer live demos at our Seongnam showroom.',
        },
        {
          q: 'What is BizMoa?',
          a: 'BizMoa is a SaaS that automates installation quotes for IoT and electrical contractors. Place devices on an architectural floor plan and it generates a quote that combines device unit prices with labor costs by trade; once the quote is confirmed, the contract and delivery confirmation are drawn up automatically as well. It suits IoT and smart home installers, security and CCTV installers, network infrastructure companies, and electrical and telecom contractors — and GSLT itself uses BizMoa to produce quotes at the design and quote stage.',
        },
      ],
    },
    {
      id: 'company',
      title: 'Company',
      items: [
        {
          q: 'What kind of company is GSLT?',
          a: 'GSLT is a wireless IoT integration company founded in 2023 and based in Seongnam, Gyeonggi-do, Korea. Our core business is turning existing offices, homes and buildings into smart spaces without rewiring, and we handle everything ourselves, from consultation to installation and maintenance. We run three in-house solutions: SIOT, a space operating platform; BizMoa, a SaaS that automates installation quotes; and Morak, a community for cohort-based groups. Our CEO is Kwangsu Choi.',
        },
        {
          q: 'What certifications and awards do you have?',
          a: 'In September 2026 we received Venture Business Certification (Innovation Growth type), valid until September 8, 2029. We won the Forbes Korea and JoongAng Ilbo “2026 Consumers’ Choice Best Brand Grand Prize” in the wireless IoT smart space category. We were selected for the Ministry of SMEs and Startups’ Didimdol R&D government project (2026) and graduated from the Early-Stage Startup Package in the deep tech track (2025). We hold registered patent No. 10-2659230 and operate a corporate R&D center, and in June 2026 we filed two patent applications for core technology in AI predictive maintenance for heterogeneous equipment.',
        },
        {
          q: 'Where have your solutions been deployed?',
          a: 'Our deployments include integrated monitoring and control for Toss and Mirae Asset, LG Electronics’ Seoul Station office building, and smart homes and offices in Sindo-ri, Jeju (as reported in September 2026). They range from workspaces at finance and IT companies to mixed residential and office spaces. Details of each site’s configuration and scale are available in a consultation with our team.',
        },
        {
          q: 'Besides IoT projects, do you offer enterprise AX or custom web development?',
          a: 'Yes. We also provide enterprise AX (AI transformation), which reshapes a company’s work environment around AI, and custom SI web development tailored to each client. We also build access control, membership management and booking systems, and integrate them with SIOT — together with facial recognition and QR access authentication — into a single operational framework.',
        },
        {
          q: 'Are GSLT and GSLT Furniture (gslf.kr) the same company?',
          a: 'Yes. GSLT Furniture is the same company’s furniture business. Storage furniture such as lockers, storage cabinets, shoe cabinets and wardrobes, as well as electronic locks, is made and sold by GSLT Furniture (online store gslf.kr, Pyeongtaek site, consultation and orders +82-70-8676-3470). For wireless IoT consultations, please contact us at www.gslt.kr or +82-70-4659-4804.',
        },
        {
          q: 'How can I contact you, and where are you located?',
          a: 'We are located at #501, Woolim Lions Valley 3, 24 Dunchon-daero 388beon-gil, Jungwon-gu, Seongnam-si, Gyeonggi-do, Republic of Korea. Phone: +82-70-4659-4804. Email: gs7078103107@gmail.com. Our business hours are weekdays from 9 a.m. to 6 p.m. (KST). You can also request a wireless IoT consultation through the Contact us page on our website, or reach us through GSLT’s KakaoTalk channel.',
        },
      ],
    },
  ],
};
