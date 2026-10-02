import React, { Suspense, useState } from "react";
import RegisterHeader from "../components/RegisterHeader";
import DarkVeil from "../components/ui/DarkVeil";
import Shuffle from "../components/ui/Shuffle";
import DecryptedText from "../components/ui/DecryptedText";
import { isRegisterOnlyHost } from "../registerHost";

// Navbar/Footer pull in GSAP, the dock and the staggered menu — not needed on
// the register-only subdomain, so lazy-load them and never fetch them there.
const Navbar = React.lazy(() => import("../components/navbar"));
const Footer = React.lazy(() => import("../components/footer"));

// Registrations for the current cycle are closed. Flip this to `true` to bring
// the form back; the page then shows a "registrations are over" notice instead.
const REGISTRATIONS_OPEN = false;

const ACCOMMODATIONS = ["Hosteller", "Outside"];

const JOIN_GROUP_OPTIONS = ["Yes", "No"];

const YEARS = ["1st Year", "2nd Year"];

const DOMAINS = [

  "Cyber Security [All Domain]",
  "Web Development",
  "Machine Learning",
  "Graphic Designing",
  "Video Editing",
];

// Registrants may rank up to 3 preferred domains (order = preference).
const MAX_DOMAINS = 3;

const BRANCHES = [
  { code: "CSE", label: "CSE — Computer Science & Engineering" },
  { code: "CS", label: "CS — Computer Science" },
  { code: "CSE (AI)", label: "CSE (AI) — Computer Science & Engineering (Artificial Intelligence)" },
  { code: "CSE (AI & ML)", label: "CSE (AI & ML) — Computer Science & Engineering (Artificial Intelligence & Machine Learning)" },
  { code: "IT", label: "IT — Information Technology" },
  { code: "CSIT", label: "CSIT — Computer Science & Information Technology" },
  { code: "CSE (DS)", label: "CSE (DS) — Computer Science & Engineering (Data Science)" },
  { code: "CSE (CS)", label: "CSE (CS) — Computer Science & Engineering (Cyber Security)" },
  { code: "ECE", label: "ECE — Electronics & Communication Engineering" },
  { code: "EEE", label: "EEE — Electrical & Electronics Engineering" },
  { code: "EC", label: "EC — Electrical & Computer Engineering" },
  { code: "ECE (VLSI)", label: "ECE (VLSI) — Electronics & Communication Engineering (VLSI Design & Technology)" },
  { code: "ME", label: "ME — Mechanical Engineering" },
  { code: "AMIA", label: "AMIA — Advanced Mechatronics & Industrial Automation" },
  { code: "MBA", label: "MBA — Master of Business Administration" },
  { code: "MCA", label: "MCA — Master of Computer Applications" },
];

const CheckmarkIcon = () => (
  <svg className="register-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="register-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
    <path className="register-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
);

const initialState = {
  name: "",
  branch: "",
  year: "",
  email: "",
  whatsapp: "",
  accommodation: "",
  joinGroup: "",
  domains: [],
};

export default function Register() {
  // On register.void-society.in show only the VOID logo (no site nav) and drop
  // the footer so visitors cannot navigate to the rest of the site.
  const registerOnly = isRegisterOnlyHost();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Toggle a preferred domain. Selected order = preference (1 = top pick).
  const toggleDomain = (domain) => {
    setForm((prev) => {
      if (prev.domains.includes(domain)) {
        return { ...prev, domains: prev.domains.filter((d) => d !== domain) };
      }
      if (prev.domains.length >= MAX_DOMAINS) return prev;
      return { ...prev, domains: [...prev.domains, domain] };
    });
    setErrors((prev) => ({ ...prev, domains: undefined }));
  };

  const validateEmail = (value) => {
    const email = value.trim();
    if (!email) return "KIET email is required.";
    if (!/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(email)) return "Enter a valid email address.";
    if (!/@kiet\.edu$/i.test(email)) return "Only @kiet.edu email addresses are allowed.";
    return undefined;
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.branch) errs.branch = "Select your branch.";
    if (!form.year) errs.year = "Select your year.";
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.whatsapp.trim()) {
      errs.whatsapp = "WhatsApp number is required.";
    } else if (!/^\+?[\d\s-]{10,15}$/.test(form.whatsapp.trim())) {
      errs.whatsapp = "Enter a valid WhatsApp number.";
    }
    if (!form.accommodation) errs.accommodation = "Select your mode of accommodation.";
    if (form.domains.length === 0) errs.domains = "Select at least one domain.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          branch: form.branch,
          year: form.year,
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          accommodation: form.accommodation,
          domains: form.domains,
        }),
      });

      if (res.status === 409) {
        const body = await res.json().catch(() => ({}));
        setErrors((prev) => ({ ...prev, email: body.errors?.email || "This email is already registered." }));
        return;
      }
      if (res.status === 422) {
        const body = await res.json().catch(() => ({}));
        setErrors(body.errors || {});
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
    setSubmitted(false);
    setServerError("");
    setSubmitting(false);
  };

  return (
    <>
      <Suspense fallback={null}>
        {registerOnly ? <RegisterHeader /> : <Navbar />}
      </Suspense>
      <div className={registerOnly ? "register-page register-page--standalone" : "register-page"}>
        <div className="register-bg">
          <DarkVeil hueShift={40} noiseIntensity={0.25} scanlineIntensity={0.15} speed={0.45} />
        </div>

        <div className="register-content">
          <section className="register-hero">
            <p className="register-hero-kicker">
              <DecryptedText text="// VOID SOCIETY · REGISTRATION" speed={35} />
            </p>
            <h1 className="register-hero-title">
              <Shuffle
                tag="h1"
                text={REGISTRATIONS_OPEN ? "JOIN THE VOID" : "REGISTRATION"}
                className="font-shuffle"
                textAlign="center"
                shuffleDirection="up"
                duration={0.4}
                stagger={0.04}
                shuffleTimes={1}
              />
            </h1>
            {REGISTRATIONS_OPEN && (
              <p className="register-hero-subtitle">
                <DecryptedText
                  text="Enter the arena. Secure your slot in the only cybersecurity club of KIET."
                  speed={28}
                  sequential={false}
                />
              </p>
            )}
          </section>

          <div className="register-grid">
            {!REGISTRATIONS_OPEN ? (
              <div className="register-form-card reg-step register-closed-card">
                <span className="register-closed-card__bracket register-closed-card__bracket--tl" aria-hidden="true" />
                <span className="register-closed-card__bracket register-closed-card__bracket--tr" aria-hidden="true" />
                <span className="register-closed-card__bracket register-closed-card__bracket--bl" aria-hidden="true" />
                <span className="register-closed-card__bracket register-closed-card__bracket--br" aria-hidden="true" />
                <div className="register-closed">
                  <span className="register-closed__mark" aria-hidden="true">✕</span>
                  <h2>Registrations are closed</h2>
                  <p>Registrations are over for this year.</p>
                </div>
              </div>
            ) : submitted ? (
              <div className="register-form-card reg-step">
                <div className="register-success">
                  <CheckmarkIcon />
                  <h2>Registration Submitted</h2>
                  <p>
                    Welcome to the void. Our team will add you to the group shortly.
                  </p>
                  <button type="button" className="register-submit" onClick={handleReset}>
                    Register Another
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="register-form-card reg-step">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="reg-section">
                      <div className="reg-section-header">
                        <span className="reg-section-index">01</span>
                        <h3 className="reg-section-title">Personal Information</h3>
                      </div>

                      <div className="reg-field">
                        <label className="reg-label" htmlFor="name">Name</label>
                        <input
                          className="reg-input"
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={handleChange}
                        />
                        {errors.name && <span className="reg-error">{errors.name}</span>}
                      </div>

                      <div className="reg-field">
                        <label className="reg-label" htmlFor="branch">Branch</label>
                        <select
                          className="reg-select"
                          id="branch"
                          name="branch"
                          value={form.branch}
                          onChange={handleChange}
                        >
                          <option value="">Select Branch</option>
                          {BRANCHES.map((b) => (
                            <option key={b.code} value={b.code}>{b.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="reg-field">
                        <label className="reg-label" htmlFor="year">Year</label>
                        <select
                          className="reg-select"
                          id="year"
                          name="year"
                          value={form.year}
                          onChange={handleChange}
                        >
                          <option value="">Select Year</option>
                          {YEARS.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        {errors.year && <span className="reg-error">{errors.year}</span>}
                      </div>

                      <div className="reg-field">
                        <label className="reg-label" htmlFor="email">KIET Email ID</label>
                        <input
                          className="reg-input"
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@kiet.edu"
                          value={form.email}
                          onChange={handleChange}
                        />
                        {errors.email && <span className="reg-error">{errors.email}</span>}
                      </div>

                      <div className="reg-field">
                        <label className="reg-label" htmlFor="whatsapp">WhatsApp Number</label>
                        <input
                          className="reg-input"
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.whatsapp}
                          onChange={handleChange}
                        />
                        {errors.whatsapp && <span className="reg-error">{errors.whatsapp}</span>}
                      </div>

                      <div className="reg-field">
                        <label className="reg-label" htmlFor="accommodation">Mode of Accommodation</label>
                        <select
                          className="reg-select"
                          id="accommodation"
                          name="accommodation"
                          value={form.accommodation}
                          onChange={handleChange}
                        >
                          <option value="">Select accommodation</option>
                          {ACCOMMODATIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {errors.accommodation && <span className="reg-error">{errors.accommodation}</span>}
                      </div>

                      <div className="reg-field">
                        <label className="reg-label" htmlFor="domain">Preferred Domains</label>
                        <div className="reg-domains" role="group" aria-label="Preferred domains">
                          {DOMAINS.map((d) => {
                            const order = form.domains.indexOf(d) + 1;
                            const selected = order > 0;
                            const full = !selected && form.domains.length >= MAX_DOMAINS;
                            return (
                              <button
                                key={d}
                                type="button"
                                className={[
                                  "reg-domain-chip",
                                  selected ? "reg-domain-chip--on" : "",
                                  full ? "reg-domain-chip--disabled" : "",
                                ].join(" ")}
                                onClick={() => toggleDomain(d)}
                                disabled={full}
                                aria-pressed={selected}
                                aria-label={selected ? `${order} ${d}` : d}
                              >
                                <span className="reg-domain-order">{selected ? order : ""}</span>
                                {d}
                              </button>
                            );
                          })}
                        </div>
                        <p className="reg-domain-hint">
                          Select up to {MAX_DOMAINS}, ranked by preference — the first is your top choice.
                        </p>
                        {errors.domains && <span className="reg-error">{errors.domains}</span>}
                      </div>

                      <div className="reg-field">
                        <label className="reg-label" htmlFor="joinGroup">Did you join our WhatsApp group?</label>
                        <select
                          className="reg-select"
                          id="joinGroup"
                          name="joinGroup"
                          value={form.joinGroup}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {JOIN_GROUP_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {errors.joinGroup && <span className="reg-error">{errors.joinGroup}</span>}
                      </div>
                    </div>

                    {serverError && <span className="reg-error">{serverError}</span>}
                    <button type="submit" className="register-submit" disabled={submitting}>
                      {submitting ? "Submitting…" : "Register Now"}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {!registerOnly && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}
