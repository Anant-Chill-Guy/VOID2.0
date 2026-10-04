import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from './../components/footer';
import { Book, Video, Code, ExternalLink } from 'lucide-react';
import BlogPostCard from '../components/BlogPostCard';
import { blogPosts } from '../data/blogPosts';


const CATEGORIES = [
  {
    title: 'Documentation',
    icon: Book,
    accent: '#4da3ff',
    resources: [
      {
        name: 'Web Application Security Guide — OWASP WSTG',
        description: 'Learn how real testers find web bugs — the checklist the pros use.',
        link: 'https://owasp.org/www-project-web-security-testing-guide',
      },
      {
        name: 'Beginner’s Guide to Network Scanning — Nmap docs',
        description: 'Discover what a network actually looks like. Map it, don’t break it.',
        link: 'https://nmap.org',
      },
      {
        name: 'Packet Analysis Reference — Wireshark',
        description: 'See the packets your apps whisper. Inspect traffic like a detective.',
        link: 'https://www.wireshark.org/docs/',
      },
    ],
  },
  {
    title: 'Video Tutorials',
    icon: Video,
    accent: '#22d3ee',
    resources: [
      {
        name: 'SQL Injection and XSS Explained',
        description: 'Hands-on lab-style video that makes web hacking readable, safe and fun.',
        link: 'https://tryhackme.com/',
      },
      {
        name: 'Getting Started with Offensive Labs',
        description: 'From zero to CTF — watch how people crack a box and learn the mindset.',
        link: 'https://www.youtube.com/watch?v=jccqNN1jOgE',
      },
      {
        name: 'Wireshark and Network Forensics',
        description: 'Follow packet flows and find the needles in the network haystack.',
        link: 'https://www.youtube.com/watch?v=qTaOZrDnMzQ',
      },
    ],
  },
  {
    title: 'Tools & Scripts',
    icon: Code,
    accent: '#34d399',
    resources: [
      {
        name: 'Burp Suite — web proxy & pentest toolkit',
        description: 'Intercept requests, modify traffic and find the bugs others miss.',
        link: 'https://portswigger.net/burp',
      },
      {
        name: 'John the Ripper — password cracking suite',
        description: 'Crack weak hashes, learn password weaknesses, level up credential audits.',
        link: 'https://github.com/openwall/john',
      },
      {
        name: 'Ghidra — reverse engineering framework',
        description: 'Open binaries, peel back compiled code and see how programs work.',
        link: 'https://github.com/NationalSecurityAgency/ghidra',
      },
    ],
  },
];


function useReveal() {
  const ref = useRef(null);

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
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function Resources() {
  const [active, setActive] = useState(0);
  const heroRef = useReveal();
  const explorerRef = useReveal();
  const articlesRef = useReveal();
  const ctaRef = useReveal();

  const category = CATEGORIES[active];

  return (
    <div className="resources-page">
      <span className="res-aura res-aura--a" aria-hidden="true" />
      <span className="res-aura res-aura--b" aria-hidden="true" />

      <Navbar />

      <div className="resources-inner">
        <header ref={heroRef} className="res-hero is-reveal">
          <h1 className="res-hero__title">Resources</h1>
          <p className="res-hero__sub">
            Curated documentation, tutorials and tools to sharpen your security
            knowledge.
          </p>
        </header>

        <section ref={explorerRef} className="res-explorer is-reveal" aria-label="Resource categories">
          <div className="res-explorer__inner">
            <div className="res-tabs" role="tablist" aria-label="Resource categories">
              {CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.title}
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    className={`res-tab${active === i ? ' is-active' : ''}`}
                    style={{ '--accent': cat.accent }}
                    onClick={() => setActive(i)}
                  >
                    <span className="res-tab__icon">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="res-tab__label">{cat.title}</span>
                    <span className="res-tab__count">
                      {String(cat.resources.length).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="res-panel" key={active} style={{ '--accent': category.accent }}>
              <ul className="res-list">
                {category.resources.map((resource, i) => (
                  <li key={resource.name} className="res-item" style={{ '--i': i }}>
                    <a
                      className="res-item__link"
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="res-item__text">
                        <span className="res-item__name">{resource.name}</span>
                        <span className="res-item__desc">{resource.description}</span>
                      </span>
                      <span className="res-item__arrow" aria-hidden="true">
                        <ExternalLink size={16} strokeWidth={2} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section ref={articlesRef} className="res-articles is-reveal" aria-label="Articles">
          <h2 className="res-section-title">
            <span className="res-section-title__line" aria-hidden="true" />
            <em>Articles</em>
            <span className="res-section-title__line" aria-hidden="true" />
          </h2>
          <div className="res-articles__list">
            {blogPosts.map((post, i) => (
              <BlogPostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </section>

        <div className="res-ethics">
          <p>
            <strong>Ethics line:</strong> Everything we teach is for defensive educational
            purposes only. Only test systems you own or have permission to test.
          </p>
        </div>

        <section ref={ctaRef} className="res-cta is-reveal">
          <h3 className="res-cta__title">Can&apos;t find what you&apos;re looking for?</h3>
          <p className="res-cta__text">
            Request specific resources or contribute your own to help the community grow.
          </p>
          <div className="res-cta__actions">
            <a
              className="res-btn res-btn--primary"
              href="https://forms.gle/wKwhjGEu7fsNK2Ny5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Request Resource
            </a>
            <a
              className="res-btn"
              href="https://forms.gle/wKwhjGEu7fsNK2Ny5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
