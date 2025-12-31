
import React from 'react';
import { AppState } from '../types';

interface HomePageProps {
  content: AppState;
}

const HomePage: React.FC<HomePageProps> = ({ content }) => {
  const { home, courses, notices } = content;

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      {home.hero.visible && (
        <section 
          className="relative min-h-[80vh] flex items-center bg-cover bg-center text-white"
          style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${home.hero.bgImage})` }}
        >
          <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-md">
              {home.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              {home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={home.hero.ctaLink}
                className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-all shadow-xl hover:shadow-emerald-600/20"
              >
                {home.hero.ctaText}
              </a>
              <a 
                href="#/about"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-full hover:bg-white/20 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {home.highlights.map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices Board */}
      {home.sections.notices && notices.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2 block">Updates</span>
                <h2 className="text-3xl font-bold text-slate-800">Recent Notices</h2>
              </div>
              <a href="#/notices" className="text-emerald-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View All Announcements <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.slice(0, 3).map(notice => (
                <div key={notice.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">{new Date(notice.date).toLocaleDateString()}</span>
                    {notice.isImportant && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded flex items-center gap-1">
                        <i className="fa-solid fa-circle-exclamation"></i> URGENT
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">{notice.title}</h4>
                  <p className="text-sm text-slate-600 line-clamp-2">{notice.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses */}
      {home.sections.featuredCourses && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4 block">Our Curriculum</span>
              <h2 className="text-4xl font-extrabold text-slate-800 mb-6">Popular Professional Courses</h2>
              <p className="text-slate-500">Industry-aligned programs with a focus on practical skills and employability.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.filter(c => c.status === 'Active').slice(0, 3).map(course => (
                <div key={course.id} className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 bg-white hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-emerald-600">
                        {course.mode}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">{course.duration}</span>
                      <span className="text-lg font-bold text-emerald-600">{course.price || 'Contact Us'}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800">{course.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-grow">{course.description}</p>
                    <a 
                      href={`#/courses`}
                      className="w-full py-3 bg-slate-900 text-white text-center font-bold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Course Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Block */}
      <section className="py-20 bg-emerald-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8">Ready to Start Your Career Journey?</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-10 text-lg">
            Join thousands of successful students who have transformed their lives through our training.
          </p>
          <a href="#/contact" className="inline-block px-10 py-5 bg-white text-emerald-600 font-bold rounded-full hover:bg-slate-50 transition-all shadow-xl text-lg">
            Talk to an Advisor <i className="fa-solid fa-headset ml-2"></i>
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
