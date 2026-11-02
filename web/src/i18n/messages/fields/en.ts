import type { ko } from './ko';

/** 적용 조건(CONDITIONS)의 뒷부분. 스마트홈 FAQ는 앞머리만 달리 쓴다 — 한국어 원문과 같다. */
const SITE_FACTORS =
  '— floor area and floor layout, the type and age of existing equipment, where power is available, ' +
  'how far wireless signals reach, and whether the existing control system is open. Older equipment that supports ' +
  'only closed protocols may need an added gateway or partial replacement, and this is confirmed during the on-site survey.';
const CONDITIONS = 'Whether it can be applied depends on site conditions ' + SITE_FACTORS;
const DEVICES_LEAD =
  'Our open architecture supports Wi-Fi, Bluetooth, ZigBee and Z-Wave together, bringing devices from different manufacturers onto one screen.';

export const en: typeof ko = {
  sections: {
    problem: 'What goes wrong in these spaces',
    approach: 'How we build it',
    features: 'What we connect',
    product: 'The product behind it',
    scenes: 'SIOT use cases',
    faq: 'Frequently asked questions',
    others: 'Other areas we build',
  },
  cta: {
    title: 'Will it work in your space?',
    body: 'Tell us about your space and the scope of control you want, and we will propose a configuration that fits your site. Consultation before the on-site survey is free.',
    button: 'Contact us',
  },
  ld: {
    home: 'Home',
    country: 'South Korea',
  },
  conditions: CONDITIONS,
  items: {
    'smart-office': {
      keyword: 'Smart Office Integration',
      title: 'Smart Office Integration · No Rewiring',
      description:
        'Make your office smart without tearing anything out — occupancy sensors, HCL lighting and meeting-room booking integration. We survey, install and maintain it ourselves.',
      lead:
        'Every office has its own floor layout and way of working. A smart office starts not with a standard package, but with a survey of the actual space.',
      problem:
        'Air conditioning runs in empty meeting rooms, lights stay on across floors everyone has left, and the meeting-room schedule bears no relation to how rooms are actually used. ' +
        'Switches and remotes are scattered across every space, so no one can tell who turned what on. Yet in a leased office, tearing open walls to run new wiring is not an option.',
      approach: [
        ['Layered on wirelessly', 'No tearing open walls, no new wiring. We attach wireless devices to the lighting, HVAC and blinds you already have and connect them.'],
        ['Driven by occupancy and patterns', 'Lighting and HVAC adjust automatically based on occupancy sensors and usage patterns, so no power is spent on empty zones.'],
        ['Light that fits the hour', 'HCL lighting adjusts brightness and color temperature to the time of day and outdoor conditions.'],
        ['Bookings linked to the room', 'Book a meeting room and the room is ready at that time; when the booking ends, it switches off.'],
      ],
      features: [
        'Lighting · Dimming',
        'HVAC · Ventilation',
        'Blinds · Curtains',
        'Switchable glass',
        'Occupancy · Motion sensors',
        'Environmental sensors (temperature, humidity, CO₂)',
        'Plug-level power metering',
        'Meeting room booking',
      ],
      featuresLead: DEVICES_LEAD,
      product: {
        name: 'SIOT',
        why: 'Monitor and control the entire office from one screen, and tie meeting-room bookings, lighting and HVAC into a single flow.',
      },
      faq: [
        {
          q: 'Can it be installed in a leased office?',
          a: 'Yes. With no construction work, there is little to restore when you move out, which makes it a good fit for leased spaces. We propose a configuration suited to the type and size of your space.',
        },
        {
          q: 'Do we need to replace our current air conditioners and lighting?',
          a: 'As a rule, no. Our open architecture supports Wi-Fi, Bluetooth, ZigBee and Z-Wave together, so we keep the equipment already installed and build on top of it. ' + CONDITIONS,
        },
        {
          q: 'Can meeting-room bookings be linked to lighting and HVAC?',
          a: 'Yes. When a meeting room is booked in SIOT, the lighting and HVAC turn on for that time slot and switch off when it ends. Booking status is shown on a timeline by floor and room.',
        },
      ],
    },
    'smart-home': {
      keyword: 'Smart Home Integration',
      title: 'Smart Home Integration · Existing Homes',
      description:
        'Turn existing houses and apartments into smart homes without major construction. A cloud wall pad and lobby phone control lighting, heating, cooling and security in one place.',
      lead:
        'We convert existing houses and apartments, too — without major construction. Smart homes are not only for new builds.',
      problem:
        'Smart home features are often thought of as something that has to be designed in at the new-build stage. But most homes people actually live in are already built. ' +
        'In homes where walls cannot be opened up for new wiring, lighting, heating and cooling, and security each run on their own.',
      approach: [
        ['Conversion without construction', 'Designed to convert existing houses and apartments into smart environments without major construction.'],
        ['Wall pad and lobby phone', 'A cloud-based wall pad and lobby phone provide integrated control of lighting, heating and cooling, and security.'],
        ['No vendor lock-in', 'Our open architecture brings together devices that use different communication protocols, so you are not limited to one manufacturer’s products.'],
      ],
      features: [
        'Lighting',
        'Heating & cooling',
        'Security',
        'Cloud wall pad',
        'Lobby phone',
        'Environmental sensors',
        'Smart plugs',
        'IR remote (existing appliances)',
      ],
      featuresLead: DEVICES_LEAD,
      product: { name: 'SIOT', why: 'Brings devices from different manufacturers throughout the home onto one screen for control.' },
      faq: [
        {
          q: 'Does it work in older apartments?',
          a: 'It is designed to convert existing houses and apartments without major construction. That said, the scope depends on site conditions ' + SITE_FACTORS,
        },
        {
          q: 'What can be controlled?',
          a: 'Lighting, heating and cooling, and security are controlled together through a cloud-based wall pad and lobby phone. Existing appliances operated by infrared remote can be connected as well.',
        },
        {
          q: 'How much does it cost?',
          a: 'We cannot give a fixed price in advance, because it varies widely with the number and type of devices to be controlled, the floor area and layout, whether the existing equipment is open, and any power work required. The exact price is confirmed after an on-site survey, and consultation before the survey is free.',
        },
      ],
    },
    'smart-building': {
      keyword: 'Smart Building Integration',
      title: 'Smart Building · Integrated Monitoring & Control',
      description:
        'Access control, energy management and safety systems on one platform — layered onto existing buildings, not just new ones, and monitored and controlled from one screen.',
      lead:
        'We bring access control, energy management and safety systems together on one platform — layered onto existing buildings as they are, not only new ones.',
      problem:
        'In most buildings, access, power, HVAC and fire safety each run on separately installed systems. Finding where a problem occurred means checking several screens, and people fill the gaps between them. ' +
        'And adding a new system to an existing building runs straight into the obstacle of rewiring.',
      approach: [
        ['One-screen monitoring', 'Power, environment, occupancy and device status come together in real time, and the screen shows you where to look first.'],
        ['Control on the floor plan', 'Devices are placed on the actual floor plan, so you see what is switched off, and where, by location rather than in a list.'],
        ['Access and safety', 'Provides QR-based one-time access authentication and real-time energy control, and links a photoelectric smoke detection system with fire safety equipment to strengthen early fire response.'],
        ['On top of existing systems', 'A gateway that recognizes multiple communication protocols connects data from equipment already in place, as is.'],
      ],
      features: [
        'Access control · QR authentication',
        'Energy · Power metering',
        'HVAC · Ventilation',
        'Lighting',
        'Photoelectric smoke detection · Fire safety integration',
        'Air quality (CO₂) sensors',
        'Floor-plan-based monitoring',
        'Tablet · Touch display · Mobile',
      ],
      featuresLead: DEVICES_LEAD,
      product: { name: 'SIOT', why: 'Monitor and control the entire building from one screen, and operate devices right on the actual floor plan.' },
      faq: [
        {
          q: 'Does it work in buildings that are not new?',
          a: 'Yes. Layering onto existing buildings as they are is our starting point. A gateway that recognizes and converts multiple communication protocols connects data from equipment already installed. ' + CONDITIONS,
        },
        {
          q: 'What kinds of facilities is it used in?',
          a: 'As a configuration that brings access control, energy management and safety systems onto one platform, it is being applied in multi-use facilities such as hotels, resorts and educational facilities.',
        },
        {
          q: 'Where can the monitoring screen be viewed?',
          a: 'Not only on a PC — the same floor plan is available on tablets, large touch displays and mobile devices. Permissions can be assigned separately, and every device stays in sync with the others in real time.',
        },
      ],
    },
    'unmanned-automation': {
      keyword: 'Unstaffed Automation',
      title: 'Unstaffed Automation · Booking-Linked Access',
      description:
        'A booking issues a QR access pass, and opening the door turns on the lighting and HVAC. With no staff on site, the space gets itself ready for each booking.',
      lead:
        'We connect bookings, access and power into one. With no staff on site, the space opens and closes on its own according to the booking schedule.',
      problem:
        'When the system that takes bookings and the system that controls the space do not talk to each other, people end up filling the gap. Someone checks the schedule, goes over to unlock the door and flip the switches, ' +
        'then goes back to turn everything off when it is over. Even if you want to run the space unstaffed, without this link someone has to be there.',
      approach: [
        ['Admin booking entry', 'Select the space, time and number of people to register a booking, and it is placed on a timeline by floor, room or golf bay.'],
        ['Mobile QR access pass', 'The person who booked receives a QR access pass that works only for that time slot.'],
        ['Access control', 'Authenticating at the on-site terminal opens the door, turns on the lighting and HVAC, and launches the booked program at the same time.'],
        ['Check-out and records', 'When time is up, everything switches off. Each booking is automatically recorded as confirmed, in use, completed or no-show.'],
      ],
      features: [
        'Real-time space booking',
        'Mobile QR access pass',
        'Access terminal integration',
        'Automated check-in and check-out',
        'Automatic lighting · HVAC control',
        'Automatic no-show logging',
        'History export to CSV',
      ],
      featuresLead:
        'A single booking flows through access pass issuance, check-in and check-out, lighting and HVAC control, and usage records — all within SIOT.',
      product: {
        name: 'SIOT',
        why: 'Connects schedule data and physical equipment in one flow, from booking through device control and access control.',
      },
      faq: [
        {
          q: 'What kinds of spaces can it be used for?',
          a: 'Any space allocated by the hour, whatever its form — meeting rooms, tennis courts, golf bays, bowling alleys, billiard halls, study rooms, practice rooms, shared offices. What turns on is set separately for each space.',
        },
        {
          q: 'Is it in operation anywhere?',
          a: 'It is running at our showroom in Seongnam. Together with the systems of three screen golf providers (Kakao VX Friends Screen, GOLFZON Park and GDR Academy), we are demonstrating automated check-in and check-out for each golf bay.',
        },
        {
          q: 'What happens if the person who booked does not show up?',
          a: 'It is automatically recorded as a no-show. Visit and no-show counts are tallied for each member, so you can factor them into how you run the space.',
        },
      ],
    },
    'ai-building-bms': {
      keyword: 'AI Building · BMS',
      title: 'AI Building · Integrated BMS Monitoring & Control',
      description:
        'AI building monitoring that uses equipment data to predict anomalies, and goes beyond the alarm to response procedures and work orders. Two predictive maintenance patents filed.',
      lead:
        'We gather equipment data to predict signs of trouble. AI building monitoring does not stop at an alarm — it carries through to response procedures and work orders.',
      problem:
        'Conventional predictive maintenance often stops at detecting equipment anomalies or flagging the likelihood of failure. Yet even for the same fault, the actual repair procedure varies with the equipment’s manufacturer, age, criticality, operating environment, parts inventory and technician constraints. ' +
        'After the alarm, deciding what to do and how is still left to people.',
      approach: [
        ['Bring it together', 'Data from equipment with differing manufacturers and communication methods — lighting, HVAC, access control, wall pads — is gathered in one place to analyze changes in status.'],
        ['Choose the procedure', 'Weighing not only the fault type but also equipment type, age, criticality, operating environment and past maintenance history, it recommends the standard operating procedure that suits that equipment.'],
        ['Turn it into work orders', 'The selected procedure becomes work orders that on-site technicians can carry out straight from their phones, with the order and priority of each step laid out.'],
        ['Learn from results', 'Completed work results are fed back into the system to refine the procedures and the model.'],
      ],
      features: [
        'Multi-vendor equipment integration',
        'Real-time status monitoring',
        'Anomaly analysis',
        'Automatic SOP selection',
        'Automatic work order generation',
        'Fault history · Inspection logs',
        'Gateway integration',
      ],
      featuresLead:
        'A gateway gathers data from equipment with different manufacturers and communication methods in one place, and on top of it we carry through from anomaly analysis to response procedures and work orders.',
      product: {
        name: 'SIOT',
        why: 'Brings equipment data onto one screen, and is being advanced to carry through from diagnosis to the response that follows.',
      },
      faq: [
        {
          q: 'How is it different from a conventional BMS?',
          a: 'It does not stop at the alarm. With two technologies for which patents were filed in 2026 — one that automatically selects a standard operating procedure from IoT equipment data, and one that automatically turns that procedure into work orders — the aim is to automate the response steps that follow a failure prediction.',
        },
        {
          q: 'Do we have to replace all our equipment?',
          a: 'No. A gateway that recognizes and converts the various communication protocols used in industrial settings connects data from equipment already installed, as is. If all the equipment had to be replaced, adoption simply would not be viable at most sites.',
        },
        {
          q: 'How accurate is the anomaly prediction?',
          a: 'We do not publish performance figures. Equipment configurations and operating conditions differ from site to site, and we do not consider it accurate to present figures from one or two sites as general performance.',
        },
      ],
    },
    'ai-office': {
      keyword: 'AI Office',
      title: 'AI Office · Occupancy-Based Control',
      description:
        'An office that adjusts its own lighting and HVAC based on occupancy and usage patterns — down to compound rules that layer time, occupancy and zone conditions.',
      lead:
        'Lighting and HVAC adjust automatically based on occupancy and usage patterns. No power is spent on zones where no one is present.',
      problem:
        'One-line timer automation cannot keep up with reality. Set it to switch on at 8 a.m., and early arrivals sit in a hot office; set it to switch off at 10 p.m., and the lights go out on whoever is working late. ' +
        'The moment conditions overlap, someone is back at the switch.',
      approach: [
        ['Based on occupancy', 'Lighting and HVAC are adjusted based on occupancy sensors and usage patterns.'],
        ['Layered conditions', 'Supports multi-layer automation in which time, occupancy and zone conditions overlap. Later rules create exceptions to earlier ones.'],
        ['Light that follows the clock', 'HCL lighting adjusts brightness and color temperature to the time of day and outdoor conditions.'],
        ['See what you use', 'Power use is metered per device and tracked over time, so you can confirm in numbers what the automation actually changed.'],
      ],
      features: [
        'Occupancy · Motion sensors',
        'Multi-layer automation',
        'Scene (arrival · departure) automation',
        'HCL lighting',
        'HVAC · EHP',
        'Per-device power metering',
        'Air quality (CO₂) sensors',
      ],
      featuresLead:
        'Sensors read occupancy and the environment, layered automation rules drive the lighting and HVAC, and the results are confirmed through per-device power use.',
      product: { name: 'SIOT', why: 'Set automation rules with overlapping conditions, and confirm the results through power consumption.' },
      faq: [
        {
          q: 'What does a compound rule look like?',
          a: 'For example: set every floor to 23℃ at 8 a.m., but if motion is detected earlier, bring that zone to temperature first. At 10 p.m., switch off the lights and EHPs everywhere except common areas — but not while someone is still there. Between 10 p.m. and 8 a.m., if no motion is detected for 5 minutes, cut all power.',
        },
        {
          q: 'How much energy can it save?',
          a: 'We do not promise a specific figure, because results vary widely with how the space is laid out and how it is used. Instead, since power use is metered per device, you can compare before and after with real numbers.',
        },
        {
          q: 'Does it work with the equipment we already have?',
          a: 'Because the architecture is open, the default is to keep installed equipment as is and build on top of it. ' + CONDITIONS,
        },
      ],
    },
  },
};
