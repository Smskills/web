
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Course, PageMeta } from '../types.ts';
import { CardSkeleton } from '../components/Skeleton.tsx';
import FilterBar from './Courses/FilterBar.tsx';
import CourseCard from './Courses/CourseCard.tsx';
import CourseModal from './Courses/CourseModal.tsx';

interface CoursesPageProps {
  coursesState: {
    list: Course[];
    pageMeta: PageMeta;
  };
  isLoading?: boolean;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ coursesState, isLoading = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const currentLevel = searchParams.get('level') || 'All';
  const currentIndustry = searchParams.get('industry') || 'All';
  
  const { list, pageMeta } = useMemo(() => {
    if (!coursesState) return { list: [], pageMeta: { title: 'Technical Programs', subtitle: '', tagline: 'PROFESSIONAL CURRICULA' } };
    return {
      list: Array.isArray(coursesState.list) ? coursesState.list : [],
      pageMeta: coursesState.pageMeta || { title: 'Technical Programs', subtitle: '', tagline: 'PROFESSIONAL CURRICULA' }
    };
  }, [coursesState]);

  // Priority order for academic levels as requested
  const tierPriority = [
    "Certificate (NSDC)", 
    "UG Certificate (NSDC)", 
    "UG Diploma (NSDC)", 
    "UG Degree", 
    "Master",
    "ITEP",
    "Short Term"
  ];

  // Labels for the filter buttons
  const academicLevels = ["All", ...tierPriority.filter(lvl => lvl !== "ITEP" && lvl !== "Short Term")];
  
  const sectors = useMemo<string[]>(() => {
    const baseSet = new Set<string>();
    list.forEach(c => {
      if (c && c.industry) baseSet.add(c.industry);
    });
    return ["All", ...Array.from(baseSet).sort()];
  }, [list]);

  const filteredCourses = useMemo(() => {
    return list
      .filter(c => {
        if (!c) return false;
        const levelMatch = currentLevel === 'All' || c.academicLevel === currentLevel;
        const industryMatch = currentIndustry === 'All' || c.industry === currentIndustry;
        return levelMatch && industryMatch && c.status === 'Active';
      })
      .sort((a, b) => {
        // 1. Primary Sort: Academic Tier Priority
        const priorityA = tierPriority.indexOf(a.academicLevel);
        const priorityB = tierPriority.indexOf(b.academicLevel);
        
        const scoreA = priorityA === -1 ? 999 : priorityA;
        const scoreB = priorityB === -1 ? 999 : priorityB;

        if (scoreA !== scoreB) {
          return scoreA - scoreB;
        }

        // 2. Secondary Sort: Course Name (A-Z)
        return (a.name || "").localeCompare(b.name || "");
      });
  }, [list, currentLevel, currentIndustry]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLevel, currentIndustry]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Page Header */}
      <section className="bg-slate-900 pt-32 pb-16 text-white relative overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] mb-3 block animate-fade-in">
            {pageMeta.tagline || 'PROFESSIONAL CURRICULA'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none animate-fade-in-up">
            {pageMeta.title || 'Technical Programs'}
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            {pageMeta.subtitle || 'Browse industry-verified technical tracks optimized for global employability.'}
          </p>
        </div>
      </section>

      <FilterBar 
        academicLevels={academicLevels}
        currentLevel={currentLevel}
        currentIndustry={currentIndustry}
        sectors={sectors}
        onLevelChange={(lvl) => setSearchParams({ level: lvl, industry: currentIndustry })}
        onIndustryChange={(ind) => setSearchParams({ level: currentLevel, industry: ind })}
      />

      {/* Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <CardSkeleton count={6} />
          ) : (
            filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onSelect={setSelectedCourse} 
              />
            ))
          )}
        </div>
        
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-200 max-w-2xl mx-auto">
             <i className="fa-solid fa-folder-open text-6xl text-slate-100 mb-6 block"></i>
             <p className="text-slate-400 font-black uppercase tracking-widest">No matching programs found.</p>
          </div>
        )}
      </div>

      {selectedCourse && (
        <CourseModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)} 
        />
      )}
      
      <style>{`
        .scale-in-center { animation: scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center { 
          0% { transform: scale(0.97); opacity: 0; } 
          100% { transform: scale(1); opacity: 1; } 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CoursesPage;
