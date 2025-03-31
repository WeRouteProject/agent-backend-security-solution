//DLP-specific endpoints
// routes/dlpRoutes.js
const express = require('express');
const router = express.Router();
const dlpController = require('../controllers/dlpController');

router.get('/policies', dlpController.getDlpPolicies);
router.get('/emailPolicy', dlpController.getEmailPolicies);
// Add more DLP-specific routes

module.exports = router;