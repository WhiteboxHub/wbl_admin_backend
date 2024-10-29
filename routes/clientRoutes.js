const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');
const clientController = require('../controllers/clientController');
// Get all POs for a client
router.get('/client', AdminValidationMiddleware, clientController.getClients);

// Add new PO for a client
router.post('/client/add', AdminValidationMiddleware, clientController.addClient);

// Update PO for a client
router.put('/client/update/:id', AdminValidationMiddleware, clientController.updateClient);

// View PO by ID for a client
router.get('/client/:id', AdminValidationMiddleware, clientController.viewClientById);

// Delete PO for a client
router.delete('/client/delete/:id', AdminValidationMiddleware, clientController.deleteClient);


module.exports = router;
