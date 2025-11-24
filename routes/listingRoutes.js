const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingsController');

router.post("/listing", listingController.createListing);



module.exports = router;