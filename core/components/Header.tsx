
import React, { useState, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SiteConfig, Course } from '../types';

interface HeaderProps {
  config: SiteConfig;
  isAuthenticated?: boolean;
  courses?: Course[];
}

const Header: React.FC<HeaderProps> = ({ config, isAuthenticated = false, courses = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  
  const location = useLocation();
  const logoUrl = config.logo || "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png";
  const alert = config.admissionAlert || { enabled: false, text: '', subtext: '', linkText: '', linkPath: '/enroll' };

  const academicsMenu = useMemo(() => {
    const activeList = (courses || []).filter(c => c && c.status === 'Active');
    const uniqueLevels = Array.from(new Set(activeList.map(c => c.academicLevel).filter(Boolean)));
    
    const preferredOrder = ["Certificate", "UG Certificate (NSDC)", "UG Diploma", "UG Degree", "Master", "ITEP", "Short Term"];
    const sortedLevels = uniqueLevels.sort((a, b) => {
      const idxA = preferredOrder.indexOf(a);
      const idxB = preferredOrder.indexOf(b);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

    return sortedLevels.map(level => {
      const sectorsForLevel = Array.from(new Set(
        activeList
          .filter(c => c.academicLevel === level)
          .map(c => c.industry)
          .filter(Boolean)
      )).sort();
      
      // Fix: Explicitly type label as string to avoid type mismatch with the literal AcademicLevel union when using display-friendly overrides.
      let label: string = level;
      if (level === 'Certificate') label = 'Certificate Course';
      if (level === 'UG Certificate (NSDC)') label = 'UG Certificate (NSDC)';
      if (level === 'UG Diploma') label = 'UG Diploma Course';
      if (level === 'UG Degree') label = 'UG Degree Course';
      if (level === 'Master') label = 'Master Degree';

      return {
        label: label,
        level: level,
        sectors: sectorsForLevel
      };
    });
  }, [courses]);

  const getCleanPath = (path: string) => {
    if (!path) return '/';
    let clean = path;
    if (clean.startsWith('#/')) clean = clean.substring(1);
    if (clean.startsWith('#') && !clean.startsWith('#/')) clean = `/${clean.substring(1)}`;
    if (!clean.startsWith('/')) clean = `/${clean}`;
    return clean;
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 py-2 px-1 flex items-center gap-1 group focus-visible:outline-none ${
      isActive 
        ? 'text-emerald-600 border-b-2 border-emerald-600' 
        : 'text-slate-700 hover:text-emerald-600'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-sans shadow-sm">
      {alert.enabled && (
        <div className="bg-[#0f172a] text-white py-2 px-4 border-b border-white/5 h-10 flex items-center">
          <div className="container mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
               <span className="text-emerald-400">{alert.text}</span>
               <span className="hidden md:inline text-slate-300 opacity-80">{alert.subtext}</span>
            </div>
            <Link to={alert.linkPath} className="text-emerald-400 hover:text-white transition-colors flex items-center gap-2 border-b border-emerald-400/30">
              {alert.linkText} <i className="fa-solid fa-chevron-right text-[7px]"></i>
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-slate-100 h-16 md:h-20 flex items-center">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 md:w-20 md:h-14 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-xl md:text-2xl text-[#059669] tracking-tighter uppercase whitespace-nowrap transition-all">
                {config.name}
              </span>
              <span className="text-[8px] md:text-[10px] text-[#059669] font-black uppercase tracking-[0.2em] mt-0.5 opacity-90 transition-all">
                {config.tagline}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-7">
            {config.navigation.map((item) => {
              const isAcademics = item.label.toUpperCase() === 'ACADEMICS';
              const cleanPath = getCleanPath(item.path);

              if (isAcademics) {
                return (
                  <div 
                    key={item.label}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setIsAcademicsOpen(true)}
                    onMouseLeave={() => {
                      setIsAcademicsOpen(false);
                      setActiveLevel(null);
                    }}
                  >
                    <NavLink to="/academics" className={navLinkClasses}>
                      {item.label} 
                      <i className={`fa-solid fa-chevron-down text-[9px] transition-transform ${isAcademicsOpen ? 'rotate-180' : ''}`}></i>
                    </NavLink>
                    
                    {isAcademicsOpen && (
                      <div className="absolute top-full left-[-20px] pt-2 animate-fade-in-down z-[120] min-w-[240px]">
                        <div className="bg-white shadow-2xl border-t-4 border-emerald-600 flex flex-col overflow-visible rounded-b-xl">
                            {academicsMenu.map((tier, i) => (
                              <div 
                                key={i}
                                className="relative group/tier"
                                onMouseEnter={() => setActiveLevel(tier.level)}
                              >
                                <Link 
                                  to={`/academics?level=${encodeURIComponent(tier.level)}`}
                                  className={`px-6 py-4 text-[10px] font-black tracking-widest flex justify-between items-center cursor-pointer transition-all border-b border-slate-50 ${activeLevel === tier.level ? 'text-emerald-600 bg-slate-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'}`}
                                >
                                  {tier.label.toUpperCase()}
                                  <i className={`fa-solid fa-chevron-right text-[8px] opacity-40 transition-transform ${activeLevel === tier.level ? 'translate-x-1' : ''}`}></i>
                                </Link>

                                {activeLevel === tier.level && tier.sectors.length > 0 && (
                                  <div className="absolute top-0 left-full ml-0.5 min-w-[300px] animate-fade-in-left">
                                     <div className="bg-white shadow-2xl border-l-4 border-emerald-500 rounded-r-xl overflow-hidden py-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                        <div className="px-5 py-3 border-b border-slate-100 mb-2 sticky top-0 bg-white z-10">
                                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Vocational Sector</span>
                                        </div>
                                        {tier.sectors.map((sector, idx) => {
                                          return (
                                            <Link
                                              key={idx}
                                              to={`/academics?level=${encodeURIComponent(tier.level)}&industry=${encodeURIComponent(sector)}`}
                                              className="block px-6 py-3 text-[10px] font-black text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all uppercase tracking-widest border-b border-slate-50/50 last:border-0"
                                              onClick={() => {
                                                setIsAcademicsOpen(false);
                                                setActiveLevel(null);
                                              }}
                                            >
                                              {sector}
                                            </Link>
                                          );
                                        })}
                                     </div>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink key={item.label} to={getCleanPath(item.path)} className={navLinkClasses} end={getCleanPath(item.path) === '/'}>
                  {item.label}
                </NavLink>
              );
            })}
            
            <div className="flex items-center gap-4 ml-4">
              <Link to="/enroll" className="px-5 py-2.5 bg-[#059669] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#047857] transition-all shadow-md active:scale-95">
                Enroll Now
              </Link>

              <Link to={isAuthenticated ? "/admin" : "/login"} className="px-5 py-2.5 bg-[#1e1b4b] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 active:scale-95">
                 <i className="fa-solid fa-gauge-high text-[10px]"></i>
                 Admin
              </Link>
            </div>
          </nav>

          <button className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 bg-slate-100 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 md:top-20 bg-white shadow-2xl z-[90] overflow-y-auto max-h-[calc(100vh-6rem)] border-t border-slate-100">
          <div className="flex flex-col p-6 space-y-2">
            {config.navigation.map((item) => {
              const isAcademics = item.label.toUpperCase() === 'ACADEMICS';
              if (isAcademics) {
                return (
                  <div key={item.label} className="space-y-2">
                    <button 
                      onClick={() => setIsAcademicsOpen(!isAcademicsOpen)}
                      className="w-full flex justify-between items-center font-black text-slate-800 text-sm uppercase tracking-widest px-4 py-4 rounded-xl hover:bg-slate-50"
                    >
                      {item.label}
                      <i className={`fa-solid fa-chevron-${isAcademicsOpen ? 'up' : 'down'} text-xs`}></i>
                    </button>
                    {isAcademicsOpen && (
                      <div className="pl-6 space-y-1 border-l-2 border-emerald-100 ml-4">
                        {academicsMenu.map((tier, i) => (
                           <div key={i} className="space-y-1">
                             <button 
                               onClick={() => setActiveLevel(activeLevel === tier.level ? null : tier.level)}
                               className="w-full text-left font-black text-slate-500 text-[11px] uppercase tracking-widest py-3 px-4 flex justify-between items-center"
                             >
                               {tier.label}
                               <i className={`fa-solid fa-chevron-${activeLevel === tier.level ? 'up' : 'down'} text-[10px]`}></i>
                             </button>
                             {activeLevel === tier.level && (
                               <div className="pl-4 space-y-1">
                                 {tier.sectors.map((sector, idx) => {
                                   return (
                                     <Link 
                                        key={idx} 
                                        to={`/academics?level=${encodeURIComponent(tier.level)}&industry=${encodeURIComponent(sector)}`}
                                        className="block font-bold text-slate-400 text-[10px] uppercase py-2 px-4 hover:text-emerald-600"
                                        onClick={() => setIsMenuOpen(false)}
                                     >
                                        {sector}
                                     </Link>
                                   );
                                 })}
                               </div>
                             )}
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <NavLink key={item.label} to={getCleanPath(item.path)} className="font-black text-slate-800 text-sm uppercase tracking-widest px-4 py-4 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </NavLink>
              );
            })}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link to="/enroll" className="bg-[#059669] text-white font-black py-4 rounded-xl text-center uppercase tracking-widest text-[10px]" onClick={() => setIsMenuOpen(false)}>Enroll</Link>
              <Link to={isAuthenticated ? "/admin" : "/login"} className="bg-[#1e1b4b] text-white font-black py-4 rounded-xl text-center uppercase tracking-widest text-[10px]" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </header>
  );
};

export default Header;
