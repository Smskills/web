import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
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

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [content, setContent] = useState<AppState>(() => {
    const saved = localStorage.getItem('edu_insta_content');
    if (!saved) return INITIAL_CONTENT;
    
    try {
      const parsed = JSON.parse(saved);
      
      const mergedState: AppState = {
        ...INITIAL_CONTENT,
        ...parsed,
        site: { 
          ...INITIAL_CONTENT.site, 
          ...parsed.site,
          contact: { ...INITIAL_CONTENT.site.contact, ...(parsed.site?.contact || {}) },
          footer: { ...INITIAL_CONTENT.site.footer, ...(parsed.site?.footer || {}) }
        },
        home: { 
          ...INITIAL_CONTENT.home, 
          ...parsed.home,
          sectionLabels: { ...INITIAL_CONTENT.home.sectionLabels, ...(parsed.home?.sectionLabels || {}) },
          ctaBlock: { ...INITIAL_CONTENT.home.ctaBlock, ...(parsed.home?.ctaBlock || {}) },
          sections: { ...INITIAL_CONTENT.home.sections, ...(parsed.home?.sections || {}) },
          bigShowcase: { ...INITIAL_CONTENT.home.bigShowcase, ...(parsed.home?.bigShowcase || {}) }
        },
        enrollmentForm: {
          ...INITIAL_CONTENT.enrollmentForm,
          ...(parsed.enrollmentForm || {}),
          fields: parsed.enrollmentForm?.fields || INITIAL_CONTENT.enrollmentForm.fields
        },
        about: { ...INITIAL_CONTENT.about, ...parsed.about },
        placements: { ...INITIAL_CONTENT.placements, ...(parsed.placements || {}) },
        legal: { ...INITIAL_CONTENT.legal, ...(parsed.legal || {}) },
        career: { ...INITIAL_CONTENT.career, ...(parsed.career || {}) },
        courses: { ...INITIAL_CONTENT.courses, ...(parsed.courses || {}) },
        notices: { ...INITIAL_CONTENT.notices, ...(parsed.notices || {}) },
        faqs: { ...INITIAL_CONTENT.faqs, ...(parsed.faqs || {}) },
        leads: parsed.leads || []
      };

      return mergedState;
    } catch (e) {
      console.error("Educational CMS: Error restoring state.", e);
      return INITIAL_CONTENT;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const brandingStyles = useMemo(() => {
    const primary = "#059669"; // Professional Green
    const midnight = "#020617"; // Deep Midnight Navy (Perfect for Contrast)
    const accent = "#10b981"; // Vibrant Accent Green
    const radius = content.theme.radius;
    const borderRadius = radius === 'none' ? '0' : radius === 'small' ? '0.5rem' : radius === 'medium' ? '1rem' : radius === 'large' ? '2.5rem' : '9999px';
    
    return `
      :root {
        --brand-primary: ${primary};
        --brand-midnight: ${midnight};
        --brand-accent: ${accent};
        --brand-radius: ${borderRadius};
      }
      .bg-emerald-600 { background-color: var(--brand-primary) !important; }
      .text-emerald-600 { color: var(--brand-primary) !important; }
      .border-emerald-600 { border-color: var(--brand-primary) !important; }
      
      .bg-midnight-navy { background-color: var(--brand-midnight) !important; }
      .text-midnight-navy { color: var(--brand-midnight) !important; }
      
      .bg-emerald-500 { background-color: var(--brand-accent) !important; }
      .text-emerald-500 { color: var(--brand-accent) !important; }
    `;
  }, [content.theme]);

  const updateContent = async (newContent: AppState) => {
    setContent(newContent);
    try {
      localStorage.setItem('edu_insta_content', JSON.stringify(newContent));
      return true;
    } catch (err: any) {
      console.error("CMS Save Error", err);
      return false;
    }
  };

  const headerHeightClass = content.site.admissionAlert?.enabled ? 'pt-36 md:pt-40' : 'pt-24 md:pt-32';

  return (
    <HashRouter>
      <style>{brandingStyles}</style>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen overflow-x-hidden bg-white">
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
              <Route path="/admin" element={<AdminDashboard content={content} onUpdate={updateContent} />} />
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