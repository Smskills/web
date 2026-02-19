
import React from 'react';
import { Course, PageMeta, AppState } from '../../types.ts';
import AcademicPageMeta from './AcademicPageMeta.tsx';
import ProgramsList from './ProgramsList.tsx';

interface AcademicsTabProps {
  coursesState: AppState['courses'];
  updateCourseItem: (id: string, field: keyof Course, value: any) => void;
  updatePageMeta: (field: keyof PageMeta, value: string) => void;
  onCourseImageClick: (id: string) => void;
  onCropCardClick: (id: string) => void;
  addItem: () => void;
  deleteItem: (id: string) => void;
}

const AcademicsTab: React.FC<AcademicsTabProps> = ({ 
  coursesState, 
  updateCourseItem, 
  updatePageMeta,
  onCourseImageClick, 
  onCropCardClick,
  addItem, 
  deleteItem 
}) => {
  const { list = [], pageMeta = { title: '', tagline: '', subtitle: '' } } = coursesState || {};

  return (
    <div className="space-y-16 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">Academic Catalog</h2>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2">Global Vocational Standards Management</p>
        </div>
        <button 
          onClick={addItem} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black shadow-lg flex items-center gap-3 transition-all active:scale-95 uppercase tracking-widest"
        >
          <i className="fa-solid fa-plus text-sm"></i> Create New Program
        </button>
      </div>

      <AcademicPageMeta 
        pageMeta={pageMeta} 
        updatePageMeta={updatePageMeta} 
      />

      <div className="h-px bg-slate-200"></div>

      <ProgramsList 
        list={list} 
        updateCourseItem={updateCourseItem} 
        onCourseImageClick={onCourseImageClick} 
        onCropCardClick={onCropCardClick}
        deleteItem={deleteItem} 
      />
    </div>
  );
};

export default AcademicsTab;
