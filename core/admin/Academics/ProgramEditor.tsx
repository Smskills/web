
import React from 'react';
import { Course } from '../../types.ts';

interface ProgramEditorProps {
  course: Course;
  updateCourseItem: (id: string, field: keyof Course, value: any) => void;
  onCourseImageClick: (id: string) => void;
  onCropCardClick: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

const ProgramEditor: React.FC<ProgramEditorProps> = ({ 
  course, 
  updateCourseItem, 
  onCourseImageClick, 
  onCropCardClick,
  onDelete 
}) => {
  const handlePriceChange = (id: string, value: string) => {
    let sanitized = value;
    if (value.startsWith('-')) sanitized = value.replace('-', '');
    updateCourseItem(id, 'price', sanitized);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 group transition-all hover:border-emerald-500/50 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Image (Full View)</label>
            <div 
              onClick={() => onCourseImageClick(course.id)} 
              className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group/img cursor-pointer"
            >
              <img src={course.image} className="w-full h-full object-cover transition-opacity group-hover/img:opacity-50" />
              <div className="absolute inset-0 bg-emerald-600/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                <i className="fa-solid fa-camera text-emerald-700 text-2xl"></i>
              </div>
            </div>
            
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mt-4 block">Card Framing (Catalog)</label>
            <div className="flex gap-3">
              <div className="w-20 h-15 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img src={course.cardImage || course.image} className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={() => onCropCardClick(course.id)}
                className="flex-grow py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-crop-simple"></i> Edit Framing
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Home Spotlight</span>
                <button 
                  onClick={() => updateCourseItem(course.id, 'isFeatured', !course.isFeatured)}
                  className={`w-12 h-6 rounded-full transition-all relative ${course.isFeatured ? 'bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${course.isFeatured ? 'right-1' : 'left-1'}`}></div>
                </button>
             </div>
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Toggle to show in "Vocational Tracks" on Home</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 w-full mr-4">
              <input 
                value={course.name} 
                onChange={e => updateCourseItem(course.id, 'name', e.target.value)} 
                className="text-xl font-black bg-transparent border-b border-slate-200 text-slate-900 flex-grow outline-none focus:border-emerald-500 transition-colors" 
                placeholder="Course Name" 
              />
              {course.isFeatured && (
                <span className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded tracking-[0.2em] shrink-0 shadow-lg animate-pulse">TOP TRACK</span>
              )}
            </div>
            <button onClick={() => onDelete(course.id, course.name)} className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
          
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
              <input value={course.duration} onChange={e => updateCourseItem(course.id, 'duration', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm text-slate-900 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="e.g. 6 Months" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Level</label>
              <select value={course.academicLevel} onChange={e => updateCourseItem(course.id, 'academicLevel', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm text-slate-900 outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="Certificate (NSDC)">Certificate (NSDC)</option>
                <option value="UG Certificate (NSDC)">UG Certificate (NSDC)</option>
                <option value="UG Diploma">UG Diploma</option>
                <option value="UG Degree">UG Degree</option>
                <option value="Master">Master</option>
                <option value="Short Term">Short Term</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
              <input value={course.price} onChange={e => handlePriceChange(course.id, e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm text-slate-900 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Rs. 50,000" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mode</label>
              <select value={course.mode} onChange={e => updateCourseItem(course.id, 'mode', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm text-slate-900 outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid (Online + Offline)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <select value={course.status} onChange={e => updateCourseItem(course.id, 'status', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm text-slate-900 outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Eligibility Criteria</label>
              <textarea value={course.eligibility || ''} onChange={e => updateCourseItem(course.id, 'eligibility', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-sm text-slate-600 resize-none outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner" rows={2} placeholder="Requirements to join..." />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest ml-1">Certification Name</label>
              <input value={course.certification || ''} onChange={e => updateCourseItem(course.id, 'certification', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm text-slate-900 outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner" placeholder="e.g. Government Certified Diploma" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
               <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Program Benefits (List items line by line)</label>
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Visible:</span>
                  <button 
                    onClick={() => updateCourseItem(course.id, 'showBenefits', !course.showBenefits)}
                    className={`w-10 h-5 rounded-full transition-all relative ${course.showBenefits ? 'bg-emerald-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${course.showBenefits ? 'right-1' : 'left-1'}`}></div>
                  </button>
               </div>
            </div>
            <textarea value={course.benefits || ''} onChange={e => updateCourseItem(course.id, 'benefits', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-sm text-slate-600 resize-none outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner" rows={3} placeholder="Key outcomes or perks..." />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Description</label>
            <textarea value={course.description} onChange={e => updateCourseItem(course.id, 'description', e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-sm text-slate-600 resize-none outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner" rows={3} placeholder="Detailed course summary..." />
            <p className="text-[9px] text-emerald-600/70 font-bold uppercase mt-1 tracking-widest italic">Supports basic HTML tags: &lt;b&gt;, &lt;ul&gt;, &lt;li&gt;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramEditor;
