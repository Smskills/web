
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
  
  const activeUploadCategory = useRef<string>('General');
  const activeThumbnailCategory = useRef<string | null>(null);

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

  const triggerGalleryUpload = (category: string) => {
    activeUploadCategory.current = category;
    galleryInputRef.current?.click();
  };

  const triggerThumbnailUpload = (category: string) => {
    activeThumbnailCategory.current = category;
    thumbnailInputRef.current?.click();
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

  const addFormField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field Label',
      type: 'text',
      placeholder: 'Enter placeholder...',
      required: false
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
    'Classroom', 'Achievement', 'Project', 'Event', 
    ...localContent.gallery.map(item => item.category)
  ]));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleGalleryUpload} />
      <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={handleThumbnailUpload} />

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
              <i className="fa-solid fa-check mr-2"></i> SAVE CHANGES
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
              {tab === 'form' ? 'Application Form' : tab}
            </button>
          ))}
        </div>

        <div className="flex-grow bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-slate-700 shadow-3xl overflow-hidden min-h-[70vh]">
          
          {/* FORM BUILDER TAB */}
          {activeTab === 'form' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex justify-between items-center">
                <SectionHeader title="Application Form Builder" />
                <button 
                  onClick={addFormField}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> ADD FIELD
                </button>
              </div>

              <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-700 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Form Header Title</label>
                    <input 
                      value={localContent.enrollmentForm.title} 
                      onChange={e => updateNestedField('enrollmentForm', 'title', '', e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Form Description</label>
                    <input 
                      value={localContent.enrollmentForm.description} 
                      onChange={e => updateNestedField('enrollmentForm', 'description', '', e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {localContent.enrollmentForm.fields.map((field, idx) => (
                  <div key={field.id} className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-slate-700 flex flex-col lg:flex-row gap-6 items-start lg:items-center group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-black shrink-0">
                      {idx + 1}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-grow w-full">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Field Label</label>
                        <input 
                          value={field.label} 
                          onChange={e => updateFormField(field.id, { label: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Input Type</label>
                        <select 
                          value={field.type} 
                          onChange={e => updateFormField(field.id, { type: e.target.value as any })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
                        >
                          <option value="text">Short Text</option>
                          <option value="email">Email Address</option>
                          <option value="tel">Phone Number</option>
                          <option value="course-select">Course Dropdown (Auto)</option>
                          <option value="select">Custom Dropdown</option>
                          <option value="textarea">Long Text/Message</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Placeholder</label>
                        <input 
                          value={field.placeholder} 
                          onChange={e => updateFormField(field.id, { placeholder: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div className="flex items-end gap-4">
                        <div className="flex-grow flex items-center justify-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                           <span className="text-[10px] font-black text-slate-500 uppercase">Required?</span>
                           <button 
                             onClick={() => updateFormField(field.id, { required: !field.required })}
                             className={`w-10 h-5 rounded-full flex items-center px-1 transition-all ${field.required ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'}`}
                           >
                             <div className="w-3 h-3 bg-white rounded-full"></div>
                           </button>
                        </div>
                        <button 
                          onClick={() => deleteFormField(field.id)}
                          className="w-10 h-10 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {localContent.enrollmentForm.fields.length === 0 && (
                  <div className="py-20 text-center bg-slate-900/20 rounded-[2rem] border-2 border-dashed border-slate-700">
                    <i className="fa-solid fa-wpforms text-4xl text-slate-700 mb-4 block"></i>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No fields added to your application form yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <SectionHeader title="Media Library & Albums" />
                <div className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="New Category Name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none w-full"
                  />
                  <button 
                    onClick={() => {
                      if(newCategoryName.trim()) {
                        triggerGalleryUpload(newCategoryName.trim());
                        setNewCategoryName('');
                      }
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border border-slate-600"
                  >
                    <i className="fa-solid fa-folder-plus mr-2"></i> Create Section
                  </button>
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
                          <div 
                            onClick={() => triggerThumbnailUpload(category)}
                            className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 cursor-pointer group relative shrink-0"
                          >
                            {thumbnail ? (
                              <img src={thumbnail} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-700 group-hover:text-emerald-500 transition-colors">
                                <i className="fa-solid fa-image text-xl"></i>
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-[8px] font-black text-white uppercase text-center p-1">
                              Set Album Cover
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-black text-white">{category}</h3>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{items.length} Photos Stored</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => triggerThumbnailUpload(category)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-600"
                          >
                            <i className="fa-solid fa-camera mr-2"></i> Cover
                          </button>
                          <button 
                            onClick={() => triggerGalleryUpload(category)}
                            className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all"
                          >
                            <i className="fa-solid fa-plus mr-2"></i> Add Photo
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {items.map(item => (
                          <div key={item.id} className="bg-slate-900/40 p-4 rounded-[1.5rem] border border-slate-700/50 flex flex-col gap-4 group hover:border-emerald-500/30 transition-all shadow-sm">
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800">
                              <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                              <button 
                                onClick={() => deleteItem('gallery', item.id)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 shadow-xl"
                              >
                                <i className="fa-solid fa-trash-can text-xs"></i>
                              </button>
                            </div>
                            <div className="space-y-3 px-1">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Caption (Optional)</label>
                                <input 
                                  value={item.title} 
                                  placeholder="Describe this photo..."
                                  onChange={e => updateGalleryItem(item.id, 'title', e.target.value)} 
                                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none" 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SITE TAB */}
          {activeTab === 'site' && (
            <div className="space-y-12 animate-fade-in">
              <SectionHeader title="Global Brand" />
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

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="space-y-12 animate-fade-in">
              <SectionHeader title="Home Page Configuration" />
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-700 space-y-8">
                  <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-wand-magic-sparkles"></i> HERO EXPERIENCE</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-900 rounded-2xl border border-slate-700">
                      <div>
                        <span className="text-sm font-black text-white block">Hero Visibility</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Show/Hide the main introduction section</span>
                      </div>
                      <button 
                        onClick={() => updateNestedField('home', 'hero', 'visible', !localContent.home.hero.visible)}
                        className={`w-14 h-7 rounded-full transition-all flex items-center px-1.5 ${localContent.home.hero.visible ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'}`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Main Title Headline</label>
                      <input value={localContent.home.hero.title} onChange={e => updateNestedField('home', 'hero', 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-200 font-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs omitted for brevity as they haven't changed */}

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
