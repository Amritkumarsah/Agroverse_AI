import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'farms.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to load persistent farm database
const loadFarmsFromDb = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading farms.json DB, initializing default store:', err);
  }
  return DEFAULT_FARMS_DATA;
};

// Helper function to save persistent farm database
const saveFarmsToDb = (data) => {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving to farms.json DB:', err);
  }
};

const DEFAULT_FARMS_DATA = {
  'FARM-88219': {
    id: 'FARM-88219',
    farmer: 'Rajesh Kumar',
    location: 'Muzaffarpur, Bihar',
    district: 'Muzaffarpur',
    state: 'Bihar',
    country: 'India',
    crop: 'Wheat (HD-2967)',
    farmSizeHectares: 2.4,
    healthScore: 72,
    coordinates: [[26.1209, 85.3647], [26.1245, 85.3652], [26.1241, 85.3698], [26.1202, 85.3692]],
    satellite: {
      ndvi: 0.71,
      vegetationHealth: 'Healthy (Moderate Stress in NW Zone)',
      stressZones: 1,
      date: '18 Aug 2026',
      zones: [
        { id: 'Zone A', name: 'South-East Zone', health: 'healthy', ndvi: 0.78, moisture: '58%', recommendation: 'Maintain standard growth schedule.' },
        { id: 'Zone B', name: 'North-West Zone', health: 'moderate', ndvi: 0.43, moisture: '42%', recommendation: 'Postpone chemical spray due to rain.' },
        { id: 'Zone C', name: 'Central Patch', health: 'high-risk', ndvi: 0.35, moisture: '31%', recommendation: 'Inspect for early rust infection.' }
      ]
    },
    weather: {
      currentTemp: 29,
      humidity: 74,
      rainProbability: 78,
      condition: 'Thunderstorms Expected in 36h',
      irrigationAction: 'Postpone Irrigation Immediately',
      recommendation: '78% rainfall expected within 36h. Postpone irrigation to avoid waterlogging.'
    },
    soil: {
      ph: 6.7,
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'Medium',
      organicCarbon: 0.42,
      moisture: 42,
      score: 64
    },
    advisory: [
      { cropName: 'Wheat (HD-2967)', suitabilityScore: 91, waterRequirement: 'Medium', reasons: ['pH 6.7 aligns with optimal root absorption', 'Loamy alluvial soil provides good drainage'] },
      { cropName: 'Chickpea (Kabuli)', suitabilityScore: 82, waterRequirement: 'Low', reasons: ['Low water requirement', 'Fixes nitrogen'] }
    ]
  },
  'FARM-54102': {
    id: 'FARM-54102',
    farmer: 'Sita Devi',
    location: 'Thanjavur, Tamil Nadu',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    country: 'India',
    crop: 'Paddy Rice (CR-1009)',
    farmSizeHectares: 3.8,
    healthScore: 85,
    coordinates: [[10.7867, 79.1378], [10.7901, 79.1382], [10.7895, 79.1420], [10.7860, 79.1415]],
    satellite: {
      ndvi: 0.84,
      vegetationHealth: 'Vigorous Paddy Canopy (Cauvery Delta)',
      stressZones: 0,
      date: '18 Aug 2026',
      zones: [
        { id: 'Zone A', name: 'Delta Canal Field', health: 'healthy', ndvi: 0.87, moisture: '75%', recommendation: 'Maintain 5cm ponded water.' }
      ]
    },
    weather: {
      currentTemp: 32,
      humidity: 82,
      rainProbability: 25,
      condition: 'Partly Cloudy',
      irrigationAction: 'Proceed with Scheduled Canal Irrigation',
      recommendation: 'Favorable condition for paddy panicle growth.'
    },
    soil: {
      ph: 7.2,
      nitrogen: 'High',
      phosphorus: 'Medium',
      potassium: 'High',
      organicCarbon: 0.68,
      moisture: 72,
      score: 82
    },
    advisory: [
      { cropName: 'Paddy Rice (CR-1009 Sub1)', suitabilityScore: 95, waterRequirement: 'High', reasons: ['High water retention clay soil', 'Rich Cauvery alluvium'] }
    ]
  },
  'FARM-33918': {
    id: 'FARM-33918',
    farmer: 'Arjun Patil',
    location: 'Nashik, Maharashtra',
    district: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    crop: 'Sugarcane (Co 86032)',
    farmSizeHectares: 5.0,
    healthScore: 68,
    coordinates: [[19.9975, 73.7898], [20.0010, 73.7905], [20.0002, 73.7945], [19.9968, 73.7940]],
    satellite: {
      ndvi: 0.65,
      vegetationHealth: 'Moderate Sugarcane Canopy',
      stressZones: 2,
      date: '18 Aug 2026',
      zones: [
        { id: 'Zone A', name: 'Drip Block', health: 'healthy', ndvi: 0.76, moisture: '52%', recommendation: 'Maintain drip fertigation.' },
        { id: 'Zone B', name: 'Furrow Block', health: 'moderate', ndvi: 0.52, moisture: '36%', recommendation: 'Upgrade to drip lines to curb evaporation.' }
      ]
    },
    weather: {
      currentTemp: 34,
      humidity: 58,
      rainProbability: 15,
      condition: 'Sunny & Hot',
      irrigationAction: 'Execute Drip Irrigation Cycle Today',
      recommendation: '34°C heat driving evapotranspiration. Run drip irrigation cycle for 2.5 hours.'
    },
    soil: {
      ph: 8.1,
      nitrogen: 'Low',
      phosphorus: 'Medium',
      potassium: 'High',
      organicCarbon: 0.38,
      moisture: 36,
      score: 60
    },
    advisory: [
      { cropName: 'Sugarcane (Co 86032)', suitabilityScore: 89, waterRequirement: 'High', reasons: ['Vertisol black cotton soil anchorage', 'High potassium reserves'] }
    ]
  },
  'FARM-10492': {
    id: 'FARM-10492',
    farmer: 'Harpreet Singh',
    location: 'Ludhiana, Punjab',
    district: 'Ludhiana',
    state: 'Punjab',
    country: 'India',
    crop: 'Basmati Rice (Pusa 1121)',
    farmSizeHectares: 4.2,
    healthScore: 79,
    coordinates: [[30.9010, 75.8573], [30.9045, 75.8580], [30.9040, 75.8625], [30.9002, 75.8618]],
    satellite: {
      ndvi: 0.77,
      vegetationHealth: 'Vigorous Basmati Tillering',
      stressZones: 0,
      date: '18 Aug 2026',
      zones: [
        { id: 'Zone A', name: 'Laser-Leveled Field A', health: 'healthy', ndvi: 0.81, moisture: '65%', recommendation: 'Laser leveling saved 25% water.' }
      ]
    },
    weather: {
      currentTemp: 31,
      humidity: 68,
      rainProbability: 45,
      condition: 'Scattered Monsoon Clouds',
      irrigationAction: 'Moderate Irrigation Needed',
      recommendation: 'Soil moisture is 58%. Moderate rain chance (45%) tomorrow.'
    },
    soil: {
      ph: 7.4,
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'Medium',
      organicCarbon: 0.55,
      moisture: 58,
      score: 74
    },
    advisory: [
      { cropName: 'Basmati Rice (Pusa 1121)', suitabilityScore: 93, waterRequirement: 'Medium-High', reasons: ['Punjab Indo-Gangetic silt soil ideal for aroma'] }
    ]
  }
};

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳', activeModels: 24, status: 'CONNECTED' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', activeModels: 19, status: 'CONNECTED' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', activeModels: 15, status: 'CONNECTED' },
  { code: 'CN', name: 'China', flag: '🇨🇳', activeModels: 31, status: 'CONNECTED' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', activeModels: 12, status: 'CONNECTED' }
];

const SHARED_MODELS_STORE = [
  {
    id: 'MOD-IN-01',
    title: 'Climate-Resilient Wheat Thermal Stress Model',
    country: 'India',
    countryFlag: '🇮🇳',
    version: 'v2.1',
    status: 'Verified',
    category: 'Climate',
    accuracy: '94.2%',
    description: 'Predicts high-temperature terminal heat stress tolerance during wheat grain-filling phase.'
  }
];

const FARMS_DATA = loadFarmsFromDb();

// API Routes
app.get('/api/farms', (req, res) => {
  const farmList = Object.values(FARMS_DATA).map(f => ({
    id: f.id,
    farmer: f.farmer,
    location: f.location,
    district: f.district || f.location,
    state: f.state || 'India',
    country: f.country || 'India',
    crop: f.crop,
    farmSizeHectares: f.farmSizeHectares,
    healthScore: f.healthScore,
    coordinates: f.coordinates
  }));
  res.json(farmList);
});

app.get('/api/farms/:id', (req, res) => {
  const farm = FARMS_DATA[req.params.id] || FARMS_DATA['FARM-88219'];
  res.json(farm);
});

app.post('/api/farms', (req, res) => {
  const { farmer, location, district, state, country, crop, farmSizeHectares, latitude, longitude } = req.body;
  const newId = `FARM-${Math.floor(10000 + Math.random() * 90000)}`;
  const lat = parseFloat(latitude) || 26.1209;
  const lng = parseFloat(longitude) || 85.3647;

  const newFarm = {
    id: newId,
    farmer: farmer || 'New Farmer',
    location: location || 'Custom Location',
    district: district || location || 'Custom District',
    state: state || 'State',
    country: country || 'India',
    crop: crop || 'Wheat',
    farmSizeHectares: parseFloat(farmSizeHectares) || 2.5,
    healthScore: 78,
    coordinates: [
      [lat, lng],
      [lat + 0.003, lng],
      [lat + 0.003, lng + 0.003],
      [lat, lng + 0.003]
    ],
    satellite: {
      ndvi: 0.73,
      vegetationHealth: 'Healthy Canopy',
      stressZones: 0,
      date: '18 Aug 2026',
      zones: [
        { id: 'Zone A', name: 'Main Plot', health: 'healthy', ndvi: 0.75, moisture: '55%', recommendation: 'Standard growth regimen.' }
      ]
    },
    weather: {
      currentTemp: 30,
      humidity: 70,
      rainProbability: 25,
      condition: 'Partly Cloudy',
      irrigationAction: 'Execute Standard Irrigation',
      recommendation: 'Weather conditions favorable for active growth.'
    },
    soil: {
      ph: 6.8,
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'Medium',
      organicCarbon: 0.52,
      moisture: 48,
      score: 72
    },
    advisory: [
      { cropName: crop || 'Wheat', suitabilityScore: 92, waterRequirement: 'Medium', reasons: ['Compatible soil & climate'] }
    ]
  };

  FARMS_DATA[newId] = newFarm;
  saveFarmsToDb(FARMS_DATA);
  res.status(201).json({ success: true, farm: newFarm });
});

app.put('/api/farms/:id', (req, res) => {
  const farm = FARMS_DATA[req.params.id];
  if (!farm) return res.status(404).json({ error: 'Farm not found' });

  if (req.body.farmer) farm.farmer = req.body.farmer;
  if (req.body.location) farm.location = req.body.location;
  if (req.body.crop) farm.crop = req.body.crop;
  if (req.body.farmSizeHectares) farm.farmSizeHectares = parseFloat(req.body.farmSizeHectares);
  if (req.body.latitude && req.body.longitude) {
    const lat = parseFloat(req.body.latitude);
    const lng = parseFloat(req.body.longitude);
    farm.coordinates = [
      [lat, lng],
      [lat + 0.003, lng],
      [lat + 0.003, lng + 0.003],
      [lat, lng + 0.003]
    ];
  }

  saveFarmsToDb(FARMS_DATA);
  res.json({ success: true, farm });
});

app.delete('/api/farms/:id', (req, res) => {
  if (FARMS_DATA[req.params.id]) {
    delete FARMS_DATA[req.params.id];
    saveFarmsToDb(FARMS_DATA);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Farm not found' });
  }
});

app.get('/api/farms/:id/satellite', (req, res) => {
  const farm = FARMS_DATA[req.params.id] || FARMS_DATA['FARM-88219'];
  res.json(farm.satellite);
});

app.get('/api/farms/:id/weather', async (req, res) => {
  const farm = FARMS_DATA[req.params.id] || FARMS_DATA['FARM-88219'];
  const lat = farm.coordinates?.[0]?.[0] || 26.1209;
  const lng = farm.coordinates?.[0]?.[1] || 85.3647;

  try {
    const fetchRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`);
    if (fetchRes.ok) {
      const liveJson = await fetchRes.json();
      const liveTemp = Math.round(liveJson.current_weather.temperature);
      const rainProb = liveJson.daily?.precipitation_probability_max?.[0] || (liveJson.current_weather.weathercode >= 50 ? 80 : 20);
      const isHighRain = rainProb > 60;

      const liveWeather = {
        ...farm.weather,
        currentTemp: liveTemp,
        rainProbability: rainProb,
        humidity: liveJson.hourly?.relative_humidity_2m?.[0] || farm.weather.humidity,
        irrigationAction: isHighRain ? 'Postpone Irrigation Immediately' : 'Execute Scheduled Irrigation Cycle',
        recommendation: isHighRain 
          ? `Live Open-Meteo weather API predicts ${rainProb}% rain probability for ${farm.location}. Postpone irrigation.` 
          : `Live Open-Meteo weather API reports ${liveTemp}°C and ${rainProb}% rain chance. Irrigation recommended.`
      };
      return res.json(liveWeather);
    }
  } catch (e) {
    console.warn('Backend Open-Meteo fetch fallback:', e);
  }

  res.json(farm.weather);
});

app.get('/api/farms/:id/soil', (req, res) => {
  const farm = FARMS_DATA[req.params.id] || FARMS_DATA['FARM-88219'];
  res.json(farm.soil);
});

app.get('/api/farms/:id/advisory', (req, res) => {
  const farm = FARMS_DATA[req.params.id] || FARMS_DATA['FARM-88219'];
  res.json(farm.advisory);
});

app.post('/api/disease/detect', (req, res) => {
  res.json({
    disease: 'Wheat Rust (Puccinia graminis)',
    confidence: 91,
    severity: 'Moderate',
    affectedArea: 23,
    immediateAction: 'Isolate affected field parcel (North-West Zone). Postpone nitrogen top-dressing.',
    treatmentAdvisory: 'Apply bio-fungicide spot treatment if lesion count exceeds threshold.'
  });
});

app.get('/api/network/countries', (req, res) => {
  res.json(COUNTRIES);
});

app.post('/api/network/models/share', (req, res) => {
  const newModel = {
    id: `MOD-${Date.now()}`,
    title: req.body.title || 'Shared Ag Model',
    country: req.body.country || 'Global',
    countryFlag: req.body.countryFlag || '🌐',
    version: 'v1.0',
    status: 'Shared',
    category: req.body.category || 'Crop Selection',
    accuracy: '92.5%',
    description: req.body.description || 'Model shared via BRICS Digital Public Good network.'
  };
  SHARED_MODELS_STORE.push(newModel);
  res.status(201).json({ success: true, model: newModel });
});

// Digital Public Good (DPG) FAIR-Compliant Interoperability Endpoint
app.get('/api/v1/interop/farms', (req, res) => {
  const interopData = Object.values(FARMS_DATA).map(f => ({
    '@context': 'https://schema.org/AgriParcel',
    '@type': 'AgriParcel',
    id: f.id,
    farmer: {
      name: f.farmer,
      location: f.location,
      district: f.district,
      state: f.state,
      country: f.country
    },
    geo: {
      type: 'Polygon',
      coordinates: f.coordinates
    },
    crop: {
      name: f.crop,
      sizeHectares: f.farmSizeHectares
    },
    telemetry: {
      healthScore: f.healthScore,
      satellite: f.satellite,
      weather: f.weather,
      soil: f.soil
    },
    license: 'CC-BY-4.0 (Open Data Digital Public Good)'
  }));

  res.json({
    standard: 'AgriN FAIR Interoperability Protocol v1.0',
    description: 'Open schema for cross-border digital agriculture data sharing',
    parcels: interopData
  });
});

app.post('/api/agrogpt/chat', (req, res) => {
  const { farmId, message } = req.body;
  const farm = FARMS_DATA[farmId] || FARMS_DATA['FARM-88219'];
  
  let reply = `For ${farm.farmer} in ${farm.location} (${farm.crop}): `;
  if (message.toLowerCase().includes('irrigate') || message.toLowerCase().includes('water')) {
    reply += `Your soil moisture is ${farm.soil.moisture}% and rain probability is ${farm.weather.rainProbability}%. Action: ${farm.weather.irrigationAction}.`;
  } else if (message.toLowerCase().includes('soil') || message.toLowerCase().includes('fertilizer')) {
    reply += `Your soil pH is ${farm.soil.ph} with Organic Carbon at ${farm.soil.organicCarbon}%. We recommend organic compost top dressing to raise organic carbon towards the 0.75% benchmark.`;
  } else {
    reply += `Farm Health score is currently ${farm.healthScore}/100. Satellite NDVI is ${farm.satellite.ndvi}. Weather condition: ${farm.weather.condition}.`;
  }

  res.json({ reply, timestamp: new Date().toLocaleTimeString() });
});

app.listen(PORT, () => {
  console.log(`📡 AGROVERSE AI Express Backend API running on http://localhost:${PORT}`);
});
