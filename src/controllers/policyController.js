//Manages policy CRUD operations
// controllers/policyController.js
const policyService = require('../services/policyService');

// Create new policy
const createPolicy = async (req, res) => {
   try {
       const policy = await policyService.create(req.body);
       res.status(201).json({
           success: true,
           data: policy
       });
   } catch (error) {
       console.error('Policy creation failed:', error);
       res.status(400).json({
           success: false,
           error: error.message
       });
   }
};

// Get all policies
const getAllPolicies = async (req, res) => {
   try {
       const policies = await policyService.getAll();
       res.json({
           success: true,
           data: policies
       });
   } catch (error) {
       console.error('Fetch policies failed:', error);
       res.status(500).json({
           success: false,
           error: error.message
       });
   }
};

// Get policy by ID
const getPolicyById = async (req, res) => {
   try {
       const policy = await policyService.getById(req.params.id);
       res.json({
           success: true,
           data: policy
       });
   } catch (error) {
       console.error('Fetch policy failed:', error);
       res.status(404).json({
           success: false,
           error: error.message
       });
   }
};

// Update policy
const updatePolicy = async (req, res) => {
   try {
       const updatedPolicy = await policyService.update(req.params.id, req.body);
       res.json({
           success: true,
           data: updatedPolicy
       });
   } catch (error) {
       console.error('Policy update failed:', error);
       res.status(400).json({
           success: false,
           error: error.message
       });
   }
};

// Delete policy
const deletePolicy = async (req, res) => {
   try {
       await policyService.remove(req.params.id);
       res.json({
           success: true,
           message: 'Policy deleted successfully'
       });
   } catch (error) {
       console.error('Policy deletion failed:', error);
       res.status(400).json({
           success: false,
           error: error.message
       });
   }
};

module.exports = {
   createPolicy,
   getAllPolicies,
   getPolicyById,
   updatePolicy,
   deletePolicy
};