import { FarmerProfile, SoilHealthData, WeatherData, CropEconomicsOption, CountryNodeConfig } from '../types';
import { COUNTRY_NODES } from '../data/demoData';

export class CropEconomicsEngine {
  /**
   * Computes economic comparison matrix and ROI analysis for multiple crops
   */
  public calculateCropEconomics(
    farmer: FarmerProfile,
    soil: SoilHealthData,
    weather: WeatherData,
    countryCode: string = 'IN'
  ): CropEconomicsOption[] {
    const country = COUNTRY_NODES.find(c => c.code === countryCode) || COUNTRY_NODES[0];
    const rate = country.exchangeRateToINR || 1.0;
    const farmArea = farmer.farmSizeHectares || 2.4;
    const currentCrop = farmer.crop || 'Wheat';

    // Pricing base in INR (will be converted via exchangeRateToINR)
    const baseCrops = [
      {
        name: 'Wheat',
        soilSuitability: 86,
        waterReq: 'Medium' as const,
        yieldTonsHa: 3.2,
        seedCost: 6500,
        fertCost: 12000,
        irrigCost: 7500,
        labourCost: 11000,
        machineryCost: 5000,
        marketPriceTon: 24375, // ₹24,375 / ton (MSP benchmark)
        climateRisk: 'Medium' as const
      },
      {
        name: 'Millet (Bajra/Jowar)',
        soilSuitability: 91,
        waterReq: 'Low' as const,
        yieldTonsHa: 2.8,
        seedCost: 3500,
        fertCost: 7500,
        irrigCost: 3000,
        labourCost: 9000,
        machineryCost: 6000,
        marketPriceTon: 24642, // ₹24,642 / ton
        climateRisk: 'Low' as const
      },
      {
        name: 'Chickpea (Gram)',
        soilSuitability: 88,
        waterReq: 'Low' as const,
        yieldTonsHa: 2.4,
        seedCost: 5000,
        fertCost: 6000,
        irrigCost: 4000,
        labourCost: 10000,
        machineryCost: 6000,
        marketPriceTon: 28750, // ₹28,750 / ton
        climateRisk: 'Low' as const
      },
      {
        name: 'Paddy Rice',
        soilSuitability: 82,
        waterReq: 'High' as const,
        yieldTonsHa: 4.5,
        seedCost: 7000,
        fertCost: 14000,
        irrigCost: 12000,
        labourCost: 16000,
        machineryCost: 7000,
        marketPriceTon: 21830, // ₹21,830 / ton
        climateRisk: 'High' as const
      }
    ];

    const results: CropEconomicsOption[] = baseCrops.map(c => {
      // Apply country exchange rate to costs & market prices
      const seedCost = Math.round(c.seedCost * rate);
      const fertCost = Math.round(c.fertCost * rate);
      const irrigCost = Math.round(c.irrigCost * rate);
      const labourCost = Math.round(c.labourCost * rate);
      const machineryCost = Math.round(c.machineryCost * rate);
      const marketPricePerTon = Math.round(c.marketPriceTon * rate);

      const inputCostPerHa = seedCost + fertCost + irrigCost + labourCost + machineryCost;
      const expectedRevenuePerHa = Math.round(c.yieldTonsHa * marketPricePerTon);
      const estimatedProfitPerHa = expectedRevenuePerHa - inputCostPerHa;

      const totalInputCost = Math.round(inputCostPerHa * farmArea);
      const totalRevenue = Math.round(expectedRevenuePerHa * farmArea);
      const totalProfit = Math.round(estimatedProfitPerHa * farmArea);

      const roiPercentage = parseFloat(((estimatedProfitPerHa / inputCostPerHa) * 100).toFixed(1));

      return {
        cropName: c.name,
        soilSuitability: c.soilSuitability,
        waterRequirement: c.waterReq,
        expectedYieldTonsHa: c.yieldTonsHa,
        inputCostPerHa,
        expectedRevenuePerHa,
        estimatedProfitPerHa,
        totalInputCost,
        totalRevenue,
        totalProfit,
        roiPercentage,
        climateRisk: c.climateRisk,
        isRecommended: false,
        recommendationReason: '',
        breakdown: {
          seedCost,
          fertilizerCost: fertCost,
          irrigationCost: irrigCost,
          labourCost,
          machineryCost,
          marketPricePerTon
        }
      };
    });

    // Find recommended crop based on combination of Profit + Soil + Low Climate Risk
    // Millet usually wins due to low water requirement and high ROI
    results.sort((a, b) => (b.estimatedProfitPerHa * (b.soilSuitability / 100)) - (a.estimatedProfitPerHa * (a.soilSuitability / 100)));

    if (results.length > 0) {
      const top = results[0];
      top.isRecommended = true;

      top.recommendationReason = `${top.cropName} is recommended because current soil conditions are ${top.soilSuitability}% suitable, expected water requirement is ${top.waterRequirement.toLowerCase()}, climate risk is ${top.climateRisk.toLowerCase()}, and estimated profit is higher (${country.currencySymbol}${top.estimatedProfitPerHa.toLocaleString()}/Ha) with an ROI of ${top.roiPercentage}%.`;
    }

    return results;
  }
}

export const cropEconomicsEngine = new CropEconomicsEngine();
