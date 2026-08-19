import { SatelliteObservation } from '../../types';

export interface SatelliteProvider {
  name: string;
  isReal: boolean;
  getObservations(farmId: string): Promise<SatelliteObservation[]>;
}

export class DemoSatelliteProvider implements SatelliteProvider {
  name = 'Demo Sentinel-2 Satellite Provider';
  isReal = false;

  async getObservations(farmId: string): Promise<SatelliteObservation[]> {
    const { FARM_DATA_MAP } = await import('../../data/demoData');
    const full = FARM_DATA_MAP[farmId] || FARM_DATA_MAP['FARM-88219'];
    return full.satellite;
  }
}

export const demoSatelliteProvider = new DemoSatelliteProvider();
