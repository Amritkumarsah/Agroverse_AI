import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthModal } from './AuthModal';
import { 
  Sparkles, 
  Satellite, 
  CloudSun, 
  FlaskConical, 
  Bug, 
  Globe2, 
  ArrowRight, 
  ShieldCheck, 
  Bot, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Cpu, 
  FileCheck,
  Layers,
  Activity,
  LogIn,
  UserPlus
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setDemoMode, setDemoStep } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  const openAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleStartDemo = () => {
    setDemoMode(true);
    setDemoStep(1);
    setCurrentView('overview');
  };

  const scrollToExplore = () => {
    const el = document.getElementById('explore-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0f0d]/90 border-b border-[#18261e] px-4 lg:px-12 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-green-600 p-0.5 shadow-lg shadow-emerald-950/60">
              <div className="w-full h-full bg-[#0a0f0d] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                <span>AGROVERSE</span>
                <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">AI</span>
              </div>
              <div className="text-[10px] text-gray-400">Digital Public Infrastructure</div>
            </div>
          </div>

          {/* Top Right Header Action Button */}
          <div className="flex items-center">
            <button
              onClick={() => openAuth('login')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>Sign In / Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Public Infrastructure for Climate-Resilient Agriculture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-none">
            AI for Every Farm.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">
              Intelligence for Every Climate.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform satellite imagery, soil diagnostics, and climate forecasts into localized, actionable, and sustainable agricultural advisories.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={scrollToExplore}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-base shadow-xl shadow-emerald-900/40 flex items-center justify-center space-x-2 group transition-all cursor-pointer"
            >
              <span>Explore Farm Intelligence</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rotate-90 sm:rotate-90" />
            </button>
          </div>

          {/* Core Banner Statement */}
          <div className="pt-8 text-sm text-gray-400 font-medium">
            <span className="text-emerald-400 font-bold">One farm.</span> Multiple data sources.{' '}
            <span className="text-emerald-400 font-bold">One intelligent decision layer.</span>
          </div>
        </div>

      </section>

      {/* Why AGROVERSE AI Section */}
      <section id="explore-section" className="py-16 px-4 lg:px-12 bg-[#0d1410] border-y border-[#1e2e23] scroll-mt-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Why AGROVERSE AI?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Agricultural data is deeply fragmented across satellite agencies, weather providers, and soil labs. We unify it into a single intelligence layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111a14] border border-[#23362a] p-6 rounded-2xl space-y-3 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                <Satellite className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Multi-Source Intelligence</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Seamlessly fuses Sentinel-2 satellite imagery, local weather forecasts, soil diagnostics, and growth stage metrics into unified recommendations.
              </p>
            </div>

            <div className="bg-[#111a14] border border-[#23362a] p-6 rounded-2xl space-y-3 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Actionable, Not Informational</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                We don't just display rain percentages or soil pH. We translate raw data directly into clear decisions: "Postpone irrigation by 36 hours."
              </p>
            </div>

            <div className="bg-[#111a14] border border-[#23362a] p-6 rounded-2xl space-y-3 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">BRICS Interoperable Network</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Designed around open standards so AI models trained in India can be verified and deployed across Brazil, Russia, China, and South Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Layer Section */}
      <section className="py-16 px-4 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Our 5-Pillar Intelligence Layer</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            End-to-end technology pipeline from space-based observations down to root-zone decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-[#111a14] border border-[#23362a] p-4 rounded-xl text-center space-y-2">
            <Satellite className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-bold text-sm text-white">1. Satellite</div>
            <div className="text-[11px] text-gray-400">NDVI & Canopy Stress Heatmaps</div>
          </div>

          <div className="bg-[#111a14] border border-[#23362a] p-4 rounded-xl text-center space-y-2">
            <CloudSun className="w-8 h-8 text-amber-400 mx-auto" />
            <div className="font-bold text-sm text-white">2. Weather</div>
            <div className="text-[11px] text-gray-400">Rain Probability & Heat Stress</div>
          </div>

          <div className="bg-[#111a14] border border-[#23362a] p-4 rounded-xl text-center space-y-2">
            <FlaskConical className="w-8 h-8 text-teal-400 mx-auto" />
            <div className="font-bold text-sm text-white">3. Soil Diagnostics</div>
            <div className="text-[11px] text-gray-400">pH, NPK & Organic Carbon</div>
          </div>

          <div className="bg-[#111a14] border border-[#23362a] p-4 rounded-xl text-center space-y-2">
            <Bug className="w-8 h-8 text-red-400 mx-auto" />
            <div className="font-bold text-sm text-white">4. Vision AI</div>
            <div className="text-[11px] text-gray-400">Leaf Disease & Rust Detector</div>
          </div>

          <div className="bg-[#111a14] border border-[#23362a] p-4 rounded-xl text-center space-y-2">
            <Bot className="w-8 h-8 text-indigo-400 mx-auto" />
            <div className="font-bold text-sm text-white">5. AgroGPT</div>
            <div className="text-[11px] text-gray-400">Voice & Local Advisory Engine</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#1e2e23] text-center text-xs text-gray-500 bg-[#070b09]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-300">AGROVERSE AI</span>
            <span>• Digital Public Infrastructure (DPI)</span>
          </div>
          <div>Inspired by BRICS Agricultural Cooperation • Prototype Simulation</div>
        </div>
      </footer>

      {/* Auth Modal (Sign In / Register) */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authTab}
        />
      )}
    </div>
  );
};
