const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const auth = require('../middleware/auth');

// Test route
router.get('/test', tripsController.testConnection);

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Define API routes with full CRUD operations
router
    .route('/trips')
    .get(tripsController.tripsList)           // GET all trips (public)
    .post(auth, tripsController.tripsAddTrip); // POST new trip (protected)

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsGetByCode)         // GET single trip (public)
    .put(auth, tripsController.tripsUpdateTrip)  // PUT update trip (protected)
    .delete(auth, tripsController.tripsDeleteTrip); // DELETE trip (protected)

module.exports = router;