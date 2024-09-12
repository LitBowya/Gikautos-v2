import axios from 'axios';

const getRouteGeometry = async (mechanicCoords, carOwnerCoords, geoapifyApiKey, mode = 'drive') => {
    // Ensure mode is valid
    if (!['drive', 'walk', 'bicycle'].includes(mode)) {
        throw new Error('Invalid mode. Allowed modes are drive, walk, and bicycle.');
    }

    // Destructure coordinates
    const [mechanicLng, mechanicLat] = mechanicCoords;
    const [carOwnerLng, carOwnerLat] = carOwnerCoords;

    // Construct the Geoapify API URL
    const url = `https://api.geoapify.com/v1/routing?waypoints=${mechanicLat},${mechanicLng}|${carOwnerLat},${carOwnerLng}&mode=${mode}&apiKey=${geoapifyApiKey}`;

    // Make the API request
    const response = await axios.get(url);

    // Log and return the geometry based on the API response structure
    const geometry = response.data.features[0]?.geometry;

    if (geometry && Array.isArray(geometry.coordinates)) {
        console.log('Response Geometry:', geometry);
        console.log('Coordinates:', geometry.coordinates);

        geometry.coordinates.forEach((line, index) => {
            console.log(`Line ${index}:`, line);
            line.forEach((point, pointIndex) => {
                console.log(`  Point ${pointIndex}:`, point);
            });
        });

        return geometry;
    } else {
        throw new Error('Invalid response structure or no coordinates found.');
    }
};

export default getRouteGeometry;
