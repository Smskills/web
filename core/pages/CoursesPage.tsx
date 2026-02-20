import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Course } from '../types.ts';
import CourseCard from './Courses/CourseCard.tsx';
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

const CoursesPage: React.FC<CoursesPageProps> = ({ coursesState, isLoading = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [spotlightCourse, setSpotlightCourse] = useState<Course | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchTerm, setSearchTerm] = useState('');
  
  const levelFilter = searchParams.get('level');
  const industryFilter = searchParams.get('industry');
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
      const isIndustryMatch = !industryFilter || (c.industry || '').toLowerCase() === industryFilter.toLowerCase();
      const isSearchMatch = !searchTerm || 
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return c.status === 'Active' && isLevelMatch && isIndustryMatch && isSearchMatch;
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
  }, [list, levelFilter, industryFilter, sortBy, searchTerm]);

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

  const handleClearFilters = () => {
    setSearchParams({});
    setSortBy('default');
    setSearchTerm('');
    setSpotlightCourse(null);
  };

  /**
   * Compact "Single Page" Detailed View
   */
  const DetailedRectangle: React.FC<{ course: Course, isEmbedded?: boolean }> = ({ course, isEmbedded = false }) => {
    const benefits = getBenefitsList(course.benefits);
    
    return (
      <div className={`bg-[#f8fafc] text-slate-900 overflow-hidden animate-fade-in relative rounded-[2.5rem] border border-slate-200 ${isEmbedded ? 'p-6 md:p-8 shadow-2xl' : 'py-8'}`}>
        {!isEmbedded && <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/[0.02] blur-[100px] pointer-events-none"></div>}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Column: Image (Tighter aspect ratio for single-page fit) */}
          <div className="lg:col-span-4">
            <div className="relative aspect-square md:aspect-[4/4.5] lg:aspect-[3/4] rounded-[2rem] overflow-hidden border-4 border-white shadow-3xl bg-white group">
              <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4">
                 <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-2xl border border-emerald-500/30 backdrop-blur-sm">
                    <p className="text-[7px] font-black uppercase tracking-widest mb-0.5 opacity-80 leading-none">CREDENTIAL</p>
                    <p className="text-[10px] font-black uppercase leading-none truncate">{course.certification || course.academicLevel}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content (Reduced vertical spacing) */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <div className="mb-4">
              <span className="inline-block bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mb-2">
                {course.academicLevel}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-1">
                {course.name}
              </h1>
            </div>

            {/* 4 Metadata Cards (Condensed) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
               {[
                 { label: 'MODE', value: course.mode, icon: 'fa-chalkboard-user' },
                 { label: 'DURATION', value: course.duration, icon: 'fa-clock' },
                 { label: 'ELIGIBILITY', value: course.eligibility || '12TH PASS', icon: 'fa-id-card' },
                 { label: 'SECTOR', value: course.industry, icon: 'fa-briefcase' }
               ].map((spec, i) => (
                 <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                       <i className={`fa-solid ${spec.icon} text-xs`}></i>
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{spec.label}</p>
                       <p className="text-[9px] font-black text-slate-900 uppercase leading-none truncate">{spec.value}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Description Box (Tighter padding, limited height) */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative mb-4">
              <div className="absolute top-4 right-5 opacity-5 pointer-events-none">
                <i className="fa-solid fa-quote-right text-4xl"></i>
              </div>
              <div className="max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                <FormattedText text={course.description} className="text-slate-600 text-[13px] leading-relaxed font-medium" />
              </div>
            </div>
               
            {/* Benefits Checklist (Condensed) */}
            {course.showBenefits !== false && benefits.length > 0 && (
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 px-2 mb-6">
                {benefits.slice(0, 6).map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-check text-[8px] font-black"></i>
                    </div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider truncate">{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Bar (Sticky/Pinned look) */}
            <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-6 border-t border-slate-200/50">
              <Link 
                to={`/enroll?course=${encodeURIComponent(course.name)}`}
                className="w-full sm:w-auto px-10 py-4 bg-[#020617] text-white font-black rounded-xl hover:bg-emerald-600 transition-all text-center uppercase tracking-[0.2em] text-[9px] shadow-xl active:scale-95 flex items-center justify-center gap-3 group/btn"
              >
                START ENROLLMENT <i className="fa-solid fa-paper-plane text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
              </Link>
              <div className="flex flex-col items-center sm:items-start leading-none">
                 <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ADMISSION FEE</span>
                 <span className="text-xl font-black text-emerald-600 tracking-tight leading-none">{course.price || 'Rs. 50,000'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Determine if we should show the full header/filter view
  const isSingleView = displayedCourses.length === 1 || spotlightCourse;

  return (
    <div className="bg-white font-sans min-h-screen">
      
      {/* 1. DETAIL OVERLAY VIEW (Full Screen Fit) */}
      {spotlightCourse && (
        <section className="bg-white pb-10">
          <div className="container mx-auto px-6">
            <div className="flex justify-end mb-4 pt-6">
              <button 
                onClick={handleCloseSpotlight}
                className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-all flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm"
              >
                Back to Catalog <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <DetailedRectangle course={spotlightCourse} />
          </div>
        </section>
      )}

      {/* 2. CATALOG SECTION */}
      {!spotlightCourse && (
        <section className={`bg-white transition-all ${isSingleView ? 'py-10' : 'py-20 md:py-24'}`}>
          <div className="container mx-auto px-6">
            
            {/* Header Controls (Smaller if only one result) */}
            <div className={`flex flex-col xl:flex-row justify-between items-end gap-6 ${isSingleView ? 'mb-8' : 'mb-16'}`}>
              <div className="max-w-2xl">
                <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-1.5 block leading-none">
                  {levelFilter || industryFilter ? 'FILTERED VIEW' : 'CATALOG'}
                </span>
                <h2 className={`${isSingleView ? 'text-2xl md:text-4xl' : 'text-3xl md:text-5xl'} font-black text-slate-900 tracking-tighter leading-none`}>
                  {levelFilter && !industryFilter && `${levelFilter} Programs`}
                  {industryFilter && !levelFilter && `${industryFilter} Programs`}
                  {levelFilter && industryFilter && `${levelFilter} in ${industryFilter}`}
                  {!levelFilter && !industryFilter && 'Available Programs'}
                </h2>
                {(levelFilter || industryFilter) && (
                  <button onClick={handleClearFilters} className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-3 hover:underline flex items-center gap-2">
                    <i className="fa-solid fa-circle-xmark"></i> Reset Selection
                  </button>
                )}
              </div>

              {!isSingleView && (
                <div className="w-full xl:w-auto flex flex-col md:flex-row gap-4 items-end">
                  <div className="shrink-0 w-full md:w-64">
                     <div className="relative group">
                       <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
                       <input 
                         type="text"
                         placeholder="Search programs..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-emerald-500 transition-all shadow-inner"
                       />
                     </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Grid Logic */}
            <div className={`grid gap-8 ${displayedCourses.length === 1 ? 'grid-cols-1 max-w-6xl mx-auto' : (displayedCourses.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2')} grid-cols-1`}>
              {isLoading ? (
                <CardSkeleton count={displayedCourses.length || 4} />
              ) : (
                displayedCourses.map(course => {
                  // SINGLE COURSE RESULT: High impact fit-to-screen view
                  if (displayedCourses.length === 1) {
                    return <DetailedRectangle key={course.id} course={course} isEmbedded={true} />;
                  }

                  // MULTIPLE RESULTS: Standard Card Layout
                  return <CourseCard key={course.id} course={course} />;
                })
              )}
            </div>

            {!isLoading && displayedCourses.length === 0 && (
              <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl text-slate-200 mx-auto mb-6 shadow-sm"><i className="fa-solid fa-folder-open"></i></div>
                 <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">No programs match this selection.</p>
                 <button onClick={handleClearFilters} className="mt-6 text-emerald-600 font-black text-[9px] uppercase tracking-[0.2em] hover:underline">Reset Catalog</button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default CoursesPage;