import { WeatherProvider } from './WeatherProvider';
import { WeatherData, ClimateScenario, FarmerProfile } from '../../types';
import { demoWeatherProvider } from './DemoWeatherProvider';

export class OpenMeteoWeatherProvider implements WeatherProvider {
  name = 'Open-Meteo Free Weather API';
  isReal = true;

  // Map WMO Weather Codes to Human-Readable Conditions
  private parseWeatherCode(code: number): string {
    if (code === 0) return 'Clear Sunny Sky';
    if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy / Hazy';
    if (code >= 51 && code <= 55) return 'Light Drizzle';
    if (code >= 61 && code <= 65) return 'Monsoon Rain Showers';
    if (code >= 80 && code <= 82) return 'Heavy Rainfall';
    if (code >= 95 && code <= 99) return 'Thunderstorms Expected';
    return 'Scattered Weather Clouds';
  }

  private mapDayName(dateStr: string): string {
    const d = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()] || 'Day';
  }

  async getWeatherData(farmer: FarmerProfile, scenario?: ClimateScenario): Promise<{ data: WeatherData; source: 'live' | 'demo' }> {
    const lat = farmer.coordinates?.[0]?.[0] || 26.1209;
    const lng = farmer.coordinates?.[0]?.[1] || 85.3647;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability,soil_temperature_0_to_7cm,soil_moisture_0_to_7cm&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Open-Meteo API response not ok');
      const json = await res.json();

      const currentWeather = json.current_weather;
      const daily = json.daily;
      const hourly = json.hourly;

      const liveTemp = Math.round(currentWeather.temperature);
      const windSpeed = Math.round(currentWeather.windspeed);
      const weatherCode = currentWeather.weathercode;
      const condition = this.parseWeatherCode(weatherCode);

      // Extract humidity and max rain probability from hourly/daily data
      const humidity = hourly?.relative_humidity_2m?.[0] || 70;
      const rainProbability = daily?.precipitation_probability_max?.[0] || (weatherCode >= 50 ? 80 : 20);

      // Build 5-day forecast
      const forecast: WeatherData['forecast'] = (daily?.time || []).slice(0, 5).map((t: string, idx: number) => ({
        day: this.mapDayName(t),
        tempHigh: Math.round(daily.temperature_2m_max[idx]),
        tempLow: Math.round(daily.temperature_2m_min[idx]),
        rainProb: daily.precipitation_probability_max?.[idx] || (daily.weathercode?.[idx] >= 50 ? 75 : 15),
        icon: daily.weathercode?.[idx] >= 60 ? 'cloud-rain' : daily.weathercode?.[idx] >= 50 ? 'cloud-drizzle' : 'sun'
      }));

      // Apply Climate Simulator scenario deltas if present
      const finalTemp = scenario ? Math.round(liveTemp + scenario.tempDelta) : liveTemp;
      const finalRainProb = scenario ? Math.min(100, Math.max(0, Math.round(rainProbability + scenario.rainfallDelta))) : rainProbability;

      const isHighRain = finalRainProb > 60;
      const irrigationAction = isHighRain ? 'Postpone Irrigation Immediately' : 'Execute Scheduled Irrigation Cycle';
      const cropRisk = isHighRain ? 'Waterlogging Risk in Low-Lying Zones' : 'Optimal Moisture Retention';
      const recommendation = isHighRain 
        ? `Live Open-Meteo feed predicts ${finalRainProb}% rain probability for ${farmer.location}. Irrigation must be postponed to prevent root rot.`
        : `Live Open-Meteo temperature is ${finalTemp}°C with low rain probability (${finalRainProb}%). Execute standard irrigation for ${farmer.crop}.`;

      const weatherData: WeatherData = {
        currentTemp: finalTemp,
        humidity,
        rainProbability: finalRainProb,
        windSpeed,
        uvIndex: 6,
        condition,
        rainfallExpectedHours: isHighRain ? 36 : 72,
        forecast,
        aiImpact: {
          irrigationAction,
          cropRisk,
          recommendation
        }
      };

      return { data: weatherData, source: 'live' };
    } catch (err) {
      console.warn('Open-Meteo Live Weather API unavailable, using Demo Provider fallback:', err);
      return demoWeatherProvider.getWeatherData(farmer, scenario);
    }
  }
}

export const openMeteoWeatherProvider = new OpenMeteoWeatherProvider();
