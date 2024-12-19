// Shared schema for logs

const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Log = sequelize.define('Log', {
    logId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'agents',
            key: 'agentId',
        },
        onDelete: 'CASCADE',
    },
    eventType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['fileAccess', 'processExecution', 'networkActivity']],
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
    details: {
        type: DataTypes.JSON,
        allowNull: false,
        description: 'Event-spevific details stored in JSON format',
    },
},
{
   tableName: 'logs',
   timeStamps: false,
});

module.exports = Log;