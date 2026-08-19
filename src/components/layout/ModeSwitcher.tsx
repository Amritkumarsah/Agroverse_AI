import React from 'react';
import { useApp } from '../../context/AppContext';

export const ModeSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { appMode, setAppMode } = useApp();

  return (
    <div className={`inline-flex items-center bg-[#111a14] border border-[#23362a] rounded-xl p-1 shadow-md font-sans text-xs ${className}`}>
      <button
        onClick={() => setAppMode('farmer')}
        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
          appMode === 'farmer'
            ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-md shadow-emerald-950/50'
            : 'text-gray-400 hover:text-white hover:bg-[#1a2b20]'
        }`}
        title="Farmer Mode: Simplified, Voice-First, Local Language Guidance"
      >
        <span>👨🌾</span>
        <span>Farmer Mode</span>
      </button>

      <button
        onClick={() => setAppMode('expert')}
        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
          appMode === 'expert'
            ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md shadow-teal-950/50'
            : 'text-gray-400 hover:text-white hover:bg-[#1a2b20]'
        }`}
        title="Expert Mode: Full Satellite Analytics, NDVI Time-Series & Soil Spectrometry"
      >
        <span>👨💻</span>
        <span>Expert Mode</span>
      </button>
    </div>
  );
};
