
import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Course } from '../types.ts';
import { CardSkeleton } from '../components/Skeleton.tsx';
import FormattedText from '../components/FormattedText.tsx';
import { INITIAL_CONTENT } from '../data/defaultContent.ts';

interface CoursesPageProps {
  coursesState: {
    list: Course[];
  };
  isLoading?: boolean;
}

type SortOption = 'default' | 'name-asc' | 'name-desc' | 'duration';

/**
 * Institutional Academic Catalog Page
 * Features a "Single Screen Front Cover" spotlight and a sortable, searchable program grid.
 */
const CoursesPage: React.FC<CoursesPageProps> = ({ coursesState, isLoading = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [spotlightCourse, setSpotlightCourse] = useState<Course | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchTerm, setSearchTerm] = useState('');
  
  const levelFilter = searchParams.get('level');
  const courseIdParam = searchParams.get('courseId');

  const list = coursesState?.list || INITIAL_CONTENT.courses.list;
  
  useEffect(() => {
    if (courseIdParam && list.length > 0) {
      const course = list.find(c => c.id === courseIdParam);
      if (course) {
        setSpotlightCourse(course);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setSpotlightCourse(null);
    }
  }, [courseIdParam, list]);

  const displayedCourses = useMemo(() => {
    // 1. Filter by level and search term
    let result = list.filter(c => {
      const isLevelMatch = !levelFilter || (c.academicLevel || '').toLowerCase().includes(levelFilter.toLowerCase());
      const isSearchMatch = !searchTerm || 
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return c.status === 'Active' && isLevelMatch && isSearchMatch;
    });

    // 2. Sort
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-desc':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      case 'duration':
        result.sort((a, b) => (a.duration || '').localeCompare(b.duration || ''));
        break;
      case 'default':
      default:
        // Recently added first (using ID numeric value as proxy)
        result.sort((a, b) => {
          const idA = parseInt(a.id.replace(/\D/g, '')) || 0;
          const idB = parseInt(b.id.replace(/\D/g, '')) || 0;
          return idB - idA;
        });
        break;
    }

    return result;
  }, [list, levelFilter, sortBy, searchTerm]);

  const handleCloseSpotlight = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('courseId');
    setSearchParams(newParams);
    setSpotlightCourse(null);
  };

  const handleSelectCourse = (id: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('courseId', id);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    handleSelectCourse('');
    setSortBy('default');
    setSearchTerm('');
  };

  // Helper to parse multiline benefits string into a clean array
  const getBenefitsList = (benefits: string | undefined) => {
    if (!benefits) return [];
    return benefits
      .split('\n')
      .map(b => b.replace(/^[•\-\*]\s*/, '').trim())
      .filter(b => b.length > 0);
  };

  return (
    <div className="bg-white font-sans min-h-screen">
      
      {/* 1. SINGLE-SCREEN FRONT COVER SPOTLIGHT - UPDATED TO PREMIUM LIGHT THEME */}
      {spotlightCourse && (
        <section className="bg-gradient-to-br from-white via-emerald-50/40 to-slate-100 text-slate-900 overflow-hidden animate-fade-in relative min-h-[calc(100vh-130px)] lg:h-[calc(100vh-130px)] flex flex-col justify-center border-b border-slate-200">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/[0.03] blur-[120px] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 py-8 relative z-10">
            {/* Top Bar for Spotlight */}
            <div className="flex justify-between items-center mb-10 border-b border-slate-200/60 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]"></span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">PROGRAM SPOTLIGHT</span>
              </div>
              <button 
                onClick={handleCloseSpotlight}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all flex items-center gap-2 group px-4 py-2 bg-white/50 rounded-xl border border-slate-200"
              >
                Close View <i className="fa-solid fa-xmark text-xs transition-transform group-hover:rotate-90"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
              <div className="lg:col-span-5 hidden lg:block">
                {/* POSTER CONTAINER WITH ALWAYS SHINING EFFECT */}
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-200 shadow-4xl group bg-white h-[550px]">
                  <img 
                    src={spotlightCourse.image} 
                    alt={spotlightCourse.name} 
                    className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105 opacity-100"
                  />
                  
                  {/* PERSISTENT SHINE OVERLAY */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3rem]">
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-sweep"></div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-8 left-8">
                     <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl border border-emerald-400/30 flex items-center gap-4">
                        <i className="fa-solid fa-award text-2xl"></i>
                        <div>
                           <p className="text-[8px] font-black uppercase tracking-widest leading-none">Government Verified</p>
                           <p className="text-xs font-bold leading-tight uppercase">Institutional Path</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 bg-emerald-600/10 px-4 py-2 rounded-xl border border-emerald-600/10">
                    <span className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.3em]">
                      {spotlightCourse.academicLevel}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900">
                    {spotlightCourse.name}
                  </h1>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { label: 'Certificate', value: spotlightCourse.certification || spotlightCourse.academicLevel, icon: 'fa-certificate' },
                     { label: 'Mode', value: spotlightCourse.mode === 'Hybrid' ? 'Hybrid Track' : spotlightCourse.mode, icon: 'fa-chalkboard-user' },
                     { label: 'Duration', value: spotlightCourse.duration, icon: 'fa-clock' },
                     { label: 'Eligibility', value: spotlightCourse.eligibility || '12th Pass', icon: 'fa-id-card' }
                   ].map((spec, i) => (
                     <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl group hover:border-emerald-500/30 hover:shadow-xl transition-all">
                        <div className="flex items-center gap-2 mb-3">
                           <i className={`fa-solid ${spec.icon} text-emerald-600 text-[10px]`}></i>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                        </div>
                        <p className="text-sm font-black text-slate-900 leading-tight uppercase truncate">{spec.value}</p>
                     </div>
                   ))}
                </div>

                <div className="space-y-6">
                   <div className="bg-white/60 p-6 rounded-[2rem] border border-slate-200/60 relative backdrop-blur-sm">
                      <div className="absolute top-4 right-6 text-slate-100 text-4xl"><i className="fa-solid fa-quote-right"></i></div>
                      <FormattedText 
                        text={spotlightCourse.description} 
                        className="text-slate-600 text-base md:text-lg leading-relaxed font-medium"
                      />
                   </div>
                   
                   {/* DYNAMIC BENEFITS LIST IN SPOTLIGHT */}
                   {spotlightCourse.showBenefits !== false && getBenefitsList(spotlightCourse.benefits).length > 0 ? (
                     <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-4 animate-fade-in-up">
                        {getBenefitsList(spotlightCourse.benefits).map((benefit, i) => (
                          <div key={i} className="flex items-center gap-3 group">
                             <div className="w-7 h-7 bg-emerald-600/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                               <i className="fa-solid fa-circle-check text-emerald-600 group-hover:text-white text-[10px]"></i>
                             </div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{benefit}</span>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600"><i className="fa-solid fa-check text-[10px]"></i></div>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Industry Mentor Support</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600"><i className="fa-solid fa-check text-[10px]"></i></div>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">NSDC Standards Compliant</span>
                        </div>
                     </div>
                   )}
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
                  <Link 
                    to={`/enroll?course=${encodeURIComponent(spotlightCourse.name)}`}
                    className="w-full sm:w-auto px-12 py-5 bg-[#020617] text-white font-black rounded-2xl hover:bg-emerald-600 hover:scale-[1.02] transition-all text-center uppercase tracking-widest text-xs shadow-2xl active:scale-95 shadow-slate-900/20"
                  >
                    Start Your Application <i className="fa-solid fa-paper-plane ml-3 text-[10px]"></i>
                  </Link>
                  <div className="flex flex-col items-start">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Fees</span>
                     <span className="text-2xl font-black text-emerald-600">{spotlightCourse.price || 'Scholarship'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. INSTITUTIONAL CATALOG GRID */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          {!spotlightCourse && (
            <div className="flex flex-col xl:flex-row justify-between items-end mb-20 gap-10">
              <div className="max-w-2xl">
                <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">OFFICIAL CATALOG</span>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">Explore Our Programs</h2>
                <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mt-6">
                  Browse our industry-verified technical tracks optimized for immediate career deployment.
                </p>
              </div>

              {/* SEARCH & SORT TOOLBAR */}
              <div className="w-full xl:w-auto flex flex-col md:flex-row gap-6 items-end">
                {/* SEARCH INPUT */}
                <div className="shrink-0 w-full md:w-72">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="course-search" className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Find a Program</label>
                    <div className="relative group">
                       <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
                       <input 
                         id="course-search"
                         type="text"
                         placeholder="Name, keyword..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                       />
                    </div>
                  </div>
                </div>

                {/* PROGRAM SORT SELECTOR */}
                <div className="shrink-0 w-full md:w-auto">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="course-sort" className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort Results</label>
                    <div className="relative group">
                      <select 
                        id="course-sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-6 pr-12 py-4 text-[11px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer w-full md:min-w-[200px]"
                      >
                        <option value="default">Most Recent</option>
                        <option value="name-asc">Alphabetical (A-Z)</option>
                        <option value="name-desc">Alphabetical (Z-A)</option>
                        <option value="duration">By Duration</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <i className="fa-solid fa-arrow-down-wide-short text-xs"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {isLoading ? (
              <CardSkeleton count={6} />
            ) : (
              displayedCourses.map(course => (
                <article 
                  key={course.id} 
                  className={`flex flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-500 group cursor-pointer relative ${
                    spotlightCourse?.id === course.id 
                      ? 'border-emerald-500 shadow-3xl scale-[1.02] ring-8 ring-emerald-500/5 bg-emerald-50/10' 
                      : 'border-slate-100 bg-slate-50/30 hover:shadow-2xl hover:bg-white hover:border-emerald-200'
                  }`}
                  onClick={() => handleSelectCourse(course.id)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.name} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    />
                    
                    {course.isFeatured && (
                      <div className="absolute top-6 left-6 z-10">
                        <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-2xl border border-emerald-400/30 flex items-center gap-2">
                           <i className="fa-solid fa-star text-[8px]"></i>
                           <span className="text-[8px] font-black uppercase tracking-widest leading-none">POPULAR</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-5">
                       <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                         {course.academicLevel}
                       </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors leading-tight">{course.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-2 font-medium flex-grow">
                       {course.description}
                    </p>
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <i className="fa-regular fa-calendar-check text-slate-300 text-sm"></i>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{course.duration}</span>
                       </div>
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">View Program <i className="fa-solid fa-arrow-right-long ml-2"></i></span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {!isLoading && displayedCourses.length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
               <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl text-slate-200 mx-auto mb-6 shadow-sm"><i className="fa-solid fa-magnifying-glass"></i></div>
               <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active programs found matching your search.</p>
               <button onClick={handleClearFilters} className="mt-8 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline">Clear Search Filters</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
