/**
 * Utility for Reverse Geocoding latitude and longitude to human-readable city/district name
 */
export const reverseGeocodeCity = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.localityInfo?.administrative?.[2]?.name;
      const state = data.principalSubdivision;
      if (city && state && city !== state) {
        return `${city}, ${state}`;
      } else if (city || state) {
        return city || state;
      }
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode failed, trying OpenStreetMap Nominatim:', err);
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    if (res.ok) {
      const data = await res.json();
      const addr = data?.address;
      const city = addr?.city || addr?.town || addr?.village || addr?.county || addr?.state_district;
      const state = addr?.state;
      if (city && state && city !== state) {
        return `${city}, ${state}`;
      } else if (city || state) {
        return city || state;
      }
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode failed:', err);
  }

  return `Local Area (${lat}°N, ${lng}°E)`;
};
