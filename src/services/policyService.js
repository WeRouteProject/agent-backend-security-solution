//Shared logic for policy management
const Policy = require('../models/policyModel');

const validatePolicyRules = (feature, rules) => {
    if (!rules || typeof rules !== 'object') {
        throw new Error('Rules must be a valid object');
    }

    switch (feature) {
        case 'DLP':
            if (!rules.patterns || !Array.isArray(rules.patterns)) {
                throw new Error('DLP rules must contain patterns array');
            }
            // Validate regex patterns
            rules.patterns.forEach(pattern => {
                try {
                    new RegExp(pattern);
                } catch(e) {
                    throw new Error(`Invalid regex pattern: ${pattern}`);
                }
            });
            break;

        case 'EDR':
            if (!rules.process_names && !rules.network_rules) {
                throw new Error('EDR rules must contain either process_names or network_rules');
            }
            break;

        case 'UEBA':
        case 'UBA':
            if (!rules.threshold || typeof rules.threshold !== 'object') {
                throw new Error(`${feature} rules must contain threshold object`);
            }
            break;
    }
};

const create = async (policyData) => {
    try {
        // Basic validation
        if (!policyData.name || !policyData.feature || !policyData.rules || !policyData.action) {
            throw new Error('Missing required fields');
        }

        // Check for duplicate policy name
        const existingPolicy = await Policy.findOne({ 
            where: { name: policyData.name } 
        });
        if (existingPolicy) {
            throw new Error('Policy with this name already exists');
        }

        // Validate rules based on feature
        validatePolicyRules(policyData.feature, policyData.rules);

        const policy = await Policy.create(policyData);
        return policy;
    } catch (error) {
        throw error;
    }
};

const getAll = async () => {
    try {
        return await Policy.findAll();
    } catch (error) {
        throw new Error('Failed to fetch policies');
    }
};

const getById = async (id) => {
    try {
        const policy = await Policy.findByPk(id);
        if (!policy) throw new Error('Policy not found');
        return policy;
    } catch (error) {
        throw error;
    }
};

const update = async (id, policyData) => {
    try {
        const policy = await Policy.findByPk(id);
        if (!policy) throw new Error('Policy not found');

        // If updating name, check for duplicates
        if (policyData.name && policyData.name !== policy.name) {
            const existingPolicy = await Policy.findOne({ 
                where: { name: policyData.name } 
            });
            if (existingPolicy) {
                throw new Error('Policy with this name already exists');
            }
        }

        // If updating rules, validate them
        if (policyData.rules) {
            validatePolicyRules(
                policyData.feature || policy.feature, 
                policyData.rules
            );
        }

        await policy.update(policyData);
        return policy;
    } catch (error) {
        throw error;
    }
};

const remove = async (id) => {
    try {
        const policy = await Policy.findByPk(id);
        if (!policy) throw new Error('Policy not found');
        await policy.destroy();
        return { message: 'Policy deleted successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};