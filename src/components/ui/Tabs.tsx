import React from 'react';

interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-1 border-b border-[#1e2e23] pb-2 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#131e17]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
