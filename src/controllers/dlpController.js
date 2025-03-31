//Handles DLP-specific routes
const Policy = require('../models/policyModel');

const getDlpPolicies = async (req, res) => {
    try {
        const policies = await Policy.findAll({
            where: { feature: 'DLP' }
        });
        
        res.json({
            success: true,
            data: policies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getEmailPolicies = async (req, res) => {
    try {
        const policies = await Policy.findAll({
            where: {
                feature: 'DLP'
            }
        });
        
        // Filter to get only email-related policies
        const emailPolicies = policies.filter(policy => {
            if (!policy.rules || typeof policy.rules !== 'object') return false;
            
            const rules = policy.rules;
            return (rules.blocked_domains && Array.isArray(rules.blocked_domains)) || 
                   (rules.restricted_recipients && Array.isArray(rules.restricted_recipients)) || 
                   (rules.subject_keywords && Array.isArray(rules.subject_keywords)) || 
                   (rules.attachment_types && Array.isArray(rules.attachment_types));
        });
        
        res.json({
            success: true,
            data: emailPolicies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getDlpPolicies,
    getEmailPolicies
};