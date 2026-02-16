
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
      case 'New': return { bg: 'bg-emerald-500', text: 'text-white', lightBg: 'bg-emerald-500/10', lightText: 'text-emerald-400', border: 'border-emerald-500/20', icon: 'fa-wand-magic-sparkles' };
      case 'Event': return { bg: 'bg-blue-500', text: 'text-white', lightBg: 'bg-blue-500/10', lightText: 'text-blue-400', border: 'border-blue-500/20', icon: 'fa-calendar-check' };
      case 'Holiday': return { bg: 'bg-amber-500', text: 'text-white', lightBg: 'bg-amber-500/10', lightText: 'text-amber-400', border: 'border-amber-500/20', icon: 'fa-umbrella-beach' };
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
  const btnSecondary = "px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 focus-visible:ring-4 focus-visible:ring-slate-900/20 transition-all shadow-2xl active:scale-95 text-[11px] uppercase tracking-widest text-center min-h-[56px] flex items-center justify-center";
  const btnOutline = "px-10 py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-slate-200 transition-all text-[11px] uppercase tracking-widest text-center min-h-[56px] flex items-center justify-center";

  return (
    <div className="space-y-0 overflow-x-hidden bg-white">
      <style>{`
        @keyframes marqueeVertical { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes marqueeHorizontal { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-vertical { animation: marqueeVertical 25s linear infinite; }
        .animate-marquee-horizontal { animation: marqueeHorizontal 30s linear infinite; }
        .animate-marquee-vertical:hover, .animate-marquee-horizontal:hover { animation-play-state: paused; }
      `}</style>

      {/* Hero Section */}
      {home.hero.visible && (
        <section 
          className="relative min-h-[85vh] md:min-h-[90vh] flex items-center bg-cover bg-center text-slate-900 overflow-hidden"
          style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${home.hero.bgImage})` }}
        >
          <div className="container mx-auto px-4 py-24 text-center max-w-5xl">
            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-8 block animate-fade-in-up">The Future of Vocational Excellence</span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-10 leading-[1] md:leading-[0.9] tracking-tighter animate-fade-in-up">
              {home.hero.title}
            </h1>
            <p className="text-base md:text-2xl text-slate-600 mb-14 leading-relaxed max-w-3xl mx-auto font-medium animate-fade-in-up delay-100">
              {home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-200">
              <Link to="/academics" className={btnPrimary}>{home.hero.ctaText}</Link>
              <Link to="/about" className={btnOutline}>Institutional Tour</Link>
            </div>
          </div>
        </section>
      )}

      {/* Corporate Partners Ticker */}
      {home.sections.industryTieups && placements.partners.length > 0 && (
        <section className="py-12 bg-slate-50 border-y border-slate-100 relative z-20">
          <div className="container mx-auto px-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">Global Partner Network</span>
              <div className="h-px bg-slate-200 flex-grow"></div>
            </div>
          </div>
          <div className="overflow-hidden flex relative">
            <div className="flex animate-marquee-horizontal whitespace-nowrap py-4">
              {[...placements.partners, ...placements.partners].map((partner, idx) => (
                <div key={`${partner.id}-${idx}`} className="flex items-center gap-6 px-16 group cursor-default">
                  {partner.image ? (
                    <img src={partner.image} alt={partner.name} className="h-10 md:h-12 w-auto object-contain grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                  ) : (
                    <i className={`fa-brands ${partner.icon || 'fa-building'} text-3xl md:text-4xl text-slate-300 group-hover:text-emerald-500 transition-colors`}></i>
                  )}
                  <span className="text-xl md:text-2xl font-black text-slate-300 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {home.highlights.map((item, idx) => (
              <article key={idx} className="p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-2xl transition-all text-center group">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-3xl md:text-4xl mb-10 mx-auto group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-6 text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Student Placements */}
      {home.sections.placementReviews && (
        <section className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-100">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl text-left">
                <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Proven Outcomes</span>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">{home.sectionLabels.placementsTitle}</h2>
                <p className="text-slate-500 text-lg md:text-xl mt-6 font-medium leading-relaxed">{home.sectionLabels.placementsSubtitle}</p>
              </div>
              <Link to="/placement-review" className={btnSecondary}>
                View {placementLabel} Wall <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {placements.reviews.slice(0, 4).map((p, idx) => (
                <article key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-emerald-500 transition-all hover:shadow-3xl group flex flex-col items-center text-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] overflow-hidden mb-8 ring-8 ring-slate-50 group-hover:ring-emerald-50 transition-all">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-black text-slate-900 text-xl md:text-2xl mb-1">{p.name}</h4>
                  <p className="text-emerald-600 font-black text-[10px] md:text-[11px] uppercase tracking-widest mb-8">{p.course}</p>
                  <div className="w-full pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hired at</span>
                    <div className="flex items-center gap-4 text-slate-900 font-black">
                      <i className={`fa-brands ${p.companyIcon} text-2xl md:text-3xl`} aria-hidden="true"></i>
                      <span className="text-lg md:text-xl">{p.company}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deep Dark Notices Board - REDESIGNED PER IMAGE REFERENCE */}
      {home.sections.notices && notices.list.length > 0 && (
        <section className="py-24 bg-[#0b1121] overflow-hidden relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
              <div className="max-w-xl">
                <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">OFFICIAL FEED</span>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">{home.sectionLabels.noticesTitle}</h2>
                <p className="text-slate-400 text-lg mt-6 font-medium max-w-md">{home.sectionLabels.noticesSubtitle}</p>
              </div>
              <Link to="/notices" className="group flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-emerald-600 text-white rounded-2xl transition-all border border-white/10 hover:border-emerald-500 shadow-2xl active:scale-95">
                <span className="text-[11px] font-black uppercase tracking-widest">OPEN NOTICE BOARD</span>
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" aria-hidden="true"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Spotlight Featured Card */}
              <div className="lg:col-span-7">
                {spotlightNotice && (
                  <article key={spotlightNotice.id} className="h-full bg-[#131b2e] border border-slate-800/50 rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-between group hover:border-emerald-500/30 transition-all shadow-3xl">
                    <div className="space-y-12">
                      <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full ${getNoticeTheme(spotlightNotice.category).bg} ${getNoticeTheme(spotlightNotice.category).text} text-[10px] font-black uppercase tracking-widest shadow-lg`}>
                        <i className={`fa-solid ${getNoticeTheme(spotlightNotice.category).icon}`} aria-hidden="true"></i>
                        {spotlightNotice.category || 'Announcement'}
                      </div>
                      <div>
                        <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight group-hover:text-emerald-400 transition-colors">
                          {spotlightNotice.title}
                        </h3>
                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed line-clamp-3 font-medium">
                          {spotlightNotice.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-16 flex items-center">
                       <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 shadow-inner">
                           <i className="fa-regular fa-clock text-xl" aria-hidden="true"></i>
                         </div>
                         <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                           {new Date(spotlightNotice.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' })}
                         </span>
                       </div>
                    </div>
                  </article>
                )}
              </div>

              {/* Secondary Feed Column */}
              <div className="lg:col-span-5 h-[500px] md:h-auto relative">
                <div className="h-full border border-slate-800/40 rounded-[2.5rem] bg-[#0f172a]/40 overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-slate-800/50 flex items-center gap-3 bg-[#0b1121]/50 backdrop-blur-md">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">RECENT FEED</span>
                  </div>
                  
                  <div className="flex-grow overflow-hidden relative">
                    <div className="animate-marquee-vertical flex flex-col gap-6 p-8">
                      {[...tickerNotices, ...tickerNotices].map((notice, idx) => {
                        const theme = getNoticeTheme(notice.category);
                        return (
                          <div key={`${notice.id}-${idx}`} className="bg-[#131b2e]/80 border border-slate-800/50 rounded-[2rem] p-6 flex items-center gap-6 hover:bg-slate-800/60 transition-all group cursor-pointer hover:border-emerald-500/30 shadow-lg">
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 ${theme.lightBg} ${theme.lightText} text-2xl group-hover:scale-110 transition-transform shadow-inner`}>
                              <i className={`fa-solid ${theme.icon}`} aria-hidden="true"></i>
                            </div>
                            <h4 className="text-white font-black text-base md:text-lg group-hover:text-emerald-400 transition-colors truncate">{notice.title}</h4>
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

      {/* Featured Courses */}
      {home.sections.featuredCourses && (
        <section className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-24 max-w-4xl mx-auto">
              <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Specialized Tracks</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">{home.sectionLabels.coursesTitle}</h2>
              <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">{home.sectionLabels.coursesSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {courses.list.filter(c => c.status === 'Active').slice(0, 3).map(course => (
                <article key={course.id} className="flex flex-col rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white hover:shadow-3xl transition-all group">
                  <div className="relative h-64 md:h-72 overflow-hidden">
                    <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col flex-grow">
                    <h3 className="text-2xl md:text-3xl font-black mb-6 text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{course.name}</h3>
                    <p className="text-base md:text-lg text-slate-500 line-clamp-2 mb-12 leading-relaxed flex-grow font-medium">{course.description}</p>
                    <Link to="/academics" className={btnSecondary + " w-full flex justify-center gap-3"}>
                      View Details <i className="fa-solid fa-arrow-right-long text-[9px]"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Block */}
      {home.ctaBlock.visible && (
        <section className="py-24 md:py-32 bg-emerald-600 overflow-hidden relative">
          <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
            <h2 className="text-4xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-[1] md:leading-[0.9]">{home.ctaBlock.title}</h2>
            <p className="text-emerald-50 max-w-3xl mx-auto mb-16 text-lg md:text-2xl font-medium leading-relaxed opacity-90">
              {home.ctaBlock.subtitle}
            </p>
            <Link to={getCleanPath(home.ctaBlock.buttonLink)} className="inline-flex items-center gap-6 px-10 md:px-16 py-6 md:py-8 bg-white text-emerald-600 font-black rounded-2xl md:rounded-[2rem] hover:bg-slate-900 hover:text-white focus-visible:ring-4 focus-visible:ring-white/30 transition-all shadow-3xl text-[11px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] active:scale-95 min-h-[56px]">
              {home.ctaBlock.buttonText} <i className="fa-solid fa-arrow-right-long text-xl" aria-hidden="true"></i>
            </Link>
          </div>
        </section>
      )}

      {/* Big Showcase Section */}
      {home.bigShowcase.visible && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="relative h-[500px] md:h-[700px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group shadow-2xl border border-slate-100">
              <img src={home.bigShowcase.image} alt={home.bigShowcase.title} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-10 md:p-24 flex flex-col items-center text-center">
                <div className="max-w-4xl">
                  <h2 className="text-3xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1] md:leading-none">{home.bigShowcase.title}</h2>
                  <p className="text-slate-600 text-lg md:text-2xl font-medium leading-relaxed">{home.bigShowcase.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
