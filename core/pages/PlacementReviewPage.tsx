import React from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../types.ts';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface PlacementReviewPageProps {
  placements: AppState['placements'];
  label?: string;
}

const PlacementReviewPage: React.FC<PlacementReviewPageProps> = ({ placements, label = "Placement" }) => {
  const { stats, reviews, pageDescription } = placements;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Proven Outcomes</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">{label} Reviews</h1>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">{pageDescription}</p>
        </div>
      </section>

      <PageStateGuard isEmpty={!stats || stats.length === 0}>
        <section className="py-12 -mt-16 relative z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 text-center hover:bg-emerald-600 hover:text-white transition-all duration-500 group">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 group-hover:text-white">
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PageStateGuard>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <PageStateGuard 
            isEmpty={!reviews || reviews.length === 0}
            emptyFallback={(
              <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-black uppercase tracking-widest">No student reviews available yet.</p>
              </div>
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative group hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                      <img src={review.image} className="w-full h-full object-cover" alt={review.name} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{review.name}</h4>
                      <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">{review.course}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">"{review.text}"</p>
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">{review.company}</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">{review.salaryIncrease}</span>
                  </div>
                </div>
              ))}
            </div>
          </PageStateGuard>
        </div>
      </section>
    </div>
  );
};

export default PlacementReviewPage;