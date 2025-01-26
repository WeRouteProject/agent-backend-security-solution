//Shared logic for alert generation
// services/alertService.js
// services/alertService.js
const Alert = require('../models/alertModel');

const create = async (alertData) => {
    try {
        // Validate required fields
        if (!alertData.log_id || !alertData.policy_id || !alertData.severity) {
            throw new Error('Missing required fields for alert creation');
        }

        // Validate severity
        const validSeverities = ['low', 'medium', 'high', 'critical'];
        if (!validSeverities.includes(alertData.severity)) {
            throw new Error('Invalid severity level');
        }

        const alert = await Alert.create({
            log_id: alertData.log_id,
            policy_id: alertData.policy_id,
            severity: alertData.severity,
            status: alertData.status || 'new',
            details: alertData.details || {}
        });

        // Could add notification logic here
        // Example: Send email, Slack notification, etc.

        return alert;
    } catch (error) {
        console.error('Alert creation failed:', error);
        throw error;
    }
};

module.exports = { create };