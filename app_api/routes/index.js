const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

// Test route
router.get('/test', tripsController.testConnection);

// Define API routes with full CRUD operations
router
    .route('/trips')
    .get(tripsController.tripsList)        // GET all trips
    .post(tripsController.tripsAddTrip);   // POST new trip

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsGetByCode)      // GET single trip
    .put(tripsController.tripsUpdateTrip)     // PUT update trip
    .delete(tripsController.tripsDeleteTrip); // DELETE trip

module.exports = router;