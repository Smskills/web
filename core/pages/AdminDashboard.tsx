
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, Course, Notice, FAQItem, FormField, PlacementStat, StudentReview, IndustryPartner, LegalSection, CareerService, CustomPage, TeamMember, PageMeta, SocialLink, AchievementStat, ExtraChapter, Lead } from '../types.ts';
import { INITIAL_CONTENT } from '../data/defaultContent.ts';
import { optimizeImage } from '../utils/imageOptimizer.ts';

// Modular Sections
import SiteTab from '../admin/SiteTab.tsx';
import HomeTab from '../admin/HomeTab.tsx';
import AboutTab from '../admin/AboutTab.tsx';
import AcademicsTab from '../admin/Academics/AcademicsTab.tsx';
import NoticesTab from '../admin/NoticesTab.tsx';
import GalleryTab from '../admin/GalleryTab.tsx';
import FAQTab from '../admin/FAQTab.tsx';
import FormTab from '../admin/FormTab.tsx';
import ContactTab from '../admin/ContactTab.tsx';
import FooterTab from '../admin/FooterTab.tsx';
import PlacementsTab from '../admin/PlacementsTab.tsx';
import LegalTab from '../admin/LegalTab.tsx';
import CareerTab from '../admin/CareerTab.tsx';
import PagesTab from '../admin/PagesTab.tsx';
import LeadsTab from '../admin/LeadsTab.tsx';
import ImageCropper from '../components/ImageCropper.tsx';

interface AdminDashboardProps {
  content: AppState;
  onUpdate: (newContent: AppState) => Promise<boolean>;
  serverOnline?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, onUpdate, serverOnline = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'site' | 'home' | 'pages' | 'about' | 'academics' | 'notices' | 'gallery' | 'faq' | 'form' | 'contact' | 'footer' | 'placements' | 'legal' | 'career' | 'leads'>('leads');
  const [localContent, setLocalContent] = useState(content);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [croppingCourseId, setCroppingCourseId] = useState<string | null>(null);
  
  useEffect(() => {
    setLocalContent(content);
    setHasUnsavedChanges(false);
  }, [content]);

  const genericUploadRef = useRef<HTMLInputElement>(null);
  const activeUploadPath = useRef<string | null>(null);
  const activeCourseId = useRef<string | null>(null);
  const activeReviewId = useRef<string | null>(null);
  const activePartnerId = useRef<string | null>(null);
  const activeCareerServiceId = useRef<string | null>(null);

  const activeUploadCategory = useRef<string>('General');
  const activeThumbnailCategory = useRef<string | null>(null);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('sms_auth_token');
      localStorage.removeItem('sms_is_auth');
      localStorage.removeItem('sms_auth_user');
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    }
  };

  const handleSave = async () => {
    setIsProcessing(true);
    setIsError(false);
    setStatusMsg('Synchronizing...');
    
    try {
      const success = await onUpdate(localContent);
      if (success) {
        setStatusMsg('Changes Saved Successfully');
        setHasUnsavedChanges(false);
      } else {
        setIsError(true);
        setStatusMsg('Save Failed');
      }
      setIsProcessing(false);
      setTimeout(() => setStatusMsg(''), 5000);
    } catch (err: any) {
      setIsError(true);
      setStatusMsg(`ERROR: ${err.message || 'Sync failed.'}`);
      setIsProcessing(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all unsaved changes?")) {
      setLocalContent(content);
      setHasUnsavedChanges(false);
      setIsError(false);
      setStatusMsg('');
    }
  };

  const trackChange = () => setHasUnsavedChanges(true);

  const updateField = (section: keyof AppState, field: string, value: any) => {
    setLocalContent(prev => ({ ...prev, [section]: { ...(prev[section] as any), [field]: value } }));
    trackChange();
  };

  const updateNestedField = (section: keyof AppState, parent: string, field: string, value: any) => {
    setLocalContent(prev => ({ 
      ...prev, 
      [section]: { 
        ...(prev[section] as any), 
        [parent]: { 
          ...(prev[section] as any)[parent], 
          [field]: value 
        } 
      } 
    }));
    trackChange();
  };

  const handleGenericUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeUploadPath.current || isProcessing) return;
    
    setIsProcessing(true);
    const inputElement = e.target;
    const fileArray = Array.from(files) as File[];

    Promise.all(fileArray.map(file => optimizeImage(file)))
      .then(urls => {
        setLocalContent(prev => {
          const next = { ...prev };
          const pathParts = activeUploadPath.current!.split('.');
          
          if (pathParts[0] === 'gallery' && pathParts[1] !== 'thumbnails') {
            const newItems = urls.map((url, idx) => ({
              id: `img_${Date.now()}_${idx}`,
              url,
              category: activeUploadCategory.current,
              title: ''
            }));
            next.gallery = { ...next.gallery, list: [...newItems, ...next.gallery.list] };
            return next;
          }
          
          const url = urls[0];
          
          // Special handling for About Faculty Members
          if (pathParts[0] === 'about' && pathParts[1] === 'faculty' && pathParts[2] === 'members') {
            const memberId = pathParts[3];
            if (next.about && next.about.faculty && Array.isArray(next.about.faculty.members)) {
              next.about = { 
                ...next.about, 
                faculty: { 
                  ...next.about.faculty, 
                  members: next.about.faculty.members.map((m: any) => m.id === memberId ? { ...m, image: url } : m) 
                } 
              };
              return next;
            } else if (next.about && next.about.faculty && typeof next.about.faculty.members === 'object') {
              // Recovery attempt if it's an object
              const membersArray = Object.values(next.about.faculty.members || {});
              next.about = {
                ...next.about,
                faculty: {
                  ...next.about.faculty,
                  members: membersArray.map((m: any) => m.id === memberId ? { ...m, image: url } : m)
                }
              };
              return next;
            }
          }

          // Special handling for About Extra Chapters
          if (pathParts[0] === 'about' && pathParts[1] === 'extraChapters') {
            const chapterId = pathParts[2];
            const chapters = Array.isArray(next.about.extraChapters) 
              ? next.about.extraChapters 
              : Object.values(next.about.extraChapters || {});
            
            if (next.about) {
              next.about = { 
                ...next.about, 
                extraChapters: chapters.map((c: any) => c.id === chapterId ? { ...c, image: url } : c) 
              };
              return next;
            }
          }

          if (pathParts[0] === 'courses' && activeCourseId.current) {
            next.courses = { ...next.courses, list: next.courses.list.map((c: any) => c.id === activeCourseId.current ? { ...c, image: url } : c) };
            return next;
          }

          if (pathParts[0] === 'placements' && pathParts[1] === 'reviews' && activeReviewId.current) {
            next.placements = { ...next.placements, reviews: next.placements.reviews.map((r: any) => r.id === activeReviewId.current ? { ...r, image: url } : r) };
            return next;
          }
          if (pathParts[0] === 'placements' && pathParts[1] === 'partners' && activePartnerId.current) {
            next.placements = { ...next.placements, partners: next.placements.partners.map((p: any) => p.id === activePartnerId.current ? { ...p, image: url } : p) };
            return next;
          }
          if (pathParts[0] === 'career' && pathParts[1] === 'services' && activeCareerServiceId.current) {
            next.career = { ...next.career, services: next.career.services.map((s: any) => s.id === activeCareerServiceId.current ? { ...s, image: url } : s) };
            return next;
          }
          
          if (pathParts[0] === 'gallery' && pathParts[1] === 'thumbnails') {
            next.galleryMetadata = { ...(next.galleryMetadata || {}), [activeThumbnailCategory.current!]: url };
            return next;
          }
          
          let current: any = next;
          for (let i = 0; i < pathParts.length - 1; i++) {
            const key = pathParts[i];
            if (Array.isArray(current[key])) {
              current[key] = [...current[key]];
            } else {
              current[key] = { ...current[key] };
            }
            current = current[key];
          }
          current[pathParts[pathParts.length - 1]] = url;
          return next;
        });
        setHasUnsavedChanges(true);
        setIsProcessing(false);
        inputElement.value = '';
      })
      .catch(err => {
        console.error(err);
        setIsProcessing(false);
        setIsError(true);
        inputElement.value = '';
      });
  };

  const triggerGenericUpload = (path: string) => {
    activeUploadPath.current = path;
    genericUploadRef.current?.click();
  };

  const handleApplyCrop = (croppedBase64: string) => {
    if (!croppingCourseId) return;
    setLocalContent(prev => ({
      ...prev,
      courses: {
        ...prev.courses,
        list: prev.courses.list.map(c => c.id === croppingCourseId ? { ...c, cardImage: croppedBase64 } : c)
      }
    }));
    trackChange();
    setCroppingCourseId(null);
  };

  const currentCroppingCourse = croppingCourseId ? localContent.courses.list.find(c => c.id === croppingCourseId) : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 font-sans transition-colors duration-500">
      <input 
        type="file" 
        ref={genericUploadRef} 
        className="hidden" 
        accept="image/*" 
        multiple
        onChange={handleGenericUpload} 
      />

      {currentCroppingCourse && (
        <ImageCropper 
          imageSrc={currentCroppingCourse.image}
          onCrop={handleApplyCrop}
          onCancel={() => setCroppingCourseId(null)}
          aspectRatio={4/3}
        />
      )}

      {/* Light Professional Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 p-6 sticky top-16 md:top-24 z-[80] shadow-sm">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
              <i className="fa-solid fa-gauge-high text-emerald-600"></i>
              ADMIN PANEL
            </h1>

            <div className={`flex items-center gap-2.5 px-4 py-1.5 border rounded-full transition-all ${serverOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
               <div className="relative">
                 <i className={`fa-solid ${serverOnline ? 'fa-cloud' : 'fa-hard-drive'} text-xs`}></i>
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none">
                 {serverOnline ? 'Cloud Sync Active' : 'Local Storage Mode'}
               </span>
               <div className={`w-1.5 h-1.5 rounded-full animate-pulse ml-1 ${serverOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
            </div>

            {statusMsg && (
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border transition-all ${isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                {statusMsg}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 text-[10px] font-black transition-all border border-slate-200 rounded-lg uppercase tracking-widest flex items-center gap-2"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Log out
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button onClick={handleDiscard} className="px-5 py-2 text-slate-500 hover:text-slate-900 text-[10px] font-black transition-all border border-slate-200 rounded-lg uppercase tracking-widest">DISCARD</button>
              <button onClick={handleSave} className={`px-8 py-2 rounded-lg text-[10px] font-black transition-all shadow-xl uppercase tracking-widest ${hasUnsavedChanges ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 cursor-default shadow-none'}`}>Save Changes</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar - Clean Light Theme */}
        <div className="w-full md:w-64 space-y-4 shrink-0 h-fit z-50">
          <button 
            onClick={() => setActiveTab('leads')} 
            className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all flex items-center gap-4 border shadow-sm group ${activeTab === 'leads' ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl' : 'text-slate-600 bg-white border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700'}`}
          >
              <i className="fa-solid fa-user-graduate shrink-0 text-lg"></i>
              <span className="leading-none text-sm uppercase tracking-widest">Student Leads</span>
          </button>
          
          <div className="h-px bg-slate-200 my-6 opacity-80"></div>
          
          <div className="space-y-2">
            {(['site', 'home', 'pages', 'about', 'academics', 'notices', 'gallery', 'faq', 'form', 'contact', 'footer', 'placements', 'legal', 'career'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all border text-[13px] flex items-center gap-4 ${
                  activeTab === tab 
                    ? 'bg-white border-emerald-500 text-emerald-600 shadow-lg translate-x-1 ring-2 ring-emerald-50' 
                    : 'text-slate-500 bg-white/50 border-transparent hover:bg-white hover:text-slate-900 hover:shadow-md'
                }`}
              >
                <i className={`fa-solid fa-${
                  tab === 'site' ? 'globe' : 
                  tab === 'home' ? 'house' : 
                  tab === 'pages' ? 'file-lines' : 
                  tab === 'about' ? 'circle-info' : 
                  tab === 'academics' ? 'graduation-cap' : 
                  tab === 'notices' ? 'bullhorn' : 
                  tab === 'gallery' ? 'images' : 
                  tab === 'faq' ? 'circle-question' : 
                  tab === 'contact' ? 'address-book' : 
                  tab === 'footer' ? 'shoe-prints' : 
                  tab === 'placements' ? 'briefcase' : 
                  tab === 'career' ? 'user-graduate' : 
                  tab === 'legal' ? 'scale-balanced' : 'wpforms'
                } shrink-0 w-5 text-center`}></i>
                <span className="capitalize leading-normal whitespace-nowrap">
                  {tab === 'form' ? 'Enroll Page' : (tab === 'academics' ? 'Academic Section' : tab)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Bright White Card */}
        <div className="flex-grow bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-2xl shadow-slate-200/50 min-h-[75vh]">
          {!serverOnline && activeTab === 'leads' && (
            <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4 text-amber-800">
               <i className="fa-solid fa-triangle-exclamation text-xl"></i>
               <p className="text-xs font-bold uppercase tracking-tight">Leads require a connection to the Institutional Backend (MySQL). They cannot be managed in Local Mode.</p>
            </div>
          )}
          {activeTab === 'leads' && <LeadsTab leads={localContent.leads || []} onUpdateLeads={(updated) => { setLocalContent(prev => ({ ...prev, leads: updated })); trackChange(); }} />}
          {activeTab === 'site' && <SiteTab data={localContent.site} theme={localContent.theme} updateTheme={(f, v) => updateField('theme', f, v)} updateField={(f, v) => updateField('site', f, v)} onLogoUploadClick={() => triggerGenericUpload('site.logo')} updateNavigation={(idx, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: prev.site.navigation.map((n, i) => i === idx ? { ...n, [f]: v } : n) } })); trackChange(); }} addNavigation={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: [...prev.site.navigation, { label: 'New Link', path: '/' }] } })); trackChange(); }} removeNavigation={(idx) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: prev.site.navigation.filter((_, i) => i !== idx) } })); trackChange(); }} />}
          {activeTab === 'home' && <HomeTab data={localContent.home} updateNestedField={(p, f, v) => updateNestedField('home', p, f, v)} updateHomeSubField={(p, f, v) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, [p]: { ...(prev.home as any)[p], [f]: v } } })); trackChange(); }} onHeroBgClick={() => triggerGenericUpload('home.hero.bgImage')} onShowcaseImgClick={() => triggerGenericUpload('home.bigShowcase.image')} addHighlight={() => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: [...prev.home.highlights, { icon: 'fa-star', title: 'New', description: '' }] } })); trackChange(); }} updateHighlight={(idx, f, v) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: prev.home.highlights.map((h, i) => i === idx ? { ...h, [f]: v } : h) } })); trackChange(); }} deleteHighlight={(idx) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: prev.home.highlights.filter((_, i) => i !== idx) } })); trackChange(); }} reorderSections={(idx, dir) => { setLocalContent(prev => { const order = [...prev.home.sectionOrder]; const t = dir === 'up' ? idx - 1 : idx + 1; if (t >= 0 && t < order.length) [order[idx], order[t]] = [order[t], order[idx]]; return { ...prev, home: { ...prev.home, sectionOrder: order } }; }); trackChange(); }} />}
          {activeTab === 'about' && <AboutTab data={localContent.about} updateChapter={(ch, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, [ch]: { ...(prev.about as any)[ch], [f]: v } } })); trackChange(); }} triggerUpload={(p) => triggerGenericUpload(p)} addTeamMember={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: [...prev.about.faculty.members, { id: Date.now().toString(), name: 'Name', role: 'Role', bio: '', image: 'https://i.pravatar.cc/150' }] } } })); trackChange(); }} updateTeamMember={(id, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: prev.about.faculty.members.map(m => m.id === id ? { ...m, [f]: v } : m) } } })); trackChange(); }} removeTeamMember={(id) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: prev.about.faculty.members.filter(m => m.id !== id) } } })); trackChange(); }} updateStats={(id, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, achievements: { ...prev.about.achievements, stats: prev.about.achievements.stats.map(s => s.id === id ? { ...s, [f]: v } : s) } } })); trackChange(); }} addStat={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, achievements: { ...prev.about.achievements, stats: [...prev.about.achievements.stats, { id: Date.now().toString(), label: 'Stat', value: '0' }] } } })); trackChange(); }} removeStat={(id) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, achievements: { ...prev.about.achievements, stats: prev.about.achievements.stats.filter(s => s.id !== id) } } })); trackChange(); }} updateValues={(idx, v) => { setLocalContent(prev => { const next = [...prev.about.vision.values]; next[idx] = v; return { ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: next } } }; }); trackChange(); }} addValue={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: [...prev.about.vision.values, 'New Value'] } } })); trackChange(); }} removeValue={(idx) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: prev.about.vision.values.filter((_, i) => i !== idx) } } })); trackChange(); }} addExtraChapter={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, extraChapters: [...(prev.about.extraChapters || []), { id: Date.now().toString(), label: 'CH', title: 'Title', story: '', image: '' }] } })); trackChange(); }} updateExtraChapter={(id, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, extraChapters: prev.about.extraChapters.map(c => c.id === id ? { ...c, [f]: v } : c) } })); trackChange(); }} removeExtraChapter={(id) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, extraChapters: prev.about.extraChapters.filter(c => c.id !== id) } })); trackChange(); }} />}
          {activeTab === 'academics' && <AcademicsTab coursesState={localContent.courses} updateCourseItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: prev.courses.list.map(c => c.id === id ? { ...c, [f]: v } : c) } })); trackChange(); }} updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, pageMeta: { ...prev.courses.pageMeta, [f]: v } } })); trackChange(); }} onCourseImageClick={(id) => { activeCourseId.current = id; triggerGenericUpload('courses.list'); }} onCropCardClick={(id) => setCroppingCourseId(id)} addItem={() => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: [{ id: Date.now().toString(), name: 'New Program', duration: '6 Months', mode: 'Offline', academicLevel: 'Certificate (NSDC)', industry: 'General', description: '', status: 'Active', image: 'https://picsum.photos/800/600', price: 'Rs. 0', certification: 'SMS Technical Diploma', eligibility: '', benefits: '' }, ...prev.courses.list] } })); trackChange(); }} deleteItem={(id) => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: prev.courses.list.filter(c => c.id !== id) } })); trackChange(); }} />}
          {activeTab === 'notices' && <NoticesTab noticesState={localContent.notices} updateNoticeItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: prev.notices.list.map(n => n.id === id ? { ...n, [f]: v } : n) } })); trackChange(); }} updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, pageMeta: { ...prev.notices.pageMeta, [f]: v } } })); trackChange(); }} addItem={() => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: [{ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], title: 'Announcement', description: '', isImportant: false, category: 'General' }, ...prev.notices.list] } })); trackChange(); }} deleteItem={(id) => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: prev.notices.list.filter(n => n.id !== id) } })); trackChange(); }} />}
          {activeTab === 'gallery' && <GalleryTab galleryState={localContent.gallery} galleryMetadata={localContent.galleryMetadata} updateGalleryItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, gallery: { ...prev.gallery, list: prev.gallery.list.map(i => i.id === id ? { ...i, [f]: v } : i) } })); trackChange(); }} updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, gallery: { ...prev.gallery, pageMeta: { ...prev.gallery.pageMeta, [f]: v } } })); trackChange(); }} deleteItem={(id) => { setLocalContent(prev => ({ ...prev, gallery: { ...prev.gallery, list: prev.gallery.list.filter(i => i.id !== id) } })); trackChange(); }} triggerUpload={(cat) => { activeUploadCategory.current = cat; triggerGenericUpload('gallery'); }} triggerThumbnailUpload={(cat) => { activeThumbnailCategory.current = cat; triggerGenericUpload('gallery.thumbnails'); }} />}
          {activeTab === 'faq' && <FAQTab faqsState={localContent.faqs} updateFAQ={(id, f, v) => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: prev.faqs.list.map(i => i.id === id ? { ...i, [f]: v } : i) } })); trackChange(); }} updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, pageMeta: { ...prev.faqs.pageMeta, [f]: v } } })); trackChange(); }} addFAQ={() => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: [{ id: Date.now().toString(), question: 'Question?', answer: '', category: 'General' }, ...prev.faqs.list] } })); trackChange(); }} deleteFAQ={(id) => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: prev.faqs.list.filter(i => i.id !== id) } })); trackChange(); }} reorderFAQs={(s, e) => { setLocalContent(prev => { const next = [...prev.faqs.list]; const [rem] = next.splice(s, 1); next.splice(e, 0, rem); return { ...prev, faqs: { ...prev.faqs, list: next } }; }); trackChange(); }} />}
          {activeTab === 'form' && <FormTab formData={localContent.enrollmentForm} addField={() => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: [...prev.enrollmentForm.fields, { id: Date.now().toString(), label: 'New Field', type: 'text', placeholder: '', required: false }] } })); trackChange(); }} updateField={(id, up) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: prev.enrollmentForm.fields.map(f => f.id === id ? { ...f, ...up } : f) } })); trackChange(); }} deleteField={(id) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: prev.enrollmentForm.fields.filter(f => f.id !== id) } })); trackChange(); }} updatePageInfo={(f, v) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, [f]: v } })); trackChange(); }} reorderFields={(s, e) => { setLocalContent(prev => { const next = [...prev.enrollmentForm.fields]; const [rem] = next.splice(s, 1); next.splice(e, 0, rem); return { ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: next } }; }); trackChange(); }} />}
          {activeTab === 'contact' && <ContactTab contact={localContent.site.contact} social={localContent.site.social} contactForm={localContent.contactForm} updateContactField={(f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, contact: { ...prev.site.contact, [f]: v } } })); trackChange(); }} addSocialLink={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: [...prev.site.social, { id: Date.now().toString(), platform: 'New', url: '#', icon: 'fa-globe' }] } })); trackChange(); }} updateSocialLink={(id, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: prev.site.social.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }} removeSocialLink={(id) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: prev.site.social.filter(s => s.id !== id) } })); trackChange(); }} addFormField={() => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: [...prev.contactForm.fields, { id: Date.now().toString(), label: 'New', type: 'text', placeholder: '', required: false }] } })); trackChange(); }} updateFormField={(id, up) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: prev.contactForm.fields.map(f => f.id === id ? { ...f, ...up } : f) } })); trackChange(); }} deleteFormField={(id) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: prev.contactForm.fields.filter(f => f.id !== id) } })); trackChange(); }} updateFormTitle={(v) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, title: v } })); trackChange(); }} />}
          {activeTab === 'footer' && <FooterTab footer={localContent.site.footer} updateFooterField={(f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, [f]: v } } })); trackChange(); }} addSupportLink={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: [...prev.site.footer.supportLinks, { label: 'New', path: '#' }] } } })); trackChange(); }} updateSupportLink={(idx, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: prev.site.footer.supportLinks.map((l, i) => i === idx ? { ...l, [f]: v } : l) } } })); trackChange(); }} deleteSupportLink={(idx) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: prev.site.footer.supportLinks.filter((_, i) => i !== idx) } } })); trackChange(); }} />}
          {activeTab === 'placements' && <PlacementsTab stats={localContent.placements.stats} reviews={localContent.placements.reviews} partners={localContent.placements.partners} pageMeta={localContent.placements.pageMeta} wallTitle={localContent.placements.wallTitle} pageDescription={localContent.placements.pageDescription} updateStat={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: prev.placements.stats.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }} addStat={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: [...prev.placements.stats, { id: Date.now().toString(), label: 'Label', value: '0', icon: 'fa-chart-line' }] } })); trackChange(); }} deleteStat={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: prev.placements.stats.filter(s => s.id !== id) } })); trackChange(); }} updateReview={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: prev.placements.reviews.map(r => r.id === id ? { ...r, [f]: v } : r) } })); trackChange(); }} addReview={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: [{ id: Date.now().toString(), name: 'Name', course: 'Track', company: 'Org', companyIcon: 'fa-building', image: 'https://i.pravatar.cc/150', text: '', salaryIncrease: '' }, ...prev.placements.reviews] } })); trackChange(); }} deleteReview={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: prev.placements.reviews.filter(r => r.id !== id) } })); trackChange(); }} updatePartner={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: prev.placements.partners.map(p => p.id === id ? { ...p, [f]: v } : p) } })); trackChange(); }} addPartner={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: [...prev.placements.partners, { id: Date.now().toString(), name: 'New Partner', icon: 'fa-building' }] } })); trackChange(); }} deletePartner={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: prev.placements.partners.filter(p => p.id !== id) } })); trackChange(); }} updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, pageMeta: { ...prev.placements.pageMeta, [f]: v } } })); trackChange(); }} updateWallTitle={(v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, wallTitle: v } })); trackChange(); }} updatePageDescription={(v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, pageDescription: v } })); trackChange(); }} onReviewImageClick={(id) => { activeReviewId.current = id; triggerGenericUpload('placements.reviews'); }} onPartnerImageClick={(id) => { activePartnerId.current = id; triggerGenericUpload('placements.partners'); }} />}
          {activeTab === 'legal' && <LegalTab legal={localContent.legal} updateLegal={(p, f, v) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], [f]: v } } })); trackChange(); }} updateSection={(p, id, f, v) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: prev.legal[p].sections.map(s => s.id === id ? { ...s, [f]: v } : s) } } })); trackChange(); }} addSection={(p) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: [...prev.legal[p].sections, { id: Date.now().toString(), title: 'New Section', content: '' }] } } })); trackChange(); }} deleteSection={(p, id) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: prev.legal[p].sections.filter(s => s.id !== id) } } })); trackChange(); }} />}
          {activeTab === 'career' && <CareerTab career={localContent.career} updateHero={(f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, hero: { ...prev.career.hero, [f]: v } } })); trackChange(); }} updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, pageMeta: { ...prev.career.pageMeta, [f]: v } } })); trackChange(); }} updateCta={(f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, cta: { ...prev.career.cta, [f]: v } } })); trackChange(); }} updateService={(id, f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: prev.career.services.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }} addService={() => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: [...prev.career.services, { id: Date.now().toString(), title: 'New Service', description: '', icon: 'fa-compass' }] } })); trackChange(); }} deleteService={(id) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: prev.career.services.filter(s => s.id !== id) } })); trackChange(); }} onHeroBgClick={() => triggerGenericUpload('career.hero.bgImage')} onServiceImageClick={(id) => { activeCareerServiceId.current = id; triggerGenericUpload('career.services'); }} />}
          {activeTab === 'pages' && <PagesTab pages={localContent.customPages} addPage={() => { setLocalContent(prev => ({ ...prev, customPages: [...prev.customPages, { id: Date.now().toString(), title: 'New Page', slug: '/new', content: '', visible: false, showHeader: true }] })); trackChange(); }} updatePage={(id, up) => { setLocalContent(prev => ({ ...prev, customPages: prev.customPages.map(p => p.id === id ? { ...p, ...up } : p) })); trackChange(); }} deletePage={(id) => { setLocalContent(prev => ({ ...prev, customPages: prev.customPages.filter(p => p.id !== id) })); trackChange(); }} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
