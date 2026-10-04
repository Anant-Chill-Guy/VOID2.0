import Navbar from '../components/navbar';
import Footer from './../components/footer';
import './../index.css';
import { Linkedin } from 'lucide-react';
import Suryansh from './../assets/Members/Suryansh.webp'
import Kanishka from './../assets/Members/Kanishka.webp'
import Abhishek from './../assets/Members/Abhishek.jpeg'
import Ambar from './../assets/Members/Ambar.webp'
import Keshav from './../assets/Members/Keshav.webp'
import Parkhi from './../assets/Members/Parkhi.webp'
import Divya from './../assets/HS/Members/Divya.jpg'
import Krishna from './../assets/HS/Members/Krishna.png'
import yuvraj from './../assets/Members/Yuvraj.jpeg'
import vishal from './../assets/HS/Members/Vishal.png'
import AnmolSecond from './../assets/Members/SecondYear/Anmol.jpeg'
import AnantSecond from './../assets/Members/SecondYear/Anant.jpeg'
import AzaanSecond from './../assets/Members/SecondYear/Azaan.jpeg'
import HimanshuSecond from './../assets/Members/SecondYear/Himanshu.jpeg'
import KanishkaSecond from './../assets/Members/SecondYear/Kanishka.jpeg'
import KinshukSecond from './../assets/Members/SecondYear/Kinshuk.jpeg'
import KushagraSecond from './../assets/Members/SecondYear/Kushagra.jpeg'
import ShubhSecond from './../assets/Members/SecondYear/Shubh.jpeg'
import ShreyaSecond from './../assets/Members/SecondYear/Shreya.jpeg'

const initials = (name) => name.split(' ').map((word) => word[0]).slice(0, 2).join('');


const GROUPS = [
  {
    headline: 'Founder and Lead',
    large: true,
    card: '240px',
    members: [
      { name: 'Suryansh Deshwal', image: Suryansh, linkedin: 'https://www.linkedin.com/in/suryansh-deshwal/' },
    ],
  },
  {
    headline: 'Executive Board',
    large: true,
    card: '240px',
    members: [
      { name: 'Ambar Chakravartty', role: 'President', image: Ambar, linkedin: 'https://www.linkedin.com/in/ambar-chakravartty/' },
      { name: 'Kanishka', role: 'President', image: Kanishka, linkedin: 'https://www.linkedin.com/in/kanishka304/' },
      { name: 'Abhishek Kumar', role: 'Sr. Developer', image: Abhishek, linkedin: 'https://www.linkedin.com/in/soul-bot/' },
    ],
  },
  {
    headline: 'Core Team',
    card: 'clamp(7rem, 11vw, 200px)',
    members: [
      { name: 'Keshav Agarwal', image: Keshav, linkedin: 'https://www.linkedin.com/in/ka0211/' },
      { name: 'Parkhi Sharma', image: Parkhi, linkedin: 'https://www.linkedin.com/in/ps0611/' },
      { name: 'Shubham Kumar', image: null, linkedin: null },
      { name: 'Krishna Kumar', image: Krishna, linkedin: 'https://www.linkedin.com/in/krishna-kumar-96b713306/' },
      { name: 'Yuvraj Patel', image: yuvraj, linkedin: 'https://www.linkedin.com/in/yuvraj-patel-391064342/' },
      { name: 'Vishal Prajapati', image: vishal, linkedin: 'https://www.linkedin.com/in/vishalprajapati2258/' },
      { name: 'Divya Pal', image: Divya, linkedin: 'https://www.linkedin.com/in/divya-pal-5619a4328/' },
    ],
  },
  {
    headline: 'BATCH 2025-2029',
    card: 'clamp(7rem, 11vw, 200px)',
    members: [
      { name: 'Anant Awasthi', image: AnantSecond, linkedin: 'https://www.linkedin.com/in/anant-awasthi-542b113a4/' },
      { name: 'Azaan Hussain', image: AzaanSecond, linkedin: 'https://www.linkedin.com/in/azaan-husain/' },
      { name: 'Kanishka Jain', image: KanishkaSecond, linkedin: 'https://www.linkedin.com/in/kanishka-jain-a484b7381/' },
      { name: 'Himanshu Singh', image: HimanshuSecond, linkedin: 'https://www.linkedin.com/in/himanshu-singh-b08617385/' },
      { name: 'Kinshuk Agarwal', image: KinshukSecond, linkedin: 'https://www.linkedin.com/in/kinshuk-agrawal-6185b5381/' },
      { name: 'Kushagra Kaushik', image: KushagraSecond, linkedin: 'https://www.linkedin.com/in/kushagra-kaushik-4a935b384/' },
      { name: 'Shubh Agarwal', image: ShubhSecond, linkedin: 'https://www.linkedin.com/in/shubh-agarwal-69b504384/' },
      { name: 'Shreya Singh', image: ShreyaSecond, linkedin: 'https://www.linkedin.com/in/shreya-singh-368236389/' },
      { name: 'Anmol Singhal', image: AnmolSecond, linkedin: 'https://www.linkedin.com/in/anmolas/' },
    ],
  },
];

const TeamCard = ({ member, index = 0 }) => {
  
  const handleMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`);
  };

  const handleLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      className="team-card"
      style={{ '--i': index }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="team-card__photo">
        {member.image ? (
          <img src={member.image} alt={member.name} loading="lazy" />
        ) : (
          <span className="team-card__initials" role="img" aria-label={`${member.name}, portrait pending`}>
            {initials(member.name)}
          </span>
        )}
      </div>

      <div className="team-card__body">
        <h3 className="team-card__name">{member.name}</h3>
        {member.role && <p className="team-card__role">{member.role}</p>}
      </div>

      {member.linkedin && (
        <a
          className="team-card__social"
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          title={`${member.name} on LinkedIn`}
        >
          <Linkedin size={16} aria-hidden="true" />
        </a>
      )}
    </article>
  );
};

export default function Team() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-us-page team-page">
        <header className="team-header">
          <h1 className="team-header__title">The Team</h1>
          <p className="team-header__sub">The minds behind the void</p>
        </header>

        {GROUPS.map((group) => (
          <section
            className={`team-group${group.large ? ' team-group--lg' : ''}`}
            key={group.headline}
            style={{ '--card': group.card }}
          >
            <h2 className="team-group__title">{group.headline}</h2>
            <div className="team-grid">
              {group.members.map((member, i) => (
                <TeamCard key={member.name} member={member} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </div>
  );
}
