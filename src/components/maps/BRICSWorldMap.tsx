import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { BRICSCountry } from '../../types';
import { BRICS_COUNTRIES } from '../../data/demoData';
import { Globe, Cpu, Database } from 'lucide-react';

interface Props {
  onCountrySelect?: (country: BRICSCountry) => void;
}

export const BRICSWorldMap: React.FC<Props> = ({ onCountrySelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<BRICSCountry>(BRICS_COUNTRIES[0]); // India

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
        center: [20, 30],
        zoom: 2,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 6,
        minZoom: 2
      }).addTo(map);

      // Add Country Markers & Connection Polylines to India
      const indiaCoords: [number, number] = [20.5937, 78.9629];

      BRICS_COUNTRIES.forEach((c) => {
        // Draw connection beam from India to other BRICS countries
        if (c.code !== 'IN') {
          L.polyline([indiaCoords, [c.lat, c.lng]], {
            color: '#10b981',
            weight: 2,
            opacity: 0.6,
            dashArray: '8, 8'
          }).addTo(map);
        }

        // Custom div icon with country flag
        const customIcon = L.divIcon({
          className: 'brics-marker',
          html: `<div style="background:#111a14; border:2px solid #22c55e; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 0 15px rgba(34,197,94,0.5); cursor:pointer;">${c.flag}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([c.lat, c.lng], { icon: customIcon }).addTo(map);
        marker.bindTooltip(`<b>${c.flag} ${c.name}</b><br/>${c.activeModelsCount} AI Models Shared`, { permanent: false });
        
        marker.on('click', () => {
          setSelectedCountry(c);
          if (onCountrySelect) onCountrySelect(c);
        });
      });

      mapRef.current = map;
    } catch (e) {
      console.warn('BRICS Map init warning:', e);
    }
  }, []);

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-[#23362a] shadow-2xl bg-[#09100c]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Title Badge Top-Left */}
      <div className="absolute top-4 left-4 z-10 bg-[#111a14]/90 backdrop-blur-md border border-[#23362a] rounded-xl p-3 shadow-xl max-w-sm">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
          <Globe className="w-4 h-4" />
          <span>BRICS Agriculture Intelligence Network</span>
        </div>
        <p className="text-[11px] text-gray-300 mt-1 leading-normal">
          Interoperable AI model exchange connecting India, Brazil, Russia, China & South Africa.
        </p>
      </div>

      {/* Selected Country Details Card Top-Right */}
      {selectedCountry && (
        <div className="absolute top-4 right-4 z-10 w-72 bg-[#111a14]/95 backdrop-blur-md border border-emerald-500/40 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#23362a]">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span className="font-extrabold text-base text-white">{selectedCountry.name}</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {selectedCountry.status}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between items-center bg-[#18261e] p-2 rounded-lg border border-[#294233]">
              <span className="text-gray-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Active Models:
              </span>
              <span className="font-bold text-white text-sm">{selectedCountry.activeModelsCount}</span>
            </div>
            <div className="flex justify-between items-center bg-[#18261e] p-2 rounded-lg border border-[#294233]">
              <span className="text-gray-400 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> Shared Datasets:
              </span>
              <span className="font-bold text-white text-sm">{selectedCountry.sharedDatasetsCount}</span>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-semibold text-gray-400 mb-1">Key Agricultural Crops:</div>
              <div className="flex flex-wrap gap-1">
                {selectedCountry.keyCrops.map((crop) => (
                  <span key={crop} className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
