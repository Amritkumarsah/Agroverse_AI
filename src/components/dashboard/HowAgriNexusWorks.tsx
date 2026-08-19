import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Sparkles, 
  Satellite, 
  Cpu, 
  Wheat, 
  DollarSign, 
  Volume2, 
  Lock, 
  Globe2, 
  ArrowRight,
  CheckCircle2,
  Trophy
} from 'lucide-react';

export const HowAgriNexusWorks: React.FC = () => {
  const { setCurrentView } = useApp();

  const steps = [
    {
      number: '1',
      title: 'SENSE',
      subtitle: 'Multi-Source Remote Telemetry',
      icon: <Satellite className="w-6 h-6 text-emerald-400" />,
      badge: 'Satellite + Soil + Weather',
      color: 'border-emerald-500/60 bg-emerald-950/40',
      description: 'Ingests real-time Sentinel-2 NDVI satellite passes, live Open-Meteo weather forecasts, and field soil sensors (pH, N-P-K, organic carbon %).'
    },
    {
      number: '2',
      title: 'UNDERSTAND',
      subtitle: 'Google AI Intelligence Pipeline',
      icon: <Cpu className="w-6 h-6 text-teal-400" />,
      badge: 'Google AI + ML + Computer Vision',
      color: 'border-teal-500/60 bg-teal-950/40',
      description: 'Processes multi-spectral canopy images with Computer Vision disease models and feeds telemetry into Google Gemini AI reasoning models.'
    },
    {
      number: '3',
      title: 'PREDICT',
      subtitle: 'Predictive Yield & Harvest Timing',
      icon: <Wheat className="w-6 h-6 text-amber-400" />,
      badge: 'Yield + Risk + Harvest Countdown',
      color: 'border-amber-500/60 bg-amber-950/40',
      description: 'Predicts expected crop yield range (Tons/Ha), calculates harvest window countdown, assesses climate risk, and highlights key factors.'
    },
    {
      number: '4',
      title: 'DECIDE',
      subtitle: 'Economic & ROI Crop Selection',
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />,
      badge: 'Crop Economics + AI Rationale',
      color: 'border-emerald-500/60 bg-emerald-950/40',
      description: 'Evaluates multi-crop financial return (Input Costs vs Market Revenue), calculates ROI %, and generates explainable "Why This Recommendation" advice.'
    },
    {
      number: '5',
      title: 'ACT',
      subtitle: 'Voice-First Farmer Advisory',
      icon: <Volume2 className="w-6 h-6 text-teal-400" />,
      badge: 'Farmer Advisory + Natural Voice',
      color: 'border-teal-500/60 bg-teal-950/40',
      description: 'Delivers simple, local-language voice and text action items ("Aaj Aapke Khet Mein") accessible to farmers of all literacy levels.'
    },
    {
      number: '6',
      title: 'PROTECT',
      subtitle: 'Farmer Consent & Data Privacy',
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      badge: 'Data Consent + PII Redaction',
      color: 'border-amber-500/60 bg-amber-950/40',
      description: 'Empowers farmers with granular consent toggles to protect personal identity while permitting anonymized telemetry sharing.'
    },
    {
      number: '7',
      title: 'COLLABORATE',
      subtitle: 'BRICS Interoperability Gateway',
      icon: <Globe2 className="w-6 h-6 text-emerald-400" />,
      badge: 'BRICS FAIR Data & Model Exchange',
      color: 'border-emerald-500/60 bg-emerald-950/40',
      description: 'Transmits FAIR JSON-LD open datasets across national nodes (India, Brazil, Russia, China, South Africa) for global AI innovation.'
    }
  ];

  return (
    <div className="space-y-6 pb-16 font-sans">
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'How AgriNexus Works' }]} />

      {/* Judge View Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#16271c] to-teal-950 border-2 border-emerald-500/70 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Trophy className="w-7 h-7 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">HACKATHON JUDGE OVERVIEW</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              AgriNexus Architecture & Innovation Pipeline
            </h1>
            <p className="text-xs text-gray-300 max-w-3xl">
              An end-to-end Digital Public Infrastructure (DPI) for cross-border AI agricultural intelligence, predictive yield forecasting, economic decision analysis, and farmer privacy governance.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Button variant="primary" icon={Wheat} onClick={() => setCurrentView('yield-forecast')}>
              Try Yield Forecast
            </Button>
            <Button variant="secondary" icon={DollarSign} onClick={() => setCurrentView('crop-economics')}>
              Try Crop Economics
            </Button>
          </div>
        </div>
      </div>

      {/* THE 7-STEP ARCHITECTURE FLOW */}
      <div className="space-y-4">
        <div className="text-sm font-black text-emerald-400 uppercase tracking-wider px-1">
          7-Step Agricultural Intelligence Flow:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className={`p-5 rounded-3xl border ${step.color} shadow-xl space-y-3 flex flex-col justify-between hover:scale-[1.02] transition-transform`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-black/40 border border-white/20 text-white font-black text-sm flex items-center justify-center">
                    #{step.number}
                  </span>
                  <Badge variant="success">{step.badge}</Badge>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  {step.icon}
                  <div>
                    <h3 className="font-black text-base text-white">{step.title}</h3>
                    <div className="text-[11px] text-gray-300 font-semibold">{step.subtitle}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed pt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
