import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cropAdvisorEngine } from '../../services/cropAdvisorEngine';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Wheat, CheckCircle2, Info, Sparkles, Droplets, ArrowRight } from 'lucide-react';

export const CropAdvisor: React.FC = () => {
  const { selectedFarm, soilData, weatherData, setCurrentView, showToast, editExistingFarm } = useApp();

  const [activeCropRotation, setActiveCropRotation] = useState<string>(selectedFarm.crop);
  
  // Auto-detect season based on real calendar month (June-Sept = Kharif, Oct-Feb = Rabi, Mar-May = Zaid)
  const currentMonth = new Date().getMonth();
  const initialSeason = (currentMonth >= 5 && currentMonth <= 8) ? 'kharif' : (currentMonth >= 2 && currentMonth <= 4) ? 'zaid' : 'rabi';
  const [selectedSeason, setSelectedSeason] = useState<'rabi' | 'kharif' | 'zaid'>(initialSeason);

  const recommendations = cropAdvisorEngine.getRecommendations(selectedFarm.id, soilData, weatherData, selectedSeason);

  const handleSelectCrop = (cropName: string) => {
    setActiveCropRotation(cropName);
    editExistingFarm(selectedFarm.id, {
      farmer: selectedFarm.name,
      location: selectedFarm.location,
      latitude: selectedFarm.coordinates?.[0]?.[0] || 26.1209,
      longitude: selectedFarm.coordinates?.[0]?.[1] || 85.3647,
      farmSizeHectares: selectedFarm.farmSizeHectares,
      crop: cropName
    });
    showToast(`Active Crop Rotation updated to "${cropName}" for ${selectedFarm.name}`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'Crop Advisor' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Wheat className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">Explainable AI Crop Recommendation Engine</h1>
            <Badge variant="success">{selectedFarm.name}</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Data-driven crop suitability model evaluating soil pH, water budget, climate projections, and rotation benefits.
          </p>
        </div>

        {/* Interactive Farming Season Selector */}
        <div className="flex items-center bg-[#0a120d] p-1.5 rounded-xl border border-[#23362a] space-x-1 shrink-0">
          <button
            onClick={() => { setSelectedSeason('rabi'); showToast('Loaded Rabi (Winter) Season AI Recommendations', 'info'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSeason === 'rabi' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            🌾 Rabi (Winter)
          </button>
          <button
            onClick={() => { setSelectedSeason('kharif'); showToast('Loaded Kharif (Monsoon) Season AI Recommendations', 'info'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSeason === 'kharif' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            🌧️ Kharif (Monsoon)
          </button>
          <button
            onClick={() => { setSelectedSeason('zaid'); showToast('Loaded Zaid (Summer) Season AI Recommendations', 'info'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSeason === 'zaid' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            ☀️ Zaid (Summer)
          </button>
        </div>
      </div>

      {/* Explainable AI Decision Model Card */}
      <Card 
        title={
          <div className="flex items-center space-x-2 text-white font-extrabold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Explainable AI Crop Suitability Decision Model</span>
          </div>
        } 
        subtitle="Multi-factorial algorithmic weights used by AgriNexus AI to rank recommended crops"
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="bg-[#121e16] p-3 rounded-2xl border border-[#23362a] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-300 font-bold">Soil Match</span>
              <span className="text-emerald-400 font-extrabold font-mono">30%</span>
            </div>
            <div className="w-full bg-[#1b2b20] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }} />
            </div>
            <div className="text-[10px] text-gray-400">pH & N-P-K Fit</div>
          </div>

          <div className="bg-[#121e16] p-3 rounded-2xl border border-[#23362a] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-300 font-bold">Climate Fit</span>
              <span className="text-emerald-400 font-extrabold font-mono">25%</span>
            </div>
            <div className="w-full bg-[#1b2b20] h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-400 h-full rounded-full" style={{ width: '25%' }} />
            </div>
            <div className="text-[10px] text-gray-400">Temp & Rain Index</div>
          </div>

          <div className="bg-[#121e16] p-3 rounded-2xl border border-[#23362a] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-300 font-bold">Water Budget</span>
              <span className="text-emerald-400 font-extrabold font-mono">15%</span>
            </div>
            <div className="w-full bg-[#1b2b20] h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: '15%' }} />
            </div>
            <div className="text-[10px] text-gray-400">Irrigation Demand</div>
          </div>

          <div className="bg-[#121e16] p-3 rounded-2xl border border-[#23362a] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-300 font-bold">Market Demand</span>
              <span className="text-emerald-400 font-extrabold font-mono">15%</span>
            </div>
            <div className="w-full bg-[#1b2b20] h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '15%' }} />
            </div>
            <div className="text-[10px] text-gray-400">Seasonal MSP Value</div>
          </div>

          <div className="bg-[#121e16] p-3 rounded-2xl border border-[#23362a] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-300 font-bold">Crop Rotation</span>
              <span className="text-emerald-400 font-extrabold font-mono">15%</span>
            </div>
            <div className="w-full bg-[#1b2b20] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '15%' }} />
            </div>
            <div className="text-[10px] text-gray-400">Soil Replenishment</div>
          </div>
        </div>
      </Card>

      {/* Recommended Crops List */}
      <div className="space-y-4">
        {recommendations.map((crop, rank) => (
          <Card 
            key={crop.cropName} 
            className={`transition-all ${rank === 0 ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : ''}`}
            title={
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full font-extrabold text-sm flex items-center justify-center ${
                  rank === 0 ? 'bg-emerald-500 text-white shadow-lg' : 'bg-[#18261e] text-gray-300 border border-[#294233]'
                }`}>
                  #{rank + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{crop.cropName}</h3>
                  <div className="text-xs text-gray-400">Expected Yield: <strong className="text-emerald-400">{crop.expectedYield}</strong></div>
                </div>
              </div>
            }
            action={
              <div className="flex items-center space-x-2 bg-[#18261e] border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">Suitability:</span>
                <span className="text-xl font-extrabold text-emerald-400">{crop.suitabilityScore}%</span>
              </div>
            }
          >
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233]">
                <div className="text-gray-400">Water Requirement:</div>
                <div className="font-bold text-white mt-0.5">{crop.waterRequirement}</div>
              </div>

              <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233]">
                <div className="text-gray-400">Soil Compatibility:</div>
                <div className="font-bold text-emerald-400 mt-0.5">{crop.soilCompatibility}</div>
              </div>

              <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233]">
                <div className="text-gray-400">Climate Risk:</div>
                <div className="font-bold text-white mt-0.5">{crop.climateRisk}</div>
              </div>

              <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233]">
                <div className="text-gray-400">Sustainability:</div>
                <div className="font-bold text-emerald-400 mt-0.5 truncate">{crop.sustainabilityImpact}</div>
              </div>
            </div>

            {/* Why This Recommendation? */}
            <div className="space-y-2 pt-3 border-t border-[#23362a] text-xs">
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Why this recommendation?</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {crop.reasons.map((r, i) => (
                  <div key={i} className="flex items-start space-x-2 text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#23362a] flex justify-end">
              <Button 
                size="sm" 
                onClick={() => handleSelectCrop(crop.cropName)} 
                icon={activeCropRotation === crop.cropName ? CheckCircle2 : Wheat} 
                variant={activeCropRotation === crop.cropName ? "primary" : "secondary"}
              >
                {activeCropRotation === crop.cropName 
                  ? `✓ Active Rotation: ${crop.cropName.split(' ')[0]}`
                  : `Select ${crop.cropName.split(' ')[0]} Rotation`}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
