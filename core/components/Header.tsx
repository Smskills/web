
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { SiteConfig, Course } from '../types';

interface HeaderProps {
  config: SiteConfig;
  courses?: Course[];
}

const Header: React.FC<HeaderProps> = ({ config, courses = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('sms_is_auth') === 'true');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Specific sectors for the "Certificate Course" category (11 Sectors)
   */
  const certificateSectors = useMemo(() => [
    { label: "Apparel", value: "Apparel", icon: "fa-shirt" },
    { label: "Automotive", value: "Automotive", icon: "fa-car" },
    { label: "Beauty & Wellness", value: "Beauty & Wellness", icon: "fa-spa" },
    { label: "BFSI", value: "Banking, Financial Services & Insurance", icon: "fa-landmark" },
    { label: "Electronics", value: "Electronics and Hardware", icon: "fa-microchip" },
    { label: "Food Processing", value: "Food Processing", icon: "fa-utensils" },
    { label: "IT-ITes", value: "IT/ITES", icon: "fa-laptop-code" },
    { label: "Logistics", value: "Logistics", icon: "fa-truck-fast" },
    { label: "Retails", value: "Retail", icon: "fa-bag-shopping" },
    { label: "Telecom", value: "Telecom", icon: "fa-tower-cell" },
    { label: "Tourism & Hospitality", value: "Tourism and Hospitality", icon: "fa-hotel" }
  ], []);

  /**
   * Broad vocational sectors for UG Certificate, UG Diploma, and UG Degree (23 Sectors)
   */
  const vocationalSectors = useMemo(() => [
    { label: "Agriculture", value: "Agriculture", icon: "fa-leaf" },
    { label: "Automotive", value: "Automotive", icon: "fa-car" },
    { label: "Apparel", value: "Apparel", icon: "fa-shirt" },
    { label: "Banking, Financial Services & Insurance (BFSI)", value: "Banking, Financial Services & Insurance", icon: "fa-landmark" },
    { label: "Beauty & Wellness", value: "Beauty & Wellness", icon: "fa-spa" },
    { label: "Capital Goods / Manufacturing", value: "Capital Goods", icon: "fa-gears" },
    { label: "Construction", value: "Construction", icon: "fa-helmet-safety" },
    { label: "Electronics & Hardware", value: "Electronics and Hardware", icon: "fa-microchip" },
    { label: "Food Processing", value: "Food Processing", icon: "fa-utensils" },
    { label: "Furniture & Fitting / Interior", value: "Furniture & Fitting", icon: "fa-couch" },
    { label: "Green Jobs / Renewable Energy", value: "Green Jobs", icon: "fa-seedling" },
    { label: "Healthcare", value: "Healthcare", icon: "fa-hand-holding-medical" },
    { label: "IT–ITeS", value: "IT/ITES", icon: "fa-laptop-code" },
    { label: "Life Sciences", value: "Life Science", icon: "fa-dna" },
    { label: "Logistics", value: "Logistics", icon: "fa-truck-fast" },
    { label: "Media & Entertainment", value: "Media & Entertainment", icon: "fa-clapperboard" },
    { label: "Mining", value: "Mining", icon: "fa-mountain-sun" },
    { label: "Plumbing", value: "Plumbing", icon: "fa-wrench" },
    { label: "Retail", value: "Retail", icon: "fa-bag-shopping" },
    { label: "Rubber / Chemical / Petrochemical", value: "Rubber, Chemical & Petrochemical", icon: "fa-flask" },
    { label: "Telecom", value: "Telecom", icon: "fa-tower-cell" },
    { label: "Textile & Handloom", value: "Textile & Handloom", icon: "fa-scissors" },
    { label: "Tourism & Hospitality", value: "Tourism and Hospitality", icon: "fa-hotel" }
  ], []);

  /**
   * Sectors for Master Course (6 Sectors)
   */
  const masterSectors = useMemo(() => [
    { label: "Automotive", value: "Automotive", icon: "fa-car" },
    { label: "BFSI (Banking, Financial Services & Insurance)", value: "Banking, Financial Services & Insurance", icon: "fa-landmark" },
    { label: "Electronics & Hardware", value: "Electronics and Hardware", icon: "fa-microchip" },
    { label: "IT-ITeS", value: "IT/ITES", icon: "fa-laptop-code" },
    { label: "Retail", value: "Retail", icon: "fa-bag-shopping" },
    { label: "Tourism & Hospitality", value: "Tourism and Hospitality", icon: "fa-hotel" }
  ], []);

  const categories = useMemo(() => [
    { label: "Certificate Course", level: "Certificate (NSDC)", sectorList: certificateSectors },
    { label: "UG Certificate Course", level: "UG Certificate (NSDC)", sectorList: vocationalSectors },
    { label: "UG Diploma Course", level: "UG Diploma", sectorList: vocationalSectors },
    { label: "UG Degree Course", level: "UG Degree", aliases: ["B. Voc"], sectorList: vocationalSectors },
    { label: "Master Course", level: "Master", sectorList: masterSectors }
  ], [certificateSectors, vocationalSectors, masterSectors]);

  const groupedCourses = useMemo(() => {
    const map: Record<string, Course[]> = {};
    categories.forEach(cat => {
      if (!cat.sectorList) {
        map[cat.label] = courses.filter(c => 
          c.academicLevel === cat.level || 
          (cat.aliases && cat.aliases.includes(c.academicLevel as any))
        );
      }
    });
    return map;
  }, [courses, categories]);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem('sms_is_auth') === 'true');
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAcademicsOpen(false);
        setActiveCategory(null);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCourseClick = (courseId: string) => {
    setIsAcademicsOpen(false);
    setIsMenuOpen(false);
    setActiveCategory(null);
    navigate(`/academics?courseId=${courseId}`);
  };

  const handleSectorClick = (sectorValue: string, level: string) => {
    setIsAcademicsOpen(false);
    setIsMenuOpen(false);
    setActiveCategory(null);
    const cleanLevel = level.replace(' (NSDC)', '');
    navigate(`/academics?level=${encodeURIComponent(cleanLevel)}&industry=${encodeURIComponent(sectorValue)}`);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `text-[11px] font-black uppercase tracking-widest transition-all duration-300 py-2 group focus:outline-none ${
      isActive 
        ? 'text-emerald-600 border-b-2 border-emerald-600' 
        : 'text-slate-900 hover:text-emerald-600'
    }`;

  const adminBtnClass = `px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
    location.pathname === '/admin' || location.pathname === '/login'
      ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg' 
      : isAuthenticated 
        ? 'bg-emerald-600/10 text-emerald-700 border-emerald-600/20 hover:bg-emerald-600 hover:text-white'
        : 'bg-slate-900 text-slate-100 border-slate-950 hover:bg-emerald-600 hover:border-emerald-700'
  }`;

  const alert = config.admissionAlert;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-[100] font-sans">
      {alert?.enabled && (
        <div className="bg-slate-50 border-b border-slate-100 py-3">
          <div className="container mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0"></span>
              <div className="flex flex-wrap items-center gap-x-2 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-none">
                <span className="text-emerald-600">{alert.text}</span>
                <span className="text-slate-900 hidden sm:inline">{alert.subtext}</span>
              </div>
            </div>
            <Link to={alert.linkPath || "/enroll"} className="text-[10px] md:text-[11px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors flex items-center gap-1.5 shrink-0 border-b border-emerald-600/30 hover:border-emerald-600">
              {alert.linkText || "APPLY TODAY"} <i className="fa-solid fa-chevron-right text-[8px]"></i>
            </Link>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-6 h-28 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-5 group focus:outline-none rounded-xl" aria-label="Institute Home">
            <img src={config.logo || "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png"} alt="Logo" className="h-20 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="hidden md:flex flex-col leading-tight border-l-2 border-slate-100 pl-5">
              <span className="font-black text-2xl text-emerald-600 tracking-tighter uppercase whitespace-nowrap transition-colors">{config.name}</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.25em] mt-1 opacity-80">{config.tagline}</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden lg:flex items-center space-x-8 h-full">
            <NavLink to="/" className={navLinkClasses}>HOME</NavLink>
            <NavLink to="/about" className={navLinkClasses}>ABOUT</NavLink>
            
            <div className="relative h-full flex items-center" ref={dropdownRef}>
              <button 
                onMouseEnter={() => setIsAcademicsOpen(true)}
                onClick={() => setIsAcademicsOpen(!isAcademicsOpen)}
                className={`${navLinkClasses({ isActive: isAcademicsOpen })} flex items-center gap-1.5`}
              >
                ACADEMICS <i className={`fa-solid fa-chevron-down text-[8px] transition-transform ${isAcademicsOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {isAcademicsOpen && (
                <div 
                  className="absolute top-[100%] left-0 w-72 bg-white border border-slate-200 shadow-2xl rounded-b-2xl py-4 animate-fade-in-up"
                  onMouseLeave={() => { setIsAcademicsOpen(false); setActiveCategory(null); }}
                >
                  {categories.map((cat) => (
                    <div key={cat.label} className="relative group/cat">
                      <button
                        onMouseEnter={() => setActiveCategory(cat.label)}
                        className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                          activeCategory === cat.label ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {cat.label}
                        <i className="fa-solid fa-chevron-right text-[8px]"></i>
                      </button>

                      {activeCategory === cat.label && (
                        <div className="absolute top-0 left-full w-80 bg-white border border-slate-200 shadow-2xl rounded-xl py-4 ml-1 animate-fade-in-right max-h-[500px] overflow-y-auto custom-scrollbar">
                          {cat.sectorList ? (
                            <>
                              <div className="px-6 pb-2 mb-2 border-b border-slate-50">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Available Sectors</span>
                              </div>
                              <div className="grid grid-cols-1 gap-1">
                                {cat.sectorList.map(sector => (
                                  <button
                                    key={sector.label}
                                    onClick={() => handleSectorClick(sector.value, cat.level)}
                                    className="w-full text-left px-6 py-2.5 text-[10px] font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-3 group/sector"
                                  >
                                    <div className="w-5 h-5 rounded bg-slate-50 flex items-center justify-center group-hover/sector:bg-emerald-100 transition-colors">
                                      <i className={`fa-solid ${sector.icon} text-[10px] opacity-40 group-hover/sector:opacity-100 group-hover/sector:text-emerald-600`}></i>
                                    </div>
                                    {sector.label}
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="px-6 pb-2 mb-2 border-b border-slate-50">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Available Programs</span>
                              </div>
                              {groupedCourses[cat.label]?.length > 0 ? (
                                groupedCourses[cat.label].map(course => (
                                  <button
                                    key={course.id}
                                    onClick={() => handleCourseClick(course.id)}
                                    className="w-full text-left px-6 py-2.5 text-[10px] font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  >
                                    {course.name}
                                  </button>
                                ))
                              ) : (
                                <div className="px-6 py-4 text-[10px] text-slate-400 italic">No programs found</div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-2 px-6">
                    <Link to="/academics" onClick={() => setIsAcademicsOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline inline-block py-2">
                      View All Courses <i className="fa-solid fa-arrow-right ml-1"></i>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/notices" className={navLinkClasses}>NOTICES</NavLink>
            <NavLink to="/gallery" className={navLinkClasses}>GALLERY</NavLink>
            <NavLink to="/contact" className={navLinkClasses}>CONTACT</NavLink>

            <Link to="/enroll" className="bg-[#064e3b] text-white px-8 py-3.5 rounded-md text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#065f46] transition-all shadow-lg active:scale-95">ENROLL NOW</Link>
            <Link to="/admin" className={adminBtnClass}><i className={`fa-solid ${isAuthenticated ? 'fa-gauge-high' : 'fa-lock'}`}></i>{isAuthenticated ? "DASHBOARD" : "LOGIN"}</Link>
          </nav>

          <button className="lg:hidden w-12 h-12 flex items-center justify-center text-slate-900 bg-slate-50 border border-slate-200 rounded-lg active:scale-90 transition-transform" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-8 space-y-6 shadow-2xl animate-fade-in-down overflow-y-auto max-h-[80vh]">
          <div className="flex flex-col space-y-5">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-black text-xs uppercase tracking-widest text-slate-900">HOME</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="font-black text-xs uppercase tracking-widest text-slate-900">ABOUT</Link>
            
            <div className="space-y-4 border-l-2 border-emerald-100 pl-4 py-2">
              <span className="font-black text-xs uppercase tracking-widest text-emerald-600 block mb-2">ACADEMICS</span>
              {categories.map(cat => (
                <div key={cat.label} className="space-y-2">
                  <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400">{cat.label}</span>
                  <div className="flex flex-col gap-2 pl-2">
                    {cat.sectorList ? (
                      cat.sectorList.slice(0, 5).map(sector => (
                        <button key={sector.label} onClick={() => handleSectorClick(sector.value, cat.level)} className="text-left text-[10px] font-bold text-slate-600">
                          {sector.label}
                        </button>
                      ))
                    ) : (
                      groupedCourses[cat.label]?.slice(0, 3).map(course => (
                        <button key={course.id} onClick={() => handleCourseClick(course.id)} className="text-left text-[10px] font-bold text-slate-600">
                          {course.name}
                        </button>
                      ))
                    )}
                    <Link to="/academics" onClick={() => setIsMenuOpen(false)} className="text-[9px] font-black text-emerald-600 uppercase">View All</Link>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/notices" onClick={() => setIsMenuOpen(false)} className="font-black text-xs uppercase tracking-widest text-slate-900">NOTICES</Link>
            <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="font-black text-xs uppercase tracking-widest text-slate-900">GALLERY</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="font-black text-xs uppercase tracking-widest text-slate-900">CONTACT</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="font-black text-xs uppercase tracking-widest text-emerald-600 flex items-center gap-2"><i className={`fa-solid ${isAuthenticated ? 'fa-gauge-high' : 'fa-lock'}`}></i>{isAuthenticated ? "DASHBOARD" : "LOGIN"}</Link>
          </div>
          <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
            <Link to="/enroll" onClick={() => setIsMenuOpen(false)} className="bg-[#064e3b] text-white py-4 rounded-xl text-center font-black text-xs uppercase tracking-widest shadow-xl">ENROLL NOW</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
