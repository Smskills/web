
import React from 'react';
import { AppState } from '../types.ts';

interface HomeTabProps {
  data: AppState['home'];
  updateNestedField: (parent: string, field: string, value: any) => void;
  updateHomeSubField: (parent: string, field: string, value: any) => void;
  onHeroBgClick: () => void;
  onShowcaseImgClick: () => void;
  addHighlight: () => void;
  updateHighlight: (index: number, field: string, value: string) => void;
  deleteHighlight: (index: number, title: string) => void;
  reorderSections: (idx: number, direction: 'up' | 'down') => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ 
  data, 
  updateNestedField, 
  updateHomeSubField, 
  onHeroBgClick,
  onShowcaseImgClick,
  addHighlight, 
  updateHighlight, 
  deleteHighlight,
  reorderSections
}) => {
  const handleDeleteHighlight = (idx: number, title: string) => {
    deleteHighlight(idx, title);
  };

  const sectionLabels: Record<string, string> = {
    highlights: 'Institutional Highlights',
    industryTieups: 'Partner Network Ticker',
    placementReviews: 'Student Success Stories',
    notices: 'Campus Bulletin Board',
    featuredCourses: 'Curriculum Showcase',
    bigShowcase: 'Full-Width Vision Panel'
  };

  return (
    <div className="space-y-16 animate-fade-in text-slate-900">
      <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight shrink-0">Home Management</h2>
      </div>

      <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-arrows-up-down"></i> LAYOUT SEQUENCE</h3>
        <div className="space-y-3 max-w-2xl">
          {data.sectionOrder.map((sid, idx) => (
            <div key={sid} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 group hover:border-emerald-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">{idx + 1}</span>
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{sectionLabels[sid] || sid}</span>
                <button 
                  onClick={() => updateHomeSubField('sections', sid, !(data.sections as any)[sid])} 
                  className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all ${ (data.sections as any)[sid] ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400' }`}
                >
                  { (data.sections as any)[sid] ? 'VISIBLE' : 'HIDDEN' }
                </button>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => reorderSections(idx, 'up')} disabled={idx === 0} className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-20 border border-slate-100"><i className="fa-solid fa-chevron-up text-xs"></i></button>
                 <button onClick={() => reorderSections(idx, 'down')} disabled={idx === data.sectionOrder.length - 1} className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-20 border border-slate-100"><i className="fa-solid fa-chevron-down text-xs"></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-wand-magic-sparkles"></i> MAIN HERO BANNERS</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div onClick={onHeroBgClick} className="relative aspect-video rounded-3xl overflow-hidden border-2 border-white bg-slate-200 group cursor-pointer shadow-lg">
            <img src={data.hero.bgImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Change Media</div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Tagline</label>
                <input value={data.hero.tagline || ''} onChange={e => updateNestedField('hero', 'tagline', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 font-black shadow-sm" placeholder="e.g. The Future of Vocational Excellence" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trust Badge Text</label>
                <input value={data.hero.trustBadge || ''} onChange={e => updateNestedField('hero', 'trustBadge', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 font-black shadow-sm" placeholder="e.g. NSDC Certified | Placement Support | Since 2024" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Headline</label>
              <input value={data.hero.title} onChange={e => updateNestedField('hero', 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 font-black shadow-sm" placeholder="Institutional Headline" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtitle / Description</label>
              <textarea value={data.hero.subtitle} onChange={e => updateNestedField('hero', 'subtitle', e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-600 font-medium resize-none shadow-sm" placeholder="Support text for the hero banner..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-inner">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Primary Button</h4>
                <input value={data.hero.ctaText} onChange={e => updateNestedField('hero', 'ctaText', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" placeholder="Label" />
                <input value={data.hero.ctaLink} onChange={e => updateNestedField('hero', 'ctaLink', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-mono" placeholder="Path (e.g. /academics)" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Secondary Button</h4>
                <input value={data.hero.secondaryCtaText || ''} onChange={e => updateNestedField('hero', 'secondaryCtaText', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-black" placeholder="Label" />
                <input value={data.hero.secondaryCtaLink || ''} onChange={e => updateNestedField('hero', 'secondaryCtaLink', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-mono" placeholder="Path (e.g. /about)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 bg-emerald-600 p-10 rounded-[2.5rem] border border-emerald-500 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/10 pb-6">
          <h3 className="text-white font-black text-xl flex items-center gap-3 uppercase tracking-tighter"><i className="fa-solid fa-bullhorn text-emerald-200"></i> CALL TO ACTION PANEL</h3>
          <button 
            onClick={() => updateHomeSubField('ctaBlock', 'visible', !data.ctaBlock.visible)} 
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${ data.ctaBlock.visible ? 'bg-white text-emerald-700 hover:bg-emerald-50' : 'bg-emerald-700 text-emerald-300' }`}
          >
            { data.ctaBlock.visible ? 'VISIBLE ON SITE' : 'HIDDEN FROM SITE' }
          </button>
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-100 uppercase tracking-widest ml-1">Main Headline</label>
            <input 
              value={data.ctaBlock.title} 
              onChange={e => updateHomeSubField('ctaBlock', 'title', e.target.value)} 
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white font-black text-xl placeholder:text-white/30 focus:bg-white/20 focus:border-white/40 transition-all outline-none" 
              placeholder="e.g. Secure Your Future with S M Skills" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-100 uppercase tracking-widest ml-1">Support Subtitle</label>
            <textarea 
              value={data.ctaBlock.subtitle} 
              onChange={e => updateHomeSubField('ctaBlock', 'subtitle', e.target.value)} 
              rows={3} 
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white font-medium placeholder:text-white/30 focus:bg-white/20 focus:border-white/40 transition-all outline-none resize-none" 
              placeholder="e.g. Admissions for the 2024 academic cycle are now open..." 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-100 uppercase tracking-widest ml-1">Button Label</label>
              <div className="relative">
                <input 
                  value={data.ctaBlock.buttonText} 
                  onChange={e => updateHomeSubField('ctaBlock', 'buttonText', e.target.value)} 
                  className="w-full bg-white border-none rounded-xl px-6 py-3 text-emerald-900 font-black text-sm shadow-xl" 
                  placeholder="e.g. Begin Application" 
                />
                <i className="fa-solid fa-tag absolute right-5 top-1/2 -translate-y-1/2 text-emerald-200"></i>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-100 uppercase tracking-widest ml-1">Button Destination</label>
              <div className="relative">
                <input 
                  value={data.ctaBlock.buttonLink} 
                  onChange={e => updateHomeSubField('ctaBlock', 'buttonLink', e.target.value)} 
                  className="w-full bg-slate-900 border-none rounded-xl px-6 py-3 text-emerald-400 font-mono text-xs shadow-xl" 
                  placeholder="e.g. /enroll" 
                />
                <i className="fa-solid fa-link absolute right-5 top-1/2 -translate-y-1/2 text-slate-700"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-list-check"></i> HIGHLIGHT CARDS</h3>
          <button onClick={addHighlight} className="text-[10px] font-black bg-slate-900 text-white hover:bg-emerald-600 px-6 py-2 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest">Add New</button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {data.highlights.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-7 rounded-[2rem] border border-slate-200 space-y-4 group relative hover:border-emerald-300 transition-all shadow-sm">
              <button onClick={() => handleDeleteHighlight(idx, item.title)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all"><i className="fa-solid fa-xmark"></i></button>
              <input value={item.title} onChange={e => updateHighlight(idx, 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-black shadow-inner" placeholder="Label" />
              <textarea value={item.description} onChange={e => updateHighlight(idx, 'description', e.target.value)} rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500 resize-none font-medium" placeholder="Brief info..." />
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[9px] text-slate-400 font-black uppercase">Icon Ref:</span>
                <input value={item.icon} onChange={e => updateHighlight(idx, 'icon', e.target.value)} className="flex-grow bg-white border border-slate-200 rounded-lg px-3 py-1 text-[10px] font-mono text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
