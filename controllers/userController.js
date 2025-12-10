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
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Du kan kun opdatere din egen profil' });
        }
        const user = await service.update(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}
exports.delete = async (req, res) => { // Læser jeg rigtig, kan realtor slette alle? Tænker ikke det er rigtigt?
    try {
        if (req.user.id !== req.params.id &&
            req.user.role !== 'admin' &&
            req.user.role !== 'realtor') {
            return res.status(403).json({ error: 'Du kan kun slette din egen konto' });
        }


        const user = await service.delete(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//POST
exports.loginUser = async (req, res) => {
    try {
        const user = await service.loginUser(req.body.email, req.body.password);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
