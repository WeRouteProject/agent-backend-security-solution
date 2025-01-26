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
