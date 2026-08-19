import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MapPin, Plus, Save, Navigation, Loader2, Camera, Upload } from 'lucide-react';
import { FarmerProfile } from '../../types';
import { reverseGeocodeCity } from '../../utils/geoUtils';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (farmData: {
    farmer: string;
    location: string;
    latitude: number;
    longitude: number;
    farmSizeHectares: number;
    crop: string;
    avatarUrl?: string;
  }) => void;
  initialFarm?: FarmerProfile;
}

export const FarmManagementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialFarm
}) => {
  const [farmer, setFarmer] = useState<string>(initialFarm?.name || '');
  const [location, setLocation] = useState<string>(initialFarm?.location || '');
  const [latitude, setLatitude] = useState<string>(initialFarm?.coordinates?.[0]?.[0]?.toString() || '26.1209');
  const [longitude, setLongitude] = useState<string>(initialFarm?.coordinates?.[0]?.[1]?.toString() || '85.3647');
  const [farmSize, setFarmSize] = useState<string>(initialFarm?.farmSizeHectares?.toString() || '2.5');
  const [crop, setCrop] = useState<string>(initialFarm?.crop || 'Wheat (HD-2967)');
  const [avatarUrl, setAvatarUrl] = useState<string>(initialFarm?.avatarUrl || PRESET_AVATARS[0]);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectStatus, setDetectStatus] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setDetectStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    setDetectStatus('Detecting laptop GPS/Wi-Fi position...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const numLat = parseFloat(position.coords.latitude.toFixed(4));
        const numLng = parseFloat(position.coords.longitude.toFixed(4));
        setLatitude(numLat.toString());
        setLongitude(numLng.toString());
        if (!farmer) setFarmer('My Local Farm');

        setDetectStatus('Resolving real city & district name...');
        const cityName = await reverseGeocodeCity(numLat, numLng);
        setLocation(cityName);
        setIsDetecting(false);
        setDetectStatus(`📍 Detected Location: ${cityName} (${numLat}°N, ${numLng}°E)`);
      },
      (error) => {
        setIsDetecting(false);
        setDetectStatus(`Location error: ${error.message}. Please enter manually.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer.trim() || !location.trim()) return;

    onSave({
      farmer,
      location,
      latitude: parseFloat(latitude) || 26.1209,
      longitude: parseFloat(longitude) || 85.3647,
      farmSizeHectares: parseFloat(farmSize) || 2.5,
      crop,
      avatarUrl
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialFarm ? `Edit Farm: ${initialFarm.name}` : 'Add New Farm Parcel'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} icon={initialFarm ? Save : Plus}>
            {initialFarm ? 'Save Changes' : 'Create Farm Parcel'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Profile Photo / Avatar Picker */}
        <div className="bg-[#18261e] border border-[#294233] p-3.5 rounded-xl space-y-2.5">
          <label className="block font-bold text-gray-200 flex items-center gap-1.5 text-xs">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Profile Photo / Parcel Avatar</span>
          </label>

          <div className="flex items-center gap-3">
            <img 
              src={avatarUrl} 
              alt="Profile Avatar Preview" 
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md shrink-0" 
            />
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="cursor-pointer bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="text-[10px] text-gray-400">or pick preset:</span>
              </div>

              {/* Preset Avatars Grid */}
              <div className="flex items-center gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === url ? 'border-emerald-400 scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detect Laptop Geolocation Button */}
        <div className="bg-[#18261e] border border-[#294233] p-3 rounded-xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Detect My Laptop Geolocation</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Fetch exact GPS/Wi-Fi latitude & longitude from browser.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            icon={isDetecting ? Loader2 : Navigation}
          >
            {isDetecting ? 'Detecting...' : 'Use Laptop GPS'}
          </Button>
        </div>

        {detectStatus && (
          <div className={`p-2.5 rounded-lg text-[11px] font-mono ${
            detectStatus.includes('Detected') 
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
              : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            {detectStatus}
          </div>
        )}

        <div>
          <label className="block font-bold text-gray-300 mb-1">Farmer / Owner Name</label>
          <input
            type="text"
            required
            value={farmer}
            onChange={(e) => setFarmer(e.target.value)}
            placeholder="e.g. Ramesh Patel"
            className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-300 mb-1">Location / District</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Anand, Gujarat"
            className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-gray-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Latitude (°N)</span>
            </label>
            <input
              type="number"
              step="any"
              required
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g. 22.5726"
              className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Longitude (°E)</span>
            </label>
            <input
              type="number"
              step="any"
              required
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g. 88.3639"
              className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-gray-300 mb-1">Farm Size (Hectares)</label>
            <input
              type="number"
              step="0.1"
              required
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              placeholder="e.g. 3.2"
              className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-300 mb-1">Crop Type & Variety</label>
            <input
              type="text"
              required
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. Cotton (Bt-2)"
              className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300">
          💡 <strong>Real Data Note:</strong> Open-Meteo REST API will automatically fetch live weather for these exact coordinates once saved.
        </div>
      </form>
    </Modal>
  );
};
