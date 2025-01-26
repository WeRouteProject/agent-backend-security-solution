//Handles alert-related actions
// controllers/alertController.js
const Alert = require('../models/alertModel');
const alertService = require('../services/alertService');

const getAlerts = async (req, res) => {
    try {
        console.log('Fetching alerts...');
        const alerts = await Alert.findAll({
            order: [['created_at', 'DESC']]
        });
        console.log('Found alerts:', alerts);
        res.json({
            success: true,
            data: alerts
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getAlertById = async (req, res) => {
    try {
        const alert = await Alert.findByPk(req.params.id);
        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }
        res.json({
            success: true,
            data: alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateAlertStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const alert = await Alert.findByPk(req.params.id);
        
        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }

        const validStatuses = ['new', 'acknowledged', 'resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        await alert.update({
            status,
            details: {
                ...alert.details,
                notes,
                status_updated_at: new Date()
            }
        });

        res.json({
            success: true,
            data: alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getAlertsBySeverity = async (req, res) => {
    try {
        const { severity } = req.params;
        const validSeverities = ['low', 'medium', 'high', 'critical'];
        
        if (!validSeverities.includes(severity)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid severity level'
            });
        }

        const alerts = await Alert.findAll({
            where: { severity },
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getAlerts,
    getAlertById,
    updateAlertStatus,
    getAlertsBySeverity
};