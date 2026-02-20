import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getBenefitsList = (benefits: string | undefined) => {
    if (!benefits) return [];
    return benefits.split('\n').map(b => b.replace(/^[•\-\*]\s*/, '').trim()).filter(b => b.length > 0);
  };

  const benefits = getBenefitsList(course.benefits);

  return (
    <article className="flex flex-col rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all duration-500 group relative bg-white hover:shadow-4xl hover:border-emerald-200 shadow-sm h-full">
      {/* Image Section */}
      <div className="relative w-full h-52 overflow-hidden shrink-0">
        <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg shadow-2xl border border-emerald-400/30 flex items-center gap-2">
             <span className="text-[8px] font-black uppercase tracking-widest leading-none">{course.academicLevel}</span>
          </div>
          {course.isFeatured && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-lg shadow-2xl border border-amber-400/30 flex items-center gap-2 w-fit">
               <i className="fa-solid fa-star text-[8px]"></i>
               <span className="text-[8px] font-black uppercase tracking-widest leading-none">POPULAR</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors leading-tight tracking-tight">{course.name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
             {[
               { label: 'MODE', value: course.mode, icon: 'fa-chalkboard-user' },
               { label: 'DURATION', value: course.duration, icon: 'fa-clock' },
               { label: 'SECTOR', value: course.industry, icon: 'fa-briefcase' },
               { label: 'ELIGIBILITY', value: course.eligibility || '12TH PASS', icon: 'fa-id-card' }
             ].map((spec, i) => (
               <div key={i} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <i className={`fa-solid ${spec.icon} text-[10px] text-emerald-600`}></i>
                  <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">{spec.value}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="flex-grow">
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-6 font-medium">
             {course.description}
          </p>

          {/* Benefits (Short list) */}
          {course.showBenefits !== false && benefits.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {benefits.slice(0, 4).map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-emerald-500 text-[8px]"></i>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider truncate">{benefit}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Bar */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
             <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ADMISSION FEE</span>
             <span className="text-lg font-black text-emerald-600 tracking-tight leading-none">{course.price || 'Rs. 50,000'}</span>
          </div>
          <Link 
            to={`/enroll?course=${encodeURIComponent(course.name)}`}
            className="w-full sm:w-auto px-6 py-3 bg-[#020617] text-white font-black rounded-xl hover:bg-emerald-600 transition-all text-center uppercase tracking-[0.2em] text-[8px] shadow-xl active:scale-95 flex items-center justify-center gap-2 group/btn"
          >
            ENROLL NOW <i className="fa-solid fa-arrow-right text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
