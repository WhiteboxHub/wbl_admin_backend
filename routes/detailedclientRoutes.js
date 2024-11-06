const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');
const detailedClientController = require('../controllers/detailedClientController');

// Get all detailed client data
router.get('/detailedclient', AdminValidationMiddleware, detailedClientController.getDetailedClient);

// Update a detailed client
router.put('/detailedclient/update/:id', AdminValidationMiddleware, detailedClientController.updateDetailedClient);

// View a detailed client by ID
router.get('/detailedclient/:id', AdminValidationMiddleware, detailedClientController.viewDetailedClientById);

// Delete a detailed client
router.delete('/detailedclient/delete/:id', AdminValidationMiddleware, detailedClientController.deleteDetailedClient);

module.exports = router;
