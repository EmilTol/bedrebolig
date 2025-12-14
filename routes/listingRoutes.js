const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingsController');
const { authentication, authorize } = require('../middleware/authentication');
const {upload} = require('../middleware/imagesUpload');
const { EnergyRating, BuildingType, Roles } = require('../utils/enums');

//Bruges til at sende enums til f.eks. createListing
router.get('/enums', (req, res) => {
    res.json({
        energyRating: Object.values(EnergyRating),
        buildingType: Object.values(BuildingType)
    });
});

router.post("/listing",
    authentication,
    authorize(Roles.ADMIN, Roles.REALTOR),
    upload.array("images", 10),
    listingController.createListing);

router.delete("/listing/:id", listingController.deleteListing);

// routes til favourites
router.post("/listing/:id/favourite", authentication, listingController.toggleFavourite);


router.get('/listing/favourites', authentication, listingController.getUserFavourites);


module.exports = router;