
import React, { useState, useEffect } from 'react';
import { Lead } from '../types.ts';

interface LeadsTabProps {
  leads: Lead[]; // Kept for interface compatibility but we will fetch fresh
  onUpdateLeads: (leads: Lead[]) => void;
}

const LeadsTab: React.FC<LeadsTabProps> = ({ onUpdateLeads }) => {
  const [dbLeads, setDbLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<'All' | 'New' | 'Contacted' | 'Enrolled'>('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/leads');
      const data = await response.json();
      if (data.success) {
        // Map backend snake_case to frontend camelCase
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
          details: typeof l.details === 'string' ? JSON.parse(l.details) : l.details
        }));
        setDbLeads(mapped);
      }
    } catch (e) {
      console.error("Fetch leads failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: Lead['status']) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchLeads();
    } catch (e) { alert("Status update failed"); }
  };

  const filtered = dbLeads
    .filter(l => filter === 'All' || l.status === filter)
    .filter(l => l.fullName.toLowerCase().includes(search.toLowerCase()));

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
          <button onClick={fetchLeads} className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Refresh Data</button>
        </div>
        <div className="flex flex-col sm:row gap-4">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
          <div className="flex bg-slate-900 p-1 rounded-xl">
            {(['All', 'New', 'Contacted', 'Enrolled'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase ${filter === f ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-500 uppercase font-black tracking-widest">Querying MySQL Database...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(lead => (
            <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/30 transition-all cursor-pointer flex justify-between items-center group">
              <div>
                <h4 className="text-white font-black text-lg group-hover:text-emerald-400">{lead.fullName}</h4>
                <div className="flex gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  <span>{lead.phone}</span>
                  <span>{lead.course}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusColor(lead.status)}`}>{lead.status}</span>
            </div>
          ))}
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-800 w-full max-w-2xl rounded-[2.5rem] border border-slate-700 overflow-hidden animate-fade-in">
                <div className="p-8 border-b border-slate-700 flex justify-between bg-slate-900/50">
                    <h2 className="text-2xl font-black text-white">{selectedLead.fullName}</h2>
                    <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
                </div>
                <div className="p-10 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-xs font-black text-slate-500 uppercase">Email: <span className="text-white ml-2">{selectedLead.email}</span></p>
                      <p className="text-xs font-black text-slate-500 uppercase">Phone: <span className="text-white ml-2">{selectedLead.phone}</span></p>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-2xl italic text-slate-300 text-sm">"{selectedLead.message}"</div>
                    <div className="flex gap-2">
                        <button onClick={() => updateStatus(selectedLead.id, 'Contacted')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase">Mark Contacted</button>
                        <button onClick={() => updateStatus(selectedLead.id, 'Enrolled')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase">Mark Enrolled</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTab;
