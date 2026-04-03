
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Course } from '../types';

interface MobileCourseNavigatorProps {
  courses: Course[];
}

const MobileCourseNavigator: React.FC<MobileCourseNavigatorProps> = ({ courses }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const masterSectors = useMemo(() => [
    { label: "Automotive", value: "Automotive", icon: "fa-car" },
    { label: "BFSI (Banking, Financial Services & Insurance)", value: "Banking, Financial Services & Insurance", icon: "fa-landmark" },
    { label: "Electronics & Hardware", value: "Electronics and Hardware", icon: "fa-microchip" },
    { label: "IT-ITes", value: "IT/ITES", icon: "fa-laptop-code" },
    { label: "Retail", value: "Retail", icon: "fa-bag-shopping" },
    { label: "Tourism & Hospitality", value: "Tourism and Hospitality", icon: "fa-hotel" }
  ], []);

  const categories = useMemo(() => [
    { label: "Short Term Certificate Course", level: "Certificate (NSDC)", sectorList: certificateSectors },
    { label: "UG Certificate Course", level: "UG Certificate (NSDC)", sectorList: vocationalSectors },
    { label: "UG Diploma Course", level: "UG Diploma", sectorList: vocationalSectors },
    { label: "UG Degree Course", level: "UG Degree", aliases: ["B. Voc"], sectorList: vocationalSectors },
    { label: "Master Course", level: "Master", sectorList: masterSectors }
  ], [certificateSectors, vocationalSectors, masterSectors]);

  // Find one "famous" (featured) program for each category
  const famousPrograms = useMemo(() => {
    return categories.map(cat => {
      const categoryCourses = courses.filter(c => 
        c.academicLevel === cat.level || 
        (cat.aliases && cat.aliases.includes(c.academicLevel as any))
      );
      const featured = categoryCourses.find(c => c.isFeatured) || categoryCourses[0];
      return { category: cat.label, course: featured };
    }).filter(item => item.course);
  }, [courses, categories]);

  const handleSectorClick = (sectorValue: string, level: string) => {
    const cleanLevel = level.replace(' (NSDC)', '');
    navigate(`/academics?level=${encodeURIComponent(cleanLevel)}&industry=${encodeURIComponent(sectorValue)}`);
  };

  return (
    <div className="bg-slate-50 py-10 px-6 border-y border-slate-200">
      <div className="text-center mb-8">
        <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] mb-2 block">Quick Navigator</span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Top Programs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
        {famousPrograms.map((item, idx) => {
          const cat = categories.find(c => c.label === item.category);
          const isExpanded = expandedCategory === item.category;

          return (
            <div key={idx} className="bg-white rounded-[2rem] md:rounded-[1.5rem] border border-slate-200 shadow-sm relative flex flex-col md:col-span-1 col-span-1">
              <div className="p-5 md:p-4 flex items-center md:flex-row gap-4 md:gap-3 text-left flex-grow">
                <div className="w-16 h-16 md:w-12 md:h-12 rounded-xl md:rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                  <img src={item.course.image} alt={item.course.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow overflow-hidden">
                  <h3 className="text-lg md:text-[10px] lg:text-[11px] font-black text-emerald-600 uppercase tracking-tight leading-tight md:whitespace-nowrap md:truncate">{item.category}</h3>
                </div>
              </div>

              <div className="px-5 md:px-4 pb-5 md:pb-4 relative mt-auto">
                <button 
                  onClick={() => setExpandedCategory(isExpanded ? null : item.category)}
                  className={`w-full py-4 md:py-3 rounded-xl md:rounded-lg text-sm md:text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-2 border ${
                    isExpanded 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <span className="md:hidden">{isExpanded ? 'Close Menu' : 'View More Programs'}</span>
                  <span className="hidden md:inline">{isExpanded ? 'Close' : 'View More'}</span>
                  <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[8px] md:text-[8px]`}></i>
                </button>

                {isExpanded && cat && (
                  <div className="absolute left-0 right-0 top-[calc(100%-10px)] z-[100] bg-white border border-slate-200 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-fade-in-up max-h-[280px] overflow-y-auto">
                    <div className="px-4 py-2 mb-1 border-b border-slate-50 sticky top-0 bg-white z-10">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Available Trades</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {cat.sectorList.map((sector) => (
                        <button
                          key={sector.label}
                          onClick={() => handleSectorClick(sector.value, cat.level)}
                          className="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center gap-3 active:bg-emerald-100 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-emerald-200 group-hover:bg-white transition-all shadow-sm">
                            <i className={`fa-solid ${sector.icon} text-[11px] text-emerald-600`}></i>
                          </div>
                          <span className="flex-grow">{sector.label}</span>
                          <i className="fa-solid fa-chevron-right text-[7px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCourseNavigator;
