const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware'); // Import your middleware
const poController = require('../controllers/poController'); // Ensure this path is correct

// Get all POs
router.get('/po', AdminValidationMiddleware, poController.getPOs); // Get all purchase orders

// Add new PO
router.post('/po/add', AdminValidationMiddleware, poController.addPO); // Add new purchase order

// Update PO
router.put('/po/update/:id', AdminValidationMiddleware, poController.updatePO); // Update a purchase order

// View PO by ID

router.post('/po/search', AdminValidationMiddleware, poController.searchPO);
module.exports = router; // Export the router


///{
//     "POID": 544,
//     "PlacementID": 615,
//     "StartDate": "2024-05-01T07:00:00.000Z",
//     "EndDate": "1899-11-30T08:00:00.000Z",
//     "Rate": "47.0000",
//     "OvertimeRate": "0.0000",
//     "FreqType": "M",
//     "InvoiceFrequency": 0,
//     "InvoiceStartDate": "1899-11-30T08:00:00.000Z",
//     "InvoiceNet": "30",
//     "POUrl": "",
//     "Notes": "nothing",
//     "PlacementDetails": "Devika Singh---RAMY INFOTECH---UPS"
// }