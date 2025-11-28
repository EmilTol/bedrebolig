const User = require("../models/users");
const Listings = require("../models/listings");
const {hashPassword} = require("../utils/bcrypt");
const {Roles} = require("../utils/enums");

exports.getAllUsers = async () => {
    const users = await User.find().select('-password');
    return users;
}

exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('user not found');
    }
    return user;
}

exports.updateUser = async (userId, data, adminId) => {

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('user not found')
    }

    if (data.password){
        data.password = await hashPassword(data.password);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {new: true, runValidators: true})
        .select('-password');
    return updatedUser;
};

exports.deleteUser = async (userId, adminId) => {
    if (userId === adminId) {
        throw new Error('you cannot delete your own account');
    }
    const user = await User.findByIdAndDelete(userId).select('-password');
    if (!user) {
        throw new Error('user not found')
    }
    return user;
};

// Listing management
exports.getAllListings = async () => {
    const listings = await Listings.find().sort({ createdAt: -1 });
    return listings;
};

exports.getListingById = async (listingId) => {
    const listing = await Listings.findById(listingId);
    if (!listing) {
        throw new Error('listing not found');
    }
    return listing;
};

exports.updateListing = async (listingId, data) => {
    const listing = await Listings.findByIdAndUpdate(
        listingId,
        data,
        { new: true, runValidators: true }
    );

    if (!listing) {
        throw new Error('listing not found');
    }

    return listing;
};