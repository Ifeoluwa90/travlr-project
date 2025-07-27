const express = require('express');
const router = express.Router();
const ctrlTravel = require('../controllers/travel');

/* GET home page */
router.get('/', ctrlTravel.home);

/* GET travel page */
router.get('/travel', ctrlTravel.travel);

module.exports = router;