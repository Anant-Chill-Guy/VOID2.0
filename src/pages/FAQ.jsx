import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './../index.css';

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div className="faq-item">
    <button className="faq-question" onClick={onClick}>
      <span>{question}</span>
      <span className={`faq-icon ${isOpen ? 'open' : ''}`}>{isOpen ? '-' : '+'}</span>
    </button>
    <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
      {Array.isArray(answer) ? (
        <ul
          className="faq-list"
          style={{
            listStyleType: 'disc',
            listStylePosition: 'outside',
            paddingLeft: '1.5rem',
            margin: '0.5rem 0'
          }}
        >
          {answer.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : answer && typeof answer === 'object' && Array.isArray(answer.items) ? (
        <>
          {answer.intro && <p>{answer.intro}</p>}
          <ul className="faq-list" style={{ listStyleType: 'disc', listStylePosition: 'outside', paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
            {answer.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>{answer}</p>
      )}
    </div>
  </div>
);

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { question: 'Can I apply for a role here?', answer: 'Absolutely! We are always looking for talented individuals. Please head over to our home page and apply there' },
    { question: 'Do you offer collaboration or partnership opportunities?', answer: 'Yes, we are open to collaborations that align with our mission. Please detail your proposal in the contact form, and our partnership team will get in touch.' },
    {
      question: 'What are the competitions we participate in?',
      answer: [
        'CTFs (Capture The Flag) — Forensics, Web Exploitation, Cryptography, Reverse Engineering, etc.',
        'Hackathons — develop innovative cybersecurity solutions',
        'Bug Bounty Programs — finding security vulnerabilities in real-world websites',
        'Inter-college competitions — like CyberQuest, Innotech, etc.',
        'Workshops and seminars — focused on cybersecurity awareness and hands-on skills',
      ],
    },
    { question: 'Can I change my domain after getting selected?', answer: 'Yes, domain change is possible. If you realize your interest lies in another domain you can discuss it with the team. As long as you are ready to learn and show commitment, switching domains is not restricted.' },
    {
      question: 'What will be the syllabus?',
      answer: {
        intro: 'We will start from beginner to advanced topics including:',
        items: [
          'Basics of Networking',
          'Linux & Command Line usage',
          'Types of Cyber Attacks',
          'Basics of Cryptography',
          'Bug Bounty / OWASP Top 10 vulnerabilities',
          'Penetration Testing Tools (Nmap, Burp Suite, Wireshark, Metasploit, etc.)',
          'Digital Forensics',
        ],
      },
    },
    { question: 'Will we get holidays during exams?', answer: 'Yes, the club gives full consideration during exam time; sessions are either paused or kept light.' },
    { question: 'I don\'t know anything about cybersecurity. Can I still get selected?', answer: 'Definitely yes - the club starts from the basics and mentors will guide you.' },
    { question: 'I\'m from the Core branch. Am I eligible?', answer: 'Yes, you are 100% eligible. Students from any branch can join.' },
    {
      question: 'What kind of projects can we do?',
      answer:
        {
        intro: 'You can work on a variety of exciting and impactful cybersecurity projects as a beginner, such as but limited to:',
        items: [
          'Phishing Detection Bot',
          'AI-based Threat Detection System',
          'Network Packet Sniffer / Intrusion Detection System',
          'Password Strength Analyzer',
          'Web Vulnerability Scanner (using OWASP tools)',
          'Digital Forensics Toolkit',
          'Cloud Security Analyzer',
          'Cyber Awareness Chatbot for Students',

        ],
      },
    },
    { question: 'I am a day scholar. Do I have to stay back?', answer: 'You will be provided official permission to stay on campus after 5 PM.' },
    { question: 'Will we be taught from the basics?', answer: 'Yes — no prior knowledge is required; we start from basics.' },
    { question: 'Why join VOID Society? What are the advantages over other clubs?', answer: 'We are cybersecurity-centric, provide exclusive resources, strong alumni network, peer-to-peer learning, and opportunities to work on live projects.' },
  ];

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  return (
    <>
      <Navbar />
  <div className="faq-page" style={{ paddingTop: '80px' }}>
        <section className="faq-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 className="contact-hero-title">Frequently Asked Questions</h1>
          <p className="contact-hero-subtitle">Answers to common questions about VOID Society and membership.</p>
        </section>

        <section className="faq-section container">
          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} isOpen={openFaq === index} onClick={() => toggleFaq(index)} />
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
