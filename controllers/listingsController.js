const listingService = require('../services/listingsService');

exports.createListing = async (req, res) => {


    const images = req.files && req.files.length > 0
        ? req.files.map(file => `/images/${file.filename}`)
        : [];

    try{
        const listing = await listingService.createListing(req.body, req.user.id, { images });
        res.status(201).json(listing);
    } catch ( error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteListing = async (req, res) => {
    try {
        const listing = await listingService.deleteListing(req.params.id);
        if(!listing) {
            return res.status(404).json({error: "Listing not found"});
        }
        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.toggleFavourite = async (req, res) => {
    try {
        const listingId = req.params.id;
        const userId = req.user.id;

        const result = await listingService.toggleFavorite(listingId, userId);

        if(!result) {
            return res.status(404).json({error: "Listing not found"});
        }
        res.status(200).json(result);
    } catch ( error ) {
        res.status(500).json({error: error.message});
    }
};

exports.getUserFavourites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favourites = await listingService.getUserFavourites(userId);
        res.status(200).json({
            count : favourites.length,
            favorites : favourites
        });
    } catch (error) {
        if (error.message === 'User not found'){
            return res.status(404).json({error: error.message});
        }
        res.status(500).json({error: error.message});
    }
}