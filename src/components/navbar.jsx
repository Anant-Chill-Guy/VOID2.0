import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import StaggeredMenu from "./../components/StaggeredMenu/StaggeredMenu";
import "./../index.css";

// Single source of truth: the centred desktop links and the drawer use the
// same list, so the two can never drift apart.
const NAV_ITEMS = [
  { label: "Home", link: "/", ariaLabel: "Go to Home" },
  { label: "About", link: "/about-us", ariaLabel: "Go to About" },
  { label: "Register", link: "/register", ariaLabel: "Go to Register" },
  { label: "Contact", link: "/contact-us", ariaLabel: "Go to Contact" },
  { label: "Blogs", link: "/blogs", ariaLabel: "Go to Blogs" },
  { label: "FAQ", link: "/FAQ", ariaLabel: "Go to FAQ" },
  { label: "Resources", link: "/resources", ariaLabel: "Go to Resources" },
  { label: "CLI", link: "/terminal", ariaLabel: "Go to CLI" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Close the drawer on an outside click. StaggeredMenu's built-in click-away
  // is disabled because it only recognises its own toggle button, not this
  // bar's — so closing is handled here against the bar and the drawer panel.
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event) => {
      if (navRef.current?.contains(event.target)) return;
      const panel = document.getElementById("staggered-menu-panel");
      if (panel?.contains(event.target)) return;
      setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar_about" ref={navRef}>
        {/* Empty slot occupying the grid's first column so the link group
            stays optically centred. The real logo renders outside this
            element — see below. */}
        <span className="navbar_logo-slot" aria-hidden="true" />

        <ul className="navbar_links">
          {NAV_ITEMS.map((item) => (
            <li key={item.link}>
              <NavLink to={item.link} className="navbar_link" end={item.link === "/"}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`navbar_toggle${menuOpen ? " navbar_toggle--open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="staggered-menu-panel"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar_toggle-bar" />
          <span className="navbar_toggle-bar" />
          <span className="navbar_toggle-bar" />
        </button>
      </nav>

      {/* Deliberately outside the <nav>: `mix-blend-mode: difference` on the
          bar blends it as a single group, and a child cannot opt out of its
          parent's blend mode. Sitting here keeps the logo un-inverted while
          the text still inverts. Positioned to match the bar's own geometry
          via the same --navbar-h / padding values. */}
      <NavLink to="/" className="navbar_logo-link" aria-label="VOID Society home">
        <img src="/logo-for-nav.png" alt="VOID Society" className="navbar_logo" />
      </NavLink>

      <StaggeredMenu
        className="navbar-staggered"
        logoUrl="/logo-for-nav.png"
        position="right"
        items={NAV_ITEMS}
        displaySocials={false}
        displayItemNumbering={false}
        accentColor="#3b82f6"
        menuButtonColor="#e5e7eb"
        openMenuButtonColor="#ffffff"
        colors={["#15151c", "#1b1b24", "#23232e", "#0e0e13"]}
        isFixed
        closeOnClickAway={false}
        open={menuOpen}
        onOpenChange={setMenuOpen}
      />
    </>
  );
}
