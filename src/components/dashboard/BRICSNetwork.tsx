import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRICSWorldMap } from '../maps/BRICSWorldMap';
import { BRICS_COUNTRIES, COMMON_AGRICULTURE_SCHEMA_DEMO } from '../../data/demoData';
import { BRICSCountry, AIModelShare } from '../../types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { StatCard } from '../ui/StatCard';
import { Modal } from '../ui/Modal';
import { Globe2, ArrowRightLeft, Share2, Code, Plus, CheckCircle2, Eye, Download, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BRICSNetwork: React.FC = () => {
  const { selectedFarm, sharedModels, shareModel, showToast } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<BRICSCountry>(BRICS_COUNTRIES[0]);
  
  // Modals & Active Model State
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [viewedModel, setViewedModel] = useState<AIModelShare | null>(null);

  const [newModelTitle, setNewModelTitle] = useState<string>('');
  const [newModelCountry, setNewModelCountry] = useState<string>('Brazil');
  const [newModelCategory, setNewModelCategory] = useState<'Climate' | 'Disease' | 'Crop Selection' | 'Yield Prediction'>('Disease');

  const handleViewModel = (model: AIModelShare) => {
    setViewedModel(model);
  };

  const handleCompareModel = (model: AIModelShare) => {
    showToast(`Model Comparison: ${model.title} outperforms standard baseline by +3.4% accuracy (${model.accuracy}).`, 'info');
  };

  const handleImportModel = (model: AIModelShare) => {
    showToast(`Model "${model.title}" successfully imported into ${selectedFarm.name}'s active intelligence stack!`, 'success');
  };

  const handleShareExisting = async (model: AIModelShare) => {
    showToast(`Sharing "${model.title}" to ${selectedCountry.name}...`, 'info');
    await shareModel({
      title: `${model.title} (Shared with ${selectedCountry.name})`,
      country: selectedCountry.name,
      countryFlag: selectedCountry.flag,
      category: model.category,
      accuracy: model.accuracy,
      description: model.description
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleCreateNewShare = async () => {
    if (!newModelTitle.trim()) {
      showToast('Please enter a model title', 'error');
      return;
    }
    const countryObj = BRICS_COUNTRIES.find(c => c.name === newModelCountry) || BRICS_COUNTRIES[1];
    await shareModel({
      title: newModelTitle,
      country: countryObj.name,
      countryFlag: countryObj.flag,
      category: newModelCategory,
      accuracy: '94.8%',
      description: `Newly published ${newModelCategory} model shared with ${countryObj.name} agriculture gateway.`
    });
    setIsShareModalOpen(false);
    setNewModelTitle('');
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'Global Agriculture Network' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Globe2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">BRICS Global Agriculture Intelligence Network</h1>
            <Badge variant="success">5 Countries Connected</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Interoperable Digital Public Infrastructure (DPI) protocol for cross-border AI model & dataset exchange.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsShareModalOpen(true)} icon={Plus} variant="primary">
          Publish & Share AI Model
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Active Countries"
          value="5 Member States"
          subtitle="India, Brazil, Russia, China, South Africa"
          icon={Globe2}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Verified AI Models"
          value={sharedModels.length}
          subtitle="Climate, Disease & Yield Nets"
          change="Updated Live"
          changeType="positive"
          icon={ArrowRightLeft}
          iconColor="text-teal-400"
        />

        <StatCard
          title="Shared Datasets"
          value="187 Datasets"
          subtitle="Satellite & Soil Spectroscopy"
          icon={Code}
          iconColor="text-amber-400"
        />

        <StatCard
          title="Interoperability Gateway"
          value="DPI v2.4"
          subtitle="JSON-LD Open Standard"
          change="Connected"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
        />
      </div>

      {/* World Map Section */}
      <BRICSWorldMap onCountrySelect={(c) => setSelectedCountry(c)} />

      {/* AI Model Exchange Catalog Cards */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white">Interactive AI Model Exchange Catalog ({sharedModels.length})</span>
          </div>
        }
        subtitle={`Selected Gateway Target: ${selectedCountry.flag} ${selectedCountry.name}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedModels.map((model) => (
            <div key={model.id} className="bg-[#18261e] border border-[#294233] p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <Badge variant="success">
                    {model.countryFlag} {model.country}
                  </Badge>
                  <span className="text-[10px] text-gray-400 font-mono">{model.version}</span>
                </div>
                <h3 className="font-bold text-sm text-white leading-snug">{model.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">{model.description}</p>
              </div>

              {/* 4 Interactive Action Buttons */}
              <div className="pt-3 border-t border-[#294233] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-bold text-emerald-400">{model.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="font-extrabold text-white">{model.accuracy}</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <Button size="sm" variant="outline" icon={Eye} onClick={() => handleViewModel(model)} title="View Model Details">
                    View
                  </Button>
                  <Button size="sm" variant="outline" icon={Sliders} onClick={() => handleCompareModel(model)} title="Compare Model">
                    Compare
                  </Button>
                  <Button size="sm" variant="secondary" icon={Download} onClick={() => handleImportModel(model)} title="Import Model">
                    Import
                  </Button>
                  <Button size="sm" variant="primary" icon={Share2} onClick={() => handleShareExisting(model)} title="Share Model">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* View Model Details Modal */}
      {viewedModel && (
        <Modal
          isOpen={!!viewedModel}
          onClose={() => setViewedModel(null)}
          title={`AI Model: ${viewedModel.title}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setViewedModel(null)}>Close</Button>
              <Button variant="secondary" onClick={() => { handleImportModel(viewedModel); setViewedModel(null); }} icon={Download}>
                Import to Active Farm
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-[#18261e] p-3 rounded-xl border border-[#294233]">
              <span className="text-gray-400">Origin Gateway:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>{viewedModel.countryFlag}</span>
                <span>{viewedModel.country}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233]">
                <div className="text-gray-400">Category</div>
                <div className="font-bold text-emerald-400 mt-0.5">{viewedModel.category}</div>
              </div>
              <div className="bg-[#18261e] p-2.5 rounded-xl border border-[#294233]">
                <div className="text-gray-400">Accuracy Score</div>
                <div className="font-bold text-white mt-0.5">{viewedModel.accuracy}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#18261e] border border-[#294233] space-y-1">
              <div className="font-bold text-gray-300">Model Description:</div>
              <p className="text-gray-200 leading-relaxed">{viewedModel.description}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#18261e] border border-[#294233] flex items-center justify-between">
              <span className="text-gray-400">Network Connection:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active BRICS Federation Gateway (Encrypted REST)</span>
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for Sharing New Model */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Publish AI Model to Global Exchange"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsShareModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateNewShare} icon={Share2}>Share Model</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Model Name / Title</label>
            <input
              type="text"
              value={newModelTitle}
              onChange={(e) => setNewModelTitle(e.target.value)}
              placeholder="e.g. Tropical Soil Carbon Deep Learning Predictor"
              className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Target Country</label>
              <select
                value={newModelCountry}
                onChange={(e) => setNewModelCountry(e.target.value)}
                className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {BRICS_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Model Category</label>
              <select
                value={newModelCategory}
                onChange={(e) => setNewModelCategory(e.target.value as any)}
                className="w-full bg-[#18261e] border border-[#294233] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Climate">Climate</option>
                <option value="Disease">Disease</option>
                <option value="Crop Selection">Crop Selection</option>
                <option value="Yield Prediction">Yield Prediction</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
