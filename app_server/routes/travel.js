const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travel');

// GET home page
router.get('/', travelController.homePage);

// GET travel page
router.get('/travel', travelController.travelList);

module.exports = router;