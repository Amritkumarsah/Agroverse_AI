import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-950/20 border border-red-800/40 rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-red-200 mb-1">{title}</h4>
      <p className="text-xs text-red-300/80 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
