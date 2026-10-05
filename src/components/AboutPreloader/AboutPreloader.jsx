import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './AboutPreloader.css';



const TYPE_TEXT = 'ABOUT US ';


const CHAR_STAGGER = 0.13;

const TIMING = {
  hold: 0.55, 
  textFade: 0.35,
  iris: 1.15, 
  zoom: 1.25, 
  tailFade: 0.3, 
};

const HERO_START_SCALE = 1.22;


const TAIL_OFFSET = TIMING.iris - TIMING.tailFade - 0.05;


const viewportRadius = () =>
  Math.hypot(window.innerWidth, window.innerHeight) / 2 + 4;

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;










export default function AboutPreloader({ revealTarget, onDone }) {
  const rootRef = useRef(null);
  const veilRef = useRef(null);
  const lineRef = useRef(null);
  const caretRef = useRef(null);

  
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  
  
  
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

      
      
      const hero = revealTarget?.current || {};

      
      
      
      gsap.to(caret, {
        opacity: 0,
        duration: 0.5,
        ease: 'steps(1)',
        repeat: -1,
        yoyo: true,
      });

      
      
      const iris = { r: 0 };

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => doneRef.current?.(),
      });

      tl
        
        .to('.about-preloader__char', {
          opacity: 1,
          duration: 0.01,
          ease: 'none',
          stagger: CHAR_STAGGER,
        })
        .to({}, { duration: TIMING.hold })
        .to(line, { opacity: 0, duration: TIMING.textFade, ease: 'power2.in' })
        
        
        
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
