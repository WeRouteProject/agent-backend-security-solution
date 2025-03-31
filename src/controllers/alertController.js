//Handles alert-related actions
// controllers/alertController.js
const Alert = require('../models/alertModel');
const alertService = require('../services/alertService');

const getAlerts = async (req, res) => {
    try {
        const { timeRange, agentId, policyId } = req.query;
        let query = {
            order: [['created_at', 'DESC']]
        };

        if (timeRange) {
            query.where = {
                created_at: {
                    [Op.gte]: new Date(Date.now() - timeRange)
                }
            };
        }
        if (agentId) query.where = { ...query.where, agent_id: agentId };
        if (policyId) query.where = { ...query.where, policy_id: policyId };

        const alerts = await Alert.findAll(query);
        res.json({ success: true, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
        const updatedAlert = await alertService.updateStatus(req.params.id, {
            status,
            notes,
            updated_by: req.user?.id || 'system'
        });
        res.json({ success: true, data: updatedAlert });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Add timeRangeStart and timeRangeEnd filters
const getAlertsBySeverity = async (req, res) => {
    try {
        const { level } = req.params;
        const { timeRangeStart, timeRangeEnd } = req.query;
        
        const query = {
            where: { severity: level },
            order: [['created_at', 'DESC']]
        };

        if (timeRangeStart && timeRangeEnd) {
            query.where.created_at = {
                [Op.between]: [new Date(timeRangeStart), new Date(timeRangeEnd)]
            };
        }

        const alerts = await Alert.findAll(query);
        res.json({ success: true, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAlerts,
    getAlertById,
    updateAlertStatus,
    getAlertsBySeverity
};