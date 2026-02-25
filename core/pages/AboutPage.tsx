
import React from 'react';
import { Link } from 'react-router-dom';
import { AboutState } from '../types';

interface AboutPageProps {
  content: AboutState;
  siteName: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ content, siteName }) => {
  if (!content) return null;

  const {
    beginning = { label: 'Genesis', title: 'Our Story', story: '', image: '' },
    learning = { label: 'Method', title: 'How we teach', description: '', image1: '', image2: '', caption1: '', caption2: '' },
    founder = { label: 'Leadership', title: 'Our Founder', name: '', role: '', bio: '', image: '', quote: '' },
    faculty = { label: 'Faculty', title: 'Mentors', description: '', members: [] },
    vision = { label: 'DNA', title: 'Vision', content: '', values: [], image: '' },
    achievements = { label: 'Proof', title: 'Milestones', image: '', stats: [], ctaLabel: 'Learn More' },
    extraChapters = []
  } = content;

  return (
    <div className="bg-white overflow-hidden font-sans">
      {/* Bright Header Section */}
      <section className="bg-slate-50 py-32 text-slate-900 relative overflow-hidden text-center border-b border-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">{beginning.label}</span>
          <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none">{beginning.title}</h1>
          <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
            {beginning.story}
          </p>
        </div>
      </section>

      {/* Chapter 1: Visual Narrative */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
           <div className="relative group max-w-6xl mx-auto">
              <div className="absolute -inset-4 bg-emerald-50 rounded-[3.5rem] -z-10 transform rotate-1 group-hover:rotate-0 transition-transform duration-700"></div>
              {beginning.image && (
                <img 
                  src={beginning.image} 
                  alt="Genesis" 
                  className="w-full h-[400px] md:h-[600px] object-cover rounded-[3rem] shadow-2xl"
                />
              )}
           </div>
        </div>
      </section>

      {/* Chapter 2: Methodology */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{learning.label}</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{learning.title}</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">{learning.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group relative">
               {learning.image1 && <img src={learning.image1} className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-xl group-hover:scale-[1.02] transition-transform duration-700" alt="" />}
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Snapshot</p>
                 <p className="text-slate-900 font-bold">{learning.caption1}</p>
               </div>
            </div>
            <div className="group relative">
               {learning.image2 && <img src={learning.image2} className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-xl group-hover:scale-[1.02] transition-transform duration-700" alt="" />}
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Environment</p>
                 <p className="text-slate-900 font-bold">{learning.caption2}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
             <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
                <div className="lg:w-1/2 shrink-0">
                   <div className="relative group">
                      <div className="absolute -inset-4 bg-emerald-600/5 rounded-[4rem] group-hover:scale-105 transition-transform duration-700"></div>
                      <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-4xl border-8 border-white">
                         <img 
                           src={founder.image || 'https://i.pravatar.cc/600?u=founder'} 
                           alt={founder.name} 
                           className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                         />
                      </div>
                      {/* Floating Badge */}
                      <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-6 rounded-3xl shadow-3xl border border-slate-800 animate-fade-in-up">
                         <i className="fa-solid fa-quote-left text-emerald-500 text-2xl mb-2 block"></i>
                         <p className="text-xs italic font-medium leading-relaxed max-w-[180px]">
                           "{founder.quote}"
                         </p>
                      </div>
                   </div>
                </div>

                <div className="lg:w-1/2 space-y-8">
                   <div>
                      <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{founder.label}</span>
                      <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-4">{founder.title}</h2>
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900">{founder.name}</span>
                        <span className="text-emerald-600 font-black uppercase text-xs tracking-widest mt-1">{founder.role}</span>
                      </div>
                   </div>

                   <div className="w-16 h-1.5 bg-emerald-500 rounded-full"></div>

                   <div className="space-y-6">
                      <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line">
                         {founder.bio}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Faculty & Mentors */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{faculty.label}</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{faculty.title}</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">{faculty.description}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {(Array.isArray(faculty.members) ? faculty.members : Object.values(faculty.members || {})).map((member) => (
              <div key={member.id} className="group flex flex-col items-center text-center p-8 bg-white rounded-[3rem] border border-slate-100 hover:border-emerald-200 hover:shadow-4xl transition-all duration-500">
                <div className="relative w-40 h-40 mb-8">
                  <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
                  <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden border-4 border-white shadow-2xl">
                    <img 
                      src={member.image || 'https://i.pravatar.cc/150?u=' + member.id} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{member.name}</h3>
                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-6">{member.role}</p>
                <div className="h-px w-12 bg-slate-200 mb-6 mx-auto group-hover:w-24 group-hover:bg-emerald-200 transition-all duration-500"></div>
                <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 4: Vision & Values */}
      <section className="py-24 bg-emerald-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="text-emerald-100 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{vision.label}</span>
            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter leading-none">{vision.title}</h2>
            <p className="text-emerald-50 text-xl font-medium leading-relaxed mb-12">{vision.content}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(vision.values || []).map((v, idx) => (
                <div key={idx} className="flex items-center gap-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 group hover:bg-white/20 transition-all">
                  <div className="w-10 h-10 bg-white text-emerald-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 5: Achievements */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
               <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{achievements.label}</span>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tight">{achievements.title}</h2>
               <div className="space-y-12">
                 {(achievements.stats || []).map((stat) => (
                   <div key={stat.id} className="flex items-end gap-6 group">
                     <span className="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter group-hover:text-emerald-600 transition-colors">{stat.value}</span>
                     <div className="pb-1">
                        <div className="h-px w-12 bg-slate-200 mb-2"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</span>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-16">
                 <Link to="/academics" className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-3xl active:scale-95 text-[11px] uppercase tracking-widest">
                   {achievements.ctaLabel || 'Apply Now'} <i className="fa-solid fa-arrow-right"></i>
                 </Link>
               </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                 <div className="absolute -inset-10 bg-emerald-600/5 rounded-full blur-3xl"></div>
                 {achievements.image && <img src={achievements.image} className="w-full h-[500px] object-cover rounded-[3rem] shadow-3xl relative z-10 border border-slate-100" alt="Milestones" />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
