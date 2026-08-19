import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cropEconomicsEngine } from '../../services/cropEconomicsEngine';
import { googleAiService } from '../../services/googleAiService';
import { COUNTRY_NODES } from '../../data/demoData';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { StatCard } from '../ui/StatCard';
import { 
  DollarSign, 
  Wheat, 
  Sparkles, 
  TrendingUp, 
  Droplets, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  Globe, 
  SlidersHorizontal,
  Volume2
} from 'lucide-react';
import { voiceService } from '../../services/voiceService';

import { t } from '../../data/translations';

export const CropEconomics: React.FC = () => {
  const { selectedFarm, soilData, weatherData, language, showToast } = useApp();
  
  // Selected Country for Currency & Regional Market Node
  const [activeCountryCode, setActiveCountryCode] = useState<string>('IN');
  const [selectedCropName, setSelectedCropName] = useState<string | null>(null);
  
  // Interactive ROI Calculator Modifiers
  const [fertilizerAdj, setFertilizerAdj] = useState<number>(0); // -20% to +20%
  const [laborAdj, setLaborAdj] = useState<number>(0); // -20% to +20%
  const [priceAdj, setPriceAdj] = useState<number>(0); // -20% to +20%

  const countryNode = COUNTRY_NODES.find(c => c.code === activeCountryCode) || COUNTRY_NODES[0];
  const sym = countryNode.currencySymbol;

  const rawEconomics = cropEconomicsEngine.calculateCropEconomics(selectedFarm, soilData, weatherData, activeCountryCode);

  // Apply interactive slider adjustments
  const economics = rawEconomics.map(item => {
    const inputCost = Math.round(item.inputCostPerHa * (1 + (fertilizerAdj + laborAdj) / 200));
    const marketPrice = Math.round(item.breakdown.marketPricePerTon * (1 + priceAdj / 100));
    const expectedRevenue = Math.round(item.expectedYieldTonsHa * marketPrice);
    const estimatedProfit = expectedRevenue - inputCost;
    const totalProfit = Math.round(estimatedProfit * selectedFarm.farmSizeHectares);
    const roi = parseFloat(((estimatedProfit / inputCost) * 100).toFixed(1));

    return {
      ...item,
      inputCostPerHa: inputCost,
      expectedRevenuePerHa: expectedRevenue,
      estimatedProfitPerHa: estimatedProfit,
      totalProfit,
      roiPercentage: roi,
      breakdown: {
        ...item.breakdown,
        marketPricePerTon: marketPrice
      }
    };
  });

  const recommendedCrop = economics.find(c => c.isRecommended) || economics[0];

  const handleSpeakReasoning = () => {
    const text = recommendedCrop.recommendationReason;
    voiceService.speak(text, language);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: t(language, 'farmDashboard', 'Farm Dashboard'), view: 'overview' }, { label: t(language, 'cropEconomics', 'Crop Decision Analysis') }]} />

      {/* Top Banner with Country Node Selector */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-3xl p-5 lg:p-6 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <DollarSign className="w-7 h-7 text-emerald-400 shrink-0" />
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              {t(language, 'cropEconomicsHeader', 'Crop Economics & Farm Profitability Engine')}
            </h1>
            <Badge variant="success">{selectedFarm.name}</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1.5">
            {t(language, 'cropEconomicsSubtitle', 'AI-driven decision matrix balancing soil suitability, water budgets, input costs, market prices, and expected ROI.')}
          </p>
        </div>

        {/* Currency & National Gateway Switcher */}
        <div className="flex items-center space-x-2 bg-[#18261e] border border-[#294233] p-2 rounded-2xl shrink-0 text-xs">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-gray-300">Market Currency Node:</span>
          <select
            value={activeCountryCode}
            onChange={(e) => {
              setActiveCountryCode(e.target.value);
              const node = COUNTRY_NODES.find(c => c.code === e.target.value);
              showToast(`Switched economic market pricing node to ${node?.flag} ${node?.name} (${node?.currencyCode})`, 'info');
            }}
            className="bg-[#111a14] text-white border border-[#294233] font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {COUNTRY_NODES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.currencySymbol} {c.currencyCode})</option>
            ))}
          </select>
        </div>
      </div>

      {/* AI RECOMMENDATION HIGHLIGHT CARD: "WHY THIS RECOMMENDATION?" */}
      <div className="bg-gradient-to-br from-emerald-950/80 via-[#16271c] to-teal-950/80 border-2 border-emerald-500/70 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-950">
              🌾
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{t(language, 'optimalCrop', 'AI OPTIMAL CROP RECOMMENDATION')}</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                {recommendedCrop.cropName}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs text-gray-300">{t(language, 'netProfit', 'Estimated Net Profit')} ({selectedFarm.farmSizeHectares} Ha):</div>
              <div className="text-xl font-black text-emerald-400">
                {sym}{recommendedCrop.totalProfit.toLocaleString()}
              </div>
            </div>
            <Button size="sm" variant="secondary" icon={Volume2} onClick={handleSpeakReasoning}>
              {t(language, 'speakAdvisory', 'Listen Why')}
            </Button>
          </div>
        </div>

        {/* WHY THIS RECOMMENDATION EXPLANATION BOX */}
        <div className="p-4 rounded-2xl bg-[#0d1611]/90 border border-emerald-500/40 space-y-2">
          <div className="text-xs font-black text-amber-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>{t(language, 'whyRecommendation', 'Why this recommendation?')}</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            "{recommendedCrop.recommendationReason}"
          </p>
        </div>
      </div>

      {/* CROP DECISION COMPARISON TABLE CARD */}
      <Card 
        title={
          <div className="flex items-center space-x-2 text-white font-bold">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>{t(language, 'decisionMatrix', 'Crop Decision Analysis Matrix')} ({countryNode.name} Market Node)</span>
          </div>
        }
        subtitle="Comparing soil suitability, water demand, expected yield, input costs, and profit"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-[#23362a] text-gray-400 uppercase tracking-wider text-[10px] bg-[#131e17]">
                <th className="p-3.5 font-extrabold">{t(language, 'cropName', 'Crop Name')}</th>
                <th className="p-3.5 font-extrabold">{t(language, 'soilSuitability', 'Soil Suitability')}</th>
                <th className="p-3.5 font-extrabold">{t(language, 'waterRequirement', 'Water Requirement')}</th>
                <th className="p-3.5 font-extrabold">{t(language, 'expectedYield', 'Expected Yield')}</th>
                <th className="p-3.5 font-extrabold">{t(language, 'inputCost', 'Input Cost / Ha')}</th>
                <th className="p-3.5 font-extrabold">{t(language, 'revenue', 'Revenue / Ha')}</th>
                <th className="p-3.5 font-extrabold">{t(language, 'estimatedProfit', 'Estimated Profit / Ha')}</th>
                <th className="p-3.5 font-extrabold">{t(language, 'roi', 'ROI (%)')}</th>
                <th className="p-3.5 font-extrabold">{t(language, 'climateRisk', 'Climate Risk')}</th>
                <th className="p-3.5 font-extrabold text-center">{t(language, 'aiStatus', 'AI Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23362a]">
              {economics.map((item) => (
                <tr 
                  key={item.cropName} 
                  className={`transition-colors ${
                    item.isRecommended 
                      ? 'bg-emerald-950/60 font-semibold text-white' 
                      : 'hover:bg-[#16241b] text-gray-200'
                  }`}
                >
                  <td className="p-3.5 font-bold flex items-center gap-2">
                    <span>{item.cropName}</span>
                    {item.cropName === selectedFarm.crop.split(' ')[0] && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">Current</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="font-extrabold text-emerald-400">{item.soilSuitability}%</span>
                  </td>
                  <td className="p-3.5">
                    <Badge variant={item.waterRequirement === 'Low' ? 'success' : item.waterRequirement === 'Medium' ? 'warning' : 'danger'}>
                      {item.waterRequirement}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-semibold text-white">{item.expectedYieldTonsHa} T/Ha</td>
                  <td className="p-3.5 text-gray-300">{sym}{item.inputCostPerHa.toLocaleString()}</td>
                  <td className="p-3.5 text-gray-300">{sym}{item.expectedRevenuePerHa.toLocaleString()}</td>
                  <td className="p-3.5 font-extrabold text-emerald-400">{sym}{item.estimatedProfitPerHa.toLocaleString()}</td>
                  <td className="p-3.5 font-black text-amber-400">+{item.roiPercentage}%</td>
                  <td className="p-3.5">
                    <Badge variant={item.climateRisk === 'Low' ? 'success' : item.climateRisk === 'Medium' ? 'warning' : 'danger'}>
                      {item.climateRisk}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-center">
                    {item.isRecommended ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white font-extrabold text-[10px] uppercase shadow-md animate-pulse">
                        {t(language, 'recommendedBadge', 'RECOMMENDED')}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">{t(language, 'alternative', 'Alternative')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* INTERACTIVE ROI CALCULATOR SLIDERS */}
      <Card 
        title={
          <div className="flex items-center space-x-2 text-white font-bold">
            <SlidersHorizontal className="w-5 h-5 text-teal-400" />
            <span>Interactive Profit & ROI Simulator</span>
          </div>
        }
        subtitle="Simulate input cost fluctuations (fertilizer/labor) or market price changes"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-2 text-xs">
          {/* Fertilizer Cost Slider */}
          <div className="space-y-2 bg-[#18261e] p-4 rounded-2xl border border-[#294233]">
            <div className="flex justify-between font-bold text-gray-300">
              <span>Fertilizer / Chemical Cost:</span>
              <span className="text-emerald-400">{fertilizerAdj > 0 ? `+${fertilizerAdj}%` : `${fertilizerAdj}%`}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={fertilizerAdj}
              onChange={(e) => setFertilizerAdj(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Labor Cost Slider */}
          <div className="space-y-2 bg-[#18261e] p-4 rounded-2xl border border-[#294233]">
            <div className="flex justify-between font-bold text-gray-300">
              <span>Labour & Equipment Cost:</span>
              <span className="text-teal-400">{laborAdj > 0 ? `+${laborAdj}%` : `${laborAdj}%`}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={laborAdj}
              onChange={(e) => setLaborAdj(parseInt(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          {/* Market Price Slider */}
          <div className="space-y-2 bg-[#18261e] p-4 rounded-2xl border border-[#294233]">
            <div className="flex justify-between font-bold text-gray-300">
              <span>Market Price Fluctuation:</span>
              <span className="text-amber-400">{priceAdj > 0 ? `+${priceAdj}%` : `${priceAdj}%`}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={priceAdj}
              onChange={(e) => setPriceAdj(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
