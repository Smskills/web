import React, { useState } from 'react';
import { Lead } from '../types.ts';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface LeadsTabProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: Lead['status']) => void;
  onDeleteLead: (id: string) => void;
  enrollmentForm?: any;
  contactForm?: any;
}

const LeadsTab: React.FC<LeadsTabProps> = ({ leads, onUpdateStatus, onDeleteLead, enrollmentForm, contactForm }) => {
  const [filter, setFilter] = useState<'All' | 'New' | 'Contacted' | 'Enrolled'>('All');
  const [search, setSearch] = useState('');
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  const updateStatus = (id: string, status: Lead['status']) => {
    onUpdateStatus(id, status);
  };

  const deleteLead = (id: string) => {
    if (window.confirm("Permanently delete this student record?")) {
      onDeleteLead(id);
    }
  };

  const getFieldLabel = (fieldId: string, source: 'enrollment' | 'contact') => {
    const form = source === 'enrollment' ? enrollmentForm : contactForm;
    if (!form?.fields) return fieldId;
    const field = form.fields.find((f: any) => f.id === fieldId);
    return field ? field.label : fieldId;
  };

  const filtered = (leads || [])
    .filter(l => filter === 'All' || l.status === filter)
    .filter(l => 
      (l.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
      (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || '').includes(search)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Contacted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Enrolled': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-12 animate-fade-in text-white">
      <div className="flex justify-between items-center border-b border-slate-700/50 pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Lead Desk</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Student Enrollment Pipeline</p>
        </div>
        <div className="relative group">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search records..." 
            className="bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-all w-64 shadow-inner" 
          />
        </div>
      </div>

      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700/50 w-fit shadow-inner">
        {(['All', 'New', 'Contacted', 'Enrolled'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}
            >
              {f}
            </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(lead => (
          <div key={lead.id} className="bg-slate-800/40 rounded-[2rem] border border-slate-700/50 hover:border-emerald-500/30 transition-all group shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              <div className="flex items-center gap-6 flex-grow">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-2xl border ${lead.source === 'enrollment' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                  {lead.source === 'enrollment' ? 'APP' : 'ENQ'}
                </div>
                <div>
                  <h4 className="text-white font-black text-lg leading-none group-hover:text-emerald-400 transition-colors">{lead.fullName}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
                    <span className="flex items-center gap-2"><i className="fa-solid fa-envelope"></i> {lead.email}</span>
                    <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="flex items-center gap-2"><i className="fa-solid fa-phone"></i> {lead.phone}</span>
                    {lead.course && (
                      <>
                        <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span className="text-emerald-500/80"><i className="fa-solid fa-graduation-cap"></i> {lead.course}</span>
                      </>
                    )}
                    <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="text-slate-600"><i className="fa-solid fa-clock"></i> {new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getStatusColor(lead.status)} shadow-lg`}>{lead.status}</span>
                <div className="w-px h-10 bg-slate-700/50 mx-2 hidden lg:block"></div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id)} 
                    className={`w-11 h-11 rounded-xl bg-slate-900 transition-all border border-slate-700 active:scale-90 ${expandedLeadId === lead.id ? 'text-emerald-400 border-emerald-500/50' : 'text-slate-500 hover:text-white'}`}
                    title="View Details"
                  >
                    <i className={`fa-solid ${expandedLeadId === lead.id ? 'fa-chevron-up' : 'fa-eye'}`}></i>
                  </button>
                  <button onClick={() => updateStatus(lead.id, 'Contacted')} className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 border border-slate-700 transition-all active:scale-90" title="Contacted"><i className="fa-solid fa-phone"></i></button>
                  <button onClick={() => updateStatus(lead.id, 'Enrolled')} className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 border border-slate-700 transition-all active:scale-90" title="Enrolled"><i className="fa-solid fa-check-double"></i></button>
                  <button onClick={() => deleteLead(lead.id)} className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-slate-700 transition-all active:scale-90" title="Delete"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              </div>
            </div>

            {expandedLeadId === lead.id && (
              <div className="px-6 pb-8 pt-2 border-t border-slate-700/30 bg-slate-900/30 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Core Information</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 uppercase font-bold">Full Name</span>
                        <span className="text-slate-200">{lead.fullName}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 uppercase font-bold">Email</span>
                        <span className="text-slate-200">{lead.email}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 uppercase font-bold">Phone</span>
                        <span className="text-slate-200">{lead.phone}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 uppercase font-bold">Source</span>
                        <span className="text-slate-200 uppercase">{lead.source}</span>
                      </div>
                    </div>
                  </div>

                  {lead.details && Object.keys(lead.details).length > 0 && (
                    <div className="md:col-span-2 space-y-4">
                      <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Form Submission Details</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        {Object.entries(lead.details).map(([key, value]) => (
                          <div key={key} className="flex flex-col gap-1 border-l-2 border-slate-700 pl-4 py-1">
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-tight">
                              {getFieldLabel(key, lead.source)}
                            </span>
                            <span className="text-xs text-slate-200 font-medium">
                              {typeof value === 'string' ? value : JSON.stringify(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lead.message && lead.message !== 'Website Application' && (
                    <div className="col-span-full mt-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                      <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Message / Notes</h5>
                      <p className="text-xs text-slate-300 leading-relaxed italic">"{lead.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
           <div className="text-center py-32 text-slate-700 font-black uppercase tracking-[0.4em] border-2 border-dashed border-slate-800 rounded-[4rem]">
             No matches in database
           </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTab;