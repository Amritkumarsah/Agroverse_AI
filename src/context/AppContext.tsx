import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppView, 
  UserRole, 
  LanguageCode, 
  AlertItem, 
  ClimateScenario, 
  FarmHealthBreakdown,
  FarmerProfile,
  SoilHealthData,
  WeatherData,
  SatelliteObservation,
  AIModelShare,
  FarmerConsentState
} from '../types';
import { getTodayDateString } from '../utils/dateUtils';
import { FARMS_LIST, FARM_DATA_MAP, SHARED_AI_MODELS, DEFAULT_FARMER_CONSENT } from '../data/demoData';
import { scoringEngine } from '../services/scoringEngine';
import { soilService } from '../services/soilService';
import { remoteSensingService } from '../services/remoteSensingService';
import { networkService } from '../services/networkService';
import { weatherService } from '../services/weatherService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { firebaseService, UserProfileData } from '../services/firebaseService';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  appMode: 'farmer' | 'expert';
  setAppMode: (mode: 'farmer' | 'expert') => void;
  toggleAppMode: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  farms: FarmerProfile[];
  selectedFarmId: string;
  setSelectedFarmId: (id: string) => void;
  selectedFarm: FarmerProfile;
  isLoading: boolean;
  alerts: AlertItem[];
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  climateScenario: ClimateScenario;
  setClimateScenario: React.Dispatch<React.SetStateAction<ClimateScenario>>;
  healthBreakdown: FarmHealthBreakdown;
  resetScenario: () => void;
  sharedModels: AIModelShare[];
  shareModel: (payload: Partial<AIModelShare>) => Promise<void>;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  soilData: SoilHealthData;
  updateSoilData: (updated: Partial<SoilHealthData>) => void;
  weatherData: WeatherData;
  weatherSource: 'live' | 'demo';
  satelliteData: SatelliteObservation[];
  addNewFarm: (farmData: { farmer: string; location: string; latitude: number; longitude: number; farmSizeHectares: number; crop: string; avatarUrl?: string }) => void;
  editExistingFarm: (id: string, farmData: { farmer: string; location: string; latitude: number; longitude: number; farmSizeHectares: number; crop: string; avatarUrl?: string }) => void;
  deleteExistingFarm: (id: string) => void;
  consent: FarmerConsentState;
  updateConsent: (updated: Partial<FarmerConsentState>) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  currentUser: UserProfileData | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
  logout: () => void;
  resendVerificationEmail: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [appMode, setAppModeState] = useState<'farmer' | 'expert'>('farmer');
  const [role, setRole] = useState<UserRole>('farmer');
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('agroverse_language');
      if (saved && ['en', 'hi', 'pa', 'ta', 'te', 'mr', 'bn'].includes(saved)) {
        return saved as LanguageCode;
      }
    } catch (e) {
      console.warn('Failed reading language from localStorage:', e);
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('agroverse_language', lang);
    } catch (e) {
      console.warn('Failed saving language to localStorage:', e);
    }
  };

  // Dark / Light Theme State with LocalStorage Persistence
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('agroverse_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.warn('Failed reading theme from localStorage:', e);
    }
    return 'dark';
  });

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('agroverse_theme', newTheme);
    } catch (e) {
      console.warn('Failed saving theme to localStorage:', e);
    }
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    showToast(`Switched theme to ${newTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`, 'info');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  // Firebase User State & Auth Listener
  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Fetch profile from Firestore if available
        const profile = await firebaseService.getUserProfile(fbUser, role);
        if (profile) {
          setCurrentUser(profile);
          if (profile.role) {
            setRole(profile.role);
          }
        } else {
          // Fallback basic user profile for newly created or active Firebase user
          setCurrentUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'AgriUser',
            photoURL: fbUser.photoURL,
            role: role || 'farmer',
            createdAt: new Date().toISOString(),
            emailVerified: fbUser.emailVerified
          });
        }
      } else {
        setCurrentUser(null);
      }
    });

    // Sync persistent farms from Firestore on load
    firebaseService.getFarmsFromFirestore().then((firestoreFarms) => {
      if (firestoreFarms && firestoreFarms.length > 0) {
        setFarms(firestoreFarms);
      }
    }).catch(e => console.warn('Firestore initial sync note:', e));

    return () => unsubscribe();
  }, [role]);

  const logout = async () => {
    try {
      await firebaseService.logout();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    setCurrentUser(null);
    setCurrentView('landing');
    setRole('farmer');
    showToast('Logged out successfully. Returned to AGROVERSE AI Landing Page.', 'success');
  };

  const resendVerificationEmail = async () => {
    await firebaseService.resendVerificationEmail();
    showToast('Verification link sent to your Gmail inbox!', 'success');
  };

  const checkEmailVerification = async () => {
    const isVerified = await firebaseService.checkEmailVerified();
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, emailVerified: isVerified } : null);
    }
    return isVerified;
  };

  // Farmer Consent State with LocalStorage Persistence
  const [consent, setConsent] = useState<FarmerConsentState>(() => {
    try {
      const saved = localStorage.getItem('agroverse_farmer_consent');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading consent from localStorage:', e);
    }
    return DEFAULT_FARMER_CONSENT;
  });

  const updateConsent = (updated: Partial<FarmerConsentState>) => {
    setConsent(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('agroverse_farmer_consent', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed saving consent to localStorage:', e);
      }
      return next;
    });
  };

  const setAppMode = (mode: 'farmer' | 'expert') => {
    setAppModeState(mode);
    showToast(mode === 'farmer' ? 'Switched to 👨🌾 Farmer Mode (Simple Guidance)' : 'Switched to 👨💻 Expert Mode (Detailed Analytics)', 'info');
  };

  const toggleAppMode = () => {
    setAppMode(appMode === 'farmer' ? 'expert' : 'farmer');
  };
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Multi-Farm state with localStorage persistence
  const [farms, setFarms] = useState<FarmerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('agroverse_farms');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to load farms from localStorage:', err);
    }
    return FARMS_LIST;
  });

  const [selectedFarmId, setSelectedFarmIdState] = useState<string>(() => {
    return farms[0]?.id || 'FARM-88219';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync farms to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('agroverse_farms', JSON.stringify(farms));
    } catch (err) {
      console.error('Failed to save farms to localStorage:', err);
    }
  }, [farms]);

  // Dynamic farm data helper for static or custom farms
  const getFarmData = (id: string, currentFarmsList: FarmerProfile[]) => {
    if (FARM_DATA_MAP[id]) return FARM_DATA_MAP[id];
    const targetFarm = currentFarmsList.find(f => f.id === id);
    if (targetFarm) {
      const generatedData = {
        farmer: targetFarm,
        healthBreakdown: {
          overallScore: 78,
          cropHealthScore: 80,
          soilHealthScore: 72,
          weatherStabilityScore: 75,
          diseaseRiskScore: 85,
          sustainabilityScore: 76
        },
        satellite: [
          {
            date: getTodayDateString(),
            ndvi: 0.74,
            vegetationHealth: 'Vigorous Canopy Growth',
            stressZoneCount: 0,
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
            moistureIndex: 0.65,
            zones: [
              { id: 'Zone A', name: 'Main Parcel', health: 'healthy' as const, ndvi: 0.76, moisture: '58%', stressLevel: 'None', nitrogenStatus: 'Optimal', recommendation: 'Maintain standard growth schedule.' }
            ]
          }
        ],
        weather: {
          currentTemp: 30,
          humidity: 70,
          rainProbability: 20,
          windSpeed: 12,
          uvIndex: 7,
          condition: 'Clear Sky',
          rainfallExpectedHours: 72,
          forecast: [
            { day: 'Tue', tempHigh: 31, tempLow: 24, rainProb: 20, icon: 'sun' }
          ],
          aiImpact: {
            irrigationAction: 'Execute Standard Irrigation',
            cropRisk: 'Low',
            recommendation: 'Weather conditions optimal for growth.'
          }
        },
        soil: {
          ph: 6.8,
          nitrogen: 'Medium' as const,
          phosphorus: 'High' as const,
          potassium: 'Medium' as const,
          organicCarbon: 'Medium' as const,
          organicCarbonPercentage: 0.55,
          moisturePercentage: 50,
          soilType: 'Alluvial Loam',
          score: 72,
          aiInterpretation: 'Balanced soil pH and good nutrient availability.',
          recommendations: ['Maintain organic matter top-dressing.']
        },
        cropRecommendations: [
          { cropName: targetFarm.crop, suitabilityScore: 92, waterRequirement: 'Medium' as const, soilCompatibility: 'Excellent' as const, climateRisk: 'Low' as const, sustainabilityImpact: 'High compatibility.', expectedYield: '4.5 Tonnes/Ha', reasons: ['Compatible soil & climate'] }
        ],
        alerts: [
          { id: `ALT-${targetFarm.id}`, type: 'irrigation' as const, severity: 'info' as const, title: '🌱 Farm Parcel Active', message: `Selected ${targetFarm.name}'s parcel in ${targetFarm.location}. Live weather fetching active.`, timestamp: 'Just now', read: false }
        ]
      };
      FARM_DATA_MAP[id] = generatedData;
      return generatedData;
    }
    return FARM_DATA_MAP['FARM-88219'] || Object.values(FARM_DATA_MAP)[0];
  };

  // Dynamic farm data state
  const [activeFarmData, setActiveFarmData] = useState(() => getFarmData(selectedFarmId, farms));
  const [soilData, setSoilData] = useState<SoilHealthData>(() => getFarmData(selectedFarmId, farms).soil);
  const [climateScenario, setClimateScenario] = useState<ClimateScenario>({ tempDelta: 0, rainfallDelta: 0 });
  const [sharedModels, setSharedModels] = useState<AIModelShare[]>(SHARED_AI_MODELS);
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    try {
      const saved = localStorage.getItem('agrinexsus_alerts_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed reading alerts state from localStorage:', e);
    }
    return getFarmData(selectedFarmId, farms).alerts;
  });

  // Persist alerts read/unread status in localStorage across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem('agrinexsus_alerts_state', JSON.stringify(alerts));
    } catch (err) {
      console.error('Failed saving alerts to localStorage:', err);
    }
  }, [alerts]);

  // Live vs Demo Weather Provider State
  const [weatherData, setWeatherData] = useState<WeatherData>(() => getFarmData(selectedFarmId, farms).weather);
  const [weatherSource, setWeatherSource] = useState<'live' | 'demo'>('demo');

  const selectedFarm = activeFarmData.farmer;

  // Scientific Remote Sensing Satellite Observation computed dynamically
  const liveSatelliteObs = remoteSensingService.computeSatelliteObservation(selectedFarm);
  const satelliteData: SatelliteObservation[] = [liveSatelliteObs];

  // Effect: Fetch live weather and soil telemetry whenever active farm or climate scenario changes
  useEffect(() => {
    let isSubscribed = true;
    weatherService.fetchWeatherForFarmer(selectedFarm, climateScenario).then(res => {
      if (isSubscribed) {
        setWeatherData(res.data);
        setWeatherSource(res.source);

        // Dynamically compute soil health from live telemetry
        const computedSoil = soilService.computeSoilHealth(selectedFarm);
        setSoilData(computedSoil);
      }
    });
    return () => { isSubscribed = false; };
  }, [selectedFarm.id, selectedFarm.coordinates, climateScenario]);

  // Handle farm selection with smooth loading transition
  const setSelectedFarmId = (id: string) => {
    if (id === selectedFarmId) return;
    setIsLoading(true);
    setSelectedFarmIdState(id);

    setTimeout(() => {
      const data = getFarmData(id, farms);
      setActiveFarmData({ ...data });
      setSoilData({ ...data.soil });
      setAlerts([...data.alerts]);
      setClimateScenario({ tempDelta: 0, rainfallDelta: 0 });
      setIsLoading(false);
      showToast(`Switched farm to ${data.farmer.name} (${data.farmer.location})`, 'success');
    }, 250);
  };

  const addNewFarm = (farmData: { farmer: string; location: string; latitude: number; longitude: number; farmSizeHectares: number; crop: string; avatarUrl?: string }) => {
    const newId = `FARM-${Math.floor(10000 + Math.random() * 90000)}`;
    const lat = farmData.latitude;
    const lng = farmData.longitude;

    const newFarmerProfile: FarmerProfile = {
      id: newId,
      name: farmData.farmer,
      location: farmData.location,
      district: farmData.location,
      state: 'State',
      country: 'India',
      crop: farmData.crop,
      variety: 'Custom Variety',
      farmSizeHectares: farmData.farmSizeHectares,
      growthStage: 'Active Growth',
      coordinates: [
        [lat, lng],
        [lat + 0.003, lng],
        [lat + 0.003, lng + 0.003],
        [lat, lng + 0.003]
      ],
      avatarUrl: farmData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };

    const newFullData = {
      farmer: newFarmerProfile,
      healthBreakdown: {
        overallScore: 78,
        cropHealthScore: 80,
        soilHealthScore: 72,
        weatherStabilityScore: 75,
        diseaseRiskScore: 85,
        sustainabilityScore: 76
      },
      satellite: [
        {
          date: getTodayDateString(),
          ndvi: 0.74,
          vegetationHealth: 'Vigorous Canopy Growth',
          stressZoneCount: 0,
          imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
          moistureIndex: 0.65,
          zones: [
            { id: 'Zone A', name: 'Main Parcel', health: 'healthy' as const, ndvi: 0.76, moisture: '58%', stressLevel: 'None', nitrogenStatus: 'Optimal', recommendation: 'Maintain standard growth schedule.' }
          ]
        }
      ],
      weather: {
        currentTemp: 30,
        humidity: 70,
        rainProbability: 20,
        windSpeed: 12,
        uvIndex: 7,
        condition: 'Clear Sky',
        rainfallExpectedHours: 72,
        forecast: [
          { day: 'Tue', tempHigh: 31, tempLow: 24, rainProb: 20, icon: 'sun' }
        ],
        aiImpact: {
          irrigationAction: 'Execute Standard Irrigation',
          cropRisk: 'Low',
          recommendation: 'Weather conditions optimal for growth.'
        }
      },
      soil: {
        ph: 6.8,
        nitrogen: 'Medium' as const,
        phosphorus: 'High' as const,
        potassium: 'Medium' as const,
        organicCarbon: 'Medium' as const,
        organicCarbonPercentage: 0.55,
        moisturePercentage: 50,
        soilType: 'Alluvial Loam',
        score: 72,
        aiInterpretation: 'Balanced soil pH and good nutrient availability.',
        recommendations: ['Maintain organic matter top-dressing.']
      },
      cropRecommendations: [
        { cropName: farmData.crop, suitabilityScore: 92, waterRequirement: 'Medium' as const, soilCompatibility: 'Excellent' as const, climateRisk: 'Low' as const, sustainabilityImpact: 'High compatibility.', expectedYield: '4.5 Tonnes/Ha', reasons: ['Compatible soil & climate'] }
      ],
      alerts: [
        { id: `ALT-${newId}`, type: 'irrigation' as const, severity: 'info' as const, title: '🌱 Farm Parcel Created', message: `Registered ${farmData.farmer}'s parcel in ${farmData.location}. Live weather fetching active.`, timestamp: 'Just now', read: false }
      ]
    };

    FARM_DATA_MAP[newId] = newFullData;
    setFarms(prev => [newFarmerProfile, ...prev]);
    setSelectedFarmId(newId);

    // Save to Firebase Firestore
    firebaseService.saveFarmToFirestore(newFarmerProfile);

    showToast(`Created new farm parcel for ${farmData.farmer} (${farmData.location})`, 'success');
  };

  const editExistingFarm = (id: string, farmData: { farmer: string; location: string; latitude: number; longitude: number; farmSizeHectares: number; crop: string; avatarUrl?: string }) => {
    const lat = farmData.latitude;
    const lng = farmData.longitude;

    let updatedProfile: FarmerProfile | null = null;
    setFarms(prev => prev.map(f => {
      if (f.id === id) {
        updatedProfile = {
          ...f,
          name: farmData.farmer,
          location: farmData.location,
          crop: farmData.crop,
          farmSizeHectares: farmData.farmSizeHectares,
          avatarUrl: farmData.avatarUrl || f.avatarUrl,
          coordinates: [
            [lat, lng],
            [lat + 0.003, lng],
            [lat + 0.003, lng + 0.003],
            [lat, lng + 0.003]
          ]
        };
        return updatedProfile;
      }
      return f;
    }));

    if (updatedProfile) {
      firebaseService.saveFarmToFirestore(updatedProfile);
    }

    if (FARM_DATA_MAP[id]) {
      FARM_DATA_MAP[id].farmer.name = farmData.farmer;
      FARM_DATA_MAP[id].farmer.location = farmData.location;
      FARM_DATA_MAP[id].farmer.crop = farmData.crop;
      FARM_DATA_MAP[id].farmer.farmSizeHectares = farmData.farmSizeHectares;
      if (farmData.avatarUrl) {
        FARM_DATA_MAP[id].farmer.avatarUrl = farmData.avatarUrl;
      }
      FARM_DATA_MAP[id].farmer.coordinates = [
        [lat, lng],
        [lat + 0.003, lng],
        [lat + 0.003, lng + 0.003],
        [lat, lng + 0.003]
      ];
      setActiveFarmData({ ...FARM_DATA_MAP[id] });
    }
    showToast(`Updated farm details for ${farmData.farmer}`, 'success');
  };

  const deleteExistingFarm = (id: string) => {
    if (farms.length <= 1) {
      showToast('Cannot delete the last remaining farm', 'error');
      return;
    }
    const updatedFarms = farms.filter(f => f.id !== id);
    setFarms(updatedFarms);
    delete FARM_DATA_MAP[id];

    // Delete from Firestore
    firebaseService.deleteFarmFromFirestore(id);

    if (id === selectedFarmId) {
      const remaining = updatedFarms[0];
      if (remaining) {
        setSelectedFarmIdState(remaining.id);
        const data = getFarmData(remaining.id, updatedFarms);
        setActiveFarmData({ ...data });
        setSoilData({ ...data.soil });
        setAlerts([...data.alerts]);
      }
    }
    showToast('Farm parcel deleted permanently', 'info');
  };

  // Dynamically calculate farm health score
  const dynamicSoilScore = soilService.calculateSoilScore(soilData);
  const weatherScore = Math.max(20, Math.min(100, 71 - Math.abs(climateScenario.tempDelta * 5) - Math.abs(climateScenario.rainfallDelta * 0.5)));
  
  const healthBreakdown = scoringEngine.calculateHealth(
    activeFarmData.healthBreakdown.cropHealthScore,
    dynamicSoilScore,
    Math.round(weatherScore),
    activeFarmData.healthBreakdown.diseaseRiskScore,
    activeFarmData.healthBreakdown.sustainabilityScore
  );

  const updateSoilData = (updated: Partial<SoilHealthData>) => {
    setSoilData(prev => ({
      ...prev,
      ...updated
    }));
    showToast('Soil parameters updated. Farm Health score recalculated.', 'info');
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const shareModel = async (payload: Partial<AIModelShare>) => {
    setIsLoading(true);
    const result = await networkService.shareModel(payload);
    if (result.success && result.model) {
      setSharedModels(prev => [result.model!, ...prev]);
      showToast(`AI Model "${result.model.title}" shared successfully with ${result.model.country}!`, 'success');
    }
    setIsLoading(false);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const nextDemoStep = () => {
    if (demoStep < 10) setDemoStep(prev => prev + 1);
  };

  const prevDemoStep = () => {
    if (demoStep > 1) setDemoStep(prev => prev - 1);
  };

  const resetScenario = () => {
    setClimateScenario({ tempDelta: 0, rainfallDelta: 0 });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        appMode,
        setAppMode,
        toggleAppMode,
        role,
        setRole,
        language,
        setLanguage,
        demoMode,
        setDemoMode,
        demoStep,
        setDemoStep,
        nextDemoStep,
        prevDemoStep,
        farms,
        selectedFarmId,
        setSelectedFarmId,
        selectedFarm,
        isLoading,
        alerts,
        markAlertRead,
        markAllAlertsRead,
        climateScenario,
        setClimateScenario,
        healthBreakdown,
        resetScenario,
        sharedModels,
        shareModel,
        toast,
        showToast,
        hideToast,
        soilData,
        updateSoilData,
        weatherData,
        weatherSource,
        satelliteData,
        addNewFarm,
        editExistingFarm,
        deleteExistingFarm,
        consent,
        updateConsent,
        theme,
        setTheme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        logout,
        resendVerificationEmail,
        checkEmailVerification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
