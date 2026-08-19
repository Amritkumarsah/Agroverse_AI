import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  MapPin, 
  Lock, 
  User, 
  CheckCircle2, 
  Camera, 
  Upload, 
  ShieldCheck, 
  Navigation,
  Loader2,
  ArrowRight,
  Sprout,
  Building2,
  Microscope,
  KeyRound
} from 'lucide-react';
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
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'login'
}) => {
  const { setCurrentView, setRole, addNewFarm, farms, setSelectedFarmId, showToast } = useApp();
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'authority' | 'researcher'>('farmer');

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupLocation, setSignupLocation] = useState('');
  const [signupLatitude, setSignupLatitude] = useState('26.1209');
  const [signupLongitude, setSignupLongitude] = useState('85.3647');
  const [signupCrop, setSignupCrop] = useState('Wheat (HD-2967)');
  const [signupFarmSize, setSignupFarmSize] = useState('2.5');
  const [signupAvatarUrl, setSignupAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState('');

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setDetectStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetecting(true);
    setDetectStatus('Scanning satellite GPS & Wi-Fi location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const numLat = parseFloat(pos.coords.latitude.toFixed(4));
        const numLng = parseFloat(pos.coords.longitude.toFixed(4));
        setSignupLatitude(numLat.toString());
        setSignupLongitude(numLng.toString());
        
        setDetectStatus('Resolving exact city & district...');
        const cityName = await reverseGeocodeCity(numLat, numLng);
        setSignupLocation(cityName);
        setIsDetecting(false);
        setDetectStatus(`📍 Verified: ${cityName} (${numLat}°N, ${numLng}°E)`);
      },
      (err) => {
        setIsDetecting(false);
        setDetectStatus(`Location error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSignupAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    setCurrentView('overview');
    showToast(`Welcome back! Logged in as ${selectedRole.toUpperCase()}`, 'success');
    onClose();
  };

  const handleQuickDemoLogin = (farmId?: string, roleType: 'farmer' | 'authority' | 'researcher' = 'farmer') => {
    if (farmId) setSelectedFarmId(farmId);
    setRole(roleType);
    setCurrentView('overview');
    showToast(`Signed in successfully!`, 'success');
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupLocation.trim()) return;

    addNewFarm({
      farmer: signupName,
      location: signupLocation,
      latitude: parseFloat(signupLatitude) || 26.1209,
      longitude: parseFloat(signupLongitude) || 85.3647,
      farmSizeHectares: parseFloat(signupFarmSize) || 2.5,
      crop: signupCrop,
      avatarUrl: signupAvatarUrl
    });

    setRole('farmer');
    setCurrentView('overview');
    showToast(`Registration complete! Welcome ${signupName} to AGROVERSE AI`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AGROVERSE AI — Authentication Gateway"
    >
      <div className="space-y-6 text-xs font-sans text-gray-200">
        {/* Header Branding Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#122318] via-[#0d1811] to-[#152e1f] p-4 border border-emerald-500/30 shadow-lg">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold tracking-wider uppercase">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Encrypted DPI Governance</span>
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>Farmer & Institutional Access Portal</span>
              </h3>
            </div>
            
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Auth Mode Pill Selector */}
        <div className="grid grid-cols-2 rounded-2xl bg-[#0b120d] p-1.5 border border-[#1f3325] shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2.5 rounded-xl font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'login' 
                ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white border border-emerald-500/60 shadow-lg shadow-emerald-950/50 scale-[1.01]' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#121c15]'
            }`}
          >
            <LogIn className="w-4 h-4 text-emerald-400" />
            <span>Sign In / Existing Account</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-2.5 rounded-xl font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'signup' 
                ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white border border-emerald-500/60 shadow-lg shadow-emerald-950/50 scale-[1.01]' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#121c15]'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Register New Farmer</span>
          </button>
        </div>

        {/* TAB 1: SIGN IN / LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Input Credentials Box */}
            <div className="space-y-3.5 bg-[#0f1a13]/80 p-4.5 rounded-2xl border border-[#1e3425] shadow-md backdrop-blur-md">
              <div>
                <label className="block font-bold text-gray-300 mb-1.5 flex items-center gap-1.5 text-[11px]">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile Number or Farmer Email ID</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. +91 9876543210 or farmer@agrinexsus.ai"
                    className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1.5 flex items-center gap-1.5 text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Password / Security PIN</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Role Cards Picker */}
              <div className="pt-1">
                <label className="block font-bold text-gray-300 mb-2 text-[11px]">Select Access Role</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('farmer')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      selectedRole === 'farmer' 
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                        : 'bg-[#142219]/60 border-[#233c2a] text-gray-400 hover:text-white hover:bg-[#1a2e22]'
                    }`}
                  >
                    <Sprout className={`w-5 h-5 ${selectedRole === 'farmer' ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <span className="font-extrabold text-[11px]">Farmer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('authority')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      selectedRole === 'authority' 
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                        : 'bg-[#142219]/60 border-[#233c2a] text-gray-400 hover:text-white hover:bg-[#1a2e22]'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 ${selectedRole === 'authority' ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <span className="font-extrabold text-[11px]">Authority</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('researcher')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      selectedRole === 'researcher' 
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                        : 'bg-[#142219]/60 border-[#233c2a] text-gray-400 hover:text-white hover:bg-[#1a2e22]'
                    }`}
                  >
                    <Microscope className={`w-5 h-5 ${selectedRole === 'researcher' ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <span className="font-extrabold text-[11px]">Researcher</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center space-x-2 group transition-all cursor-pointer"
            >
              <span>Sign In to Farm Intelligence Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Demo Accounts */}
            <div className="space-y-2.5 pt-3 border-t border-[#1e3425]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400">Quick 1-Click Demo Profiles</span>
                <span className="text-[10px] text-gray-400 font-mono">Instant Access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('FARM-88219', 'farmer')}
                  className="p-2.5 rounded-xl bg-[#121f17] border border-[#233c2a] hover:border-emerald-500/60 hover:bg-[#1a2c20] transition-all text-left flex items-center space-x-3 group cursor-pointer"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                    className="w-9 h-9 rounded-full object-cover border border-emerald-400/60 group-hover:scale-105 transition-transform shrink-0" 
                    alt="Rajesh" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-white text-xs truncate group-hover:text-emerald-300 transition-colors">Rajesh Kumar</div>
                    <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">Muzaffarpur, Bihar</span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(farms[0]?.id, 'farmer')}
                  className="p-2.5 rounded-xl bg-[#121f17] border border-[#233c2a] hover:border-emerald-500/60 hover:bg-[#1a2c20] transition-all text-left flex items-center space-x-3 group cursor-pointer"
                >
                  <img 
                    src={farms[0]?.avatarUrl || PRESET_AVATARS[0]} 
                    className="w-9 h-9 rounded-full object-cover border border-emerald-400/60 group-hover:scale-105 transition-transform shrink-0" 
                    alt="Active" 
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-white text-xs truncate group-hover:text-emerald-300 transition-colors">{farms[0]?.name || 'Amrit Kumar Sah'}</div>
                    <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{farms[0]?.location || 'Sriperumbudur, Tamil Nadu'}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER NEW FARMER ACCOUNT */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {/* Profile Photo Selector */}
            <div className="bg-[#121f17] border border-[#233c2a] p-3.5 rounded-2xl space-y-2.5">
              <label className="block font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Farmer Profile Photo / Parcel Avatar</span>
              </label>

              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img 
                    src={signupAvatarUrl} 
                    alt="Profile Avatar" 
                    className="w-13 h-13 rounded-full object-cover border-2 border-emerald-400 shadow-md" 
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="cursor-pointer bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom Photo</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <span className="text-[10px] text-gray-400">or pick avatar:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSignupAvatarUrl(url)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          signupAvatarUrl === url ? 'border-emerald-400 scale-110 shadow-md shadow-emerald-950' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* GPS Detection Bar */}
            <div className="bg-[#121f17] border border-[#233c2a] p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>GPS Geolocation Detection</span>
                </div>
                <p className="text-[10px] text-gray-400">Fetch city, district & coordinates automatically</p>
              </div>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetecting}
                className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDetecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                <span>{isDetecting ? 'Detecting...' : 'Use GPS'}</span>
              </button>
            </div>

            {detectStatus && (
              <div className="p-2.5 rounded-xl text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800 shadow-sm">
                {detectStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">Farmer Full Name</label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">District / City Location</label>
                <input
                  type="text"
                  required
                  value={signupLocation}
                  onChange={(e) => setSignupLocation(e.target.value)}
                  placeholder="e.g. Karnal, Haryana"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">Crop Type & Variety</label>
                <input
                  type="text"
                  required
                  value={signupCrop}
                  onChange={(e) => setSignupCrop(e.target.value)}
                  placeholder="e.g. Mustard / Paddy"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">Farm Size (Hectares)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={signupFarmSize}
                  onChange={(e) => setSignupFarmSize(e.target.value)}
                  placeholder="e.g. 3.0"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center space-x-2 group transition-all cursor-pointer"
            >
              <span>Register & Launch Farm Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
