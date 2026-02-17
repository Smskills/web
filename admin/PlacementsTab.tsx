import React from 'react';
import { PlacementStat, StudentReview, IndustryPartner } from '../types.ts';

interface PlacementsTabProps {
  stats: PlacementStat[];
  reviews: StudentReview[];
  partners: IndustryPartner[];
  pageDescription?: string;
  updateStat: (id: string, field: keyof PlacementStat, value: string) => void;
  addStat: () => void;
  deleteStat: (id: string) => void;
  updateReview: (id: string, field: keyof StudentReview, value: string) => void;
  addReview: () => void;
  deleteReview: (id: string) => void;
  updatePartner: (id: string, field: keyof IndustryPartner, value: string) => void;
  addPartner: () => void;
  deletePartner: (id: string) => void;
  updatePageDescription?: (value: string) => void;
  onReviewImageClick: (id: string) => void;
  onPartnerImageClick: (id: string) => void;
  label?: string;
}

/**
 * PlacementsTab component for managing institutional placement records,
 * industry partners, and student success stories.
 */
const PlacementsTab: React.FC<PlacementsTabProps> = ({
  stats,
  reviews,
  partners,
  pageDescription,
  updateStat,
  addStat,
  deleteStat,
  updateReview,
  addReview,
  deleteReview,
  updatePartner,
  addPartner,
  deletePartner,
  updatePageDescription,
  onReviewImageClick,
  onPartnerImageClick,
  label = "Placement"
}) => {
  const handleDeleteStat = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the statistic: "${name}"?`)) {
      deleteStat(id);
    }
  };

  const handleDeleteReview = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the review from "${name}"?`)) {
      deleteReview(id);
    }
  };

  const handleDeletePartner = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the industry partners list?`)) {
      deletePartner(id);
    }
  };

  return (
    <div className="space-y-16 animate-fade-in pb-20">
      {/* Page Branding */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
         <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-feather"></i> PAGE CONTENT</h3>
         <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label} Page Intro Text</label>
           <textarea 
             value={pageDescription} 
             onChange={e => updatePageDescription?.(e.target.value)}
             rows={2} 
             className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium resize-none"
           />
         </div>
      </div>

      {/* Industry Partners Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Industry Tie-ups</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Marquee Ticker Partners</p>
          </div>
          <button onClick={addPartner} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95">ADD PARTNER</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map(partner => (
            <div key={partner.id} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700 group relative flex items-center gap-6">
              <button onClick={() => handleDeletePartner(partner.id, partner.name)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl"><i className="fa-solid fa-trash text-[10px]"></i></button>
              <div 
                onClick={() => onPartnerImageClick(partner.id)}
                className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-emerald-500 transition-colors cursor-pointer overflow-hidden relative"
              >
                {partner.image ? (
                  <img src={partner.image} className="w-full h-full object-contain p-2" />
                ) : (
                  <i className={`fa-brands ${partner.icon || 'fa-building'} text-3xl text-emerald-500`}></i>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                  <i className="fa-solid fa-camera text-white text-xs"></i>
                </div>
              </div>
              <div className="flex-grow space-y-2">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Company Name</label>
                  <input value={partner.name} onChange={e => updatePartner(partner.id, 'name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-[10px] text-white font-bold" />
                </div>
                {!partner.image && (
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest">FA Icon (fa-brands)</label>
                    <input value={partner.icon} onChange={e => updatePartner(partner.id, 'icon', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-[10px] text-emerald-400 font-mono" placeholder="fa-google" />
                  </div>
                )}
                {partner.image && (
                  <button 
                    onClick={() => updatePartner(partner.id, 'image', '')}
                    className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline"
                  >
                    Clear Image & Use Icon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{label} Stats</h2>
          <button onClick={addStat} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95">ADD STAT</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map(stat => (
            <div key={stat.id} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700 group relative">
              <button onClick={() => handleDeleteStat(stat.id, stat.label)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl"><i className="fa-solid fa-trash text-[10px]"></i></button>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Label</label>
                  <input value={stat.label} onChange={e => updateStat(stat.id, 'label', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-[10px] text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Value</label>
                  <input value={stat.value} onChange={e => updateStat(stat.id, 'value', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-[10px] text-emerald-400 font-black" />
                </div>
              </div>
              <div className="mt-2 space-y-1">
                 <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest">FA Icon</label>
                 <input value={stat.icon} onChange={e => updateStat(stat.id, 'icon', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-[10px] text-slate-500 font-mono" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Reviews Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{label} Wall Reviews</h2>
          <button onClick={addReview} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95">ADD REVIEW</button>
        </div>
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700 group">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div onClick={() => onReviewImageClick(review.id)} className="lg:col-span-1 cursor-pointer">
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-800 relative group/img">
                    <img src={review.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"><i className="fa-solid fa-camera text-white"></i></div>
                  </div>
                </div>
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex justify-between items-center">
                    <input value={review.name} onChange={e => updateReview(review.id, 'name', e.target.value)} className="text-xl font-black bg-transparent border-b border-slate-700 text-white w-full mr-4 outline-none" placeholder="Student Name" />
                    <button onClick={() => handleDeleteReview(review.id, review.name)} className="text-red-500"><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={review.course} onChange={e => updateReview(review.id, 'course', e.target.value)} className="bg-slate-800 p-2 rounded text-xs text-white" placeholder="Course" />
                    <input value={review.company} onChange={e => updateReview(review.id, 'company', e.target.value)} className="bg-slate-800 p-2 rounded text-xs text-white" placeholder="Company" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={review.companyIcon} onChange={e => updateReview(review.id, 'companyIcon', e.target.value)} className="bg-slate-800 p-2 rounded text-[10px] text-emerald-500 font-mono" placeholder="fa-brands icon" />
                    <input value={review.salaryIncrease} onChange={e => updateReview(review.id, 'salaryIncrease', e.target.value)} className="bg-slate-800 p-2 rounded text-xs text-white" placeholder="+100% Hike" />
                  </div>
                  <textarea value={review.text} onChange={e => updateReview(review.id, 'text', e.target.value)} rows={3} className="w-full bg-slate-800 p-3 rounded-xl text-xs text-slate-300 resize-none" placeholder="Review Text" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementsTab;