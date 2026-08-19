import { BRICSCountry, AIModelShare } from '../types';
import { BRICS_COUNTRIES, SHARED_AI_MODELS } from '../data/demoData';

const API_BASE = 'http://localhost:5000/api';

export class NetworkService {
  async getCountries(): Promise<BRICSCountry[]> {
    try {
      const res = await fetch(`${API_BASE}/network/countries`);
      if (res.ok) {
        const apiData = await res.json();
        return BRICS_COUNTRIES.map(c => {
          const match = apiData.find((a: any) => a.code === c.code);
          return match ? { ...c, activeModelsCount: match.activeModels } : c;
        });
      }
    } catch {
      // Fallback
    }
    return BRICS_COUNTRIES;
  }

  async shareModel(payload: Partial<AIModelShare>): Promise<{ success: boolean; model?: AIModelShare }> {
    try {
      const res = await fetch(`${API_BASE}/network/models/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, model: data.model };
      }
    } catch {
      // Fallback
    }

    const fallbackModel: AIModelShare = {
      id: `MOD-${Date.now()}`,
      title: payload.title || 'Shared Ag Model',
      country: payload.country || 'Global',
      countryFlag: payload.countryFlag || '🌐',
      version: 'v1.0',
      status: 'Shared',
      category: payload.category || 'Crop Selection',
      accuracy: '92.5%',
      description: payload.description || 'Model shared via BRICS Digital Public Good network.'
    };
    return { success: true, model: fallbackModel };
  }
}

export const networkService = new NetworkService();
