import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#111a14] border border-[#23362a] rounded-2xl overflow-hidden shadow-xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {(title || action) && (
        <div className={`px-5 py-4 border-b border-[#1e2e23] flex items-center justify-between bg-[#0d1510] ${headerClassName}`}>
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
