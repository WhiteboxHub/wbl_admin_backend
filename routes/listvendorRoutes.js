const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/listvendorsController');
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

// Get all vendors
router.get('/allvendors', AdminValidationMiddleware, vendorController.getAllVendors);

// Add new vendor
router.post('/allvendors/add', AdminValidationMiddleware, vendorController.addVendor);

// Update vendor
router.put('/allvendors/update/:id', AdminValidationMiddleware, vendorController.updateVendor);

// View vendor by ID
router.get('/allvendors/:id', AdminValidationMiddleware, vendorController.viewVendorById);

// Delete vendor
router.delete('/allvendors/delete/:id', AdminValidationMiddleware, vendorController.deleteVendor);

module.exports = router;
