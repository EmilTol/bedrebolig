const User = require('../models/users');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require("../utils/jwt");

exports.create = async (data) => {
    data.password = await hashPassword(data.password);
    const user = new User(data);
    await user.save();

    //gør så password ikke bliver sendt
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

exports.getAll = async () => {
    return await User.find();
}

exports.getById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('Ingen bruger fundet');
    }
    return user;
}

exports.update = async (id, data) => {
    if (data.password) {
        data.password = await hashPassword(data.password);
    }
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
        throw new Error('Ingen bruger fundet');
    }
    return user;
}

exports.delete = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new Error('Ingen bruger fundet');
    }
    return user;
}

//LOGIN TIL EN USER
exports.loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    //tjekker om indtastet password er match
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Genererer JWT token: header.payload.signature
    // Signature beregnes som: hash(header + payload + SECRET_KEY)
    // SECRET_KEY bruges som input til hash-funktionen, men er ikke synlig i token
    // Kun serveren kan verificere/generere gyldig signature (har SECRET_KEY)
    const token = generateToken(user._id);


    const userObject = user.toObject();
    delete userObject.password;
    return {
        user: userObject,
        token: token
    };

}