//Policy CRUD endpoints
// routes/policyRoutes.js
const express = require('express');
const router = express.Router();
const validateRequest = require('../middlewares/validateRequest');
const policyController = require('../controllers/policyController');

// Create policy
router.post(
   '/create', 
   policyController.createPolicy
);

// Get all policies
router.get(
   '/', 
   policyController.getAllPolicies
);

// Get policy by ID 
router.get(
   '/:id', 
   policyController.getPolicyById
);

// Update policy
router.put(
   '/:id', 
   policyController.updatePolicy
);

// Delete policy
router.delete(
   '/:id', 
   policyController.deletePolicy
);

module.exports = router;