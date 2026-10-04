// Event data for the Events page. `upcoming` renders first, `past` below it.
// `gallery` holds photo URLs; the card title opens them in a modal.

import breach from '../assets/HS/achievements/Breacheverse.jpg';
import nullkiet from '../assets/HS/achievements/Null-Ghaziabad.jpg';
import nullmeetup from '../assets/HS/achievements/Null-meetup.jpg';
import rnb from '../assets/achievements/RednBlue.webp';
import Secure from '../assets/achievements/CyberSecure.webp';
import breachverse4a from '../assets/Events/breachverse4-1.jpeg';
import breachverse4b from '../assets/Events/breachverse4-2.jpeg';
import breachverse4c from '../assets/Events/breachverse4-3.jpg';
import breachverse4d from '../assets/Events/breachverse4-4.jpg';
import mini4 from '../assets/Events/minilecture-4.jpeg';
import mini6 from '../assets/Events/minilecture-6.jpeg';

export const upcomingEvents = [
  {
    title: 'VOID CTF',
    date: 'Oct – Nov 2026',
    link: 'https://ctf.void-society.in/',
    gallery: [],
    description:
      'A two-part competition. The online qualifier is a 24-hour jeopardy CTF across web, crypto, reversing, pwn, forensics and OSINT; the top 15 teams then advance to a 24-hour attack-defense finale fought on a real physical network.',
  },
];

export const pastEvents = [
  {
    title: 'BREACHVERSE 4.0',
    date: '2026',
    gallery: [breachverse4a, breachverse4b, breachverse4c, breachverse4d],
    description:
      'The fourth Breachverse bootcamp drew 120 registrations this year. It was a successful, hands-on training programme run by the Centre of Excellence, from first principles to real-world techniques.',
  },
  {
    title: 'MINI LECTURE SERIES & FOREIGN INTERNS',
    date: '2025',
    gallery: [mini4, mini6],
    description:
      'An exclusive mini lecture series delivered to three foreign intern students and our club members, introducing them to the world of cybersecurity. Across the sessions we covered the fundamentals of different domains of cybersecurity, backed by hands-on demos.',
  },
  {
    title: 'BREACHVERSE 3.0',
    date: 'June 2025',
    gallery: [Secure],
    description:
      'The third Breachverse bootcamp, run as part of the CyberSecureX event by the CSE Department and entirely managed by students. It drew 100+ paid registrations, making it one of our most impactful training events.',
  },
  {
    title: 'RED N BLUE — CyberSecureX1.0',
    date: '2025',
    gallery: [rnb],
    description:
      'A 24-hour offline CTF where the top 10 teams from the online qualifiers battled in a real-world cyber range with live servers and firewalls. Inspired by a Resident Evil–themed storyline, one of India’s first large-scale offline CTFs.',
  },
  {
    title: 'Null Meetup 2024–25',
    date: '2025',
    gallery: [nullmeetup],
    description:
      'The next Null Meetup under the Ghaziabad Chapter featured sessions by Dr. D3 and Youghal Pathak, contributors to the Government of India’s cybersecurity initiatives. The founders of Hackitise Labs were also present.',
  },
  {
    title: 'BREACHVERSE 2.0',
    date: '2024',
    gallery: [breach],
    description:
      'The second Breachverse bootcamp, introducing first-year students to ethical hacking. With 50+ participants, it delivered a strong foundation in real-world hacking techniques through practical, hands-on demonstrations.',
  },
  {
    title: 'Null Meetup 2023-2024',
    date: '2024',
    gallery: [nullkiet],
    description:
      'The first Null Meetup of the Ghaziabad Chapter, launched in collaboration with our Centre of Excellence and India’s largest open security community. The event attracted more than 100 participants from outside the college.',
  },
];
