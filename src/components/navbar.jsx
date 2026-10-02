import { NavLink } from "react-router-dom";
import "./../index.css";

// Single source of truth for the centred navigation links.
const NAV_ITEMS = [
  { label: "Home", link: "/", ariaLabel: "Go to Home" },
  { label: "About", link: "/about-us", ariaLabel: "Go to About" },
  { label: "Team", link: "/team", ariaLabel: "Go to Team" },
  { label: "Register", link: "/register", ariaLabel: "Go to Register" },
  { label: "Contact", link: "/contact-us", ariaLabel: "Go to Contact" },
  { label: "Articles", link: "/articles", ariaLabel: "Go to Articles" },
  { label: "FAQ", link: "/FAQ", ariaLabel: "Go to FAQ" },
  { label: "Resources", link: "/resources", ariaLabel: "Go to Resources" },
  { label: "CLI", link: "/terminal", ariaLabel: "Go to CLI" },
];

export default function Navbar() {
  return (
    <>
      <nav className="navbar_about">
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
      </nav>

      {/* Deliberately outside the <nav>: `mix-blend-mode: difference` on the
          bar blends it as a single group, and a child cannot opt out of its
          parent's blend mode. Sitting here keeps the logo un-inverted while
          the text still inverts. Positioned to match the bar's own geometry
          via the same --navbar-h / padding values. */}
      <NavLink to="/" className="navbar_logo-link" aria-label="VOID Society home">
        <img src="/logo-for-nav.png" alt="VOID Society" className="navbar_logo" />
      </NavLink>
    </>
  );
}
