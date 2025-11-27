const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingsController');
const { authentication } = require('../middleware/authentication');

router.post("/listing", listingController.createListing);

router.delete("/listing/:id", listingController.deleteListing);

// routes til favourites

router.post('/listing/:id/favorite', authentication, listingController.addToFavourites);


// autehctication på her??
router.delete('/listing/:id/favourite', listingController.removeFromFavourites);

router.get('/listing/favourites', listingController.getUserFavourites);


module.exports = router;