
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

      {/* Hero Section - Condensed to show more content below */}
      {home.hero.visible && (
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-100">
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ 
              backgroundImage: `url(${home.hero.bgImage})`,
              filter: 'blur(4px)'
            }}
          />
          <div className="absolute inset-0 bg-white/50 backdrop-brightness-110"></div>
          
          <div className="container mx-auto px-6 py-10 text-center max-w-5xl relative z-10">
            <span className="text-emerald-800 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block animate-fade-in-up">Vocational Excellence</span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 leading-[1] tracking-tighter text-[#020617] animate-fade-in-up">
              {home.hero.title}
            </h1>
            <p className="text-sm md:text-lg text-slate-800 mb-8 leading-relaxed max-w-2xl mx-auto font-bold animate-fade-in-up delay-100">
              {home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <Link to="/academics" className={btnPrimary + " !py-3 !px-8 min-h-[48px]"}>{home.hero.ctaText}</Link>
              <Link to="/about" className={btnMidnight + " !py-3 !px-8 min-h-[48px]"}>Institutional Tour</Link>
            </div>
          </div>
        </section>
      )}

      {/* Global Partner Ticker - Ultra compact */}
      {home.sections.industryTieups && placements.partners.length > 0 && (
        <section className="py-2 bg-[#020617] border-y border-white/5 relative z-20 overflow-hidden">
          <div className="overflow-hidden flex relative">
            <div className="flex animate-marquee-horizontal whitespace-nowrap py-1">
              {[...placements.partners, ...placements.partners].map((partner, idx) => (
                <div key={`${partner.id}-${idx}`} className="flex items-center gap-4 px-10 group cursor-default">
                  {partner.image ? (
                    <img src={partner.image} alt={partner.name} className="h-6 md:h-8 w-auto object-contain transition-all" />
                  ) : (
                    <i className={`fa-brands ${partner.icon || 'fa-building'} text-lg md:text-xl text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-colors`}></i>
                  )}
                  <span className="text-sm md:text-base font-black text-white uppercase tracking-widest">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights - Minimized padding to pull courses up */}
      <section className="py-6 md:py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {home.highlights.map((item, idx) => (
              <article key={idx} className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl transition-all text-center group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-emerald-700 border border-slate-100 rounded-[1rem] flex items-center justify-center text-lg md:text-xl mb-4 mx-auto group-hover:scale-110 transition-transform shadow-sm">
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
                </div>
                <h3 className="text-base md:text-lg font-black mb-2 text-[#020617] tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-[11px] leading-snug font-medium line-clamp-2">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Announcement Feed Section - Condensed padding */}
      {home.sections.notices && notices.list.length > 0 && (
        <section className="py-10 bg-[#020617] overflow-hidden relative border-y-2 border-emerald-600/10">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="max-w-xl">
                <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[8px] mb-2 block">Official Feed</span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">{home.sectionLabels.noticesTitle}</h2>
              </div>
              <Link to="/notices" className="group flex items-center gap-3 px-5 py-2 bg-white/5 hover:bg-emerald-600 text-white rounded-lg transition-all border border-white/10 hover:border-emerald-500 shadow-xl active:scale-95">
                <span className="text-[9px] font-black uppercase tracking-widest">VIEW BOARD</span>
                <i className="fa-solid fa-arrow-right text-[8px] group-hover:translate-x-1 transition-transform" aria-hidden="true"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border border-emerald-500/20 p-4 rounded-[2rem] bg-emerald-500/[0.01] shadow-[0_0_40px_rgba(16,185,129,0.1)] relative">
              <div className="lg:col-span-7">
                {spotlightNotice && (
                  <article key={spotlightNotice.id} className="h-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between group hover:border-emerald-400/50 transition-all shadow-2xl">
                    <div className="space-y-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getNoticeTheme(spotlightNotice.category).bg} ${getNoticeTheme(spotlightNotice.category).text} text-[8px] font-black uppercase tracking-widest shadow-lg`}>
                        <i className={`fa-solid ${getNoticeTheme(spotlightNotice.category).icon}`} aria-hidden="true"></i>
                        {spotlightNotice.category || 'Announcement'}
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-4xl font-black text-white mb-4 leading-[1.1] tracking-tight group-hover:text-emerald-400 transition-colors">
                          {spotlightNotice.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">
                          {spotlightNotice.description}
                        </p>
                      </div>
                    </div>
                  </article>
                )}
              </div>

              <div className="lg:col-span-5 h-[300px] md:h-auto relative">
                <div className="h-full border border-white/10 rounded-[2rem] bg-slate-900/40 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#020617]/50 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">LIVE FEED</span>
                  </div>
                  <div className="flex-grow overflow-hidden relative">
                    <div className="animate-marquee-vertical flex flex-col gap-3 p-4">
                      {[...tickerNotices, ...tickerNotices].map((notice, idx) => {
                        const theme = getNoticeTheme(notice.category);
                        return (
                          <div key={`${notice.id}-${idx}`} className="bg-slate-800/40 border border-white/5 rounded-xl p-3 flex items-center gap-4 hover:bg-slate-800/60 transition-all group cursor-pointer hover:border-emerald-500/30 shadow-lg">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${theme.lightBg} ${theme.lightText} text-sm group-hover:scale-110 transition-transform shadow-inner`}>
                              <i className={`fa-solid ${theme.icon}`} aria-hidden="true"></i>
                            </div>
                            <h4 className="text-white font-black text-[11px] group-hover:text-emerald-400 transition-colors truncate">{notice.title}</h4>
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

      {/* Featured Courses Showcase - Pushed up to be visible above fold */}
      {home.sections.featuredCourses && (
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-10 max-w-4xl mx-auto">
                <span className="text-emerald-700 font-black uppercase tracking-[0.4em] text-[9px] mb-3 block">Institutional Tracks</span>
                <h2 className="text-2xl md:text-4xl font-black text-[#020617] tracking-tighter leading-tight">{home.sectionLabels.coursesTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCourses.map(course => (
                <article key={course.id} className="flex flex-col rounded-[1.5rem] overflow-hidden border border-slate-100 bg-white hover:shadow-3xl transition-all group relative">
                  <div className="relative h-48 md:h-52 overflow-hidden">
                    <img src={course.cardImage || course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-emerald-600 text-white px-2 py-1 rounded-md shadow-2xl border border-emerald-400/30 flex items-center gap-1.5">
                         <i className="fa-solid fa-star text-[7px]"></i>
                         <span className="text-[7px] font-black uppercase tracking-widest leading-none">POPULAR</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center mb-3">
                       <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                         {course.academicLevel}
                       </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-[#020617] mb-3 tracking-tight group-hover:text-emerald-700 transition-colors leading-tight">{course.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-grow font-medium">{course.description}</p>
                    <Link to={`/academics?courseId=${course.id}`} className={btnMidnight + " w-full !py-2.5 !px-4 flex justify-center gap-2 group/btn min-h-0"}>
                      OVERVIEW <i className="fa-solid fa-arrow-right-long text-[7px] group-hover/btn:translate-x-1 transition-transform"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Catalog Teaser Section */}
            {remainingCourses > 0 && (
              <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col items-center">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full bg-slate-50 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex flex-col md:flex-row items-center gap-5">
                       <div className="flex -space-x-3">
                          {teaserThumbnails.map((c, i) => (
                             <div key={i} className="w-10 h-10 rounded-xl border-2 border-white overflow-hidden shadow-lg transform group-hover:translate-y-[-2px] transition-transform">
                                <img src={c.image} className="w-full h-full object-cover" alt="" />
                             </div>
                          ))}
                          <div className="w-10 h-10 rounded-xl border-2 border-white bg-emerald-600 flex items-center justify-center text-white text-[8px] font-black shadow-lg">
                             +{remainingCourses}
                          </div>
                       </div>
                       <div className="text-center md:text-left">
                          <p className="text-slate-900 font-black text-lg tracking-tight leading-none">Expand Your Potential</p>
                          <p className="text-slate-500 text-[9px] font-black mt-1 uppercase tracking-widest">Browse our complete catalog</p>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5 shrink-0">
                       <Link 
                          to="/academics"
                          className="px-6 py-3 bg-[#020617] text-white font-black rounded-lg hover:bg-emerald-600 hover:scale-[1.02] transition-all text-center uppercase tracking-widest text-[9px] shadow-4xl active:scale-95 flex items-center gap-2"
                       >
                          START APPLICATION <i className="fa-solid fa-paper-plane text-[7px]"></i>
                       </Link>
                       <div className="flex flex-col items-center md:items-start leading-none">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">FEES FROM</span>
                          <span className="text-lg font-black text-emerald-600">Rs. 50,000</span>
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
        <section className="py-16 bg-emerald-600 overflow-hidden relative">
          <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
            <h2 className="text-2xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-[1]">{home.ctaBlock.title}</h2>
            <p className="text-emerald-50 max-w-2xl mx-auto mb-8 text-sm md:text-lg font-medium leading-relaxed opacity-90">
              {home.ctaBlock.subtitle}
            </p>
            <Link to={getCleanPath(home.ctaBlock.buttonLink)} className="inline-flex items-center gap-4 px-10 py-4 bg-[#020617] text-white font-black rounded-lg hover:bg-white hover:text-emerald-700 focus-visible:ring-4 focus-visible:ring-white/30 transition-all shadow-4xl text-[9px] uppercase tracking-[0.2em] active:scale-95">
              {home.ctaBlock.buttonText} <i className="fa-solid fa-arrow-right-long text-base" aria-hidden="true"></i>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
