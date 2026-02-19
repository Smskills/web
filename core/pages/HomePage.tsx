
import React from 'react';
import { Link } from 'react-router-dom';
import { AppState, Notice } from '../types';

interface HomePageProps {
  content: AppState;
}

const HomePage: React.FC<HomePageProps> = ({ content }) => {
  const { home, courses, notices, placements } = content;
  const placementLabel = home.sectionLabels.placementMainLabel || "Placement";

  const getNoticeTheme = (category?: string) => {
    switch(category) {
      case 'Urgent': return { bg: 'bg-red-500', text: 'text-white', lightBg: 'bg-red-500/10', lightText: 'text-red-500', border: 'border-red-500/20', icon: 'fa-circle-exclamation' };
      case 'New': return { bg: 'bg-emerald-600', text: 'text-white', lightBg: 'bg-emerald-600/10', lightText: 'text-emerald-500', border: 'border-emerald-600/20', icon: 'fa-wand-magic-sparkles' };
      case 'Event': return { bg: 'bg-blue-600', text: 'text-white', lightBg: 'bg-blue-600/10', lightText: 'text-blue-500', border: 'border-blue-600/20', icon: 'fa-calendar-check' };
      case 'Holiday': return { bg: 'bg-amber-500', text: 'text-white', lightBg: 'bg-amber-50/10', lightText: 'text-amber-500', border: 'border-amber-500/20', icon: 'fa-umbrella-beach' };
      default: return { bg: 'bg-slate-700', text: 'text-white', lightBg: 'bg-slate-700/20', lightText: 'text-slate-400', border: 'border-slate-700/50', icon: 'fa-bullhorn' };
    }
  };

  const getCleanPath = (path: string) => {
    if (!path) return '/';
    let cleaned = path;
    if (cleaned === '/courses' || cleaned === 'courses') return '/academics';
    if (cleaned.startsWith('#/')) cleaned = cleaned.substring(1);
    else if (cleaned.startsWith('#')) cleaned = cleaned.substring(1);
    if (!cleaned.startsWith('/')) cleaned = '/' + cleaned;
    return cleaned;
  };

  const spotlightNotice = notices.list[0];
  const tickerNotices = notices.list.length > 1 ? notices.list.slice(1) : notices.list;

  const btnPrimary = "px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/30 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95 text-[11px] uppercase tracking-widest text-center min-h-[56px] flex items-center justify-center";
  const btnMidnight = "px-10 py-5 bg-[#020617] text-white font-black rounded-2xl hover:bg-emerald-600 focus-visible:ring-4 focus-visible:ring-slate-900/20 transition-all shadow-2xl active:scale-95 text-[11px] uppercase tracking-widest text-center min-h-[56px] flex items-center justify-center";

  // Logic for Featured Tracks
  const featuredPrograms = courses.list.filter(c => c.status === 'Active' && c.isFeatured);
  const displayCourses = featuredPrograms.length > 0 
    ? featuredPrograms.slice(0, 3) 
    : courses.list.filter(c => c.status === 'Active').slice(0, 3);

  // Logic for the "Other Courses" teaser block
  const remainingCourses = courses.list.filter(c => c.status === 'Active').length - displayCourses.length;
  const teaserThumbnails = courses.list.filter(c => c.status === 'Active' && !displayCourses.find(d => d.id === c.id)).slice(0, 4);

  return (
    <div className="space-y-0 overflow-x-hidden bg-white font-sans">
      <style>{`
        @keyframes marqueeVertical { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes marqueeHorizontal { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-vertical { animation: marqueeVertical 25s linear infinite; }
        .animate-marquee-horizontal { animation: marqueeHorizontal 30s linear infinite; }
        .animate-marquee-vertical:hover, .animate-marquee-horizontal:hover { animation-play-state: paused; }
      `}</style>

      {/* Hero Section - Reduced Height to show more below */}
      {home.hero.visible && (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-slate-100">
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ 
              backgroundImage: `url(${home.hero.bgImage})`,
              filter: 'blur(4px)'
            }}
          />
          <div className="absolute inset-0 bg-white/50 backdrop-brightness-110"></div>
          
          <div className="container mx-auto px-6 py-16 text-center max-w-5xl relative z-10">
            <span className="text-emerald-800 font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] mb-6 block animate-fade-in-up">The Future of Vocational Excellence</span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-8 leading-[1] md:leading-[0.95] tracking-tighter text-[#020617] animate-fade-in-up">
              {home.hero.title}
            </h1>
            <p className="text-base md:text-xl text-slate-800 mb-10 leading-relaxed max-w-3xl mx-auto font-bold animate-fade-in-up delay-100">
              {home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-200">
              <Link to="/academics" className={btnPrimary}>{home.hero.ctaText}</Link>
              <Link to="/about" className={btnMidnight}>Institutional Tour</Link>
            </div>
          </div>
        </section>
      )}

      {/* Global Partner Ticker - More compact height */}
      {home.sections.industryTieups && placements.partners.length > 0 && (
        <section className="py-8 bg-[#020617] border-y border-white/5 relative z-20 overflow-hidden">
          <div className="container mx-auto px-6 mb-4 flex justify-center">
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] whitespace-nowrap">Global Partner Network</span>
          </div>
          <div className="overflow-hidden flex relative">
            <div className="flex animate-marquee-horizontal whitespace-nowrap py-2">
              {[...placements.partners, ...placements.partners].map((partner, idx) => (
                <div key={`${partner.id}-${idx}`} className="flex items-center gap-6 px-16 group cursor-default">
                  {partner.image ? (
                    <img src={partner.image} alt={partner.name} className="h-8 md:h-10 w-auto object-contain transition-all" />
                  ) : (
                    <i className={`fa-brands ${partner.icon || 'fa-building'} text-2xl md:text-3xl text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-colors`}></i>
                  )}
                  <span className="text-lg md:text-xl font-black text-white uppercase tracking-widest">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights - Significantly Reduced Padding and size to pull courses section up */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {home.highlights.map((item, idx) => (
              <article key={idx} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-2xl transition-all text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-emerald-700 border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-2xl md:text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform shadow-sm">
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-4 text-[#020617] tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Announcement Feed Section */}
      {home.sections.notices && notices.list.length > 0 && (
        <section className="py-16 bg-[#020617] overflow-hidden relative border-y-4 border-emerald-600/20">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
              <div className="max-w-xl">
                <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Official Feed</span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">{home.sectionLabels.noticesTitle}</h2>
              </div>
              <Link to="/notices" className="group flex items-center gap-4 px-6 py-3 bg-white/5 hover:bg-emerald-600 text-white rounded-xl transition-all border border-white/10 hover:border-emerald-500 shadow-2xl active:scale-95">
                <span className="text-[10px] font-black uppercase tracking-widest">NOTICE BOARD</span>
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" aria-hidden="true"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-2 border-emerald-500 p-6 rounded-[3rem] bg-emerald-500/[0.02] shadow-[0_0_50px_rgba(16,185,129,0.15)] relative">
              <div className="lg:col-span-7">
                {spotlightNotice && (
                  <article key={spotlightNotice.id} className="h-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-emerald-400/50 transition-all shadow-3xl">
                    <div className="space-y-8">
                      <div className={`inline-flex items-center gap-3 px-3 py-1 rounded-full ${getNoticeTheme(spotlightNotice.category).bg} ${getNoticeTheme(spotlightNotice.category).text} text-[9px] font-black uppercase tracking-widest shadow-lg`}>
                        <i className={`fa-solid ${getNoticeTheme(spotlightNotice.category).icon}`} aria-hidden="true"></i>
                        {spotlightNotice.category || 'Announcement'}
                      </div>
                      <div>
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight group-hover:text-emerald-400 transition-colors">
                          {spotlightNotice.title}
                        </h3>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed line-clamp-2 font-medium">
                          {spotlightNotice.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 flex items-center">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 shadow-inner">
                           <i className="fa-regular fa-clock text-lg" aria-hidden="true"></i>
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                           {new Date(spotlightNotice.date).toLocaleDateString()}
                         </span>
                       </div>
                    </div>
                  </article>
                )}
              </div>

              <div className="lg:col-span-5 h-[400px] md:h-auto relative">
                <div className="h-full border border-white/10 rounded-[2.5rem] bg-slate-900/40 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-[#020617]/50 backdrop-blur-md">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">RECENT FEED</span>
                  </div>
                  <div className="flex-grow overflow-hidden relative">
                    <div className="animate-marquee-vertical flex flex-col gap-4 p-6">
                      {[...tickerNotices, ...tickerNotices].map((notice, idx) => {
                        const theme = getNoticeTheme(notice.category);
                        return (
                          <div key={`${notice.id}-${idx}`} className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/60 transition-all group cursor-pointer hover:border-emerald-500/30 shadow-lg">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.lightBg} ${theme.lightText} text-xl group-hover:scale-110 transition-transform shadow-inner`}>
                              <i className={`fa-solid ${theme.icon}`} aria-hidden="true"></i>
                            </div>
                            <h4 className="text-white font-black text-sm group-hover:text-emerald-400 transition-colors truncate">{notice.title}</h4>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Showcase - Compacted Padding */}
      {home.sections.featuredCourses && (
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-4xl mx-auto">
                <span className="text-emerald-700 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Institutional Tracks</span>
                <h2 className="text-3xl md:text-5xl font-black text-[#020617] tracking-tighter leading-tight">{home.sectionLabels.coursesTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayCourses.map(course => (
                <article key={course.id} className="flex flex-col rounded-[2rem] overflow-hidden border border-slate-100 bg-white hover:shadow-4xl transition-all group relative">
                  <div className="relative h-60 md:h-64 overflow-hidden">
                    <img src={course.cardImage || course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg shadow-2xl border border-emerald-400/30 flex items-center gap-2">
                         <i className="fa-solid fa-star text-[8px]"></i>
                         <span className="text-[8px] font-black uppercase tracking-widest leading-none">POPULAR</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex items-center mb-4">
                       <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                         {course.academicLevel}
                       </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-[#020617] mb-4 tracking-tight group-hover:text-emerald-700 transition-colors leading-tight">{course.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-8 leading-relaxed flex-grow font-medium">{course.description}</p>
                    <Link to={`/academics?courseId=${course.id}`} className={btnMidnight + " w-full !py-3 !px-4 flex justify-center gap-2 group/btn"}>
                      OVERVIEW <i className="fa-solid fa-arrow-right-long text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Catalog Teaser Section */}
            {remainingCourses > 0 && (
              <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col items-center">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full bg-slate-50 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                       <div className="flex -space-x-4">
                          {teaserThumbnails.map((c, i) => (
                             <div key={i} className="w-12 h-12 rounded-2xl border-2 border-white overflow-hidden shadow-xl transform group-hover:translate-y-[-3px] transition-transform">
                                <img src={c.image} className="w-full h-full object-cover" alt="" />
                             </div>
                          ))}
                          <div className="w-12 h-12 rounded-2xl border-2 border-white bg-emerald-600 flex items-center justify-center text-white text-[9px] font-black shadow-xl">
                             +{remainingCourses}
                          </div>
                       </div>
                       <div className="text-center md:text-left">
                          <p className="text-slate-900 font-black text-xl tracking-tight leading-none">Expand Your Potential</p>
                          <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-widest">Browse our complete institutional catalog</p>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
                       <Link 
                          to="/academics"
                          className="px-8 py-4 bg-[#020617] text-white font-black rounded-xl hover:bg-emerald-600 hover:scale-[1.02] transition-all text-center uppercase tracking-widest text-[10px] shadow-4xl active:scale-95 flex items-center gap-3"
                       >
                          START APPLICATION <i className="fa-solid fa-paper-plane text-[8px]"></i>
                       </Link>
                       <div className="flex flex-col items-center md:items-start leading-none">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">STANDARD FEES</span>
                          <span className="text-xl font-black text-emerald-600">Rs. 50,000 <span className="text-[9px] text-slate-400 font-bold">/ AVG</span></span>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Block */}
      {home.ctaBlock.visible && (
        <section className="py-20 bg-emerald-600 overflow-hidden relative">
          <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
            <h2 className="text-3xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[1]">{home.ctaBlock.title}</h2>
            <p className="text-emerald-50 max-w-3xl mx-auto mb-10 text-base md:text-lg font-medium leading-relaxed opacity-90">
              {home.ctaBlock.subtitle}
            </p>
            <Link to={getCleanPath(home.ctaBlock.buttonLink)} className="inline-flex items-center gap-6 px-10 py-5 bg-[#020617] text-white font-black rounded-xl hover:bg-white hover:text-emerald-700 focus-visible:ring-4 focus-visible:ring-white/30 transition-all shadow-4xl text-[10px] uppercase tracking-[0.2em] active:scale-95">
              {home.ctaBlock.buttonText} <i className="fa-solid fa-arrow-right-long text-lg" aria-hidden="true"></i>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
