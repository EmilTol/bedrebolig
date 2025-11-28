const adminService = require('../services/adminService');

exports.getAllUsers = async (req, res) => {

    try {
        const users = adminService.getAllUsers();
        res.status(200).json(
            {
                count: users.length,
                users: users
            });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await adminService.getUserById(req.params.id);
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.updateUser = async (req, res) => {

    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        const user = adminService.updateUser(userId, req.body ,adminId);
        res.status(200).json({
            message: 'usr has been updated',
            user: user
        });

    } catch (error) {
        if (error.message === 'user not found') {
            return res.status(404).json({error: error.message});
        }

        res.status(500).json({error: error.message});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const adminId = req.user.id;

        const user = await adminService.deleteUser(userId, adminId);
        res.status(200).json({
            message: 'user has been deleted',
            user: user
        });

    } catch (error) {
        if (error.message === 'you cannot delete your own account') {
            return res.status(403).json({error: error.message});
        }
        if (error.message === 'user not found') {
            return res.status(404).json({error: error.message});
        }

        res.status(500).json({error: error.message});
    }


};