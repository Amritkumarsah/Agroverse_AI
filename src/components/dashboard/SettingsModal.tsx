import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  ShieldCheck, 
  Globe, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  Database
} from 'lucide-react';
import { LanguageCode } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedFarm, 
    role, 
    setRole, 
    theme, 
    toggleTheme, 
    setTheme, 
    language, 
    setLanguage, 
    logout, 
    setCurrentView,
    showToast 
  } = useApp();

  const handleLogout = () => {
    onClose();
    logout();
  };

  const handleOpenConsent = () => {
    onClose();
    setCurrentView('data-consent');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚙️ Profile Settings & Preferences"
    >
      <div className="space-y-6 text-xs font-sans py-1">
        {/* Profile Card Header */}
        <div className="bg-[#18261e] border border-[#294233] p-4 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <img 
              src={selectedFarm.avatarUrl} 
              alt={selectedFarm.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/60 shadow-lg" 
            />
            <div>
              <h3 className="text-sm font-black text-white">{selectedFarm.name}</h3>
              <p className="text-[11px] text-gray-300 flex items-center gap-1.5 mt-0.5">
                <span>📍 {selectedFarm.location}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{selectedFarm.crop}</span>
              </p>
            </div>
          </div>
          <Badge variant="success">{role.toUpperCase()}</Badge>
        </div>

        {/* 1. Theme & Appearance Section */}
        <div className="space-y-3">
          <div className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#23362a] pb-1.5">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>Appearance & Display Theme</span>
          </div>

          <div className="bg-[#18261e] border border-[#294233] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-xs">Color Mode</div>
                <div className="text-[11px] text-gray-300">Choose your preferred visual dashboard mode</div>
              </div>

              {/* Theme Toggle Buttons */}
              <div className="flex items-center bg-[#111a14] p-1 rounded-xl border border-[#23362a]">
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    theme === 'dark'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    theme === 'light'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-[#23362a] flex items-center justify-between text-[11px] text-gray-300">
              <span>Active Theme Mode:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                {theme === 'dark' ? '🌙 Dark Mode (Glassmorphism Emerald)' : '☀️ Light Mode (High-Contrast White/Green)'}
              </span>
            </div>
          </div>
        </div>




        {/* 3. Language & Privacy Link */}
        <div className="space-y-3">
          <div className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#23362a] pb-1.5">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Language & Data Privacy</span>
          </div>

          <div className="space-y-2">
            <div className="bg-[#18261e] border border-[#294233] p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-gray-200">System Language:</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-[#111a14] text-white border border-[#294233] font-bold text-xs rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ne">नेपाली (Nepali)</option>
              </select>
            </div>

            <button
              onClick={handleOpenConsent}
              className="w-full bg-[#18261e] hover:bg-[#1f3328] border border-[#294233] p-3 rounded-2xl flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Data Governance & Sovereign Privacy</div>
                  <div className="text-[10px] text-gray-400">Manage GPS location and soil telemetry sharing rules</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* 4. Logout & Session Management */}
        <div className="pt-3 border-t border-[#23362a] flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-300 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout of Session</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
