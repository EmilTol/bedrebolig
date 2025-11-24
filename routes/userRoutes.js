const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController");
const {validateUser} = require("../middleware/userValidator");

router.post('/user', validateUser, controller.create);
router.delete('/user/:id', controller.delete);
router.put('/user/:id', validateUser, controller.update);
router.get('/user/:id', controller.getById);
router.get('/users', controller.getAll);

module.exports = router;