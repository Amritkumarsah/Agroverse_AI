import React from 'react';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FileCheck, ShieldCheck, Lock, Globe2, Sparkles } from 'lucide-react';

export const DPGManifesto: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Farm Dashboard', view: 'overview' }, { label: 'Digital Public Good' }]} />

      {/* Header Banner */}
      <div className="bg-[#111a14] border border-[#23362a] rounded-2xl p-5 lg:p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <FileCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl font-extrabold text-white">Built as a Digital Public Good (DPG)</h1>
            <Badge variant="success">Open Standard</Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Designed around open standards, reusable AI models, and non-proprietary data governance.
          </p>
        </div>
      </div>

      {/* DPG Core Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card 
          title={
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Globe2 className="w-4 h-4" />
              <span>01 — Open Standards & Interoperability</span>
            </div>
          }
        >
          <p className="text-xs text-gray-300 leading-relaxed">
            Uses standardized JSON schemas (BRICS Agri-Schema v2.4) allowing seamless integration with national agriculture registries.
          </p>
        </Card>

        <Card 
          title={
            <div className="flex items-center space-x-2 text-teal-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>02 — Responsible Data Governance</span>
            </div>
          }
        >
          <p className="text-xs text-gray-300 leading-relaxed">
            Strict role-based access control (RBAC). Personal farmer identity is anonymized on all public research dashboards.
          </p>
        </Card>

        <Card 
          title={
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>03 — Farmer Consent & Privacy</span>
            </div>
          }
        >
          <p className="text-xs text-gray-300 leading-relaxed">
            Farmers retain 100% ownership over field coordinates and soil test records. Zero monetization of farmer data.
          </p>
        </Card>

        <Card 
          title={
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>04 — Explainable & Safe AI</span>
            </div>
          }
        >
          <p className="text-xs text-gray-300 leading-relaxed">
            Every AI recommendation displays underlying weights and includes expert validation safety warnings before application.
          </p>
        </Card>
      </div>
    </div>
  );
};
