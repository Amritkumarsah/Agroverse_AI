import { FarmHealthBreakdown } from '../types';
import { DEMO_HEALTH_BREAKDOWN } from '../data/demoData';

export class ScoringEngine {
  /**
   * Calculates overall Farm Health Score based on weighted sub-scores:
   * Crop Health: 30%
   * Soil Health: 25%
   * Weather Stability: 20%
   * Disease Risk (Inverse severity): 15%
   * Sustainability: 10%
   */
  calculateHealth(
    cropScore: number = 78,
    soilScore: number = 64,
    weatherScore: number = 71,
    diseaseScore: number = 82,
    sustainabilityScore: number = 69
  ): FarmHealthBreakdown {
    const weightedSum = Math.round(
      cropScore * 0.30 +
      soilScore * 0.25 +
      weatherScore * 0.20 +
      diseaseScore * 0.15 +
      sustainabilityScore * 0.10
    );

    return {
      overallScore: Math.min(100, Math.max(0, weightedSum)),
      cropHealthScore: cropScore,
      soilHealthScore: soilScore,
      weatherStabilityScore: weatherScore,
      diseaseRiskScore: diseaseScore,
      sustainabilityScore: sustainabilityScore
    };
  }

  getDemoScore(): FarmHealthBreakdown {
    return DEMO_HEALTH_BREAKDOWN;
  }
}

export const scoringEngine = new ScoringEngine();
