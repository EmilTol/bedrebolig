const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authentication } = require('../middleware/authentication');
const {Roles} = require('../utils/enums');
const {authorize} = require("../middleware/authentication");


// User management routes
router.get('/admin/users', authentication, authorize(Roles.ADMIN), adminController.getAllUsers);
router.get('/admin/users/:id', authentication, authorize(Roles.ADMIN), adminController.getUserById);
router.put('/admin/users/:id', authentication, authorize(Roles.ADMIN), adminController.updateUser);
router.delete('/admin/users/:id', authentication, authorize(Roles.ADMIN), adminController.deleteUser);

// Listing management routes
router.get('/admin/listings', adminController.getAllListings);
router.get('/admin/listings/:id', adminController.getListingById);
router.put('/admin/listings/:id', adminController.updateListing);


module.exports = router;