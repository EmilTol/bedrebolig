const fs = require('fs');
const path = require('path');
const Listings = require ("../models/listings");
const Users = require ("../models/users");
// const {removeFromFavourites} = require("../controllers/listingsController");


exports.createListing = async (data, userId, extra = {}) => {
    try{
        const listing = new Listings ({
            ...data,
            user_id: userId,
            //Sets dog.jpg as default image
            images: extra.images && extra.images.length > 0 ? extra.images : ["/images/house-placeholder.jpg"],
        });

        await listing.save();
        return listing;
    } catch (error) {
        throw new Error(`Failed to create listing: ${error.message}`);
    }
}

exports.deleteListing = async (data) => {
    const listing = await Listings.findByIdAndDelete(data)

    if (!data){
        console.log("Ingen post at slette")
        return null;
    }
    return listing;

}

exports.toggleFavorite = async (listingId, userId) => {
    const addedToFavourites = await Listings.findOneAndUpdate(
        { _id: listingId, favoritedBy: { $ne: userId } },
        { $push: {favoritedBy: userId} },
        { new: true }
    );

    if (addedToFavourites) {
        return {
            favorited: true,
            message: "Bolig blev tilføjet til favoritter",
            listing: addedToFavourites
        };
    }

    const removeFromFavourties = await Listings.findOneAndUpdate(
        { _id: listingId, favoritedBy: userId},
        { $pull: { favoritedBy: userId } },
        { new: true }
    );

    if (removeFromFavourties) {
        return {
            favorited: false,
            message: "Bolig fjernet fra favoritter",
            listing: removeFromFavourties
        };
    }

    return null;
};


exports.getUserFavourites = async ( userId) => {

const user = await Users.findById(userId);
if (!user){
    throw new Error('User not found');
}

const favourites = await Listings.find({
    favoritedBy:userId
})
return favourites;
}

