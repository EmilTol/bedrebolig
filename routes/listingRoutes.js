const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingsController');
const { authentication } = require('../middleware/authentication');
const {upload} = require('../middleware/imagesUpload');
const { EnergyRating, BuildingType } = require('../utils/enums');

//Bruges til at sende enums til f.eks. createListing
router.get('/enums', (req, res) => {
    res.json({
        energyRating: Object.values(EnergyRating),
        buildingType: Object.values(BuildingType)
    });
});

router.post("/listing",
    authentication,
    upload.array("images", 10),
    listingController.createListing);

router.delete("/listing/:id", listingController.deleteListing);

// routes til favourites
router.post("/listing/:id/favourite", authentication, listingController.toggleFavourite);
// router.post('/listing/:id/favorite', authentication, listingController.addToFavourites);
// router.delete('/listing/:id/favourite', authentication, listingController.removeFromFavourites);

router.get('/listing/favourites', listingController.getUserFavourites);


module.exports = router;