const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingsController');
const { authentication } = require('../middleware/authentication');
const { EnergyRating, BuildingType } = require('../utils/enums');

//Bruges til at sende enums til f.eks. createListing
router.get('/enums', (req, res) => {
    res.json({
        energyRating: Object.values(EnergyRating),
        buildingType: Object.values(BuildingType)
    });
});

router.post("/listing", authentication, listingController.createListing);

router.delete("/listing/:id", listingController.deleteListing);

// routes til favourites

router.post('/listing/:id/favorite', authentication, listingController.addToFavourites);


// autehctication på her??
router.delete('/listing/:id/favourite', authentication, listingController.removeFromFavourites);

router.get('/listing/favourites', listingController.getUserFavourites);


module.exports = router;