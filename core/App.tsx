
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import EnrollmentPage from './pages/EnrollmentPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CareerGuidancePage from './pages/CareerGuidancePage';
import PlacementReviewPage from './pages/PlacementReviewPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { API_BASE_URL } from './config.ts';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('sms_is_auth') === 'true');
  const [content, setContent] = useState<AppState>(INITIAL_CONTENT);
  const [isServerOnline, setIsServerOnline] = useState(false);

  // Load Content from DB on Mount with Resilient Fallback
  useEffect(() => {
    const fetchContent = async () => {
      let remoteData = null;
      
      try {
        const response = await fetch(`${API_BASE_URL}/config`, { signal: AbortSignal.timeout(3000) });
        const result = await response.json();
        
        if (result.success && result.data) {
          remoteData = result.data;
          setIsServerOnline(true);
        }
      } catch (e) {
        // Server unreachable or timed out - fail silently to local mode
        setIsServerOnline(false);
      }

      // Merge Logic: DB > LocalStorage > Defaults
      const savedLocal = localStorage.getItem('edu_insta_content');
      const baseSource = remoteData || (savedLocal ? JSON.parse(savedLocal) : INITIAL_CONTENT);

      const mergedState: AppState = {
        ...INITIAL_CONTENT,
        ...baseSource,
        site: { ...INITIAL_CONTENT.site, ...baseSource.site },
        home: { ...INITIAL_CONTENT.home, ...baseSource.home },
        about: { ...INITIAL_CONTENT.about, ...baseSource.about },
        courses: { ...INITIAL_CONTENT.courses, ...baseSource.courses },
        notices: { ...INITIAL_CONTENT.notices, ...baseSource.notices },
        faqs: { ...INITIAL_CONTENT.faqs, ...baseSource.faqs },
        placements: { ...INITIAL_CONTENT.placements, ...baseSource.placements }
      };

      setContent(mergedState);
      setIsInitializing(false);
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
    setContent(newContent);
    
    // Always backup to local storage first
    try {
      localStorage.setItem('edu_insta_content', JSON.stringify(newContent));
    } catch (e) {
      console.warn("LocalStorage backup failed (likely storage limit hit).");
    }
    
    // Attempt to persist to Database if it was previously online
    try {
      const token = localStorage.getItem('sms_auth_token');
      const response = await fetch(`${API_BASE_URL}/config`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContent)
      });
      
      const result = await response.json();
      setIsServerOnline(result.success);
      return result.success;
    } catch (err) {
      // Server down during save
      setIsServerOnline(false);
      return true; // Return true because we saved locally
    }
  };

  const headerHeightClass = content.site.admissionAlert?.enabled ? 'pt-36 md:pt-40' : 'pt-24 md:pt-32';

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Optimizing Experience</p>
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
                    ? <AdminDashboard content={content} onUpdate={updateContent} serverOnline={isServerOnline} /> 
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
