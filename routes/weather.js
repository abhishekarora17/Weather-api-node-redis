
const express = require('express');
const router = express.Router();
const axios = require('axios');
const weatherService = require('../services/weatherService');

router.get('/weather/:city', weatherService.getWeatherByCity);

module.exports = router;
