import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  iconColor?: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-emerald-400',
  badge,
  onClick,
  className = ''
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#111a14] border border-[#23362a] rounded-xl p-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-emerald-500/50 hover:bg-[#15221b] hover:shadow-lg hover:shadow-emerald-950/30' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">{title}</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{value}</span>
            {change && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                changeType === 'positive' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                changeType === 'negative' ? 'bg-red-950/80 text-red-400 border border-red-800' :
                'bg-gray-800 text-gray-300'
              }`}>
                {change}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl bg-[#18261e] border border-[#294233] ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 pt-2.5 border-t border-[#1e2e23] flex items-center justify-between text-xs text-gray-400">
          <span>{subtitle}</span>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
