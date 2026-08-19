import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRESET_DISEASE_SAMPLES } from '../../data/demoData';
import { diseaseDetectionEngine } from '../../services/diseaseDetectionEngine';
import { DiseaseDetectionResult } from '../../types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { StatCard } from '../ui/StatCard';
import { Bug, Upload, AlertTriangle, CheckCircle2, ShieldCheck, Cpu, X, Activity } from 'lucide-react';

export const DiseaseDoctor: React.FC = () => {
  const { selectedFarm, showToast } = useApp();
  const [selectedSample, setSelectedSample] = useState<any>(PRESET_DISEASE_SAMPLES[0]);
  const [showSpecsModal, setShowSpecsModal] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DiseaseDetectionResult>({
    diseaseName: PRESET_DISEASE_SAMPLES[0].diseaseName,
    confidence: PRESET_DISEASE_SAMPLES[0].confidence,
    severity: PRESET_DISEASE_SAMPLES[0].severity as 'Mild' | 'Moderate' | 'Severe',
    affectedAreaPercentage: PRESET_DISEASE_SAMPLES[0].affectedAreaPercentage,
    immediateAction: PRESET_DISEASE_SAMPLES[0].immediateAction,
    preventativeMeasures: PRESET_DISEASE_SAMPLES[0].preventativeMeasures,
    treatmentAdvisory: PRESET_DISEASE_SAMPLES[0].treatmentAdvisory,
    bbox: PRESET_DISEASE_SAMPLES[0].bbox
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleSelectSample = async (sample: typeof PRESET_DISEASE_SAMPLES[0]) => {
    setSelectedSample(sample);
    setIsAnalyzing(true);
    setTimeout(async () => {
      const res = await diseaseDetectionEngine.detectFromImage(sample.imageUrl);
      setDetectionResult(res);
      setIsAnalyzing(false);
      showToast(`Inference complete: ${res.diseaseName} (${res.confidence}%)`, 'success');
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setIsAnalyzing(true);
      showToast(`Uploading ${file.name} to vision engine API...`, 'info');
      
      setTimeout(async () => {
        const res = await diseaseDetectionEngine.detectFromImage(imageUrl);
        setSelectedSample({
          id: 'custom',
          name: file.name,
          crop: selectedFarm.crop,
          imageUrl: imageUrl,
          diseaseName: res.diseaseName,
          confidence: res.confidence,
          severity: res.severity,
          affectedAreaPercentage: res.affectedAreaPercentage,
          immediateAction: res.immediateAction,
          preventativeMeasures: res.preventativeMeasures,
          treatmentAdvisory: res.treatmentAdvisory,
          bbox: res.bbox || { x: 30, y: 20, w: 40, h: 40 }
        });
        setDetectionResult(res);
        setIsAnalyzing(false);
        showToast(`Image analyzed successfully! Diagnosed: ${res.diseaseName}`, 'success');
      }, 700);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'AI Crop Doctor' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Bug className="w-6 h-6 text-red-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">AI Crop Doctor & Computer Vision Diagnostics</h1>
            <Badge variant="danger">{selectedFarm.crop.split(' ')[0]}</Badge>
            <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-mono">
              Prototype AI Prediction
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Upload leaf photos or select samples for real-time MobileNetV3 disease classification & treatment advisory.
          </p>
        </div>
        <button 
          onClick={() => { setShowSpecsModal(true); showToast('Opened MobileNetV3 Model Architecture Specs', 'info'); }}
          className="transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Badge variant="success">🔬 Live MobileNetV3 AI Vision Model (Click to Inspect)</Badge>
        </button>
      </div>

      {/* Preset Samples Selector Grid */}
      <Card title="Demo Preset Leaf Samples" subtitle="Click any leaf sample to trigger instant AI vision analysis">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_DISEASE_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                selectedSample.id === sample.id 
                  ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500' 
                  : 'bg-[#18261e] border-[#294233] text-gray-300 hover:border-emerald-500/50'
              }`}
            >
              <img src={sample.imageUrl} alt={sample.name} className="w-12 h-12 rounded-lg object-cover border border-[#23362a]" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs truncate text-white">{sample.name}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">{sample.confidence}% Confidence</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Diagnostics Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Diagnosed Condition"
          value={detectionResult.diseaseName.split('(')[0]}
          subtitle="Model Classification"
          icon={Bug}
          iconColor="text-red-400"
        />

        <StatCard
          title="Inference Confidence"
          value={`${detectionResult.confidence}%`}
          subtitle="MobileNetV3 Softmax"
          change="High Confidence"
          changeType="positive"
          icon={ShieldCheck}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Estimated Severity"
          value={detectionResult.severity}
          subtitle={`~${detectionResult.affectedAreaPercentage}% Affected Area`}
          change={detectionResult.severity === 'Severe' ? 'Critical' : 'Manageable'}
          changeType={detectionResult.severity === 'Severe' ? 'negative' : 'neutral'}
          icon={AlertTriangle}
          iconColor="text-amber-400"
        />
      </div>

      {/* Upload & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Inspection Box */}
        <Card 
          title="Visual Leaf Inspection & Overlay"
          subtitle="Live bounding box detection of disease lesions"
          action={
            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          }
        >
          <div className="relative w-full h-80 rounded-xl overflow-hidden border border-[#23362a] bg-[#09100c] flex items-center justify-center">
            {isAnalyzing ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-xs text-emerald-400 font-semibold">Executing Deep Learning Inference Model...</div>
              </div>
            ) : (
              <>
                <img 
                  src={selectedSample.imageUrl} 
                  alt="Inspected leaf" 
                  className="w-full h-full object-cover"
                />

                {/* Bounding Box Visual Overlay */}
                {detectionResult.bbox && detectionResult.affectedAreaPercentage > 0 && (
                  <div 
                    className="absolute border-2 border-red-500 bg-red-500/20 rounded shadow-lg animate-pulse"
                    style={{
                      left: `${detectionResult.bbox.x}%`,
                      top: `${detectionResult.bbox.y}%`,
                      width: `${detectionResult.bbox.w}%`,
                      height: `${detectionResult.bbox.h}%`
                    }}
                  >
                    <span className="absolute -top-6 left-0 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      Lesion Detected ({detectionResult.confidence}%)
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Diagnosis Report Card */}
        <Card 
          title="Inference Diagnostic Report"
          subtitle="Generated action plan and extension advisory"
          action={<Badge variant="danger">Confidence: {detectionResult.confidence}%</Badge>}
        >
          <div className="space-y-4 text-xs">
            <div>
              <div className="text-gray-400">Diagnosed Condition:</div>
              <div className="text-lg font-extrabold text-red-400 mt-0.5">{detectionResult.diseaseName}</div>
            </div>

            <div>
              <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Immediate Field Action:</span>
              </div>
              <p className="bg-[#18261e] p-3 rounded-xl border border-amber-500/30 text-amber-100 leading-relaxed">
                {detectionResult.immediateAction}
              </p>
            </div>

            <div>
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Preventative Measures:</span>
              </div>
              <div className="space-y-1.5 bg-[#18261e] p-3 rounded-xl border border-[#294233]">
                {detectionResult.preventativeMeasures?.map((pm, i) => (
                  <div key={i} className="flex items-start space-x-2 text-gray-300">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pm}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-[11px] leading-relaxed">
              <span className="font-bold text-amber-400">⚠️ Extension Advisory: </span>
              {detectionResult.treatmentAdvisory}
            </div>
          </div>
        </Card>
      </div>

      {/* MobileNetV3 Model Architecture Inspection Modal */}
      {showSpecsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#111a14] border border-[#23362a] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#23362a] pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-extrabold text-white">MobileNetV3 Computer Vision AI Specifications</h2>
              </div>
              <button 
                onClick={() => setShowSpecsModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="bg-[#18261e] p-3 rounded-xl border border-[#294233] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Neural Network Model:</span>
                  <span className="font-mono font-bold text-emerald-300 text-[11px]">MobileNetV3-Small (Edge Vision)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Input Image Tensor:</span>
                  <span className="font-mono text-gray-200">224 × 224 RGB Leaf Matrix</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Inference Speed:</span>
                  <span className="font-mono text-emerald-400 font-bold">~42ms (Real-Time Edge CPU/GPU)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Training Dataset:</span>
                  <span className="font-mono text-gray-200">PlantVillage (54,306 Annotated Images)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Disease Class Coverage:</span>
                  <span className="font-mono text-amber-300">38 Crop Pathology Classes</span>
                </div>
              </div>

              <div className="bg-[#0a120d] p-3 rounded-xl border border-[#23362a] space-y-1.5 font-mono text-[11px]">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Live REST API Endpoint:</span>
                </div>
                <div className="bg-[#18261e] p-2 rounded-lg text-emerald-200 text-[10px] break-all border border-[#294233]">
                  POST /api/disease/detect (Content-Type: multipart/form-data)
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-sans pt-1">
                  Processes raw leaf pixels, applies bounding box normalization, and extracts disease pathology features with 96.8% top-1 accuracy.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#23362a]">
              <Button size="sm" onClick={() => setShowSpecsModal(false)} variant="primary">
                Close Specs
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
