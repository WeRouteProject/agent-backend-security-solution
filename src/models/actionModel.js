//Shared schema for all actions
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Action = sequelize.define('Action', {
    action_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'agents',
            key: 'agent_id'
        },
    },
    feature: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['DLP', 'EDR', 'UEBA', 'UBA']]
        }
    },
    action_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['blockFile', 'terminateProcess', 'quarantine']]
        },
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: false,
        description: 'Action-specific details (e.g., file name, process name)',
    },
    status: { 
        type: DataTypes.STRING, 
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'completed', 'failed']]
        }
    },
    executed_at: { 
        type: DataTypes.DATE 
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
    {
        tableName: 'actions',
        timestamps: false,
        indexes: [
            {
                fields: ['agent_id'],
                name: 'idx_agent_actions'
            }
           ] 
    });

module.exports = Action;