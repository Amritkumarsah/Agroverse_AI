import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { 
  LayoutDashboard, 
  Satellite, 
  CloudSun, 
  FlaskConical, 
  Wheat, 
  Bug, 
  Leaf, 
  Bot, 
  Globe2, 
  ShieldAlert, 
  Box, 
  Sliders, 
  CalendarCheck, 
  Bell, 
  Sparkles,
  Home,
  TrendingUp,
  DollarSign,
  Lock,
  Trophy
} from 'lucide-react';

import { t } from '../../data/translations';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  category: 'dashboard' | 'global';
}

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, alerts, role, healthBreakdown, satelliteData, language } = useApp();
  const unreadAlerts = alerts.filter(a => !a.read).length;
  const currentNdvi = satelliteData[0]?.ndvi || 0.71;

  const dashboardItems: NavItem[] = [
    { id: 'overview', label: t(language, 'farmDashboard', 'Farm Dashboard'), icon: <LayoutDashboard className="w-4 h-4" />, category: 'dashboard' },
    { id: 'yield-forecast', label: t(language, 'yieldForecast', '🌾 Yield Forecast'), icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, badge: 'AI Predict', category: 'dashboard' },
    { id: 'crop-economics', label: t(language, 'cropEconomics', '💰 Crop Economics'), icon: <DollarSign className="w-4 h-4 text-amber-400" />, badge: 'ROI Net', category: 'dashboard' },
    { id: 'data-consent', label: t(language, 'dataConsent', '🔐 My Data & Consent'), icon: <Lock className="w-4 h-4 text-teal-400" />, badge: 'FAIR DPG', category: 'dashboard' },
    { id: 'satellite', label: t(language, 'satelliteIntel', 'Satellite Intelligence'), icon: <Satellite className="w-4 h-4" />, badge: `NDVI ${currentNdvi}`, category: 'dashboard' },
    { id: 'soil', label: t(language, 'soilHealth', 'Soil Health & Carbon'), icon: <FlaskConical className="w-4 h-4" />, category: 'dashboard' },
    { id: 'weather', label: t(language, 'weatherForecast', 'Weather & Impact'), icon: <CloudSun className="w-4 h-4" />, category: 'dashboard' },
    { id: 'advisor', label: t(language, 'cropAdvisor', 'Crop Advisor'), icon: <Wheat className="w-4 h-4" />, category: 'dashboard' },
    { id: 'disease', label: 'Disease AI Doctor', icon: <Bug className="w-4 h-4" />, badge: 'Vision AI', category: 'dashboard' },
    { id: 'agrogpt', label: t(language, 'aiAssistant', 'AI Assistant (AgroGPT)'), icon: <Bot className="w-4 h-4" />, category: 'dashboard' },
    { id: 'alerts', label: t(language, 'alerts', 'Alert Center'), icon: <Bell className="w-4 h-4" />, badge: unreadAlerts > 0 ? `${unreadAlerts} New` : undefined, category: 'dashboard' },
  ];

  const globalItems: NavItem[] = [
    { id: 'brics-network', label: t(language, 'bricsNetwork', 'BRICS Global Network'), icon: <Globe2 className="w-4 h-4" />, badge: '5 Nations', category: 'global' },
    { id: 'authority', label: t(language, 'nationalMonitor', 'National Crop Risk Monitor'), icon: <ShieldAlert className="w-4 h-4" />, category: 'global' },
  ];

  const renderNavGroup = (items: NavItem[]) => (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-xs transition-all ${
              isActive 
                ? 'bg-gradient-to-r from-emerald-700/80 to-teal-800/80 text-white shadow-md shadow-emerald-950/60 border border-emerald-500/50 font-bold' 
                : 'text-gray-300 hover:bg-[#131e17] hover:text-emerald-400 font-medium'
            }`}
          >
            <div className="flex items-start space-x-2.5 text-left flex-1 min-w-0 pr-1">
              <span className={`shrink-0 mt-0.5 ${isActive ? 'text-white' : item.category === 'global' ? 'text-amber-500' : 'text-emerald-500'}`}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0 text-left">
                <span className="block text-left text-[11px] font-semibold leading-tight break-words">{item.label}</span>
              </div>
            </div>
            {item.badge && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ml-1.5 text-center ${
                item.badge.includes('New') 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full select-none overflow-y-auto w-64 bg-[#0d1410] border-r border-[#1e2e23]">


      {/* Navigation Groups */}
      <div className="p-3 space-y-4 flex-1">
        <div>
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-500/80 mb-1">
            FARM DASHBOARD
          </div>
          {renderNavGroup(dashboardItems)}
        </div>

        <div>
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-500/80 mb-1">
            GLOBAL DPI NETWORK
          </div>
          {renderNavGroup(globalItems)}
        </div>
      </div>

      {/* Bottom Health Score Summary */}
      <div className="p-3 border-t border-[#1e2e23] bg-[#09100c]">
        <div className="bg-[#111a14] border border-[#23362a] rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-extrabold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farm Health: {healthBreakdown.overallScore}/100</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Dynamic soil, weather & satellite score
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Permanent Desktop Sidebar Column (w-64 = 256px) */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sliding Navigation Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fadeIn">
          <div 
            onClick={onCloseMobile} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
          />
          <aside className="relative w-72 h-full shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
