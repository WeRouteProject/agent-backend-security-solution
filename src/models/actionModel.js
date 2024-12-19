//Shared schema for all actions
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Action = sequelize.define('Action', {
    actionId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    agentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'agents',
            key: 'agentId'
        },
        onDelete: 'CASCADE',
    },
    feature: {
        type: DataTypes.STRING,
        allowNull: false,
        description: 'e.g., DLP, EDR',
    },
    actionType: {
        type: DataTypes.STRING,
        allowNull: false,
        description: 'e.g., blockFile, terminateProcess',
    },
    details: {
        type: DataTypes.JSON,
        allowNull: false,
        description: 'Action-specific details (e.g., file name, process name)',
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
        description: 'Action time stamp',
    },
},
    {
        tableName: 'actions',
        timestamps: false
    });

module.exports = Action;