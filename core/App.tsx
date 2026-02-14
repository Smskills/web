
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
import CustomPageView from './pages/CustomPageView.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';

const ProtectedRoute: React.FC<{ isAuthenticated: boolean; children: React.ReactNode }> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sms_is_auth') === 'true' && !!localStorage.getItem('sms_auth_token');
  });

  const [content, setContent] = useState<AppState>(INITIAL_CONTENT);

  useEffect(() => {
    const bootstrapConfig = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/config');
        const result = await response.json();
        const apiData = (result.success && result.data) ? result.data : null;
        
        const saved = localStorage.getItem('edu_insta_content');
        let localData: any = {};
        if (saved) {
           try {
             localData = JSON.parse(saved);
           } catch (e) {
             console.error("Local cache invalid.");
           }
        }

        // Helper to handle the transition from Array-based storage to Object-based storage
        const normalizeData = (incoming: any, key: string, defaultMeta: any) => {
          const data = incoming[key];
          if (!data) return INITIAL_CONTENT[key as keyof AppState];
          if (Array.isArray(data)) {
            return { list: data, pageMeta: defaultMeta };
          }
          return {
            ...INITIAL_CONTENT[key as keyof AppState],
            ...data,
            list: Array.isArray(data.list) ? data.list : []
          };
        };

        // IF API DATA EXISTS, IT IS THE MASTER SOURCE. 
        // LocalData is only a fallback or merge layer for things not in DB.
        const sourceData = apiData || localData;

        const finalContent: AppState = {
          ...INITIAL_CONTENT,
          ...sourceData,
          site: { 
            ...INITIAL_CONTENT.site, 
            ...sourceData.site,
            contact: { ...INITIAL_CONTENT.site.contact, ...(sourceData.site?.contact || {}) },
            footer: { ...INITIAL_CONTENT.site.footer, ...(sourceData.site?.footer || {}) }
          },
          home: { 
            ...INITIAL_CONTENT.home, 
            ...sourceData.home,
            sectionLabels: { ...INITIAL_CONTENT.home.sectionLabels, ...(sourceData.home?.sectionLabels || {}) },
            ctaBlock: { ...INITIAL_CONTENT.home.ctaBlock, ...(sourceData.home?.ctaBlock || {}) },
            sections: { ...INITIAL_CONTENT.home.sections, ...(sourceData.home?.sections || {}) },
            bigShowcase: { ...INITIAL_CONTENT.home.bigShowcase, ...(sourceData.home?.bigShowcase || {}) }
          },
          enrollmentForm: {
            ...INITIAL_CONTENT.enrollmentForm,
            ...(sourceData.enrollmentForm || {}),
            fields: sourceData.enrollmentForm?.fields || INITIAL_CONTENT.enrollmentForm.fields,
            roadmapSteps: sourceData.enrollmentForm?.roadmapSteps || INITIAL_CONTENT.enrollmentForm.roadmapSteps
          },
          courses: normalizeData(sourceData, 'courses', INITIAL_CONTENT.courses.pageMeta),
          notices: normalizeData(sourceData, 'notices', INITIAL_CONTENT.notices.pageMeta),
          gallery: normalizeData(sourceData, 'gallery', INITIAL_CONTENT.gallery.pageMeta),
          faqs: normalizeData(sourceData, 'faqs', INITIAL_CONTENT.faqs.pageMeta)
        };

        setContent(finalContent);
      } catch (err) {
        console.warn("Bootstrap: institutional server offline, using cache.");
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrapConfig();

    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem('sms_is_auth') === 'true' && !!localStorage.getItem('sms_auth_token'));
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const brandingStyles = useMemo(() => {
    const { primary, secondary, accent, radius } = content.theme;
    const borderRadius = radius === 'none' ? '0' : radius === 'small' ? '0.5rem' : radius === 'medium' ? '1rem' : radius === 'large' ? '2.5rem' : '9999px';
    
    return `
      :root {
        --brand-primary: ${primary};
        --brand-secondary: ${secondary};
        --brand-accent: ${accent};
        --brand-radius: ${borderRadius};
      }
      .bg-emerald-600 { background-color: var(--brand-primary) !important; }
      .text-emerald-600 { color: var(--brand-primary) !important; }
      .border-emerald-600 { border-color: var(--brand-primary) !important; }
      .bg-slate-900 { background-color: var(--brand-secondary) !important; }
      .bg-emerald-500 { background-color: var(--brand-accent) !important; }
      .text-emerald-500 { color: var(--brand-accent) !important; }
    `;
  }, [content.theme]);

  const updateContent = async (newContent: AppState) => {
    setContent(newContent);
    
    // Attempt local cache save but silently ignore quota errors
    // Since we save to DB, the local cache is just a 'speed' feature
    try {
      localStorage.setItem('edu_insta_content', JSON.stringify(newContent));
    } catch (e) {
      // Quota exceeded is fine, we sync to DB next
    }
    
    if (isAuthenticated) {
      const token = localStorage.getItem('sms_auth_token');
      const res = await fetch('http://localhost:5000/api/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContent)
      });
      
      const result = await res.json();
      if (!result.success) {
        if (res.status === 413) throw new Error("The update is too large (Maximum 100MB). Please remove some old photos.");
        throw new Error(result.message || "Institutional database rejected the update.");
      }
      return true;
    }
    return true;
  };

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><i className="fa-solid fa-circle-notch fa-spin text-4xl text-emerald-600"></i></div>;
  }

  return (
    <HashRouter>
      <style>{brandingStyles}</style>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Header config={content.site} isAuthenticated={isAuthenticated} courses={content.courses.list} />
        <main id="main-content" className="flex-grow pt-24 md:pt-32 focus:outline-none" tabIndex={-1}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600"></i></div>}>
            <Routes>
              <Route path="/" element={<HomePage content={content} />} />
              <Route path="/about" element={<AboutPage content={content.about} siteName={content.site.name} />} />
              <Route path="/academics" element={<CoursesPage coursesState={content.courses} isLoading={isInitializing} />} />
              <Route path="/courses" element={<Navigate to="/academics" replace />} />
              <Route path="/notices" element={<NoticesPage noticesState={content.notices} />} />
              <Route path="/gallery" element={<GalleryPage content={content} />} />
              <Route path="/faq" element={<FAQPage faqsState={content.faqs} contact={content.site.contact} />} />
              <Route path="/contact" element={<ContactPage config={content.site.contact} social={content.site.social} content={content} />} />
              <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminDashboard content={content} onUpdate={updateContent} /></ProtectedRoute>} />
              <Route path="/enroll" element={<EnrollmentPage content={content} />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage siteName={content.site.name} data={content.legal.privacy} />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage data={content.legal.terms} />} />
              <Route path="/career-guidance" element={<CareerGuidancePage data={content.career} />} />
              <Route path="/placement-review" element={<PlacementReviewPage placements={content.placements} label={content.home.sectionLabels.placementMainLabel} />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage siteConfig={content.site} />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage siteConfig={content.site} />} />
              <Route path="/reset-password" element={<ResetPasswordPage siteConfig={content.site} />} />
              {content.customPages.filter(p => p.visible).map(page => (
                <Route key={page.id} path={page.slug.startsWith('/') ? page.slug : `/${page.slug}`} element={<CustomPageView page={page} siteConfig={content.site} />} />
              ))}
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
