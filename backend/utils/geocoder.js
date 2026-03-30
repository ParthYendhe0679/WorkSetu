const dotenv = require('dotenv');
dotenv.config();

/**
 * Detects if the input looks like an Indian PIN code (6 digits)
 */
const isPinCode = (input) => /^\d{6}$/.test(input.trim());

/**
 * Geocodes a string address OR Indian PIN code into coordinates [longitude, latitude]
 * and returns the resolved human-readable address.
 * Uses Google Maps API with Nominatim fallback.
 * @param {string} address - Plain text address or 6-digit PIN code
 * @returns {Promise<{ coordinates: [number, number], resolvedAddress: string } | null>}
 */
const getCoordinatesFromAddress = async (address) => {
    try {
        if (!address || typeof address !== 'string' || address.trim() === '') {
            return null;
        }

        // If it's a PIN code, append "India" to help geocoders resolve it correctly
        const query = isPinCode(address) ? `${address.trim()} India` : address.trim();
        const encodedQuery = encodeURIComponent(query);
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        // ── Try Google Maps first ───────────────────────────────────────────────
        if (apiKey) {
            try {
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${apiKey}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.status === 'OK' && data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry.location;
                    const resolvedAddress = data.results[0].formatted_address;
                    console.log(`✅ Geocoded "${address}" → "${resolvedAddress}" [${lng}, ${lat}] (Google)`);
                    return { coordinates: [lng, lat], resolvedAddress };
                } else {
                    console.warn(`⚠️ Google Geocoding failed for "${address}": ${data.status} ${data.error_message || ''}`);
                }
            } catch (err) {
                console.warn('⚠️ Google Maps fetch error:', err.message);
            }
        } else {
            console.warn('⚠️ GOOGLE_MAPS_API_KEY not set, skipping Google geocoding.');
        }

        // ── Fallback: Nominatim (OpenStreetMap) ────────────────────────────────
        console.log(`🔄 Attempting Nominatim fallback for "${address}"...`);
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&addressdetails=1&countrycodes=in`;
        const fallbackResponse = await fetch(fallbackUrl, {
            headers: { 'User-Agent': 'WorkSetu-App/1.0' }
        });
        const fallbackData = await fallbackResponse.json();

        if (fallbackData && fallbackData.length > 0) {
            const { lat, lon, display_name } = fallbackData[0];
            console.log(`✅ Geocoded "${address}" → "${display_name}" [${lon}, ${lat}] (Nominatim)`);
            return { coordinates: [parseFloat(lon), parseFloat(lat)], resolvedAddress: display_name };
        }

        console.error(`❌ Could not geocode: "${address}"`);
        return null;

    } catch (error) {
        console.error('❌ Geocoder Error:', error.message);
        return null;
    }
};

module.exports = { getCoordinatesFromAddress };
