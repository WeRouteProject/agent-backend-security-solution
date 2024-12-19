// Schema for reports
// src/models/report.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Your database connection

const Report = sequelize.define('Report', {
    reportId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'reportid' // Matching PostgreSQL column name
    },
    feature: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false
    },
    generatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'generated_at'
    }
}, {
    tableName: 'reports',
    timestamps: false
});

module.exports = Report;