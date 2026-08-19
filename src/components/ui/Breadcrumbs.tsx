import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

interface BreadcrumbsProps {
  items: { label: string; view?: AppView }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { setCurrentView } = useApp();

  return (
    <nav className="flex items-center space-x-2 text-xs text-gray-400 mb-4 overflow-x-auto whitespace-nowrap py-1">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />}
          {item.view ? (
            <button
              onClick={() => setCurrentView(item.view!)}
              className="hover:text-emerald-400 transition-colors font-medium text-gray-300"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-emerald-400">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
