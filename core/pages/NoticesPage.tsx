import React, { useState } from 'react';
import { AppState } from '../types.ts';
import FormattedText from '../components/FormattedText.tsx';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface NoticesPageProps {
  noticesState: AppState['notices'];
}

const NoticesPage: React.FC<NoticesPageProps> = ({ noticesState }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Urgent' | 'Event' | 'Holiday' | 'New'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { list, pageMeta } = noticesState;

  const getNoticeTheme = (category?: string) => {
    switch(category) {
      case 'Urgent': return { bg: 'bg-red-600', text: 'text-white', lightBg: 'bg-red-50', lightText: 'text-red-600', border: 'border-red-100', icon: 'fa-circle-exclamation' };
      case 'New': return { bg: 'bg-green-500', text: 'text-white', lightBg: 'bg-green-50', lightText: 'text-green-600', border: 'border-green-100', icon: 'fa-wand-magic-sparkles' };
      case 'Event': return { bg: 'bg-blue-600', text: 'text-white', lightBg: 'bg-blue-50', lightText: 'text-blue-600', border: 'border-blue-100', icon: 'fa-calendar-check' };
      case 'Holiday': return { bg: 'bg-amber-500', text: 'text-white', lightBg: 'bg-amber-50', lightText: 'text-amber-600', border: 'border-amber-100', icon: 'fa-umbrella-beach' };
      default: return { bg: 'bg-slate-600', text: 'text-white', lightBg: 'bg-slate-50', lightText: 'text-slate-600', border: 'border-slate-200', icon: 'fa-bullhorn' };
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/notices?id=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filtered = list
    .filter(n => activeFilter === 'All' || n.category === activeFilter)
    .filter(n => 
      (n.title || '').toLowerCase().includes(search.toLowerCase()) || 
      (n.description || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const emptyFallback = (
    <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-5xl mx-auto">
       <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
         <i className="fa-solid fa-wind"></i>
       </div>
       <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No matching results</h3>
       <button onClick={() => { setActiveFilter('All'); setSearch(''); }} className="mt-6 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl active:scale-95">Clear all filters</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/5 opacity-50 blur-[100px] -translate-y-1/2"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
           <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{pageMeta.tagline}</span>
           <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter">{pageMeta.title}</h1>
           <div className="flex flex-col md:flex-row gap-4 justify-center">
             <div className="relative flex-grow max-w-md mx-auto md:mx-0 group">
               <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
               <input 
                 type="text" placeholder="Filter announcements..." value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all font-medium"
               />
             </div>
           </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-32">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(['All', 'Urgent', 'Event', 'Holiday', 'New'] as const).map(cat => (
            <button
              key={cat} onClick={() => setActiveFilter(cat)}
              className={`px-6 py-4 md:py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                activeFilter === cat ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <PageStateGuard isEmpty={filtered.length === 0} emptyFallback={emptyFallback}>
          <div className="max-w-5xl mx-auto space-y-8">
            {filtered.map(notice => {
              const theme = getNoticeTheme(notice.category);
              return (
                <article key={notice.id} id={notice.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm hover:shadow-2xl transition-all group flex flex-col md:flex-row gap-8 md:items-start relative overflow-hidden">
                  <div className={`hidden md:flex w-20 h-20 rounded-3xl flex-col items-center justify-center shrink-0 ${theme.lightBg} ${theme.lightText} text-3xl group-hover:scale-110 transition-transform shadow-inner`}>
                    <i className={`fa-solid ${theme.icon}`}></i>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <time className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <i className="fa-regular fa-clock"></i>
                         {new Date(notice.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </time>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${theme.bg} ${theme.text}`}>
                         {notice.category || 'Announcement'}
                      </span>
                      <button onClick={() => handleShare(notice.id)} className="ml-auto text-[9px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        {copiedId === notice.id ? 'LINK COPIED' : <><i className="fa-solid fa-link"></i> SHARE</>}
                      </button>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-tight group-hover:text-emerald-600 transition-colors">{notice.title}</h3>
                    <FormattedText text={notice.description} className="text-slate-600 text-base md:text-lg leading-relaxed font-medium mb-8 whitespace-pre-line" />
                    {notice.link && (
                      <a href={notice.link} className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl">
                        View Attachment <i className="fa-solid fa-paperclip text-sm"></i>
                      </a>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><i className={`fa-solid ${theme.icon} text-9xl`}></i></div>
                </article>
              );
            })}
          </div>
        </PageStateGuard>
      </div>
    </div>
  );
};

export default NoticesPage;