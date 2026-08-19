import { WeatherProvider } from './WeatherProvider';
import { WeatherData, ClimateScenario, FarmerProfile } from '../../types';
import { FARM_DATA_MAP } from '../../data/demoData';

export class DemoWeatherProvider implements WeatherProvider {
  name = 'Demo Weather Provider';
  isReal = false;

  async getWeatherData(farmer: FarmerProfile, scenario?: ClimateScenario): Promise<{ data: WeatherData; source: 'live' | 'demo' }> {
    const baseWeather = (FARM_DATA_MAP[farmer.id] || FARM_DATA_MAP['FARM-88219']).weather;

    if (!scenario || (scenario.tempDelta === 0 && scenario.rainfallDelta === 0)) {
      return { data: baseWeather, source: 'demo' };
    }

    const adjustedTemp = Math.round(baseWeather.currentTemp + scenario.tempDelta);
    const adjustedRainProb = Math.min(100, Math.max(0, Math.round(baseWeather.rainProbability + scenario.rainfallDelta)));

    return {
      source: 'demo',
      data: {
        ...baseWeather,
        currentTemp: adjustedTemp,
        rainProbability: adjustedRainProb,
        condition: adjustedRainProb > 70 ? 'Heavy Monsoon Rainfall Expected' : adjustedRainProb > 40 ? 'Light Showers Expected' : 'Clear & Dry Conditions',
        aiImpact: {
          irrigationAction: adjustedRainProb > 60 ? 'Postpone Irrigation Immediately' : 'Maintain Standard Irrigation Schedule',
          cropRisk: adjustedTemp > 33 ? 'High Thermal Stress Risk on Pollination' : baseWeather.aiImpact.cropRisk,
          recommendation: adjustedRainProb > 60 
            ? `Rainfall probability elevated to ${adjustedRainProb}%. Irrigation must be postponed to prevent root waterlogging.` 
            : `Temperature adjusted to ${adjustedTemp}°C. Maintain target root zone hydration.`
        }
      }
    };
  }
}

export const demoWeatherProvider = new DemoWeatherProvider();
