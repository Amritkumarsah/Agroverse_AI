import React from 'react';
import { Inbox, LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#111a14] border border-[#23362a] rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-[#18261e] border border-[#294233] flex items-center justify-center text-emerald-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-gray-400 max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
