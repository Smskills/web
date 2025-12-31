
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { INITIAL_CONTENT } from './data/defaultContent';
import { AppState } from './types';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import NoticesPage from './pages/NoticesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [content, setContent] = useState<AppState>(() => {
    const saved = localStorage.getItem('edu_insta_content');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT;
  });

  const updateContent = (newContent: AppState) => {
    setContent(newContent);
    localStorage.setItem('edu_insta_content', JSON.stringify(newContent));
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header config={content.site} />
        
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage content={content} />} />
            <Route path="/about" element={<AboutPage content={content.about} siteName={content.site.name} />} />
            <Route path="/courses" element={<CoursesPage courses={content.courses} />} />
            <Route path="/notices" element={<NoticesPage notices={content.notices} />} />
            <Route path="/gallery" element={<GalleryPage gallery={content.gallery} />} />
            <Route path="/contact" element={<ContactPage config={content.site.contact} />} />
            <Route path="/admin" element={<AdminDashboard content={content} onUpdate={updateContent} />} />
          </Routes>
        </main>

        <Footer config={content.site} />
      </div>
    </HashRouter>
  );
};

// Helper component to reset scroll on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default App;
