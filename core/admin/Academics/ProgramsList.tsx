
import React, { useState } from 'react';
import { Course } from '../../types.ts';
import ProgramEditor from './ProgramEditor.tsx';

interface ProgramsListProps {
  list: Course[];
  updateCourseItem: (id: string, field: keyof Course, value: any) => void;
  onCourseImageClick: (id: string) => void;
  deleteItem: (id: string) => void;
}

const ProgramsList: React.FC<ProgramsListProps> = ({ 
  list, 
  updateCourseItem, 
  onCourseImageClick, 
  deleteItem 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = list.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.academicLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Programs ({list.length})</h2>
        <div className="relative w-full md:w-64 group">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search programs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-emerald-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map(course => (
          <ProgramEditor 
            key={course.id} 
            course={course} 
            updateCourseItem={updateCourseItem}
            onCourseImageClick={onCourseImageClick}
            onDelete={deleteItem}
          />
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No programs match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsList;
