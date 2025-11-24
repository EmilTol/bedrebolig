const User = require('../models/users');

exports.create = async (data) => {
    const user = new User(data);
    await user.save();
    return user;
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