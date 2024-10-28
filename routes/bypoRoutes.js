const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../middleware/AdminValidationMiddleware');
const bypoController = require('../controllers/bypoController');

// Get all POs by purchase order number
// Get all POs by purchase order number
router.get('/bypo', AdminValidationMiddleware, bypoController.getPOsByPO);

// Add new PO by purchase order number
router.post('/bypo/add', AdminValidationMiddleware, bypoController.addPOByPO);

// Update PO by purchase order number
router.put('/bypo/update/:id', AdminValidationMiddleware, bypoController.updatePOByPO);

// View PO by purchase order number
router.get('/bypo/:id', AdminValidationMiddleware, bypoController.viewPOByPOId);

// Delete PO by purchase order number
router.delete('/bypo/delete/:id', AdminValidationMiddleware, bypoController.deletePOByPO);


module.exports = router;
