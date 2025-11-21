const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {},
    role: {},
    email: {},
    password: {},
    phoneNumber: {}
});
