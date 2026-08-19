export type UserRole = 'farmer' | 'authority' | 'researcher';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'ne';

export type AppView = 
  | 'landing'
  | 'overview'
  | 'satellite'
  | 'weather'
  | 'soil'
  | 'advisor'
  | 'disease'
  | 'regenerative'
  | 'agrogpt'
  | 'digital-twin'
  | 'simulator'
  | 'alerts'
  | 'authority'
  | 'brics-network'
  | 'how-it-thinks'
  | 'dpg-manifesto'
  | 'yield-forecast'
  | 'crop-economics'
  | 'data-consent'
  | 'how-agrinexus-works';

export interface FarmLocation {
  lat: number;
  lng: number;
  state: string;
  district: string;
  country: string;
  coordinates: [number, number][]; // Polygon
}

export interface FarmerProfile {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  country: string;
  crop: string;
  variety: string;
  farmSizeHectares: number;
  growthStage: string;
  coordinates: [number, number][];
  avatarUrl: string;
}

export interface ZoneDetail {
  id: string;
  name: string;
  health: 'healthy' | 'moderate' | 'high-risk';
  ndvi: number;
  moisture: string;
  stressLevel: string;
  nitrogenStatus: string;
  recommendation: string;
}

export interface SatelliteObservation {
  date: string;
  ndvi: number;
  vegetationHealth: string;
  stressZoneCount: number;
  imageUrl: string;
  moistureIndex: number;
  zones: ZoneDetail[];
}

export interface WeatherData {
  currentTemp: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  uvIndex: number;
  condition: string;
  rainfallExpectedHours: number;
  forecast: {
    day: string;
    tempHigh: number;
    tempLow: number;
    rainProb: number;
    icon: string;
  }[];
  aiImpact: {
    irrigationAction: string;
    cropRisk: string;
    recommendation: string;
  };
}

export interface SoilHealthData {
  ph: number;
  nitrogen: 'Low' | 'Medium' | 'High';
  phosphorus: 'Low' | 'Medium' | 'High';
  potassium: 'Low' | 'Medium' | 'High';
  organicCarbon: 'Low' | 'Medium' | 'High';
  organicCarbonPercentage: number;
  moisturePercentage: number;
  soilType: string;
  score: number;
  aiInterpretation: string;
  recommendations: string[];
}

export interface CropRecommendation {
  cropName: string;
  suitabilityScore: number; // 0 - 100
  waterRequirement: 'Low' | 'Medium' | 'High';
  soilCompatibility: 'Excellent' | 'Good' | 'Fair';
  climateRisk: 'Low' | 'Moderate' | 'High';
  sustainabilityImpact: string;
  expectedYield: string;
  reasons: string[];
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  affectedAreaPercentage: number;
  immediateAction: string;
  preventativeMeasures: string[];
  treatmentAdvisory: string;
  bbox?: { x: number; y: number; w: number; h: number };
}

export interface AlertItem {
  id: string;
  type: 'weather' | 'disease' | 'irrigation' | 'stress';
  severity: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: AppView;
}

export interface BRICSCountry {
  code: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  activeModelsCount: number;
  climateModelsCount: number;
  cropModelsCount: number;
  sharedDatasetsCount: number;
  status: 'CONNECTED' | 'SYNCHRONIZING' | 'OFFLINE';
  keyCrops: string[];
}

export interface AIModelShare {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  version: string;
  status: 'Verified' | 'Shared' | 'In-Review';
  category: 'Climate' | 'Disease' | 'Crop Selection' | 'Yield Prediction';
  accuracy: string;
  description: string;
}

export interface FarmHealthBreakdown {
  overallScore: number;
  cropHealthScore: number; // 30% weight
  soilHealthScore: number; // 25% weight
  weatherStabilityScore: number; // 20% weight
  diseaseRiskScore: number; // 15% weight
  sustainabilityScore: number; // 10% weight
}

export interface ClimateScenario {
  tempDelta: number; // -2 to +2 C
  rainfallDelta: number; // -20% to +20%
}

export interface FarmerConsentState {
  personalInfo: 'protected' | 'anonymized' | 'shared';
  farmLocation: 'protected' | 'district' | 'exact';
  soilData: boolean;
  cropHealthData: boolean;
  satelliteMetrics: boolean;
  yieldData: boolean;
  crossBorderResearch: boolean;
  aiModelImprovement: boolean;
}

export interface YieldPredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface HistoricalYieldPoint {
  year: string;
  actualYield: number;
  predictedYield: number;
  ndvi: number;
}

export interface YieldPredictionResult {
  crop: string;
  expectedYieldMin: number; // Tonnes / Ha
  expectedYieldMax: number; // Tonnes / Ha
  totalExpectedYieldMin: number; // Total Tonnes
  totalExpectedYieldMax: number; // Total Tonnes
  harvestDaysMin: number;
  harvestDaysMax: number;
  estimatedHarvestWindow: string; // e.g. "18–24 days (05 Sep – 11 Sep 2026)"
  yieldRisk: 'Low' | 'Medium' | 'High';
  confidenceScore: number; // percentage (e.g. 87)
  factors: YieldPredictionFactor[];
  historicalTrend: HistoricalYieldPoint[];
  disclaimer: string;
}

export interface CostBreakdown {
  seedCost: number;
  fertilizerCost: number;
  irrigationCost: number;
  labourCost: number;
  machineryCost: number;
  marketPricePerTon: number;
}

export interface CropEconomicsOption {
  cropName: string;
  soilSuitability: number; // %
  waterRequirement: 'Low' | 'Medium' | 'High';
  expectedYieldTonsHa: number;
  inputCostPerHa: number;
  expectedRevenuePerHa: number;
  estimatedProfitPerHa: number;
  totalInputCost: number;
  totalRevenue: number;
  totalProfit: number;
  roiPercentage: number;
  climateRisk: 'Low' | 'Medium' | 'High';
  isRecommended: boolean;
  recommendationReason: string;
  breakdown: CostBreakdown;
}

export interface CountryNodeConfig {
  code: string;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  exchangeRateToINR: number;
  region: string;
  agriculturalDataSource: string;
  keyCrops: string[];
}
