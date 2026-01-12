
import React, { useState } from 'react';
import { Lead } from '../types.ts';

interface LeadsTabProps {
  leads: Lead[];
  onUpdateLeads: (leads: Lead[]) => void;
}

const LeadsTab: React.FC<LeadsTabProps> = ({ leads, onUpdateLeads }) => {
  const [filter, setFilter] = useState<'All' | 'New' | 'Contacted' | 'Enrolled'>('All');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = leads
    .filter(l => filter === 'All' || l.status === filter)
    .filter(l => l.fullName.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const updateStatus = (id: string, status: Lead['status']) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    onUpdateLeads(updated);
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
  };

  const deleteLead = (id: string) => {
    if (window.confirm("Permanently delete this student lead record?")) {
      onUpdateLeads(leads.filter(l => l.id !== id));
      setSelectedLead(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'Contacted': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Enrolled': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default: return 'bg-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-700 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Student Leads</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Incoming queries from Website</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input 
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search leads..." 
                className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-emerald-500 outline-none w-full" 
            />
          </div>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
            {(['All', 'New', 'Contacted', 'Enrolled'] as const).map(f => (
                <button 
                    key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {f}
                </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? filtered.map(lead => (
            <div 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)}
                className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 shadow-inner">
                        <i className={`fa-solid ${lead.source === 'enrollment' ? 'fa-graduation-cap' : 'fa-envelope-open'}`}></i>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-lg group-hover:text-emerald-400 transition-colors leading-tight">{lead.fullName}</h4>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lead.phone}</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{lead.course}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-[9px] font-black text-slate-600 uppercase hidden md:block">{new Date(lead.createdAt).toLocaleDateString()}</span>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${getStatusColor(lead.status)}`}>
                        {lead.status}
                    </span>
                    <i className="fa-solid fa-chevron-right text-slate-700 group-hover:translate-x-1 transition-transform"></i>
                </div>
            </div>
        )) : (
            <div className="text-center py-24 border-2 border-dashed border-slate-700 rounded-[3rem]">
                <i className="fa-solid fa-inbox text-5xl text-slate-800 mb-4"></i>
                <p className="text-slate-500 font-black uppercase tracking-widest">No matching leads found</p>
            </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedLead(null)}></div>
            <div className="bg-slate-800 w-full max-w-2xl max-h-[80vh] rounded-[2.5rem] shadow-3xl relative z-10 border border-slate-700 flex flex-col overflow-hidden animate-fade-in">
                <div className="p-8 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(selectedLead.status)}`}>
                            {selectedLead.status}
                        </div>
                        <span className="text-[10px] text-slate-500 font-black uppercase">{selectedLead.source} Application</span>
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="p-10 overflow-y-auto flex-grow space-y-10 custom-scrollbar">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">{selectedLead.fullName}</h2>
                            <p className="text-emerald-500 font-black uppercase text-sm tracking-widest mt-1">{selectedLead.course}</p>
                        </div>
                        <div className="space-y-2">
                             <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-3 px-4 py-2 bg-emerald-600 rounded-xl text-white text-xs font-black hover:bg-emerald-500 transition-all">
                                <i className="fa-solid fa-phone"></i> CALL STUDENT
                             </a>
                             <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-3 px-4 py-2 bg-slate-700 rounded-xl text-white text-xs font-black hover:bg-slate-600 transition-all">
                                <i className="fa-solid fa-envelope"></i> EMAIL
                             </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-700/50">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</span>
                            <p className="text-slate-200 font-bold">{selectedLead.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</span>
                            <p className="text-slate-200 font-bold">{selectedLead.email}</p>
                        </div>
                    </div>

                    {selectedLead.message && (
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Message</span>
                            <p className="p-6 bg-slate-900 border border-slate-700 rounded-2xl text-slate-300 text-sm italic">
                                "{selectedLead.message}"
                            </p>
                        </div>
                    )}

                    {selectedLead.details && Object.keys(selectedLead.details).length > 0 && (
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Extended Application Data</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(selectedLead.details).map(([key, val]) => (
                                    <div key={key} className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <p className="text-slate-200 text-xs font-bold">{String(val)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-slate-700 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => updateStatus(selectedLead.id, 'Contacted')} className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Mark Contacted</button>
                        <button onClick={() => updateStatus(selectedLead.id, 'Enrolled')} className="px-4 py-2 bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Mark Enrolled</button>
                    </div>
                    <button onClick={() => deleteLead(selectedLead.id)} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Delete Record</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTab;
