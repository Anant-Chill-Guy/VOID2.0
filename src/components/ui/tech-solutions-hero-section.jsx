import React from 'react';
import Shuffle from './Shuffle';

// Shared Shuffle config for the hero text slots
const shuffleProps = {
  shuffleDirection: 'right',
  duration: 0.35,
  animationMode: 'evenodd',
  shuffleTimes: 1,
  ease: 'power3.out',
  stagger: 0.03,
  threshold: 0.1,
  triggerOnce: true,
  triggerOnHover: true,
  respectReducedMotion: true,
  loop: false,
  loopDelay: 0,
};

export default function HaosShowcase({
  bg = null,
  category = 'CATEGORY',
  year = 'YEAR',
  solutionLabel = 'TECH SOLUTIONS',
  solutionValue = 'AUTOMATION & ROBOTICS',
  title = 'HAOS Tech Solutions',
  subtitle = 'Brand Concept & Identity',
  statLabel = 'HIGH-QUALITY',
  statValue = 'DEVELOPMENT',
  logoText = 'hAOS',
  logo = null,
  className = '',
}) {
  return (
    <section
      className={`haos-container ${className}`}
      role="region"
      aria-label="Haos Tech Solutions showcase"
    >
      {/* bg slot */}
      {bg && <div className="bg">{bg}</div>}

      <div className="grid-item top-left">
        <span className="label">{category}</span>
        <span className="value">{solutionValue}</span>
      </div>

      <div className="grid-item top-center">
        <span className="label">YEAR</span>
        <span className="value">{year}</span>
      </div>

      <div className="grid-item top-right">
        <span className="label">{solutionLabel}</span>
        <span className="value">{solutionValue}</span>
      </div>

      <div className="grid-item main-content">
        <Shuffle tag="h1" text={title} className="shuffle-title font-shuffle" textAlign="left" {...shuffleProps} />
        <Shuffle tag="h2" text={subtitle} className="shuffle-subtitle font-shuffle" textAlign="left" {...shuffleProps} />
        <div className="stats-block">
          <span className="label">
            <Shuffle tag="span" text={statLabel} className="shuffle-label font-shuffle" textAlign="left" {...shuffleProps} />
          </span>
          <div className="value">
            <Shuffle tag="div" text={statValue} className="shuffle-value font-shuffle" textAlign="left" {...shuffleProps} />
          </div>
        </div>
      </div>

      <div className="grid-item center-logo">
        {logo ? logo : <div className="haos-logo">{logoText}</div>}
      </div>
    </section>
  );
}
