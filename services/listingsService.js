const fs = require('fs');
const path = require('path');
const Listings = require ("../models/listings");
const Users = require ("../models/users");


exports.createListing = async (data) => {
    try{
        const listing = new Listings (data);
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

exports.addTofavourites = async (listingId, userId) => {

    //checks før saving
    const listing = await Listings.findById(listingId);
    if (!listing){
        throw new Error('Listing not found');
    }

    const user = await Users.findById(userId);
    if (!user){
        throw new Error('User not found');
    }

    if (listing.favoritedBy.includes(userId)){
        throw new Error('Listing already favourited')
    }

    listing.favoritedBy.push(userId);
    await listing.save();

    return listing;
}

exports.removeFromfavourites = async (listingId, userId) => {

    const listing = Listings.findById(listingId);


    if (!listing){
        throw new Error('Listing not found');
    }

    if (!listing.favoritedBy.includes(userId)){
        throw new Error('Listing is not in favourites')
    }

    listing.favoritedBy = listing.favoritedBy.filter(
        id => id.toString() !== userId.toString()
    );
    await listing.save();

    return listing;
}

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

