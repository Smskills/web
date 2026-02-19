
import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types';

interface CourseModalProps {
  course: Course;
  onClose: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onClose }) => {
  const cleanCertificationName = (val: string) => {
    if (!val) return "";
    return val.replace(/\s+(Certificate|Certification)$/i, "").trim();
  };

  // Helper to parse multiline benefits string into a clean array
  const benefitsList = (course.benefits || '')
    .split('\n')
    .map(b => b.replace(/^[•\-\*]\s*/, '').trim()) // Remove common bullet point chars
    .filter(b => b.length > 0);

  const shouldShowBenefits = course.showBenefits !== false && benefitsList.length > 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
       <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-4xl h-fit max-h-[92vh] md:max-h-[750px] flex flex-col md:flex-row scale-in-center relative border border-white/20">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-[210] w-10 h-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-xl flex items-center justify-center text-slate-900 hover:bg-red-500 hover:text-white transition-all active:scale-90 border border-slate-100"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>

          <div className="w-full md:w-[36%] h-40 md:h-auto shrink-0 relative bg-slate-100">
            <img src={course.image} className="w-full h-full object-cover" alt={course.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
          </div>

          <div className="w-full md:w-[64%] flex flex-col bg-white overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
               <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-5 tracking-tight leading-tight">
                 {course.name}
               </h2>

               <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
                     <div className="w-8 h-8 bg-white text-emerald-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-50"><i className="fa-solid fa-graduation-cap text-xs"></i></div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Certificate</span>
                        <span className="text-xs font-black text-slate-800">{cleanCertificationName(course.certification || course.academicLevel)}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
                     <div className="w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-50"><i className="fa-solid fa-chalkboard-user text-xs"></i></div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Mode</span>
                        <span className="text-xs font-black text-slate-800">{course.mode} Track</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
                     <div className="w-8 h-8 bg-white text-slate-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-50"><i className="fa-regular fa-clock text-xs"></i></div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Duration</span>
                        <span className="text-xs font-black text-slate-800">{course.duration}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100/50">
                     <div className="w-8 h-8 bg-white text-purple-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-50"><i className="fa-solid fa-id-card-clip text-xs"></i></div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Eligibility</span>
                        <span className="text-xs font-black text-slate-800">{course.eligibility || '12th Pass'}</span>
                     </div>
                  </div>
               </div>
               
               <div className="mb-8">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2 block">Program Summary</span>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {course.description}
                  </p>
               </div>

               {shouldShowBenefits && (
                 <div className="border-t border-slate-100 pt-6 mb-4 animate-fade-in-up">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">Institutional Benefits</span>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                       {benefitsList.map((benefit, i) => (
                         <div key={i} className="flex items-center gap-3 group">
                            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                              <i className="fa-solid fa-circle-check text-emerald-600 group-hover:text-white text-[10px]"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-700 tracking-tight">{benefit}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               <div className="mt-auto pt-5 flex items-center justify-between gap-4 border-t border-slate-50 sticky bottom-0 bg-white/95 backdrop-blur-md">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Fee Structure</p>
                     <p className="text-2xl font-black text-[#059669] tracking-tight">{course.price || 'Scholarship'}</p>
                  </div>
                  <Link 
                    to={`/enroll?course=${encodeURIComponent(course.name)}`}
                    className="px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-xl text-[11px] uppercase tracking-[0.2em] active:scale-95 text-center"
                  >
                    Enroll Now
                  </Link>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
};

export default CourseModal;
