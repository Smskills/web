
import React, { useState } from 'react';
import { Lead } from '../types.ts';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface LeadsTabProps {
  leads: Lead[];
  onUpdateLeads: (leads: Lead[]) => void;
}

const LeadsTab: React.FC<LeadsTabProps> = ({ leads, onUpdateLeads }) => {
  const [filter, setFilter] = useState<'All' | 'New' | 'Contacted' | 'Enrolled'>('All');
  const [search, setSearch] = useState('');

  const updateStatus = (id: string, status: Lead['status']) => {
    onUpdateLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const deleteLead = (id: string) => {
    if (window.confirm("Permanently delete this record?")) {
      onUpdateLeads(leads.filter(l => l.id !== id));
    }
  };

  const filtered = leads
    .filter(l => filter === 'All' || l.status === filter)
    .filter(l => 
      (l.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
      (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || '').includes(search)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'Contacted': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Enrolled': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default: return 'bg-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Institutional Pipeline</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Management of Student Applications & Enquiries</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search leads..." 
              className="bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 transition-all w-64" 
            />
          </div>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
        {(['All', 'New', 'Contacted', 'Enrolled'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-emerald-600 shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {f}
            </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(lead => (
          <div key={lead.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-emerald-500/40 transition-all flex flex-col lg:flex-row gap-8 items-start lg:items-center group shadow-sm hover:shadow-xl">
            <div className="flex items-center gap-6 flex-grow">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner ${lead.source === 'enrollment' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                 {lead.source === 'enrollment' ? 'APP' : 'ENQ'}
               </div>
               <div>
                 <h4 className="text-slate-900 font-black text-lg leading-none">{lead.fullName}</h4>
                 <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                   <span>{lead.email}</span>
                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                   <span>{lead.phone}</span>
                 </div>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getStatusColor(lead.status)}`}>{lead.status}</span>
              <div className="w-px h-8 bg-slate-200 mx-2 hidden lg:block"></div>
              <div className="flex gap-2">
                 <button onClick={() => updateStatus(lead.id, 'Contacted')} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 transition-all active:scale-95" title="Mark Contacted"><i className="fa-solid fa-phone"></i></button>
                 <button onClick={() => updateStatus(lead.id, 'Enrolled')} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 border border-slate-100 transition-all active:scale-95" title="Mark Enrolled"><i className="fa-solid fa-graduation-cap"></i></button>
                 <button onClick={() => deleteLead(lead.id)} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 transition-all active:scale-95" title="Discard"><i className="fa-solid fa-trash-can"></i></button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
           <div className="text-center py-32 text-slate-300 font-black uppercase tracking-[0.4em] border-2 border-dashed border-slate-200 rounded-[4rem]">
             No student leads found
           </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTab;
