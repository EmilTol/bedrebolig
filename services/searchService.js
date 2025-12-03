const Listings = require('../models/listings');

exports.searchListings = async (query) => {
    try {
        const searchQuery = query.trim();
        const isPostalCode = /^\d+$/.test(searchQuery);

        let searchCriteria;

        if (isPostalCode) {
            searchCriteria = {
                'location.postalCode': parseInt(searchQuery),
                status: 'active'
            };
        } else {
            searchCriteria = {
                $or: [
                    { 'location.address': { $regex: searchQuery, $options: 'i' } },
                    { 'location.city': { $regex: searchQuery, $options: 'i' } }
                ],
                status: 'active'
            };
        }

        return await Listings.find(searchCriteria)
            .sort({ createdAt: -1 })
            .limit(50);

    } catch (error) {
        throw new Error(`Fejl ved søgning: ${error.message}`);
    }
};