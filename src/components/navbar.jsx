import { NavLink } from "react-router-dom";
import "./../index.css";


const NAV_ITEMS = [
  { label: "Home", link: "/", ariaLabel: "Go to Home" },
  { label: "About", link: "/about-us", ariaLabel: "Go to About" },
  { label: "Team", link: "/team", ariaLabel: "Go to Team" },
  { label: "Events", link: "/events", ariaLabel: "Go to Events" },
  { label: "Sponsors", link: "/sponsors", ariaLabel: "Go to Sponsors" },
  { label: "Contact Us", link: "/contact-us", ariaLabel: "Go to Contact Us" },
  { label: "Resources", link: "/resources", ariaLabel: "Go to Resources" },
  { label: "CLI", link: "/terminal", ariaLabel: "Go to CLI" },
];

export default function Navbar() {
  return (
    <>
      <nav className="navbar_about">
        {

}
        <span className="navbar_logo-slot" aria-hidden="true" />

        <ul className="navbar_links">
          {NAV_ITEMS.map((item) => (
            <li key={item.link}>
              {item.external ? (
                <a
                  href={item.link}
                  className="navbar_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.ariaLabel}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink to={item.link} className="navbar_link" end={item.link === "/"}>
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {



}
      <NavLink to="/" className="navbar_logo-link" aria-label="VOID Society home">
        <img src="/logo-for-nav.png" alt="VOID Society" className="navbar_logo" />
      </NavLink>
    </>
  );
}
