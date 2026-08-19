import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ZoneDetail } from '../../types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Box, Activity, Droplets, AlertTriangle, CheckCircle2, Cpu } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const { selectedFarm, satelliteData } = useApp();
  const zones = satelliteData[0]?.zones || [
    {
      id: 'Zone A',
      name: 'South-East Zone (Plot 1)',
      health: 'healthy',
      ndvi: 0.78,
      moisture: 'Optimal (58%)',
      stressLevel: 'None',
      nitrogenStatus: 'Sufficient',
      recommendation: 'Maintain standard growth schedule.'
    },
    {
      id: 'Zone B',
      name: 'North-West Zone (Plot 2)',
      health: 'moderate',
      ndvi: 0.43,
      moisture: 'Moderate (42%)',
      stressLevel: 'Moderate Stress Detected',
      nitrogenStatus: 'Low-Medium',
      recommendation: 'Monitor irrigation. Postpone chemical spray due to incoming rain.'
    },
    {
      id: 'Zone C',
      name: 'Central Patch (Plot 3)',
      health: 'high-risk',
      ndvi: 0.35,
      moisture: 'Low (31%)',
      stressLevel: 'High Canopy Stress',
      nitrogenStatus: 'Deficient',
      recommendation: 'Inspect for early rust infection & localized soil compacting.'
    }
  ];

  const [selectedZone, setSelectedZone] = useState<ZoneDetail>(zones[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'Farm Digital Twin' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Box className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">Farm Digital Twin (2.5D Zone Replica)</h1>
            <Badge variant="success">{selectedFarm.name}</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Virtual 2.5D spatial replica of {selectedFarm.name}'s {selectedFarm.farmSizeHectares}-hectare plot with real-time zone telemetry.
          </p>
        </div>
        <Badge variant="info">Digital Twin Active</Badge>
      </div>

      {/* Zone Inspector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          return (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/50 shadow-2xl scale-[1.02]'
                  : 'bg-[#111a14] border-[#23362a] hover:border-emerald-500/50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xs text-white">{zone.id}: {zone.name}</span>
                <span className={`w-3 h-3 rounded-full ${
                  zone.health === 'healthy' ? 'bg-emerald-500' :
                  zone.health === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="text-2xl font-extrabold text-white">NDVI: {zone.ndvi}</div>
              <div className="text-xs text-gray-300 mt-1">Moisture: {zone.moisture}</div>
              <div className="text-[11px] font-semibold text-emerald-400 mt-2">
                Status: {zone.stressLevel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Zone Deep-Dive Details */}
      <Card 
        title={`Selected Zone Telemetry: ${selectedZone.id} — ${selectedZone.name}`}
        subtitle="Live multi-spectral & soil sensor readings"
        action={
          <Badge variant={selectedZone.health === 'healthy' ? 'success' : selectedZone.health === 'moderate' ? 'warning' : 'danger'}>
            {selectedZone.health.toUpperCase()}
          </Badge>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Zone NDVI Score"
            value={selectedZone.ndvi}
            subtitle="Canopy Chlorophyll Index"
            icon={Activity}
            iconColor="text-emerald-400"
          />

          <StatCard
            title="Soil Moisture"
            value={selectedZone.moisture}
            subtitle="Root Zone Hydration"
            icon={Droplets}
            iconColor="text-blue-400"
          />

          <StatCard
            title="Stress Status"
            value={selectedZone.stressLevel}
            subtitle="Satellite Stress Detection"
            icon={AlertTriangle}
            iconColor="text-amber-400"
          />

          <StatCard
            title="Nitrogen Status"
            value={selectedZone.nitrogenStatus}
            subtitle="Canopy Nitrogen Reserve"
            icon={CheckCircle2}
            iconColor="text-teal-400"
          />
        </div>

        <div className="p-4 rounded-xl bg-[#18261e] border border-emerald-500/30 text-emerald-100 text-sm leading-relaxed">
          <span className="font-bold text-emerald-300">AI Zone Recommendation: </span>
          {selectedZone.recommendation}
        </div>
      </Card>
    </div>
  );
};
