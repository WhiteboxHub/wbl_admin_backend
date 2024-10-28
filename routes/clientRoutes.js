const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../middleware/AdminValidationMiddleware');
const clientController = require('../controllers/clientController');
// Get all POs for a client
router.get('/client', AdminValidationMiddleware, clientController.getPOsByClient);

// Add new PO for a client
router.post('/client/add', AdminValidationMiddleware, clientController.addPOByClient);

// Update PO for a client
router.put('/client/update/:id', AdminValidationMiddleware, clientController.updatePOByClient);

// View PO by ID for a client
router.get('/client/:id', AdminValidationMiddleware, clientController.viewPOByClientId);

// Delete PO for a client
router.delete('/client/delete/:id', AdminValidationMiddleware, clientController.deletePOByClient);


module.exports = router;
