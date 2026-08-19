import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-[#1a291f] rounded-lg ${className}`} />
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-48 bg-[#1a291f] rounded" />
      <div className="h-10 w-96 bg-[#1a291f] rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-28 bg-[#1a291f] rounded-xl" />
        <div className="h-28 bg-[#1a291f] rounded-xl" />
        <div className="h-28 bg-[#1a291f] rounded-xl" />
        <div className="h-28 bg-[#1a291f] rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-[#1a291f] rounded-2xl" />
        <div className="h-80 bg-[#1a291f] rounded-2xl" />
      </div>
    </div>
  );
};
