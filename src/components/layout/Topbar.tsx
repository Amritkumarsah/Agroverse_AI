import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';
import { Toast } from '../ui/Toast';
import { FarmManagementModal } from '../dashboard/FarmManagementModal';
import { SettingsModal } from '../dashboard/SettingsModal';
import { AuthModal } from '../dashboard/AuthModal';
import { CalendarModal } from '../dashboard/CalendarModal';
import { ModeSwitcher } from './ModeSwitcher';
import { getTodayDateString } from '../../utils/dateUtils';
import { reverseGeocodeCity } from '../../utils/geoUtils';
import { 
  Bell, 
  Globe, 
  Sparkles, 
  MapPin, 
  Mic, 
  ChevronDown, 
  X, 
  Search, 
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Moon,
  Sun,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

interface TopbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  onToggleMobileSidebar,
  isMobileSidebarOpen 
}) => {
  const { 
    language, 
    setLanguage, 
    alerts,
    markAlertRead,
    markAllAlertsRead,
    setCurrentView,
    farms,
    selectedFarmId,
    setSelectedFarmId,
    selectedFarm,
    role,
    setRole,
    toast,
    hideToast,
    showToast,
    addNewFarm,
    editExistingFarm,
    deleteExistingFarm,
    weatherSource,
    theme,
    toggleTheme,
    currentUser,
    logout
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedObservationDate, setSelectedObservationDate] = useState(getTodayDateString());
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [editingFarm, setEditingFarm] = useState<any>(null);

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = farms.find(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.crop.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match) {
      setSelectedFarmId(match.id);
      setSearchQuery('');
    } else {
      showToast(`No farm matching "${searchQuery}"`, 'info');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-[#0a0f0d]/95 backdrop-blur-md border-b border-[#1e2e23] px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-2 text-left focus:outline-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base lg:text-lg tracking-tight bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                AGROVERSE AI
              </span>
            </div>
          </button>

          {/* Search Farms Input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farms, crops..."
              className="bg-[#111a14] border border-[#23362a] focus:border-emerald-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 w-44 lg:w-56 focus:outline-none transition-all"
            />
          </form>
        </div>

        {/* Center / Spacer */}
        <div className="flex-1" />

        {/* Right Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Observation Date & Weather Source Badge */}
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="hidden xl:flex items-center space-x-1.5 bg-[#131e17] hover:bg-[#1a2b20] border border-[#23362a] text-gray-300 text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer group"
            title="Click to open Crop Telemetry Observation Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-[11px] font-bold text-white">{selectedObservationDate}</span>
            <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-emerald-400 transition-colors" />
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              weatherSource === 'live' 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {weatherSource === 'live' ? 'Live Open-Meteo' : 'Demo Weather'}
            </span>
          </button>

          {/* Multilingual Selector */}
          <div className="flex items-center space-x-1.5 bg-[#131e17] border border-[#23362a] rounded-xl px-2.5 py-1.5 text-xs">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-gray-200 font-semibold focus:outline-none text-xs cursor-pointer"
            >
              <option value="en" className="bg-[#131e17] text-white">English</option>
              <option value="hi" className="bg-[#131e17] text-white">हिंदी (Hindi)</option>
              <option value="ta" className="bg-[#131e17] text-white">தமிழ் (Tamil)</option>
              <option value="te" className="bg-[#131e17] text-white">తెలుగు (Telugu)</option>
              <option value="bn" className="bg-[#131e17] text-white">বাংলা (Bengali)</option>
              <option value="mr" className="bg-[#131e17] text-white">मराठी (Marathi)</option>
              <option value="ne" className="bg-[#131e17] text-white">नेपाली (Nepali)</option>
            </select>
          </div>

          {/* Voice Input Button */}
          <button
            onClick={() => setCurrentView('agrogpt')}
            className="p-2 rounded-lg bg-[#131e17] border border-[#23362a] text-emerald-400 hover:bg-[#1a2b20] transition-colors relative"
            title="Voice Agriculture Assistant"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => toggleTheme()}
            className="p-2 rounded-lg bg-[#131e17] border border-[#23362a] text-gray-300 hover:text-white transition-colors relative"
            title={`Toggle Theme (Current: ${theme})`}
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className="p-2 rounded-lg bg-[#131e17] border border-[#23362a] text-gray-300 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Alerts Dropdown */}
            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-[#131e17] border border-[#23362a] rounded-xl shadow-2xl z-50 p-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#23362a]">
                  <span className="font-semibold text-xs text-white">Active Farm Alerts ({alerts.length})</span>
                  <div className="flex items-center space-x-2 text-[11px]">
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          markAllAlertsRead();
                          showToast('All notifications marked as read', 'info');
                        }}
                        className="text-emerald-400 hover:underline font-bold"
                      >
                        Mark All Read
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setCurrentView('alerts');
                        setShowAlertsDropdown(false);
                      }}
                      className="text-gray-400 hover:text-white hover:underline"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {alerts.slice(0, 4).map((alt) => (
                    <div 
                      key={alt.id} 
                      onClick={() => {
                        markAlertRead(alt.id);
                        if (alt.actionUrl) setCurrentView(alt.actionUrl);
                        setShowAlertsDropdown(false);
                      }}
                      className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                        alt.severity === 'critical' 
                          ? 'bg-red-950/40 border-red-800/60 text-red-200 hover:bg-red-900/40' 
                          : 'bg-[#18261e] border-[#294233] text-gray-200 hover:bg-[#203328]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>{alt.title}</span>
                          {!alt.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          )}
                        </div>
                        {!alt.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAlertRead(alt.id);
                              showToast(`Alert "${alt.title}" marked as read`, 'info');
                            }}
                            className="text-[10px] text-emerald-400 hover:underline font-bold"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                      <div className="text-[11px] opacity-80 mt-0.5 line-clamp-2">{alt.message}</div>
                      <div className="text-[9px] text-gray-400 mt-1">{alt.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Unified Profile & Active Farm Hub Dropdown */}
          <div className="relative pl-1">
            {currentUser === null ? (
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 bg-[#111a14] hover:bg-[#18261e] border border-[#23362a] hover:border-emerald-500/50 rounded-2xl p-1.5 pr-3 transition-all shadow-md group cursor-pointer"
                title="Profile, Farm Selector & Settings"
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.photoURL || selectedFarm.avatarUrl}
                    alt={currentUser.displayName || selectedFarm.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 group-hover:border-emerald-400 transition-colors shadow-sm"
                  />
                  {weatherSource === 'live' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-pulse" title="Live Weather Stream Active" />
                  )}
                </div>

                <div className="text-left text-xs hidden sm:block">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="truncate max-w-[130px]">{currentUser.displayName || selectedFarm.name}</span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-extrabold uppercase">
                      {role}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0 inline" />
                    <span className="truncate max-w-[140px]">{selectedFarm.location}</span>
                  </div>
                </div>

                <ChevronDown className="w-4 h-4 text-emerald-400 shrink-0 ml-0.5" />
              </button>
            )}

            {showProfileDropdown && currentUser !== null && (
              <div className={`absolute right-0 mt-2 w-80 rounded-3xl shadow-2xl z-50 p-4 animate-fadeIn text-xs space-y-4 border ${
                theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#111a14] border-[#23362a] text-white'
              }`}>
                {/* Signed-In User Profile Card — shows ONLY login info */}
                <div className={`border p-4 rounded-2xl space-y-3 ${
                  theme === 'light' ? 'bg-emerald-50/50 border-emerald-300/60 text-slate-900' : 'bg-[#18261e] border-emerald-500/50 text-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={currentUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                        alt={currentUser.displayName || 'User'}
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" title="Online" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-extrabold text-sm truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        {currentUser.displayName || currentUser.email?.split('@')[0] || 'Farmer'}
                      </div>
                      <div className={`text-[10px] truncate mt-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                        {currentUser.email || 'demo@agrinexsus.ai'}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className={`text-[9px] font-extrabold border px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          theme === 'light' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}>
                          👨‍🌾 {currentUser.role || 'Farmer'}
                        </span>
                        {currentUser.emailVerified && (
                          <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${
                            theme === 'light' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-950/50 text-blue-300 border-blue-800/50'
                          }`}>
                            ✅ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Farm Parcels (ONLY shown if other farms exist) */}
                {farms.filter(f => f.id !== selectedFarmId).length > 0 && (
                  <div className="space-y-2">
                    <span className={`text-[10px] uppercase font-extrabold tracking-wider px-1 ${
                      theme === 'light' ? 'text-slate-500' : 'text-gray-400'
                    }`}>Switch To Other Farm</span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                      {farms.filter(f => f.id !== selectedFarmId).map((f) => (
                        <div
                          key={f.id}
                          className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors border ${
                            theme === 'light' 
                              ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50/80 shadow-sm' 
                              : 'bg-[#18261e] border-[#23362a] text-gray-300 hover:bg-[#1a2b20]'
                          }`}
                        >
                          <button
                            onClick={() => {
                              setSelectedFarmId(f.id);
                              setShowProfileDropdown(false);
                            }}
                            className="flex items-center space-x-2.5 flex-1 text-left min-w-0"
                          >
                            <img src={f.avatarUrl} alt={f.name} className="w-8 h-8 rounded-full object-cover border border-emerald-500/40 shrink-0" />
                            <div className="flex-1 text-xs min-w-0">
                              <div className="font-bold flex items-center justify-between">
                                <span className={`truncate ${theme === 'light' ? 'text-slate-900 font-extrabold' : 'text-white'}`}>{f.name}</span>
                                <span className="text-[10px] text-emerald-600 font-extrabold shrink-0 ml-1 font-mono">{f.farmSizeHectares} Ha</span>
                              </div>
                              <div className={`text-[10px] truncate ${theme === 'light' ? 'text-slate-600 font-medium' : 'text-gray-400'}`}>{f.location}</div>
                              <div className={`text-[10px] font-bold truncate ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300/80'}`}>{f.crop}</div>
                            </div>
                          </button>

                          <div className="flex items-center space-x-1 shrink-0 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingFarm(f);
                                setShowProfileDropdown(false);
                              }}
                              className={`p-1 rounded transition-colors ${
                                theme === 'light' ? 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200' : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/50'
                              }`}
                              title="Edit Farm Profile & Photo"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {farms.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteExistingFarm(f.id);
                                }}
                                className={`p-1 rounded transition-colors ${
                                  theme === 'light' ? 'text-slate-600 hover:text-red-700 hover:bg-red-100' : 'text-gray-400 hover:text-red-400 hover:bg-red-950/50'
                                }`}
                                title="Delete Farm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logout Option Only */}
                <div className={`pt-1 border-t ${theme === 'light' ? 'border-slate-200' : 'border-[#23362a]'}`}>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                      setAuthTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border flex items-center justify-between transition-colors font-bold ${
                      theme === 'light' 
                        ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700 shadow-sm' 
                        : 'bg-red-950/40 hover:bg-red-900/60 border-red-800/40 text-red-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className={`w-4 h-4 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />
                      <span className={theme === 'light' ? 'text-red-700 font-extrabold' : 'text-red-400'}>Logout of Session</span>
                    </div>
                    <span className={`text-[10px] font-bold ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>Exit &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal (Sign In / Register) */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authTab}
        />
      )}

      {/* Profile Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {/* Add New Farm Modal */}
      {isAddModalOpen && (
        <FarmManagementModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(farmData) => addNewFarm(farmData)}
        />
      )}

      {/* Crop Telemetry Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedObservationDate}
        onSelectDate={(dateStr) => setSelectedObservationDate(dateStr)}
      />

      {/* Edit Farm Modal */}
      {editingFarm && (
        <FarmManagementModal
          isOpen={!!editingFarm}
          onClose={() => setEditingFarm(null)}
          initialFarm={editingFarm}
          onSave={(farmData) => editExistingFarm(editingFarm.id, farmData)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      )}
    </>
  );
};
