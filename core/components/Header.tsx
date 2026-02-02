
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

  const academicsMenu = [
    { label: "COURSES", hasArrow: true },
    { label: "DEPARTMENTS", hasArrow: true },
    { label: "FACULTIES", hasArrow: false },
    { label: "STUDY CENTER", hasArrow: false },
    { label: "DISTANCE LEARNING CENTER", hasArrow: false },
    { label: "TEACHING PLAN", hasArrow: false },
    { label: "CLASS ROUTINE", hasArrow: false },
    { label: "ACADEMIC CALENDAR", hasArrow: false },
    { label: "PROGRAMME OUTCOME", hasArrow: false }
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
    `relative text-[12px] font-extrabold uppercase tracking-wider transition-all duration-300 py-2 px-1 flex items-center gap-1 group focus-visible:outline-none ${
      isActive 
        ? 'text-yellow-400' 
        : 'text-white hover:text-yellow-400'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-sans">
      {/* Top Admission Bar */}
      {alert.enabled && (
        <div className="bg-slate-950 text-white py-2 px-4 border-b border-white/5 h-10 flex items-center">
          <div className="container mx-auto flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-3">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               <span className="text-emerald-400">{alert.text}</span>
               <span className="hidden md:inline text-slate-400">{alert.subtext}</span>
            </div>
            <Link to={alert.linkPath} className="text-yellow-500 hover:text-white transition-colors flex items-center gap-2">
              {alert.linkText} <i className="fa-solid fa-chevron-right text-[8px]"></i>
            </Link>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="bg-[#1e1b4b] border-b border-white/5 h-20 md:h-24 flex items-center shadow-xl">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg p-1 transition-transform group-hover:scale-105">
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl md:text-2xl text-white tracking-tighter uppercase whitespace-nowrap">
                {config.name}
              </span>
              <span className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {config.tagline}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {config.navigation.map((item) => {
              const isAcademics = item.label.toUpperCase() === 'ACADEMICS';
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
                      <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isAcademicsOpen ? 'rotate-180' : ''}`}></i>
                    </NavLink>
                    
                    {/* DROP DOWN MENU */}
                    {isAcademicsOpen && (
                      <div className="absolute top-full left-[-20px] pt-0 animate-fade-in-down z-[120] min-w-[280px]">
                        <div className="bg-white shadow-2xl border-t-[5px] border-yellow-500 flex flex-col overflow-hidden">
                            {academicsMenu.map((menuItem, i) => (
                              <div 
                                key={i} 
                                className={`px-6 py-4 text-[11px] font-extrabold tracking-widest flex justify-between items-center cursor-pointer transition-all border-b border-slate-100 ${
                                  i === 0 ? 'text-[#1e1b4b] bg-slate-50' : 'text-slate-600 hover:text-[#1e1b4b] hover:bg-slate-50'
                                }`}
                              >
                                {menuItem.label}
                                {menuItem.hasArrow && <i className="fa-solid fa-chevron-right text-[10px] opacity-40"></i>}
                              </div>
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
            
            <Link to="/enroll" className="px-6 py-3 bg-yellow-500 text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg">
              Enroll Now
            </Link>

            <Link to={isAuthenticated ? "/admin" : "/login"} className="text-white hover:text-yellow-400 transition-colors">
               <i className={`fa-solid ${isAuthenticated ? 'fa-gauge-high' : 'fa-lock'} text-lg`}></i>
            </Link>
          </nav>

          <button className="lg:hidden w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 md:top-24 bg-[#1e1b4b] shadow-2xl z-[90] overflow-y-auto max-h-[calc(100vh-6rem)] border-t border-white/5">
          <div className="flex flex-col p-6 space-y-2">
            {config.navigation.map((item) => (
              <NavLink key={item.label} to={getCleanPath(item.path)} className="font-bold text-white text-base uppercase tracking-widest px-4 py-4 rounded-xl hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/enroll" className="bg-yellow-500 text-slate-950 font-black py-5 rounded-xl text-center uppercase tracking-widest text-[11px] mt-4" onClick={() => setIsMenuOpen(false)}>Start Application</Link>
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
