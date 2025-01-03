//Log ingestion endpoints
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const validateRequest = require('../middlewares/validateRequest');
const { validateLogIngestion } = require('../validator/logValidator');

router.post('/ingest', validateRequest(validateLogIngestion), logController.ingestLogs);
module.exports = router;