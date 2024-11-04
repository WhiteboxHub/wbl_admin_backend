const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');
const bymonthController = require('../controllers/bymonthController');

// Get all POs by month
// Get all POs by month
router.get('/bymonth', AdminValidationMiddleware, bymonthController.getPOsByMonth);

// Add new PO by month
router.post('/bymonth/add', AdminValidationMiddleware, bymonthController.addPOByMonth);

// Update PO by month
router.put('/bymonth/update/:id', AdminValidationMiddleware, bymonthController.updatePOByMonth);

// View PO by ID for a specific month
router.get('/bymonth/:id', AdminValidationMiddleware, bymonthController.viewPOByMonthById);

// Delete PO by month
router.delete('/bymonth/delete/:id', AdminValidationMiddleware, bymonthController.deletePOByMonth);

module.exports = router;
