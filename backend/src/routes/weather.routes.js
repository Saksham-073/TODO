const express = require('express');
const { getWeather } = require('../controllers/weather.controller');

const router = express.Router();

// Public: used when adding a task with a location.
router.get('/:location', getWeather);

module.exports = router;
