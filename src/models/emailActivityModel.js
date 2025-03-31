// models/emailActivityModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Log = require('./logModel');

const EmailActivity = sequelize.define('EmailActivity', {
    email_activity_id: {
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
    email_sender: { type: DataTypes.STRING },
    email_recipients: { type: DataTypes.JSONB },
    email_subject: { type: DataTypes.STRING },
    email_content: { type: DataTypes.TEXT },
    has_attachments: { type: DataTypes.BOOLEAN },
    attachment_names: { type: DataTypes.JSONB },
    attachment_count: { type: DataTypes.INTEGER }
}, {
    tableName: 'email_activities',
    timestamps: false,
    indexes: [
        { fields: ['log_id'], name: 'idx_email_log' }
    ]
});

// Define association
Log.hasOne(EmailActivity, { foreignKey: 'log_id', as: 'emailActivity' });
EmailActivity.belongsTo(Log, { foreignKey: 'log_id' });

module.exports = EmailActivity;