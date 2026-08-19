import { leafVisionAnalyzer, LeafAnalysisResult } from './leafVisionAnalyzer';
import { DiseaseDetectionResult } from '../types';

export class DiseaseDetectionEngine {
  /**
   * Diagnoses crop disease from a leaf image using HTML5 Canvas RGB spectrum analysis
   * and vision model inference.
   */
  public async detectDisease(imageSrc: string, cropName: string = 'Wheat'): Promise<DiseaseDetectionResult> {
    const analysis: LeafAnalysisResult = await leafVisionAnalyzer.analyzeImage(imageSrc, cropName);

    let severity: 'Mild' | 'Moderate' | 'Severe' = 'Mild';
    if (analysis.affectedAreaPercentage > 30) severity = 'Severe';
    else if (analysis.affectedAreaPercentage > 15) severity = 'Moderate';

    return {
      diseaseName: analysis.diseaseName,
      confidence: analysis.confidence,
      severity,
      affectedAreaPercentage: analysis.affectedAreaPercentage,
      immediateAction: analysis.farmerAdvice,
      treatmentAdvisory: analysis.recommendedSteps.join('. '),
      preventativeMeasures: [
        'Practice crop rotation with non-host legumes',
        'Avoid overhead sprinkler irrigation during high humidity',
        'Inspect crop canopy weekly for early lesion pustules'
      ]
    };
  }

  public async detectFromImage(imageSrc: string, cropName: string = 'Wheat'): Promise<DiseaseDetectionResult> {
    return this.detectDisease(imageSrc, cropName);
  }
}

export const diseaseDetectionEngine = new DiseaseDetectionEngine();
