import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import AboutPreloader from '../components/AboutPreloader/AboutPreloader';
import GridPulse from '../components/GridPulse/GridPulse';
import Navbar from '../components/navbar';
import './../index.css';
import Footer from "./../components/footer";
// The intro plays once per browser session — navigating away and back to About
// later in the same tab should not re-run it.
const PRELOADER_SEEN_KEY = 'void:about-preloader-seen';

// sessionStorage throws in some privacy modes; fall back to playing the intro.
const hasSeenPreloader = () => {
  try {
    return sessionStorage.getItem(PRELOADER_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const markPreloaderSeen = () => {
  try {
    sessionStorage.setItem(PRELOADER_SEEN_KEY, '1');
  } catch {
    // Best-effort only: without storage the intro simply replays.
  }
};

// Custom Hook for observing elements and adding a 'visible' class
const useAnimateOnScroll = (options) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return ref;
};

// Line-art glyphs for the capability cards. Drawn on a shared 24x24 grid at one
// stroke weight so the three read as a set — the emoji they replace did not.
const FEATURE_ICONS = {
  reticle: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 1.5v5M12 17.5v5M1.5 12h5M17.5 12h5" />
      <circle cx="12" cy="12" r="1.6" className="feature-icon__dot" />
    </>
  ),
  terminal: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="1.5" />
      <path d="M6.5 9.5l3 3-3 3M13 15.5h4.5" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="4.8" r="2.6" />
      <circle cx="4.8" cy="18.5" r="2.6" />
      <circle cx="19.2" cy="18.5" r="2.6" />
      <path d="M10.3 7.1 6.5 15.9M13.7 7.1l3.8 8.8M7.4 18.5h9.2" />
    </>
  ),
};

const FeatureIcon = ({ name }) => (
  <svg
    className="feature-icon__glyph"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    aria-hidden="true"
  >
    {FEATURE_ICONS[name]}
  </svg>
);

const FeatureCard = ({ icon, tag, title, description, index, accent }) => {
  // Pointer-tracked 3D tilt; the card stays flat without a pointer.
  const handleMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 8).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`);
  };

  const handleLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      className="feature-card"
      style={{ '--i': index, '--accent': accent }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="feature-card__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="feature-icon">
        <FeatureIcon name={icon} />
      </div>

      <p className="feature-card__tag">{tag}</p>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-card__body">{description}</p>
    </article>
  );
};

// Renders a word as one span per letter so CSS can spread/space the letters.
// rotateChar marks a single letter to be flipped upside down (design accent).
const WordLetters = ({ text, rotateChar }) =>
  text.split('').map((ch, i) => (
    <span
      key={i}
      className={`about-hero-wordmark__letter${ch === rotateChar ? ' about-hero-wordmark__letter--flip' : ''}`}
    >
      {ch}
    </span>
  ));

export default function AboutUs() {
  const heroRef = useAnimateOnScroll({ threshold: 0.5, triggerOnce: true });
  const [showPreloader, setShowPreloader] = useState(() => !hasSeenPreloader());

  const handlePreloaderDone = useCallback(() => {
    markPreloaderSeen();
    setShowPreloader(false);
  }, []);

  // Scroll scrub for the hero: ABOUT US slides right, VOID SOCIETY slides
  // left, and the intro fades — tied to live scroll position so it moves
  // forward when scrolling down and reverses when scrolling up.
  const heroScroll = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = heroRef.current;
      if (!el) return;
      // 0 = hero fully on screen, 1 = hero fully scrolled past.
      const p = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / el.offsetHeight));
      heroScroll.set(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [heroRef, heroScroll]);

  const topX = useTransform(heroScroll, [0, 1], ['0vw', '42vw']);
  const bottomX = useTransform(heroScroll, [0, 1], ['0vw', '-42vw']);
  const introOpacity = useTransform(heroScroll, [0, 0.3], [1, 0]);
  const philosophyRef = useAnimateOnScroll({ threshold: 0.4, triggerOnce: true });
  const featuresHeaderRef = useAnimateOnScroll({ threshold: 0.5, triggerOnce: true });

  const features = [
    { icon: 'reticle', accent: '#4da3ff', tag: '// offense + defense', title: 'CTF Challenges', description: 'Engage in real-world scenarios and sharpen your offensive and defensive security skills.' },
    { icon: 'terminal', accent: '#22d3ee', tag: '// training', title: 'Workshops & Training', description: 'Learn from industry experts through hands-on workshops on the latest tools and techniques.' },
    { icon: 'network', accent: '#a78bfa', tag: '// network', title: 'Community & Networking', description: 'Connect with peers, mentors, and professionals in the cybersecurity field.' }
  ];

  return (
    <div className="about-page">
      {showPreloader && (
        <AboutPreloader revealTarget={heroRef} onDone={handlePreloaderDone} />
      )}
          <Navbar />
      <div className="about-us-page">
        <section ref={heroRef} className="about-hero fade-in">
          <h1 className="about-hero-wordmark" aria-label="ABOUT US VOID SOCIETY">
            <motion.span
              className="about-hero-wordmark__word about-hero-wordmark__word--top"
              style={{ x: topX, y: '-0.13em' }}
            >
              <WordLetters text="ABOUT US" rotateChar="A" />
            </motion.span>
            <motion.span
              className="about-hero-wordmark__word about-hero-wordmark__word--bottom"
              style={{ x: bottomX, y: '0.13em' }}
            >
              <WordLetters text="VOID SOCIETY" />
            </motion.span>
          </h1>
          <motion.div className="about-hero-intro" style={{ opacity: introOpacity }}>
            <h2 className="about-hero-intro-title">We are the architects of the digital frontier.</h2>
            <p className="about-hero-intro-sub">Exploring the depths of cyberspace to build a more secure future.</p>
          </motion.div>
          <span className="about-hero-circle" aria-hidden="true" />
        </section>

        <section ref={philosophyRef} className="about-section about-philosophy fade-in-up">
          <h2 className="section-title">Our Philosophy</h2>
          <p className="section-content">
        VOID Society, under the Centre of Excellence, is our institute’s dedicated cybersecurity club driven entirely by students. We go beyond textbooks by teaching and exploring real-world skills such as Linux, networking, ethical hacking, OSINT, penetration testing, and digital forensics. Our members learn through hands-on bootcamps, capture-the-flag challenges, workshops, and awareness campaigns, making cybersecurity both practical and exciting. We also host Null Chapter meetups and collaborate with industry professionals, creating direct pathways for internships and jobs. At VOID, students build, break, secure, and grow together as part of an active, ever-learning cybersecurity community.
          </p>
        </section>

        <section className="about-section features-section">
          {/* Full-bleed: the section is capped at 1200px, so the pulse is
              broken out with the same 50% / -50vw trick the section's own
              background layers use. */}
          <GridPulse
            reach={6}
            maxLit={340}
            style={{ left: '50%', right: 'auto', width: '100vw', marginLeft: '-50vw' }}
          />
          <h2 ref={featuresHeaderRef} className="section-title fade-in-up">What We Do</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard key={index} index={index} {...feature} />
            ))}
          </div>
        </section>
      </div>
          <Footer />
    </div>
  );
}
