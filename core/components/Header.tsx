
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

  // Academics dropdown structure as requested
  const academicsMenu = [
    { label: "UG CERTIFICATE COURSE", level: "UG Certificate" },
    { label: "UG DIPLOMA COURSE", level: "UG Diploma" },
    { label: "UG DEGREE COURSE", level: "UG Degree" },
    { label: "MASTER COURSE", level: "Master" }
  ];

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
      {/* Top Admission Bar - Very dark as per image */}
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

      {/* Main Navigation Bar - White as per image */}
      <div className="bg-white border-b border-slate-100 h-20 md:h-24 flex items-center">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-xl md:text-2xl text-[#059669] tracking-tighter uppercase whitespace-nowrap">
                {config.name}
              </span>
              <span className="text-[8px] md:text-[9px] text-[#059669] font-bold uppercase tracking-widest mt-0.5 opacity-80">
                {config.tagline}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-7">
            {config.navigation.map((item) => {
              const isAcademics = item.label.toUpperCase() === 'ACADEMICS' || item.label.toUpperCase() === 'COURSES';
              const cleanPath = getCleanPath(item.path);

              if (isAcademics) {
                return (
                  <div 
                    key={item.label}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setIsAcademicsOpen(true)}
                    onMouseLeave={() => setIsAcademicsOpen(false)}
                  >
                    <NavLink to={cleanPath} className={navLinkClasses}>
                      {item.label} 
                      <i className={`fa-solid fa-chevron-down text-[9px] transition-transform ${isAcademicsOpen ? 'rotate-180' : ''}`}></i>
                    </NavLink>
                    
                    {/* DROP DOWN MENU */}
                    {isAcademicsOpen && (
                      <div className="absolute top-full left-[-20px] pt-2 animate-fade-in-down z-[120] min-w-[260px]">
                        <div className="bg-white shadow-2xl border-t-4 border-emerald-600 flex flex-col overflow-hidden rounded-b-xl">
                            {academicsMenu.map((menuItem, i) => (
                              <Link 
                                key={i} 
                                to={`/academics?level=${encodeURIComponent(menuItem.level)}`}
                                className="px-6 py-4 text-[10px] font-black tracking-widest flex justify-between items-center cursor-pointer transition-all border-b border-slate-50 text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                                onClick={() => setIsAcademicsOpen(false)}
                              >
                                {menuItem.label}
                                <i className="fa-solid fa-chevron-right text-[8px] opacity-40"></i>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink key={item.label} to={cleanPath} className={navLinkClasses} end={cleanPath === '/'}>
                  {item.label}
                </NavLink>
              );
            })}
            
            <div className="flex items-center gap-4 ml-4">
              <Link to="/enroll" className="px-6 py-3.5 bg-[#059669] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#047857] transition-all shadow-md active:scale-95">
                Enroll Now
              </Link>

              <Link to={isAuthenticated ? "/admin" : "/login"} className="px-6 py-3.5 bg-[#1e1b4b] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 active:scale-95">
                 <i className={`fa-solid ${isAuthenticated ? 'fa-gauge-high' : 'fa-lock'} text-xs`}></i>
                 {isAuthenticated ? "Dashboard" : "Dashboard"}
              </Link>
            </div>
          </nav>

          <button className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 bg-slate-100 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 md:top-24 bg-white shadow-2xl z-[90] overflow-y-auto max-h-[calc(100vh-6rem)] border-t border-slate-100">
          <div className="flex flex-col p-6 space-y-2">
            {config.navigation.map((item) => (
              <NavLink key={item.label} to={getCleanPath(item.path)} className="font-black text-slate-800 text-sm uppercase tracking-widest px-4 py-4 rounded-xl hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
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
        .animate-fade-in-down {
          animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;
