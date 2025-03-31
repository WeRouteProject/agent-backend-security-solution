//Shared schema for all alerts
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Alert = sequelize.define('Alert', {
    alert_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    log_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: 
        { 
            model: 'logs', 
            key: 'log_id' 
        } 
    },
    policy_id: { 
        type: DataTypes.INTEGER, 
        references: 
        { 
            model: 'policies', 
            key: 'policy_id' 
        } 
    },
    agent_id: { 
        type: DataTypes.INTEGER, 
        references: 
        { 
            model: 'agents', 
            key: 'agent_id' 
        } 
    },
    severity: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            isIn: [['low', 'medium', 'high', 'critical']]
        }
    },
    status: { 
        type: DataTypes.STRING, 
        defaultValue: 'new',
        validate: {
            isIn: [['new', 'acknowledged', 'resolved', 'closed']]
        }
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        validate: {
            isValidDetails(value) {
                const requiredFields = ['violation_type', 'resource_info'];
                if (!value || !requiredFields.every(field => value.hasOwnProperty(field))) {
                    throw new Error('Missing required detail fields');
                }
            }
        }
    },
    status_history: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false
    },
    acknowledged_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resolved_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    closed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
},
{
    tableName: 'alerts',
    timestamps: false,
    indexes: [
        {
            fields: ['agent_id'],
            name: 'idx_alert_agent'
        },
        {
            fields: ['severity', 'status'],
            name: 'idx_alert_severity_status'
        }
    ]
 });

module.exports = Alert;
