// searchRoutes.js

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const AdminValidationMiddleware = require('../Middleware/AdminValidationMiddleware');

// Route to search candidates by name
router.get('/searchByName', AdminValidationMiddleware, searchController.searchCandidatesByName);



module.exports = router;
