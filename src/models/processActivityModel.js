// models/processActivityModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Log = require('./logModel');

const ProcessActivity = sequelize.define('ProcessActivity', {
    process_activity_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    log_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'logs',
            key: 'log_id',
        },
        onDelete: 'CASCADE',
    },
    process_id: { type: DataTypes.STRING },
    process_name: { type: DataTypes.STRING },
    process_path: { type: DataTypes.TEXT },
    command_line: { type: DataTypes.TEXT },
    parent_process_id: { type: DataTypes.STRING },
    parent_process_name: { type: DataTypes.STRING },
    user_id: { type: DataTypes.STRING }
}, {
    tableName: 'process_activities',
    timestamps: false,
    indexes: [
        { fields: ['log_id'], name: 'idx_process_log' }
    ]
});

// Define association
Log.hasOne(ProcessActivity, { foreignKey: 'log_id', as: 'processActivity' });
ProcessActivity.belongsTo(Log, { foreignKey: 'log_id' });

module.exports = ProcessActivity;