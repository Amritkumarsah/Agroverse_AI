import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Wheat, Camera, Mic, SlidersHorizontal, Bell } from 'lucide-react';
import { getTranslation } from '../../locales/i18n';

export const FarmerBottomNav: React.FC<{ onOpenCamera: () => void }> = ({ onOpenCamera }) => {
  const { currentView, setCurrentView, setAppMode, language, alerts } = useApp();

  const unreadCount = alerts.filter(a => !a.read).length;
  const isHindi = language === 'hi';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0f0d]/95 backdrop-blur-md border-t border-[#1e2e23] py-2 px-4 flex items-center justify-around font-sans">
      <button
        onClick={() => setCurrentView('overview')}
        className={`flex flex-col items-center space-y-1 text-[10px] font-bold transition-colors ${
          currentView === 'overview' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>{isHindi ? 'होम' : 'Home'}</span>
      </button>

      <button
        onClick={onOpenCamera}
        className="flex flex-col items-center space-y-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
      >
        <div className="p-1.5 rounded-full bg-amber-500/20 border border-amber-500/40">
          <Camera className="w-5 h-5 text-amber-400" />
        </div>
        <span>{isHindi ? 'फोटो जांच' : 'Check Crop'}</span>
      </button>

      <button
        onClick={() => setCurrentView('agrogpt')}
        className={`flex flex-col items-center space-y-1 text-[10px] font-bold transition-colors ${
          currentView === 'agrogpt' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
        }`}
      >
        <div className="p-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
          <Mic className="w-5 h-5 text-emerald-400" />
        </div>
        <span>{isHindi ? 'आवाज पूछें' : 'Ask AI'}</span>
      </button>

      <button
        onClick={() => setCurrentView('alerts')}
        className={`flex flex-col items-center space-y-1 text-[10px] font-bold relative transition-colors ${
          currentView === 'alerts' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Bell className="w-5 h-5" />
        <span>{isHindi ? 'अलर्ट' : 'Alerts'}</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setAppMode('expert')}
        className="flex flex-col items-center space-y-1 text-[10px] font-bold text-teal-400 hover:text-white transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>{isHindi ? 'एक्सपर्ट मोड' : 'Expert Mode'}</span>
      </button>
    </div>
  );
};
