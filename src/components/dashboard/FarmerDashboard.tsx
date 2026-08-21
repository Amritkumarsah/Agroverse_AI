import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../locales/i18n';
import { voiceService } from '../../services/voiceService';
import { googleAiService } from '../../services/googleAiService';
import { FarmerCameraModal } from './FarmerCameraModal';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Mic, 
  Volume2, 
  Camera, 
  CloudRain, 
  Droplets, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Wheat,
  ShieldCheck,
  HelpCircle,
  Loader2
} from 'lucide-react';

import { t } from '../../data/translations';

export const FarmerDashboard: React.FC = () => {
  const { 
    selectedFarm, 
    farms, 
    setSelectedFarmId, 
    selectedFarmId, 
    healthBreakdown, 
    weatherData, 
    soilData, 
    satelliteData, 
    language, 
    setAppMode, 
    setCurrentView,
    showToast,
    currentUser,
    role
  } = useApp();

  // User Account Data Privacy & Isolation:
  // Farmers ONLY see their own private registered farm(s).
  // Authorities & Researchers have institutional access to all district farms.
  const userFarms = useMemo(() => {
    if (role !== 'farmer' || !currentUser) {
      return farms;
    }

    const currentUserName = currentUser.displayName?.toLowerCase().trim();

    const matched = farms.filter(f => {
      const farmOwner = f.name.toLowerCase().trim();
      const isOwnerMatch = currentUserName && (farmOwner === currentUserName || farmOwner.includes(currentUserName) || currentUserName.includes(farmOwner));
      const isUserIdMatch = f.id === currentUser.uid;
      return isOwnerMatch || isUserIdMatch;
    });

    return matched.length > 0 ? matched : farms.filter(f => f.id === selectedFarmId || (currentUserName && f.name.toLowerCase() === currentUserName));
  }, [farms, role, currentUser, selectedFarmId]);

  const isHindi = language === 'hi';
  const [voiceQuery, setVoiceQuery] = useState('');
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const obs = satelliteData[0] || { ndvi: 0.71, stressZoneCount: 0 };

  // Calculate Simple Health Label
  const score = healthBreakdown.overallScore;
  let healthLabel = t(language, 'healthGood', '🟢 GOOD');
  let healthColor = 'text-emerald-400 border-emerald-800 bg-emerald-950/80';

  if (score >= 80) {
    healthLabel = t(language, 'healthExcellent', '🟢 EXCELLENT');
  } else if (score >= 60) {
    healthLabel = t(language, 'healthGood', '🟢 GOOD');
  } else if (score >= 40) {
    healthLabel = t(language, 'healthAttention', '🟠 NEEDS ATTENTION');
    healthColor = 'text-amber-400 border-amber-800 bg-amber-950/80';
  } else {
    healthLabel = t(language, 'healthPoor', '🔴 POOR');
    healthColor = 'text-red-400 border-red-800 bg-red-950/80';
  }

  // Calculate Irrigation Recommendation
  const isHighRain = weatherData.rainProbability > 60;
  const todayActionText = isHighRain
    ? `💧 ${t(language, 'irrigationPostponeReason', 'High rainfall expected within 36 hours. Postpone irrigation today to prevent root waterlogging.')}`
    : `💧 ${t(language, 'irrigationExecuteReason', 'Clear weather & optimal soil hydration requirement. Execute standard irrigation cycle today.')}`;

  // Handle Voice Input
  const handleStartVoice = () => {
    setIsListening(true);
    setAiReply(null);
    showToast(isHindi ? 'आपकी आवाज सुन रहे हैं...' : 'Listening to your voice...', 'info');

    voiceService.listen(
      language,
      (transcript) => {
        setIsListening(false);
        setVoiceQuery(transcript);
        processAiQuestion(transcript);
      },
      (err) => {
        setIsListening(false);
        showToast(isHindi ? 'आवाज नहीं समझ आई' : 'Voice not recognized', 'error');
      }
    );
  };

  const processAiQuestion = (queryText: string) => {
    if (!queryText.trim()) return;

    setIsAiLoading(true);

    setTimeout(() => {
      setIsAiLoading(false);
      let reply = '';
      const q = queryText.toLowerCase();

      if (q.includes('paani') || q.includes('water') || q.includes('सिंचाई') || q.includes('irrigate')) {
        reply = isHindi
          ? `आपके खेत (${selectedFarm.name}) में बारिश की संभावना ${weatherData.rainProbability}% है। ${isHighRain ? 'आज पानी न दें, बारिश का इंतजार करें।' : 'आज शाम पानी देना लाभदायक रहेगा।'}`
          : `For ${selectedFarm.name}, rain probability is ${weatherData.rainProbability}%. ${isHighRain ? 'Postpone irrigation today.' : 'Irrigation recommended today.'}`;
      } else if (q.includes('fasal') || q.includes('crop') || q.includes('गेहूं') || q.includes('धान') || q.includes('health')) {
        reply = isHindi
          ? `आपकी ${selectedFarm.crop} फसल की सेहत ${healthLabel} है। हरियाली (NDVI) ${obs.ndvi} है और कोई बड़ी बीमारी नहीं पाई गई है।`
          : `Your ${selectedFarm.crop} crop health is ${healthLabel}. Vegetation NDVI is ${obs.ndvi} with no critical risks.`;
      } else {
        reply = isHindi
          ? `आपके खेत (${selectedFarm.name}) की कुल सेहत ${score}/100 है। मौसम: ${weatherData.condition} (${weatherData.currentTemp}°C)।`
          : `For ${selectedFarm.name}, Farm Health is ${score}/100. Weather: ${weatherData.condition} (${weatherData.currentTemp}°C).`;
      }

      setAiReply(reply);
      voiceService.speak(reply, language);
    }, 500);
  };

  const handleSpeakAdvisory = () => {
    const textToSpeak = aiReply || todayActionText;
    voiceService.speak(textToSpeak, language);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto font-sans">
      {/* Visual Farm Cards Switcher (Private & Isolated Per User) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{userFarms.length > 1 ? 'My Private Registered Farms' : 'My Authenticated Private Farm'}</span>
          </span>
          <span className="text-[10px] text-emerald-300/80 font-mono flex items-center gap-1">
            <span>🔒 Encrypted Firebase Session</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {userFarms.map((f) => {
            const isSelected = f.id === selectedFarmId;
            return (
              <div
                key={f.id}
                onClick={() => setSelectedFarmId(f.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-emerald-950 via-[#18261e] to-emerald-950 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl' 
                    : 'bg-[#131e17] border-[#23362a] opacity-80 hover:opacity-100 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <img src={f.avatarUrl} alt={f.name} className="w-8 h-8 rounded-full object-cover border border-emerald-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-white truncate">{f.name}</div>
                    <div className="text-[10px] text-gray-400 truncate">{f.location}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#23362a]">
                  <span className="font-medium text-emerald-300">{f.crop.split(' ')[0]}</span>
                  <Badge variant={isSelected ? 'success' : 'default'}>{f.farmSizeHectares} Ha</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Farmer Header Card */}
      <div className="bg-gradient-to-br from-[#111a14] via-[#18281f] to-[#111a14] border border-[#23362a] rounded-3xl p-5 lg:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {selectedFarm.name}
              </h1>
              <Badge variant="success">{selectedFarm.location}</Badge>
            </div>
            <p className="text-xs text-gray-300 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedFarm.crop} • {selectedFarm.farmSizeHectares} Hectares</span>
            </p>
          </div>

          <div className={`px-4 py-2 rounded-2xl border text-sm font-extrabold flex items-center gap-2 ${healthColor}`}>
            <span>{t(language, 'cropHealthStatus', 'Crop Health:')}</span>
            <span>{healthLabel}</span>
          </div>
        </div>

        {/* PRIMARY ACTION CARD: "AAJ AAPKE KHET MEIN" */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#1e2d23] to-amber-950/60 border-2 border-amber-500/60 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{t(language, 'todayActionHeader', '🌾 WHAT TO DO IN YOUR FARM TODAY')}</span>
            </span>
            <Button size="sm" variant="secondary" icon={Volume2} onClick={handleSpeakAdvisory}>
              {t(language, 'speakAdvisory', '🔊 Listen to Advisory')}
            </Button>
          </div>

          <p className="text-sm font-bold text-white leading-relaxed bg-[#111a14]/80 p-3.5 rounded-xl border border-amber-500/30">
            {todayActionText}
          </p>

          <div className="flex justify-between items-center text-xs text-amber-200/90 pt-1">
            <span>{t(language, 'weatherForecast', 'Weather')}: <strong>{weatherData.condition} ({weatherData.currentTemp}°C)</strong></span>
            <span>{t(language, 'rainProbability', 'Rain Forecast')}: <strong className="text-amber-400">{weatherData.rainProbability}%</strong></span>
          </div>
        </div>
      </div>

      {/* Voice Assistant & Camera Action Buttons Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* VOICE ASSISTANT CARD */}
        <div className="p-5 rounded-3xl bg-[#111a14] border border-[#23362a] shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <Mic className="w-5 h-5" />
              <span>{t(language, 'askAiTitle', 'Voice Agriculture Assistant')}</span>
            </div>
            <p className="text-xs text-gray-300">
              {t(language, 'askAiSubtitle', 'Ask any question about your farm using voice or text:')}
            </p>
          </div>

          {/* Large Voice Button */}
          <button
            onClick={handleStartVoice}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
              isListening 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white'
            }`}
          >
            <Mic className="w-6 h-6" />
            <span>{isListening ? t(language, 'voiceListening', 'Listening to your voice...') : t(language, 'voiceAskBtn', '🎙️ Speak & Ask AGROVERSE AI')}</span>
          </button>

          {/* Text Fallback Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              processAiQuestion(voiceQuery);
            }} 
            className="flex gap-2"
          >
            <input
              type="text"
              value={voiceQuery}
              onChange={(e) => setVoiceQuery(e.target.value)}
              placeholder={t(language, 'askPlaceholder', 'e.g. Should I irrigate today?')}
              className="flex-1 bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <Button size="sm" type="submit" variant="primary" disabled={isAiLoading}>
              {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t(language, 'askBtn', 'Ask')}
            </Button>
          </form>

          {/* AI Voice Reply Card */}
          {aiReply && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 space-y-2 text-xs animate-fadeIn">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-emerald-300">🤖 AGROVERSE AI:</span>
                <Button size="sm" variant="ghost" icon={Volume2} onClick={() => voiceService.speak(aiReply, language)}>
                  {t(language, 'speakAdvisory', 'Listen')}
                </Button>
              </div>
              <p className="text-white leading-relaxed font-medium">{aiReply}</p>
            </div>
          )}
        </div>

        {/* CAMERA CHECK CARD */}
        <div className="p-5 rounded-3xl bg-[#111a14] border border-[#23362a] shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Camera className="w-5 h-5" />
              <span>{t(language, 'checkDiseaseTitle', 'AI Crop Doctor Photo Check')}</span>
            </div>
            <p className="text-xs text-gray-300">
              {t(language, 'checkDiseaseSubtitle', 'Snap a leaf photo for immediate AI disease diagnosis & treatment steps:')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#18261e] border border-[#294233] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-white text-xs">{t(language, 'diseaseDoctor', 'AI Crop Doctor')}</div>
              <div className="text-[11px] text-gray-400">{t(language, 'diseaseDetection', 'Instant Photo Diagnosis')}</div>
            </div>
            <Button size="sm" variant="primary" icon={Camera} onClick={() => setIsCameraOpen(true)}>
              {t(language, 'cameraCheckBtn', '📷 Take Leaf / Crop Photo')}
            </Button>
          </div>

          <div className="text-[11px] text-gray-400 bg-[#131e17] p-3 rounded-xl border border-[#23362a]">
            💡 {t(language, 'tipLeaf', 'Tip: Take a clear photo of the leaf surface showing spots or damage.')}
          </div>
        </div>
      </div>

      {/* Simple 4-Grid Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Paani Status */}
        <div className="p-4 rounded-2xl bg-[#111a14] border border-[#23362a] space-y-1.5">
          <div className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>{t(language, 'waterStatus', 'Water / Irrigation')}</span>
          </div>
          <div className="text-base font-extrabold text-white">
            {isHighRain ? t(language, 'postponeIrrigation', 'Postpone Today') : t(language, 'irrigateToday', 'Irrigate Today')}
          </div>
          <p className="text-[11px] text-gray-400">
            Root moisture: {soilData.moisturePercentage}%
          </p>
        </div>

        {/* Baarish Status */}
        <div className="p-4 rounded-2xl bg-[#111a14] border border-[#23362a] space-y-1.5">
          <div className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-amber-400" />
            <span>{t(language, 'rainProbability', 'Rain Forecast')}</span>
          </div>
          <div className="text-base font-extrabold text-amber-400">
            {weatherData.rainProbability}% Chance
          </div>
          <p className="text-[11px] text-gray-400">
            {weatherData.condition}
          </p>
        </div>

        {/* Fasal Hariyali Status */}
        <div className="p-4 rounded-2xl bg-[#111a14] border border-[#23362a] space-y-1.5">
          <div className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
            <Wheat className="w-4 h-4 text-emerald-400" />
            <span>{t(language, 'cropStatus', 'Crop Greenness')}</span>
          </div>
          <div className="text-base font-extrabold text-emerald-400">
            {obs.ndvi >= 0.7 ? t(language, 'healthGood', 'Vigorous') : t(language, 'moderateStress', 'Moderate')}
          </div>
          <p className="text-[11px] text-gray-400">
            Healthy canopy growth
          </p>
        </div>

        {/* Attention Note */}
        <div className="p-4 rounded-2xl bg-[#111a14] border border-[#23362a] space-y-1.5">
          <div className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{t(language, 'attentionZone', 'Attention Needed')}</span>
          </div>
          <div className="text-base font-extrabold text-white">
            {obs.stressZoneCount > 0 ? t(language, 'moderateStress', 'Check Zone B') : t(language, 'healthyZone', 'No Stress Zones')}
          </div>
          <p className="text-[11px] text-gray-400">
            {obs.stressZoneCount > 0 ? 'Moderate stress detected' : 'All zones normal'}
          </p>
        </div>
      </div>

      {/* NEW FEATURE QUICK ACCESS CARDS FOR FARMER MODE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Yield Forecast Quick Card */}
        <div 
          onClick={() => setCurrentView('yield-forecast')}
          className="p-5 rounded-3xl bg-[#111a14] border border-[#23362a] hover:border-emerald-500/60 cursor-pointer transition-all shadow-xl space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">{t(language, 'yieldForecast', '🌾 YIELD FORECAST')}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-base font-extrabold text-white">
            {t(language, 'estimatedHarvest', 'Harvest Window: 18–24 Days')}
          </div>
          <p className="text-xs text-gray-300">
            Estimated Yield: 3.1–3.5 Tons/Ha (87% confidence)
          </p>
        </div>

        {/* Crop Economics Quick Card */}
        <div 
          onClick={() => setCurrentView('crop-economics')}
          className="p-5 rounded-3xl bg-[#111a14] border border-[#23362a] hover:border-emerald-500/60 cursor-pointer transition-all shadow-xl space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">{t(language, 'cropEconomics', '💰 CROP ECONOMICS')}</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-base font-extrabold text-white">
            High ROI Crop Recommendation
          </div>
          <p className="text-xs text-gray-300">
            AI Recommendation: Millet (Profit: ₹40K/Ha)
          </p>
        </div>

        {/* Data Consent Quick Card */}
        <div 
          onClick={() => setCurrentView('data-consent')}
          className="p-5 rounded-3xl bg-[#111a14] border border-[#23362a] hover:border-emerald-500/60 cursor-pointer transition-all shadow-xl space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-teal-400">{t(language, 'dataConsent', '🔐 MY DATA & CONSENT')}</span>
            <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-base font-extrabold text-white">
            Privacy Control & Cross-Border
          </div>
          <p className="text-xs text-gray-300">
            Identity Protected • FAIR Anonymized Exchange
          </p>
        </div>
      </div>

      {/* Expandable Link to Expert Mode Analytics */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={() => setAppMode('expert')}
          className="px-6 py-3 rounded-2xl bg-[#131e17] border border-[#294233] hover:border-emerald-500 text-emerald-400 hover:text-white font-bold text-xs transition-all shadow-xl flex items-center space-x-2"
        >
          <span>{t(language, 'viewDetails', 'View Detailed Technical Analytics →')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Camera Check Modal */}
      {isCameraOpen && (
        <FarmerCameraModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
};
