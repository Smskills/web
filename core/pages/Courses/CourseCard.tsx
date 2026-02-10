
import React from 'react';
import { Course } from '../../types';
import FormattedText from '../../components/FormattedText.tsx';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group">
      <div className="h-52 relative overflow-hidden">
        <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
      </div>
      <div className="p-7 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors">{course.name}</h3>
        <div className="flex-grow">
          <FormattedText text={course.description} className="text-slate-500 text-xs leading-relaxed mb-5 line-clamp-2 font-medium" />
        </div>
        <button 
          onClick={() => onSelect(course)}
          className="w-full py-3 bg-slate-900 text-white font-black rounded-lg hover:bg-emerald-600 transition-all text-center flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10"
        >
          Details <i className="fa-solid fa-arrow-right text-[8px]"></i>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
