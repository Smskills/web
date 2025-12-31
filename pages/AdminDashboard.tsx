
import React, { useState, useRef } from 'react';
import { AppState, Course, Notice, GalleryItem } from '../types';

interface AdminDashboardProps {
  content: AppState;
  onUpdate: (newContent: AppState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'site' | 'home' | 'courses' | 'notices' | 'gallery'>('site');
  const [localContent, setLocalContent] = useState(content);
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(localContent);
    setStatusMsg('Changes saved successfully! Refresh the public site to see updates.');
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

  const addItem = (section: 'courses' | 'notices' | 'gallery', item: any) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: [...prev[section], { ...item, id: Date.now().toString() }]
    }));
  };

  const deleteItem = (section: 'courses' | 'notices' | 'gallery', id: string) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== id)
    }));
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localContent, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "site_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-16 z-40">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <i className="fa-solid fa-gauge-high text-emerald-500"></i>
              Control Panel
            </h1>
            <p className="text-slate-400 text-sm">Professional Content Management Suite</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadJson}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold transition-all"
            >
              <i className="fa-solid fa-download mr-2"></i> Export
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              <i className="fa-solid fa-check mr-2"></i> Save Changes
            </button>
          </div>
        </div>
        {statusMsg && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-center text-sm font-bold">
            {statusMsg}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          {(['site', 'home', 'courses', 'notices', 'gallery'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all capitalize ${
                activeTab === tab ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid fa-${tab === 'site' ? 'globe' : tab === 'home' ? 'house' : tab === 'courses' ? 'graduation-cap' : tab === 'notices' ? 'bullhorn' : 'images'} mr-3`}></i>
              {tab} Settings
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-grow bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          {activeTab === 'site' && (
            <div className="space-y-8">
              <SectionHeader title="Global Brand Settings" />
              
              {/* Instagram-style Logo Adjustment Section */}
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700 mb-8">
                <div className="flex flex-col items-center text-center">
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Institute Identity</h3>
                   
                   <div className="relative group">
                     <div className="w-32 h-32 rounded-full border-4 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center transition-all group-hover:border-emerald-500 shadow-inner">
                        {localContent.site.logo ? (
                          <img src={localContent.site.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <i className="fa-solid fa-building-columns text-4xl text-slate-700"></i>
                        )}
                     </div>
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-full border-4 border-slate-800 flex items-center justify-center text-white hover:bg-emerald-500 transition-colors shadow-lg"
                       title="Change Logo"
                     >
                       <i className="fa-solid fa-camera text-sm"></i>
                     </button>
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*" 
                       onChange={handleLogoUpload}
                     />
                   </div>
                   
                   <div className="mt-6 space-y-2">
                     <h4 className="font-bold text-lg">{localContent.site.name}</h4>
                     <p className="text-xs text-slate-500">Click the camera icon to upload and adjust your profile logo.</p>
                     <button 
                        onClick={() => updateField('site', 'logo', '')}
                        className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-tighter"
                      >
                        Remove Logo
                      </button>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Institute Name" value={localContent.site.name} onChange={(v) => updateField('site', 'name', v)} />
                <Input label="Tagline" value={localContent.site.tagline} onChange={(v) => updateField('site', 'tagline', v)} />
                <Input label="Support Email" value={localContent.site.contact.email} onChange={(v) => updateNestedField('site', 'contact', 'email', v)} />
                <Input label="Support Phone" value={localContent.site.contact.phone} onChange={(v) => updateNestedField('site', 'contact', 'phone', v)} />
              </div>
              <Input label="Full Address" value={localContent.site.contact.address} onChange={(v) => updateNestedField('site', 'contact', 'address', v)} />
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-8">
              <SectionHeader title="Homepage Hero Section" />
              <Input label="Hero Title" value={localContent.home.hero.title} onChange={(v) => updateNestedField('home', 'hero', 'title', v)} />
              <Input label="Hero Subtitle" value={localContent.home.hero.subtitle} onChange={(v) => updateNestedField('home', 'hero', 'subtitle', v)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="CTA Button Text" value={localContent.home.hero.ctaText} onChange={(v) => updateNestedField('home', 'hero', 'ctaText', v)} />
                <Input label="Hero Background Image URL" value={localContent.home.hero.bgImage} onChange={(v) => updateNestedField('home', 'hero', 'bgImage', v)} />
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-8">
              <SectionHeader title="Manage Courses" />
              <div className="space-y-4">
                {localContent.courses.map(course => (
                  <div key={course.id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={course.image} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <h4 className="font-bold">{course.name}</h4>
                        <p className="text-xs text-slate-400">{course.duration} • {course.mode}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteItem('courses', course.id)}
                      className="text-red-400 hover:text-red-500 p-2"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700">
                <h5 className="font-bold mb-4 text-emerald-400">Add New Course</h5>
                <button 
                  onClick={() => addItem('courses', { 
                    name: 'New Course', 
                    duration: '4 Months', 
                    mode: 'Hybrid', 
                    description: 'New course description.', 
                    status: 'Active', 
                    image: 'https://picsum.photos/id/10/800/600', 
                    price: '$0' 
                  })}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
                >
                  + Create New Course Template
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-8">
              <SectionHeader title="Notice Board Management" />
              <div className="space-y-4">
                {localContent.notices.map(notice => (
                  <div key={notice.id} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                    <div className="flex justify-between mb-2">
                       <span className="text-xs font-bold text-emerald-400">{notice.date}</span>
                       <button onClick={() => deleteItem('notices', notice.id)} className="text-red-400"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <h4 className="font-bold">{notice.title}</h4>
                    {notice.isImportant && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 rounded">Important</span>}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => addItem('notices', { date: new Date().toISOString().split('T')[0], title: 'New Notice', description: 'Notice content here.', isImportant: false })}
                className="w-full py-4 bg-slate-900 rounded-xl font-bold border border-slate-700 hover:bg-slate-900/50"
              >
                Publish New Notice
              </button>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <SectionHeader title="Gallery Management" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {localContent.gallery.map(img => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-700">
                    <img src={img.url} className="w-full h-32 object-cover" />
                    <button 
                      onClick={() => deleteItem('gallery', img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fa-solid fa-trash text-[10px]"></i>
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addItem('gallery', { url: 'https://picsum.photos/800/600', category: 'Events', title: 'New Image' })}
                  className="w-full h-32 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                >
                  <i className="fa-solid fa-plus text-xl mb-2"></i>
                  <span className="text-xs font-bold uppercase">Add Photo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Non-technical user instructions */}
      <div className="container mx-auto px-4 mt-12 mb-20">
        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-3xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-info"></i>
            User Guide for Administrators
          </h3>
          <ul className="space-y-3 text-slate-300 text-sm list-disc pl-5">
            <li><strong>Logo Studio:</strong> Use the circular preview to upload your official institute profile picture. It will automatically be formatted for the header.</li>
            <li><strong>Text Edits:</strong> Type directly into the fields and click "Save Changes" at the top.</li>
            <li><strong>JSON Portability:</strong> Use "Export" to save a file of your current site configuration.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Internal sub-components for the admin panel
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-4 mb-6">
    <h2 className="text-xl font-bold text-white uppercase tracking-wider">{title}</h2>
    <div className="flex-grow h-px bg-slate-700"></div>
  </div>
);

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <input 
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-all text-slate-200"
    />
  </div>
);

export default AdminDashboard;
