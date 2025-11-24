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

