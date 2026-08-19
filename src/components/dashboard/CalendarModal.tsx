import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Droplets, 
  FlaskConical, 
  Sprout, 
  Tractor,
  Clock,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

interface Milestone {
  day: number;
  label: string;
  type: 'irrigation' | 'fertilizer' | 'satellite' | 'sowing' | 'harvest';
  color: string;
}

const MILESTONES: Record<number, Milestone> = {
  14: { day: 14, label: 'Sentinel-2 Pass', type: 'satellite', color: 'bg-cyan-500' },
  19: { day: 19, label: 'Today Live Feed', type: 'satellite', color: 'bg-emerald-400' },
  22: { day: 22, label: 'Drip Irrigation', type: 'irrigation', color: 'bg-blue-400' },
  28: { day: 28, label: 'Urea Dose #2', type: 'fertilizer', color: 'bg-amber-400' },
};

export const CalendarModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate
}) => {
  const { showToast, selectedFarm } = useApp();
  
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0 = Jan, 7 = Aug
  const [activeDay, setActiveDay] = useState<number>(19);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    setActiveDay(day);
    const monthShort = monthNames[currentMonth].substring(0, 3);
    const dateStr = `${day} ${monthShort} ${currentYear}`;
    onSelectDate(dateStr);
    showToast(`Telemetry Observation Date updated to ${dateStr}`, 'success');
    onClose();
  };

  const handleQuickPreset = (day: number, monthIdx: number, year: number, label: string) => {
    setCurrentMonth(monthIdx);
    setCurrentYear(year);
    setActiveDay(day);
    const monthShort = monthNames[monthIdx].substring(0, 3);
    const dateStr = `${day} ${monthShort} ${year}`;
    onSelectDate(dateStr);
    showToast(`Telemetry view set to ${label} (${dateStr})`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crop Telemetry Observation Calendar"
    >
      <div className="space-y-5 text-xs text-gray-200">
        {/* Header Summary Banner */}
        <div className="bg-gradient-to-r from-[#122318] via-[#0e1a12] to-[#152e1f] p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Active Parcel: {selectedFarm.name}</span>
            </div>
            <div className="text-sm font-black text-white">
              Selected Date: <span className="text-emerald-300 font-mono">{selectedDate}</span>
            </div>
          </div>

          <div className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sentinel-2 Sync</span>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Quick Observation Presets</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset(19, 7, 2026, 'Today (Live Pass)')}
              className="p-2 rounded-xl bg-[#142219] hover:bg-emerald-950 border border-[#23362a] hover:border-emerald-500 text-left transition-all cursor-pointer space-y-0.5"
            >
              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Today</span>
              </div>
              <div className="text-xs font-black text-white">19 Aug 2026</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPreset(18, 7, 2026, 'Yesterday')}
              className="p-2 rounded-xl bg-[#142219] hover:bg-emerald-950 border border-[#23362a] hover:border-emerald-500 text-left transition-all cursor-pointer space-y-0.5"
            >
              <div className="text-[10px] text-gray-400 font-bold">Yesterday</div>
              <div className="text-xs font-black text-white">18 Aug 2026</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPreset(14, 7, 2026, 'Sentinel Pass')}
              className="p-2 rounded-xl bg-[#142219] hover:bg-emerald-950 border border-[#23362a] hover:border-emerald-500 text-left transition-all cursor-pointer space-y-0.5"
            >
              <div className="text-[10px] text-cyan-400 font-bold">Satellite Pass</div>
              <div className="text-xs font-black text-white">14 Aug 2026</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPreset(22, 7, 2026, 'Irrigation Date')}
              className="p-2 rounded-xl bg-[#142219] hover:bg-emerald-950 border border-[#23362a] hover:border-emerald-500 text-left transition-all cursor-pointer space-y-0.5"
            >
              <div className="text-[10px] text-blue-400 font-bold">Irrigation Day</div>
              <div className="text-xs font-black text-white">22 Aug 2026</div>
            </button>
          </div>
        </div>

        {/* Interactive Calendar Month View */}
        <div className="bg-[#0e1712] border border-[#23362a] p-4 rounded-2xl space-y-4 shadow-inner">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span>{monthNames[currentMonth]} {currentYear}</span>
            </h4>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-[#142219] hover:bg-[#1c3023] border border-[#23362a] text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-[#142219] hover:bg-[#1c3023] border border-[#23362a] text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-gray-400 pb-1 border-b border-[#1e3224]">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-9" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isToday = dayNum === 19 && currentMonth === 7 && currentYear === 2026;
              const isSelected = dayNum === activeDay && currentMonth === 7 && currentYear === 2026;
              const milestone = MILESTONES[dayNum];

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-10 rounded-xl relative flex flex-col items-center justify-center font-bold text-xs transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-md shadow-emerald-950 scale-105' 
                      : isToday 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 font-extrabold' 
                      : 'bg-[#142219]/60 hover:bg-[#1c3023] text-gray-300 hover:text-white border-[#23362a]'
                  }`}
                >
                  <span>{dayNum}</span>
                  {milestone && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${milestone.color}`} title={milestone.label} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Agriculture Milestones Legend */}
        <div className="p-3 bg-[#111c15] border border-[#23362a] rounded-xl space-y-2">
          <div className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">Crop Schedule Milestones</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-gray-300">Live Telemetry</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="font-semibold text-gray-300">Irrigation Day</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-semibold text-gray-300">Urea Dose</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="font-semibold text-gray-300">Satellite Pass</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
