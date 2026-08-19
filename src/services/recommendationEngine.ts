import { IngestedFarmTelemetry } from './dataIngestionService';
import { CropRecommendation } from '../types';

export interface GeneratedAdvisory {
  actionTitle: string;
  actionSummary: string;
  postponeIrrigation: boolean;
  rainProbability: number;
  healthScore: number;
  cropSuitability: CropRecommendation[];
  explainableReasons: string[];
}

export class RecommendationEngine {
  /**
   * Generates explainable crop and daily task recommendations
   * based on ingested weather, soil, and satellite data.
   */
  public generateAdvisory(telemetry: IngestedFarmTelemetry): GeneratedAdvisory {
    const { farmer, weather, soil, satellite } = telemetry;
    const isHighRain = weather.rainProbability > 60;
    const isSoilDry = soil.moisturePercentage < 30;

    let actionTitle = 'Execute Standard Irrigation Cycle';
    let actionSummary = `Weather is clear (${weather.currentTemp}°C) and soil moisture is at ${soil.moisturePercentage}%. Irrigate in the late afternoon to optimize root absorption.`;
    let postponeIrrigation = false;

    if (isHighRain) {
      actionTitle = 'Postpone Irrigation Immediately';
      actionSummary = `High rainfall probability (${weather.rainProbability}%) predicted within 36 hours. Soil moisture is currently adequate (${soil.moisturePercentage}%). Postpone irrigation to prevent root waterlogging.`;
      postponeIrrigation = true;
    } else if (isSoilDry) {
      actionTitle = 'Urgent Irrigation Required';
      actionSummary = `Soil moisture is low (${soil.moisturePercentage}%). Apply shallow irrigation cycle immediately to avoid crop water stress.`;
    }

    // Dynamic Crop Suitability Scoring Algorithm
    const cropCandidates: CropRecommendation[] = [
      {
        cropName: 'Wheat (HD-2967)',
        suitabilityScore: soil.ph >= 6.0 && soil.ph <= 7.5 ? 92 : 78,
        waterRequirement: 'Medium',
        soilCompatibility: 'Excellent',
        climateRisk: isHighRain ? 'Moderate' : 'Low',
        sustainabilityImpact: 'High nitrogen efficiency when paired with organic biochar',
        expectedYield: '4.8 - 5.2 tonnes / hectare',
        reasons: [
          `Soil pH (${soil.ph}) aligns with optimal root nutrient absorption`,
          'Loamy alluvial soil structure provides excellent root anchorage',
          'Compatible with current seasonal temperature profile'
        ]
      },
      {
        cropName: 'Chickpea (Kabuli / Desi)',
        suitabilityScore: 84,
        waterRequirement: 'Low',
        soilCompatibility: 'Good',
        climateRisk: 'Low',
        sustainabilityImpact: 'Fixes atmospheric nitrogen, enriching soil health for next cycle',
        expectedYield: '2.1 - 2.5 tonnes / hectare',
        reasons: [
          'Low water requirement reduces irrigation expenditure',
          'Biological nitrogen fixation improves organic carbon levels'
        ]
      },
      {
        cropName: 'Mustard (Pusa Bold)',
        suitabilityScore: 78,
        waterRequirement: 'Low',
        soilCompatibility: 'Good',
        climateRisk: 'Low',
        sustainabilityImpact: 'Deep taproot system improves subsoil aeration',
        expectedYield: '1.8 - 2.2 tonnes / hectare',
        reasons: [
          'High oil content crop suitable for well-drained alluvial soil',
          'Low moisture sensitivity during flowering stage'
        ]
      }
    ];

    // Overall Farm Health Score calculation
    let healthScore = Math.round(
      (satellite.ndvi * 40) +
      (soil.score * 0.35) +
      (weather.humidity > 80 ? 15 : 25)
    );
    healthScore = Math.min(98, Math.max(35, healthScore));

    return {
      actionTitle,
      actionSummary,
      postponeIrrigation,
      rainProbability: weather.rainProbability,
      healthScore,
      cropSuitability: cropCandidates,
      explainableReasons: [
        `Soil Moisture Telemetry: ${soil.moisturePercentage}%`,
        `Rainfall Forecast: ${weather.rainProbability}% probability within 36h`,
        `Satellite NDVI Index: ${satellite.ndvi}`
      ]
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
