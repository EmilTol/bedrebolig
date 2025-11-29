const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authentication } = require('../middleware/authentication');
const {Roles} = require('../utils/enums');
const {authorize} = require("../middleware/authentication");

// router.use(authentication);
// router.use(authorize(Roles.ADMIN));

// User management routes
router.get('/admin/users', adminController.getAllUsers);
router.get('/admin/users/:id', adminController.getUserById);
router.put('/admin/users/:id', adminController.updateUser);
router.delete('/admin/users/:id', adminController.deleteUser);

// Listing management routes
router.get('/admin/listings', adminController.getAllListings);
router.get('/admin/listings/:id', adminController.getListingById);
router.put('/admin/listings/:id', adminController.updateListing);


module.exports = router;