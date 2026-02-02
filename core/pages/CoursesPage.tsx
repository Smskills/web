
import React, { useState } from 'react';
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
  
  const { list = [], pageMeta = { title: 'Technical Programs', subtitle: '', tagline: 'PROFESSIONAL CURRICULA' } } = coursesState || {};
  
  const academicLevels = ["All", "UG Certificate", "UG Diploma", "UG Degree", "Master"];
  const industries = ["All", ...Array.from(new Set(list.map(c => c.industry)))];

  const filteredCourses = list.filter(c => {
    const levelMatch = currentLevel === 'All' || c.academicLevel === currentLevel;
    const industryMatch = currentIndustry === 'All' || c.industry === currentIndustry;
    return levelMatch && industryMatch && c.status === 'Active';
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Section as per Screenshot */}
      <section className="bg-[#1e1b4b] pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-[#059669] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{pageMeta.tagline}</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{pageMeta.title}</h1>
          <p className="text-slate-300 text-xl font-medium max-w-3xl mx-auto leading-relaxed">{pageMeta.subtitle}</p>
        </div>
      </section>

      {/* Filter Bar as per Screenshot */}
      <div className="bg-[#f1f5f9] border-b border-slate-200 py-6 sticky top-24 md:top-32 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ACADEMIC LEVEL</label>
               <div className="flex flex-wrap gap-2">
                 {academicLevels.map(lvl => (
                   <button 
                     key={lvl} 
                     onClick={() => setSearchParams({ level: lvl, industry: currentIndustry })}
                     className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentLevel === lvl ? 'bg-[#059669] text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                   >
                     {lvl.toUpperCase()}
                   </button>
                 ))}
               </div>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-80">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">INDUSTRY SECTOR</label>
               <div className="relative">
                  <select 
                    value={currentIndustry}
                    onChange={(e) => setSearchParams({ level: currentLevel, industry: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
                  >
                    {industries.map(ind => <option key={ind} value={ind}>{ind.toUpperCase()}</option>)}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            <CardSkeleton count={6} />
          ) : (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col group">
                <div className="h-64 relative overflow-hidden">
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4 text-[#059669] font-black text-[10px] uppercase tracking-widest">
                    <i className="fa-solid fa-briefcase"></i> {course.duration}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-8 leading-tight tracking-tight group-hover:text-[#059669] transition-colors">
                    {course.name}
                  </h3>
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full py-4 bg-[#1e1b4b] text-white font-black rounded-xl hover:bg-[#059669] transition-all active:scale-95 text-center flex items-center justify-center gap-3 shadow-xl text-[11px] uppercase tracking-[0.2em] mt-auto"
                  >
                    <i className="fa-solid fa-book-open"></i> VIEW DETAILS
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-2xl mx-auto">
             <i className="fa-solid fa-magnifying-glass text-4xl text-slate-200 mb-6"></i>
             <p className="text-slate-400 font-black uppercase tracking-widest">No matching programs found.</p>
          </div>
        )}
      </div>

      {/* Modal for View Details */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCourse(null)}></div>
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-4xl relative z-10 overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 z-20 transition-all">
               <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <div className="md:w-2/5 shrink-0 h-[300px] md:h-auto">
               <img src={selectedCourse.image} className="w-full h-full object-cover" alt={selectedCourse.name} />
            </div>
            <div className="md:w-3/5 p-10 md:p-14 overflow-y-auto custom-scrollbar">
               <div className="flex items-center gap-3 mb-6">
                 <span className="px-3 py-1 bg-[#059669] text-white rounded font-black text-[9px] uppercase tracking-widest">{selectedCourse.academicLevel}</span>
                 <span className="px-3 py-1 bg-[#1e1b4b] text-white rounded font-black text-[9px] uppercase tracking-widest">{selectedCourse.industry}</span>
               </div>
               
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-8">{selectedCourse.name}</h2>
               
               <div className="grid grid-cols-2 gap-8 mb-10 border-y border-slate-50 py-8">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Program Duration</p>
                    <p className="text-base font-bold text-slate-900 flex items-center gap-2">
                       <i className="fa-regular fa-clock text-[#059669]"></i> {selectedCourse.duration}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Fees</p>
                    <p className="text-base font-bold text-[#059669] flex items-center gap-2">
                       <i className="fa-solid fa-tag text-[#059669]"></i> {selectedCourse.price}
                    </p>
                  </div>
               </div>

               <div className="mb-10">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Curriculum Strategy</h4>
                 <FormattedText text={selectedCourse.description} className="text-slate-600 font-medium leading-relaxed" />
               </div>

               {selectedCourse.benefits && (
                 <div className="mb-10 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Learning Outcomes</h4>
                    <div className="text-[13px] text-slate-600 font-medium whitespace-pre-line leading-loose">
                       {selectedCourse.benefits}
                    </div>
                 </div>
               )}

               <Link to={`/enroll?course=${encodeURIComponent(selectedCourse.name)}`} className="w-full py-6 bg-[#059669] text-white font-black rounded-xl hover:bg-[#047857] transition-all text-center flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] shadow-2xl">
                 START APPLICATION <i className="fa-solid fa-arrow-right"></i>
               </Link>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CoursesPage;
