
import React from 'react';

interface AboutPageProps {
  content: {
    intro: string;
    mission: string;
    vision: string;
    timeline: Array<{ year: string; event: string; }>;
  };
  siteName: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ content, siteName }) => {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-6">About Our Institute</h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
            {content.intro}
          </p>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-emerald-600 p-10 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
              <i className="fa-solid fa-bullseye text-4xl mb-6"></i>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-emerald-50 leading-relaxed text-lg">{content.mission}</p>
            </div>
            <div className="bg-slate-900 p-10 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-110 transition-transform"></div>
              <i className="fa-solid fa-eye text-4xl mb-6"></i>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-slate-300 leading-relaxed text-lg">{content.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Journey of Excellence</h2>
            <div className="w-20 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {content.timeline.map((item, idx) => (
              <div key={idx} className="flex gap-6 mb-8 group">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white border-2 border-emerald-600 rounded-full flex items-center justify-center font-bold text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    {item.year}
                  </div>
                  {idx !== content.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                  )}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex-grow shadow-sm group-hover:shadow-md transition-all">
                  <p className="text-slate-700 font-medium text-lg">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
