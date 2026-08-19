import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Camera, CheckCircle2, Sparkles, Volume2, Upload } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useApp } from '../../context/AppContext';
import { leafVisionAnalyzer } from '../../services/leafVisionAnalyzer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmerCameraModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language, selectedFarm } = useApp();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const presetSamples = [
    {
      id: 'rust',
      title: language === 'hi' ? 'गेहूं के पत्तों पर पीले-भूरे धब्बे' : 'Yellow Rust Lesions on Wheat',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'healthy',
      title: language === 'hi' ? 'स्वस्थ हरी पत्तियां' : 'Healthy Leaf Canopy',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
    }
  ];

  const handleSelectSample = async (sample: any) => {
    setAnalyzing(true);
    setResult(null);

    const visionResult = await leafVisionAnalyzer.analyzeImage(sample.imageUrl, selectedFarm.crop);
    setAnalyzing(false);

    setResult({
      diseaseName: visionResult.diseaseName,
      status: visionResult.status === 'healthy' ? 'success' : 'warning',
      farmerAdvice: visionResult.farmerAdvice,
      steps: visionResult.recommendedSteps,
      confidence: visionResult.confidence,
      technicalDetails: visionResult.technicalDetails
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleSelectSample({ id: 'custom', title: 'Uploaded Leaf Photo', imageUrl: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSpeakResult = () => {
    if (!result) return;
    const speakText = `${result.diseaseName}. ${result.farmerAdvice}`;
    voiceService.speak(speakText, language);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'hi' ? '📷 फसल की फोटो जांच (Crop Doctor)' : '📷 AI Crop Doctor Photo Check'}
      footer={
        <Button variant="ghost" onClick={onClose}>
          {language === 'hi' ? 'बंद करें' : 'Close'}
        </Button>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-gray-300">
          {language === 'hi' 
            ? 'अपनी फसल के पत्ते की फोटो चुनें या अपलोड करें। AI आपको सरल भाषा में बीमारी और इलाज बताएगा:' 
            : 'Select a sample leaf photo or upload from camera to get instant AI disease diagnosis:'}
        </p>

        {/* Sample Selector Grid */}
        <div className="grid grid-cols-2 gap-3">
          {presetSamples.map(sample => (
            <div
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="bg-[#18261e] border border-[#294233] hover:border-emerald-500 p-2.5 rounded-xl cursor-pointer transition-all space-y-2 group"
            >
              <img src={sample.imageUrl} alt={sample.title} className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform" />
              <div className="font-bold text-white leading-tight">{sample.title}</div>
            </div>
          ))}
        </div>

        {/* Upload Custom Photo Button */}
        <div className="p-3 bg-[#131e17] border border-dashed border-[#294233] hover:border-emerald-500 rounded-xl text-center">
          <label className="cursor-pointer flex items-center justify-center space-x-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
            <Upload className="w-4 h-4" />
            <span>{language === 'hi' ? 'फोन / लैपटॉप से फोटो अपलोड करें' : 'Upload Custom Leaf Image'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {analyzing && (
          <div className="p-6 bg-[#18261e] border border-[#294233] rounded-xl text-center space-y-2">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
            <p className="font-bold text-white">{language === 'hi' ? 'फोटो की जांच हो रही है...' : 'Analyzing leaf photo with AI...'}</p>
          </div>
        )}

        {result && (
          <div className="p-4 rounded-xl border space-y-3 bg-[#111a14] border-emerald-500/50 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${result.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="font-extrabold text-sm text-white">{result.diseaseName}</span>
              </div>
              <Button size="sm" variant="secondary" icon={Volume2} onClick={handleSpeakResult}>
                {language === 'hi' ? 'सुनें' : 'Listen'}
              </Button>
            </div>

            <p className="text-gray-200 bg-[#18261e] p-3 rounded-xl border border-[#294233] leading-relaxed font-medium">
              {result.farmerAdvice}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-[#23362a]">
              <div className="font-bold text-emerald-400">{language === 'hi' ? '👉 आज आपको क्या करना है:' : '👉 Required Farmer Action:'}</div>
              {result.steps.map((st: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
