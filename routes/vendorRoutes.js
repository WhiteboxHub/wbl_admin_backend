const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../middleware/AdminValidationMiddleware');
const vendorController = require('../controllers/vendorController');

// Get all POs by vendor
// Get all POs by vendor
router.get('/vendor', AdminValidationMiddleware, vendorController.getPOsByVendor);

// Add new PO by vendor
router.post('/vendor/add', AdminValidationMiddleware, vendorController.addPOByVendor);

// Update PO by vendor
router.put('/vendor/update/:id', AdminValidationMiddleware, vendorController.updatePOByVendor);

// View PO by vendor ID
router.get('/vendor/:id', AdminValidationMiddleware, vendorController.viewPOByVendorId);

// Delete PO by vendor
router.delete('/vendor/delete/:id', AdminValidationMiddleware, vendorController.deletePOByVendor);

module.exports = router;
