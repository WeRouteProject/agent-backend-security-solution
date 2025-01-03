const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const agentValidator = require('../validator/agentValidator');
const validateRequest = require('../middlewares/validateRequest');

// Route to register a new agent
router.post('/register', validateRequest(agentValidator), agentController.registerAgentController);
router.put('/updateAgentStatus/:id/status', agentController.updateAgentStatus);

module.exports = router;