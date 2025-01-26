//Alert management endpoints
// routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAlerts);
router.get('/:id', alertController.getAlertById);
router.put('/:id/status', alertController.updateAlertStatus);
router.get('/severity/:level', alertController.getAlertsBySeverity);

module.exports = router;
