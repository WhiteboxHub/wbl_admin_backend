const express = require('express');
const router = express.Router();
const overdueController = require('../controllers/overdueController');
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

router.get('/overdue', AdminValidationMiddleware, overdueController.getOverduePOs);

// Add new overdue PO
router.post('/overdue/add', AdminValidationMiddleware, overdueController.addOverduePO);

// Update overdue PO
router.put('/overdue/update/:id', AdminValidationMiddleware, overdueController.updateOverduePO);

// View overdue PO by ID
router.get('/overdue/:id', AdminValidationMiddleware, overdueController.viewOverduePOById);

// Delete overdue PO
router.delete('/overdue/delete/:id', AdminValidationMiddleware, overdueController.deleteOverduePO);


module.exports = router;
