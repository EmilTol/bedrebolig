const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController");
const {validateUser, validateLogin} = require("../middleware/userValidator");
const {validateUserUpdate} = require("../middleware/updateUserValidator");
const {authentication, authorize } = require("../middleware/authentication");
const {Roles} = require("../utils/enums");
const { loginLimiter } = require("../middleware/rateLimiter");

router.post('/user', validateUser, controller.create);

//DELETE USER
router.delete('/user/:id',authentication, authorize(Roles.ADMIN, Roles.REALTOR), controller.delete);

router.put('/user/:id', authentication ,validateUserUpdate, controller.update);
router.get('/user/:id', controller.getById);
router.get('/users', controller.getAll);

router.post("/login", loginLimiter, validateLogin, controller.loginUser);

module.exports = router;