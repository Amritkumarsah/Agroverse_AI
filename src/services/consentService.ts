import { FarmerProfile, FarmerConsentState, SoilHealthData, WeatherData, SatelliteObservation, YieldPredictionResult } from '../types';

export class ConsentService {
  /**
   * Generates an anonymized, FAIR-compliant JSON-LD data packet based on farmer consent settings
   */
  public generateAnonymizedPacket(
    farmer: FarmerProfile,
    consent: FarmerConsentState,
    soil: SoilHealthData,
    weather: WeatherData,
    satellite: SatelliteObservation,
    yieldData?: YieldPredictionResult
  ) {
    const isPiiShared = consent.personalInfo === 'shared';
    const isLocationExact = consent.farmLocation === 'exact';
    const isLocationDistrict = consent.farmLocation === 'district';

    // PII Redaction
    const anonymizedFarmerId = `ANON-FARM-${farmer.id.replace('FARM-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const farmerName = isPiiShared ? farmer.name : '[ Protected / Redacted ]';

    let locationInfo = '[ Protected Location ]';
    if (isLocationExact) {
      locationInfo = `${farmer.location}, ${farmer.state}, ${farmer.country}`;
    } else if (isLocationDistrict) {
      locationInfo = `${farmer.district || farmer.location}, ${farmer.country}`;
    }

    let coordinates: any = '[ Protected Coordinates ]';
    if (isLocationExact) {
      coordinates = farmer.coordinates;
    } else if (isLocationDistrict && farmer.coordinates?.[0]) {
      // Coarse grid centroid (rounded to 1 decimal place)
      const latCoarse = Math.round(farmer.coordinates[0][0] * 10) / 10;
      const lngCoarse = Math.round(farmer.coordinates[0][1] * 10) / 10;
      coordinates = [[latCoarse, lngCoarse]];
    }

    return {
      '@context': 'https://schema.org/AgriParcel',
      '@type': 'AgriParcelAnonymizedData',
      standard: 'BRICS AgriN FAIR Data Exchange Protocol v2.4',
      protocolType: 'Digital Public Good (DPG) Cross-Border Exchange',
      anonymizationHash: `SHA256-${Date.now().toString(36)}-${anonymizedFarmerId}`,
      timestamp: new Date().toISOString(),
      farmerConsent: {
        personalInfoProtected: !isPiiShared,
        anonymizedDistrictSharing: consent.farmLocation !== 'protected',
        crossBorderResearchAllowed: consent.crossBorderResearch,
        aiModelImprovementAllowed: consent.aiModelImprovement
      },
      metadata: {
        nodeId: `NODE-${(farmer.country || 'GLOBAL').substring(0, 3).toUpperCase()}-01`,
        originCountry: farmer.country || 'India',
        farmerName,
        region: locationInfo,
        coarseCoordinates: coordinates,
        farmSizeHectares: farmer.farmSizeHectares,
        crop: consent.cropHealthData ? farmer.crop : '[ Redacted ]'
      },
      telemetry: {
        soilData: consent.soilData ? {
          ph: soil.ph,
          organicCarbonPercentage: soil.organicCarbonPercentage,
          soilType: soil.soilType,
          moisturePercentage: soil.moisturePercentage
        } : '[ Consent Revoked ]',

        satelliteMetrics: consent.satelliteMetrics ? {
          ndvi: satellite.ndvi,
          moistureIndex: satellite.moistureIndex,
          vegetationHealth: satellite.vegetationHealth
        } : '[ Consent Revoked ]',

        yieldData: (consent.yieldData && yieldData) ? {
          expectedYieldMin: yieldData.expectedYieldMin,
          expectedYieldMax: yieldData.expectedYieldMax,
          confidenceScore: yieldData.confidenceScore,
          harvestWindow: yieldData.estimatedHarvestWindow
        } : '[ Consent Revoked ]'
      },
      license: 'CC-BY-4.0 (Open Data Digital Public Good for Agricultural Research)'
    };
  }
}

export const consentService = new ConsentService();
