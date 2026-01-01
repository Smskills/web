
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
      case 'Urgent': return { bg: 'bg-red-600', text: 'text-white', lightBg: 'bg-red-50', lightText: 'text-red-600', border: 'border-red-100', icon: 'fa-fire-flame-curved' };
      case 'New': return { bg: 'bg-green-500', text: 'text-white', lightBg: 'bg-green-50', lightText: 'text-green-600', border: 'border-green-100', icon: 'fa-sparkles' };
      case 'Event': return { bg: 'bg-blue-600', text: 'text-white', lightBg: 'bg-blue-50', lightText: 'text-blue-600', border: 'border-blue-100', icon: 'fa-calendar-star' };
      case 'Holiday': return { bg: 'bg-amber-500', text: 'text-white', lightBg: 'bg-amber-50', lightText: 'text-amber-600', border: 'border-amber-100', icon: 'fa-umbrella-beach' };
      default: return { bg: 'bg-slate-600', text: 'text-white', lightBg: 'bg-slate-50', lightText: 'text-slate-600', border: 'border-slate-200', icon: 'fa-bullhorn' };
    }
  };

  const getCleanPath = (path: string) => {
    if (!path) return '/';
    // Remove both #/ and # prefixes for Link component
    let cleaned = path;
    if (cleaned.startsWith('#/')) cleaned = cleaned.substring(1);
    else if (cleaned.startsWith('#')) cleaned = cleaned.substring(1);
    
    // Ensure the path starts with / for React Router to treat it as absolute from root
    if (!cleaned.startsWith('/')) {
      cleaned = '/' + cleaned;
    }
    return cleaned;
  };

  const spotlightNotice = notices[0];
  const tickerNotices = notices.length > 1 ? notices.slice(1) : notices;

  return (
    <div className="space-y-0">
      <style>{`
        @keyframes marqueeVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marqueeHorizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-vertical {
          animation: marqueeVertical 25s linear infinite;
        }
        .animate-marquee-horizontal {
          animation: marqueeHorizontal 30s linear infinite;
        }
        .animate-marquee-vertical:hover, .animate-marquee-horizontal:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section */}
      {home.hero.visible && (
        <section 
          className="relative min-h-[85vh] flex items-center bg-cover bg-center text-white"
          style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(${home.hero.bgImage})` }}
        >
          <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter animate-fade-in-up">
              {home.hero.title}
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto font-medium animate-fade-in-up delay-100">
              {home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-200">
              <Link 
                to="/courses"
                className="px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95 text-sm uppercase tracking-widest"
              >
                {home.hero.ctaText}
              </Link>
              <Link 
                to="/about"
                className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all text-sm uppercase tracking-widest"
              >
                Institute Tour
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Corporate Partners Ticker */}
      {home.sections.industryTieups && placements.partners.length > 0 && (
        <section className="py-12 bg-slate-900 border-y border-white/5 relative z-20">
          <div className="container mx-auto px-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] whitespace-nowrap">Industry Tie-ups</span>
              <div className="h-px bg-slate-800 flex-grow"></div>
            </div>
          </div>
          <div className="overflow-hidden flex relative">
            <div className="flex animate-marquee-horizontal whitespace-nowrap py-4">
              {[...placements.partners, ...placements.partners].map((partner, idx) => (
                <div key={`${partner.id}-${idx}`} className="flex items-center gap-4 px-12 group cursor-default">
                  {partner.image ? (
                    <img src={partner.image} alt={partner.name} className="h-10 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                  ) : (
                    <i className={`fa-brands ${partner.icon || 'fa-building'} text-4xl text-slate-500 group-hover:text-emerald-500 transition-colors`}></i>
                  )}
                  <span className="text-xl font-black text-slate-600 group-hover:text-slate-300 transition-colors uppercase tracking-widest">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {home.highlights.map((item, idx) => (
              <div key={idx} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl transition-all text-center group">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mb-8 mx-auto group-hover:rotate-12 transition-transform">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Placements */}
      {home.sections.placementReviews && (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl text-left">
                <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Alumni Destinations</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">{home.sectionLabels.placementsTitle}</h2>
                <p className="text-slate-500 text-lg mt-4 font-medium leading-relaxed">{home.sectionLabels.placementsSubtitle}</p>
              </div>
              <Link to="/placement-review" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 shrink-0 mb-2">
                {placementLabel} Wall <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {placements.reviews.slice(0, 4).map((p, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-emerald-500 transition-all hover:shadow-2xl group flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-8 ring-slate-50 group-hover:ring-emerald-50 transition-all">
                    <img src={p.image} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-black text-slate-900 text-xl mb-1">{p.name}</h4>
                  <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-6">{p.course}</p>
                  <div className="w-full pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hired at</span>
                    <div className="flex items-center gap-3 text-slate-900 font-black">
                      <i className={`fa-brands ${p.companyIcon} text-2xl`}></i>
                      <span className="text-lg">{p.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Moving Notices Board */}
      {home.sections.notices && notices.length > 0 && (
        <section className="py-24 bg-slate-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full -mr-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-12 h-1 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px]">Campus Pulse</span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">{home.sectionLabels.noticesTitle}</h2>
                <p className="text-slate-400 text-lg mt-3 font-medium">{home.sectionLabels.noticesSubtitle}</p>
              </div>
              <Link to="/notices" className="group flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-emerald-600 text-white rounded-full transition-all border border-white/10 hover:border-emerald-500 shadow-2xl">
                <span className="text-xs font-black uppercase tracking-widest">Notice Board</span>
                <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 h-full">
                {spotlightNotice && (
                  <div key={spotlightNotice.id} className="h-full bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 flex flex-col justify-between group hover:border-emerald-500/50 transition-all shadow-2xl relative overflow-hidden min-h-[480px]">
                    <div>
                      <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 ${getNoticeTheme(spotlightNotice.category).bg} ${getNoticeTheme(spotlightNotice.category).text} text-[10px] font-black uppercase tracking-widest shadow-xl`}>
                        <i className={`fa-solid ${getNoticeTheme(spotlightNotice.category).icon}`}></i>
                        {spotlightNotice.category || 'Announcement'}
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight group-hover:text-emerald-400 transition-colors">
                        {spotlightNotice.title}
                      </h3>
                      <p className="text-slate-400 text-xl leading-relaxed line-clamp-4 font-medium">
                        {spotlightNotice.description}
                      </p>
                    </div>
                    <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-10">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-300">
                           <i className="fa-regular fa-clock text-xl"></i>
                         </div>
                         <span className="text-sm font-black text-slate-500">{new Date(spotlightNotice.date).toLocaleDateString()}</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 h-[480px] relative">
                <div className="h-full overflow-hidden border border-white/5 rounded-[3rem] bg-slate-800/20">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-30">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                      Real-time Feed
                    </span>
                  </div>

                  <div className="relative h-full pt-6">
                    <div className="animate-marquee-vertical flex flex-col gap-6 px-6 pb-20">
                      {[...tickerNotices, ...tickerNotices].map((notice, idx) => {
                        const theme = getNoticeTheme(notice.category);
                        return (
                          <div 
                            key={`${notice.id}-${idx}`} 
                            className="bg-slate-800/60 border border-white/5 rounded-[2rem] p-8 flex gap-8 hover:bg-slate-700/80 transition-all group cursor-pointer hover:border-emerald-500/30 shrink-0"
                          >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${theme.lightBg} ${theme.lightText} text-2xl group-hover:scale-110 transition-transform`}>
                              <i className={`fa-solid ${theme.icon}`}></i>
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden">
                              <h4 className="text-white font-black text-xl group-hover:text-emerald-400 transition-colors truncate">{notice.title}</h4>
                            </div>
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
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Expert Curriculum</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">{home.sectionLabels.coursesTitle}</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">{home.sectionLabels.coursesSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {courses.filter(c => c.status === 'Active').slice(0, 3).map(course => (
                <div key={course.id} className="flex flex-col rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white hover:shadow-3xl transition-all group">
                  <div className="relative h-64 overflow-hidden">
                    <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{course.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-10 leading-relaxed flex-grow font-medium">{course.description}</p>
                    <Link 
                      to={`/enroll?course=${encodeURIComponent(course.name)}`}
                      className="w-full py-5 bg-slate-900 text-white text-center font-black rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 text-xs uppercase tracking-widest"
                    >
                      <i className="fa-solid fa-graduation-cap"></i> Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Block */}
      {home.ctaBlock.visible && (
        <section className="py-24 bg-emerald-600 overflow-hidden relative">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter leading-tight">{home.ctaBlock.title}</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto mb-14 text-xl font-medium leading-relaxed">
              {home.ctaBlock.subtitle}
            </p>
            <Link 
              to={getCleanPath(home.ctaBlock.buttonLink)} 
              className="inline-flex items-center gap-4 px-12 py-6 bg-white text-emerald-600 font-black rounded-[2rem] hover:bg-slate-50 transition-all shadow-2xl text-xs uppercase tracking-[0.2em] active:scale-95"
            >
              {home.ctaBlock.buttonText} <i className="fa-solid fa-arrow-right-long text-lg"></i>
            </Link>
          </div>
        </section>
      )}

      {/* Big Showcase Section */}
      {home.bigShowcase.visible && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="relative h-[600px] rounded-[3rem] overflow-hidden group shadow-3xl">
              <img src={home.bigShowcase.image} alt={home.bigShowcase.title} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-12 md:p-20 flex flex-col items-center text-center">
                <div className="max-w-3xl animate-fade-in-up">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">{home.bigShowcase.title}</h2>
                  <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed drop-shadow-lg">{home.bigShowcase.subtitle}</p>
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
