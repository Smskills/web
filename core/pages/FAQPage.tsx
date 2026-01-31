
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppState, SiteConfig, FAQItem } from '../types.ts';
import { INITIAL_CONTENT } from '../data/defaultContent.ts';

interface FAQPageProps {
  faqsState: AppState['faqs'];
  contact: SiteConfig['contact'];
}

const FAQPage: React.FC<FAQPageProps> = ({ faqsState, contact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // DATA RESILIENCE LAYER
  const list = useMemo((): FAQItem[] => {
    if (Array.isArray(faqsState)) return faqsState;
    if (faqsState && Array.isArray(faqsState.list)) return faqsState.list;
    return INITIAL_CONTENT.faqs.list;
  }, [faqsState]);

  const meta = useMemo(() => {
    if (Array.isArray(faqsState) || !faqsState) return INITIAL_CONTENT.faqs.pageMeta;
    return faqsState.pageMeta || INITIAL_CONTENT.faqs.pageMeta;
  }, [faqsState]);

  const toggleItem = (id: string) => {
    const next = new Set(openItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenItems(next);
  };

  const filteredFaqs = list.filter(faq => {
    const s = searchTerm.toLowerCase();
    return (
      (faq.question || '').toLowerCase().includes(s) ||
      (faq.answer || '').toLowerCase().includes(s) ||
      (faq.category || '').toLowerCase().includes(s)
    );
  });

  const categories = Array.from(new Set(list.map(f => f.category || 'General')));
  const sanitizedPhone = (contact.phone || '').replace(/[^\d+]/g, '');

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
            {meta.tagline || 'Institutional Assistance'}
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
            {meta.title || 'Help Center'}
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
            {meta.subtitle || 'Find answers to common questions about enrollment, curriculum, and placement services.'}
          </p>
          
          <div className="mt-12 max-w-2xl mx-auto relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
            <input 
              type="text"
              placeholder="Search help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all text-lg font-medium shadow-2xl"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 max-w-4xl">
        {categories.length > 0 ? (
          categories.map(category => {
            const categoryFaqs = filteredFaqs.filter(f => (f.category || 'General') === category);
            if (categoryFaqs.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.4em] mb-8 ml-4">{category}</h2>
                <div className="space-y-4">
                  {categoryFaqs.map(faq => {
                    const isOpen = openItems.has(faq.id);
                    return (
                      <div key={faq.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-xl">
                        <button 
                          onClick={() => toggleItem(faq.id)}
                          className="w-full flex items-center justify-between p-8 text-left focus:outline-none group"
                        >
                          <span className="text-lg md:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors pr-8 leading-tight">
                            {faq.question}
                          </span>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isOpen ? 'bg-emerald-600 text-white rotate-45 shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50'}`}>
                            <i className="fa-solid fa-plus"></i>
                          </div>
                        </button>
                        
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] border-t border-slate-50' : 'max-h-0'}`}>
                          <div className="p-8 md:p-10 text-slate-600 font-medium leading-relaxed text-lg">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <i className="fa-solid fa-circle-question text-6xl text-slate-100 mb-6 block"></i>
            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Help Database Empty</h3>
          </div>
        )}

        <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform pointer-events-none"></div>
          <h3 className="text-3xl font-black mb-4 relative z-10">Still have questions?</h3>
          <p className="text-slate-400 mb-10 relative z-10 text-lg">Our admissions team is available for one-on-one consultations.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
            <Link 
              to="/contact" 
              className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-emerald-500 hover:text-white transition-all text-xs uppercase tracking-widest flex items-center justify-center min-w-[200px]"
            >
              Contact Support
            </Link>
            {sanitizedPhone && (
              <a 
                href={`tel:${sanitizedPhone}`} 
                className="px-10 py-5 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-xs uppercase tracking-widest border border-white/10 flex items-center justify-center min-w-[200px]"
              >
                Call Help Desk
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
