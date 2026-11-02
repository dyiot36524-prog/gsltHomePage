import type { ko } from './ko';
import { en as fields } from '@/i18n/messages/fields/en';

/** FAQ 답 끝에 붙는 '현장 조건' 문장. 한국어가 lib/fields.ts의 CONDITIONS 한 문장을 구축 분야와 함께 쓰듯,
 * 번역도 구축 분야 사전의 것을 그대로 받아 페이지마다 다른 문장이 되지 않게 한다. */
const CONDITIONS = fields.conditions;

const WHERE =
  'corporate headquarters, multi-tenant buildings, shared offices and rental spaces, public institutions and schools';

export const en: typeof ko = {
  items: {
    'meeting-room': {
      keyword: 'Meeting room booking system',
      title: 'Meeting room booking & IoT control',
      description:
        "A booking grants access for that time slot along with control of the room's lighting and HVAC, and every meeting room is monitored from one screen. Demo available at our Seongnam showroom.",
      lead:
        "SIOT's meeting room booking system is built for places where many people share meeting rooms — headquarters, office buildings, shared offices and public institutions. For the duration of a booking, it gives the person who booked control of the room's IoT devices such as lighting and HVAC, while administrators monitor every meeting room from one screen. Booking, access and control run as one continuous flow.",
      problem:
        "Meeting room bookings and actual use don't line up. Air conditioning runs in empty rooms, and lights stay on after meetings end. " +
        'Switches and remotes are scattered from room to room, so no one knows who turned what on.',
      how: [
        ['A booking issues a time-limited pass', 'Enter the space, time and number of people, and the booking appears on the timeline by floor and room. The booker receives a mobile QR access pass valid only for that time slot.'],
        ['Control rights during the booking', "The booker can be given rights to switch the room's IoT devices, such as lighting and HVAC, on and off directly for the booked time."],
        ['Authenticate and the room is ready', 'Authenticating at the on-site terminal opens the door and turns on the lighting and HVAC at the same time.'],
        ['Every meeting room on one screen', 'From the central monitoring screen, administrators see booking, usage and device status for every meeting room, and control devices by location on the actual floor plan.'],
      ],
      admin: [
        'Booking timeline by floor and room',
        'Automatic status: confirmed, in use, completed, no-show',
        'Lighting, HVAC and power status per room',
        'Device locations on the floor plan, with remote control',
      ],
      devices: ['QR access terminal', 'Lighting · dimming', 'HVAC · ventilation', 'Smart glass', 'Occupancy · motion sensors', 'Smart plug power metering'],
      faq: [
        {
          q: 'Can we limit meeting room devices to the person who booked?',
          a: "Yes. Permissions can be based on bookings. For the booked time, the booker gets control of the room's IoT devices such as lighting and HVAC, while administrators see and control every meeting room from the central monitoring screen.",
        },
        {
          q: 'What about no-shows, or devices left on after a meeting?',
          a: 'Bookings are automatically recorded as confirmed, in use, completed or no-show. You can also set automation rules based on time and occupancy — for example, turning off lighting and HVAC when no motion is detected for a set period.',
        },
        {
          q: 'What kinds of sites is it suited to?',
          a: `Any site where many people share meeting rooms, whatever its type — ${WHERE}. As meeting rooms are added, you only need to add them in the settings.`,
        },
        {
          q: 'Do we need to replace our existing meeting room equipment?',
          a: 'Generally, no. Wireless devices are added on top of your existing lighting and HVAC and connected without rewiring. ' + CONDITIONS,
        },
      ],
    },
    lounge: {
      keyword: 'Lounge booking & occupancy board',
      title: 'Lounge booking & occupancy board',
      description:
        'Take hourly bookings for break spaces such as relaxation rooms, show occupied seats on an entrance status board, and let administrators see floor-by-floor status and usage records on one screen.',
      lead:
        "SIOT's lounge booking and occupancy board is built for places where many people share break spaces — headquarters, office buildings, shared offices, public institutions and schools. It takes hourly bookings for seats and rooms in break spaces such as relaxation rooms, and shows occupied and free seats on an occupancy board at the entrance. Administrators see the status and usage records of break spaces on every floor on one screen.",
      problem:
        'People head off for a break only to find no free seat, and without knowing who uses the space and for how long, it is hard to set operating rules. ' +
        'Lights and HVAC are sometimes left running in an empty lounge.',
      how: [
        ['Hourly booking of seats and rooms', 'Seats and rooms in time-shared break spaces such as relaxation rooms can be booked by the hour.'],
        ['Occupancy board at the entrance', 'A screen at the lounge entrance shows which seats are occupied and which are free.'],
        ['Access, lighting and HVAC on schedule', 'At the booked time, entry is allowed and the lighting and HVAC turn on.'],
        ['Status and records on the monitoring screen', 'Administrators see usage status and records for break spaces on every floor on one screen.'],
      ],
      admin: ['Break space usage by floor', 'Booking timeline by seat and room', 'Usage records', 'Lighting and HVAC status'],
      devices: ['Entrance status board (display)', 'Occupancy · motion sensors', 'QR access terminal', 'Lighting · dimming', 'HVAC · ventilation'],
      faq: [
        {
          q: 'What does the status board show?',
          a: 'A screen at the lounge entrance shows occupied and free seats. People can check for a free seat before going in, or book by the hour to reserve one in advance.',
        },
        {
          q: 'What can administrators see?',
          a: 'Usage status of break spaces by floor, bookings by seat and room, and usage records — all on one screen. Break spaces are managed together with meeting rooms, restrooms and other spaces on the same SIOT monitoring screen.',
        },
        {
          q: 'What kinds of sites is it suited to?',
          a: `Sites where employees or tenants share break spaces — ${WHERE}. Any time-shared break space, such as a relaxation room, works regardless of format.`,
        },
        {
          q: 'Does an existing lounge need construction work?',
          a: 'The standard approach is to add wireless devices without rewiring. ' + CONDITIONS,
        },
      ],
    },
    restroom: {
      keyword: 'Restroom occupancy display',
      title: 'Restroom occupancy & vacancy display',
      description:
        'Sensors detect whether each stall is in use and show vacant stalls on an entrance status board, phones and the monitoring screen. No cameras are used. Demo available at our Seongnam showroom.',
      lead:
        "SIOT's restroom occupancy display is built for multi-floor buildings with heavy foot traffic — headquarters, office buildings, public institutions and schools. Door sensors and occupancy sensors detect whether each stall is in use, and vacant stalls are shown on a status board at the restroom entrance as well as on phones and the monitoring screen. No cameras are used.",
      problem:
        'People go up and down floors looking for a free stall, and while they wait in line, restrooms on other floors sit empty. ' +
        "Administrators can't tell which floor's restrooms are crowded.",
      how: [
        ['Sensors in every stall', 'Stall door sensors and occupancy/motion sensors detect whether each stall is in use.'],
        ['No cameras', 'Nothing is recorded on video. The sensors only detect whether a stall is in use.'],
        ['Entrance status board', 'A screen at the restroom entrance or in the corridor shows vacant stalls.'],
        ['Check from your desk', 'Check vacant stalls on each floor from your phone or the monitoring screen.'],
      ],
      admin: ['In use / vacant by floor and stall', 'Sensor connection status (online · offline)'],
      devices: ['Stall door sensors', 'Occupancy · motion sensors', 'Entrance status board (display)'],
      faq: [
        {
          q: 'Do you use cameras to watch people?',
          a: 'No. No cameras are used. Stall door sensors and occupancy/motion sensors only detect whether a stall is in use.',
        },
        {
          q: 'Where can I check for vacant stalls?',
          a: 'On the status board at the restroom entrance or in the corridor — and vacant stalls by floor are also visible on phones and the monitoring screen.',
        },
        {
          q: 'What kinds of sites is it suited to?',
          a: `Multi-floor sites with heavy foot traffic — ${WHERE}. Restrooms are managed together with meeting rooms and break spaces on the same SIOT monitoring screen.`,
        },
        {
          q: 'Does an existing restroom need construction work?',
          a: 'The standard approach is to add wireless devices without rewiring. ' + CONDITIONS,
        },
      ],
    },
  },
  page: {
    problem: 'The problem',
    how: 'How it works',
    admin: 'What administrators see',
    adminNote:
      'Meeting rooms, break spaces and restrooms are not managed separately — they all appear together on a single SIOT monitoring screen.',
    devices: 'Compatible devices',
    devicesNote:
      'Devices are added wirelessly without rewiring, and an open architecture supporting Wi-Fi, Bluetooth, ZigBee and Z-Wave ties them together even across different manufacturers.',
    faq: 'Frequently asked questions',
    others: 'Other SIOT use cases',
    siotAll: 'SIOT overview',
    siotAllDesc: 'Integrated monitoring and control, space booking, access integration, automation and energy — in one system.',
    ctaTitle: 'See it in person at our Seongnam showroom',
    ctaBody:
      'We will show you “{name}” running live in our showroom. Leave your preferred date and our team will get in touch to schedule a visit.',
    ctaButton: 'Request a showroom demo',
    areaServed: 'South Korea',
    siotName: 'SIOT',
  },
};
