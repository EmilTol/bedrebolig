const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingsController');

router.post("/listing", listingController.createListing);

router.delete("/listing/:id", listingController.deleteListing);


module.exports = router;