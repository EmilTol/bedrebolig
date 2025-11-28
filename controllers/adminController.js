const adminService = require('../services/adminService');

exports.getAllUsers = async (req, res) => {

    try {
        const users = await adminService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await adminService.getUserById(req.params.id);
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.updateUser = async (req, res) => {

    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        const user = await adminService.updateUser(userId, req.body ,adminId);
        res.status(200).json({
            message: 'usr has been updated',
            user: user
        });

    } catch (error) {
        if (error.message === 'user not found') {
            return res.status(404).json({error: error.message});
        }

        res.status(500).json({error: error.message});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        const user = await adminService.deleteUser(userId, adminId);
        res.status(200).json({
            message: 'user has been deleted',
            user: user
        });

    } catch (error) {
        if (error.message === 'you cannot delete your own account') {
            return res.status(403).json({error: error.message});
        }
        if (error.message === 'user not found') {
            return res.status(404).json({error: error.message});
        }

        res.status(500).json({error: error.message});
    }
};

// Listing management
exports.getAllListings = async (req, res) => {
    try {
        const listings = await adminService.getAllListings();
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await adminService.getListingById(req.params.id);
        res.status(200).json(listing);
    } catch (error) {
        if (error.message === 'listing not found') {
            return res.status(404).json({error: error.message});
        }
        res.status(500).json({error: error.message});
    }
};

exports.updateListing = async (req, res) => {
    try {
        const listing = await adminService.updateListing(req.params.id, req.body);
        res.status(200).json({
            message: 'listing has been updated',
            listing: listing
        });
    } catch (error) {
        if (error.message === 'listing not found') {
            return res.status(404).json({error: error.message});
        }
        res.status(500).json({error: error.message});
    }
};