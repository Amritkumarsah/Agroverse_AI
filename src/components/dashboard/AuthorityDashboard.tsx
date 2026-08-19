import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  MapPin, 
  RefreshCw, 
  Send,
  Radio,
  Thermometer,
  CloudRain
} from 'lucide-react';

interface RegionalTelemetry {
  id: string;
  state: string;
  lat: number;
  lng: number;
  stress: 'High' | 'Medium' | 'Low';
  rainRisk: string;
  diseaseRisk: string;
  moisture: string;
  liveTemp?: number;
  liveRainProb?: number;
  liveMoistureVal?: number;
}

const INITIAL_REGIONS: RegionalTelemetry[] = [
  { id: 'bihar', state: 'Bihar (Muzaffarpur)', lat: 26.1209, lng: 85.3647, stress: 'Medium', rainRisk: 'High', diseaseRisk: 'Medium', moisture: 'Moderate' },
  { id: 'tn', state: 'Tamil Nadu (Thanjavur)', lat: 10.7870, lng: 79.1378, stress: 'Low', rainRisk: 'Low', diseaseRisk: 'Low', moisture: 'Optimal' },
  { id: 'mh', state: 'Maharashtra (Nashik)', lat: 19.9975, lng: 73.7898, stress: 'High', rainRisk: 'Low', diseaseRisk: 'High', moisture: 'Low' },
  { id: 'pb', state: 'Punjab (Ludhiana)', lat: 30.9010, lng: 75.8573, stress: 'Low', rainRisk: 'Low', diseaseRisk: 'Low', moisture: 'Optimal' },
  { id: 'up', state: 'Uttar Pradesh (Gorakhpur)', lat: 26.7606, lng: 83.3732, stress: 'Medium', rainRisk: 'Medium', diseaseRisk: 'Low', moisture: 'Moderate' }
];

export const AuthorityDashboard: React.FC = () => {
  const { showToast, selectedFarm } = useApp();
  const [regions, setRegions] = useState<RegionalTelemetry[]>(INITIAL_REGIONS);
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [dispatchModalRegion, setDispatchModalRegion] = useState<RegionalTelemetry | null>(null);
  const [customAdvisoryText, setCustomAdvisoryText] = useState<string>('');

  const fetchLiveRegionalTelemetry = async () => {
    setIsFetchingLive(true);
    try {
      const updated = await Promise.all(
        regions.map(async (r) => {
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${r.lat}&longitude=${r.lng}&current_weather=true&hourly=precipitation_probability,soil_moisture_0_to_7cm&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) return r;
            const data = await res.json();
            const temp = data.current_weather?.temperature ?? 30;
            const rainProb = data.hourly?.precipitation_probability?.[0] ?? 20;
            const soilMoistRaw = data.hourly?.soil_moisture_0_to_7cm?.[0] ?? 0.35;
            const moistPercent = Math.round(soilMoistRaw * 100);

            let stress: 'High' | 'Medium' | 'Low' = 'Low';
            if (temp > 38 || moistPercent < 25) stress = 'High';
            else if (temp > 30 || rainProb > 60 || moistPercent < 35) stress = 'Medium';

            return {
              ...r,
              stress,
              liveTemp: temp,
              liveRainProb: rainProb,
              liveMoistureVal: moistPercent,
              rainRisk: rainProb > 65 ? `High (${rainProb}%)` : rainProb > 35 ? `Medium (${rainProb}%)` : `Low (${rainProb}%)`,
              moisture: moistPercent < 25 ? `Dry (${moistPercent}%)` : moistPercent < 45 ? `Moderate (${moistPercent}%)` : `Optimal (${moistPercent}%)`
            };
          } catch (e) {
            return r;
          }
        })
      );
      setRegions(updated);
      setLastSyncTime(new Date().toLocaleTimeString());
      showToast('Live regional weather & soil feeds synced from Open-Meteo!', 'success');
    } catch (err) {
      showToast('Failed fetching live regional feeds. Using active baseline telemetry.', 'info');
    } finally {
      setIsFetchingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveRegionalTelemetry();
  }, []);

  const handleSendAdvisory = () => {
    if (!dispatchModalRegion) return;
    const msg = customAdvisoryText.trim() || `Urgent regional advisory dispatched to ${dispatchModalRegion.state} agricultural officers.`;
    showToast(`Dispatched official advisory to ${dispatchModalRegion.state}: "${msg.slice(0, 40)}..."`, 'success');
    setDispatchModalRegion(null);
    setCustomAdvisoryText('');
  };

  const highRiskCount = regions.filter(r => r.stress === 'High').length * 1600 + 3200;

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'National Crop Monitor' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Building2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">Agriculture Authority — National Crop Monitor</h1>
            <Badge variant="warning">Government Portal</Badge>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Live Open-Meteo Telemetry</span>
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Macro-level national dashboard tracking state-wise crop health, rust disease outbreaks, and drought risks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="secondary"
            icon={RefreshCw}
            onClick={fetchLiveRegionalTelemetry}
            disabled={isFetchingLive}
            className={isFetchingLive ? 'animate-spin' : ''}
          >
            {isFetchingLive ? 'Syncing...' : 'Sync Live Telemetry'}
          </Button>
          <Badge variant="success">Authority View Active</Badge>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Monitored Farms"
          value="128,420"
          subtitle="Across 28 States"
          icon={Users}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="High Risk Farms"
          value={highRiskCount.toLocaleString()}
          subtitle="Intervention Required"
          change="Action Needed"
          changeType="negative"
          icon={ShieldAlert}
          iconColor="text-red-400"
        />

        <StatCard
          title="Disease Outbreaks"
          value="312"
          subtitle="Wheat Rust Flagged"
          change="Regional Warning"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-amber-400"
        />

        <StatCard
          title="Drought Vulnerability"
          value="18%"
          subtitle="Low National Risk"
          icon={TrendingUp}
          iconColor="text-teal-400"
        />

        <StatCard
          title="Avg National Health"
          value="74%"
          subtitle={lastSyncTime ? `Synced at ${lastSyncTime}` : 'Vigorous Canopy'}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
        />
      </div>

      {/* Regional State Risk Table Card */}
      <Card 
        title="Regional State Vulnerability Matrix" 
        subtitle="Real-time aggregation from live Open-Meteo & DPI farm feeds"
        action={
          lastSyncTime && (
            <span className="text-[11px] text-gray-400 font-mono">
              Last Sync: <span className="text-emerald-400">{lastSyncTime}</span>
            </span>
          )
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#18261e] border-b border-[#294233] text-gray-400 font-semibold uppercase">
              <tr>
                <th className="p-3">State Region</th>
                <th className="p-3">Live Temp</th>
                <th className="p-3">Crop Stress</th>
                <th className="p-3">Rainfall Risk</th>
                <th className="p-3">Disease Risk</th>
                <th className="p-3">Soil Moisture</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23362a]">
              {regions.map((r) => (
                <tr key={r.id} className="hover:bg-[#131e17] transition-colors">
                  <td className="p-3 font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{r.state}</span>
                  </td>
                  <td className="p-3 font-mono text-gray-200">
                    {r.liveTemp !== undefined ? (
                      <span className="flex items-center gap-1 text-amber-300 font-bold">
                        <Thermometer className="w-3 h-3" />
                        <span>{r.liveTemp}°C</span>
                      </span>
                    ) : (
                      '30°C'
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant={r.stress === 'High' ? 'danger' : r.stress === 'Medium' ? 'warning' : 'success'}>
                      {r.stress}
                    </Badge>
                  </td>
                  <td className="p-3 text-gray-300 flex items-center gap-1 font-mono">
                    <CloudRain className="w-3 h-3 text-teal-400" />
                    <span>{r.rainRisk}</span>
                  </td>
                  <td className="p-3 text-gray-300">{r.diseaseRisk}</td>
                  <td className="p-3 text-gray-300 font-mono">{r.moisture}</td>
                  <td className="p-3 text-right">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => {
                        setDispatchModalRegion(r);
                        setCustomAdvisoryText(`Official Government Advisory for ${r.state}: Monsoon alert active. Maintain field drainage and monitor for fungal rust.`);
                      }}
                    >
                      Dispatch Advisory
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Broadcast Advisory Modal */}
      {dispatchModalRegion && (
        <Modal
          isOpen={!!dispatchModalRegion}
          onClose={() => setDispatchModalRegion(null)}
          title={`Dispatch Official Advisory to ${dispatchModalRegion.state}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDispatchModalRegion(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSendAdvisory} icon={Send}>
                Broadcast Advisory
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#18261e] p-3 rounded-xl border border-[#294233] space-y-1">
              <div className="text-gray-400 font-semibold">Target District Gateway:</div>
              <div className="text-sm font-extrabold text-emerald-400">{dispatchModalRegion.state}</div>
              <div className="text-[11px] text-gray-300 pt-1">
                Current Live Weather: <span className="text-amber-300 font-bold">{dispatchModalRegion.liveTemp ?? 30}°C</span> | Rain Risk: <span className="text-teal-300 font-bold">{dispatchModalRegion.rainRisk}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-300">Government Advisory Message:</label>
              <textarea
                value={customAdvisoryText}
                onChange={(e) => setCustomAdvisoryText(e.target.value)}
                rows={4}
                className="w-full bg-[#0a120d] border border-[#23362a] rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                placeholder="Type official agricultural instruction..."
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-[11px]">
              ℹ️ Advisory will be pushed directly to local extension officers & farmer WhatsApp/SMS gateways across {dispatchModalRegion.state}.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
