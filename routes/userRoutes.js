const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController");

router.post('/user', controller.create);
router.delete('/user/:id', controller.delete);
router.put('/user/:id', controller.update);
router.get('/user/:id', controller.getById);
router.get('/users', controller.getAll);

module.exports = router;