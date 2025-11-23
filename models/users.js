const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {Roles} = require("../utils/enums")

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false},

    role: {
        type: String,
        required: true,
        unique: false,
        enum: Object.values(Roles),
        default: Roles.USER },

    email: {
        type: String,
        required: true,
        unique: true},

    password: {
        type: String,
        required: true },

    phoneNumber: {
        type: Number,
        required: true },
});

module.exports = mongoose.model("Users", userSchema);