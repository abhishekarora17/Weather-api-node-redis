const axios = require('axios');
const redisClient = require('../cache/redisClient');

exports.getWeatherByCity = async (req, res) => {
    const { city } = req.params;

    try {
        const cacheKey = city.toLowerCase();

        // Check Redis cache
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
        }

        // Fetch from external API
        const apiKey = process.env.WEATHER_API_KEY;
        const apiUrl = process.env.WEATHER_API_URL;
        const url = `${apiUrl}${cacheKey}?unitGroup=us&key=${apiKey}&contentType=json`;

        const response = await axios.get(url);
        const weatherData = response.data;
        if (!weatherData) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
        // Store in Redis cache
        // Set cache expiration to 10 minutes (600 seconds)
        await redisClient.set(cacheKey, 600, JSON.stringify(weatherData));

        return res.status(200).json({ source: 'api', data: weatherData });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return res.status(500).json({ error: 'Error fetching weather data' });
    }
};
