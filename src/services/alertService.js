//Shared logic for alert generation
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
            status: 'new',
            status_history: [{
                status: 'new',
                timestamp: new Date(),
                user: alertData.created_by || 'system'
            }],
            details: {
                violation_type: alertData.details.violation_type,
                resource_info: {
                    device_name: alertData.details.device_name,
                    location: alertData.details.location,
                    organization: alertData.details.organization
                },
                additional_info: alertData.details.additional_info || {}
            }
        });

        // Could add notification logic here
        // Example: Send email, Slack notification, etc.
        await sendNotification(alert);
        return alert;
    } catch (error) {
        console.error('Alert creation failed:', error);
        throw error;
    }
};

const updateStatus = async (alertId, { status, notes, updated_by }) => {
    const alert = await Alert.findByPk(alertId);
    if (!alert) throw new Error('Alert not found');

    const statusFields = {
        acknowledged: 'acknowledged_at',
        resolved: 'resolved_at',
        closed: 'closed_at'
    };

    const updateData = {
        status,
        [statusFields[status]]: new Date(),
        status_history: [
            ...alert.status_history,
            {
                status,
                timestamp: new Date(),
                user: updated_by,
                notes
            }
        ]
    };

    return alert.update(updateData);
};

const sendNotification = async (alert) => {
    // Notification logic placeholder
    console.log('Alert notification sent:', alert.alert_id);
};

module.exports = { create, updateStatus };