import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from './../components/footer';
import { upcomingEvents, pastEvents } from '../data/events';

// three.js is heavy, so the ambient scene loads only with this route.
const EventsScene = lazy(() => import('../components/EventsScene'));

const UPCOMING = upcomingEvents.map((event) => ({ ...event, status: 'upcoming' }));
const PAST = pastEvents.map((event) => ({ ...event, status: 'past' }));

// `order` drives the alternating left/right layout (three on each side).
function EventRow({ event, order, onOpenGallery }) {
  const ref = useRef(null);
  const side = order % 2 === 0 ? 'left' : 'right';

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('is-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 8).toFixed(2)}deg`);
  };

  const handleLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <li
      ref={ref}
      className={`ev-row ev-row--${side}${event.status === 'upcoming' ? ' is-upcoming' : ''}`}
    >
      <span className="ev-connector" aria-hidden="true" />

      <article className="ev-card" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <span className="ev-date">{event.date}</span>

        <h3 className={`ev-name${event.title.length > 26 ? ' ev-name--long' : ''}`}>
          <button
            type="button"
            className="ev-name__link"
            onClick={() => onOpenGallery(event)}
          >
            <span className="ev-name__line">{event.title}</span>
            <span className="ev-name__hint" aria-hidden="true">
              (VIEW PHOTOS)
            </span>
          </button>
        </h3>

        <p className="ev-desc">{event.description}</p>

        {event.link && (
          <a
            className="ev-cta"
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter the CTF <span aria-hidden="true">&rarr;</span>
          </a>
        )}
      </article>

      {/* Preview photo on the opposite side of the divider. */}
      {event.gallery?.length > 0 && (
        <button
          type="button"
          className="ev-preview"
          onClick={() => onOpenGallery(event)}
          aria-label={`View photos from ${event.title}`}
        >
          <img src={event.gallery[0]} alt="" loading="lazy" />
          <span className="ev-preview__badge" aria-hidden="true">
            {event.gallery.length} photo{event.gallery.length > 1 ? 's' : ''}
          </span>
        </button>
      )}
    </li>
  );
}

function Gallery({ data, onClose }) {
  const images = data.gallery ?? [];
  const [index, setIndex] = useState(0);
  const swipe = useRef(null);

  const step = (dir) =>
    setIndex((i) => (images.length ? (i + dir + images.length) % images.length : 0));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, images.length]);

  const onPointerDown = (e) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    if (!swipe.current) return;
    const dx = e.clientX - swipe.current.x;
    const dy = e.clientY - swipe.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    swipe.current = null;
  };

  return (
    <div className="ev-gallery" role="dialog" aria-modal="true" aria-label={data.title} onClick={onClose}>
      <div className="ev-gallery__panel" onClick={(e) => e.stopPropagation()}>
        <header className="ev-gallery__head">
          <h3>{data.title}</h3>
          <button type="button" className="ev-gallery__close" onClick={onClose} aria-label="Close gallery">
            &times;
          </button>
        </header>

        {images.length > 0 ? (
          <div className="ev-slider">
            <div
              className="ev-slider__stage"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {images.length > 1 && (
                <button
                  type="button"
                  className="ev-slider__nav ev-slider__nav--prev"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                >
                  &#8249;
                </button>
              )}

              <div className="ev-slider__frame">
                <img
                  key={index}
                  src={images[index]}
                  alt={`${data.title} — ${index + 1}`}
                  className="ev-slider__img"
                  draggable={false}
                />

                {images.length > 1 && (
                  <span className="ev-slider__counter">
                    {index + 1} / {images.length}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <button
                  type="button"
                  className="ev-slider__nav ev-slider__nav--next"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                >
                  &#8250;
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div className="ev-slider__thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`ev-slider__thumb${i === index ? ' is-active' : ''}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to photo ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="ev-gallery__empty">Photos coming soon.</p>
        )}
      </div>
    </div>
  );
}

function Group({ id, label, items, offset, onOpenGallery }) {
  return (
    <section className="ev-group" aria-labelledby={id}>
      <h2 id={id} className="ev-group__title">
        <span aria-hidden="true" />
        <em>{label}</em>
        <span aria-hidden="true" />
      </h2>
      <ol className="ev-timeline">
        {items.map((event, i) => (
          <EventRow key={event.title} event={event} order={offset + i} onOpenGallery={onOpenGallery} />
        ))}
      </ol>
    </section>
  );
}

export default function Events() {
  const [gallery, setGallery] = useState(null);

  return (
    <>
      <Navbar />

      <div className="events-page">
        <div className="events-bg" aria-hidden="true">
          <Suspense fallback={null}>
            <EventsScene />
          </Suspense>
        </div>
        <div className="events-bg-veil" aria-hidden="true" />

        <header className="ev-hero">
          <h1 className="ev-hero__title">
            <span>Our</span>
            <span>Events</span>
          </h1>
        </header>

        <div className="ev-timeline-wrap">
          <div className="ev-groups">
            <Group id="events-upcoming" label="Upcoming Events" items={UPCOMING} offset={0} onOpenGallery={setGallery} />
            <Group id="events-past" label="Past Events" items={PAST} offset={UPCOMING.length} onOpenGallery={setGallery} />
          </div>
        </div>

        <div className="events-footer">
          <Footer />
        </div>
      </div>

      {gallery && <Gallery data={gallery} onClose={() => setGallery(null)} />}
    </>
  );
}
