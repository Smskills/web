
import React from 'react';

interface FilterBarProps {
  academicLevels: string[];
  currentLevel: string;
  currentIndustry: string;
  sectors: string[];
  onLevelChange: (level: string) => void;
  onIndustryChange: (industry: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  academicLevels, 
  currentLevel, 
  currentIndustry, 
  sectors, 
  onLevelChange, 
  onIndustryChange 
}) => {
  return (
    <div className="bg-white border-b border-slate-200 py-6 sticky top-20 md:top-24 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 ml-1">
               <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Academic Tier</label>
             </div>
             <div className="flex flex-wrap gap-2">
               {academicLevels.map(lvl => (
                 <button 
                   key={lvl} 
                   onClick={() => onLevelChange(lvl)}
                   className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                     currentLevel === lvl 
                       ? 'bg-[#059669] text-white border-emerald-600 shadow-md' 
                       : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                   }`}
                 >
                   {lvl}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 ml-1">
               <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vocational Sector</label>
             </div>
             <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {sectors.map(ind => (
                  <button
                    key={ind}
                    onClick={() => onIndustryChange(ind)}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                      currentIndustry === ind
                        ? 'bg-[#1e1b4b] text-white border-slate-900'
                        : 'bg-white text-slate-600 hover:border-emerald-500 border-slate-200'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
