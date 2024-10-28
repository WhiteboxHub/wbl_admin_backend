const express = require('express');
const router = express.Router();
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');
const urlController = require('../controllers/urlsController');

// Get all URLs
router.get('/urls', AdminValidationMiddleware, urlController.getUrls);

// Add new URL
router.post('/urls/add', AdminValidationMiddleware, urlController.addUrl);

// Update URL by ID
router.put('/urls/update/:id', AdminValidationMiddleware, urlController.updateUrl);

// View URL by ID
router.get('/urls/:id', AdminValidationMiddleware, urlController.viewUrlById);

// Delete URL by ID
router.delete('/urls/delete/:id', AdminValidationMiddleware, urlController.deleteUrl);

module.exports = router;
