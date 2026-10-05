import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import './App.css';


const VoidPage = lazy(() => import('./pages/home.jsx'));
const TerminalPage = lazy(() => import('./pages/terminal.jsx'));
const Blogs = lazy(() => import('./pages/blogs.jsx'));
const Achievements = lazy(() => import('./pages/achievement.jsx'));
const AboutUs = lazy(() => import('./pages/about-Us.jsx'));
const Team = lazy(() => import('./pages/team.jsx'));
const Events = lazy(() => import('./pages/events.jsx'));
const Resources = lazy(() => import('./pages/resources.jsx'));
const ContactUs = lazy(() => import('./pages/contact-Us.jsx'));
const IrcPage = lazy(() => import('./pages/irc.jsx'));
const FAQPage = lazy(() => import('./pages/FAQ.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const Sponsors = lazy(() => import('./pages/sponsors.jsx'));
const PanelSight = lazy(() => import('./pages/panelSight.jsx'));

function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/terminal" element={<TerminalPage />} />
        <Route path="/" element={<VoidPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/articles" element={<Blogs />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/blogs/:id" element={<BlogPostPage />} />
        <Route path="/articles/:id" element={<BlogPostPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/team" element={<Team />} />
        <Route path="/events" element={<Events />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/irc" element={<IrcPage />} />
        <Route path="/FAQ" element={<FAQPage />} />
        <Route path="/panel-sight" element={<PanelSight />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}

export default App;
