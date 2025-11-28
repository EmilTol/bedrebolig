const listingService = require('../services/listingsService');

exports.createListing = async (req, res) => {

    // const images = req.files.map ? `/images/${req.file.filename}` : null;

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

// exports.addToFavourites = async (req, res) => {
//     try {
//         const listingId = req.params.id;
//         const userId = req.user.id;
//
//         const listing = await listingService.addTofavourites(listingId, userId);
//         res.status(200).json({
//             message: 'Favourites added successfully',
//             listing : listing
//         });
//
//     } catch (error) {
//         if (error.message === 'User not found' || error.message === 'Listing not found') {
//            return res.status(404).json({error: error.message});
//         }
//         if (error.message === 'Listing already favourited'){
//            return res.status(400).json({error: error.message});
//         }
//         res.status(500).json({error: error.message});
//     }
// };

// exports.removeFromFavourites = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const listingId = req.params.id;
//
//         const listing = listingService.removeFromfavourites(listingId, userId);
//         res.status(200).json({
//             message: 'listing removed from favouritess successfully',
//             listing : listing
//         });
//
//     } catch (error) {
//         if (error.message === 'Listing not found'){
//             return res.status(404).json({error: error.message});
//         }
//         if (error.message === 'Listing is not in favourites'){
//             return res.status(400).json({error: error.message});
//         }
//         res.status(500).json({error: error.message});
//     }
// };

exports.getUserFavourites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favourites = listingService.getUserFavourites(userId);
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