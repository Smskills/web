
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
 * Optimized for vertical efficiency to show the full detail view and catalog peak above the fold.
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
    let result = list.filter(c => {
      const isLevelMatch = !levelFilter || (c.academicLevel || '').toLowerCase().includes(levelFilter.toLowerCase());
      const isSearchMatch = !searchTerm || 
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return c.status === 'Active' && isLevelMatch && isSearchMatch;
    });

    switch (sortBy) {
      case 'name-asc': result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      case 'name-desc': result.sort((a, b) => (b.name || '').localeCompare(a.name || '')); break;
      case 'duration': result.sort((a, b) => (a.duration || '').localeCompare(b.duration || '')); break;
      default:
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

  const getBenefitsList = (benefits: string | undefined) => {
    if (!benefits) return [];
    return benefits.split('\n').map(b => b.replace(/^[•\-\*]\s*/, '').trim()).filter(b => b.length > 0);
  };

  return (
    <div className="bg-white font-sans min-h-screen">
      
      {/* 1. COMPACT PROGRAM SPOTLIGHT VIEW */}
      {spotlightCourse && (
        <section className="bg-gradient-to-br from-white via-emerald-50/20 to-slate-50 text-slate-900 overflow-hidden animate-fade-in relative border-b border-slate-200 pt-4 pb-12 lg:pt-6 lg:pb-16">
          <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/[0.02] blur-[100px] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            {/* Header Control - Minimized Margin */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-200/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]"></span>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em]">PROGRAM SPOTLIGHT</span>
              </div>
              <button 
                onClick={handleCloseSpotlight}
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              >
                Close <i className="fa-solid fa-xmark text-[10px]"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-4 hidden lg:block">
                {/* Poster - Slightly shorter to save vertical room */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-3xl bg-white max-h-[480px]">
                  <img src={spotlightCourse.image} alt={spotlightCourse.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine-sweep"></div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                     <div className="bg-emerald-600/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-emerald-400/20">
                        <p className="text-[8px] font-black uppercase tracking-widest leading-none mb-1 opacity-70">Certification</p>
                        <p className="text-xs font-black uppercase truncate">{spotlightCourse.certification || spotlightCourse.academicLevel}</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="space-y-2">
                  <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {spotlightCourse.academicLevel}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                    {spotlightCourse.name}
                  </h1>
                </div>

                {/* Specs Grid - Compact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {[
                     { label: 'Mode', value: spotlightCourse.mode, icon: 'fa-chalkboard-user' },
                     { label: 'Duration', value: spotlightCourse.duration, icon: 'fa-clock' },
                     { label: 'Eligibility', value: spotlightCourse.eligibility || '12th Pass', icon: 'fa-id-card' },
                     { label: 'Verified', value: 'NSDC Standards', icon: 'fa-certificate' }
                   ].map((spec, i) => (
                     <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-1.5 mb-1">
                           <i className={`fa-solid ${spec.icon} text-emerald-600 text-[8px]`}></i>
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                        </div>
                        <p className="text-xs font-black text-slate-900 leading-none uppercase truncate">{spec.value}</p>
                     </div>
                   ))}
                </div>

                {/* Description Box - Minimal padding */}
                <div className="bg-white/60 p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm">
                  <FormattedText text={spotlightCourse.description} className="text-slate-600 text-sm md:text-base leading-relaxed font-medium" />
                </div>
                   
                {/* Benefits - Tighter Layout */}
                {spotlightCourse.showBenefits !== false && getBenefitsList(spotlightCourse.benefits).length > 0 && (
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {getBenefitsList(spotlightCourse.benefits).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-6 h-6 bg-emerald-600/10 rounded-lg flex items-center justify-center shrink-0">
                          <i className="fa-solid fa-check text-emerald-600 text-[8px]"></i>
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Final CTA Bar - Aligned perfectly with image-style request */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6 md:gap-10 border-t border-slate-100">
                  <Link 
                    to={`/enroll?course=${encodeURIComponent(spotlightCourse.name)}`}
                    className="w-full sm:w-auto px-10 py-4 bg-[#020617] text-white font-black rounded-xl hover:bg-emerald-600 transition-all text-center uppercase tracking-[0.15em] text-[10px] shadow-xl flex items-center justify-center gap-3 active:scale-95"
                  >
                    Start Your Application <i className="fa-solid fa-paper-plane text-[9px]"></i>
                  </Link>
                  <div className="flex flex-col items-center sm:items-start shrink-0">
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Standard Fees</span>
                     <span className="text-xl font-black text-emerald-600 leading-none">{spotlightCourse.price || 'Rs. 50,000 / year'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. CATALOG GRID - REDUCED TOP PADDING WHEN SPOTLIGHT IS ACTIVE */}
      <section className={`bg-white ${spotlightCourse ? 'py-12' : 'py-20 md:py-24'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col xl:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">OFFICIAL CATALOG</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Other Programs</h2>
            </div>

            {/* Filter Toolbar - Minimized Gap */}
            {!spotlightCourse && (
              <div className="w-full xl:w-auto flex flex-col md:flex-row gap-4 items-end">
                <div className="shrink-0 w-full md:w-64">
                   <div className="relative group">
                     <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500"></i>
                     <input 
                       type="text"
                       placeholder="Find program..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                     />
                   </div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto">
                   <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as SortOption)}
                     className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-full cursor-pointer"
                   >
                     <option value="default">Sort: Newest</option>
                     <option value="name-asc">A-Z</option>
                     <option value="duration">By Duration</option>
                   </select>
                   <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {isLoading ? (
              <CardSkeleton count={6} />
            ) : (
              displayedCourses.map(course => (
                <article 
                  key={course.id} 
                  className={`flex flex-col rounded-[2rem] overflow-hidden border transition-all duration-500 group cursor-pointer relative ${
                    spotlightCourse?.id === course.id 
                      ? 'border-emerald-500 shadow-2xl scale-[1.02] bg-emerald-50/5' 
                      : 'border-slate-100 bg-white hover:shadow-xl hover:border-emerald-200'
                  }`}
                  onClick={() => handleSelectCourse(course.id)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={course.cardImage || course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                    {course.isFeatured && (
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white px-2 py-1 rounded-lg shadow-xl text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5">
                         <i className="fa-solid fa-star"></i> POPULAR
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/10 w-fit mb-4">
                      {course.academicLevel}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">{course.name}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6 font-medium flex-grow">
                       {course.description}
                    </p>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                       <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><i className="fa-regular fa-calendar"></i> {course.duration}</span>
                       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">View <i className="fa-solid fa-chevron-right ml-1"></i></span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
