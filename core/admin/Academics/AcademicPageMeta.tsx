
import React from 'react';
import { PageMeta } from '../../types.ts';

interface AcademicPageMetaProps {
  pageMeta: PageMeta;
  updatePageMeta: (field: keyof PageMeta, value: string) => void;
}

const AcademicPageMeta: React.FC<AcademicPageMetaProps> = ({ pageMeta, updatePageMeta }) => {
  return (
    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 space-y-6">
      <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3">
        <i className="fa-solid fa-heading"></i> PAGE CONFIGURATION
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Page Title</label>
          <input 
            value={pageMeta.title} 
            onChange={e => updatePageMeta('title', e.target.value)} 
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-bold outline-none focus:border-emerald-500 shadow-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Top Tagline</label>
          <input 
            value={pageMeta.tagline} 
            onChange={e => updatePageMeta('tagline', e.target.value)} 
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-bold outline-none focus:border-emerald-500 shadow-sm" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intro Subtitle</label>
        <textarea 
          value={pageMeta.subtitle} 
          onChange={e => updatePageMeta('subtitle', e.target.value)} 
          rows={2} 
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 resize-none outline-none focus:border-emerald-500 shadow-sm" 
        />
      </div>
    </div>
  );
};

export default AcademicPageMeta;
