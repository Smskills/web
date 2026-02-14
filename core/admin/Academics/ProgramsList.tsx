
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

  // 1. Filter based on search term first
  const filtered = useMemo(() => {
    return list.filter(c => 
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.academicLevel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.industry || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [list, searchTerm]);

  // 2. Group by Industry and Sort everything alphabetically
  const groupedData = useMemo(() => {
    const groups: Record<string, Course[]> = {};
    
    filtered.forEach(course => {
      const sector = course.industry || 'Unassigned Sector';
      if (!groups[sector]) groups[sector] = [];
      groups[sector].push(course);
    });

    // Sort the sector keys (Industries) alphabetically
    const sortedSectors = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    // For each sector, sort the programs alphabetically by name
    return sortedSectors.map(sector => ({
      sector,
      programs: groups[sector].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }));
  }, [filtered]);

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Catalog Organizer</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Automatic A-Z Sorting Enabled</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search name, level or sector..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 focus:border-emerald-500 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="space-y-16">
        {groupedData.map(({ sector, programs }) => (
          <div key={sector} className="space-y-6">
            {/* Sector Header Divider */}
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-2 rounded-full shadow-lg shrink-0">
                  <i className="fa-solid fa-folder-tree text-emerald-400 text-xs"></i>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{sector}</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-bold text-emerald-200 ml-2">{programs.length}</span>
               </div>
               <div className="flex-grow h-px bg-slate-200"></div>
            </div>

            {/* Program Cards within this Sector */}
            <div className="grid grid-cols-1 gap-6">
              {programs.map(course => (
                <ProgramEditor 
                  key={course.id} 
                  course={course} 
                  updateCourseItem={updateCourseItem}
                  onCourseImageClick={onCourseImageClick}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          </div>
        ))}

        {groupedData.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
               <i className="fa-solid fa-box-open"></i>
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No matching programs found.</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-6 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsList;
