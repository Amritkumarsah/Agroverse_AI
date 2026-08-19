import { WeatherData, ClimateScenario, FarmerProfile } from '../types';
import { openMeteoWeatherProvider } from '../providers/weather/OpenMeteoWeatherProvider';
import { FARM_DATA_MAP } from '../data/demoData';

export class WeatherService {
  async fetchWeatherForFarmer(farmer: FarmerProfile, scenario?: ClimateScenario): Promise<{ data: WeatherData; source: 'live' | 'demo' }> {
    return openMeteoWeatherProvider.getWeatherData(farmer, scenario);
  }

  async getWeatherData(farmId: string = 'FARM-88219', scenario?: ClimateScenario): Promise<WeatherData> {
    const full = FARM_DATA_MAP[farmId] || FARM_DATA_MAP['FARM-88219'];
    const res = await this.fetchWeatherForFarmer(full.farmer, scenario);
    return res.data;
  }
}

export const weatherService = new WeatherService();
