
import React, { useState, useRef } from 'react';
import { AppState, Course, Notice, GalleryItem, FormField } from '../types.ts';

interface AdminDashboardProps {
  content: AppState;
  onUpdate: (newContent: AppState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'site' | 'home' | 'courses' | 'notices' | 'gallery' | 'form'>('site');
  const [localContent, setLocalContent] = useState(content);
  const [statusMsg, setStatusMsg] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const courseInputRef = useRef<HTMLInputElement>(null);
  const heroBgInputRef = useRef<HTMLInputElement>(null);
  
  const activeUploadCategory = useRef<string>('General');
  const activeThumbnailCategory = useRef<string | null>(null);
  const activeCourseId = useRef<string | null>(null);

  const handleSave = () => {
    onUpdate(localContent);
    setStatusMsg('Changes saved successfully! All updates are now live.');
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('site', 'logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateNestedField('home', 'hero', 'bgImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerGalleryUpload = (category: string) => {
    activeUploadCategory.current = category;
    galleryInputRef.current?.click();
  };

  const triggerThumbnailUpload = (category: string) => {
    activeThumbnailCategory.current = category;
    thumbnailInputRef.current?.click();
  };

  const triggerCourseUpload = (id: string) => {
    activeCourseId.current = id;
    courseInputRef.current?.click();
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const category = activeThumbnailCategory.current;
    if (file && category) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalContent(prev => ({
          ...prev,
          galleryMetadata: {
            ...(prev.galleryMetadata || {}),
            [category]: reader.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCourseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = activeCourseId.current;
    if (file && id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCourseItem(id, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: GalleryItem = {
          id: Date.now().toString(),
          url: reader.result as string,
          category: activeUploadCategory.current,
          title: ''
        };
        setLocalContent(prev => ({
          ...prev,
          gallery: [newItem, ...prev.gallery]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (section: keyof AppState, field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
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
  };

  const updateHomeSubField = (parent: string, field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      home: {
        ...prev.home,
        [parent]: {
          ...(prev.home as any)[parent],
          [field]: value
        }
      }
    }));
  };

  const updateSectionVisibility = (sectionName: string, value: boolean) => {
    setLocalContent(prev => ({
      ...prev,
      home: {
        ...prev.home,
        sections: {
          ...prev.home.sections,
          [sectionName]: value
        }
      }
    }));
  };

  const updateGalleryItem = (id: string, field: keyof GalleryItem, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      gallery: prev.gallery.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const updateCourseItem = (id: string, field: keyof Course, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const updateNoticeItem = (id: string, field: keyof Notice, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      notices: prev.notices.map(n => n.id === id ? { ...n, [field]: value } : n)
    }));
  };

  const addHighlight = () => {
    setLocalContent(prev => ({
      ...prev,
      home: {
        ...prev.home,
        highlights: [...prev.home.highlights, { icon: 'fa-star', title: 'New Highlight', description: 'Brief description...' }]
      }
    }));
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      home: {
        ...prev.home,
        highlights: prev.home.highlights.map((h, i) => i === index ? { ...h, [field]: value } : h)
      }
    }));
  };

  const deleteHighlight = (index: number) => {
    setLocalContent(prev => ({
      ...prev,
      home: {
        ...prev.home,
        highlights: prev.home.highlights.filter((_, i) => i !== index)
      }
    }));
  };

  const addFormField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field Label',
      type: 'text',
      placeholder: 'Enter placeholder...',
      required: false,
      options: []
    };
    setLocalContent(prev => ({
      ...prev,
      enrollmentForm: {
        ...prev.enrollmentForm,
        fields: [...prev.enrollmentForm.fields, newField]
      }
    }));
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setLocalContent(prev => ({
      ...prev,
      enrollmentForm: {
        ...prev.enrollmentForm,
        fields: prev.enrollmentForm.fields.map(f => f.id === id ? { ...f, ...updates } : f)
      }
    }));
  };

  const addSelectOption = (fieldId: string) => {
    const field = localContent.enrollmentForm.fields.find(f => f.id === fieldId);
    if (!field) return;
    const currentOptions = field.options || [];
    updateFormField(fieldId, { options: [...currentOptions, `New Option ${currentOptions.length + 1}`] });
  };

  const updateSelectOption = (fieldId: string, index: number, value: string) => {
    const field = localContent.enrollmentForm.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;
    const newOptions = [...field.options];
    newOptions[index] = value;
    updateFormField(fieldId, { options: newOptions });
  };

  const deleteSelectOption = (fieldId: string, index: number) => {
    const field = localContent.enrollmentForm.fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;
    const newOptions = field.options.filter((_, i) => i !== index);
    updateFormField(fieldId, { options: newOptions });
  };

  const deleteFormField = (id: string) => {
    setLocalContent(prev => ({
      ...prev,
      enrollmentForm: {
        ...prev.enrollmentForm,
        fields: prev.enrollmentForm.fields.filter(f => f.id !== id)
      }
    }));
  };

  const addItem = (section: 'courses' | 'notices', item: any) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), { ...item, id: Date.now().toString() }]
    }));
  };

  const deleteItem = (section: 'courses' | 'notices' | 'gallery', id: string) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((item: any) => item.id !== id)
    }));
  };

  const galleryCategories = Array.from(new Set([
    'Campus', 'Events', 'Classroom', 'Achievement', 'Project', 
    ...localContent.gallery.map(item => item.category)
  ]));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleGalleryUpload} />
      <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
      <input type="file" ref={courseInputRef} className="hidden" accept="image/*" onChange={handleCourseImageUpload} />
      <input type="file" ref={heroBgInputRef} className="hidden" accept="image/*" onChange={handleHeroBgUpload} />

      {/* Admin Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-16 z-40 shadow-2xl">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight">
              <i className="fa-solid fa-gauge-high text-emerald-500"></i>
              INSTITUTE ADMIN
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">Creative Control Suite</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-black shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <i className="fa-solid fa-check mr-2"></i> SAVE ALL CHANGES
            </button>
          </div>
        </div>
        {statusMsg && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg text-center text-xs font-black animate-pulse">
            {statusMsg}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          {(['site', 'home', 'courses', 'notices', 'gallery', 'form'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all capitalize flex items-center gap-3 border ${
                activeTab === tab 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl translate-x-1' 
                  : 'text-slate-500 border-transparent hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid fa-${
                tab === 'site' ? 'globe' : 
                tab === 'home' ? 'house' : 
                tab === 'courses' ? 'graduation-cap' : 
                tab === 'notices' ? 'bullhorn' : 
                tab === 'gallery' ? 'images' : 'wpforms'
              } text-lg`}></i>
              {tab === 'form' ? 'Apply Form' : tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-slate-700 shadow-3xl overflow-hidden min-h-[70vh]">
          
          {/* HOME TAB - EXHAUSTIVE CUSTOMIZATION */}
          {activeTab === 'home' && (
            <div className="space-y-16 animate-fade-in">
              <SectionHeader title="Home Experience" />

              {/* Hero Banner */}
              <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
                <div className="flex justify-between items-center">
                   <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
                     <i className="fa-solid fa-wand-magic-sparkles"></i> HERO BANNER
                   </h3>
                   <button 
                    onClick={() => updateNestedField('home', 'hero', 'visible', !localContent.home.hero.visible)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${localContent.home.hero.visible ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    {localContent.home.hero.visible ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">Background Image</label>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 group">
                      <img src={localContent.home.hero.bgImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <button onClick={() => heroBgInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs uppercase">
                        <i className="fa-solid fa-camera mr-2 text-xl"></i> Change Image
                      </button>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <input value={localContent.home.hero.title} onChange={e => updateNestedField('home', 'hero', 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-white font-black" placeholder="Main Headline" />
                    <textarea value={localContent.home.hero.subtitle} onChange={e => updateNestedField('home', 'hero', 'subtitle', e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-slate-300 font-medium resize-none" placeholder="Subtitle" />
                    <div className="grid grid-cols-2 gap-4">
                      <input value={localContent.home.hero.ctaText} onChange={e => updateNestedField('home', 'hero', 'ctaText', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white" placeholder="CTA Text" />
                      <input value={localContent.home.hero.ctaLink} onChange={e => updateNestedField('home', 'hero', 'ctaLink', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-emerald-400" placeholder="CTA Link" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Labels (Titles/Subtitles) */}
              <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
                <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
                  <i className="fa-solid fa-heading"></i> SECTION TITLES & LABELS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Notices Labels */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">Notices Section</h4>
                    <input value={localContent.home.sectionLabels.noticesTitle} onChange={e => updateHomeSubField('sectionLabels', 'noticesTitle', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white font-bold" placeholder="Title" />
                    <input value={localContent.home.sectionLabels.noticesSubtitle} onChange={e => updateHomeSubField('sectionLabels', 'noticesSubtitle', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-xs text-slate-400" placeholder="Subtitle" />
                  </div>
                  {/* Courses Labels */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">Courses Section</h4>
                    <input value={localContent.home.sectionLabels.coursesTitle} onChange={e => updateHomeSubField('sectionLabels', 'coursesTitle', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white font-bold" placeholder="Title" />
                    <input value={localContent.home.sectionLabels.coursesSubtitle} onChange={e => updateHomeSubField('sectionLabels', 'coursesSubtitle', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-xs text-slate-400" placeholder="Subtitle" />
                  </div>
                </div>
              </div>

              {/* Bottom CTA Block */}
              <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
                <div className="flex justify-between items-center">
                   <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
                     <i className="fa-solid fa-bullhorn"></i> BOTTOM CTA BANNER
                   </h3>
                   <button 
                    onClick={() => updateHomeSubField('ctaBlock', 'visible', !localContent.home.ctaBlock.visible)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${localContent.home.ctaBlock.visible ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    {localContent.home.ctaBlock.visible ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </div>
                <div className="space-y-4">
                  <input value={localContent.home.ctaBlock.title} onChange={e => updateHomeSubField('ctaBlock', 'title', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-white font-black" placeholder="Main CTA Title" />
                  <textarea value={localContent.home.ctaBlock.subtitle} onChange={e => updateHomeSubField('ctaBlock', 'subtitle', e.target.value)} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-slate-300 font-medium resize-none" placeholder="CTA Subtitle" />
                  <div className="grid grid-cols-2 gap-4">
                    <input value={localContent.home.ctaBlock.buttonText} onChange={e => updateHomeSubField('ctaBlock', 'buttonText', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white" placeholder="Button Text" />
                    <input value={localContent.home.ctaBlock.buttonLink} onChange={e => updateHomeSubField('ctaBlock', 'buttonLink', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-emerald-400" placeholder="Button Link" />
                  </div>
                </div>
              </div>

              {/* Highlights Manager */}
              <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-list-check"></i> HIGHLIGHT CARDS</h3>
                  <button onClick={addHighlight} className="text-xs font-black bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-full shadow-lg transition-all">ADD HIGHLIGHT</button>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {localContent.home.highlights.map((item, idx) => (
                    <div key={idx} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4 group relative">
                      <button onClick={() => deleteHighlight(idx)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-xl z-10"><i className="fa-solid fa-xmark"></i></button>
                      <input value={item.title} onChange={e => updateHighlight(idx, 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-black" placeholder="Title" />
                      <textarea value={item.description} onChange={e => updateHighlight(idx, 'description', e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-400 resize-none" placeholder="Description" />
                      <input value={item.icon} onChange={e => updateHighlight(idx, 'icon', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-[10px] font-mono text-emerald-500" placeholder="FontAwesome Class" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SITE TAB */}
          {activeTab === 'site' && (
            <div className="space-y-12 animate-fade-in">
              <SectionHeader title="Global Brand Settings" />
              <div className="bg-slate-900/50 p-10 rounded-[2rem] border border-slate-700 text-center">
                 <div className="relative inline-block group mb-6">
                   <div className="w-40 h-40 rounded-full border-8 border-slate-800 overflow-hidden bg-slate-800 flex items-center justify-center transition-all group-hover:border-emerald-500/50 shadow-2xl">
                      {localContent.site.logo ? <img src={localContent.site.logo} className="w-full h-full object-cover" /> : <i className="fa-solid fa-building-columns text-5xl text-slate-700"></i>}
                   </div>
                   <button onClick={() => logoInputRef.current?.click()} className="absolute bottom-1 right-1 w-12 h-12 bg-emerald-600 rounded-full border-4 border-slate-800 flex items-center justify-center text-white hover:bg-emerald-500 transition-colors shadow-xl">
                     <i className="fa-solid fa-camera text-lg"></i>
                   </button>
                   <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">{localContent.site.name || 'Your Institute'}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Institute Official Name</label>
                  <input value={localContent.site.name} onChange={e => updateField('site', 'name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Brand Tagline</label>
                  <input value={localContent.site.tagline} onChange={e => updateField('site', 'tagline', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex justify-between items-center">
                <SectionHeader title="Program Management" />
                <button 
                  onClick={() => addItem('courses', {
                    name: 'New Program',
                    duration: '0 Months',
                    mode: 'Hybrid',
                    description: 'Description here...',
                    status: 'Active',
                    image: 'https://picsum.photos/id/1/800/600',
                    price: '$0'
                  })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> ADD PROGRAM
                </button>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {localContent.courses.map(course => (
                  <div key={course.id} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700 group transition-all hover:border-emerald-500/30">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                      <div className="lg:col-span-1">
                         <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-800 mb-4 group/img cursor-pointer" onClick={() => triggerCourseUpload(course.id)}>
                            <img src={course.image} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"><i className="fa-solid fa-upload text-white text-2xl"></i></div>
                         </div>
                      </div>
                      <div className="lg:col-span-3 space-y-4">
                        <div className="flex justify-between items-center">
                          <input value={course.name} onChange={e => updateCourseItem(course.id, 'name', e.target.value)} className="text-xl font-black bg-transparent border-b border-slate-700 text-white w-full mr-4 focus:border-emerald-500 outline-none" />
                          <button onClick={() => deleteItem('courses', course.id)} className="text-red-500 hover:text-red-400 p-2"><i className="fa-solid fa-trash-can"></i></button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           <input value={course.duration} onChange={e => updateCourseItem(course.id, 'duration', e.target.value)} className="bg-slate-800 p-2 rounded text-sm text-white" placeholder="Duration" />
                           <input value={course.price} onChange={e => updateCourseItem(course.id, 'price', e.target.value)} className="bg-slate-800 p-2 rounded text-sm text-white" placeholder="Price" />
                           <select value={course.status} onChange={e => updateCourseItem(course.id, 'status', e.target.value)} className="bg-slate-800 p-2 rounded text-sm text-white">
                             <option value="Active">Active</option>
                             <option value="Inactive">Inactive</option>
                           </select>
                        </div>
                        <textarea value={course.description} onChange={e => updateCourseItem(course.id, 'description', e.target.value)} className="w-full bg-slate-800 p-3 rounded text-sm text-slate-300 resize-none" rows={2} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTICES TAB */}
          {activeTab === 'notices' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex justify-between items-center">
                <SectionHeader title="Board Management" />
                <button 
                  onClick={() => addItem('notices', {
                    date: new Date().toISOString().split('T')[0],
                    title: 'New Announcement',
                    description: 'Important details...',
                    isImportant: false,
                    category: 'General'
                  })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> NEW NOTICE
                </button>
              </div>
              <div className="space-y-6">
                {localContent.notices.map(notice => (
                  <div key={notice.id} className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-slate-700 group hover:border-emerald-500/30 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                        <input value={notice.title} onChange={e => updateNoticeItem(notice.id, 'title', e.target.value)} className="font-bold text-white bg-transparent border-b border-slate-700 outline-none w-full focus:border-emerald-500" />
                        <div className="flex gap-2">
                           <input type="date" value={notice.date} onChange={e => updateNoticeItem(notice.id, 'date', e.target.value)} className="bg-slate-800 rounded px-2 text-xs text-slate-400" />
                           <select value={notice.category} onChange={e => updateNoticeItem(notice.id, 'category', e.target.value as any)} className="bg-slate-800 rounded px-2 text-xs text-slate-400">
                             <option value="General">General</option>
                             <option value="Urgent">Urgent</option>
                             <option value="New">New</option>
                             <option value="Holiday">Holiday</option>
                             <option value="Event">Event</option>
                           </select>
                        </div>
                        <textarea value={notice.description} onChange={e => updateNoticeItem(notice.id, 'description', e.target.value)} className="md:col-span-2 bg-slate-800 rounded-lg p-3 text-sm text-slate-300 w-full resize-none" rows={2} />
                      </div>
                      <button onClick={() => deleteItem('notices', notice.id)} className="text-red-500 hover:text-red-400 p-2"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <SectionHeader title="Media Albums" />
                <div className="flex gap-2 w-full md:w-auto">
                  <input type="text" placeholder="New Album Name..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none w-full" />
                  <button onClick={() => { if(newCategoryName.trim()) { triggerGalleryUpload(newCategoryName.trim()); setNewCategoryName(''); } }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 border border-slate-600">CREATE</button>
                </div>
              </div>
              <div className="space-y-16">
                {galleryCategories.map(category => {
                  const items = localContent.gallery.filter(item => item.category === category);
                  const thumbnail = localContent.galleryMetadata?.[category];
                  return (
                    <div key={category} className="space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-700/50 pb-6 gap-6">
                        <div className="flex items-center gap-5">
                          <div onClick={() => triggerThumbnailUpload(category)} className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 cursor-pointer group relative shrink-0">
                            {thumbnail ? <img src={thumbnail} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" /> : <div className="w-full h-full flex items-center justify-center text-slate-700 group-hover:text-emerald-500 transition-colors"><i className="fa-solid fa-image text-xl"></i></div>}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white">{category}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{items.length} Photos</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                           <button onClick={() => triggerThumbnailUpload(category)} className="bg-slate-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-slate-600 hover:bg-slate-600">Cover</button>
                           <button onClick={() => triggerGalleryUpload(category)} className="bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500">Add Photo</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {items.map(item => (
                          <div key={item.id} className="bg-slate-900/40 p-4 rounded-[1.5rem] border border-slate-700/50 group relative hover:border-emerald-500/20 transition-all">
                            <img src={item.url} className="w-full aspect-video object-cover rounded-xl" />
                            <button onClick={() => deleteItem('gallery', item.id)} className="absolute top-6 right-6 w-8 h-8 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-trash-can text-xs"></i></button>
                            <input value={item.title} onChange={e => updateGalleryItem(item.id, 'title', e.target.value)} className="w-full bg-slate-800/50 mt-4 border border-slate-700 rounded px-2 py-1 text-xs text-white" placeholder="Caption..." />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FORM TAB */}
          {activeTab === 'form' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex justify-between items-center">
                <SectionHeader title="Admission Form Builder" />
                <button onClick={addFormField} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl transition-all flex items-center gap-2"><i className="fa-solid fa-plus"></i> ADD FIELD</button>
              </div>
              <div className="space-y-6">
                {localContent.enrollmentForm.fields.map((field, idx) => (
                  <div key={field.id} className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-slate-700 flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center flex-grow">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-black shrink-0">{idx + 1}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-grow w-full">
                        <input value={field.label} onChange={e => updateFormField(field.id, { label: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Label" />
                        <select value={field.type} onChange={e => updateFormField(field.id, { type: e.target.value as any })} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
                            <option value="text">Short Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                            <option value="course-select">Course Dropdown</option>
                            <option value="select">Custom Dropdown</option>
                            <option value="textarea">Long Text</option>
                        </select>
                        <input value={field.placeholder} onChange={e => updateFormField(field.id, { placeholder: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Placeholder" />
                        <div className="flex gap-2">
                           <button onClick={() => updateFormField(field.id, { required: !field.required })} className={`flex-grow rounded-lg text-xs font-black ${field.required ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}>{field.required ? 'REQUIRED' : 'OPTIONAL'}</button>
                           <button onClick={() => deleteFormField(field.id)} className="w-10 h-10 bg-red-600/10 text-red-500 rounded-lg"><i className="fa-solid fa-trash-can"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-6 mb-8">
    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
    <div className="flex-grow h-px bg-slate-700 opacity-50"></div>
  </div>
);

export default AdminDashboard;
