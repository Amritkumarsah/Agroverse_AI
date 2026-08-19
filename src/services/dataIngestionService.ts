import { FarmerProfile, WeatherData, SoilHealthData, SatelliteObservation } from '../types';
import { openMeteoWeatherProvider } from '../providers/weather/OpenMeteoWeatherProvider';
import { remoteSensingService } from './remoteSensingService';
import { soilService } from './soilService';

export interface IngestedFarmTelemetry {
  farmer: FarmerProfile;
  weather: WeatherData;
  soil: SoilHealthData;
  satellite: SatelliteObservation;
  timestamp: string;
  source: 'live_open_meteo' | 'remote_sensing_model';
}

export class DataIngestionService {
  /**
   * Ingests multi-source agricultural telemetry (Weather, Soil, Satellite Remote Sensing)
   * for a registered farm plot.
   */
  public async ingestFarmTelemetry(farmer: FarmerProfile): Promise<IngestedFarmTelemetry> {
    // 1. Ingest Live Weather & Ground Soil Moisture Telemetry
    const weatherResult = await openMeteoWeatherProvider.getWeatherData(farmer);
    const weather = weatherResult.data;

    // 2. Compute Soil Analytics from Ingested Ground Telemetry
    const soil = soilService.computeSoilHealth(farmer);

    // 3. Compute Scientific Remote Sensing Satellite Observation (NDVI, Zone Stress)
    const satellite = remoteSensingService.computeSatelliteObservation(farmer);

    return {
      farmer,
      weather,
      soil,
      satellite,
      timestamp: new Date().toISOString(),
      source: weatherResult.source === 'live' ? 'live_open_meteo' : 'remote_sensing_model'
    };
  }
}

export const dataIngestionService = new DataIngestionService();
