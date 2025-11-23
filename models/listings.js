const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {Status, Types} = require("../utils/enums")

const listingSchema = new Schema({
    // Listing information
    user_id: {type: Schema.Types.ObjectId, ref: "Users", required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, required: true, enum: Object.values(Status), default: Status.UNDERREVIEW }, //lav enums i utils
    timestamps: true, // Burde håndtere createdAt og UpdatedAt
    images: {type: String, required: false, default: null}, // Lav sti til default billede her måske
    favoritedBy: [{type: Schema.Types.ObjectId, ref: "Users"}],

    //Property information
    type: {type: String, required: true, enum: Object.values(Types) },
    price: {
        purchasePrice: {type: Number, required: true},
        monthlyOwnershipCost: {type: Number, required: true},
        downPayment: {type: Number, required: true},
        brutto: {type: Number, required: true},
        netto: {type: Number, required: true},
    },
    location: {
        city: {type: String, required: true},
        postalCode: {type: Number, required: true} ,
        address: {type: String, required: true},
        coordinates: {
            type: "point",
            coordinates: [{}] //lng, lat
        }
    },
    rooms: {type: Number, required: true},
    squareMeters: {type: Number, required: true},
    lotSize: {type: Number, required: false},
    basementSize: {type: Number, required: false},
    buildYear: {type: Number, required: true},
    renovationYear: {type: Number, required: false},
    floors: {type: Number, required: true},
    apartmentFloor: {type: String, required: false},
    energyRating: {type: String, required: true},
    evaluation: {type: String, required: false}
});