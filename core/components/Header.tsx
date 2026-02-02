
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SiteConfig } from '../types';

interface HeaderProps {
  config: SiteConfig;
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ config, isAuthenticated = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);
  const location = useLocation();
  const logoUrl = config.logo || "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png";
  const alert = config.admissionAlert || { enabled: false, text: '', subtext: '', linkText: '', linkPath: '/enroll' };

  const academicsMenu = {
    categories: ["COURSES", "DEPARTMENTS", "FACULTIES", "STUDY CENTER", "DISTANCE LEARNING CENTER", "TEACHING PLAN", "CLASS ROUTINE", "ACADEMIC CALENDAR", "PROGRAMME OUTCOME"],
    courses: ["UG CERTIFICATE COURSE", "UG DIPLOMA COURSE", "UG DEGREE COURSE", "POST GRADUATE COURSE", "UGC SPONSORED COURSE", "ADDON COURSE", "ITEP"]
  };

  const isInternalLink = (path: string) => {
    if (!path) return false;
    return path.startsWith('#') || path.startsWith('/') || path.includes(window.location.origin);
  };

  const getCleanPath = (path: string) => {
    if (!path) return '/';
    // Robust cleanup to prevent /courses vs /academics mismatch errors
    let clean = path;
    if (clean.startsWith('#/')) clean = clean.substring(1);
    if (clean.startsWith('#') && !clean.startsWith('#/')) clean = `/${clean.substring(1)}`;
    if (!clean.startsWith('/')) clean = `/${clean}`;
    return clean;
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 py-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg ${
      isActive 
        ? 'text-emerald-600' 
        : 'text-slate-600 hover:text-emerald-600'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 shadow-sm font-sans">
      {alert.enabled && (
        <div className="bg-slate-900 text-white py-2 px-4 border-b border-white/5 h-8 md:h-10 flex items-center">
          <div className="container mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
               <span className="text-emerald-400">{alert.text}</span>
               <span className="hidden md:inline text-slate-300">{alert.subtext}</span>
            </div>
            <Link to={alert.linkPath} className="text-emerald-400 hover:text-white transition-colors underline decoration-1 underline-offset-4 flex items-center gap-2">
              {alert.linkText} <i className="fa-solid fa-chevron-right text-[7px]"></i>
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/50 h-24 md:h-32 flex items-center">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 md:gap-5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl">
            <div className="w-16 h-16 md:w-40 md:h-28 flex items-center justify-center transition-all group-hover:scale-105">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl md:text-3xl text-emerald-600 tracking-tighter uppercase whitespace-nowrap">
                {config.name}
              </span>
              <span className="text-[8px] md:text-xs text-emerald-600 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1.5 opacity-90">
                {config.tagline}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
            {config.navigation.map((item) => {
              const isAcademics = item.label.toUpperCase() === 'ACADEMICS';
              const cleanPath = getCleanPath(item.path);

              if (isAcademics) {
                return (
                  <div 
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setIsAcademicsOpen(true)}
                    onMouseLeave={() => setIsAcademicsOpen(false)}
                  >
                    <NavLink to={cleanPath} className={navLinkClasses}>
                      {item.label} <i className={`fa-solid fa-chevron-down ml-1 text-[8px] transition-transform ${isAcademicsOpen ? 'rotate-180' : ''}`}></i>
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${location.pathname.includes('/academics') ? 'scale-x-100' : ''}`}></span>
                    </NavLink>
                    
                    {/* MEGA MENU - Professional dropdown structure */}
                    {isAcademicsOpen && (
                      <div className="absolute top-full -left-20 pt-6 animate-fade-in z-[120]">
                        <div className="bg-white shadow-4xl border border-slate-100 flex overflow-hidden min-w-[550px] rounded-3xl">
                          {/* Left Column: Categories */}
                          <div className="w-1/2 bg-slate-50 py-6 border-r border-slate-200">
                            {academicsMenu.categories.map((cat, i) => (
                              <div key={i} className={`px-8 py-3 text-[11px] font-black tracking-widest cursor-pointer transition-colors ${i === 0 ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'}`}>
                                {cat}
                              </div>
                            ))}
                          </div>
                          {/* Right Column: Dynamic Course Types */}
                          <div className="w-1/2 py-6">
                             {academicsMenu.courses.map((course, i) => (
                               <Link 
                                 key={i} 
                                 to={`/academics?level=${encodeURIComponent(course.replace(' COURSE', ''))}`}
                                 className="block px-10 py-4 text-[11px] font-black text-slate-800 hover:text-emerald-600 tracking-widest uppercase transition-colors"
                                 onClick={() => setIsAcademicsOpen(false)}
                               >
                                 {course}
                               </Link>
                             ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink key={item.label} to={cleanPath} className={navLinkClasses} end={cleanPath === '/'}>
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${location.pathname === cleanPath ? 'scale-x-100' : ''}`}></span>
                </NavLink>
              );
            })}
            
            <Link to="/enroll" className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-900 transition-all">
              Enroll Now
            </Link>

            <Link to={isAuthenticated ? "/admin" : "/login"} className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
              <i className={`fa-solid ${isAuthenticated ? 'fa-gauge-high' : 'fa-lock'} mr-2`}></i>
              {isAuthenticated ? "Dashboard" : "Login"}
            </Link>
          </nav>

          <button className="lg:hidden w-12 h-12 flex flex-col items-center justify-center text-slate-900 bg-slate-50 border border-slate-200 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-24 md:top-32 bg-white border-t border-slate-100 shadow-3xl z-[90] overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="flex flex-col p-8 space-y-4">
            {config.navigation.map((item) => (
              <NavLink key={item.label} to={getCleanPath(item.path)} className="font-black text-lg uppercase tracking-widest px-6 py-5 rounded-2xl hover:bg-emerald-50 text-slate-900" onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/enroll" className="bg-emerald-600 text-white font-black py-6 rounded-3xl text-center uppercase tracking-widest text-[11px]" onClick={() => setIsMenuOpen(false)}>Start Application</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
