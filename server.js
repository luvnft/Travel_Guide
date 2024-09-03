const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" directory

const LITEAPI_KEY = process.env.LITEAPI_KEY;
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

// Endpoint to get travel data
app.post('/get-itinerary', async (req, res) => {
    const { destination, dates, preferences } = req.body;

    try {
        // Fetch flight data from LiteAPI
        const flightResponse = await axios.get(`https://api.liteapi.travel/flights?key=${LITEAPI_KEY}&destination=${destination}&dates=${dates}`);
        const flights = flightResponse.data;

        // Fetch hotel data from LiteAPI
        const hotelResponse = await axios.get(`https://api.liteapi.travel/hotels?key=${LITEAPI_KEY}&destination=${destination}&dates=${dates}`);
        const hotels = hotelResponse.data;

        // Use Google Gemini to generate itinerary suggestions
        const geminiResponse = await axios.post(`https://gemini.googleapis.com/v1/itineraries:generate`, {
            query: `Create a personalized itinerary for ${destination} with these preferences: ${preferences}`,
            key: GOOGLE_GEMINI_API_KEY
        });
        const itinerary = geminiResponse.data;

        // Send the results back to the client
        res.json({
            flights: flights.results || [],
            hotels: hotels.results || [],
            itinerary: itinerary.suggestions || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
