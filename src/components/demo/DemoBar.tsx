import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { Play, ChevronRight, ChevronLeft, X, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DemoStepConfig {
  step: number;
  title: string;
  subtitle: string;
  view: AppView;
}

const DEMO_STEPS: DemoStepConfig[] = [
  {
    step: 1,
    title: "1. 👨🌾 Farmer Selection & Mode",
    subtitle: "Farmer Rajesh Kumar (Bihar, India | Wheat | 2.4 Ha | Vegetative Stage).",
    view: 'overview'
  },
  {
    step: 2,
    title: "2. 📊 Farm Overview & Health Score",
    subtitle: "Farm Health Score: 72/100 (Crop 78, Soil 64, Weather 71, Disease 82, Sustainability 69).",
    view: 'overview'
  },
  {
    step: 3,
    title: "3. 🛰️ Satellite & NDVI Canopy Stress",
    subtitle: "Sentinel-2 satellite observation shows NDVI 0.71 with NW Zone vegetation stress.",
    view: 'satellite'
  },
  {
    step: 4,
    title: "4. 🌦️ Weather & Soil Intelligence",
    subtitle: "78% rain in 36h → AI automatically advises postponing irrigation & nitrogen application.",
    view: 'weather'
  },
  {
    step: 5,
    title: "5. 🌾 Explainable Crop Advisor",
    subtitle: "Multi-factor algorithm ranks Wheat (91%), Chickpea (82%), Mustard (76%).",
    view: 'advisor'
  },
  {
    step: 6,
    title: "6. 🦠 AI Crop Doctor (Disease Vision)",
    subtitle: "Computer vision detects Wheat Rust (91% confidence, ~23% affected area).",
    view: 'disease'
  },
  {
    step: 7,
    title: "7. 🌱 Regenerative Agriculture Engine",
    subtitle: "Sustainability Score 63/100 → Soil organic carbon, legume rotation & minimum tillage.",
    view: 'regenerative'
  },
  {
    step: 8,
    title: "8. 🏛️ National Crop Risk Monitor",
    subtitle: "Authority Dashboard tracking 128,420 farms, drought risk & regional alerts.",
    view: 'authority'
  },
  {
    step: 10,
    title: "10. 🌐 BRICS Global Agriculture Network",
    subtitle: "Cross-border AI Model Exchange (India → Brazil Climate Wheat model shared successfully).",
    view: 'brics-network'
  }
];

export const DemoBar: React.FC = () => {
  const { 
    demoMode, 
    setDemoMode, 
    demoStep, 
    setDemoStep, 
    setCurrentView,
    setAppMode
  } = useApp();

  if (!demoMode) return null;

  const currentStepConfig = DEMO_STEPS[demoStep - 1];

  const handleNext = () => {
    if (demoStep < 10) {
      const next = demoStep + 1;
      setDemoStep(next);
      setAppMode(next === 1 ? 'farmer' : 'expert');
      setCurrentView(DEMO_STEPS[next - 1].view);
      if (next === 10) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handlePrev = () => {
    if (demoStep > 1) {
      const prev = demoStep - 1;
      setDemoStep(prev);
      setAppMode(prev === 1 ? 'farmer' : 'expert');
      setCurrentView(DEMO_STEPS[prev - 1].view);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-4xl bg-[#111a14]/95 border-2 border-emerald-500/60 rounded-2xl shadow-2xl backdrop-blur-xl p-3 sm:p-4 text-white">
      <div className="flex items-center justify-between gap-4">
        {/* Step Info */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-lg">
            {demoStep}/10
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-emerald-300 truncate">
                {currentStepConfig.title}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-semibold hidden sm:inline-block">
                3-MIN DEMO
              </span>
            </div>
            <p className="text-xs text-gray-300 truncate mt-0.5">
              {currentStepConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrev}
            disabled={demoStep === 1}
            className="p-2 rounded-lg bg-[#18261e] border border-[#294233] text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all"
          >
            <span>{demoStep === 10 ? 'Finish Demo 🎉' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDemoMode(false)}
            className="p-2 rounded-lg bg-[#18261e] border border-[#294233] text-gray-400 hover:text-red-400 transition-colors"
            title="Close Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-between gap-1.5 mt-3 pt-2 border-t border-[#1e2e23]">
        {DEMO_STEPS.map((s) => (
          <button
            key={s.step}
            onClick={() => {
              setDemoStep(s.step);
              setCurrentView(s.view);
            }}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              s.step === demoStep 
                ? 'bg-emerald-400 shadow-md shadow-emerald-500/50' 
                : s.step < demoStep 
                ? 'bg-emerald-800' 
                : 'bg-gray-800'
            }`}
            title={s.title}
          />
        ))}
      </div>
    </div>
  );
};
