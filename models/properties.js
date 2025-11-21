const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    type: {},
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
    basement: {},
    buildYear: {},
    renovationYear: {},
    floors: {},
    energyRating: {},
    evaluation: {}
});