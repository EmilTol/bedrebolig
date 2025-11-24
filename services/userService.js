const user = require('../models/users');

exports.create = async (req, res) => {
    const user = new user(req.body);
    await user.save();
    return res.status(201).json(user);
}

exports.getAll = async (req, res) => {
    const users = await user.find();
    return res.status(200).json(users);
}

exports.getById = async (req, res) => {
    const user = await user.findById(req.params.id);
    if (!user) {
        res.status(404).json({ message: 'No user found' });
    }
    return res.status(200).json(user);
}

exports.update = async (req, res) => {
    const user = await user.findById(req.params.id, req.body);
    if (!user) {
        return res.status(404).json({ message: 'No user found' });
    }
    return res.status(200).json(user);
}

exports.delete = async (req, res) => {
    const user = await user.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'No user found' });
    }
    return res.status(200).json(user);
}