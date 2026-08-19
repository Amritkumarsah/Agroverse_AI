import type { SatelliteObservation, ZoneDetail } from '../types';
import { FARM_DATA_MAP } from '../data/demoData';
import { getTodayDateString } from '../utils/dateUtils';

const API_BASE = 'http://localhost:5000/api';

export class SatelliteService {
  async getObservations(farmId: string = 'FARM-88219'): Promise<SatelliteObservation[]> {
    const full = FARM_DATA_MAP[farmId] || FARM_DATA_MAP['FARM-88219'];
    try {
      const res = await fetch(`${API_BASE}/farms/${farmId}/satellite`);
      if (res.ok) {
        const apiData = await res.json();
        return [
          {
            ...full.satellite[0],
            ndvi: apiData.ndvi,
            vegetationHealth: apiData.vegetationHealth,
            stressZoneCount: apiData.stressZones || 1,
            date: apiData.date || getTodayDateString()
          },
          ...full.satellite.slice(1)
        ];
      }
    } catch {
      // Fallback
    }
    return full.satellite;
  }

  async getObservationByDate(farmId: string, date: string): Promise<SatelliteObservation> {
    const observations = await this.getObservations(farmId);
    return observations.find(o => o.date === date) || observations[0];
  }

  async getZones(farmId: string): Promise<ZoneDetail[]> {
    const obs = await this.getObservations(farmId);
    return obs[0]?.zones || [];
  }
}

export const satelliteService = new SatelliteService();
