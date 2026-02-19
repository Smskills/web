
import React from 'react';
import { AppState, TeamMember, AchievementStat, ExtraChapter } from '../types.ts';

interface AboutTabProps {
  data: AppState['about'];
  updateChapter: (chapter: string, field: string, value: any) => void;
  triggerUpload: (path: string) => void;
  addTeamMember: () => void;
  updateTeamMember: (id: string, field: keyof TeamMember, value: string) => void;
  removeTeamMember: (id: string) => void;
  updateStats: (id: string, field: keyof AchievementStat, value: string) => void;
  addStat: () => void;
  removeStat: (id: string) => void;
  updateValues: (index: number, value: string) => void;
  addValue: () => void;
  removeValue: (index: number) => void;
  addExtraChapter: () => void;
  updateExtraChapter: (id: string, field: keyof ExtraChapter, value: string) => void;
  removeExtraChapter: (id: string) => void;
}

const AboutTab: React.FC<AboutTabProps> = ({ 
  data, 
  updateChapter,
  triggerUpload,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  updateStats,
  addStat,
  removeStat,
  updateValues,
  addValue,
  removeValue,
  addExtraChapter,
  updateExtraChapter,
  removeExtraChapter
}) => {
  const {
    beginning = { label: '', title: '', story: '', image: '' },
    learning = { label: '', title: '', description: '', image1: '', image2: '', caption1: '', caption2: '' },
    founder = { label: '', title: '', name: '', role: '', bio: '', image: '', quote: '' },
    faculty = { label: '', title: '', description: '', members: [] },
    vision = { label: '', title: '', content: '', values: [], image: '' },
    achievements = { label: '', title: '', image: '', stats: [], ctaLabel: '' },
    extraChapters = []
  } = data || {};

  return (
    <div className="space-y-16 animate-fade-in pb-20 text-slate-900">
      <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight shrink-0">Institutional Story</h2>
      </div>

      {/* Chapter 1: Beginning */}
      <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-feather-pointed"></i> THE GENESIS</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Story</label>
              <div onClick={() => triggerUpload('about.beginning.image')} className="aspect-video rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden group relative shadow-inner">
                 {beginning.image ? <img src={beginning.image} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Genesis" /> : <i className="fa-solid fa-image text-3xl text-slate-200"></i>}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 font-black text-[10px] text-emerald-700 uppercase bg-white/60">Change Scene</div>
              </div>
           </div>
           <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Tag</label>
                  <input value={beginning.label} onChange={e => updateChapter('beginning', 'label', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] text-emerald-600 font-black uppercase tracking-widest shadow-sm outline-none focus:border-emerald-500" placeholder="e.g. CHAPTER 01" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Headline</label>
                  <input value={beginning.title} onChange={e => updateChapter('beginning', 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-black shadow-sm outline-none focus:border-emerald-500" placeholder="Chapter Title" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Story Narrative</label>
                <textarea value={beginning.story} onChange={e => updateChapter('beginning', 'story', e.target.value)} rows={4} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 resize-none shadow-sm outline-none focus:border-emerald-500" placeholder="The founding narrative..." />
              </div>
           </div>
        </div>
      </div>

      {/* NEW: Founder Section Management */}
      <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-user-tie"></i> THE FOUNDER</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Profile Photo</label>
              <div onClick={() => triggerUpload('about.founder.image')} className="aspect-[4/5] rounded-[2.5rem] bg-white border-2 border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden group relative shadow-inner max-w-[280px] mx-auto">
                 {founder.image ? <img src={founder.image} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="Founder" /> : <i className="fa-solid fa-user text-5xl text-slate-200"></i>}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 font-black text-[10px] text-emerald-700 uppercase bg-white/60">Upload Portrait</div>
              </div>
           </div>
           <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input value={founder.name} onChange={e => updateChapter('founder', 'name', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-black shadow-sm outline-none focus:border-emerald-500" placeholder="Founder Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Role/Designation</label>
                  <input value={founder.role} onChange={e => updateChapter('founder', 'role', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] text-emerald-600 font-black uppercase tracking-widest shadow-sm outline-none focus:border-emerald-500" placeholder="e.g. Founder & Director" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Inspiration Quote</label>
                <input value={founder.quote} onChange={e => updateChapter('founder', 'quote', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs italic text-slate-600 shadow-sm outline-none focus:border-emerald-500" placeholder="A brief quote from the founder..." />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Biography</label>
                <textarea value={founder.bio} onChange={e => updateChapter('founder', 'bio', e.target.value)} rows={5} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 resize-none shadow-sm outline-none focus:border-emerald-500" placeholder="Detailed biography and vision..." />
              </div>
           </div>
        </div>
      </div>

      {/* Chapter 3: Mentors / Faculty */}
      <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
             <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-user-graduate"></i> FACULTY & MENTORS</h3>
           </div>
           <button onClick={addTeamMember} className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95">Add Faculty Member</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {(faculty.members || []).map(member => (
              <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-200 relative group hover:border-emerald-300 transition-all shadow-sm">
                 <button onClick={() => removeTeamMember(member.id)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl hover:bg-red-600 z-20"><i className="fa-solid fa-trash-can text-[10px]"></i></button>
                 
                 <div className="flex gap-6">
                    <div onClick={() => triggerUpload(`about.faculty.members.${member.id}`)} className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer shrink-0 relative group/p shadow-inner">
                       <img src={member.image} className="w-full h-full object-cover" alt={member.name} />
                       <div className="absolute inset-0 bg-white/60 opacity-0 group-hover/p:opacity-100 flex items-center justify-center text-[7px] font-black text-emerald-700 uppercase text-center p-2 leading-tight">Update Photo</div>
                    </div>
                    <div className="flex-grow space-y-4">
                       <div className="space-y-1">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                         <input value={member.name} onChange={e => updateTeamMember(member.id, 'name', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-black outline-none focus:border-emerald-500" placeholder="Name" />
                       </div>
                       <div className="space-y-1">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Role / Designation</label>
                         <input value={member.role} onChange={e => updateTeamMember(member.id, 'role', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] text-emerald-600 font-black uppercase outline-none focus:border-emerald-500" placeholder="Job Title" />
                       </div>
                    </div>
                 </div>
                 <div className="mt-4 space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                    <textarea value={member.bio} onChange={e => updateTeamMember(member.id, 'bio', e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-600 resize-none shadow-inner outline-none focus:border-emerald-500" placeholder="Experience details..." />
                 </div>
              </div>
           ))}
        </div>

        {(!faculty.members || faculty.members.length === 0) && (
           <div className="py-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">No faculty members listed yet.</p>
           </div>
        )}
      </div>

      {/* Chapter 4: Vision & Values */}
      <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-eye"></i> VISION & DNA</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Headline</label>
                <input value={vision.title} onChange={e => updateChapter('vision', 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-black shadow-sm outline-none focus:border-emerald-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Statement</label>
                <textarea value={vision.content} onChange={e => updateChapter('vision', 'content', e.target.value)} rows={4} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 resize-none shadow-sm outline-none focus:border-emerald-500" />
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Core Values</span>
                 <button onClick={addValue} className="text-[9px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">+ Add New</button>
              </div>
              <div className="space-y-2">
                 {(vision.values || []).map((v, idx) => (
                    <div key={idx} className="flex gap-2 group">
                       <input value={v} onChange={e => updateValues(idx, e.target.value)} className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 font-bold shadow-sm outline-none focus:border-emerald-500" />
                       <button onClick={() => removeValue(idx)} className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
