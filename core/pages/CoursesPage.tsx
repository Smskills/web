import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Course, PageMeta } from '../types.ts';
import FormattedText from '../components/FormattedText.tsx';
import { CardSkeleton } from '../components/Skeleton.tsx';

interface CoursesPageProps {
  coursesState: {
    list: Course[];
    pageMeta: PageMeta;
  };
  isLoading?: boolean;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ coursesState, isLoading = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const currentLevel = searchParams.get('level') || 'All';
  const currentIndustry = searchParams.get('industry') || 'All';
  
  // Robust Data Access
  const state = useMemo(() => {
    if (!coursesState) return { list: [], pageMeta: { title: 'Technical Programs', subtitle: '', tagline: 'PROFESSIONAL CURRICULA' } };
    return {
      list: Array.isArray(coursesState.list) ? coursesState.list : [],
      pageMeta: coursesState.pageMeta || { title: 'Technical Programs', subtitle: '', tagline: 'PROFESSIONAL CURRICULA' }
    };
  }, [coursesState]);

  const { list, pageMeta } = state;
  
  const academicLevels = ["All", "Certificate", "UG Certificate", "UG Diploma", "UG Degree", "Master"];
  
  // Memoized sectors list for performance
  const sectors = useMemo<string[]>(() => {
    const baseSet = new Set<string>();
    list.forEach(c => {
      if (c && c.industry) baseSet.add(c.industry);
    });
    const sorted = Array.from(baseSet).sort();
    return ["All", ...sorted];
  }, [list]);

  const filteredCourses = useMemo(() => {
    return list.filter(c => {
      if (!c) return false;
      const levelMatch = currentLevel === 'All' || c.academicLevel === currentLevel;
      const industryMatch = currentIndustry === 'All' || c.industry === currentIndustry;
      return levelMatch && industryMatch && c.status === 'Active';
    });
  }, [list, currentLevel, currentIndustry]);

  // Sync scroll position when filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLevel, currentIndustry]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header Section */}
      <section className="bg-[#1e1b4b] pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#059669]/10 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50/5 rounded-full blur-2xl opacity-20 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block animate-fade-in">
            {pageMeta.tagline || 'PROFESSIONAL CURRICULA'}
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none animate-fade-in-up">
            {pageMeta.title || 'Technical Programs'}
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            {pageMeta.subtitle || 'Browse through our industry-verified technical tracks optimized for global employability.'}
          </p>
        </div>
      </section>

      {/* Modern Dual-Filter System */}
      <div className="bg-white border-b border-slate-200 py-8 sticky top-20 md:top-24 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {/* 1. Academic Levels */}
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 ml-1">
                 <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Academic Level</label>
               </div>
               <div className="flex flex-wrap gap-2">
                 {academicLevels.map(lvl => (
                   <button 
                     key={lvl} 
                     onClick={() => setSearchParams({ level: lvl, industry: currentIndustry })}
                     className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                       currentLevel === lvl 
                         ? 'bg-[#059669] text-white border-emerald-600 shadow-lg shadow-emerald-600/20' 
                         : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                     }`}
                   >
                     {lvl}
                   </button>
                 ))}
               </div>
            </div>

            {/* 2. Industry Sectors - Now as visible scrollable pills */}
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 ml-1">
                 <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Browse by Sector</label>
               </div>
               <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {sectors.map(ind => (
                    <button
                      key={ind}
                      onClick={() => setSearchParams({ level: currentLevel, industry: ind })}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                        currentIndustry === ind
                          ? 'bg-[#1e1b4b] text-white border-slate-900 shadow-lg'
                          : 'bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600 border-slate-200'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {isLoading ? (
            <CardSkeleton count={6} />
          ) : (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-3xl transition-all duration-500 flex flex-col group">
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'} 
                    alt={course.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-emerald-600 font-black text-[9px] uppercase tracking-widest rounded-full shadow-2xl">
                      {course.academicLevel}
                    </span>
                  </div>
                </div>
                
                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-industry"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Sector: <span className="text-slate-900">{course.industry}</span>
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight tracking-tight group-hover:text-emerald-600 transition-colors">
                    {course.name}
                  </h3>
                  
                  <div className="flex-grow">
                    <FormattedText 
                      text={course.description} 
                      className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium"
                    />
                  </div>

                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-4 bg-[#1e1b4b] text-white font-black rounded-xl hover:bg-emerald-600 transition-all active:scale-95 text-center flex items-center justify-center gap-3 shadow-xl text-[11px] uppercase tracking-[0.2em] mt-auto"
                  >
                    View Details <i className="fa-solid fa-arrow-right-long text-[9px]"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 max-w-4xl mx-auto shadow-inner">
             <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                <i className="fa-solid fa-folder-open"></i>
             </div>
             <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No active programs found</h3>
             <p className="text-slate-500 mt-2">Try adjusting your filters to find suitable programs.</p>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
           <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-4xl max-h-[90vh] flex flex-col scale-in-center">
              <div className="relative h-64 md:h-80 shrink-0">
                <img src={selectedCourse.image} className="w-full h-full object-cover" alt={selectedCourse.name} />
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-grow">
                 <div className="flex flex-wrap gap-4 mb-8">
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">{selectedCourse.academicLevel}</span>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full uppercase tracking-widest">{selectedCourse.duration}</span>
                    <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest">{selectedCourse.mode}</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-none">{selectedCourse.name}</h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Program Overview</h4>
                       <FormattedText text={selectedCourse.description} className="text-slate-600 leading-relaxed text-lg" />
                    </div>
                    <div className="space-y-8">
                       {selectedCourse.eligibility && (
                         <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Entry Requirements</h4>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 font-medium whitespace-pre-line">{selectedCourse.eligibility}</div>
                         </div>
                       )}
                       {selectedCourse.benefits && (
                         <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Key Benefits</h4>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 font-medium whitespace-pre-line">{selectedCourse.benefits}</div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
              <div className="p-8 md:p-10 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Structure</p>
                    <p className="text-2xl font-black text-[#059669]">{selectedCourse.price || 'Scholarship'}</p>
                 </div>
                 <Link 
                   to={`/enroll?course=${encodeURIComponent(selectedCourse.name)}`}
                   className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 text-[11px] uppercase tracking-widest"
                 >
                   Submit Your inquery
                 </Link>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        .scale-in-center { animation: scale-in-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center { 
          0% { transform: scale(0.9); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }
      `}</style>
    </div>
  );
};

export default CoursesPage;