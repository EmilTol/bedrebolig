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


exports.loginUser = async (req, res) => {
    try {
        const user = await userService.loginUser(req.body.email, req.body.password);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}