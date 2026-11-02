import type { ko } from './ko';

export const en: typeof ko = {
  meta: {
    title: 'SIOT — Space Operating Platform',
    description:
      'Booking and access, lighting and HVAC, energy and records — all on one platform. SIOT is an intelligent space operations solution that monitors an entire building from one screen.',
  },
  ld: {
    name: 'SIOT',
    alternateName: 'SIOT Space Operating Platform',
    description:
      'An intelligent space operating platform. It monitors power, environment, occupancy and device status on one screen, ' +
      'controls equipment in real time on the actual floor plan, and links everything from space booking to QR access pass issuance ' +
      'and lighting and HVAC control in a single flow. It supports multi-layer automation with overlapping conditions.',
    featureList: [
      'Integrated monitoring and control — real-time view of power, environment, occupancy and device status on one screen',
      'Space booking — timelines and booking registration by floor, meeting room and bay',
      'Access integration — mobile QR access passes valid only during the booked time; lighting and HVAC start as the door opens',
      'Automation — multi-layer automation with overlapping time, occupancy and zone conditions',
      'Floor plan control — place devices on the actual floor plan and control them from tablets, PCs, touch DIDs and mobile',
      'Energy — per-device power metering, usage trends and air quality sensing',
    ],
  },
  hero: {
    logoAlt: 'SIOT',
    eyebrow: '· Space Operating Platform',
    titleName: 'SIOT',
    titleLine: 'The premium solution for',
    titleAccent: 'intelligent space operations',
    lead:
      'See, open and switch off — all from one screen. Booking and access, lighting and HVAC, energy and records sit on a single platform, ' +
      'added to the space you already have without rewiring.',
    contact: 'Contact us',
    process: 'See how we build',
    siotHome: 'Visit the SIOT website',
    statDevices: 'Connected devices',
    statAutomations: 'Automations set up',
    statInterval: 'Monitoring interval',
    seconds: 's',
  },
  sections: [
    {
      key: 'cover',
      title: ['Booking and access,', 'lighting, HVAC, energy and records'],
      lead:
        'When the work of running a space is scattered across separate systems, people end up shuttling between them. ' +
        'SIOT brings all five onto a single platform.',
      specs: [
        ['Integrated control', 'See power, environment, occupancy and device status on one screen.'],
        ['Space booking', 'Assign time by floor, meeting room or bay.'],
        ['Access integration', 'Issue QR access passes valid only during the booked time.'],
        ['Automation', 'Set up even complex rules with overlapping conditions.'],
        ['Energy', 'Meter power use per device and follow the trends.'],
      ],
      alt:
        'SIOT introduction slide. SPACE OPERATING PLATFORM — a premium solution for intelligent space operations. ' +
        'A laptop shows the integrated dashboard and a phone shows a booking QR access pass, with five items listed: integrated control, space booking, access integration, automation and energy.',
    },
    {
      key: 'booking',
      title: ['From space booking', 'to HVAC, lighting and access — in one flow'],
      lead:
        'Drawing on our experience building booking systems, SIOT connects schedule data with physical equipment — ' +
        'from booking through device control and access control.',
      specs: [],
      alt:
        'SIOT space booking slide. Four steps — admin booking registration, booking status and timeline, mobile QR access pass, ' +
        'and access control — shown in sequence with photos of a monitor, laptop, phone and access terminal.',
    },
    {
      key: 'control',
      title: ['One screen to monitor', 'the entire building'],
      lead:
        'Power, environment, occupancy and device status come together in real time. With live alerts and current status ' +
        'shown at a glance, the screen tells you where to look first.',
      specs: [
        ["Today's power use", 'Statistics and trends'],
        ['Online / offline', 'Connected device status in real time'],
        ['Air quality', 'Indoor CO₂ and other environmental sensors'],
        ['Automation runs', 'Execution status of routine automations'],
      ],
      alt:
        'SIOT building control slide. A laptop screen shows a single dashboard with widgets for power usage, device connection status, environmental sensor readings, ' +
        'occupancy and access, top 5 power consumers, device logs and automation logs.',
    },
    {
      key: 'floor',
      title: ['Real-time control', 'on the actual floor plan'],
      lead:
        'Granular IoT devices and mixed-vendor equipment on each floor are placed on the actual floor plan, ' +
        'so you can see and control them all on one screen.',
      specs: [
        ['On the floor plan', 'See what is switched off where — by location, not in a list.'],
        [
          'Any device',
          'Tablets, PCs, large touch DIDs and mobile. Fine-grained permissions keep every device in sync in real time.',
        ],
        [
          'From quote to operations',
          'BizMoa, from the same company, produces quotes by placing devices on a floor plan. That same floor plan becomes the control board.',
        ],
      ],
      alt:
        'SIOT floor plan control slide. Icons for lights, TV power, plugs and sensors sit at each spot on a 3D floor plan, ' +
        'and the same plan is being controlled from both a laptop and a tablet.',
    },
    {
      key: 'automation',
      title: ['Control of diverse devices', 'and multi-layer automation'],
      lead:
        'Air conditioners, dimmable lighting, smart glass, even industrial equipment. SIOT integrates granular IoT devices and mixed-vendor ' +
        'equipment on each floor, showing and controlling them on one screen.',
      specs: [],
      alt:
        'SIOT automation slide. Two tablets show a grid of device cards — lighting, sensors, plugs, remotes — ' +
        'alongside automation cards for virtual devices, modes and a projector.',
    },
  ],
  chain: [
    { name: 'Admin books a space', desc: 'Select the space, time and number of people.' },
    { name: 'Booking status · timeline', desc: 'The booking is placed on the timeline by floor, meeting room and bay.' },
    { name: 'Mobile QR access pass', desc: 'A code is issued that works only during the permitted time.' },
    { name: 'Access control', desc: 'Door opens + lighting and HVAC ON + booked program runs.' },
  ],
  rulesTitle: 'Examples of advanced multi-layer automation',
  rules: [
    'At 8 a.m., set the indoor temperature on every floor to 23℃.',
    'If motion is detected before then, set the temperature of that zone to 23℃.',
    'At 10 p.m., turn off the lights and EHP power in every zone except common areas — but not where someone is still present.',
    'From 10 p.m. to 8 a.m., if there is no motion for 5 minutes, turn off all power.',
  ],
  screensTitle: 'Screens in real operation',
  screensLead:
    'These are the admin screens running in our Seongnam showroom. Together with the systems of three screen golf companies ' +
    '(Kakao VX Friends Screen · Golfzon Park · GDR Academy), we are validating per-bay ' +
    'check-in and check-out automation in practice.',
  screenAlt: 'SIOT {cap} screen — {desc}',
  screens: [
    { key: 'reservations', cap: 'Booking status', desc: 'Place bookings on a timetable and see an operations summary' },
    { key: 'spaces', cap: 'Space management', desc: 'Link access terminals and check-in/check-out automations to each space' },
    { key: 'floor', cap: 'Floor plan control', desc: 'Place devices and automations on the floor plan' },
    { key: 'dashboard', cap: 'Dashboard', desc: 'Build widgets for power, environment, occupancy and automation' },
    { key: 'automation', cap: 'Automation', desc: 'Group check-in and check-out scenes into cards' },
    { key: 'history', cap: 'History', desc: 'Booking changes, QR deliveries and access authentications in one table' },
    { key: 'home', cap: 'Home management', desc: 'Control switches, curtains, plugs and sensors by type' },
  ],
  videos: [
    {
      key: 'office2',
      title: 'The disappearing control panel',
      desc: 'Lighting, blinds and HVAC from a single smartphone. Change your space anytime, anywhere — no complicated switches.',
    },
    {
      key: 'office4',
      title: 'Beyond heavy, complex systems',
      desc: "SIOT's mini IoT handles the fine-grained space control that conventional smart systems could not reach.",
    },
  ],
  devicesTitle: ['Different manufacturers,', 'one system'],
  devicesLead:
    'An open architecture that supports Wi-Fi, Bluetooth, ZigBee and Z-Wave together. Because it is not tied to any one ' +
    'manufacturer, it sits on top of equipment that is already installed. Air conditioners, ' +
    'dimmable lighting, smart glass and even industrial equipment are controlled together on one screen.',
  deviceKinds: [
    { name: 'Lighting · dimming', desc: 'On/off, brightness and color temperature' },
    { name: 'HVAC · ventilation', desc: 'Automatic operation by temperature and humidity' },
    { name: 'Smart glass', desc: 'Separate zones by switching transparency' },
    { name: 'Smart plugs', desc: 'Per-device power metering' },
    { name: 'Environmental sensors', desc: 'Temperature, humidity, CO₂, fine dust, light, leaks' },
    { name: 'Occupancy · motion', desc: 'On only when someone is there' },
    { name: 'IR remote', desc: 'Existing devices such as air conditioners and TVs' },
    { name: 'Industrial equipment', desc: 'Everything else via dry-contact control' },
  ],
  spacesTitle: ['Every space', 'booked by the hour'],
  spacesLead:
    'Any space that takes bookings and is cleared when time is up works, whatever its format. ' +
    'Just decide what to switch on for each space.',
  spaces: ['Meeting rooms', 'Tennis courts', 'Golf bays', 'Bowling alleys', 'Billiard halls', 'Study rooms', 'Practice rooms', 'Shared offices'],
  scenesTitle: 'Use cases',
  scenesLead:
    'Meeting rooms, break spaces and restrooms are not managed separately — you see them all on a single SIOT monitoring screen. ' +
    'Each use case below covers how it works and what administrators see. You can see them in person at our Seongnam showroom.',
  sceneMore: 'Learn more',
  processTitle: 'From consultation to maintenance, in 5 steps',
  processSteps: 'Consultation · site survey → Design · quote → Installation · setup → Inspection → Maintenance',
  processButton: 'See our build process',
  ctaTitle: 'How would it work in your space?',
  ctaBody: 'We will propose a configuration suited to your site conditions, free of charge.',
  ctaButton: 'Request a free consultation',
};
