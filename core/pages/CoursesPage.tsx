
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Course, PageMeta, AppState } from '../types.ts';
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
  
  const { list = [], pageMeta = { title: 'Academic Programs', subtitle: '', tagline: 'Institutional Academics' } } = coursesState || {};
  
  const academicLevels = ["All", "UG Certificate", "UG Diploma", "UG Degree", "Master"];
  const industries = ["All", ...Array.from(new Set(list.map(c => c.industry)))];

  const filteredCourses = list.filter(c => {
    const levelMatch = currentLevel === 'All' || c.academicLevel === currentLevel;
    const industryMatch = currentIndustry === 'All' || c.industry === currentIndustry;
    return levelMatch && industryMatch && c.status === 'Active';
  });

  const btnSecondary = "w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 text-center flex items-center justify-center gap-3 shadow-2xl text-[11px] uppercase tracking-widest";

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{pageMeta.tagline}</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{pageMeta.title}</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">{pageMeta.subtitle}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-24">
        {/* Advanced Filters */}
        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[3rem] border border-slate-200 shadow-3xl mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Level</label>
               <div className="flex flex-wrap gap-2">
                 {academicLevels.map(lvl => (
                   <button 
                     key={lvl} 
                     onClick={() => setSearchParams({ level: lvl, industry: currentIndustry })}
                     className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${currentLevel === lvl ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-emerald-50'}`}
                   >
                     {lvl}
                   </button>
                 ))}
               </div>
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry Sector</label>
               <select 
                 value={currentIndustry}
                 onChange={(e) => setSearchParams({ level: currentLevel, industry: e.target.value })}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20"
               >
                 {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
               </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {isLoading ? (
            <CardSkeleton count={3} />
          ) : (
            filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-3xl transition-all flex flex-col group">
                <div className="h-64 relative overflow-hidden cursor-pointer" onClick={() => setSelectedCourse(course)}>
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                  <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-md text-emerald-400 font-black px-4 py-1.5 rounded-lg text-[9px] shadow-sm tracking-widest uppercase border border-white/10">
                    {course.academicLevel}
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                       <i className="fa-solid fa-briefcase"></i> {course.industry}
                    </span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.duration}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors tracking-tight leading-tight cursor-pointer" onClick={() => setSelectedCourse(course)}>{course.name}</h3>
                  <button onClick={() => setSelectedCourse(course)} className={btnSecondary}>
                    <i className="fa-solid fa-graduation-cap"></i> View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-2xl mx-auto">
             <p className="text-slate-400 font-black uppercase tracking-widest">No programs matching these criteria were found.</p>
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onClick={() => setSelectedCourse(null)}></div>
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-4xl relative z-10 overflow-hidden animate-fade-in flex flex-col md:flex-row">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 z-20 transition-all">
               <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <div className="md:w-1/2">
               <img src={selectedCourse.image} className="w-full h-full object-cover" alt={selectedCourse.name} />
            </div>
            <div className="md:w-1/2 p-10 md:p-14 overflow-y-auto max-h-[80vh] custom-scrollbar">
               <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-widest mb-4">{selectedCourse.academicLevel}</span>
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-6">{selectedCourse.name}</h2>
               <div className="prose prose-slate max-w-none mb-10">
                 <FormattedText text={selectedCourse.description} className="text-slate-600 font-medium leading-relaxed" />
               </div>
               
               <div className="space-y-6 mb-10">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100"><i className="fa-solid fa-clock"></i></div>
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Commitment</p>
                       <p className="text-sm font-black text-slate-900">{selectedCourse.duration}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100"><i className="fa-solid fa-tag"></i></div>
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fees & Structure</p>
                       <p className="text-sm font-black text-emerald-600">{selectedCourse.price}</p>
                    </div>
                  </div>
               </div>

               <Link to={`/enroll?course=${encodeURIComponent(selectedCourse.name)}`} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all text-center flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px] shadow-2xl">
                 Apply for Program <i className="fa-solid fa-arrow-right"></i>
               </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
