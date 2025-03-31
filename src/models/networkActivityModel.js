// models/networkActivityModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Log = require('./logModel');

const NetworkActivity = sequelize.define('NetworkActivity', {
    network_activity_id: {
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
    src_ip: { type: DataTypes.STRING },
    src_port: { type: DataTypes.INTEGER },
    dest_ip: { type: DataTypes.STRING },
    dest_port: { type: DataTypes.INTEGER },
    protocol: { type: DataTypes.STRING },
    bytes_sent: { type: DataTypes.INTEGER },
    bytes_received: { type: DataTypes.INTEGER },
    connection_status: { type: DataTypes.STRING }
}, {
    tableName: 'network_activities',
    timestamps: false,
    indexes: [
        { fields: ['log_id'], name: 'idx_network_log' }
    ]
});

// Define association
Log.hasOne(NetworkActivity, { foreignKey: 'log_id', as: 'networkActivity' });
NetworkActivity.belongsTo(Log, { foreignKey: 'log_id' });

module.exports = NetworkActivity;