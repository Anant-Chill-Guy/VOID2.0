import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from "./../components/footer";
import './../index.css';
import emailjs from "emailjs-com";

// ✅ Simple Checkmark SVG for success animation
const CheckmarkIcon = () => (
  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
);

// (FAQ moved to a dedicated page: src/pages/FAQ.jsx)

export default function ContactUs() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ content moved to `src/pages/FAQ.jsx`.

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formState.name) newErrors.name = 'Name is required.';
    if (!formState.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formState.message) newErrors.message = 'Message is required.';
    return newErrors;
  };

  // ✅ Updated handleSubmit with EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      emailjs.send(
        "service_b0p3dvq",     // your Service ID
        "template_0dcpbqk",    // your Template ID
        {
          name: formState.name,
          email: formState.email,
          message: formState.message,
        },
        "6CZt7UM5XbvHCqDpF"    // your Public Key
      )
      .then(() => {
        setIsSubmitted(true);
      })
      .catch((err) => {
        console.error("Failed to send message:", err);
        alert("Something went wrong. Try again later!");
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Email copied to clipboard!');
    });
  };

  return (
    <>
      <Navbar />
      <div className="contact-us-page">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>

        <section className="contact-hero">
          <h1 className="contact-hero-title">We’d Love to Hear From You</h1>
          <p className="contact-hero-subtitle">Whether you have a question, feedback, or just want to say hi, our team is ready to answer all your questions.</p>
        </section>

        <div className="contact-main-content">
          {/* ✅ Contact Form */}
          <div className="contact-form-card">
            {isSubmitted ? (
              <div className="form-success-state">
                <CheckmarkIcon />
                <h2>Message Sent!</h2>
                <p>Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} className={errors.name ? 'input-error' : ''} />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formState.email} onChange={handleInputChange} className={errors.email ? 'input-error' : ''} />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" value={formState.message} onChange={handleInputChange} className={errors.message ? 'input-error' : ''}></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                <button type="submit" className="submit-button">Send Message</button>
              </form>
            )}
          </div>

          {/* ✅ Alternative Contact Methods */}
          <div className="alternative-contacts">
            <h3>Other Ways to Connect</h3>
            <div className="contact-method">
              <strong>Email Us</strong>
              <div className="email-wrapper">
                <a href="mailto:voidsociety@kiet.edu">voidsociety@kiet.edu</a>
                <button onClick={() => copyToClipboard('voidsociety@kiet.edu')} className="copy-button">Copy</button>
              </div>
            </div>
            <div className="contact-method">
              <strong>Call Us</strong>
              <a href="tel:+919520869485">+91 95208 69485</a>
            </div>
            <div className="contact-method">
              <strong>Find Us</strong>
              <p>KIET Groups of institutions, H-Block, COE Cybersecurity</p>
              <div className="map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d403.2578691707484!2d77.49752883465763!3d28.75315361001313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1758773394571!5m2!1sen!2sin" 
                  width="100%" 
                  height="200" 
                  style={{border: 0, borderRadius: '8px'}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="KIET Groups of Institutions Location"
                ></iframe>
              </div>
            </div>
            <div className="social-links">
              <a href="https://github.com/V-O-I-D-Society" target="_blank" rel="noopener noreferrer" className="social-icon Github">G</a>
              <a href="https://www.linkedin.com/company/void-society/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">L</a>
              <a href="https://www.instagram.com/kiet_voidsociety?igsh=YXZzcGwzOWRvOXZl" target="_blank" rel="noopener noreferrer" className="social-icon instagram">I</a>
            </div>
          </div>
        </div>



        {/* ✅ Final CTA */}
        <section className="final-cta">
          <h2>Still have questions?</h2>
          <a href="mailto:voidsociety@kiet.edu" className="join-us-button">Let's Connect</a>
        </section>
      </div>
      <Footer />
    </>
  );
}
