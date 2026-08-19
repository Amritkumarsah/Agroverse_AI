import React from 'react';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Cpu, ArrowDown } from 'lucide-react';

export const TechnicalArch: React.FC = () => {
  const steps = [
    { step: '01', title: 'Farm Data Ingestion', desc: 'Ingests location, crop variety, growth stage & parcel polygon boundary.' },
    { step: '02', title: 'Satellite Multi-Spectral Analysis', desc: 'Extracts Sentinel-2 NDVI canopy reflectance and soil moisture indices.' },
    { step: '03', title: 'Meteorological Weather Analysis', desc: 'Processes 7-day temperature, humidity, wind, and precipitation models.' },
    { step: '04', title: 'Root-Zone Soil Chemistry Analysis', desc: 'Evaluates pH, NPK balance, and organic carbon percentage.' },
    { step: '05', title: 'Crop Context & Phenology', desc: 'Factors in growth stage vulnerability (tillering, flowering, grain-filling).' },
    { step: '06', title: 'AI Feature Fusion Matrix', desc: 'Combines multi-modal inputs into a unified spatial feature vector.' },
    { step: '07', title: 'Risk & Stress Prediction', desc: 'Neural network predicts waterlogging, heat stress, and fungal outbreak probability.' },
    { step: '08', title: 'Recommendation Engine', desc: 'Ranks irrigation, nutrient, and crop rotation options against explainable weights.' },
    { step: '09', title: 'Explainable Multi-Lingual Advisory', desc: 'Outputs localized natural language advisories in 7 regional Indian languages.' }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'AI Decision Pipeline' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Cpu className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">How AGROVERSE AI Thinks</h1>
            <Badge variant="success">9-Stage Pipeline</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            End-to-end AI Decision Pipeline architecture powering national farm advisories.
          </p>
        </div>
      </div>

      {/* Decision Flow Pipeline */}
      <Card title="AI Decision Pipeline Stage Architecture" subtitle="Multi-modal feature fusion & explainable reasoning">
        <div className="space-y-4">
          {steps.map((s, idx) => (
            <React.Fragment key={s.step}>
              <div className="bg-[#18261e] border border-[#294233] p-4 rounded-xl flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{s.title}</h3>
                  <p className="text-xs text-gray-300 mt-0.5">{s.desc}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-4 h-4 text-emerald-500 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
};
