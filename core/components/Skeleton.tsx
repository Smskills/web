
import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={`animate-pulse bg-slate-200 rounded-2xl ${className}`}
          style={{ animationDuration: '1.5s' }}
        />
      ))}
    </>
  );
};

// Fix: Updated CardSkeleton to accept an optional 'count' prop to allow rendering multiple skeletons as used in CoursesPage.tsx
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 h-full flex flex-col">
        <Skeleton className="h-48 w-full mb-6 rounded-3xl" />
        <Skeleton className="h-4 w-1/4 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-8" />
        <Skeleton className="h-12 w-full mt-auto rounded-xl" />
      </div>
    ))}
  </>
);
