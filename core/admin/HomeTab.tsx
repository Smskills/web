
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
  deleteHighlight: (index: number) => void;
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
    if (window.confirm(`Delete highlight "${title}"?`)) deleteHighlight(idx);
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
            <input value={data.hero.title} onChange={e => updateNestedField('hero', 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-900 font-black shadow-sm" placeholder="Institutional Headline" />
            <textarea value={data.hero.subtitle} onChange={e => updateNestedField('hero', 'subtitle', e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-slate-600 font-medium resize-none shadow-sm" placeholder="Support text for the hero banner..." />
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
