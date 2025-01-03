// Shared schema for logs

const {DataTypes} = require('sequelize');
const { sequelize } = require('../config/db');

const Log = sequelize.define('Log', {
    log_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    timestamp: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'agents',
            key: 'agent_id',
        },
        onDelete: 'CASCADE',
    },
    event_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['fileAccess', 'processExecution', 'networkActivity', 'statusUpdate']],
        },
        description: 'Type of log event',
    },
    feature: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['DLP', 'EDR', 'UEBA', 'UBA']],
        },
        description: 'Feature generating the log',
    },
    user_id: { 
        type: DataTypes.STRING 
    },
    process_id: { 
        type: DataTypes.STRING 
    },
    process_name: { 
        type: DataTypes.STRING 
    },
    process_path: { 
        type: DataTypes.TEXT 
    },
    file_name: { type: DataTypes.STRING },
    file_path: { type: DataTypes.TEXT },
    file_hash: { type: DataTypes.STRING },
    src_ip: { 
        type: DataTypes.STRING,
        validate: {
            isIP: true,
          },
    },
    src_port: { 
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 65535
        }
    },
    dest_ip: { 
        type: DataTypes.STRING,
        validate: {
            isIP: true,
          },
    },
    dest_port: {
         type: DataTypes.INTEGER,
         validate: {
            min: 0,
            max: 65535
        }
        },
    protocol: { 
        type: DataTypes.STRING,
        validate: {
            isIn: [['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP']]
        }
    },
    alert_level: { 
        type: DataTypes.STRING,
        validate: {
            isIn: [['low', 'medium', 'high', 'critical']]
        }
    },
    metadata: { type: DataTypes.JSONB },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
},
{
   tableName: 'logs',
   timestamps: false,
   indexes: [
    { fields: ['agent_id'], name: 'idx_log_agent' },
    { fields: ['timestamp'], name: 'idx_log_timestamp' },
    { fields: ['event_type', 'feature'], name: 'idx_log_event_feature' }
]
});

module.exports = Log;