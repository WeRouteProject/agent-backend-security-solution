// Schema for reports
// src/models/report.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Your database connection

const Report = sequelize.define('Report', {
    report_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    feature: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            isIn: [['DLP', 'EDR', 'UEBA', 'UBA']]
        }
    },
    data: { 
        type: DataTypes.JSONB, 
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    generated_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
},
 {
    tableName: 'reports',
    timestamps: false,
    indexes: [
        { fields: ['feature', 'generated_at'], name: 'idx_report_feature_date' }
    ]
});

module.exports = Report;