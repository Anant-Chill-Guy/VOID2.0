import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./../components/navbar";
import Footer from "./../components/footer";
import { useRef, useState, useEffect } from "react";
import breach from "./../assets/HS/achievements/Breacheverse.jpg";
import nullkiet from "./../assets/HS/achievements/Null-Ghaziabad.jpg";
import nullmeetup from "./../assets/HS/achievements/Null-meetup.jpg";
import school from "./../assets/HS/achievements/School.jpg";
import LinuxBootcamp from "./../assets/HS/achievements/LinuxBootcamp.jpg";
import alumni from "./../assets/HS/Alumni.jpg";
import rnb from "./../assets/achievements/RednBlue.webp";
import Secure from "./../assets/achievements/CyberSecure.webp";
import AccordionGallery from "./../components/ui/AccordionGallery/AccordionGallery";
import CircularGallery from "./../components/ui/CircularGallery/CircularGallery";
import HaosShowcase from "./../components/ui/tech-solutions-hero-section";
import DarkVeil from "./../components/ui/DarkVeil";
import ParticleText from "./../components/ui/ParticleText";




const achievementItems = [
  {
    image: rnb,
    link: "#",
    title: "RED N BLUE — Grand Finale of CyberSecureX1.0",
    description:
      "The VOID Society, under the guidance of the CSE Department at KIET Group of Institutions, hosted RED N BLUE, a 24-hour offline CTF where the top 10 teams from online qualifiers battled in a real-world cyber range with live servers and firewalls. Inspired by a Resident Evil–themed storyline, Red Teams hacked into Umbrella Corp’s systems to stop a nuclear threat while Blue Teams defended critical networks against intrusions. With nonstop action, teamwork, and incident response, this became one of India’s first large-scale offline CTFs — an immersive cyber experience that tested skill, strategy, and resilience.",
  },
  {
    image: nullkiet,
    link: "#",
    title: "Null – Ghaziabad Chapter at KIET",
    description:
      "Null is India’s largest open security community, and we are proud to operate its Ghaziabad Chapter in collaboration with our Centre of Excellence (COE). The chapter serves as a vibrant platform that connects students, faculty, and industry professionals through regular meetups and interactive sessions. These gatherings focus on the latest cybersecurity trends, real-world case studies, and occasionally even discussions on recently discovered CVEs, ensuring participants stay updated with industry practices. The initiative has created a valuable bridge between academia and industry, opening doors for internships and job opportunities for our students while fostering collaboration across the cybersecurity community. The very first event of the Null Ghaziabad Chapter was a resounding success, attracting more than 100 participants from outside the college.",
  },
  {
    image: nullmeetup,
    link: "#",
    title: "Null Meetup 2024–25",
    description:
      "As part of the 2024–25 session, we successfully hosted the next Null Meetup under the Ghaziabad Chapter. The event featured insightful sessions by Dr. D3 and Youghal Pathak, two highly respected figures in the Indian cybersecurity space and contributors to the Government of India’s cybersecurity initiatives. Their expertise and real-world perspectives provided participants with valuable knowledge on evolving threats and defensive strategies. Adding to the significance of the meetup, the founders of Hackitise Labs were also present, creating an excellent opportunity for students and professionals to interact directly with leading innovators in the field.",
  },
  {
    image: breach,
    link: "#",
    title: "Breachverse Bootcamp",
    description:
      "The Breachverse Bootcamp was a successfully organized paid program focused on introducing first-year students to the world of Ethical Hacking. With over 50 enthusiastic participants, the bootcamp provided a strong foundation in real-world hacking techniques, delivered through practical and hands-on demonstrations. The sessions were conducted by the Coordinator of our Centre of Excellence, ensuring that students received expert guidance and exposure to industry-relevant practices.",
  },
  {
    image: LinuxBootcamp,
    link: "#",
    title: "Linux Bootcamp – September 2024",
    description:
      "In September 2024, we organized a Linux Bootcamp designed to take participants from the basics to advanced concepts in system usage and administration. The bootcamp was conducted by the Coordinators of our Centre of Excellence, ensuring expert guidance and a structured learning experience. With 50 registered participants, the program offered hands-on exposure to essential Linux commands, shell scripting, system management, and advanced features that are vital for both developers and cybersecurity enthusiasts.",
  },
  {
    image: Secure,
    link: "#",
    title: "Ethical Hacking Bootcamp – June 2025",
    description:
      "As part of the CyberSecureX event organized by the CSE Department, our Centre of Excellence successfully conducted an Ethical Hacking Bootcamp in June 2025. What made this initiative unique was that it was entirely managed by students, showcasing their organizational and technical capabilities. The bootcamp received an overwhelming response with 100+ paid registrations, making it one of our most impactful training events.",
  },
  {
    image: school,
    link: "#",
    title: "Awareness Campaign – 5 Schools",
    description:
      "Our Centre of Excellence conducted a Cyber Awareness Campaign across five schools in the region, reaching out to over 200+ students. The sessions were designed to be interactive and age-appropriate, covering essential topics such as safe internet practices, protection against cyberbullying, responsible use of social media, and recognizing online scams. The initiative not only educated young students on digital safety but also sparked curiosity about cybersecurity as a career path.",
  },
];

// Accordion items derived from achievements for the AccordionGallery section
const accordionItems = achievementItems.map(
  ({ image, title, description }) => ({
    image,
    label: title,
    link: "#",
    description,
  }),
);

// Items for the mobile CircularGallery (short labels under each image)
const circularItems = [
  { image: rnb, text: "RED N BLUE" },
  { image: nullkiet, text: "Null Ghaziabad" },
  { image: nullmeetup, text: "Null Meetup" },
  { image: breach, text: "Breachverse" },
  { image: LinuxBootcamp, text: "Linux Bootcamp" },
  { image: Secure, text: "Ethical Hacking" },
  { image: school, text: "Awareness" },
];

// Media query hook — true when the viewport matches the query
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// Dot Spotlight Component
function DotSpotlight() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState({ width: 1200, height: 800 });
  const containerRef = useRef(null);

  // Update screen size on mount and resize
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

  // Listen for mouse/touch events on the entire hero section
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

  // Generate dot grid based on actual screen size
  const generateDots = () => {
    const dots = [];
    const dotSize = 2;
    const spacing = 25;
    const cols = Math.ceil(screenSize.width / spacing) + 2; // +2 for buffer
    const rows = Math.ceil(screenSize.height / spacing) + 2; // +2 for buffer

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;
        const distance = Math.sqrt(
          Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2),
        );
        const maxDistance = 120; // spotlight radius
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

    // update CSS variables dynamically
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleClick = () => {
    // detect if user is on mobile
    const isMobile = window.innerWidth <= 768;

    let targetSection;

    if (isMobile) {
      // scroll to mobile features first
      targetSection = document.querySelector(".irc-section");
    } else {
      // desktop fallback → IRC → Achievements → Kali SVG
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
      {/* Desktop label */}
      <span className="hidden md:inline">Get Started</span>
      {/* Mobile label */}
      <span className="md:hidden">Get started</span>
    </button>
  );
}

// (RegisterButton removed — registrations not shown on home page)
const AchievementCard = ({ title, description, imageUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleShowMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="achievement-card">
      <img
        src={imageUrl}
        alt={title}
        className="achievement-image"
        loading="lazy"
      />
      <div className="achievement-content">
        <h3 className="achievement-title">{title}</h3>
        <p
          className={`achievement-description ${isMobile ? (isExpanded ? "expanded" : "truncated") : ""}`}
        >
          {description}
        </p>
        {/* Only show more/less button on mobile phones */}
        {isMobile && (
          <button className="show-more-btn" onClick={toggleShowMore}>
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
};

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
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="">
      <Navbar />

      {/* Hero Section — Tech Solutions Showcase (redesign in progress).
          The black/grey look is applied in index.css (.haos-container .bg
          canvas + ::after), not here: hueShift only rotates hue around the
          YIQ chroma plane and cannot desaturate the shader, so it is omitted. */}
      <HaosShowcase
        bg={<DarkVeil speed={0.5} />}
        category="VOID SOCIETY"
        year="2026"
        solutionLabel="TECH"
        solutionValue="CYBERSECURITY"
        title="Enter into the Cyber Arena with VOID"
        subtitle="Only Cybersecurity and ethical hacking club of KIET Group of Institutions."
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
            pointerRepel={42}
            repelRadius={120}
            idleDrift={0.8}
            trigger="mount"
            fontSize="clamp(3.5rem, 13vw, 9rem)"
            fontWeight={800}
            fontFamily="inherit"
            glow
          />
        }
      />

      {/* testing tailwind */}
      {/* <div className="bg-blue-500 text-green-500 p-4 m-4 rounded-lg shadow-lg">
  This div should have a blue background, white text, padding, margin, rounded corners, and a shadow if Tailwind is working correctly.
</div> */}

      {/* IRC Section */}
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
      {/* let it deploy */}

      {/* Achievements Section */}
      <section className="achievements-section">
        <h2 className="section-title">Our Events</h2>
        <p className="section-subtitle">
          Recognized for excellence and innovation in cybersecurity solutions.
        </p>
        <div style={{ position: "relative" }}>
          {isMobile ? (
            <div style={{ height: "520px", position: "relative" }}>
              <CircularGallery
                items={circularItems}
                bend={1}
                textColor="#ffffff"
                borderRadius={0.05}
                font="bold 26px Orbitron"
                scrollSpeed={2}
                scrollEase={0.05}
              />
            </div>
          ) : (
            <AccordionGallery
              items={accordionItems}
              defaultIndex={2}
              expandRatio={0.52}
              trigger="hover"
              accentColor="#00ffff"
              overlayColor="#060010"
              textColor="#ffffff"
              grayscale
              showLabels
              duration={0.6}
              ease="power3.out"
              parallax={0.5}
              tilt={8}
              stagger={0.06}
              height={460}
              gap={10}
              radius={16}
              orientation="horizontal"
            />
          )}
        </div>
      </section>

      {/* Alumni Network Section */}
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

      <section className="coming-soon-section">
        <div className="coming-soon-shell">
          <h2 className="coming-soon-heading">Community Partners</h2>
          <h3 className="coming-soon-title">COMING SOON</h3>
        </div>
      </section>
      <Footer />
    </div>
  );
}
