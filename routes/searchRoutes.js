const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search listings by address or postal code
router.get('/search/listings', searchController.searchListings);

module.exports = router;