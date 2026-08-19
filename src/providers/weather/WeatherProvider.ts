import { WeatherData, ClimateScenario, FarmerProfile } from '../../types';

export interface WeatherProvider {
  name: string;
  isReal: boolean;
  getWeatherData(farmer: FarmerProfile, scenario?: ClimateScenario): Promise<{ data: WeatherData; source: 'live' | 'demo' }>;
}
