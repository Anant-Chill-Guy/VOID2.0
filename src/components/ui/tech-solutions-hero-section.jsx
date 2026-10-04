import React from 'react';
import Shuffle from './Shuffle';


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
  title = 'HAOS Tech Solutions',
  subtitle = 'Brand Concept & Identity',
  statLabel = 'HIGH-QUALITY',
  statValue = 'DEVELOPMENT',
  logoText = 'hAOS',
  logo = null,
  className = '',
}) {
  
  
  const titleLines = String(title).split('\n');
  const subtitleLines = String(subtitle).split('\n');

  return (
    <section
      className={`haos-container ${className}`}
      role="region"
      aria-label="Void tech showcase"
    >
      {}
      {bg && <div className="bg">{bg}</div>}

      <div className="grid-item main-content">
        <h1 className="haos-title">
          {titleLines.map((line, i) => (
            <Shuffle
              key={i}
              tag="span"
              text={line}
              className="haos-title-line font-shuffle"
              textAlign="left"
              {...shuffleProps}
            />
          ))}
        </h1>
        <h2 className="shuffle-subtitle">
          {subtitleLines.map((line, i) => (
            <Shuffle
              key={i}
              tag="span"
              text={line}
              className="haos-subtitle-line font-shuffle"
              textAlign="left"
              {...shuffleProps}
            />
          ))}
        </h2>
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
