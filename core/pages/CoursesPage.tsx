
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
  
  const state = useMemo(() => {
    if (!coursesState) return { list: [], pageMeta: { title: 'Technical Programs', subtitle: '', tagline: 'PROFESSIONAL CURRICULA' } };
    return {
      list: Array.isArray(coursesState.list) ? coursesState.list : [],
      pageMeta: coursesState.pageMeta || { title: 'Technical Programs', subtitle: '', tagline: 'PROFESSIONAL CURRICULA' }
    };
  }, [coursesState]);

  const { list, pageMeta } = state;
  
  const academicLevels = ["All", "Certificate", "UG Certificate (NSDC)", "UG Diploma", "UG Degree", "Master"];
  
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLevel, currentIndustry]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Page Header */}
      <section className="bg-[#1e1b4b] pt-32 pb-16 text-white relative overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] mb-3 block animate-fade-in">
            {pageMeta.tagline || 'PROFESSIONAL CURRICULA'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none animate-fade-in-up">
            {pageMeta.title || 'Technical Programs'}
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            {pageMeta.subtitle || 'Browse industry-verified technical tracks optimized for global employability.'}
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-200 py-6 sticky top-20 md:top-24 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2 ml-1">
                 <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Academic Tier</label>
               </div>
               <div className="flex flex-wrap gap-2">
                 {academicLevels.map(lvl => (
                   <button 
                     key={lvl} 
                     onClick={() => setSearchParams({ level: lvl, industry: currentIndustry })}
                     className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                       currentLevel === lvl 
                         ? 'bg-[#059669] text-white border-emerald-600 shadow-md' 
                         : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                     }`}
                   >
                     {lvl}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-2 ml-1">
                 <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vocational Sector</label>
               </div>
               <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {sectors.map(ind => (
                    <button
                      key={ind}
                      onClick={() => setSearchParams({ level: currentLevel, industry: ind })}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                        currentIndustry === ind
                          ? 'bg-[#1e1b4b] text-white border-slate-900'
                          : 'bg-white text-slate-600 hover:border-emerald-500 border-slate-200'
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

      {/* Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <CardSkeleton count={6} />
          ) : (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group">
                <div className="h-52 relative overflow-hidden">
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/95 text-emerald-600 font-black text-[8px] uppercase tracking-widest rounded-full shadow-lg">
                      {course.academicLevel}
                    </span>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors">{course.name}</h3>
                  <div className="flex-grow">
                    <FormattedText text={course.description} className="text-slate-500 text-xs leading-relaxed mb-5 line-clamp-2 font-medium" />
                  </div>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-3 bg-[#1e1b4b] text-white font-black rounded-lg hover:bg-emerald-600 transition-all text-center flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
                  >
                    Details <i className="fa-solid fa-arrow-right text-[8px]"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* REFINED MODAL: 4XL WIDTH (SMALLER BOX) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
           <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-4xl h-fit max-h-[92vh] md:max-h-[750px] flex flex-col md:flex-row scale-in-center relative border border-white/20">
              
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 z-[210] w-10 h-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-xl flex items-center justify-center text-slate-900 hover:bg-red-500 hover:text-white transition-all active:scale-90 border border-slate-100"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>

              {/* Column 1: Media (36% width for smaller box) */}
              <div className="w-full md:w-[36%] h-40 md:h-auto shrink-0 relative bg-slate-100">
                <img src={selectedCourse.image} className="w-full h-full object-cover" alt={selectedCourse.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5">
                   <span className="px-4 py-2 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-lg shadow-2xl">
                     {selectedCourse.academicLevel}
                   </span>
                </div>
              </div>

              {/* Column 2: Content (64% width) */}
              <div className="w-full md:w-[64%] flex flex-col bg-white overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col h-full">
                   {/* Balanced Typography Header */}
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-5 tracking-tight leading-tight">
                     {selectedCourse.name}
                   </h2>

                   {/* Grid (Compact but clear) */}
                   <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
                         <div className="w-8 h-8 bg-white text-emerald-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-50"><i className="fa-solid fa-graduation-cap text-xs"></i></div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tier</span>
                            <span className="text-xs font-black text-slate-800">{selectedCourse.academicLevel}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
                         <div className="w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-50"><i className="fa-solid fa-chalkboard-user text-xs"></i></div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Mode</span>
                            <span className="text-xs font-black text-slate-800">Hybrid Track</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
                         <div className="w-8 h-8 bg-white text-slate-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-50"><i className="fa-regular fa-clock text-xs"></i></div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Duration</span>
                            <span className="text-xs font-black text-slate-800">{selectedCourse.duration}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
                         <div className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-50"><i className="fa-solid fa-id-card-clip text-xs"></i></div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Criteria</span>
                            <span className="text-xs font-black text-slate-800">12th Pass</span>
                         </div>
                      </div>
                   </div>
                   
                   {/* Narrative Section */}
                   <div className="mb-6">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2 block">Program Narrative</span>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-3">
                        {selectedCourse.description}
                      </p>
                   </div>

                   {/* Benefits Grid (2x2) */}
                   <div className="border-t border-slate-100 pt-6 mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">Institutional Benefits</span>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                         <div className="flex items-center gap-3 group">
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                              <i className="fa-solid fa-building-columns text-emerald-600 group-hover:text-white text-[10px]"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-700 tracking-tight">Industry Internship</span>
                         </div>
                         <div className="flex items-center gap-3 group">
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                              <i className="fa-solid fa-flask text-emerald-600 group-hover:text-white text-[10px]"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-700 tracking-tight">Hands-on Lab Training</span>
                         </div>
                         <div className="flex items-center gap-3 group">
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                              <i className="fa-solid fa-briefcase text-emerald-600 group-hover:text-white text-[10px]"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-700 tracking-tight">Placement Assistance</span>
                         </div>
                         <div className="flex items-center gap-3 group">
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                              <i className="fa-solid fa-coins text-emerald-600 group-hover:text-white text-[10px]"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-700 tracking-tight">Stipend Opportunities</span>
                         </div>
                      </div>
                   </div>

                   {/* Footer - Final Call to Action */}
                   <div className="mt-auto pt-5 flex items-center justify-between gap-4 border-t border-slate-50">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Institutional Fee</p>
                         <p className="text-2xl font-black text-[#059669] tracking-tight">{selectedCourse.price || 'Rs. 12,000'}</p>
                      </div>
                      <Link 
                        to={`/enroll?course=${encodeURIComponent(selectedCourse.name)}`}
                        className="px-8 py-4 bg-[#1e1b4b] text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-xl text-[11px] uppercase tracking-[0.2em] active:scale-95 text-center"
                      >
                        Submit Inquery
                      </Link>
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        .scale-in-center { animation: scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center { 
          0% { transform: scale(0.97); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CoursesPage;
