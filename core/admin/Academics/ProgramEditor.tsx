
import React from 'react';
import { Course } from '../../types.ts';

interface ProgramEditorProps {
  course: Course;
  updateCourseItem: (id: string, field: keyof Course, value: any) => void;
  onCourseImageClick: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

const ProgramEditor: React.FC<ProgramEditorProps> = ({ 
  course, 
  updateCourseItem, 
  onCourseImageClick, 
  onDelete 
}) => {
  const handlePriceChange = (id: string, value: string) => {
    let sanitized = value;
    if (value.startsWith('-')) sanitized = value.replace('-', '');
    updateCourseItem(id, 'price', sanitized);
  };

  return (
    <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700 group transition-all hover:border-emerald-500/30">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div 
            onClick={() => onCourseImageClick(course.id)} 
            className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-800 group/img cursor-pointer"
          >
            <img src={course.image} className="w-full h-full object-cover transition-opacity group-hover/img:opacity-50" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
              <i className="fa-solid fa-upload text-white text-2xl"></i>
            </div>
          </div>
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-center mt-3">Click to change cover</p>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <input 
              value={course.name} 
              onChange={e => updateCourseItem(course.id, 'name', e.target.value)} 
              className="text-xl font-black bg-transparent border-b border-slate-700 text-white w-full mr-4 outline-none focus:border-emerald-500 transition-colors" 
              placeholder="Course Name" 
            />
            <button onClick={() => onDelete(course.id, course.name)} className="text-red-500 hover:text-red-400 p-2 transition-colors">
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration</label>
              <input value={course.duration} onChange={e => updateCourseItem(course.id, 'duration', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" placeholder="e.g. 6 Months" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Level</label>
              <select value={course.academicLevel} onChange={e => updateCourseItem(course.id, 'academicLevel', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="Certificate (NSDC)">Certificate (NSDC)</option>
                <option value="UG Certificate (NSDC)">UG Certificate (NSDC)</option>
                <option value="UG Diploma (NSDC)">UG Diploma (NSDC)</option>
                <option value="UG Degree">UG Degree</option>
                <option value="Master">Master</option>
                <option value="Short Term">Short Term</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Price</label>
              <input value={course.price} onChange={e => handlePriceChange(course.id, e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Rs. 50,000" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Mode</label>
              <select value={course.mode} onChange={e => updateCourseItem(course.id, 'mode', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
              <select value={course.status} onChange={e => updateCourseItem(course.id, 'status', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1">Eligibility Criteria</label>
              <textarea value={course.eligibility || ''} onChange={e => updateCourseItem(course.id, 'eligibility', e.target.value)} className="w-full bg-slate-800 p-3 rounded text-sm text-slate-300 resize-none outline-none focus:ring-1 focus:ring-emerald-500" rows={2} placeholder="Requirements to join..." />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1">Certification Name</label>
              <input value={course.certification || ''} onChange={e => updateCourseItem(course.id, 'certification', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500" placeholder="e.g. Government Certified Diploma" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Program Description</label>
            <textarea value={course.description} onChange={e => updateCourseItem(course.id, 'description', e.target.value)} className="w-full bg-slate-800 p-3 rounded text-sm text-slate-300 resize-none outline-none focus:ring-1 focus:ring-emerald-500" rows={3} placeholder="Detailed course summary..." />
            <p className="text-[9px] text-emerald-500/70 font-bold uppercase mt-1 tracking-widest italic">Supports basic HTML tags: &lt;b&gt;, &lt;ul&gt;, &lt;li&gt;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramEditor;
