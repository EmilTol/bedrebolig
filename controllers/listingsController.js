const listingService = require('../services/listingsService');

exports.createListing = async (req, res) => {
    try{
        const listing = await listingService.createListing(req.body);
        res.status(201).json(listing);
    } catch ( error) {
        res.status(500).json({error: error.message});
    }
};