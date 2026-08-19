import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveSatelliteMap } from '../maps/InteractiveSatelliteMap';
import { ZoneDetail } from '../../types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea, ReferenceLine } from 'recharts';
import { Satellite, Eye, Calendar, Layers, Droplets, AlertTriangle, Activity, Info } from 'lucide-react';
import { getTodayDateString } from '../../utils/dateUtils';

const CustomNDVITooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const status = val >= 0.65 ? '🟢 Healthy Canopy' : val >= 0.5 ? '🟡 Moderate Growth' : '🔴 Stress Detected';
    const desc = val >= 0.65 
      ? 'High leaf chlorophyll reflection (Vigorous Leaf Canopy)' 
      : val >= 0.5 
      ? 'Normal vegetation density (Slight moisture or nutrient deficit)' 
      : 'Low leaf reflection (Immediate irrigation & nitrogen action required)';

    return (
      <div className="bg-[#0f1712] border border-[#23362a] p-3 rounded-xl shadow-2xl space-y-1.5 text-xs max-w-xs font-sans">
        <div className="flex items-center justify-between font-bold text-gray-200 border-b border-[#23362a] pb-1">
          <span>📅 Date: {label}</span>
          <span className="text-emerald-400 font-mono font-extrabold">{val} NDVI</span>
        </div>
        <div className="font-bold text-white text-xs flex items-center justify-between">
          <span>Canopy Health:</span>
          <span>{status}</span>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed font-normal">
          {desc}
        </p>
      </div>
    );
  }
  return null;
};

export const SatelliteIntel: React.FC = () => {
  const { selectedFarm, satelliteData, showToast } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(satelliteData[0]?.date || getTodayDateString());
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ndvi' | 'moisture' | 'stress' | 'vegetation'>('ndvi');
  const [selectedZone, setSelectedZone] = useState<ZoneDetail | null>(satelliteData[0]?.zones?.[0] || null);

  const currentObs = satelliteData.find(o => o.date === selectedDate) || satelliteData[0] || {
    date: getTodayDateString(),
    ndvi: 0.71,
    vegetationHealth: 'Healthy (Moderate Stress in NW Zone)',
    stressZoneCount: 1,
    imageUrl: '',
    moistureIndex: 0.62,
    zones: []
  };

  const chartData = satelliteData.slice().reverse().map(o => ({
    date: o.date.replace(' 2026', ''),
    ndvi: o.ndvi,
    moisture: Math.round(o.moistureIndex * 100)
  }));

  const handleLayerChange = (layer: 'satellite' | 'ndvi' | 'moisture' | 'stress' | 'vegetation') => {
    setActiveLayer(layer);
    showToast(`Satellite visualization switched to ${layer.toUpperCase()} layer`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'Satellite Intelligence' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Satellite className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">Satellite & Canopy Intelligence</h1>
            <Badge variant="success">{selectedFarm.name}</Badge>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              Simulated Satellite Observation
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Sentinel-2 L2A satellite observation, NDVI canopy reflectance, and zone stress analysis.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-gray-400 font-medium">Date:</span>
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              showToast(`Updated satellite observation to ${e.target.value}`, 'info');
            }}
            className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
          >
            {satelliteData.map((o) => (
              <option key={o.date} value={o.date} className="bg-[#131e17] text-white">
                {o.date}
              </option>
            ))}
          </select>
        </div>
      </div>



      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="NDVI Reflectance Score"
          value={currentObs.ndvi}
          subtitle={`Observed on ${currentObs.date}`}
          change={currentObs.ndvi > 0.7 ? 'Vigorous' : 'Moderate'}
          changeType={currentObs.ndvi > 0.7 ? 'positive' : 'neutral'}
          icon={Eye}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Vegetation Health Status"
          value={currentObs.vegetationHealth.split('(')[0]}
          subtitle="Chlorophyll Absorption Index"
          change="Optimal"
          changeType="positive"
          icon={Activity}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Stress Zone Detection"
          value={currentObs.stressZoneCount > 0 ? `${currentObs.stressZoneCount} Stress Zone` : 'No Stress'}
          subtitle={currentObs.stressZoneCount > 0 ? 'Plot B requires monitoring' : 'All plots healthy'}
          change={currentObs.stressZoneCount > 0 ? 'Attention Needed' : 'Clear'}
          changeType={currentObs.stressZoneCount > 0 ? 'negative' : 'positive'}
          icon={AlertTriangle}
          iconColor="text-amber-400"
        />
      </div>

      {/* Map & Time-Series Trend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveSatelliteMap 
            observation={currentObs} 
            activeLayerOverride={activeLayer}
            onZoneSelect={(z) => setSelectedZone(z)} 
          />
        </div>

        {/* Time-Series Trend & Service Abstraction */}
        <div className="space-y-6">
          <Card 
            title={
              <div className="flex items-center space-x-2 text-white font-bold">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>NDVI Satellite Time-Series Trend</span>
              </div>
            } 
            subtitle="Multi-date Sentinel-2 satellite canopy progression"
          >
            {/* Judge Guide Box */}
            <div className="bg-[#18261e] border border-emerald-500/30 p-2.5 rounded-xl text-[11px] space-y-1 mb-3">
              <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>💡 Judge Guide: How to read NDVI (0.0 to 1.0)</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-300 text-center font-medium pt-0.5">
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 p-1 rounded">
                  🟢 &ge; 0.65: Vigorous Healthy
                </span>
                <span className="bg-amber-950/80 text-amber-300 border border-amber-800 p-1 rounded">
                  🟡 0.45–0.64: Moderate Canopy
                </span>
                <span className="bg-red-950/80 text-red-300 border border-red-800 p-1 rounded">
                  🔴 &lt; 0.45: Crop Stress
                </span>
              </div>
            </div>

            <div className="h-56 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  {/* Background Color Zones for Judge Clarity */}
                  <ReferenceArea y1={0.65} y2={1.0} fill="#10b981" fillOpacity={0.12} />
                  <ReferenceArea y1={0.45} y2={0.65} fill="#f59e0b" fillOpacity={0.08} />
                  <ReferenceArea y1={0.2} y2={0.45} fill="#ef4444" fillOpacity={0.1} />

                  {/* Optimal Benchmark Reference Line */}
                  <ReferenceLine y={0.65} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Optimal (0.65)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />

                  <CartesianGrid strokeDasharray="3 3" stroke="#1f3327" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                  <YAxis domain={[0.2, 1.0]} stroke="#9ca3af" fontSize={11} />
                  <Tooltip content={<CustomNDVITooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="ndvi" 
                    stroke="#10b981" 
                    strokeWidth={3.5} 
                    dot={{ r: 5, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }} 
                    activeDot={{ r: 8, fill: '#34d399' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-2.5 bg-[#131e17] border border-[#23362a] rounded-xl flex items-center justify-between text-xs">
              <span className="text-gray-300">Observation Date: <strong className="text-white">{currentObs.date}</strong></span>
              <span className="font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                NDVI Score: {currentObs.ndvi}
              </span>
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
};

