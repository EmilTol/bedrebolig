const service = require('../services/userService');

exports.create = async (req, res) => {
    try {
        const user = await service.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAll = async (req, res) => {
    try {
        const users = await service.getAll();
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getById = async (req, res) => {
    try{
        const user = await service.getById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.update = async (req, res) => {
    try{
        const user = await service.update(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}
exports.delete = async (req, res) => {
    try {
        const user = await service.delete(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
