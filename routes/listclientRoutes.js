const express = require('express');
const router = express.Router();
const clientController = require('../controllers/listclientController');
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

// Get all clients
router.get('/alllistclient', AdminValidationMiddleware, clientController.getAllClients);

// Add new client
router.post('/alllistclient/add', AdminValidationMiddleware, clientController.addClient);

// Update client
router.put('/alllistclient/update/:id', AdminValidationMiddleware, clientController.updateClient);

// View client by ID
router.get('/alllistclient/:id', AdminValidationMiddleware, clientController.viewClientById);

// Delete client
router.delete('/alllistclient/delete/:id', AdminValidationMiddleware, clientController.deleteClient);

module.exports = router;
