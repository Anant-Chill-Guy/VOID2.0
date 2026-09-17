import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './AboutPreloader.css';

// Trailing space keeps the caret clear of the T, so the caret itself reads as
// the "_" in "ABOUT _".
const TYPE_TEXT = 'ABOUT ';

// Seconds per character. Everything else is derived so the cadence stays put.
const CHAR_STAGGER = 0.13;

const TIMING = {
  hold: 0.55, // read pause once the line is complete
  textFade: 0.35,
  iris: 1.15, // veil opening out to the corners
  zoom: 1.25, // hero settling out of its zoom
  tailFade: 0.3, // dissolves any sliver left at the screen corners
};

const HERO_START_SCALE = 1.22;

// Where the tail fade begins, measured from the start of the iris.
const TAIL_OFFSET = TIMING.iris - TIMING.tailFade - 0.05;

// Radius that clears the viewport corners from the centre.
const viewportRadius = () =>
  Math.hypot(window.innerWidth, window.innerHeight) / 2 + 4;

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * About-page intro. Plays once per mount and calls `onDone` when the live page
 * is fully revealed.
 *
 * @param revealTarget ref to the element the iris zoom scales (the hero). Its
 *   own CSS transitions are suspended for the duration so they cannot damp the
 *   per-frame transform GSAP writes.
 * @param onDone called once the overlay has finished and can be unmounted.
 */
export default function AboutPreloader({ revealTarget, onDone }) {
  const rootRef = useRef(null);
  const veilRef = useRef(null);
  const lineRef = useRef(null);
  const caretRef = useRef(null);

  // The parent re-creates `onDone` each render; a ref keeps the timeline stable.
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Hold the page still for the duration of the intro. Both locks are lifted
  // while the page is at scroll position 0, so the unlocked layout is identical
  // to the pre-lock layout and nothing shifts when the overlay goes away.
  useEffect(() => {
    if (prefersReducedMotion()) {
      doneRef.current?.();
      return undefined;
    }

    const hero = revealTarget?.current;
    const html = document.documentElement;
    const { body } = document;
    const prevOverflow = html.style.overflow;
    const prevPadding = body.style.paddingRight;
    const prevHeroTransition = hero?.style.transition ?? '';
    const scrollbar = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    if (hero) hero.style.transition = 'none';

    return () => {
      html.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      if (hero) hero.style.transition = prevHeroTransition;
    };
  }, [revealTarget]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const root = rootRef.current;
      const veil = veilRef.current;
      const line = lineRef.current;
      const caret = caretRef.current;
      if (!root || !veil || !line || !caret) return;

      // A plain object stands in when there is no reveal target, so the hero
      // tweens stay unconditional and simply animate a throwaway holder.
      const hero = revealTarget?.current || {};

      // Hard on/off blink: `steps(1)` toggles instantly instead of fading.
      // Deliberately not inside the timeline — an infinite child would make
      // the parent infinite and `onComplete` would never fire.
      gsap.to(caret, {
        opacity: 0,
        duration: 0.5,
        ease: 'steps(1)',
        repeat: -1,
        yoyo: true,
      });

      // Proxy for the iris radius: the mask reads it back through `--hole`, so
      // the tween never depends on GSAP parsing a CSS custom property.
      const iris = { r: 0 };

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => doneRef.current?.(),
      });

      tl
        // Type the line on, one character at a time.
        .to('.about-preloader__char', {
          opacity: 1,
          duration: 0.01,
          ease: 'none',
          stagger: CHAR_STAGGER,
        })
        .to({}, { duration: TIMING.hold })
        .to(line, { opacity: 0, duration: TIMING.textFade, ease: 'power2.in' })
        // Open the veil from the centre while the hero settles out of its zoom.
        // The hero is scaled before the first pixels show, so the page surfaces
        // already moving rather than snapping to size once visible.
        .set(hero, { scale: HERO_START_SCALE, transformOrigin: '50% 50%' })
        .to(iris, {
          r: viewportRadius,
          duration: TIMING.iris,
          ease: 'power3.inOut',
          onUpdate: () => {
            veil.style.setProperty('--hole', `${iris.r}px`);
          },
        })
        .to(hero, { scale: 1, duration: TIMING.zoom, ease: 'power3.out' }, '<')
        .to(root, { opacity: 0, duration: TIMING.tailFade, ease: 'power1.out' }, `<${TAIL_OFFSET}`);
    },
    { scope: rootRef, dependencies: [] }
  );

  return (
    <div ref={rootRef} className="about-preloader" aria-hidden="true">
      <div ref={veilRef} className="about-preloader__veil" />

      <span ref={lineRef} className="about-preloader__line">
        {TYPE_TEXT.split('').map((char, i) => (
          <span key={i} className="about-preloader__char">
            {char}
          </span>
        ))}
        <span ref={caretRef} className="about-preloader__caret" />
      </span>
    </div>
  );
}
