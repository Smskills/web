
import React from 'react';
import { AppState, ThemeConfig, SiteConfig } from '../types.ts';

interface SiteTabProps {
  data: SiteConfig;
  theme: ThemeConfig;
  updateField: (field: string, value: any) => void;
  updateTheme: (field: string, value: any) => void;
  onLogoUploadClick: () => void;
  updateNavigation: (index: number, field: 'label' | 'path', value: string) => void;
  addNavigation: () => void;
  removeNavigation: (index: number) => void;
  onExport?: () => void;
  onImport?: (content: string) => void;
}

const SiteTab: React.FC<SiteTabProps> = ({ 
  data, theme, updateField, updateTheme, onLogoUploadClick, 
  updateNavigation, addNavigation, removeNavigation 
}) => {
  const handleEmailsChange = (val: string) => {
    const emails = val.split(',').map(e => e.trim()).filter(e => e.length > 0);
    updateField('notificationEmails', emails);
  };

  const updateAlert = (field: string, value: any) => {
    const currentAlert = data.admissionAlert || { enabled: false, text: '', subtext: '', linkText: '', linkPath: '/enroll' };
    updateField('admissionAlert', { ...currentAlert, [field]: value });
  };

  return (
    <div className="space-y-12 animate-fade-in text-slate-900">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight shrink-0">Institutional Branding</h2>
      </div>
      
      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-10">
          <div className="space-y-4 text-center md:text-left">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">Institutional Logo</label>
            <div onClick={onLogoUploadClick} className="w-48 h-32 bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-center p-4 overflow-hidden group relative shadow-inner">
              <img src={data.logo} className="max-w-full max-h-full object-contain group-hover:opacity-40" alt="Current Logo" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 text-emerald-700 font-black text-[10px] uppercase">Update Logo</div>
            </div>
          </div>

          <div className="flex-grow space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institute Name</label>
                    <input value={data.name} onChange={e => updateField('name', e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-sm" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Tagline</label>
                    <input value={data.tagline} onChange={e => updateField('tagline', e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 font-black outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 shadow-sm" />
                </div>
            </div>

            <div className="space-y-3 p-6 bg-emerald-600/5 rounded-2xl border border-emerald-600/10">
                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <i className="fa-solid fa-envelope-circle-check"></i> Lead Notifications
                </label>
                <input 
                    value={(data.notificationEmails || []).join(', ')} 
                    onChange={e => handleEmailsChange(e.target.value)}
                    className="w-full bg-white border border-emerald-100 rounded-xl px-6 py-4 text-slate-700 font-mono text-xs focus:border-emerald-500 outline-none"
                    placeholder="e.g. admin@sm-skills.edu"
                />
                <p className="text-[9px] text-emerald-600/70 font-bold uppercase mt-2 ml-1 tracking-widest italic">
                  * Alert: Enter your business email to receive enrollment notifications automatically.
                </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <div className="flex justify-between items-center">
          <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-bullhorn"></i> ADMISSION TOP BAR</h3>
          <button 
            onClick={() => updateAlert('enabled', !(data.admissionAlert?.enabled))} 
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-md ${data.admissionAlert?.enabled ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
          >
            {data.admissionAlert?.enabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alert Headline</label>
              <input value={data.admissionAlert?.text} onChange={e => updateAlert('text', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold shadow-sm outline-none" />
          </div>
          <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alert Description</label>
              <input value={data.admissionAlert?.subtext} onChange={e => updateAlert('subtext', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium shadow-sm outline-none" />
          </div>
        </div>
      </div>

      <div className="space-y-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-emerald-600 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-palette"></i> VISUAL THEME</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Primary Color</label>
            <div className="flex items-center gap-4">
              <input type="color" value={theme.primary} onChange={e => updateTheme('primary', e.target.value)} className="w-12 h-12 bg-transparent cursor-pointer rounded-lg overflow-hidden border border-slate-200" />
              <span className="text-xs font-mono text-slate-500 uppercase">{theme.primary}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Institutional Style</label>
            <select value={theme.radius} onChange={e => updateTheme('radius', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 uppercase font-black tracking-widest shadow-sm">
               <option value="none">Sharp</option>
               <option value="small">Sleek</option>
               <option value="medium">Modern</option>
               <option value="large">Institutional</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteTab;
