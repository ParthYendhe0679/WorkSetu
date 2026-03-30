const dotenv = require('dotenv');
dotenv.config();

/**
 * Geocodes a string address into coordinates [longitude, latitude]
 * Uses Google Maps Geocoding API
 * @param {string} address - The plain text address
 * @returns {Promise<[number, number]|null>} - Returns [lng, lat] or null if failed
 */
const getCoordinatesFromAddress = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.error('❌ GOOGLE_MAPS_API_KEY is missing in backend .env');
            return null;
        }

        if (!address || typeof address !== 'string' || address.trim() === '') {
            return null;
        }

        const encodedAddress = encodeURIComponent(address);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            console.log(`✅ Geocoded "${address}" to [${lng}, ${lat}] (Google)`);
            return [lng, lat]; // GeoJSON format: [longitude, latitude]
        } else {
            console.warn(`⚠️ Google Geocoding failed for "${address}": ${data.status} ${data.error_message || ''}`);
            
            // --- Fallback to Nominatim (OpenStreetMap) ---
            console.log(`🔄 Attempting fallback geocoding for "${address}"...`);
            const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
            const fallbackResponse = await fetch(fallbackUrl, {
                headers: { 'User-Agent': 'WorkSetu-App' }
            });
            const fallbackData = await fallbackResponse.json();

            if (fallbackData && fallbackData.length > 0) {
                const { lat, lon } = fallbackData[0];
                console.log(`✅ Geocoded "${address}" to [${lon}, ${lat}] (Nominatim)`);
                return [parseFloat(lon), parseFloat(lat)];
            }

            return null;
        }
    } catch (error) {
        console.error('❌ Geocoder Error:', error.message);
        return null;
    }
};

module.exports = { getCoordinatesFromAddress };
