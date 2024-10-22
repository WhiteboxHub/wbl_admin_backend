const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../middleware/AdminValidationMiddleware'); // Import your middleware
const poController = require('../controllers/poController'); // Ensure this path is correct

// Get all POs
router.get('/po', AdminValidationMiddleware, poController.getPOs); // Get all purchase orders

// Add new PO
router.post('/add', AdminValidationMiddleware, poController.addPO); // Add new purchase order

// Update PO
router.put('/po/update/:id', AdminValidationMiddleware, poController.updatePO); // Update a purchase order

// View PO by ID


module.exports = router; // Export the router
