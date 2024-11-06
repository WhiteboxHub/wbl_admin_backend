const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');
const vendorDetailsController = require('../controllers/vendorDetailsController');

// Get all vendor details
router.get('/vendordetails', AdminValidationMiddleware, vendorDetailsController.getVendorDetails);

// Update a vendor detail
router.put('/vendordetails/update/:id', AdminValidationMiddleware, vendorDetailsController.updateVendorDetail);

// View a vendor detail by ID
router.get('/vendordetails/:id', AdminValidationMiddleware, vendorDetailsController.viewVendorDetailById);

// Delete a vendor detail
router.delete('/vendordetails/delete/:id', AdminValidationMiddleware, vendorDetailsController.deleteVendorDetail);

module.exports = router;
