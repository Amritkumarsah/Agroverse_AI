import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SatelliteObservation, ZoneDetail } from '../../types';
import { Layers, Eye, Droplets, AlertTriangle, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  observation: SatelliteObservation;
  activeLayerOverride?: 'satellite' | 'ndvi' | 'moisture' | 'stress' | 'vegetation';
  onZoneSelect?: (zone: ZoneDetail) => void;
}

export const InteractiveSatelliteMap: React.FC<Props> = ({ 
  observation, 
  activeLayerOverride,
  onZoneSelect 
}) => {
  const { selectedFarm, theme } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ndvi' | 'moisture' | 'stress' | 'vegetation'>(activeLayerOverride || 'ndvi');
  const [selectedZone, setSelectedZone] = useState<ZoneDetail | null>(observation?.zones?.[0] || null);

  const centerLat = selectedFarm.coordinates?.[0]?.[0] || 26.1225;
  const centerLng = selectedFarm.coordinates?.[0]?.[1] || 85.3670;

  useEffect(() => {
    if (activeLayerOverride) {
      setActiveLayer(activeLayerOverride);
    }
  }, [activeLayerOverride]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      try {
        mapRef.current.remove();
        mapRef.current = null;
      } catch {}
    }

    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Dynamic Light/Dark map tiles based on app theme
      const tileUrl = theme === 'light'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19
      }).addTo(map);

      mapRef.current = map;
    } catch (e) {
      console.warn('Leaflet init warning:', e);
      return;
    }

    const coords = selectedFarm.coordinates || [
      [centerLat - 0.002, centerLng - 0.002],
      [centerLat + 0.002, centerLng - 0.002],
      [centerLat + 0.002, centerLng + 0.002],
      [centerLat - 0.002, centerLng + 0.002]
    ];

    // Determine fill color according to layer
    let fillColor = '#10b981';
    if (activeLayer === 'ndvi') fillColor = '#059669';
    else if (activeLayer === 'moisture') fillColor = '#0284c7';
    else if (activeLayer === 'stress') fillColor = '#d97706';
    else if (activeLayer === 'vegetation') fillColor = '#15803d';
    else if (activeLayer === 'satellite') fillColor = '#10b981';

    const polygonGroup = L.featureGroup().addTo(mapRef.current);

    const farmPoly = L.polygon(coords, {
      color: '#10b981',
      weight: 3,
      fillColor: fillColor,
      fillOpacity: 0.35,
      dashArray: '5, 5'
    }).addTo(polygonGroup);

    farmPoly.bindTooltip(`<b>${selectedFarm.name}</b><br/>Crop: ${selectedFarm.crop}<br/>NDVI: ${observation?.ndvi || 0.71}`);

    // Add zones if present
    if (observation?.zones && observation.zones.length > 0) {
      observation.zones.forEach((z, i) => {
        const offset = (i - 1) * 0.001;
        const zCoords: [number, number][] = [
          [centerLat + offset - 0.001, centerLng + offset - 0.001],
          [centerLat + offset + 0.001, centerLng + offset - 0.001],
          [centerLat + offset + 0.001, centerLng + offset + 0.001],
          [centerLat + offset - 0.001, centerLng + offset + 0.001]
        ];

        const zColor = z.health === 'healthy' ? '#10b981' : z.health === 'moderate' ? '#f59e0b' : '#ef4444';
        
        const zPoly = L.polygon(zCoords, {
          color: zColor,
          weight: 2,
          fillColor: zColor,
          fillOpacity: 0.5
        }).addTo(polygonGroup);

        zPoly.bindTooltip(`<b>${z.id}: ${z.name}</b><br/>NDVI: ${z.ndvi}`);
        zPoly.on('click', () => {
          setSelectedZone(z);
          if (onZoneSelect) onZoneSelect(z);
        });
      });
    }

    polygonRef.current = polygonGroup;
  }, [selectedFarm, observation, activeLayer, theme]);

  return (
    <div className="relative w-full h-[450px] lg:h-[500px] rounded-2xl overflow-hidden border border-[#23362a] shadow-2xl bg-[#09100c]">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Control Bar Top-Left */}
      <div className="absolute top-4 left-4 z-10 bg-[#111a14]/90 backdrop-blur-md border border-[#23362a] rounded-xl p-1.5 shadow-xl flex items-center space-x-1 overflow-x-auto max-w-[90%] sm:max-w-none">
        <button
          onClick={() => setActiveLayer('ndvi')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors shrink-0 ${
            activeLayer === 'ndvi' ? 'bg-emerald-600 text-white shadow' : 'text-gray-300 hover:bg-[#1a2b20]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>NDVI</span>
        </button>

        <button
          onClick={() => setActiveLayer('satellite')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors shrink-0 ${
            activeLayer === 'satellite' ? 'bg-emerald-600 text-white shadow' : 'text-gray-300 hover:bg-[#1a2b20]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>

        <button
          onClick={() => setActiveLayer('moisture')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors shrink-0 ${
            activeLayer === 'moisture' ? 'bg-emerald-600 text-white shadow' : 'text-gray-300 hover:bg-[#1a2b20]'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Soil Moisture</span>
        </button>

        <button
          onClick={() => setActiveLayer('stress')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors shrink-0 ${
            activeLayer === 'stress' ? 'bg-emerald-600 text-white shadow' : 'text-gray-300 hover:bg-[#1a2b20]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Crop Stress</span>
        </button>

        <button
          onClick={() => setActiveLayer('vegetation')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors shrink-0 ${
            activeLayer === 'vegetation' ? 'bg-emerald-600 text-white shadow' : 'text-gray-300 hover:bg-[#1a2b20]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Vegetation Health</span>
        </button>
      </div>

      {/* Map Legend Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-10 bg-[#111a14]/90 backdrop-blur-md border border-[#23362a] rounded-xl p-3 shadow-xl text-xs space-y-1.5 hidden sm:block">
        <div className="font-semibold text-gray-200 text-[11px] uppercase tracking-wider mb-1">
          {activeLayer.toUpperCase()} Index Scale
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
          <span className="text-gray-300 text-[11px]">High / Healthy ({observation?.ndvi || 0.71})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded bg-amber-500" />
          <span className="text-gray-300 text-[11px]">Moderate / Warning</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded bg-red-500" />
          <span className="text-gray-300 text-[11px]">Low / High Stress</span>
        </div>
      </div>

      {/* Zone Detail Inspector Card Bottom-Right */}
      {selectedZone && (
        <div className="absolute bottom-4 right-4 z-10 w-72 sm:w-80 bg-[#111a14]/95 backdrop-blur-md border border-emerald-500/40 rounded-xl p-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#23362a]">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                selectedZone.health === 'healthy' ? 'bg-emerald-500' :
                selectedZone.health === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <span className="font-bold text-sm text-white">{selectedZone.id}: {selectedZone.name}</span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-800">
              NDVI: {selectedZone.ndvi}
            </span>
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Moisture:</span>
              <span className="font-medium text-white">{selectedZone.moisture}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stress Level:</span>
              <span className={`font-semibold ${
                selectedZone.health === 'healthy' ? 'text-emerald-400' :
                selectedZone.health === 'moderate' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {selectedZone.stressLevel}
              </span>
            </div>
            
            <div className="pt-2 border-t border-[#23362a]">
              <p className="text-[11px] text-gray-300 bg-[#18261e] p-2 rounded-lg border border-[#294233]">
                {selectedZone.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
