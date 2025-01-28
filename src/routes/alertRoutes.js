//Alert management endpoints
// routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/severity/:level', alertController.getAlertsBySeverity);
router.get('/', alertController.getAlerts);
router.get('/:id', alertController.getAlertById);
router.put('/:id/status', alertController.updateAlertStatus);

module.exports = router;
