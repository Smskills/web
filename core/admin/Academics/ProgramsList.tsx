
import React, { useState, useMemo } from 'react';
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

  const sortedList = useMemo(() => {
    // 1. Filter by search
    const filtered = list.filter(c => 
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.academicLevel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.industry || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Sort by ID descending (Date.now numeric strings) 
    // This ensures NEW courses added in AdminDashboard appear at the VERY TOP.
    return filtered.sort((a, b) => {
      const idA = parseInt(a.id.replace(/\D/g, '')) || 0;
      const idB = parseInt(b.id.replace(/\D/g, '')) || 0;
      return idB - idA;
    });
  }, [list, searchTerm]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Management View</h2>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Sorting: Most Recently Added First</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search programs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-6">
        {sortedList.map(course => (
          <ProgramEditor 
            key={course.id} 
            course={course} 
            updateCourseItem={updateCourseItem}
            onCourseImageClick={onCourseImageClick}
            onDelete={deleteItem}
          />
        ))}

        {sortedList.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
               <i className="fa-solid fa-box-open"></i>
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No matching programs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsList;
