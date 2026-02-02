
import React, { useState, useEffect } from 'react';
import { Lead } from '../types.ts';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface LeadsTabProps {
  leads: Lead[];
  onUpdateLeads: (leads: Lead[]) => void;
}

const LeadsTab: React.FC<LeadsTabProps> = ({ onUpdateLeads }) => {
  const [dbLeads, setDbLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<'All' | 'New' | 'Contacted' | 'Enrolled'>('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('sms_auth_token');
      const response = await fetch('http://localhost:5000/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const mapped = data.data.map((l: any) => ({
          id: l.id,
          fullName: l.full_name,
          email: l.email,
          phone: l.phone,
          course: l.course,
          message: l.message,
          source: l.source,
          status: l.status,
          createdAt: l.created_at,
          details: typeof l.details === 'string' ? JSON.parse(l.details) : (l.details || {})
        }));
        setDbLeads(mapped);
      } else {
        setFetchError(data.message || 'Institutional session expired. Please log in again.');
      }
    } catch (e) {
      setFetchError('Institutional server offline. Ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: Lead['status']) => {
    try {
      const token = localStorage.getItem('sms_auth_token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchLeads();
    } catch (e) { console.error("Status update failed", e); }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm("Permanently delete this record?")) return;
    try {
      const token = localStorage.getItem('sms_auth_token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) fetchLeads();
    } catch (e) { console.error("Delete failed", e); }
  };

  const filtered = dbLeads
    .filter(l => filter === 'All' || l.status === filter)
    .filter(l => 
      (l.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
      (l.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || '').includes(search)
    );

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
      {/* Header Styled Like Second Image (Gallery Header) */}
      <div className="text-center mb-16">
        <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Institutional Pipeline</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Student Leads</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="relative flex-grow w-full group">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by name, email or phone..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-500 shadow-inner" 
            />
          </div>
          <button onClick={fetchLeads} className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-2xl transition-all active:scale-95" title="Refresh Data">
            <i className="fa-solid fa-rotate"></i>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-center mb-10">
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-700 shadow-2xl">
          {(['All', 'New', 'Contacted', 'Enrolled'] as const).map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {f}
              </button>
          ))}
        </div>
      </div>

      {fetchError ? (
        <div className="p-10 bg-red-500/5 border border-red-500/20 rounded-[3rem] text-center">
           <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
           <h3 className="text-white font-black uppercase tracking-tight">Sync Failure</h3>
           <p className="text-red-400/80 text-sm mt-2">{fetchError}</p>
           <button onClick={fetchLeads} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Connection</button>
        </div>
      ) : (
        <PageStateGuard isLoading={isLoading} loadingFallback={<div className="text-center py-20"><i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-500 mb-4"></i><p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">Syncing MySQL Database...</p></div>}>
          <div className="space-y-4">
            {filtered.map(lead => (
              <div 
                key={lead.id} 
                onClick={() => setSelectedLead(lead)} 
                className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all cursor-pointer flex justify-between items-center group shadow-sm hover:shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner ${lead.source === 'enrollment' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                    {lead.source === 'enrollment' ? 'APP' : 'ENQ'}
                  </div>
                  <div>
                    <h4 className="text-white font-black text-lg group-hover:text-emerald-400 transition-colors leading-none">{lead.fullName}</h4>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
                      <span className="flex items-center gap-2"><i className="fa-solid fa-phone text-slate-700"></i> {lead.phone}</span>
                      <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                      <span className="text-emerald-600/70">{lead.course}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-sm ${getStatusColor(lead.status)}`}>{lead.status}</span>
                  <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-emerald-500 transition-all group-hover:translate-x-1"></i>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
               <div className="text-center py-32 text-slate-700 font-black uppercase tracking-[0.4em] border-2 border-dashed border-slate-800 rounded-[4rem] bg-slate-900/10">
                 No student leads found
               </div>
            )}
          </div>
        </PageStateGuard>
      )}

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-800 w-full max-w-4xl rounded-[3rem] border border-slate-700 overflow-hidden shadow-4xl max-h-[90vh] flex flex-col scale-in-center">
                <div className="p-8 md:p-10 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 shrink-0">
                    <div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 block">Student Profile Record</span>
                      <h2 className="text-3xl md:text-4xl font-black text-white leading-none tracking-tight">{selectedLead.fullName}</h2>
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="w-14 h-14 rounded-2xl bg-slate-700 hover:bg-red-500 text-white transition-all active:scale-90 shadow-lg">
                      <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>
                <div className="p-10 md:p-14 space-y-12 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                        <p className="text-white font-bold break-all select-all text-sm">{selectedLead.email}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                        <p className="text-white font-bold select-all text-sm">{selectedLead.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Course Choice</label>
                        <p className="text-emerald-400 font-black uppercase tracking-tight text-sm">{selectedLead.course}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lead Source</label>
                        <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">{selectedLead.source}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <i className="fa-solid fa-comment-dots text-emerald-600"></i> Primary Message
                        </label>
                        <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-700 italic text-slate-300 text-base leading-relaxed whitespace-pre-wrap shadow-inner">
                          {selectedLead.message || "No additional remarks provided by the student."}
                        </div>
                    </div>

                    {selectedLead.details && Object.keys(selectedLead.details).length > 0 && (
                      <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Extended Metadata</label>
                            <div className="flex-grow h-px bg-slate-700/50"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Object.entries(selectedLead.details).map(([key, val]) => (
                              <div key={key} className="p-6 bg-slate-900/50 border border-slate-700 rounded-3xl group/item hover:border-emerald-500/30 transition-all">
                                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter mb-2 group-hover/item:text-emerald-500 transition-colors">{key.replace(/_/g, ' ')}</p>
                                 <p className="text-[13px] text-slate-200 font-medium">{val?.toString() || '—'}</p>
                              </div>
                            ))}
                          </div>
                      </div>
                    )}
                </div>
                <div className="p-8 md:p-10 border-t border-slate-700 flex flex-wrap gap-4 bg-slate-900/50 shrink-0">
                    <button onClick={() => { updateStatus(selectedLead.id, 'Contacted'); setSelectedLead(null); }} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95">Mark Contacted</button>
                    <button onClick={() => { updateStatus(selectedLead.id, 'Enrolled'); setSelectedLead(null); }} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95">Mark Enrolled</button>
                    <div className="flex-grow"></div>
                    <button onClick={() => { deleteLead(selectedLead.id); setSelectedLead(null); }} className="px-8 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-red-500/20 active:scale-95">Discard Lead</button>
                </div>
            </div>
        </div>
      )}
      
      <style>{`
        .scale-in-center { animation: scale-in-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center { 
          0% { transform: scale(0.9); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }
      `}</style>
    </div>
  );
};

export default LeadsTab;
