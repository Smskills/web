
import React, { useState } from 'react';
import { Notice } from '../types';

interface NoticesPageProps {
  notices: Notice[];
}

const NoticesPage: React.FC<NoticesPageProps> = ({ notices }) => {
  const [search, setSearch] = useState('');

  const sortedNotices = [...notices].sort((a, b) => {
    // Important notices first, then by date descending
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filtered = sortedNotices.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-6">Notices & Announcements</h1>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search notices..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {filtered.map(notice => (
              <div 
                key={notice.id} 
                className={`bg-white p-8 rounded-2xl border ${notice.isImportant ? 'border-red-200 ring-1 ring-red-50/50' : 'border-slate-200'} shadow-sm group hover:shadow-md transition-all`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tight">
                      {new Date(notice.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {notice.isImportant && (
                      <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-full shadow-sm animate-pulse">
                        IMPORTANT
                      </span>
                    )}
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${notice.isImportant ? 'text-red-700' : 'text-slate-800'}`}>
                  {notice.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {notice.description}
                </p>
                {notice.link && (
                  <a 
                    href={notice.link}
                    className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all underline decoration-emerald-200 underline-offset-4"
                  >
                    View Attached Resource <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
                  </a>
                )}
              </div>
            ))}
            
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-500 text-lg">No notices found matching your query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
