// Shared schema for policies
const { DataTypes, INTEGER } = require('sequelize');
const sequelize = require('../config/db');

const Policy = sequelize.define('Policy', {

    policyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        description: 'Policy name (e.g., "Credit Card Detection")',
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false,
        description: 'regex, fileExtension'
    },

    rules: {
        type: DataTypes.JSON,
        allowNull: false,
        description: 'Stores the rules (e.g., regex patterns, thresholds)',
    },

    action: {
        type: DataTypes.STRING,
        allowNull: false,
        description: 'alert, block'
    },

    feature: {
        type: DataTypes.STRING,
        allowNull: false,
        description: 'Feature associated with the policy',
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        description: 'Policy created at what time'
    },

}, {
    tableName: 'policies',
    timeStamps: false,
});

module.exports = Policy;