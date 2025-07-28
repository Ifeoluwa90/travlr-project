const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// Define API routes
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(tripsController.tripsAddTrip);

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsGetByCode)
    .put(tripsController.tripsUpdateTrip);

module.exports = router;