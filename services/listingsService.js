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
            //SÅ, burde sætte dog som default hvis array er tomt
            images: extra.images && extra.images.length > 0 ? extra.images : ["/images/Dog.jpg"],
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
            liked: true,
            message: "Bolig blev tilføjet til favoritter",
            post: addedToFavourites
        };
    }

    const removeFromFavourties = await Listing.findOneAndUpdate(
        { _id: listingId, favoritedBy: { $ne: userId } },
        { $pull: { favoritedBy: userId } },
        { new: true }
    );

    if (removeFromFavourties) {
        return {
            favorited: false,
            message: "Bolig fjernet fra favoritter",
            listing: removedFromFavourites
        };
    }

    return null;
};

// exports.addTofavourites = async (listingId, userId) => {
//
//     //checks før saving
//     const listing = await Listings.findById(listingId);
//     if (!listing){
//         throw new Error('Listing not found');
//     }
//
//     const user = await Users.findById(userId);
//     if (!user){
//         throw new Error('User not found');
//     }
//
//     if (listing.favoritedBy.includes(userId)){
//         throw new Error('Listing already favourited')
//     }
//
//     listing.favoritedBy.push(userId);
//     await listing.save();
//
//     return listing;
// }
//
// exports.removeFromfavourites = async (listingId, userId) => {
//
//     const listing = Listings.findById(listingId);
//
//
//     if (!listing){
//         throw new Error('Listing not found');
//     }
//
//     if (!listing.favoritedBy.includes(userId)){
//         throw new Error('Listing is not in favourites')
//     }
//
//     listing.favoritedBy = listing.favoritedBy.filter(
//         id => id.toString() !== userId.toString()
//     );
//     await listing.save();
//
//     return listing;
// }

exports.getUserFavourites = async ( userId) => {

const user = await Users.findById(userId);
if (!user){
    throw new Error('User not found');
}

const favourites = await Listings.find({
    favouritedBy:userId
})
return favourites;
}

