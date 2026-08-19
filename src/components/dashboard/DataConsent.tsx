import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { consentService } from '../../services/consentService';
import { yieldPredictionEngine } from '../../services/yieldPredictionEngine';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { StatCard } from '../ui/StatCard';
import { 
  ShieldCheck, 
  Lock, 
  Globe2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Code, 
  FileCheck, 
  Share2, 
  Info,
  Database,
  Sparkles,
  X,
  Key,
  Shield,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { t } from '../../data/translations';

export const DataConsent: React.FC = () => {
  const { selectedFarm, soilData, weatherData, satelliteData, consent, updateConsent, showToast, language } = useApp();
  
  const [activeTargetCountry, setActiveTargetCountry] = useState<string>('Brazil');
  const [isSimulatingExchange, setIsSimulatingExchange] = useState<boolean>(false);
  const [exchangeSuccess, setExchangeSuccess] = useState<boolean>(false);
  const [showGovernanceModal, setShowGovernanceModal] = useState<boolean>(false);
  const [showRawJsonPayload, setShowRawJsonPayload] = useState<boolean>(false);

  const obs = satelliteData[0] || { ndvi: 0.74 };
  const yieldData = yieldPredictionEngine.predictYield(selectedFarm, soilData, weatherData, obs);

  const anonymizedPacket = consentService.generateAnonymizedPacket(selectedFarm, consent, soilData, weatherData, obs, yieldData);

  const handleToggle = (key: keyof typeof consent, value: any) => {
    updateConsent({ [key]: value });
    showToast('Data consent permissions updated successfully', 'info');
  };

  const handleTriggerCrossBorderExchange = () => {
    setIsSimulatingExchange(true);
    setExchangeSuccess(false);
    showToast(`Encrypting & anonymizing ${selectedFarm.name}'s data packet for ${activeTargetCountry} BRICS Gateway...`, 'info');

    setTimeout(() => {
      setIsSimulatingExchange(false);
      setExchangeSuccess(true);
      showToast(`Cross-border anonymized data packet successfully received by ${activeTargetCountry} Agriculture Node!`, 'success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: t(language, 'farmDashboard', 'Farm Dashboard'), view: 'overview' }, { label: t(language, 'dataConsent', 'My Data & Governance') }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-3xl p-5 lg:p-6 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Lock className="w-7 h-7 text-emerald-400 shrink-0" />
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              {t(language, 'dataConsentHeader', 'My Data Sharing & Cross-Border Data Governance')}
            </h1>
            <Badge variant="success">Digital Public Good (DPG)</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1.5">
            You own your farm data. Control what information can be anonymized and shared for global AI research.
          </p>
        </div>

        {/* Governance Label Badge */}
        <button
          onClick={() => setShowGovernanceModal(true)}
          className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/60 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Click to view Encryption & DPI Compliance Diagnostics"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Encrypted Data Governance (DPI Standard)</span>
          <Info className="w-3.5 h-3.5 text-emerald-400 opacity-80 shrink-0" />
        </button>
      </div>

      {/* FEATURE 3: FARMER CONSENT CONTROLS MATRIX */}
      <Card 
        title={
          <div className="flex items-center space-x-2 text-white font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{t(language, 'dataSharingPermissions', 'MY DATA SHARING PERMISSIONS')}</span>
          </div>
        }
        subtitle="Manage privacy settings for your farm parcel telemetry"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Personal Information */}
          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] space-y-2 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>{t(language, 'personalInfo', 'Personal Information')}</span>
              </div>
              <p className="text-[11px] text-gray-400">Name, phone, and direct identity.</p>
              <div className="text-[10px] text-emerald-400 font-medium">"Your personal information will not be shared."</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-red-950/80 text-red-300 border border-red-800 font-bold text-[11px]">
              {t(language, 'protectedInfo', 'Protected')}
            </div>
          </div>

          {/* Farm Location */}
          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] space-y-2 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white">{t(language, 'farmLocationPrivacy', 'Farm Location Privacy')}</div>
              <p className="text-[11px] text-gray-400">Granularity of location sharing.</p>
            </div>
            <select
              value={consent.farmLocation}
              onChange={(e) => handleToggle('farmLocation', e.target.value)}
              className="bg-[#111a14] border border-[#294233] text-emerald-400 font-bold rounded-xl px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="protected">Don't Share Location</option>
              <option value="district">Share Anonymized District</option>
              <option value="exact">Share Exact GPS Coordinates</option>
            </select>
          </div>

          {/* Soil Data */}
          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] space-y-2 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white">{t(language, 'soilHealthMetrics', 'Soil Health Metrics')}</div>
              <p className="text-[11px] text-gray-400">pH, Nitrogen, Organic Carbon %</p>
            </div>
            <button
              onClick={() => handleToggle('soilData', !consent.soilData)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                consent.soilData ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {consent.soilData ? t(language, 'shareAnonymized', '✓ Share Anonymized') : t(language, 'revoked', '✕ Revoked')}
            </button>
          </div>

          {/* Crop Health Data */}
          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] space-y-2 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white">{t(language, 'cropHealthData', 'Crop Health Data')}</div>
              <p className="text-[11px] text-gray-400">Crop type & disease diagnostics</p>
            </div>
            <button
              onClick={() => handleToggle('cropHealthData', !consent.cropHealthData)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                consent.cropHealthData ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {consent.cropHealthData ? t(language, 'shareAnonymized', '✓ Share Anonymized') : t(language, 'revoked', '✕ Revoked')}
            </button>
          </div>

          {/* Satellite Metrics */}
          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] space-y-2 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white">{t(language, 'satelliteDerivedMetrics', 'Satellite-derived Metrics')}</div>
              <p className="text-[11px] text-gray-400">NDVI & moisture index trends</p>
            </div>
            <button
              onClick={() => handleToggle('satelliteMetrics', !consent.satelliteMetrics)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                consent.satelliteMetrics ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {consent.satelliteMetrics ? t(language, 'shareAnonymized', '✓ Share Anonymized') : t(language, 'revoked', '✕ Revoked')}
            </button>
          </div>

          {/* Yield Data */}
          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] space-y-2 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white">{t(language, 'yieldHarvestForecasts', 'Yield & Harvest Forecasts')}</div>
              <p className="text-[11px] text-gray-400">Harvest tons & prediction score</p>
            </div>
            <button
              onClick={() => handleToggle('yieldData', !consent.yieldData)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                consent.yieldData ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {consent.yieldData ? t(language, 'shareAnonymized', '✓ Share Anonymized') : t(language, 'revoked', '✕ Revoked')}
            </button>
          </div>

          {/* Cross-Border Research */}
          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] space-y-2 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white">{t(language, 'crossBorderResearch', 'Cross-Border Research')}</div>
              <p className="text-[11px] text-gray-400">Allow BRICS partner nodes to access</p>
              <div className="text-[10px] text-gray-400">"Anonymous crop data may be used to improve agricultural AI models."</div>
            </div>
            <button
              onClick={() => handleToggle('crossBorderResearch', !consent.crossBorderResearch)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                consent.crossBorderResearch ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {consent.crossBorderResearch ? t(language, 'allowed', '✓ Allowed') : t(language, 'disallowed', '✕ Disallowed')}
            </button>
          </div>

          {/* AI Model Improvement */}
          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] space-y-2 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white">{t(language, 'aiModelImprovement', 'AI Model Improvement')}</div>
              <p className="text-[11px] text-gray-400">Use telemetry to fine-tune AI models</p>
            </div>
            <button
              onClick={() => handleToggle('aiModelImprovement', !consent.aiModelImprovement)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                consent.aiModelImprovement ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {consent.aiModelImprovement ? t(language, 'allowed', '✓ Allowed') : t(language, 'disallowed', '✕ Disallowed')}
            </button>
          </div>
        </div>
      </Card>



      {/* Data Encryption & DPI Compliance Modal */}
      {showGovernanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111a14] border border-[#23362a] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-white relative">
            <button 
              onClick={() => setShowGovernanceModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-950/90 border border-emerald-700/50 rounded-2xl text-emerald-400">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  Encrypted Data Governance
                  <Badge variant="success">DPI Standard</Badge>
                </h3>
                <p className="text-xs text-gray-400">Zero-Trust & W3C Verifiable Credentials Framework</p>
              </div>
            </div>

            {/* Security Protocol Badges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#18261e] border border-[#294233] p-3.5 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Encryption Standard</div>
                <div className="text-sm font-black text-emerald-400 mt-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" />
                  <span>AES-256-GCM</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">End-to-end payload security</div>
              </div>

              <div className="bg-[#18261e] border border-[#294233] p-3.5 rounded-2xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Identity Standard</div>
                <div className="text-sm font-black text-teal-300 mt-1 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>W3C DID Credentials</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Self-Sovereign Identity</div>
              </div>
            </div>

            {/* Data Pipeline Verification Flow */}
            <div className="space-y-3 bg-[#131e17] border border-[#23362a] p-4 rounded-2xl">
              <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span>Zero-Knowledge Data Anonymization Flow</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233] flex items-center justify-between">
                  <span className="text-gray-300 font-semibold">Client-Side Anonymization (SHA-256)</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233] flex items-center justify-between">
                  <span className="text-gray-300 font-semibold">Differential Privacy Noise Injection (ε = 0.5)</span>
                  <span className="text-teal-400 font-bold">Applied</span>
                </div>
                <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233] flex items-center justify-between">
                  <span className="text-gray-300 font-semibold">BRICS DPI Interoperable Protocol</span>
                  <span className="text-amber-400 font-bold">Compliant</span>
                </div>
              </div>
            </div>

            {/* Footer Info & Close */}
            <div className="flex items-center justify-between pt-2 border-t border-[#23362a] text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>DPDP & GDPR Compliant</span>
              </div>
              <Button size="sm" onClick={() => setShowGovernanceModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
