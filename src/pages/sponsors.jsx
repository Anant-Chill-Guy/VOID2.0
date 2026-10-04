import { Suspense, lazy } from 'react';
import Navbar from '../components/navbar';
import Footer from './../components/footer';
import './../index.css';
import hackerdnaLogo from '../assets/Sponsors/hackerdna.png';

// The 3D background pulls in three.js, so it loads with this (already lazy) route.
const SponsorsScene = lazy(() => import('../components/SponsorsScene'));

const SPONSORS = [
  {
    name: 'APIsec University',
    url: 'https://au.apisec.ai/',
    logo: 'https://ctf.void-society.in/media/sponsor-apisec-university.png',
    color: '#8fb8ff',
    soft: 'rgba(143, 184, 255, 0.14)',
  },
  {
    name: 'HackerDNA',
    url: 'https://hackerdna.com/',
    logo: hackerdnaLogo,
    color: '#4ade80',
    soft: 'rgba(74, 222, 128, 0.16)',
  },
  {
    name: 'Hackitise Labs',
    url: 'https://cert.hackitiselabs.in/',
    logo: 'https://ctf.void-society.in/media/sponsor-hackitise-white.png',
    color: '#4a68c8',
    soft: 'rgba(74, 104, 200, 0.2)',
  },
  {
    name: '.xyz',
    url: 'https://gen.xyz/',
    logo: 'https://ctf.void-society.in/media/sponsor-xyz-white.svg',
    color: '#e8eef7',
    soft: 'rgba(232, 238, 247, 0.12)',
  },
];

// Pointer-tracked 3D tilt so each card leans toward the cursor.
const SponsorCard = ({ name, url, logo, color, soft, index }) => {
  const handleMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 12).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 14).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
  };

  const handleLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <a
      className="sponsor-card"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ '--i': index, '--accent': color, '--accent-soft': soft }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="sponsor-card__sheen" aria-hidden="true" />
      <div className="sponsor-card__logo">
        <img src={logo} alt={name} loading="lazy" />
      </div>
      <h2 className="sponsor-card__name">{name}</h2>
    </a>
  );
};

export default function Sponsors() {
  return (
    <>
      <Navbar />
      <div className="sponsors-page">
        {/* Fixed 3D background, behind the whole page. */}
        <div className="sponsors-bg" aria-hidden="true">
          <Suspense fallback={null}>
            <SponsorsScene />
          </Suspense>
        </div>
        <div className="sponsors-bg-veil" aria-hidden="true" />

        {/* Hero heading */}
        <header className="sponsors-hero">
          <h1 className="sponsors-hero__title">
            <span>Our</span>
            <span>Sponsors</span>
          </h1>
        </header>

        {/* Huge gap, then a dark shade (like events) covering to the page end. */}
        <section className="sponsors-list-wrap">
          <div className="sponsors-grid">
            {SPONSORS.map((s, i) => (
              <SponsorCard key={s.name} index={i} {...s} />
            ))}
          </div>
          <Footer />
        </section>
      </div>
    </>
  );
}
