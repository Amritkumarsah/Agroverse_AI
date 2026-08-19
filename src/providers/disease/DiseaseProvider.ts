import { DiseaseDetectionResult } from '../../types';

export interface DiseaseProvider {
  name: string;
  isReal: boolean;
  detectFromImage(imageSrc: string): Promise<DiseaseDetectionResult>;
}

export class DemoDiseaseProvider implements DiseaseProvider {
  name = 'AI Prototype Vision Inference Provider';
  isReal = false;

  async detectFromImage(imageSrc: string): Promise<DiseaseDetectionResult> {
    const { diseaseDetectionEngine } = await import('../../services/diseaseDetectionEngine');
    return diseaseDetectionEngine.detectFromImage(imageSrc);
  }
}

export const demoDiseaseProvider = new DemoDiseaseProvider();
