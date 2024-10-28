// routes/placementRoutes.js

const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../middleware/AdminValidationMiddleware'); // Import your middleware
const placementController = require('../controllers/placementController'); // Ensure this path is correct

// Get all POs
router.get('/placement', AdminValidationMiddleware, placementController.getPlacements); // Get all purchase orders

// Add new PO

// Update PO
router.put('/placement/update/:id', AdminValidationMiddleware, placementController.updatePlacements); // Update a purchase order

// View PO by ID
router.get('/placement/:id', AdminValidationMiddleware, placementController.viewPlacementById); // View a purchase order by ID

// Delete PO
router.delete('/placement/delete/:id', AdminValidationMiddleware, placementController.deletePlacement); // Delete a purchase order

module.exports = router; // Export the router
