
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
 * Ultra-condensed detail view designed to fit content and the next section peak within one screen height.
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
      
      {/* 1. ULTRA-COMPACT PROGRAM SPOTLIGHT VIEW */}
      {spotlightCourse && (
        <section className="bg-gradient-to-br from-white via-emerald-50/10 to-slate-50 text-slate-900 overflow-hidden animate-fade-in relative border-b border-slate-200 pt-3 pb-8 lg:pt-4 lg:pb-10">
          <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/[0.01] blur-[80px] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            {/* Header Control - Shaved Margin */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-200/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.3em]">SPOTLIGHT VIEW</span>
              </div>
              <button 
                onClick={handleCloseSpotlight}
                className="text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all flex items-center gap-2 px-2 py-1 bg-white border border-slate-200 rounded-md"
              >
                Close <i className="fa-solid fa-xmark text-[8px]"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
              <div className="lg:col-span-4 hidden lg:block">
                {/* Poster - Heavily restricted height for fold visibility */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl bg-white max-h-[380px]">
                  <img src={spotlightCourse.image} alt={spotlightCourse.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-sweep"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                     <div className="bg-emerald-600/90 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-emerald-400/20">
                        <p className="text-[7px] font-black uppercase tracking-widest leading-none mb-0.5 opacity-70">Credential</p>
                        <p className="text-[10px] font-black uppercase truncate">{spotlightCourse.certification || spotlightCourse.academicLevel}</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="space-y-1">
                  <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest">
                    {spotlightCourse.academicLevel}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                    {spotlightCourse.name}
                  </h1>
                </div>

                {/* Specs Grid - Compact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                   {[
                     { label: 'Delivery', value: spotlightCourse.mode, icon: 'fa-chalkboard-user' },
                     { label: 'Timeframe', value: spotlightCourse.duration, icon: 'fa-clock' },
                     { label: 'Entry', value: spotlightCourse.eligibility || '12th Pass', icon: 'fa-id-card' },
                     { label: 'Protocol', value: 'NSDC Verified', icon: 'fa-shield-check' }
                   ].map((spec, i) => (
                     <div key={i} className="p-2 bg-white border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-1 mb-0.5">
                           <i className={`fa-solid ${spec.icon} text-emerald-600 text-[7px]`}></i>
                           <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-900 leading-none uppercase truncate">{spec.value}</p>
                     </div>
                   ))}
                </div>

                {/* Description Box - Tight padding */}
                <div className="bg-white/60 p-4 rounded-2xl border border-slate-200/50 shadow-sm">
                  <FormattedText text={spotlightCourse.description} className="text-slate-600 text-[13px] leading-relaxed font-medium" />
                </div>
                   
                {/* Benefits - One line if possible or tight grid */}
                {spotlightCourse.showBenefits !== false && getBenefitsList(spotlightCourse.benefits).length > 0 && (
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {getBenefitsList(spotlightCourse.benefits).slice(0, 4).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-emerald-600/10 rounded flex items-center justify-center shrink-0">
                          <i className="fa-solid fa-check text-emerald-600 text-[7px]"></i>
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Final CTA Bar - Minimal spacing to pull next section up */}
                <div className="mt-2 pt-4 flex flex-col sm:flex-row items-center gap-6 border-t border-slate-100">
                  <Link 
                    to={`/enroll?course=${encodeURIComponent(spotlightCourse.name)}`}
                    className="w-full sm:w-auto px-8 py-3 bg-[#020617] text-white font-black rounded-lg hover:bg-emerald-600 transition-all text-center uppercase tracking-widest text-[9px] shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    Start Enrollment <i className="fa-solid fa-paper-plane text-[8px]"></i>
                  </Link>
                  <div className="flex flex-col items-center sm:items-start shrink-0">
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Admission Fee</span>
                     <span className="text-lg font-black text-emerald-600 leading-none">{spotlightCourse.price || 'Rs. 50,000 / year'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. CATALOG GRID - TIGHT PADDING WHEN SPOTLIGHT ACTIVE */}
      <section className={`bg-white transition-all ${spotlightCourse ? 'py-10' : 'py-20 md:py-24'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col xl:flex-row justify-between items-end mb-10 gap-4">
            <div className="max-w-2xl">
              <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">CATALOG</span>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Available Programs</h2>
            </div>

            {/* Filter Toolbar - Minimized */}
            {!spotlightCourse && (
              <div className="w-full xl:w-auto flex flex-col md:flex-row gap-3 items-end">
                <div className="shrink-0 w-full md:w-56">
                   <div className="relative group">
                     <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                     <input 
                       type="text"
                       placeholder="Search..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all"
                     />
                   </div>
                </div>
                <div className="relative shrink-0 w-full md:w-auto">
                   <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as SortOption)}
                     className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all w-full cursor-pointer"
                   >
                     <option value="default">Most Recent</option>
                     <option value="name-asc">Alphabetical</option>
                   </select>
                   <i className="fa-solid fa-sort absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {isLoading ? (
              <CardSkeleton count={6} />
            ) : (
              displayedCourses.map(course => (
                <article 
                  key={course.id} 
                  className={`flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 group cursor-pointer relative ${
                    spotlightCourse?.id === course.id 
                      ? 'border-emerald-500 shadow-xl bg-emerald-50/5' 
                      : 'border-slate-100 bg-white hover:shadow-lg hover:border-emerald-200'
                  }`}
                  onClick={() => handleSelectCourse(course.id)}
                >
                  <div className="relative h-44 md:h-48 overflow-hidden">
                    <img src={course.cardImage || course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                    {course.isFeatured && (
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-md shadow-xl text-[6px] font-black uppercase tracking-widest flex items-center gap-1">
                         <i className="fa-solid fa-star"></i> FEATURED
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 w-fit mb-3">
                      {course.academicLevel}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors leading-tight">{course.name}</h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 mb-4 font-medium flex-grow">
                       {course.description}
                    </p>
                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-slate-400">
                       <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2"><i className="fa-regular fa-clock"></i> {course.duration}</span>
                       <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Details <i className="fa-solid fa-chevron-right ml-1"></i></span>
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
