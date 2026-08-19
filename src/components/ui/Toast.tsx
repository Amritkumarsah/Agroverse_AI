import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'success',
  message,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-400 shrink-0" />
  };

  const borderStyles = {
    success: 'border-emerald-500/50 bg-[#112217]',
    error: 'border-red-500/50 bg-[#241113]',
    info: 'border-amber-500/50 bg-[#241d11]'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-2xl ${borderStyles[type]} text-white text-xs font-medium max-w-md animate-slideUp`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
