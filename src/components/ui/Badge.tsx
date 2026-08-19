import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = ''
}) => {
  const styles = {
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800',
    danger: 'bg-red-950/80 text-red-400 border-red-800',
    info: 'bg-blue-950/80 text-blue-400 border-blue-800',
    default: 'bg-[#18261e] text-gray-300 border-[#294233]'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
