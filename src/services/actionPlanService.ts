import { FarmerProfile, WeatherData, SoilHealthData, SatelliteObservation } from '../types';

export interface ActionPlanTask {
  day: string;
  task: string;
  status: 'pending' | 'upcoming' | 'completed';
  category: 'monitoring' | 'water' | 'inspection' | 'soil' | 'nutrition' | 'ai-check' | 'satellite';
}

export class ActionPlanService {
  generate7DayPlan(
    farmer: FarmerProfile,
    weather: WeatherData,
    soil: SoilHealthData,
    satellite: SatelliteObservation[]
  ): ActionPlanTask[] {
    const isHighRain = weather.rainProbability > 60;
    const currentNdvi = satellite[0]?.ndvi || 0.71;
    const stressZone = satellite[0]?.zones?.find(z => z.health !== 'healthy');

    return [
      {
        day: 'Day 1 (Today)',
        task: stressZone 
          ? `Monitor ${stressZone.name} canopy stress (NDVI ${stressZone.ndvi}). Inspect plot perimeter for fungal spore spots.`
          : `Perform routine canopy walk across ${farmer.crop} fields. Soil moisture currently ${soil.moisturePercentage}%.`,
        status: 'pending',
        category: 'monitoring'
      },
      {
        day: 'Day 2 (Tomorrow)',
        task: isHighRain
          ? `🌧️ POSTPONE IRRIGATION. ${weather.rainProbability}% rainfall expected (${weather.condition}). Ensure main field drainage channels are clear.`
          : `💧 Execute scheduled drip/canal irrigation cycle for ${farmer.crop} parcel to maintain target root zone hydration.`,
        status: 'upcoming',
        category: 'water'
      },
      {
        day: 'Day 3',
        task: isHighRain
          ? `Inspect low-lying field zones after expected rainfall event. Evaluate standing water accumulation.`
          : `Inspect leaf underside for early ${farmer.crop.includes('Wheat') ? 'rust' : 'blight'} lesions during high-humidity window.`,
        status: 'upcoming',
        category: 'inspection'
      },
      {
        day: 'Day 4',
        task: `Re-assess soil moisture and pH level (${soil.ph}). Verify nutrient absorption receptivity.`,
        status: 'upcoming',
        category: 'soil'
      },
      {
        day: 'Day 5',
        task: soil.organicCarbonPercentage < 0.75
          ? `Apply organic compost / farmyard manure (FYM) top dressing to raise organic carbon towards 0.75% benchmark.`
          : `Apply balanced NPK / bio-fertilizer top dressing based on tillering growth stage.`,
        status: 'upcoming',
        category: 'nutrition'
      },
      {
        day: 'Day 6',
        task: `Perform AgroGPT voice check-in for pest alert updates across ${farmer.district} district.`,
        status: 'upcoming',
        category: 'ai-check'
      },
      {
        day: 'Day 7',
        task: `Review updated Sentinel-2 satellite pass NDVI imagery (baseline current: ${currentNdvi}) & canopy growth metrics.`,
        status: 'upcoming',
        category: 'satellite'
      }
    ];
  }
}

export const actionPlanService = new ActionPlanService();
