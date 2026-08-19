import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Leaf, TrendingUp, Sparkles, Droplets, Wheat, ShieldCheck } from 'lucide-react';

export const RegenerativeAg: React.FC = () => {
  const { selectedFarm, healthBreakdown, showToast } = useApp();

  const handleLogPractice = (pillar: string) => {
    showToast(`Logged regenerative practice: ${pillar} for ${selectedFarm.name}`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'Regenerative Agriculture' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">Regenerative Agriculture & Soil Carbon Engine</h1>
            <Badge variant="success">{selectedFarm.name}</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            "Regenerate. Restore. Resilience." — Data-driven practices to rebuild soil organic carbon & water table.
          </p>
        </div>
        <Badge variant="info">Sustainability Score: {healthBreakdown.sustainabilityScore}/100</Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Sustainability Index"
          value={`${healthBreakdown.sustainabilityScore} / 100`}
          subtitle="Eco-Regenerative Score"
          icon={Leaf}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Predicted Carbon Gain"
          value="+18% Soil Organic C"
          subtitle="Over 2 Crop Cycles"
          change="Target 0.75%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-teal-400"
        />

        <StatCard
          title="Water Savings Potential"
          value="~35% Sub-surface"
          subtitle="Rainfall-Aware Scheduling"
          icon={Droplets}
          iconColor="text-blue-400"
        />
      </div>

      {/* 5 Regenerative Pillars Grid */}
      <Card title="5 Core Pillars of Regenerative Agriculture" subtitle="Localized practices for soil restoration">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#18261e] border border-[#294233] p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-extrabold text-xs">
                01
              </div>
              <h3 className="font-bold text-sm text-white">Soil Organic Carbon Restoration</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Apply 5 tonnes/ha of farmyard manure or biochar. Rebuilds microbial biodiversity and soil water retention.
              </p>
            </div>
            <Button size="sm" onClick={() => handleLogPractice('Soil Organic Carbon')} variant="secondary">
              Log Manure Top-Dressing
            </Button>
          </div>

          <div className="bg-[#18261e] border border-[#294233] p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 text-teal-400 flex items-center justify-center font-extrabold text-xs">
                02
              </div>
              <h3 className="font-bold text-sm text-white">Rainfall-Aware Water Conservation</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Dynamically adjust irrigation schedules to exploit incoming monsoon rain, saving 35% groundwater.
              </p>
            </div>
            <Button size="sm" onClick={() => handleLogPractice('Water Conservation')} variant="secondary">
              Log Rain Schedule
            </Button>
          </div>

          <div className="bg-[#18261e] border border-[#294233] p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center font-extrabold text-xs">
                03
              </div>
              <h3 className="font-bold text-sm text-white">Leguminous Crop Rotation</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Introduce pulse legume crops (Chickpea / Mungbean) post cereal to naturally fix ~40 kg/ha atmospheric nitrogen.
              </p>
            </div>
            <Button size="sm" onClick={() => handleLogPractice('Legume Rotation')} variant="secondary">
              Log Pulse Rotation
            </Button>
          </div>

          <div className="bg-[#18261e] border border-[#294233] p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-extrabold text-xs">
                04
              </div>
              <h3 className="font-bold text-sm text-white">Minimum Tillage Practice</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Minimize mechanical soil tilling to preserve sub-surface mycorrhizal fungal networks and curb carbon loss.
              </p>
            </div>
            <Button size="sm" onClick={() => handleLogPractice('Minimum Tillage')} variant="secondary">
              Log Min-Till
            </Button>
          </div>

          <div className="bg-[#18261e] border border-[#294233] p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-950 border border-green-800 text-green-400 flex items-center justify-center font-extrabold text-xs">
                05
              </div>
              <h3 className="font-bold text-sm text-white">Biodiversity Cover Crops</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Sow Sesbania (Dhaincha) cover crop in fallow windows to suppress weed growth and prevent erosion.
              </p>
            </div>
            <Button size="sm" onClick={() => handleLogPractice('Cover Crop')} variant="secondary">
              Log Cover Sowing
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
