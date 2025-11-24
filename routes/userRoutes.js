const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController");
const {validateUser} = require("../middleware/userValidator");
const {authentication, authorize } = require("../middleware/authentication");
const {Roles} = require("../utils/enums");

router.post('/user', validateUser, controller.create);

//DELETE USER
router.delete('/user/:id',authentication, authorize(Roles.ADMIN, Roles.REALTOR), controller.delete);

router.put('/user/:id', validateUser, controller.update);
router.get('/user/:id', controller.getById);
router.get('/users', controller.getAll);

//lav validation til login, ikke brug validateUser
router.post("/login", controller.loginUser);

module.exports = router;