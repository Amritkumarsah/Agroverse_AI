import { FarmerProfile } from '../types';
import { FARMS_LIST, FARM_DATA_MAP } from '../data/demoData';

const API_BASE = 'http://localhost:5000/api';

export class FarmService {
  async getFarms(): Promise<FarmerProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/farms`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // API offline - use seeded demo fallback
    }
    return FARMS_LIST;
  }

  async getFarmById(id: string): Promise<FarmerProfile> {
    try {
      const res = await fetch(`${API_BASE}/farms/${id}`);
      if (res.ok) {
        const data = await res.json();
        return {
          id: data.id,
          name: data.farmer,
          location: data.location,
          district: data.district,
          state: data.state,
          country: data.country,
          crop: data.crop,
          variety: 'Recommended Variety',
          farmSizeHectares: data.farmSizeHectares,
          growthStage: 'Active Growth',
          coordinates: data.coordinates,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
        };
      }
    } catch {
      // Fallback
    }
    const full = FARM_DATA_MAP[id] || FARM_DATA_MAP['FARM-88219'];
    return full.farmer;
  }
}

export const farmService = new FarmService();
