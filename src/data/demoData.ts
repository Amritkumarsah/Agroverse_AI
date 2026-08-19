import { getTodayDateString } from '../utils/dateUtils';
import { 
  FarmerProfile, 
  SatelliteObservation, 
  WeatherData, 
  SoilHealthData, 
  CropRecommendation,
  AlertItem,
  BRICSCountry,
  AIModelShare,
  FarmHealthBreakdown
} from '../types';

export const FARMS_LIST: FarmerProfile[] = [
  {
    id: 'FARM-88219',
    name: 'Rajesh Kumar',
    location: 'Muzaffarpur, Bihar',
    district: 'Muzaffarpur',
    state: 'Bihar',
    country: 'India',
    crop: 'Wheat (HD-2967)',
    variety: 'HD-2967',
    farmSizeHectares: 2.4,
    growthStage: 'Vegetative Stage (Day 42)',
    coordinates: [
      [26.1209, 85.3647],
      [26.1245, 85.3652],
      [26.1241, 85.3698],
      [26.1202, 85.3692]
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'FARM-54102',
    name: 'Sita Devi',
    location: 'Thanjavur, Tamil Nadu',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    country: 'India',
    crop: 'Paddy Rice (CR-1009)',
    variety: 'CR-1009 Sub1',
    farmSizeHectares: 3.8,
    growthStage: 'Panicle Initiation (Day 58)',
    coordinates: [
      [10.7867, 79.1378],
      [10.7901, 79.1382],
      [10.7895, 79.1420],
      [10.7860, 79.1415]
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'FARM-33918',
    name: 'Arjun Patil',
    location: 'Nashik, Maharashtra',
    district: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    crop: 'Sugarcane (Co 86032)',
    variety: 'Co 86032',
    farmSizeHectares: 5.0,
    growthStage: 'Grand Growth Stage (Day 110)',
    coordinates: [
      [19.9975, 73.7898],
      [20.0010, 73.7905],
      [20.0002, 73.7945],
      [19.9968, 73.7940]
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'FARM-10492',
    name: 'Harpreet Singh',
    location: 'Ludhiana, Punjab',
    district: 'Ludhiana',
    state: 'Punjab',
    country: 'India',
    crop: 'Basmati Rice (Pusa 1121)',
    variety: 'Pusa 1121',
    farmSizeHectares: 4.2,
    growthStage: 'Tillering Stage (Day 35)',
    coordinates: [
      [30.9010, 75.8573],
      [30.9045, 75.8580],
      [30.9040, 75.8625],
      [30.9002, 75.8618]
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  }
];

export const DEMO_FARMER: FarmerProfile = FARMS_LIST[0];

export const DEMO_HEALTH_BREAKDOWN: FarmHealthBreakdown = {
  overallScore: 72,
  cropHealthScore: 78,
  soilHealthScore: 64,
  weatherStabilityScore: 71,
  diseaseRiskScore: 82,
  sustainabilityScore: 69
};

export interface FarmFullData {
  farmer: FarmerProfile;
  healthBreakdown: FarmHealthBreakdown;
  satellite: SatelliteObservation[];
  weather: WeatherData;
  soil: SoilHealthData;
  cropRecommendations: CropRecommendation[];
  alerts: AlertItem[];
}

export const FARM_DATA_MAP: Record<string, FarmFullData> = {
  'FARM-88219': {
    farmer: FARMS_LIST[0],
    healthBreakdown: {
      overallScore: 72,
      cropHealthScore: 78,
      soilHealthScore: 64,
      weatherStabilityScore: 71,
      diseaseRiskScore: 82,
      sustainabilityScore: 69
    },
    satellite: [
      {
        date: getTodayDateString(),
        ndvi: 0.71,
        vegetationHealth: 'Healthy (Moderate Stress in NW Zone)',
        stressZoneCount: 1,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.62,
        zones: [
          {
            id: 'Zone A',
            name: 'South-East Zone (Plot 1)',
            health: 'healthy',
            ndvi: 0.78,
            moisture: 'Optimal (58%)',
            stressLevel: 'None',
            nitrogenStatus: 'Sufficient',
            recommendation: 'Maintain standard growth schedule.'
          },
          {
            id: 'Zone B',
            name: 'North-West Zone (Plot 2)',
            health: 'moderate',
            ndvi: 0.43,
            moisture: 'Moderate (42%)',
            stressLevel: 'Moderate Stress Detected',
            nitrogenStatus: 'Low-Medium',
            recommendation: 'Monitor irrigation. Postpone chemical spray due to incoming rain.'
          },
          {
            id: 'Zone C',
            name: 'Central Patch (Plot 3)',
            health: 'high-risk',
            ndvi: 0.35,
            moisture: 'Low (31%)',
            stressLevel: 'High Canopy Stress',
            nitrogenStatus: 'Deficient',
            recommendation: 'Inspect for early rust infection & localized soil compacting.'
          }
        ]
      },
      {
        date: '10 Aug 2026',
        ndvi: 0.68,
        vegetationHealth: 'Moderate Canopy Development',
        stressZoneCount: 2,
        imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.55,
        zones: []
      },
      {
        date: '01 Aug 2026',
        ndvi: 0.61,
        vegetationHealth: 'Early Tillering Stage',
        stressZoneCount: 1,
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.49,
        zones: []
      }
    ],
    weather: {
      currentTemp: 29,
      humidity: 74,
      rainProbability: 78,
      windSpeed: 14,
      uvIndex: 6,
      condition: 'Thunderstorms Expected in 36h',
      rainfallExpectedHours: 36,
      forecast: [
        { day: 'Tue', tempHigh: 30, tempLow: 24, rainProb: 78, icon: 'cloud-rain' },
        { day: 'Wed', tempHigh: 27, tempLow: 22, rainProb: 85, icon: 'cloud-lightning' },
        { day: 'Thu', tempHigh: 28, tempLow: 23, rainProb: 40, icon: 'cloud-sun' },
        { day: 'Fri', tempHigh: 31, tempLow: 24, rainProb: 15, icon: 'sun' },
        { day: 'Sat', tempHigh: 32, tempLow: 25, rainProb: 10, icon: 'sun' }
      ],
      aiImpact: {
        irrigationAction: 'Postpone Irrigation Immediately',
        cropRisk: 'Medium Waterlogging Risk in Low-Lying Plots',
        recommendation: 'Your north-west field zone is showing vegetation stress. Rainfall is expected within 36 hours (78% probability), so irrigation should be postponed.'
      }
    },
    soil: {
      ph: 6.7,
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'Medium',
      organicCarbon: 'Low',
      organicCarbonPercentage: 0.42,
      moisturePercentage: 42,
      soilType: 'Loamy Alluvial Soil',
      score: 64,
      aiInterpretation: 'Soil organic carbon (0.42%) is below the 0.75% benchmark. Neutral pH 6.7 is highly receptive to nutrient uptake.',
      recommendations: [
        'Apply farmyard manure (FYM) or biochar at 5 tonnes/ha to raise organic carbon.',
        'Introduce green manure cover crop (Sesbania) in next rotation.',
        'Switch to minimum tillage to prevent topsoil carbon loss.'
      ]
    },
    cropRecommendations: [
      {
        cropName: 'Wheat (HD-2967)',
        suitabilityScore: 91,
        waterRequirement: 'Medium',
        soilCompatibility: 'Excellent',
        climateRisk: 'Low',
        sustainabilityImpact: 'High thermal tolerance variety. Excellent nitrogen uptake efficiency.',
        expectedYield: '4.8 - 5.2 Tonnes/Ha',
        reasons: [
          'Soil pH 6.7 aligns with optimal wheat root absorption',
          'Loamy alluvial texture provides good drainage',
          'Predicted winter temperature range matches thermal requirements'
        ]
      },
      {
        cropName: 'Chickpea (Kabuli / Desi)',
        suitabilityScore: 82,
        waterRequirement: 'Low',
        soilCompatibility: 'Good',
        climateRisk: 'Moderate',
        sustainabilityImpact: 'Fixes 35-45 kg/ha atmospheric nitrogen. Restores soil biology.',
        expectedYield: '1.8 - 2.2 Tonnes/Ha',
        reasons: [
          'Low water requirement ideal for rainfed parcels',
          'Legume rotation will boost soil organic carbon'
        ]
      }
    ],
    alerts: [
      {
        id: 'ALT-101',
        type: 'weather',
        severity: 'critical',
        title: '🌧️ Heavy Rainfall Alert',
        message: '78% probability of 45mm rainfall within 36 hours. Postpone irrigation & nitrogen top-dressing.',
        timestamp: '10 mins ago',
        read: false,
        actionUrl: 'weather'
      },
      {
        id: 'ALT-102',
        type: 'stress',
        severity: 'warning',
        title: '🌱 North-West Zone Canopy Stress',
        message: 'NDVI dropped to 0.43 in Plot B. Satellite observation indicates localized vegetation stress.',
        timestamp: '2 hours ago',
        read: false,
        actionUrl: 'satellite'
      }
    ]
  },
  'FARM-54102': {
    farmer: FARMS_LIST[1],
    healthBreakdown: {
      overallScore: 85,
      cropHealthScore: 88,
      soilHealthScore: 82,
      weatherStabilityScore: 86,
      diseaseRiskScore: 80,
      sustainabilityScore: 90
    },
    satellite: [
      {
        date: getTodayDateString(),
        ndvi: 0.84,
        vegetationHealth: 'Vigorous Paddy Canopy (Cauvery Delta)',
        stressZoneCount: 0,
        imageUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.81,
        zones: [
          {
            id: 'Zone A',
            name: 'Delta Canal Field (Plot 1)',
            health: 'healthy',
            ndvi: 0.87,
            moisture: 'Flooded / High (75%)',
            stressLevel: 'None',
            nitrogenStatus: 'Optimal',
            recommendation: 'Maintain water level at 5cm for panicle initiation.'
          },
          {
            id: 'Zone B',
            name: 'South Parcel (Plot 2)',
            health: 'healthy',
            ndvi: 0.81,
            moisture: 'Optimal (68%)',
            stressLevel: 'Low',
            nitrogenStatus: 'Good',
            recommendation: 'Prepare for neem-coated urea application.'
          }
        ]
      },
      {
        date: '10 Aug 2026',
        ndvi: 0.79,
        vegetationHealth: 'Vigorous Vegetative Tillering',
        stressZoneCount: 0,
        imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.78,
        zones: [
          { id: 'Zone A', name: 'Delta Canal Field', health: 'healthy', ndvi: 0.82, moisture: '72%', stressLevel: 'None', nitrogenStatus: 'Optimal', recommendation: 'Maintain flooding.' }
        ]
      },
      {
        date: '01 Aug 2026',
        ndvi: 0.72,
        vegetationHealth: 'Transplanting Expansion Stage',
        stressZoneCount: 0,
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.75,
        zones: [
          { id: 'Zone A', name: 'Delta Canal Field', health: 'healthy', ndvi: 0.75, moisture: '70%', stressLevel: 'None', nitrogenStatus: 'Good', recommendation: 'Normal growth.' }
        ]
      }
    ],
    weather: {
      currentTemp: 32,
      humidity: 82,
      rainProbability: 25,
      windSpeed: 18,
      uvIndex: 8,
      condition: 'Partly Cloudy with Humid Breeze',
      rainfallExpectedHours: 72,
      forecast: [
        { day: 'Tue', tempHigh: 33, tempLow: 26, rainProb: 25, icon: 'cloud-sun' },
        { day: 'Wed', tempHigh: 32, tempLow: 25, rainProb: 30, icon: 'cloud-sun' },
        { day: 'Thu', tempHigh: 31, tempLow: 25, rainProb: 15, icon: 'sun' }
      ],
      aiImpact: {
        irrigationAction: 'Proceed with Scheduled Canal Irrigation',
        cropRisk: 'Low Submergence Risk',
        recommendation: 'Weather is favorable for paddy growth. Water availability from Cauvery canal is optimal.'
      }
    },
    soil: {
      ph: 7.2,
      nitrogen: 'High',
      phosphorus: 'Medium',
      potassium: 'High',
      organicCarbon: 'Medium',
      organicCarbonPercentage: 0.68,
      moisturePercentage: 72,
      soilType: 'Clayey Delta Alluvium',
      score: 82,
      aiInterpretation: 'Rich alluvial clay soil with high water retention. Potassium levels support disease resistance.',
      recommendations: [
        'Maintain alternate wetting and drying (AWD) to reduce methane emissions by 30%.',
        'Apply zinc sulfate if inter-veinal chlorosis appears on fresh tillers.'
      ]
    },
    cropRecommendations: [
      {
        cropName: 'Paddy Rice (CR-1009 Sub1)',
        suitabilityScore: 95,
        waterRequirement: 'High',
        soilCompatibility: 'Excellent',
        climateRisk: 'Low',
        sustainabilityImpact: 'Submergence tolerant variety. Fits Cauvery delta inundation patterns.',
        expectedYield: '5.5 - 6.0 Tonnes/Ha',
        reasons: [
          'High water retention clay soil ideal for puddled rice',
          'High nitrogen reserve supports dense panicle formation'
        ]
      },
      {
        cropName: 'Black Gram (VBN-8)',
        suitabilityScore: 88,
        waterRequirement: 'Low',
        soilCompatibility: 'Excellent',
        climateRisk: 'Low',
        sustainabilityImpact: 'Paddy-fallow pulse rotation enriches soil microbial biomass.',
        expectedYield: '1.2 - 1.5 Tonnes/Ha',
        reasons: ['Ideal relay crop following paddy harvesting']
      }
    ],
    alerts: [
      {
        id: 'ALT-201',
        type: 'irrigation',
        severity: 'info',
        title: '💧 Alternate Wetting & Drying Schedule',
        message: 'Canal release scheduled for tomorrow. Irrigate Plot 1 to 5cm depth.',
        timestamp: '1 hour ago',
        read: false,
        actionUrl: 'soil'
      }
    ]
  },
  'FARM-33918': {
    farmer: FARMS_LIST[2],
    healthBreakdown: {
      overallScore: 68,
      cropHealthScore: 71,
      soilHealthScore: 60,
      weatherStabilityScore: 65,
      diseaseRiskScore: 75,
      sustainabilityScore: 70
    },
    satellite: [
      {
        date: getTodayDateString(),
        ndvi: 0.65,
        vegetationHealth: 'Moderate Sugarcane Canopy (Nashik District)',
        stressZoneCount: 2,
        imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.45,
        zones: [
          {
            id: 'Zone A',
            name: 'Drip Irrigated Block (Plot 1)',
            health: 'healthy',
            ndvi: 0.76,
            moisture: 'Optimal (52%)',
            stressLevel: 'Low',
            nitrogenStatus: 'Good',
            recommendation: 'Maintain fertigation schedule.'
          },
          {
            id: 'Zone B',
            name: 'Furrow Block (Plot 2)',
            health: 'moderate',
            ndvi: 0.52,
            moisture: 'Low-Moderate (36%)',
            stressLevel: 'Moisture Stress',
            nitrogenStatus: 'Medium',
            recommendation: 'Upgrade to drip lines to reduce evaporative water loss.'
          }
        ]
      },
      {
        date: '10 Aug 2026',
        ndvi: 0.62,
        vegetationHealth: 'Moderate Canopy Growth',
        stressZoneCount: 2,
        imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.41,
        zones: [
          { id: 'Zone A', name: 'Drip Block', health: 'healthy', ndvi: 0.72, moisture: '50%', stressLevel: 'Low', nitrogenStatus: 'Good', recommendation: 'Fertigation active.' },
          { id: 'Zone B', name: 'Furrow Block', health: 'moderate', ndvi: 0.50, moisture: '34%', stressLevel: 'Moisture Stress', nitrogenStatus: 'Medium', recommendation: 'Irrigate Furrow Block.' }
        ]
      },
      {
        date: '01 Aug 2026',
        ndvi: 0.58,
        vegetationHealth: 'Early Stalk Elongation',
        stressZoneCount: 1,
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.39,
        zones: [
          { id: 'Zone A', name: 'Drip Block', health: 'healthy', ndvi: 0.68, moisture: '48%', stressLevel: 'Low', nitrogenStatus: 'Good', recommendation: 'Standard watering.' }
        ]
      }
    ],
    weather: {
      currentTemp: 34,
      humidity: 58,
      rainProbability: 15,
      windSpeed: 12,
      uvIndex: 9,
      condition: 'Sunny & Hot',
      rainfallExpectedHours: 120,
      forecast: [
        { day: 'Tue', tempHigh: 35, tempLow: 22, rainProb: 10, icon: 'sun' },
        { day: 'Wed', tempHigh: 34, tempLow: 21, rainProb: 15, icon: 'sun' }
      ],
      aiImpact: {
        irrigationAction: 'Execute Drip Irrigation Cycle Today',
        cropRisk: 'High Evapotranspiration Rate',
        recommendation: 'High temperatures (34°C) increasing evapotranspiration. Drip fertigation recommended for Block 2.'
      }
    },
    soil: {
      ph: 8.1,
      nitrogen: 'Low',
      phosphorus: 'Medium',
      potassium: 'High',
      organicCarbon: 'Low',
      organicCarbonPercentage: 0.38,
      moisturePercentage: 36,
      soilType: 'Black Cotton Soil (Vertisol)',
      score: 60,
      aiInterpretation: 'Slightly alkaline pH (8.1) in Vertisol soil. High swelling-shrinking clay requires micro-irrigation.',
      recommendations: [
        'Apply elemental sulfur or gypsum to moderate alkaline soil pH.',
        'Use trash mulching between sugarcane rows to conserve soil moisture.'
      ]
    },
    cropRecommendations: [
      {
        cropName: 'Sugarcane (Co 86032)',
        suitabilityScore: 89,
        waterRequirement: 'High',
        soilCompatibility: 'Good',
        climateRisk: 'Moderate',
        sustainabilityImpact: 'High biomass variety for bio-ethanol feedstock.',
        expectedYield: '110 - 125 Tonnes/Ha',
        reasons: ['Deep black cotton soil provides strong physical anchorage']
      }
    ],
    alerts: [
      {
        id: 'ALT-301',
        type: 'stress',
        severity: 'warning',
        title: '☀️ High Heat & Evapotranspiration Alert',
        message: 'Temperature reaching 34°C. Run drip irrigation cycle for 2.5 hours.',
        timestamp: '3 hours ago',
        read: false,
        actionUrl: 'weather'
      }
    ]
  },
  'FARM-10492': {
    farmer: FARMS_LIST[3],
    healthBreakdown: {
      overallScore: 79,
      cropHealthScore: 82,
      soilHealthScore: 74,
      weatherStabilityScore: 78,
      diseaseRiskScore: 85,
      sustainabilityScore: 72
    },
    satellite: [
      {
        date: getTodayDateString(),
        ndvi: 0.77,
        vegetationHealth: 'Vigorous Basmati Tillering (Ludhiana)',
        stressZoneCount: 0,
        imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.70,
        zones: [
          {
            id: 'Zone A',
            name: 'Laser-Leveled Field A',
            health: 'healthy',
            ndvi: 0.81,
            moisture: 'Optimal (65%)',
            stressLevel: 'None',
            nitrogenStatus: 'Sufficient',
            recommendation: 'Laser leveling saved 25% irrigation water.'
          }
        ]
      },
      {
        date: '10 Aug 2026',
        ndvi: 0.73,
        vegetationHealth: 'Healthy Early Tillering',
        stressZoneCount: 0,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.65,
        zones: [
          { id: 'Zone A', name: 'Laser-Leveled Field A', health: 'healthy', ndvi: 0.76, moisture: '62%', stressLevel: 'None', nitrogenStatus: 'Good', recommendation: 'Standard growth schedule.' }
        ]
      },
      {
        date: '01 Aug 2026',
        ndvi: 0.66,
        vegetationHealth: 'Initial Growth Phase',
        stressZoneCount: 0,
        imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000',
        moistureIndex: 0.60,
        zones: [
          { id: 'Zone A', name: 'Laser-Leveled Field A', health: 'healthy', ndvi: 0.69, moisture: '58%', stressLevel: 'None', nitrogenStatus: 'Good', recommendation: 'Laser leveling optimal.' }
        ]
      }
    ],
    weather: {
      currentTemp: 31,
      humidity: 68,
      rainProbability: 45,
      windSpeed: 10,
      uvIndex: 7,
      condition: 'Scattered Monsoon Clouds',
      rainfallExpectedHours: 48,
      forecast: [
        { day: 'Tue', tempHigh: 32, tempLow: 24, rainProb: 45, icon: 'cloud-rain' },
        { day: 'Wed', tempHigh: 31, tempLow: 23, rainProb: 50, icon: 'cloud-rain' },
        { day: 'Thu', tempHigh: 33, tempLow: 25, rainProb: 20, icon: 'cloud-sun' },
        { day: 'Fri', tempHigh: 34, tempLow: 26, rainProb: 15, icon: 'sun' },
        { day: 'Sat', tempHigh: 32, tempLow: 24, rainProb: 30, icon: 'cloud-sun' }
      ],
      aiImpact: {
        irrigationAction: 'Moderate Irrigation Needed',
        cropRisk: 'Low',
        recommendation: 'Soil moisture is adequate. Moderate rain chance (45%) tomorrow.'
      }
    },
    soil: {
      ph: 7.4,
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'Medium',
      organicCarbon: 'Medium',
      organicCarbonPercentage: 0.55,
      moisturePercentage: 58,
      soilType: 'Loamy Sands & Silt',
      score: 74,
      aiInterpretation: 'Subsurface water table monitoring active. Good nutrient availability.',
      recommendations: [
        'Adopt Direct Seeded Rice (DSR) technique to conserve groundwater table.'
      ]
    },
    cropRecommendations: [
      {
        cropName: 'Basmati Rice (Pusa 1121)',
        suitabilityScore: 93,
        waterRequirement: 'High',
        soilCompatibility: 'Excellent',
        climateRisk: 'Low',
        sustainabilityImpact: 'Premium export aromatic grain variety.',
        expectedYield: '4.5 - 4.8 Tonnes/Ha',
        reasons: ['Punjab Indo-Gangetic silt soil ideal for aroma development']
      }
    ],
    alerts: [
      {
        id: 'ALT-401',
        type: 'irrigation',
        severity: 'info',
        title: '💧 Groundwater Depth Tracker',
        message: 'DSR plot soil moisture at 58%. No groundwater pumping required today.',
        timestamp: '4 hours ago',
        read: false,
        actionUrl: 'soil'
      }
    ]
  }
};

export const COMMON_AGRICULTURE_SCHEMA_DEMO = {
  "$schema": "https://agri.brics.org/schemas/v2/farm-data.json",
  "dpiVersion": "2.4.0",
  "country": "IN",
  "region": "Bihar",
  "district": "Muzaffarpur",
  "farmId": "FARM-88219",
  "crop": {
    "name": "wheat",
    "variety": "HD-2967",
    "growthStage": "vegetative",
    "plantingDate": "2026-07-06"
  },
  "soil": {
    "ph": 6.7,
    "nitrogenStatus": "medium",
    "phosphorusStatus": "high",
    "potassiumStatus": "medium",
    "organicCarbon": 0.42,
    "moisturePercentage": 42
  },
  "weather": {
    "temperatureC": 29,
    "humidityPercent": 74,
    "rainProbabilityPercent": 78,
    "expectedRainfallMm": 45
  },
  "cropHealth": {
    "overallNdvi": 0.71,
    "stressZoneDetected": true,
    "healthScore": 72
  },
  "aiAdvisory": {
    "irrigationRecommended": false,
    "actionCode": "POSTPONE_IRRIGATION_RAIN_EXPECTED",
    "confidenceScore": 0.89
  }
};

export const SATELLITE_OBSERVATIONS = FARM_DATA_MAP['FARM-88219'].satellite;
export const DEMO_WEATHER = FARM_DATA_MAP['FARM-88219'].weather;
export const DEMO_SOIL = FARM_DATA_MAP['FARM-88219'].soil;
export const DEMO_CROP_RECOMMENDATIONS = FARM_DATA_MAP['FARM-88219'].cropRecommendations;
export const DEMO_ALERTS = FARM_DATA_MAP['FARM-88219'].alerts;

export const BRICS_COUNTRIES: BRICSCountry[] = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    lat: 20.5937,
    lng: 78.9629,
    activeModelsCount: 24,
    climateModelsCount: 8,
    cropModelsCount: 16,
    sharedDatasetsCount: 42,
    status: 'CONNECTED',
    keyCrops: ['Wheat', 'Rice', 'Pulses', 'Sugarcane', 'Cotton']
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    lat: -14.2350,
    lng: -51.9253,
    activeModelsCount: 19,
    climateModelsCount: 6,
    cropModelsCount: 13,
    sharedDatasetsCount: 38,
    status: 'CONNECTED',
    keyCrops: ['Soybeans', 'Corn', 'Coffee', 'Sugarcane']
  },
  {
    code: 'RU',
    name: 'Russia',
    flag: '🇷🇺',
    lat: 61.5240,
    lng: 105.3188,
    activeModelsCount: 15,
    climateModelsCount: 7,
    cropModelsCount: 8,
    sharedDatasetsCount: 29,
    status: 'CONNECTED',
    keyCrops: ['Winter Wheat', 'Barley', 'Sunflower', 'Sugarbeet']
  },
  {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    lat: 35.8617,
    lng: 104.1954,
    activeModelsCount: 31,
    climateModelsCount: 11,
    cropModelsCount: 20,
    sharedDatasetsCount: 56,
    status: 'CONNECTED',
    keyCrops: ['Rice', 'Maize', 'Wheat', 'Soybeans']
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    lat: -30.5595,
    lng: 22.9375,
    activeModelsCount: 12,
    climateModelsCount: 4,
    cropModelsCount: 8,
    sharedDatasetsCount: 22,
    status: 'CONNECTED',
    keyCrops: ['Maize', 'Citrus', 'Grapes', 'Wheat']
  }
];

export const SHARED_AI_MODELS: AIModelShare[] = [
  {
    id: 'MOD-IN-01',
    title: 'Climate-Resilient Wheat Thermal Stress Model',
    country: 'India',
    countryFlag: '🇮🇳',
    version: 'v2.1',
    status: 'Verified',
    category: 'Climate',
    accuracy: '94.2%',
    description: 'Predicts high-temperature terminal heat stress tolerance during wheat grain-filling phase using Sentinel-2 thermal bands.'
  },
  {
    id: 'MOD-BR-04',
    title: 'Sub-Surface Soil Moisture AI Predictor',
    country: 'Brazil',
    countryFlag: '🇧🇷',
    version: 'v1.8',
    status: 'Shared',
    category: 'Crop Selection',
    accuracy: '91.8%',
    description: 'Deep neural network trained on Cerrado tropical soils to map soil moisture down to 60cm using synthetic aperture radar (SAR).'
  },
  {
    id: 'MOD-IN-03',
    title: 'Multi-Spectral Rust & Blight Vision Net',
    country: 'India',
    countryFlag: '🇮🇳',
    version: 'v3.0',
    status: 'Verified',
    category: 'Disease',
    accuracy: '95.6%',
    description: 'Lightweight MobileNetV3 vision model fine-tuned on 45,000 leaf images of South Asian cereal rust strains.'
  },
  {
    id: 'MOD-CN-09',
    title: 'Autonomous Rice Nitrogen Optimization AI',
    country: 'China',
    countryFlag: '🇨🇳',
    version: 'v4.2',
    status: 'Verified',
    category: 'Yield Prediction',
    accuracy: '93.7%',
    description: 'Generates variable-rate nitrogen application maps using UAV multispectral inputs & hyperspectral soil carbon sensors.'
  },
  {
    id: 'MOD-ZA-02',
    title: 'Semi-Arid Drought Early Warning System',
    country: 'South Africa',
    countryFlag: '🇿🇦',
    version: 'v2.0',
    status: 'Shared',
    category: 'Climate',
    accuracy: '89.5%',
    description: 'Predicts 60-day agricultural drought anomalies using Indian Ocean Dipole and ENSO climate indices.'
  }
];

export const PRESET_DISEASE_SAMPLES = [
  {
    id: 'sample-rust',
    name: 'Wheat Rust (Puccinia graminis)',
    crop: 'Wheat',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    diseaseName: 'Wheat Rust (Orange/Stripe Rust)',
    confidence: 91,
    severity: 'Moderate' as const,
    affectedAreaPercentage: 23,
    immediateAction: 'Isolate affected field parcel (North-West Zone). Postpone nitrogen top-dressing to prevent lush foliage rust spread.',
    preventativeMeasures: [
      'Apply bio-fungicide (Trichoderma viride) or recommended Tebuconazole spot treatment if lesion count exceeds 5/leaf.',
      'Ensure field drainage after expected rainfall to drop canopy humidity.',
      'Plan crop rotation with leguminous pulse in upcoming kharif season.'
    ],
    treatmentAdvisory: 'Verify diagnosis with local Krishi Vigyan Kendra (KVK) extension specialist before applying synthetic chemicals.',
    bbox: { x: 35, y: 25, w: 30, h: 40 }
  },
  {
    id: 'sample-blight',
    name: 'Leaf Blight (Bipolaris sorokiniana)',
    crop: 'Wheat / Barley',
    imageUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=800',
    diseaseName: 'Spot Blight / Leaf Blotch',
    confidence: 88,
    severity: 'Mild' as const,
    affectedAreaPercentage: 12,
    immediateAction: 'Remove heavily spotted lower leaves. Maintain balanced potassium fertility to boost cell wall defense.',
    preventativeMeasures: [
      'Avoid overhead sprinkler irrigation late in the evening.',
      'Use certified disease-free seed for the next planting season.'
    ],
    treatmentAdvisory: 'Monitor canopy expansion over 5 days; action required only if necrotic spot area expands past 20%.',
    bbox: { x: 20, y: 40, w: 45, h: 35 }
  },
  {
    id: 'sample-healthy',
    name: 'Healthy Wheat Leaf',
    crop: 'Wheat',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    diseaseName: 'Healthy Canopy (No Disease Detected)',
    confidence: 96,
    severity: 'Mild' as const,
    affectedAreaPercentage: 0,
    immediateAction: 'No disease intervention needed. Maintain current nutrient & moisture regimen.',
    preventativeMeasures: [
      'Continue bi-weekly satellite NDVI monitoring.',
      'Keep field perimeter clean of weed hosts.'
    ],
    treatmentAdvisory: 'Crop shows vigorous cell turgor and healthy chlorophyll reflectance.',
    bbox: { x: 0, y: 0, w: 0, h: 0 }
  }
];

export const DEMO_ACTION_PLAN = [
  { day: 'Day 1 (Today)', task: 'Monitor North-West zone canopy stress (NDVI 0.43). Check field perimeter for early rust spots.', status: 'pending', category: 'monitoring' },
  { day: 'Day 2 (Tomorrow)', task: '🌧️ POSTPONE IRRIGATION. 78% rainfall expected (approx 45mm). Ensure main drainage channels are clear.', status: 'upcoming', category: 'water' },
  { day: 'Day 3', task: 'Inspect Zone B after rainfall event. Evaluate standing water accumulation in low-lying spots.', status: 'upcoming', category: 'inspection' },
  { day: 'Day 4', task: 'Re-assess soil moisture percentage with mobile sensor probe / soil sample test.', status: 'upcoming', category: 'soil' },
  { day: 'Day 5', task: 'Apply organic compost / bio-fertilizer top dressing if soil conditions are dry & accessible.', status: 'upcoming', category: 'nutrition' },
  { day: 'Day 6', task: 'Perform AgroGPT voice check-in for pest alert update across district.', status: 'upcoming', category: 'ai-check' },
  { day: 'Day 7', task: 'Review updated Sentinel-2 satellite pass NDVI imagery & canopy growth metrics.', status: 'upcoming', category: 'satellite' }
];

export const DEFAULT_FARMER_CONSENT = {
  personalInfo: 'protected' as const,
  farmLocation: 'district' as const,
  soilData: true,
  cropHealthData: true,
  satelliteMetrics: true,
  yieldData: true,
  crossBorderResearch: true,
  aiModelImprovement: true
};

export const COUNTRY_NODES = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currencySymbol: '₹',
    currencyCode: 'INR',
    exchangeRateToINR: 1.0,
    region: 'South Asia (ICAR Gateway)',
    agriculturalDataSource: 'ICAR Agropedia / India Meteorological Dept (IMD)',
    keyCrops: ['Wheat', 'Paddy Rice', 'Millet', 'Chickpea', 'Sugarcane', 'Cotton']
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currencySymbol: 'R$',
    currencyCode: 'BRL',
    exchangeRateToINR: 0.062,
    region: 'Latin America (EMBRAPA Gateway)',
    agriculturalDataSource: 'EMBRAPA AgData Hub / INMET Weather',
    keyCrops: ['Soybean', 'Maize', 'Sugarcane', 'Coffee', 'Wheat']
  },
  {
    code: 'RU',
    name: 'Russia',
    flag: '🇷🇺',
    currencySymbol: '₽',
    currencyCode: 'RUB',
    exchangeRateToINR: 1.08,
    region: 'Eurasia (Rosgidromet Node)',
    agriculturalDataSource: 'Russian AgRegistry / Rosgidromet',
    keyCrops: ['Winter Wheat', 'Barley', 'Sunflower', 'Sugarbeet', 'Oats']
  },
  {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    currencySymbol: '¥',
    currencyCode: 'CNY',
    exchangeRateToINR: 0.087,
    region: 'East Asia (CAAS Gateway)',
    agriculturalDataSource: 'Chinese Academy of Agricultural Sciences (CAAS)',
    keyCrops: ['Rice', 'Maize', 'Wheat', 'Soybean', 'Rapeseed']
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currencySymbol: 'R',
    currencyCode: 'ZAR',
    exchangeRateToINR: 0.22,
    region: 'Southern Africa (ARC Gateway)',
    agriculturalDataSource: 'Agricultural Research Council (ARC) / SA Weather',
    keyCrops: ['Maize', 'Wheat', 'Sunflower', 'Sorghum', 'Citrus']
  }
];


