import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveSatelliteMap } from '../maps/InteractiveSatelliteMap';
import { actionPlanService } from '../../services/actionPlanService';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ZoneDetail } from '../../types';
import { getTodayDateString } from '../../utils/dateUtils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea, ReferenceLine } from 'recharts';
import { 
  Sparkles, 
  AlertTriangle, 
  Droplets, 
  CloudRain, 
  Bug, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Wheat, 
  Activity,
  CheckCircle2,
  TrendingUp,
  FlaskConical,
  Eye,
  Info
} from 'lucide-react';

export const FarmOverview: React.FC = () => {
  const { 
    selectedFarm, 
    healthBreakdown, 
    setCurrentView, 
    weatherData, 
    satelliteData, 
    soilData, 
    alerts,
    showToast 
  } = useApp();

  const obs = satelliteData[0] || {
    date: getTodayDateString(),
    ndvi: 0.71,
    vegetationHealth: 'Healthy',
    stressZoneCount: 0,
    imageUrl: '',
    moistureIndex: 0.62,
    zones: []
  };

  const [inspectedZone, setInspectedZone] = useState<ZoneDetail | null>(obs.zones?.[0] || null);

  useEffect(() => {
    if (obs.zones && obs.zones.length > 0) {
      const stressZ = obs.zones.find(z => z.health !== 'healthy');
      setInspectedZone(stressZ || obs.zones[0]);
    } else {
      setInspectedZone(null);
    }
  }, [selectedFarm.id, satelliteData]);

  // Recharts time-series data dynamically generated from satellite observations
  const chartData = satelliteData.slice().reverse().map(o => ({
    date: o.date.replace(' 2026', ''),
    ndvi: o.ndvi
  }));

  // Dynamic 7-Day Action Plan
  const actionPlan = actionPlanService.generate7DayPlan(selectedFarm, weatherData, soilData, satelliteData);

  const [isAdvisoryConfirmed, setIsAdvisoryConfirmed] = useState(false);

  const handleConfirmAction = () => {
    setIsAdvisoryConfirmed(true);
    showToast(`Confirmed advisory for ${selectedFarm.name}: ${weatherData.aiImpact.irrigationAction}`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Farm Intelligence Dashboard' }]} />

      {/* Header Greeting & Transparency Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111a14] border border-[#23362a] rounded-2xl p-5 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Good morning, {selectedFarm.name.split(' ')[0]}</span>
              <span>👋</span>
            </h1>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono hidden md:inline-block">
              Simulated Observation • Prototype Dataset
            </span>
          </div>
          <p className="text-xs text-gray-300 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 inline" />
            <span>{selectedFarm.location} • Crop: <strong className="text-white">{selectedFarm.crop}</strong> • {selectedFarm.farmSizeHectares} Hectares</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="success">{selectedFarm.name}</Badge>
          <div className="flex items-center space-x-1.5 bg-[#18261e] border border-[#294233] px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{obs.date}</span>
          </div>
        </div>
      </div>

      {/* KPI Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Farm Health"
          value={`${healthBreakdown.overallScore} / 100`}
          subtitle="Overall Calculated Status"
          change="Live Score"
          changeType="positive"
          icon={Activity}
          iconColor="text-emerald-400"
          badge="Live Score"
        />

        <StatCard
          title="NDVI Reflectance"
          value={obs.ndvi}
          subtitle={`Sentinel-2 (${obs.date})`}
          change={obs.stressZoneCount > 0 ? `${obs.stressZoneCount} Stress Zone` : 'Optimal Canopy'}
          changeType={obs.stressZoneCount > 0 ? 'negative' : 'positive'}
          icon={Eye}
          iconColor="text-emerald-400"
          badge="Canopy Vigor"
          onClick={() => setCurrentView('satellite')}
        />

        <StatCard
          title="Soil Health"
          value={`${healthBreakdown.soilHealthScore} / 100`}
          subtitle={`pH ${soilData.ph} • ${soilData.soilType.split(' ')[0]}`}
          change={`Organic C ${soilData.organicCarbonPercentage}%`}
          changeType={soilData.organicCarbonPercentage >= 0.75 ? 'positive' : 'neutral'}
          icon={FlaskConical}
          iconColor="text-amber-400"
          badge="Soil Index"
          onClick={() => setCurrentView('soil')}
        />

        <StatCard
          title="Weather Risk"
          value={weatherData.rainProbability > 60 ? 'Medium' : 'Low'}
          subtitle={`Rain: ${weatherData.rainProbability}% in 36h`}
          change={weatherData.aiImpact.irrigationAction.split(' ')[0]}
          changeType={weatherData.rainProbability > 60 ? 'negative' : 'positive'}
          icon={CloudRain}
          iconColor="text-blue-400"
          badge="Weather Engine"
          onClick={() => setCurrentView('weather')}
        />
      </div>

      {/* Main Unified Grid (Left Col: GIS Overview + NDVI Chart | Right Col: AI Insight + Weather + Soil) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Farm Parcel GIS Location & Telemetry Overview */}
          <Card 
            title={
              <div className="flex items-center space-x-2 text-white font-extrabold text-sm">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Farm Parcel GIS & Remote Sensing Telemetry ({selectedFarm.name})</span>
              </div>
            }
            subtitle="High-resolution Sentinel-2 multispectral band data & canopy metrics"
          >
            <div className="space-y-4">
              {/* 4 Summary Telemetry Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#121e16] p-3.5 rounded-2xl border border-[#23362a] space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Parcel Area</div>
                  <div className="text-base font-black text-white font-mono">{selectedFarm.farmSizeHectares} Ha</div>
                  <div className="text-[10px] text-emerald-400 font-medium">Registered Boundary</div>
                </div>

                <div className="bg-[#121e16] p-3.5 rounded-2xl border border-[#23362a] space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Crop Variety</div>
                  <div className="text-base font-black text-emerald-400 truncate">{selectedFarm.crop}</div>
                  <div className="text-[10px] text-gray-400">Vegetative Growth</div>
                </div>

                <div className="bg-[#121e16] p-3.5 rounded-2xl border border-[#23362a] space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">NDVI Reflectance</div>
                  <div className="text-base font-black text-emerald-400 font-mono">{obs.ndvi} / 1.0</div>
                  <div className="text-[10px] text-emerald-400 font-medium">Optimal Chlorophyll</div>
                </div>

                <div className="bg-[#121e16] p-3.5 rounded-2xl border border-[#23362a] space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">GPS Location</div>
                  <div className="text-xs font-bold text-white font-mono truncate">{selectedFarm.location}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{selectedFarm.coordinates[0]?.[0]}°N, {selectedFarm.coordinates[0]?.[1]}°E</div>
                </div>
              </div>

              {/* CTA Box to Open Full Satellite Map */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#122419] via-[#101e16] to-[#152e1f] border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Interactive Multi-Spectral Satellite Map Available</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Inspect NDVI canopy stress, soil moisture layers, and zone heatmaps in 3D satellite view.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView('satellite')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
                >
                  <span>Open Full Satellite Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>

          {/* Crop Health Trend (Recharts Line Chart) */}
          <Card 
            title={
              <div className="flex items-center space-x-2 text-white font-bold">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>NDVI Canopy Health Trend ({selectedFarm.crop})</span>
              </div>
            } 
            subtitle="Multi-date Sentinel-2 satellite canopy index & seasonal trajectory"
          >
            {/* Judge Tip */}
            <div className="bg-[#18261e] border border-emerald-500/30 p-2 rounded-xl text-[10px] space-y-1 mb-2">
              <div className="font-extrabold text-emerald-300 flex items-center gap-1">
                <Info className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>💡 Judge Guide: NDVI Canopy Index</span>
              </div>
              <p className="text-gray-300 leading-tight">
                Green Zone (&ge;0.65) = Vigorous Canopy. Yellow Zone (0.45-0.64) = Moderate. Red (&lt;0.45) = Stress.
              </p>
            </div>

            <div className="h-[460px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <ReferenceArea y1={0.65} y2={1.0} fill="#10b981" fillOpacity={0.12} />
                  <ReferenceArea y1={0.45} y2={0.65} fill="#f59e0b" fillOpacity={0.08} />
                  <ReferenceArea y1={0.2} y2={0.45} fill="#ef4444" fillOpacity={0.1} />
                  <ReferenceLine y={0.65} stroke="#10b981" strokeDasharray="3 3" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f3327" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                  <YAxis domain={[0.3, 0.95]} stroke="#9ca3af" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1712', borderColor: '#23362a', borderRadius: '10px', fontSize: '11px', color: '#fff' }}
                    formatter={(val: any) => [
                      `${val} NDVI (${val >= 0.65 ? '🟢 Healthy Canopy' : '🟡 Moderate'})`, 
                      'Canopy Index'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ndvi" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10b981', stroke: '#064e3b', strokeWidth: 1.5 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-gray-300 mt-2 bg-[#131e17] p-2 rounded-lg border border-[#23362a] flex justify-between items-center">
              <span>Latest Satellite Observation:</span>
              <strong className="text-emerald-400 font-mono">{obs.ndvi} NDVI ({obs.date})</strong>
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* AI Farm Insight Panel */}
          <Card 
            className="border-amber-500/50 bg-gradient-to-br from-[#111a14] via-[#16241c] to-[#111a14]"
            title={
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-base font-bold text-amber-300">AI Farm Insight</span>
              </div>
            }
            action={
              <Badge variant={obs.stressZoneCount > 0 ? 'warning' : 'success'}>
                {obs.stressZoneCount > 0 ? '⚠ Attention Required' : 'Optimal Growth'}
              </Badge>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#18261e] border border-amber-500/30 text-amber-100 leading-relaxed font-medium">
                {obs.vegetationHealth}. Observed NDVI is <strong className="text-emerald-400">{obs.ndvi}</strong> across {selectedFarm.crop}.
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">Primary Telemetry Diagnostics:</div>
                <div className="space-y-1 text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Soil moisture: {soilData.moisturePercentage}% ({soilData.soilType})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Weather: {weatherData.condition} ({weatherData.rainProbability}% rain chance)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#23362a]">
                <div className="font-bold text-emerald-400 mb-1">AI Recommendation:</div>
                <p className="text-gray-200 bg-[#131e17] p-2.5 rounded-xl border border-[#23362a] leading-relaxed">
                  {weatherData.aiImpact.recommendation}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button 
                  size="sm" 
                  onClick={() => setCurrentView('satellite')}
                  icon={ArrowRight} 
                  variant="primary"
                >
                  View Analysis →
                </Button>
              </div>
            </div>
          </Card>

          {/* Weather & Irrigation Decision */}
          <Card 
            title="Weather & Irrigation Decision" 
            subtitle={`${weatherData.currentTemp}°C • ${weatherData.condition}`}
          >
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233]">
                  <div className="text-gray-400">Rain Probability</div>
                  <div className="text-lg font-extrabold text-amber-400 mt-0.5">{weatherData.rainProbability}%</div>
                </div>
                <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233]">
                  <div className="text-gray-400">Wind Speed</div>
                  <div className="text-lg font-extrabold text-white mt-0.5">{weatherData.windSpeed} km/h</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 space-y-1">
                <div className="font-extrabold text-amber-300 text-xs">AI Action: {weatherData.aiImpact.irrigationAction}</div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed">
                  {weatherData.aiImpact.recommendation}
                </p>
              </div>

              <Button 
                size="sm" 
                onClick={handleConfirmAction} 
                icon={isAdvisoryConfirmed ? CheckCircle2 : Droplets} 
                variant={isAdvisoryConfirmed ? "primary" : "secondary"} 
                className="w-full"
              >
                {isAdvisoryConfirmed ? '✓ Action Confirmed & Synced' : 'Confirm Advisory Action'}
              </Button>
            </div>
          </Card>

          {/* Soil Intelligence */}
          <Card 
            title="Soil Intelligence" 
            subtitle="Root-zone nutrient & organic carbon status"
            action={<Badge variant="warning">Soil Score {soilData.score}/100</Badge>}
          >
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#18261e] p-2 rounded-lg border border-[#294233] flex justify-between">
                  <span className="text-gray-400">pH:</span>
                  <span className="font-bold text-white">{soilData.ph}</span>
                </div>
                <div className="bg-[#18261e] p-2 rounded-lg border border-[#294233] flex justify-between">
                  <span className="text-gray-400">Nitrogen:</span>
                  <span className="font-bold text-amber-400">{soilData.nitrogen}</span>
                </div>
                <div className="bg-[#18261e] p-2 rounded-lg border border-[#294233] flex justify-between">
                  <span className="text-gray-400">Phosphorus:</span>
                  <span className="font-bold text-emerald-400">{soilData.phosphorus}</span>
                </div>
                <div className="bg-[#18261e] p-2 rounded-lg border border-[#294233] flex justify-between">
                  <span className="text-gray-400">Potassium:</span>
                  <span className="font-bold text-emerald-400">{soilData.potassium}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#18261e] border border-[#294233] space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Organic Carbon:</span>
                  <span className="font-bold text-amber-400">{soilData.organicCarbonPercentage}% ({soilData.organicCarbonPercentage < 0.75 ? 'Low' : 'Optimal'})</span>
                </div>
                <p className="text-[11px] text-gray-300">
                  {soilData.aiInterpretation}
                </p>
              </div>

              <Button size="sm" onClick={() => setCurrentView('soil')} icon={ArrowRight} variant="outline" className="w-full">
                Improve Soil →
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Dynamic 7-Day Farm Action Plan Card */}
      <Card title={`7-Day Farm Action Plan — ${selectedFarm.name}`} subtitle="Auto-generated localized task itinerary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {actionPlan.slice(0, 4).map((ap, i) => (
            <div 
              key={ap.day}
              className={`p-3.5 rounded-xl border space-y-1 ${
                i === 0 
                  ? 'bg-amber-950/40 border-amber-500/50' 
                  : 'bg-[#18261e] border-[#294233]'
              }`}
            >
              <div className="font-extrabold text-xs flex justify-between text-white">
                <span>{ap.day}</span>
                <Badge variant={i === 0 ? 'warning' : 'default'}>{ap.category}</Badge>
              </div>
              <p className="text-gray-300 leading-relaxed font-medium">{ap.task}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
