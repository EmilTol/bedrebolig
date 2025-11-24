const listingService = require('../services/listingsService');

exports.createListing = async (req, res) => {
    try{
        const listing = await listingService.createListing(req.body);
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