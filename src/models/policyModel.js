// Shared schema for policies
const { DataTypes, INTEGER } = require('sequelize');
const { sequelize }= require('../config/db');

const Policy = sequelize.define('Policy', {

    policy_id: {
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

    feature: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['DLP', 'EDR', 'UEBA', 'UBA']]
        },
        description: 'Feature associated with the policy',
    },

    description: {
        type: DataTypes.TEXT
    },

    rules: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
            isValidRules(value) {
                // validation logic for rules structure
                if (!value || typeof value !== 'object') {
                    throw new Error('Invalid rules format');
                }
            }
        }
    },

    action: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['alert', 'block', 'quarantine']]
        }
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        description: 'Policy created at what time'
    },

}, {
    tableName: 'policies',
    timestamps: false,
    indexes: [
        { fields: ['feature'], name: 'idx_policy_feature' }
    ]
});

module.exports = Policy;