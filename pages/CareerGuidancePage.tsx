import React from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../types.ts';

interface CareerGuidancePageProps {
  data: AppState['career'];
}

const CareerGuidancePage: React.FC<CareerGuidancePageProps> = ({ data }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <section 
        className="py-32 text-white relative overflow-hidden bg-emerald-600 flex items-center min-h-[400px]"
        style={data.hero.bgImage ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${data.hero.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {!data.hero.bgImage && <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-emerald-100 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Success Roadmap</span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">{data.hero.title}</h1>
          <p className="text-emerald-50 font-medium max-w-2xl mx-auto text-lg drop-shadow-md">
            {data.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {data.services.map((service) => (
            <div key={service.id} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all group flex flex-col items-start">
              <div className="w-full aspect-video rounded-[1.5rem] overflow-hidden mb-8 border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    <i className={`fa-solid ${service.icon || 'fa-star'}`}></i>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium mb-4">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Action Block */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full"></div>
          <h2 className="text-3xl md:text-5xl font-black mb-8 relative z-10">{data.cta.title}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg relative z-10">
            {data.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/enroll" className="px-12 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">
              Book a Consultation
            </Link>
            <Link to="/contact" className="px-12 py-5 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-xs uppercase tracking-widest">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidancePage;