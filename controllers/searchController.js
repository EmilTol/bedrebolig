const searchService = require('../services/searchService');

exports.searchListings = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Søgeord er påkrævet' });
        }

        const listings = await searchService.searchListings(query);

        res.status(200).json({
            count: listings.length,
            listings: listings
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
};