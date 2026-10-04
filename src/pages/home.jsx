import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./../components/navbar";
import Footer from "./../components/footer";
import { useRef, useState, useEffect } from "react";
import alumni from "./../assets/HS/Alumni.jpg";
import HaosShowcase from "./../components/ui/tech-solutions-hero-section";
import DarkVeil from "./../components/ui/DarkVeil";
import ParticleText from "./../components/ui/ParticleText";
import cyndiaLogo from "./../assets/cyndia.svg";



const COMMUNITY_PARTNERS = [
  {
    name: "Cyndia",
    href: "https://cyndia.in/",
    logo: cyndiaLogo,
    className: "",
  },
  {
    name: "Hackitise Labs",
    href: "https://cert.hackitiselabs.in/",
    logo: "https://ctf.void-society.in/media/sponsor-hackitise-white.png",
    className: "cyndia-card--hackitise",
  },
];

function CommunityPartnerCard({ name, href, logo, className = "" }) {
  const handleMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
  };

  const handleLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <a
      className={`cyndia-card ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="cyndia-card__spot" aria-hidden="true" />
      <div className="cyndia-card__logo">
        <img src={logo} alt={name} loading="lazy" />
      </div>
    </a>
  );
}






function DotSpotlight() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 });
  const containerRef = useRef(null);

  
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const heroSection = document.querySelector(".hero-section");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleTouchMove = (e) => {
      const heroSection = document.querySelector(".hero-section");
      if (heroSection && e.touches[0]) {
        const rect = heroSection.getBoundingClientRect();
        setMousePos({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
      }
    };

    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
      heroSection.addEventListener("mousemove", handleMouseMove);
      heroSection.addEventListener("touchmove", handleTouchMove);
      heroSection.addEventListener("touchstart", handleTouchMove);

      return () => {
        heroSection.removeEventListener("mousemove", handleMouseMove);
        heroSection.removeEventListener("touchmove", handleTouchMove);
        heroSection.removeEventListener("touchstart", handleTouchMove);
      };
    }
  }, []);

  
  const generateDots = () => {
    const dots = [];
    const dotSize = 2;
    const spacing = 25;
    const cols = Math.ceil(screenSize.width / spacing) + 2; 
    const rows = Math.ceil(screenSize.height / spacing) + 2; 

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;
        const distance = Math.sqrt(
          Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2),
        );
        const maxDistance = 120; 
        const opacity = Math.max(0, 1 - distance / maxDistance);

        dots.push(
          <div
            key={`${i}-${j}`}
            className="dot"
            style={{
              left: x,
              top: y,
              backgroundColor:
                opacity > 0.1
                  ? `rgba(59, 130, 246, ${opacity * 0.8})`
                  : "rgba(255, 255, 255, 0.15)",
              width: dotSize,
              height: dotSize,
              boxShadow:
                opacity > 0.3
                  ? `0 0 ${opacity * 10}px rgba(59, 130, 246, ${opacity * 0.5})`
                  : "none",
            }}
          />,
        );
      }
    }
    return dots;
  };

  return (
    <div ref={containerRef} className="dot-spotlight-container">
      {generateDots()}
    </div>
  );
}

function GlowingButton() {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleClick = () => {
    
    const isMobile = window.innerWidth <= 768;

    let targetSection;

    if (isMobile) {
      
      targetSection = document.querySelector(".irc-section");
    } else {
      
      targetSection =
        document.querySelector(".irc-section") ||
        document.querySelector(".achievements-section") ||
        document.querySelector(".kali_svg_div");
    }

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <button
      ref={btnRef}
      className="about-button mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {}
      <span className="hidden md:inline">Get Started</span>
      {}
      <span className="md:hidden">Get started</span>
    </button>
  );
}

const PartnerCard = ({
  name,
  description,
  imageUrl,
  link,
  customClassName = "",
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="partner-card-link"
    >
      <div className={`partner-card ${customClassName}`}>
        <div className="partner-image-container">
          <img
            src={imageUrl}
            alt={`${name} logo`}
            className="partner-image"
            loading="lazy"
          />
        </div>
        <div className="partner-content">
          <h3 className="partner-name">{name}</h3>
          <p className="partner-description">{description}</p>
        </div>
      </div>
    </a>
  );
};
export default function VoidPage() {
  return (
    <div className="">
      <Navbar />

      {


}
      <HaosShowcase
        bg={<DarkVeil speed={0.5} />}
        title={"Enter Into The Cyber\nArena with VOID"}
        subtitle={"Only Cybersecurity and ethical hacking\nclub of KIET Deemed To Be University"}
        statLabel="ETHICAL HACKING"
        statValue="CYBERSECURITY CLUB"
        logoText="VOID"
        logo={
          <ParticleText
            text="VOID"
            particleSize={2.2}
            density={4}
            color="#f8fafc"
            highlightColor="#4DA3FF"
            scatter={190}
            gatherDuration={1600}
            stagger={420}
            pointerRepel={90}
            repelRadius={210}
            idleDrift={0.8}
            trigger="mount"
            fontSize="clamp(6rem, 24vw, 18rem)"
            fontWeight={800}
            fontFamily="inherit"
            glow
          />
        }
      />

      {}
      {

}

      {}
      <section className="irc-section">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center">
          <div className="space-y-6">
            <span className="inline-block rounded-full border border-[#00ffff]/40 bg-[#00ffff]/10 px-4 py-1 text-xs uppercase tracking-widest text-[#00ffff]">
              Community
            </span>
            <h2 className="irc-heading">Join our IRC Channel</h2>
            <p className="mx-auto max-w-2xl text-white/75">
              And be part of our vibrant community. Connect, collaborate, and
              share your passion for cybersecurity with like-minded individuals.
            </p>
            <div>
              <Link
                to="/irc"
                className="inline-flex items-center gap-2 rounded-full bg-[#00ffff] px-8 py-3 font-semibold text-black transition-transform hover:scale-105"
              >
                Open IRC Chat <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {}

      {}
      <section className="alumni-section">
        <h2 className="section-title">Our Alumni Network</h2>
        <p className="section-subtitle">
          From VOID to leading roles in the cybersecurity industry, our alumni
          are making an impact.
        </p>
        <div className="alumni-content">
          <div className="alumni-photo-container">
            <img
              src={alumni}
              alt="VOID Alumni Network"
              className="alumni-group-photo"
              loading="lazy"
            />
          </div>
          <div className="alumni-text-container">
            <h3 className="alumni-subheading">
              Pioneering the Future of Cyber Defense
            </h3>
            <p className="alumni-description">
              Our alumni are a testament to the practical skills and deep
              knowledge gained at VOID. They have secured positions at top tech
              companies, cybersecurity firms, and government agencies, where
              they lead, innovate, and protect. They remain an active part of
              our community, mentoring current students and creating pathways
              for the next generation of cyber defenders.
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="coming-soon-section">
        <div className="coming-soon-shell">
          <h2 className="coming-soon-heading">Commu<span className="cp-wide">n</span><span className="cp-wide">i</span><span className="cp-wide">t</span>y Partners</h2>
        </div>

        <div className="cyndia-showcase">
          {COMMUNITY_PARTNERS.map((partner) => (
            <CommunityPartnerCard key={partner.name} {...partner} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
