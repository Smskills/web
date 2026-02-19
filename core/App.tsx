
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { INITIAL_CONTENT } from './data/defaultContent.ts';
import { AppState } from './types.ts';

// Components
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

// Pages
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import CoursesPage from './pages/CoursesPage.tsx';
import NoticesPage from './pages/NoticesPage.tsx';
import GalleryPage from './pages/GalleryPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import EnrollmentPage from './pages/EnrollmentPage.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';
import TermsOfServicePage from './pages/TermsOfServicePage.tsx';
import CareerGuidancePage from './pages/CareerGuidancePage.tsx';
import PlacementReviewPage from './pages/PlacementReviewPage.tsx';
import FAQPage from './pages/FAQPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';

const API_BASE = 'http://localhost:5000/api';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('sms_is_auth') === 'true');
  const [content, setContent] = useState<AppState>(INITIAL_CONTENT);

  // Load Content from DB on Mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE}/config`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const parsed = result.data;
          // Merge with initial content to ensure all new fields exist
          const mergedState: AppState = {
            ...INITIAL_CONTENT,
            ...parsed,
            site: { ...INITIAL_CONTENT.site, ...parsed.site },
            home: { ...INITIAL_CONTENT.home, ...parsed.home },
            about: { ...INITIAL_CONTENT.about, ...parsed.about },
            courses: { ...INITIAL_CONTENT.courses, ...parsed.courses },
            notices: { ...INITIAL_CONTENT.notices, ...parsed.notices },
            faqs: { ...INITIAL_CONTENT.faqs, ...parsed.faqs },
            placements: { ...INITIAL_CONTENT.placements, ...parsed.placements }
          };
          setContent(mergedState);
        }
      } catch (e) {
        console.error("Institutional CMS: Failed to sync with database, using local defaults.", e);
        // Fallback to local storage if DB is down
        const saved = localStorage.getItem('edu_insta_content');
        if (saved) setContent(JSON.parse(saved));
      } finally {
        setIsInitializing(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem('sms_is_auth') === 'true');
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const brandingStyles = useMemo(() => {
    const primary = content.theme.primary || "#059669";
    const radius = content.theme.radius;
    const borderRadius = radius === 'none' ? '0' : radius === 'small' ? '0.5rem' : radius === 'medium' ? '1rem' : radius === 'large' ? '2.5rem' : '9999px';
    
    return `
      :root {
        --brand-primary: ${primary};
        --brand-radius: ${borderRadius};
      }
    `;
  }, [content.theme]);

  const updateContent = async (newContent: AppState) => {
    // 1. Update UI state immediately
    setContent(newContent);
    
    // 2. Persist to Database
    try {
      const token = localStorage.getItem('sms_auth_token');
      const response = await fetch(`${API_BASE}/config`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContent)
      });
      
      const result = await response.json();
      
      // Also backup to local storage
      localStorage.setItem('edu_insta_content', JSON.stringify(newContent));
      
      return result.success;
    } catch (err: any) {
      console.error("CMS Save Error (Sync Failed)", err);
      return false;
    }
  };

  const headerHeightClass = content.site.admissionAlert?.enabled ? 'pt-36 md:pt-40' : 'pt-24 md:pt-32';

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Initializing Core Systems</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <style>{brandingStyles}</style>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen overflow-x-hidden bg-white font-sans">
        <Header config={content.site} courses={content.courses.list} />
        <main id="main-content" className={`flex-grow ${headerHeightClass} focus:outline-none`} tabIndex={-1}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600"></i></div>}>
            <Routes>
              <Route path="/" element={<HomePage content={content} />} />
              <Route path="/about" element={<AboutPage content={content.about} siteName={content.site.name} />} />
              <Route path="/academics" element={<CoursesPage coursesState={content.courses} isLoading={isInitializing} />} />
              <Route path="/notices" element={<NoticesPage noticesState={content.notices} />} />
              <Route path="/gallery" element={<GalleryPage content={content} />} />
              <Route path="/faq" element={<FAQPage faqsState={content.faqs} contact={content.site.contact} />} />
              <Route path="/contact" element={<ContactPage config={content.site.contact} social={content.site.social} content={content} />} />
              <Route path="/login" element={<LoginPage siteConfig={content.site} />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage siteConfig={content.site} />} />
              <Route path="/reset-password" element={<ResetPasswordPage siteConfig={content.site} />} />
              <Route 
                path="/admin" 
                element={
                  isAuthenticated 
                    ? <AdminDashboard content={content} onUpdate={updateContent} /> 
                    : <Navigate to="/login" replace />
                } 
              />
              <Route path="/enroll" element={<EnrollmentPage content={content} />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage siteName={content.site.name} data={content.legal.privacy} />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage data={content.legal.terms} />} />
              <Route path="/career-guidance" element={<CareerGuidancePage data={content.career} />} />
              <Route path="/placement-review" element={<PlacementReviewPage placements={content.placements} label={content.home.sectionLabels.placementMainLabel} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer config={content.site} />
      </div>
    </HashRouter>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

export default App;
